//Prepares the variables to be able to be able to manipulat the application through different functions
//Did this because I kept encountering event listener errors
document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("file-input");
    const googleTableContainer = document.getElementById("google-table-container");
    const messageArea = document.getElementById("message-area");
    let loadedData = null; // Track loaded data
    let selectedGraph = null; // Track selected radio button
    let chartContainer = document.getElementById("chart-container"); // Element for the chart
    let chartErrorMessage = document.getElementById("chart-error-message"); // New element for the error message

    // Load the Google Charts library and set a callback
    google.charts.load("current", { packages: ["corechart", "table"] });
    google.charts.setOnLoadCallback(function () {
        // All your chart creation functions
    });

    // Event listener for "Load CSV" click
    const loadCSVButton = document.getElementById("load-csv-file");
    loadCSVButton.addEventListener("click", function () {
        fileInput.click();
    });

    // Event listener for file input change
    fileInput.addEventListener("change", function (event) {
        //Prevents from adding more than one file!
        const file = event.target.files[0];

        //Checks whether a variable name 'file' exists
        if (file) {
            //Checks if file exists condition is true if so it will run whatever is in the {...}
            Papa.parse(file, {
                header: true,
                //specifies that PapaParse should automatically convert data types where appropriate, such as converting numeric strings to numbers.
                dynamicTyping: true,
                //When parsing is complete it will run the (results) Function which is displaying the table
                complete: function (results) {
                    const data = results.data;
                    displayGoogleTable(data);
                    messageArea.textContent = `Number of Records: ${data.length}`;
                },
                error: function (error) {
                    console.error("Error parsing CSV:", error.message);
                },
            });
        }
    });

    // Event listener for radio button selection
    const radioButtons = document.getElementsByName("graph-choice");
    radioButtons.forEach((radio) => {
        radio.addEventListener("change", function () {
            selectedGraph = radio.value;
        });
    });

    // Event listener for "View" sub-menus
const viewMenu = document.getElementById("view-menu");

viewMenu.addEventListener("click", function (event) {
    if (event.target.tagName === "A" && selectedGraph) {
        const choice = event.target.textContent;

        if (selectedGraph === "Deaths" && choice !== "Bar" && choice !== "Line") {
            // Display a "Not Applicable" message for "Deaths"
            chartContainer.style.display = "none";
            chartErrorMessage.textContent = "Not Applicable for Deaths";
            chartErrorMessage.style.display = "block";
            messageArea.textContent = ""; // Clear the message area
        } else if (selectedGraph === "Total Test Results" && choice !== "Bar" && choice !== "Line") {
            // Display a "Not Applicable" message for "Total Test Results"
            chartContainer.style.display = "none";
            chartErrorMessage.textContent = "Not Applicable for Total Test Results";
            chartErrorMessage.style.display = "block";
            messageArea.textContent = ""; // Clear the message area
        } else if (selectedGraph === "Total Test Results" && choice !== "Bar" && choice !== "Line") {
            // Display a "Not Applicable" message for "Total Test Results"
            chartContainer.style.display = "none";
            chartErrorMessage.textContent = "Not Applicable for Total Test Results";
            chartErrorMessage.style.display = "block";
            messageArea.textContent = ""; // Clear the message area
        } else if (selectedGraph === "State") { // Check if the selectedGraph is "State"
            if (choice === "Bar" || choice === "Pie") {
                displayChartForState(choice);
            } else {
                // Display a "Not Applicable" message for "State" for other choices
                chartContainer.style.display = "none";
                chartErrorMessage.textContent = "Not Applicable for State";
                chartErrorMessage.style.display = "block";
                messageArea.textContent = ""; // Clear the message area
            }
        } else {
            if (isChartAllowedForChoice(choice)) {
                // Adjusted code to handle both "Deaths" and "Total Test Results"
                if (selectedGraph === "Deaths") {
                    if (choice === "Line") {
                        displayLineChart(loadedData, selectedGraph);
                    } else if (choice === "Bar") {
                        displayBarChart(loadedData, selectedGraph);
                    }
                } else if (selectedGraph === "Total Test Results") {
                    if (choice === "Line") {
                        displayLineChartTotalTestResults(loadedData, selectedGraph);
                    } else if (choice === "Bar") {
                        displayBarChartTotalTestResults(loadedData, selectedGraph);
                    }
                }
                chartErrorMessage.style.display = "none"; // Hide error message
                messageArea.textContent = `Displaying ${choice} Chart for ${selectedGraph}`;
            } else {
                // Hide the chart and display an error message for unsupported options
                chartContainer.style.display = "none";
                chartErrorMessage.textContent = "Chart type not supported for this option.";
                chartErrorMessage.style.display = "block"; // Show error message
            }
        }
    }
});

