const RESPONSE_MESSAGES = {
    INTERNAL_SERVER_ERROR: "Internal server error",
    SAVED_SUCCESSFULLY: "Details saved successfully",
    UPDATED_SUCCESSFULLY: "Details updated successfully",
    PROJECT_DELETED: "Project deleted successfully",
    TASK_DELETED: "Task deleted successfully",
    VALIDATION_ERROR: "Please fill the required fields",
    FULL_NAME_REQUIRED: "Full name is required.",
    EMAIL_REQUIRED: "Email is required.",
    PROJECT_ID_REQUIRED: "Project id is required.",
    MISSING_USER_ID: "User ID is required.",
    USER_FOUND: "User found.",
    USER_NOT_FOUND: "User not found.",
    STATUS_NOT_FOUND: "No such status is associated with Project.",
    TASK_NOT_FOUND: "No such task exist.",
    PROJECT_NOT_FOUND: "No such project exist.",
    NO_UNASSIGNED_TASK_FOUND: "No unassigned tasks found for this user.",
    SERVER_ERROR: "An error occurred. Please try again later.",
  };
  
  const STATUS_CODE = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  };
  
  module.exports = { RESPONSE_MESSAGES, STATUS_CODE };
  