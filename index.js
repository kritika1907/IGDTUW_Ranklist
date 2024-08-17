/**
 * Module dependencies.
 */
global.path = require("path");
global.appBasePath = process.cwd();
global.appConfig = require("./config/AppConfig");
global.log = require("./utils/Logger").Log;
global.messages = require("./message/Messages");
global.constants = require("./config/CommonConstants");
global.utils = require("./utils/Utils");
let appConfigReader = require("./utils/AppConfigReader");

appConfigReader
  .Init()
  .then(() => {
     require("./bin/www");
  })
  .catch((err) => {
    console.log(err)
    global.log("error", err.message);
  });