// Function to display Bar or Pie Chart for "State"
function displayChartForState(choice) {
    if (choice === "Bar") {
        displayBarChartState(loadedData, selectedGraph);
    } else if (choice === "Pie") {
        displayPieChartState(loadedData, selectedGraph);
    }
}

 // Function to check if a chart is allowed for the selected choice
    function isChartAllowedForChoice(choice) {
        return choice === "Line" || choice === "Bar";
    }

    // Function to display Google Table
    function displayGoogleTable(data) {
        if (data.length === 0) {
            googleTableContainer.innerHTML = "Please load data first.";
        } else {
            loadedData = data; // Store loaded data
            const dataTable = new google.visualization.DataTable();
            const columns = Object.keys(data[0]);

            columns.forEach(function (column) {
                if (!isNaN(data[0][column])) {
                    dataTable.addColumn("number", column);
                } else {
                    dataTable.addColumn("string", column);
                }
            });

            const rows = data.map(function (row) {
                return columns.map(function (column) {
                    return row[column];
                });
            });
            dataTable.addRows(rows);

            const table = new google.visualization.Table(googleTableContainer);
            table.draw(dataTable, { showRowNumber: true, width: "100%", height: "100%" });
        }
    }

    // Function to display Bar Chart for deaths 
    function displayBarChart(data, selectedGraph) {
        const chartData = prepareBarChartData(data, selectedGraph);
        const options = {
            title: `${selectedGraph} (Bar Chart)`,
            hAxis: { title: "Date" },
            vAxis: { title: selectedGraph },
        };

        chartContainer.style.display = "block"; // Show the chart
        chartErrorMessage.style.display = "none"; // Hide error message

        const chart = new google.visualization.BarChart(chartContainer);
        chart.draw(chartData, options);
    }

    // Function to display Line Chart for deaths 
    function displayLineChart(data, selectedGraph) {
        const chartData = prepareLineChartData(data, selectedGraph);
        const options = {
            title: `${selectedGraph} (Line Chart)`,
            hAxis: { title: "Date" },
            vAxis: { title: selectedGraph },
        };

        chartContainer.style.display = "block"; // Show the chart
        chartErrorMessage.style.display = "none"; // Hide error message

        const chart = new google.visualization.LineChart(chartContainer);
        chart.draw(chartData, options);
    }

    // Function to display Bar Chart for Total Test Results
function displayBarChartTotalTestResults(data, selectedGraph) {
    const chartData = prepareBarChartDataTotalTestResults(data, selectedGraph);
    const options = {
        title: `${selectedGraph} (Bar Chart)`,
        hAxis: { title: "Date" },
        vAxis: { title: selectedGraph },
    };

    chartContainer.style.display = "block"; // Show the chart
    chartErrorMessage.style.display = "none"; // Hide error message

    const chart = new google.visualization.BarChart(chartContainer);
    chart.draw(chartData, options);
}

// Function to display Bar Chart for State
function displayBarChartState(data, selectedGraph) {
    const chartData = prepareBarChartDataState(data, selectedGraph);
    const options = {
        title: `${selectedGraph} (Bar Chart)`,
        hAxis: { title: "Date" },
        vAxis: { title: selectedGraph },
    };

    chartContainer.style.display = "block"; // Show the chart
    chartErrorMessage.style.display = "none"; // Hide error message

    const chart = new google.visualization.BarChart(chartContainer);
    chart.draw(chartData, options);
}

