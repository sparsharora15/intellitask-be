const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const morgan = require('morgan');
const port = process.env.PORT || 4000;
app.use(express.json());
app.use(cors());
const { connect } = require("./db");
connect();
const userRoutes = require("./routes/user.routes");
const taskRoutes = require("./routes/tasks.routes");
const projectRoutes = require("./routes/project.routes");
const { setupSocketIo } = require('./socket');
const http = require('http');



// app.use(clerk);
app.use(morgan('dev'));
// app.use(validateToken);
app.use("/api/users", userRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/project", projectRoutes);
const server = http.createServer(app);


setupSocketIo(server);
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});