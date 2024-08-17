let fs = require("fs");
let propertiesReader = require("properties-reader");
let fileName = "AppConfig.properties";
let targetPath = global.path.resolve(global.appBasePath, fileName);

/**
 * @exports utils/AppConfigReader
 */
let appConfig = {
    /**
     * Begins AppConfig.properties file processing.
     * @function Init
     * @returns {Promise} - Resolves in case of success; rejects with an error message in case of an error.
     */
    Init : () => {
        return new Promise((resolve, reject) => {
            appConfig
                .CheckExistence()
                .then(() => {
                    appConfig.Read();
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },

    /**
     * Checks the existence of AppConfig.properties file.
     * @function CheckExistence
     * @returns {Promise} - Resolves with true in case of success; rejects with an error message in case of an error.
     */
    CheckExistence : () => {
        return new Promise((resolve, reject) => {
            if (!fs.existsSync(targetPath)) {
                // Reject promise if AppConfig.Properties is NOT at the base directory level. Do NOT copy from the config folder.
                reject({
                    message : global.messages.APP_CONFIG_PROPERTIES_NOT_FOUND_AT_SOURCE_DIRECTORY,
                });
            } else {
                resolve(true);
            }
        });
    },

    /**
     * Reads AppConfig.properties file and sets values in AppConfig.js.
     * @function Read
     * @returns {Promise} - Resolves with true in case of success; rejects with an error message in case of an error.
     */
    Read : () => {
        return new Promise((resolve, reject) => {
            try {
                let properties = propertiesReader(targetPath);

                for (let [key, value] of Object.entries(properties._properties)) {
                    SetValues(key, value);
                }

                resolve(true);
            } catch (err) {
                global.log(
                    "error",
                    global.messages.INTERNAL_PROCESSING + ";" + err.message
                );
                reject(new Error(global.messages.CANNOT_READ_PROPERTIES_FILE));
            }
        });
    },
};

module.exports = appConfig;

/**
 * Sets values read from keys in AppConfig.properties into keys in AppConfig.js.
 * @function SetValues
 * @param {string} key - The key from AppConfig.properties.
 * @param {string} value - The value from AppConfig.properties.
 */
function SetValues(key, value) {
    switch (key.trim()) {
        case "server.ip":
            global.appConfig.SERVER_IP = CheckIsNullOrEmpty(
                global.appConfig.SERVER_IP,
                value
            );
            break;
        case "server.port":
            global.appConfig.SERVER_PORT = parseInt(
                CheckIsNullOrEmpty(global.appConfig.SERVER_PORT, value)
            );
            break;
        case "server.mode.production":
            global.appConfig.SERVER_MODE_PRODUCTION = parseInt(
                CheckIsNullOrEmpty(global.appConfig.SERVER_MODE_PRODUCTION, value)
            );
            break;
        case "log.file.max.size":
            global.appConfig.LOG_FILE_MAX_SIZE = parseInt(
                CheckIsNullOrEmpty(global.appConfig.LOG_FILE_MAX_SIZE, value)
            );
            break;
        case "log.file.archive":
            global.appConfig.LOG_FILE_ARCHIVE = parseInt(
                CheckIsNullOrEmpty(global.appConfig.LOG_FILE_ARCHIVE, value)
            );
            break;

        case "postgres.main.host":
            global.appConfig.POSTGRES.MAIN.HOST = CheckIsNullOrEmpty(
                global.appConfig.POSTGRES.MAIN.HOST,
                value
            );
            break;
        case "postgres.main.port":
            global.appConfig.POSTGRES.MAIN.PORT = parseInt(
                CheckIsNullOrEmpty(global.appConfig.POSTGRES.MAIN.PORT, value)
            );
            break;
        case "postgres.main.database":
            global.appConfig.POSTGRES.MAIN.DATABASE = CheckIsNullOrEmpty(
                global.appConfig.POSTGRES.MAIN.DATABASE,
                value
            );
            break;
        case "postgres.main.user":
            global.appConfig.POSTGRES.MAIN.USER = CheckIsNullOrEmpty(
                global.appConfig.POSTGRES.MAIN.USER,
                value
            );
            break;
        case "postgres.main.password":
            global.appConfig.POSTGRES.MAIN.PASSWORD = CheckIsNullOrEmpty(
                global.appConfig.POSTGRES.MAIN.PASSWORD,
                value
            );
            break;
        case "postgres.main.ssl":
            global.appConfig.POSTGRES.MAIN.SSL = CheckIsNullOrEmpty(
                global.appConfig.POSTGRES.MAIN.SSL,
                value
            );
            break;
        case "postgres.main.binary":
            global.appConfig.POSTGRES.MAIN.BINARY = CheckIsNullOrEmpty(
                global.appConfig.POSTGRES.MAIN.BINARY,
                value
            );
            break;
        case "postgres.main.client.encoding":
            global.appConfig.POSTGRES.MAIN.CLIENT_ENCODING = CheckIsNullOrEmpty(
                global.appConfig.POSTGRES.MAIN.CLIENT_ENCODING,
                value
            );
            break;
        case "postgres.main.connection.timeout.millis":
            global.appConfig.POSTGRES.MAIN.CONNECTION_TIMEOUT_MILLIS = parseInt(
                CheckIsNullOrEmpty(
                    global.appConfig.POSTGRES.MAIN.CONNECTION_TIMEOUT_MILLIS,
                    value
                )
            );
            break;
        case "postgres.main.idle.timeout.millis":
            global.appConfig.POSTGRES.MAIN.IDLE_TIMEOUT_MILLIS = parseInt(
                CheckIsNullOrEmpty(
                    global.appConfig.POSTGRES.MAIN.IDLE_TIMEOUT_MILLIS,
                    value
                )
            );
            break;
        case "postgres.main.max":
            global.appConfig.POSTGRES.MAIN.MAX = parseInt(
                CheckIsNullOrEmpty(global.appConfig.POSTGRES.MAIN.MAX, value)
            );
            break;
        case "postgres.main.query.timeout":
            global.appConfig.POSTGRES.MAIN.QUERY_TIMEOUT = parseInt(
                CheckIsNullOrEmpty(global.appConfig.POSTGRES.MAIN.QUERY_TIMEOUT, value)
            );
            break;
        case "postgres.main.keep.alive":
            global.appConfig.POSTGRES.MAIN.KEEP_ALIVE = CheckIsNullOrEmpty(
                global.appConfig.POSTGRES.MAIN.KEEP_ALIVE,
                value
            );
            break;
        case "postgres.main.allow.exit.on.idle":
            global.appConfig.POSTGRES.MAIN.ALLOW_EXIT_ON_IDLE = CheckIsNullOrEmpty(
                global.appConfig.POSTGRES.MAIN.ALLOW_EXIT_ON_IDLE,
                value
            );
            break;
    }
}

/**
 * Checks if the updated values corresponding to the keys are not null or empty.
 * @function CheckIsNullOrEmpty
 * @param {string} sourceValue - The default value in AppConfig.js file.
 * @param {string} targetValue - The updated value in AppConfig.properties file.
 * @returns {boolean}
 */
function CheckIsNullOrEmpty(sourceValue, targetValue) {
    let returningValue =
        targetValue == null || targetValue === "undefined" || targetValue === ""
            ? sourceValue
            : targetValue;
    return CheckAndParseBool(returningValue);
}

/**
 * Converts a string value to a boolean if valid.
 * @function CheckAndParseBool
 * @param {string} string - The string value to be converted.
 * @returns {boolean|string}
 */
function CheckAndParseBool(string) {
    switch (string.toLowerCase().trim()) {
        case "true":
            return true;
        case "false":
            return false;
        default:
            return string;
    }
}