// Function to display Pie Chart for State
function displayPieChartState(data, selectedGraph) {
    const chartData = preparePieChartDataState(data);
    const options = {
        title: `${selectedGraph} (Pie Chart)`,
        is3D: true, // Enable 3D view
    };

    chartContainer.style.display = "block"; // Show the chart
    chartErrorMessage.style.display = "none"; // Hide error message

    const chart = new google.visualization.PieChart(chartContainer);
    chart.draw(chartData, options);
}




// Function to display Line Chart for Total Test Results
function displayLineChartTotalTestResults(data, selectedGraph) {
    const chartData = prepareLineChartDataTotalTestResults(data, selectedGraph);
    const options = {
        title: `${selectedGraph} (Line Chart)`,
        hAxis: { title: "Date" },
        vAxis: { title: selectedGraph },
    };

    chartContainer.style.display = "block"; // Show the chart
    chartErrorMessage.style.display = "none"; // Hide error message

    const chart = new google.visualization.LineChart(chartContainer);
    chart.draw(chartData, options);
}


    // Helper function to prepare data for Bar Chart (deaths)
    function prepareBarChartData(data, selectedGraph) {
        const chartData = new google.visualization.DataTable();
        chartData.addColumn("string", "Date");
        chartData.addColumn("number", "Death");
        chartData.addColumn("number", "DeathConfirmed");
        chartData.addColumn("number", "DeathIncrease");
        chartData.addColumn("number", "DeathProbable");
    
        const chartDataArray = data.map((row) => [
            row.date,
            row.death,
            row.deathConfirmed,
            row.deathIncrease,
            row.deathProbable,
        ]);
    
        chartData.addRows(chartDataArray);
    
        return chartData;
    }
    

    // Helper function to prepare data for Line Chart (Deaths)
    function prepareLineChartData(data, selectedGraph) {
        const chartData = new google.visualization.DataTable();
        chartData.addColumn("string", "Date");
        chartData.addColumn("number", "Death");
        chartData.addColumn("number", "DeathConfirmed");
        chartData.addColumn("number", "DeathIncrease");
        chartData.addColumn("number", "DeathProbable");

        const chartDataArray = data.map((row) => [
            row.date,
            row.death,
            row.deathConfirmed,
            row.deathIncrease,
            row.deathProbable,
        ]);

        chartData.addRows(chartDataArray);

        return chartData;
    }

 // Helper function to prepare data for Bar Chart (Total Test Results)
function prepareBarChartDataTotalTestResults(data, selectedGraph) {
    const chartData = new google.visualization.DataTable();
    chartData.addColumn("string", "Date");
    chartData.addColumn("number", "Hospitalized Currently");
    chartData.addColumn("number", "Hospitalized Increase");

    const chartDataArray = data.map((row) => [
        row.date,
        row.hospitalizedCurrently,
        row.hospitalizedIncrease,
    ]);

    chartData.addRows(chartDataArray);

    return chartData;
}

// Helper function to prepare data for Line Chart (Total Test Results)
function prepareLineChartDataTotalTestResults(data, selectedGraph) {
    const chartData = new google.visualization.DataTable();
    chartData.addColumn("string", "Date");
    chartData.addColumn("number", "Hospitalized Currently");
    chartData.addColumn("number", "Hospitalized Increase");

    const chartDataArray = data.map((row) => [
        row.date,
        row.hospitalizedCurrently,
        row.hospitalizedIncrease,
    ]);

    chartData.addRows(chartDataArray);

    return chartData;
}

function prepareBarChartDataState(data) {
    const chartData = new google.visualization.DataTable();
    chartData.addColumn("string", "Date");
    chartData.addColumn("number", "Negative");
    chartData.addColumn("number", "Negative Increase");
    chartData.addColumn("number", "Positive");
    chartData.addColumn("number", "Positive Increase");
    chartData.addColumn("number", "Total Test Results");

    const chartDataArray = data.map((row) => [
        row.date,
        //parsefloat accepts a string and converts to a floating point number 
        parseFloat(row.negative),
        parseFloat(row.negativeIncrease),
        parseFloat(row.positive),
        parseFloat(row.positiveIncrease),
        parseFloat(row.totalTestResults)
    ]);

    chartData.addRows(chartDataArray);

    return chartData;
}

