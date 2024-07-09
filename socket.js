const socketIo = require('socket.io');
let io;
const TaskModel = require('./models/taskModel')
const setupSocketIo = (server) => {
    io = socketIo(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
    io.on('connection', (socket) => {
        socket.on('joinProject', (projectId) => {
            socket.join(projectId.projectId.toString());
            console.log(`User joined project room: ${projectId.projectId}`);
        });

        // Listen for task updates from the client
        socket.on('updateTaskStatus', async (updateData) => {
            try {
                console.log(updateData)
                const updatedTask = await TaskModel.findByIdAndUpdate(updateData.taskId, updateData.status, { new: true }).populate('createdBy lastModifiedBy assignedTo projectId');
                io.to(updateData.projectId).emit('taskUpdated', updatedTask);  // Broadcast updated task to the specific project room
            } catch (error) {
                console.error(error);
                socket.emit('error', 'Failed to update task');
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};

module.exports = { setupSocketIo, getIo: () => io };
