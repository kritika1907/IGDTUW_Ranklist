let login = require("../data_access/database/Login");
let bcrypt = require('bcrypt');

module.exports = {
    /**
     * Validates user credentials, compares hashed passwords, and returns login status.
     *
     * @param {string} email - User email.
     * @param {string} password - User password.
     * @returns {Object} - Login status (success, message).
     */
    LoginUser : async (email, password) => {
        global.log("info", global.messages.METHOD_LOG_IN);
        try {
            // Retrieve hashed password from the database
            let result = await login.GetPassword(email);
            if (result && result.rowCount > global.constants.ZERO) {
                let hashedPassword = Object.values(result.rows[global.constants.ZERO])[global.constants.ZERO];

                if (hashedPassword == null) {
                    global.log("info", global.messages.METHOD_LOG_OUT);
                    return { success : false, message : global.messages.USER_DOESNOT_EXSISTS };
                } else {
                    // Compare the entered password with the hashed password
                    let isPasswordCorrect = await bcrypt.compare(password, hashedPassword);

                    if (isPasswordCorrect) {
                        global.log("info", global.messages.METHOD_LOG_OUT);
                        return { success : true, message : global.messages.LOGIN_SUCCESSFUL };
                    } else {
                        global.log("info", global.messages.METHOD_LOG_OUT);
                        return { success : false, message : global.messages.INVALID_PASSWORD };
                    }
                }
            } else if (result.rowCount == global.constants.ZERO) {
                return { success : false, message : global.messages.USER_DOESNOT_EXSISTS };
            }
            return result;
        } catch (error) {
            global.log("error", error.message);
            return { success : false, message : `${error.message}` };
        }
    }
};
