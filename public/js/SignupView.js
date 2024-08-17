const REGISTRATION_SUCCESSFUL = "Registration successful";

/**
 * Event listener for when the window has finished loading
 */
window.addEventListener("load", function () {
    // Start the signup process when the window has loaded
    signup.Start();
});

/**
 * Signup object encapsulating signup functionality
 */
let signup = {
    /**
     * Function to initialize the signup process
     */
    Start: function () {
        // Add a submit event listener to the signup form
        document.getElementById("signup-form").addEventListener("submit", function (event) {
            // Prevent the default form submission behavior
            event.preventDefault();
            // If validation passes, proceed to fetch data from the backend
            if (signup.Validate()) {
                signup.FetchDataFromBackend();
            }
        });
    },

    /**
     * Function to validate user input before submitting to the backend
     * @returns {boolean} - True if the input is valid, false otherwise
     */
    Validate: function () {
        let form = document.querySelector("form");

        let uField = form.querySelector(".username");
        let uInput = uField.querySelector("input");

        let pField = form.querySelector(".password");
        let pInput = pField.querySelector("input");

        let eField = form.querySelector(".email");
        let eInput = eField.querySelector("input");

        let rField = form.querySelector(".role");
        let rInput= rField.querySelector("select");

        pInput.value == "" ? pField.classList.add("shake", "error") : CheckPassword();
        uInput.value == "" ? uField.classList.add("shake", "error") : CheckUserName();
        eInput.value == "" ? eField.classList.add("shake", "error") : CheckEmail();
        rInput.value == "" ? rField.classList.add("shake", "error") : CheckRole(rField,rInput); 

      setTimeout(() => {
        pField.classList.remove("shake");
        uField.classList.remove("shake");
        eField.classList.remove("shake");
        rField.classList.remove("shake");
      }, 500);

      pInput.onkeyup = () => {
        CheckPassword();
      };
      uInput.onkeyup = () => {
        CheckUserName();
      };
      eInput.onkeyup = () => {
        CheckEmail();
      };
      rInput.onchange = () => {
        rInput.style.color = 'black';
        CheckRole(rField,rInput);
      };



      /**
       * Checks the validity of the username input field and updates the corresponding error message and styling.
       */
      function CheckUserName() {
        let uInputValue = uInput.value.trim(); // Trim to remove leading and trailing spaces
        let errorTxt = uField.querySelector(".error-txt");
        let pattern = /^[a-zA-Z0-9]{4,10}$/; // Regular expression pattern for user ID

        if (!pattern.test(uInputValue)) {
          uField.classList.add("error");
          uField.classList.remove("valid");
          errorTxt.innerText = "Enter Valid Username.";
        } else {
          uField.classList.remove("error");
          uField.classList.add("valid");
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

      /**
       * Checks the validity of the password input field and updates the corresponding error message and styling.
       */
      function CheckPassword() {
        let passwordInput = pInput.value.trim();
        let pattern = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/;

        if (!passwordInput.match(pattern)) {
          pField.classList.add("error");
          pField.classList.remove("valid");
          let errorTxt = pField.querySelector(".error-txt");

          passwordInput !== ""
            ? (errorTxt.innerText = "Enter Strong Password")
            : (errorTxt.innerText = "Password can't be empty");
        } else {
          pField.classList.remove("error");
          pField.classList.add("valid");
        }
      }   

      function CheckRole(field, input) {
        if (input.value === "" && !input.disabled) {
            field.classList.add("shake", "error");
            let errorTxt = field.querySelector(".error-txt");
            errorTxt.innerText = `Emplpoyee Category can't be empty`;
         } else {
            field.classList.remove("shake", "error");
            field.classList.add("valid");
         }
      }

      // If all Validation passed
        if ( !pField.classList.contains("error") && !uField.classList.contains("error") && 
        !rField.classList.contains("error") && !eField.classList.contains("error")) return true;

        else return false;
    },

    /**
     * Function to fetch data from the backend using an API call
     */
    FetchDataFromBackend: function () {
        // Extract user input values from the form
        let name = document.getElementById("name").value.trim();
        let email = document.getElementById("email").value.trim();
        let password = document.getElementById("password").value.trim();
        let role = document.getElementById("role").value.trim();

        // Prepare data object to send to the backend API
        let data = {
            name: name,
            email: email,
            password: password,
            role: role, // Include role in the data object
        };

        // Call the API using utils.CallAjax
        window.utils.CallAjax("POST", "/signup", data, signup.SuccessFunction, signup.FailFunction);
    },

    /**
     * Success handler for the API call
     * @param {object} response - The response from the API call
     */
    SuccessFunction: function (response) {
        // Handle success response here
        if (response.json.message == REGISTRATION_SUCCESSFUL) {
            window.location.href = "/login";
        } else {
            window.utils.MessageBox(response.json.message);
        }
    },

    /**
     * Error handler for the API call
     * @param {object} error - The error object from the API call
     */
    FailFunction: function (error) {
        // Handle error response here
        window.utils.MessageBox(error);
    },
};