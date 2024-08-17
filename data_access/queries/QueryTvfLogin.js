const FORMAT = require("pg-format");
const DBCONST = require("./query_utils/DbConstants");
const { SELECT_FUNC_WITHOUT_COLUMN_QUERY } = require("./query_utils/SelectFunctionQueryFormat");

/**
 * @module QueryTvfLogin
 * @description Provides utility functions for generating queries related to the Login API.
 */
module.exports = {
  /**
   * Prepares and returns a query with parameters for the Login API database function.
   * @function LoginQuery
   * @param {string} email - The email of the user.
   * @returns {string} - Prepared query.
   */
  LoginUserQuery : (email) => {
    global.log("info", global.messages.METHOD_LOG_IN);

    let paramStr = ` '${email}'`;

    /* Preparing the query */
    // arg1: query format
    // arg2: target fields
    // arg3: prepared parameter string
    let preparedQuery = FORMAT(
      SELECT_FUNC_WITHOUT_COLUMN_QUERY,
      DBCONST.DB_FUNCTION_NAME.LOGIN,
      paramStr
    );

    /* Returning the prepared query */
    global.log("info", global.messages.METHOD_LOG_OUT);
    return preparedQuery;
  }
};