// Helper function to prepare data for Pie Chart (State)
function preparePieChartDataState(data) {
    const chartData = new google.visualization.DataTable();
    chartData.addColumn("string", "Category");
    chartData.addColumn("number", "Value");

    // Select the first ten rows of data
    const limitedData = data.slice(0, 10);

    // Calculate the total sum of "Negative," "Positive," and "Total Test Results" values
    let totalNegative = 0;
    let totalPositive = 0;
    let totalTotalTestResults = 0;

    for (const row of limitedData) {
        totalNegative += parseFloat(row.negative);
        totalPositive += parseFloat(row.positive);
        totalTotalTestResults += parseFloat(row.totalTestResults);
    }

    // Add separate segments for "Negative," "Positive," and "Total Test Results"
    chartData.addRow(["Negative", totalNegative]);
    chartData.addRow(["Positive", totalPositive]);
    chartData.addRow(["Total Test Results", totalTotalTestResults]);

    return chartData;
}



// Event listener for the "Client" submenu
const clientInfoMenuItem = document.getElementById("client-info");
clientInfoMenuItem.addEventListener("click", function () {
    // Get browser and OS information
    const browserInfo = `Browser: ${window.navigator.appName} ${window.navigator.appVersion}`;
    const osInfo = `OS: ${window.navigator.platform}`;

    // Check if cookies and Java are enabled
    const cookiesEnabled = `Cookies enabled: ${navigator.cookieEnabled ? "Yes" : "No"}`;
    const javaEnabled = `Java enabled: ${navigator.javaEnabled() ? "Yes" : "No"}`;

    // Combine all information with each item on a separate line
    const userInfo = `
        <p>${browserInfo}</p>
        <p>${osInfo}</p>
        <p>${cookiesEnabled}</p>
        <p>${javaEnabled}</p>
    `;

    // Display the custom popup
    const popup = document.getElementById("custom-popup");
    const popupText = document.getElementById("popup-text");
    popupText.innerHTML = userInfo; // Use innerHTML to interpret the HTML tags
    popup.style.display = "block";

    // Event listener to close the popup
    const closeBtn = document.getElementById("close-popup");
    closeBtn.addEventListener("click", function () {
        popup.style.display = "none";
    });
});



// Function to display a login popup
function displayLoginPopup() {
    const username = prompt("Enter your login:");
    const password = prompt("Enter your password:");

    if (username && password) {
        // Prepare the data to send in the request
        const data = {
            userName: username,
            userPassword: password,
        };

        // Send an AJAX request to the login.php file
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "login.php", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);

                if (response.success) {
                    // Login successful, store user information and show a welcome message
                    sessionStorage.setItem("user", JSON.stringify(response));
                    messageArea.textContent = `Welcome, ${response.name}!`;
                } else {
                    // Login failed, display an error message
                    messageArea.textContent = "Login failed. Please check your credentials.";
                }
            }
        };

        xhr.send(JSON.stringify(data));
    }
}

// Function to display a confirmation popup for logout
function displayLogoutPopup() {
    const confirmLogout = confirm("Are you sure you want to logout?");
    if (confirmLogout) {
        // Clear user information and display a "Successful logout" message
        sessionStorage.removeItem("user");
        messageArea.textContent = "Successful logout.";
    }
}

// Event listener for the "Login to DB" sub-menu
const loginToDBMenuItem = document.getElementById("login-to-db");
loginToDBMenuItem.addEventListener("click", displayLoginPopup);

// Event listener for the "Logout DB" sub-menu
const logoutDBMenuItem = document.getElementById("logout-db");
logoutDBMenuItem.addEventListener("click", displayLogoutPopup);





