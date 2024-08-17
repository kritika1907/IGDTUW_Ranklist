let { GetPostgresClient } = require("./Postgres");
const REGISTER_USER_QUERY = require("../queries/QueryTvfSignup");

module.exports = {
  /**
   * Registers user credentials in the database.
   * @function RegisterUserCredentials
   * @param {string} name - The name of the user.
   * @param {string} email - The email address of the user.
   * @param {string} password - The password of the user.
   * @param {string} role - The role of the user.
   * @returns {Promise<object>} - A promise that resolves to the result of the registration.
   * @throws {Error} - Throws an error if there is an issue with the database connection or query execution.
   */
  RegisterUserCredentials: async (name, email, password, role) => {
    global.log("info", global.messages.METHOD_LOG_IN);
    try {
      // Establish a connection to the PostgreSQL database
      let db = await GetPostgresClient(global.appConfig.POSTGRES.MAIN);

      // Generate the register user query based on the provided credentials and role
      let registerUserQuery = REGISTER_USER_QUERY.RegisterUserQuery(name, email, password, role);

      // Execute the query and retrieve the result
      let result = await db.Execute(registerUserQuery);

      // Check the result to determine if the registration was successful
      if (result && result.rowCount > 0) {
        global.log("info", global.messages.METHOD_LOG_OUT);
        return { success: true, message: global.messages.REGISTRATION_SUCCESSFUL };
      } else {
        global.log("info", global.messages.METHOD_LOG_OUT);
        return { success: false, message: global.messages.REGISTRATION_FAILED };
      }
    } catch (error) {
      // Handle database connection errors or other exceptions
      global.log("error", error.message);

      // Check if the error is a unique constraint violation
      if (error.code === global.constants.RECORD_EXISTS_ERROR_CODE) {
        return { success: false, message: global.messages.USER_ALREADY_EXISTS };
      }

      return { success: false, message: `${error.message}` };
    }
  },
};
