const FORMAT = require("pg-format");
const DBCONST = require("./query_utils/DbConstants");
const { SELECT_FUNC_WITHOUT_COLUMN_QUERY } = require("./query_utils/SelectFunctionQueryFormat");

/**
 * @module QueryTvfSignup
 * @description Provides utility functions for generating queries related to the Signup API.
 */
module.exports = {
  /**
   * Prepares and returns a query with parameters
   * (Uses a database function with parameters for the status API)
   * @function RegisterUserQuery
   * @param {string} name - The name of the user
   * @param {string} email - The email of the user
   * @param {string} password - The password of the user
   * @param {string} role - The role of the user
   * @returns {string} Prepared query
   */
  RegisterUserQuery: (name, email, password, role) => {
    global.log("info", global.messages.METHOD_LOG_IN);

    let paramStr = `'${name}', '${email}', '${password}', '${role}'`;

    /* Preparing the query */
    // arg1: query format
    // arg2: target fields
    // arg3: prepared parameter string
    let preparedQuery = FORMAT(
      SELECT_FUNC_WITHOUT_COLUMN_QUERY,
      DBCONST.DB_FUNCTION_NAME.REGISTER,
      paramStr
    );

    /* Returning the prepared query */
    global.log("info", global.messages.METHOD_LOG_OUT);
    return preparedQuery;
  }
};