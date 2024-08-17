

let path = require("path");
let winston = require("winston");
require("winston-daily-rotate-file");
let logFileName = "ResourceManagement";
let logFileExtension = ".log";
let logDirectory = global.path.resolve(global.appBasePath, "logs");
let dateFormat = "YYYY-MM-DD";
let logType = "Analysis";
let threadName = "NoName";
let threadNumber = 1;
let increment_value = 1;
let filteredStack;
let loggerFileName = "";
let loggerFunctionName = "";
let loggerLineNumber = "";

// Custom log format
let logFormat = winston.format.combine(
  winston.format.timestamp({
    format : "YYYY-MM-DD HH:mm:ss.SSS"
  }),
  winston.format.printf(
    (info) =>
      `${info.timestamp},${logType},${info.level.toUpperCase()},${loggerFileName},${threadName},${threadNumber},${loggerFunctionName},${loggerLineNumber},${info.message}`
  )
);

// Initializing winston logger options
let transport = new winston.transports.DailyRotateFile({
  filename : "%DATE%-" + logFileName, // File name pattern to be made
  dirname : logDirectory, // Directory to store log files
  datePattern : dateFormat,
  zippedArchive : false, // Option for archiving the log files
  maxSize : global.appConfig.LOG_FILE_MAX_SIZE, // Maximum size for log file partition
  maxFiles : global.appConfig.LOGS_DELETE_LIMIT, // Remove files based on no. of days or no. of files
  extension : logFileExtension,
  handleExceptions : true
});

// Creating logger instance
let logger = winston.createLogger({
  format : logFormat,
  transports : [transport]
});

/**
 * @module utils/WinstonLogger
 */
module.exports = {
  /**
   * Fetches the FileName, FunctionName, and LineNumber corresponding to the callee and logs in the required format.
   * @function Log
   * @param {string} level - error, info, debug
   * @param {string} message
   */
  Log : (level, message) => {
    // Exploring the stack trace for fetching the FileName, FunctionName, and LineNumber
    let orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function (_, stack) {
      return stack;
    };
    let err = new Error();
    // Removing internal functions/files from stack trace as they are not required to be logged
    filteredStack = err.stack.filter(
      (element) =>
        element.getFileName() != null &&
        !(
          element.getFileName().includes("node:internal") &&
          element.getFileName().includes("node_modules")
        )
    );

    let i = 1; // Used to refer to the first index of the filteredStack as the details of the calling function are present on the first index

    Error.prepareStackTrace = orig;
    loggerFileName = path.basename(filteredStack[i].getFileName());
    loggerLineNumber = filteredStack[i].getLineNumber();
    // In some cases, the functionName might be null at the first index of the filteredStack array
    // (in cases where the logging is done inside a Promise function instead of a normal function)
    // So, picking the functionName from the second index in those cases
    loggerFunctionName =
      filteredStack[i].getFunctionName() != null
        ? filteredStack[i].getFunctionName()
        : filteredStack[i + increment_value].getFunctionName();
    message = loggerFunctionName + message;
    // Generating log
    logger.log(level, message);
  }
};
