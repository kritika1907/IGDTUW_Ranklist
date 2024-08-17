const SALT_ROUNDS = 10;
let signup = require("../data_access/database/Signup");
let bcrypt = require('bcrypt');

module.exports = {
    /**
     * Hashes the password, registers user credentials, and returns registration result.
     * @function RegisterUser
     * @param {string} name - User name.
     * @param {string} email - User email.
     * @param {string} password - User password.
     * @param {string} role - User role.
     * @returns {Object} - Registration result.
     */
    RegisterUser: async (name, email, password, role) => {
        global.log("info", global.messages.METHOD_LOG_IN);
        try {
            // Hash the password using bcrypt
            let hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

            // Register user credentials with hashed password and role
            let result = signup.RegisterUserCredentials(name, email, hashedPassword, role);
            
            global.log("info", global.messages.METHOD_LOG_OUT); 
            return result;
        } catch (error) {
            global.log("error", error);
            return { success: false, message: 'Internal Server Error' };
        }
    }
};