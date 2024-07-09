exports.createFilter = (query) => {
    const filter = {};

    if (query.taskName) {
        filter.taskName = { $regex: query.taskName, $options: 'i' };
    }
    if (query.description) {
        filter.description = { $regex: query.description, $options: 'i' };
    }
    if (query.assignedTo) {
        filter.assignedTo = query.assignedTo;
    }
    if (query.dueDate) {
        filter.dueDate = new Date(query.dueDate);
    }
    if (query.priority) {
        filter.priority = query.priority;
    }
    if (query.status) {
        filter.status = query.status;
    }
    if (query.projectId) {
        filter.projectId = query.projectId;
    }
    if (query.createdBy) {
        filter.createdBy = query.createdBy;
    }
    if (query.lastModifiedBy) {
        filter.lastModifiedBy = query.lastModifiedBy;
    }

    return filter;
};