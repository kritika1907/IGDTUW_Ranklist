let appConfig = {
  SERVER_IP : "127.0.0.1",
  SERVER_PORT : 3000,
  SERVER_MODE_PRODUCTION : true,
  LOG_FILE_MAX_SIZE : 10000000,
  DATA_PROCESSING_TIMEOUT : 600000,
  LOG_FILE_ARCHIVE : false,
  POSTGRES : {
    MAIN : {
      HOST : "localhost",
      PORT : 5432,
      DATABASE : "Process_Management",
      USER : "postgres",
      PASSWORD : "root",
      SSL : false,
      BINARY : false,
      CLIENT_ENCODING : "UTF8",
      CONNECTION_TIMEOUT_MILLIS : 10000,
      IDLE_TIMEOUT_MILLIS : 30000,
      MAX : 10,
      QUERY_TIMEOUT : 30000,
      KEEP_ALIVE : true,
      ALLOW_EXIT_ON_IDLE : false
    },
  }
};

module.exports = appConfig;
