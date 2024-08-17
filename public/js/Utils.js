
// Constants
window.BASE_URL = "http://localhost:3000";
window.CONVERT_MB = 1024;
window.SECONDS_IN_AN_HOUR = 3600000;
window.TWO = 2;
window.HUNDRED = 100;
window.INVALID_EMAIL = "Invalid email address";
window.INCORRECT_PASSWORD_FORMAT = "Password should have a minimum of 8 characters and one special character";
const STATUS_RESPONSE_FOUR_ZERO_EIGHT = 408;
const STATUS_RESPONSE_FOUR_HUNDRED = 400;
const STATUS_RESPONSE_FOUR_ZERO_FOUR = 404;
const STATUS_RESPONSE_FIVE_HUNDRED = 500;
const STATUS_RESPONSE_SERVICE_UNAVAILABLE = 503;
const PASSWORD_LENGTH = 8;

// Utility functions
var utils = {
    /**
     * Function to make API calls using the fetch library
     * @param {string} method Request method type
     * @param {string} endpoint URL endpoint for sending request
     * @param {object|string} data Data for request body
     * @param {function} successFunction Success handler for the request
     * @param {function} failFunction Error handler for the request
     */
    CallAjax : async function (method, endpoint, data, successFunction, failFunction) {
        await fetch(window.BASE_URL + endpoint, {
            method : method,
            body : method === "GET" ? null : JSON.stringify(data),
            headers : { "Content-Type" : "application/json" }
        })
            .then(async (response) => {
                let object = {
                    ok : response.ok,
                    status : response.status,
                    statusText : response.statusText
                };

                if (method != "PUT") {
                    let json = await response.json();
                    object.json = json;
                }

                return object;
            })
            .then(function (response) {
                if (response.ok) {
                    successFunction(response);
                } else {
                    let messageText =
                        response.status === STATUS_RESPONSE_FOUR_ZERO_EIGHT ? window.PROCESSING_TIMEOUT_MESSAGE : "";
                    messageText += response.json?.message ? response.json.message : "";
                    if (
                        response.status === STATUS_RESPONSE_FOUR_HUNDRED ||
                        response.status === STATUS_RESPONSE_FOUR_ZERO_FOUR ||
                        response.status === STATUS_RESPONSE_FIVE_HUNDRED ||
                        response.status === STATUS_RESPONSE_SERVICE_UNAVAILABLE
                    ) {
                        utils.MessageBox(response.status, response.message);
                    } else if (response.status === STATUS_RESPONSE_FOUR_ZERO_EIGHT) {
                        utils.MessageBox(messageText);
                    } else {
                        utils.MessageBox(messageText);
                    }
                }
            })
            .catch(function (error) {
                failFunction(error);
            });
    },

    /**
     * Function to display Message box with suitable message
     * @param {string} msgContent - Message content
     */
    MessageBox : function (msgContent = "") {
        document.getElementById("message-box-content").innerHTML = msgContent;

        // Display the modal
        document.getElementById("message-box-modal").style.display = "block";
    },

    /**
     * Function to close the message box modal
     */
    CloseMessageBox : function () {
        // Hide the modal
        document.getElementById("message-box-modal").style.display = "none";
    },

    /**
     * Validation function for password format
     * @param {string} password - The password to validate
     * @returns {boolean} - True if the password meets criteria, false otherwise
     */
    PasswordValidation : function (password) {
        // Minimum password length of 8 characters
        const lengthRequirement = password.length >= PASSWORD_LENGTH;

        // At least one uppercase letter
        const uppercaseRequirement = /[A-Z]/.test(password);

        // At least one special character (non-alphanumeric)
        const specialCharacterRequirement = /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(password);

        // Return true only if all requirements are met
        return lengthRequirement && uppercaseRequirement && specialCharacterRequirement;
    },

    /**
     * Validation function for email format
     * @param {string} email - The email to validate
     * @returns {boolean} - True if the email meets criteria, false otherwise
     */
    EmailValidation : function (email) {
        // Regular expression for email validation with ".com" or ".in" at the end
        return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[a-zA-Z]{2,}){1,2}$/.test(email);
    }
}