// Event listener for the "Info" submenu under "Help"
const infoMenuItem = document.getElementById("info-menu");
infoMenuItem.addEventListener("click", function () {
    // Replace the following placeholders with your actual information
    const yourName = "Adriana Altamirano";
    const yourClassID = "CPS4745";
    const projectDueDate = "10/29/2023";

    // Create a modal dialog using JavaScript
    const modalDiv = document.createElement("div");
    modalDiv.className = "custom-modal";

    // Create a content box inside the modal
    const contentBox = document.createElement("div");
    contentBox.className = "modal-content";

    // Create a close button ("X" to cancel)
    const closeButton = document.createElement("span");
    closeButton.className = "close";
    closeButton.innerHTML = "×";
    closeButton.addEventListener("click", function () {
        document.body.removeChild(modalDiv);
    });

    // Create and add your information to the content box
    const infoText = document.createElement("p");
    infoText.innerHTML = `
        <strong>Name:</strong> ${yourName}<br>
        <strong>Class ID:</strong> ${yourClassID}<br>
        <strong>Project Due Date:</strong> ${projectDueDate}
    `;

    contentBox.appendChild(closeButton);
    contentBox.appendChild(infoText);
    modalDiv.appendChild(contentBox);

    // Append the modal to the body
    document.body.appendChild(modalDiv);
});

// Function to display user information popup
function displayUserInfoPopup() {
    // Create the user info popup
    const userInfoPopup = document.createElement("div");
    userInfoPopup.id = "user-info-popup";
    userInfoPopup.classList.add("popup");

    const popupContent = document.createElement("div");
    popupContent.classList.add("popup-content");

    // Create a close button
    const closeUserInfoPopupButton = document.createElement("span");
    closeUserInfoPopupButton.id = "close-user-info-popup";
    closeUserInfoPopupButton.classList.add("close-btn");
    closeUserInfoPopupButton.textContent = "×";
    closeUserInfoPopupButton.addEventListener("click", function () {
        userInfoPopup.style.display = "none";
    });

    // Create and display user information
    const userInfo = {
        uid: "1",       // Replace with actual user data
        login: "tiger",  // Replace with actual user data
        name: "Victor Smith",   // Replace with actual user data
        gender: "M",     // Replace with actual user data
    };

    const userInfoContent = document.createElement("div");
    userInfoContent.innerHTML = `
        <h2>User Information</h2>
        <p><strong>UID:</strong> ${userInfo.uid}</p>
        <p><strong>Login:</strong> ${userInfo.login}</p>
        <p><strong>Name:</strong> ${userInfo.name}</p>
        <p><strong>Gender:</strong> ${userInfo.gender}</p>
    `;

    // Append elements to the user info popup
    popupContent.appendChild(closeUserInfoPopupButton);
    popupContent.appendChild(userInfoContent);
    userInfoPopup.appendChild(popupContent);

    // Add the user info popup to the main content
    const main = document.querySelector("main");
    main.appendChild(userInfoPopup);
    userInfoPopup.style.display = "block";
}

// Event listener for the "User Info" submenu
const userInfoMenuItem = document.getElementById("user-info-menu");
userInfoMenuItem.addEventListener("click", displayUserInfoPopup);


// Function to handle the "Exit" action
function handleExit() {
    // Clear session storage to clean memory
    sessionStorage.clear();

    // Close the current browser tab or window
    window.close();

    // Refresh the screen to remove cache
    location.reload();
}

// Event listener for the "Exit" submenu
const exitMenuItem = document.getElementById("exit-app");
exitMenuItem.addEventListener("click", handleExit);


});



//project 2 cont

// Event listener for "Load DB Data1" click
const loadDBData1Button = document.getElementById("load-db-data1");
loadDBData1Button.addEventListener("click", function () {
    // Add your logic to handle loading DB Data1
    console.log("Loading DB Data1...");
});

// Event listener for "Load DB Data2" click
const loadDBData2Button = document.getElementById("load-db-data2");
loadDBData2Button.addEventListener("click", function () {
    // Add your logic to handle loading DB Data2
    console.log("Loading DB Data2...");
});
