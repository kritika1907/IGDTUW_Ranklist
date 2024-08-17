const LOGIN_SUCCESSFUL = "Login successful";

/**
 * Event listener for when the window has finished loading
 */
window.addEventListener("load", function () {
    // Start the login process when the window has loaded
    login.Start();
});

/**
 * Login object encapsulating login functionality
 */
let login = {
    /**
     * Function to initialize the login process
     */
    Start : function () {
        // Add a submit event listener to the login form
        document.getElementById("login-form").addEventListener("submit", function (event) {
            // Prevent the default form submission behavior
            event.preventDefault();
            // If validation passes, proceed to fetch data from the backend
            if (login.Validate()) {
                login.FetchDataFromBackend();
            }
        });
    },

    /**
     * Function to validate user input before submitting to the backend
     * @returns {boolean} - True if the input is valid, false otherwise
     */
    Validate : function () {
        // Extract user input values from the form
        // let email = document.getElementById("email").value.trim();
        // let password = document.getElementById("password").value.trim();


        let form = document.querySelector("form");

        let eField = form.querySelector(".email");
        let eInput = eField.querySelector("input");
      
        let pField = form.querySelector(".password");
        let pInput = pField.querySelector("input");

        pInput.value == ""
        ? pField.classList.add("shake", "error")
        : CheckPassword();
      
        eInput.value == ""
        ? eField.classList.add("shake", "error")
        : CheckEmail();

        setTimeout(() => {
        pField.classList.remove("shake");
        eField.classList.remove("shake");
        }, 500);

        pInput.onkeyup = () => {
        CheckPassword();
        };
        eInput.onkeyup = () => {
            CheckEmail();
        };

        function CheckPassword() {
            let passwordInput = pInput.value.trim();
            let errorTxt = pField.querySelector(".error-txt");
        
            if (passwordInput === "") {
                pField.classList.add("error");
                pField.classList.remove("valid");
                errorTxt.innerText = "Password can't be blank";
            } else {
                pField.classList.remove("error");
                pField.classList.add("valid");
            }
        }

        
      /**
       * Checks the validity of the email input field and updates the corresponding error message and styling.
       */
      function CheckEmail() {
        let pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; // Email pattern

        if (!eInput.value.match(pattern)) {
          eField.classList.add("error");
          eField.classList.remove("valid");
          let errorTxt = eField.querySelector(".error-txt");
          eInput.value != ""
            ? (errorTxt.innerText = "Enter a valid email address")
            : (errorTxt.innerText = "Email can't be blank");
        } else {
          eField.classList.remove("error");
          eField.classList.add("valid");
        }
      }
        if ( !pField.classList.contains("error") && !eField.classList.contains("error")) return true;
        else return false;
    },

    /**
     * Function to fetch data from the backend using an API call
     */
    FetchDataFromBackend : function () {
        // Extract user input values from the form
        let email = document.getElementById("email").value.trim();
        let password = document.getElementById("password").value.trim();

        // Prepare data object to send to the backend API
        let data = {
            email : email,
            password : password,
        };

        // Call the API using utils.CallAjax
        window.utils.CallAjax("POST", "/login", data, login.SuccessFunction, login.FailFunction);
    },

    /**
     * Success handler for the API call
     * @param {object} response - The response from the API call
     */
    SuccessFunction : function (response) {
        // Handle success response here
        if (response.json.message == LOGIN_SUCCESSFUL) {
            window.location.href = "/dashboard";
        } else {
            window.utils.MessageBox(response.json.message);
        }
    },

    /**
     * Error handler for the API call
     * @param {object} error - The error object from the API call
     */
    FailFunction : function (error) {
        // Handle error response here
        window.utils.MessageBox("Incorrect Password");
    },
};

