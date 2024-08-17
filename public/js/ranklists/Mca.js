window.addEventListener("load", function () {
    // Start the  process when the window has loaded
    searchResult.Start();
});

let searchResult = {
    /**
     * Function to initialize the login process
     */
    Start: function () {
        // Add a submit event listener to the login form
        document.querySelector(".header-form").addEventListener("submit", function (event) {
            // Prevent the default form submission behavior
            event.preventDefault();
            // If validation passes, proceed to fetch data from the backend
            if (searchResult.Validate()) {
                searchResult.FetchDataFromBackend();
            }
        });
    },

    /**
     * Function to validate user input before submitting to the backend
     * @returns {boolean} - True if the input is valid, false otherwise
     */
    Validate: function () {
        // Extract user input values from the form
        let college = document.getElementById("college").value.trim();
        let batch = document.getElementById("batch").value.trim();
        let sem = document.getElementById("sem").value.trim();

        if (college == "" || batch == "" || sem == "") return false;

        return true;
    },

    /**
     * Function to fetch data from the backend using an API call
     */
    FetchDataFromBackend: function () {
        // Extract user input values from the form
        let college = document.getElementById("college").value.trim();
        let batch = document.getElementById("batch").value.trim();
        let sem = document.getElementById("sem").value.trim();
        let semField = "";
        if (sem == 0) {
            semField = "overall_sgpa";
        } else if (sem == 1) {
            semField = "sem1_sgpa"
        } else if (sem == 2) {
            semField = "sem2_sgpa"
        } else if (sem == 3) {
            semField = "sem3_sgpa"
        } else if (sem == 4) {
            semField = "sem4_sgpa"
        }

        // Prepare data object to send to the backend API
        let data = {
            batch: batch,
            sem: semField
        };

        // Call the API using utils.CallAjax
        window.utils.CallAjax("POST", "/ranklist/mca", data, searchResult.SuccessFunction, searchResult.FailFunction);
    },

    /**
     * Success handler for the API call
     * @param {object} response - The response from the API call
     */
    SuccessFunction: function (response) {
        // Get the response data
        const responseData = response.json.result;
        const wrapperElement = document.querySelector("#table-area .wrapper");
        wrapperElement.innerHTML = ""
   
        // Show the table area
        document.getElementById("table-area").classList.remove("d-none");
    
        // Create a table element
        const table = document.createElement("table");
        table.classList.add("table");
    
        // Create table header
        const thead = document.createElement("thead");
        thead.classList.add("table-header")
        const headerRow = document.createElement("tr");
        const headers = ["Rank", "Roll Number", "Name", "SGPA", "Total Marks", "Placement Status","Backlogs", "Batch"];
    
        headers.forEach(headerText => {
            const th = document.createElement("th");
            th.classList.add("header__item")
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
    
        thead.appendChild(headerRow);
        table.appendChild(thead);
    
        // Create table body
        const tbody = document.createElement("tbody");
    
        // Add rows to the table
        responseData.forEach(data => {
            if (data.calculate_sgpa_and_rank.rank !== null) {
                const tr = document.createElement("tr");
                tr.classList.add("table-row")
                const keys = ['rank', 'roll_number', 'name', 'sgpa', 'total_marks', 'placement_status','count_marks_less_than_40', 'batch'];
    
                keys.forEach(key => {
                    const td = document.createElement("td");
                    td.classList.add("table-data")
                    if (key === 'placement_status') {
                        td.textContent = data.calculate_sgpa_and_rank[key] ? "Y" : "N";
                    } else {
                        td.textContent = data.calculate_sgpa_and_rank[key];
                    }
                    tr.appendChild(td);
                });
    
                tbody.appendChild(tr);
            }
        });
    
        table.appendChild(tbody);
    
        // Append the table to the table area
        wrapperElement.appendChild(table);
    },
    

    /**
     * Error handler for the API call
     * @param {object} error - The error object from the API call
     */
    FailFunction: function (error) {
        console.log(error)
    },
};






/**
 * Function to display the loader
 */
function showLoader() {
    document.getElementById('loader').style.display = 'flex';
}

/**
 * Function to hide the loader
 */
function hideLoader() {
    document.getElementById('loader').style.display = 'none';
}
showLoader();
window.addEventListener("load", function () {
    hideLoader();
});
