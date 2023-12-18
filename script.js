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

    // Check if CSV data is loaded
const isCSVLoaded = loadedData && loadedData.length > 0;

// Event listener for the logout button
const logoutButton = document.getElementById("logout-db");
logoutButton.addEventListener("click", function () {
    // Call a function to log the user out of the database
    // Add your logout logic here (e.g., make an API call)

    // Reload the page after logout
    location.reload();
});

// Function to log out the user and refresh the page
function logoutAndRefresh() {
    // Add your logout logic here (e.g., make an API call)

    // Reload the page after logout
    location.reload();
}

// Check if CSV data is loaded and automatically log out
if (isCSVLoaded) {
    // Call the logout function when there is CSV data
    logoutAndRefresh();
}


    //This code attaches an event listener to each radio button, and when a radio button is clicked, it checks the selected graph choice and displays both bar and line charts 
    //accordingly for "Deaths" and "Total Test Results". Adjustments can be made based on your specific requirements.
    // Event listener for radio buttons
const radioButtons = document.querySelectorAll('input[name="graph-choice"]');

// Event listener for radio buttons
radioButtons.forEach((radioButton) => {
    radioButton.addEventListener("click", function () {
        // Get the selected graph choice
        const selectedGraphChoice = this.value;

        // Create containers for bar and line charts
        const barChartContainer = document.getElementById("bar-chart-container");
        const lineChartContainer = document.getElementById("line-chart-container");
        const stateChartContainer = document.getElementById("state-chart-container"); // Added State chart container

        // Clear previous chart content
        barChartContainer.innerHTML = "";
        lineChartContainer.innerHTML = "";
        stateChartContainer.innerHTML = ""; // Clear State chart container

        // Display charts based on the selected radio button
        if (selectedGraphChoice === "Deaths") {
            displayBarChart(loadedData, selectedGraphChoice, barChartContainer);
            displayLineChart(loadedData, selectedGraphChoice, lineChartContainer);
            messageArea.textContent = `Displaying Bar and Line Charts for ${selectedGraphChoice}`;
            chartErrorMessage.style.display = "none"; // Hide error message

        } else if (selectedGraphChoice === "Total Test Results") {
            displayBarChartTotalTestResults(loadedData, selectedGraphChoice, barChartContainer);
            displayLineChartTotalTestResults(loadedData, selectedGraphChoice, lineChartContainer);
            messageArea.textContent = `Displaying Bar and Line Charts for ${selectedGraphChoice}`;
            chartErrorMessage.style.display = "none"; // Hide error message

        } else if (selectedGraphChoice === "State") {
            // Handle the State graph accordingly
            displayChartForState("Bar", stateChartContainer); // Display a bar chart for State by default
            displayChartForState("Pie", stateChartContainer); // Display a pie chart for State by default
            messageArea.textContent = "Displaying Bar and Pie Charts for State";
            chartErrorMessage.style.display = "none"; // Hide error message
        }
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

    // Function to highlight outliers based on quartile method
    function highlightOutliers(columnName) {
        const columnValues = loadedData.map(row => parseFloat(row[columnName]) || 0);
        const q1 = calculateQuartile(columnValues, 0.25);
        const q3 = calculateQuartile(columnValues, 0.75);
        const iqr = q3 - q1;
        const lowerThreshold = q1 - 1.5 * iqr;
        const upperThreshold = q3 + 1.5 * iqr;

        messageArea.textContent = `Outlier Thresholds: Lower - ${lowerThreshold}, Upper - ${upperThreshold}`;

        const rows = document.querySelectorAll("tr");

        rows.forEach(row => {
            const cell = row.querySelector(`td[data-col="${columnName}"]`);
            const cellValue = parseFloat(cell.textContent);

            if (!isNaN(cellValue) && (cellValue < lowerThreshold || cellValue > upperThreshold)) {
                row.style.backgroundColor = "yellow";
            }
        });
    }

    // Function to calculate quartile
    function calculateQuartile(data, percentile) {
        const sortedData = [...data].sort((a, b) => a - b);
        const index = (percentile * (sortedData.length - 1)) + 1;
        const fractionPart = index % 1;
        const wholePart = Math.floor(index);

        if (fractionPart === 0) {
            return sortedData[wholePart - 1];
        } else {
            return sortedData[wholePart - 1] + fractionPart * (sortedData[wholePart] - sortedData[wholePart - 1]);
        }
    }
});


 // Function to check if a chart is allowed for the selected choice
    function isChartAllowedForChoice(choice) {
        return choice === "Line" || choice === "Bar";
    }

    // Function to display Google Table with color-coded cells
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

        // Calculate column averages for Death and TotalTestResults
        const deathAverage = calculateColumnAverage(data, 'death');
        const totalTestResultsAverage = calculateColumnAverage(data, 'totalTestResults');

        const options = {
            showRowNumber: true,
            width: "100%",
            height: "100%",
            cssClassNames: {
                headerRow: 'google-table-header',
                tableRow: 'google-table-row',
            },
            formatters: {
                number: [
                    {
                        columnNum: getColumnIndex('death'),
                        formatType: 'color',
                        color: 'red',
                        ranges: [{ from: deathAverage, to: null }]
                    },
                    {
                        columnNum: getColumnIndex('totalTestResults'),
                        formatType: 'color',
                        color: 'green',
                        ranges: [{ from: totalTestResultsAverage, to: null }]
                    }
                ],
            },
        };

        const table = new google.visualization.Table(googleTableContainer);
        table.draw(dataTable, options);
    }
}

// Function to calculate the average of a specific column
function calculateColumnAverage(data, columnName) {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return 0; // Return a default value or handle the case appropriately
    }

    const columnValues = data
        .filter(row => row && typeof row === 'object' && columnName in row)
        .map(row => parseFloat(row[columnName]) || 0);

    if (columnValues.length === 0) {
        return 0; // Return a default value or handle the case appropriately
    }

    const sum = columnValues.reduce((acc, value) => acc + value, 0);
    return sum / columnValues.length;
}


// Function to get the column index by name
function getColumnIndex(columnName) {
    return loadedData.length > 0 ? Object.keys(loadedData[0]).indexOf(columnName) : -1;
}

// Add sliders for Death and TotalTestResults columns
const deathSlider = createSlider("death-slider", "Death");
const totalTestResultsSlider = createSlider("total-test-results-slider", "TotalTestResults");

// Event listener for Death slider change
deathSlider.addEventListener("input", function () {
    const threshold = parseFloat(deathSlider.value);
    updateColorBasedOnSlider("Death", threshold);
});

// Event listener for TotalTestResults slider change
totalTestResultsSlider.addEventListener("input", function () {
    const threshold = parseFloat(totalTestResultsSlider.value);
    updateColorBasedOnSlider("TotalTestResults", threshold);
});

// Function to create a slider
function createSlider(id, label) {
    const sliderContainer = document.getElementById(id + "-container");

    if (!sliderContainer) {
        console.error(`Slider container with ID '${id}-container' not found.`);
        return null; // Return null to handle the error
    }

    const slider = document.createElement("input");
    slider.type = "range";
    slider.id = id;
    slider.min = getMinValue(loadedData, label);
    slider.max = getMaxValue(loadedData, label);
    slider.value = calculateColumnAverage(loadedData, label);

    try {
        sliderContainer.appendChild(slider);
    } catch (error) {
        console.error("Error appending slider to container:", error.message);
    }

    return slider;
}


// Function to get the minimum value of a column
function getMinValue(data, columnName) {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return 0; // Return a default value or handle the case appropriately
    }

    const minValues = data
        .filter(row => row && typeof row === 'object' && columnName in row)
        .map(row => parseFloat(row[columnName]) || 0);

    if (minValues.length === 0) {
        return 0; // Return a default value or handle the case appropriately
    }

    return Math.min(...minValues);
}


// Function to get the maximum value of a column
function getMaxValue(data, columnName) {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return 0; // Return a default value or handle the case appropriately
    }

    const maxValues = data
        .filter(row => row && typeof row === 'object' && columnName in row)
        .map(row => parseFloat(row[columnName]) || 0);

    if (maxValues.length === 0) {
        return 0; // Return a default value or handle the case appropriately
    }

    return Math.max(...maxValues);
}


// Function to update color based on slider value
function updateColorBasedOnSlider(columnName, threshold) {
    const columnAverage = calculateColumnAverage(loadedData, columnName);
    const cells = document.querySelectorAll(`td[data-col="${columnName}"]`);

    cells.forEach(cell => {
        const cellValue = parseFloat(cell.textContent);
        if (!isNaN(cellValue)) {
            if (cellValue > threshold) {
                cell.style.color = columnName === "Death" ? "red" : "green";
            } else {
                cell.style.color = "black";
            }
        }
    });

    // Update charts based on slider value
    updateChartsBasedOnSlider(columnName, threshold);
}

// Function to update charts based on slider value
function updateChartsBasedOnSlider(columnName, threshold) {
    if (columnName === "Death") {
        // Update charts for the Death column
        // Add your code to update charts accordingly
    } else if (columnName === "TotalTestResults") {
        // Update charts for the TotalTestResults column
        // Add your code to update charts accordingly
    }
}




    // Function to display Bar Chart for deaths 
function displayBarChart(data, selectedGraph, container) {
    const chartData = prepareBarChartData(data, selectedGraph);
    const options = {
        title: `${selectedGraph} (Bar Chart)`,
        hAxis: { title: "Date" },
        vAxis: { title: selectedGraph },
        chartArea: { width: '70%', height: '60%' }, // Adjust the width and height as needed
    };

    // Create a new chart container div
    const chartContainer = document.createElement("div");
    chartContainer.style.display = "inline-block"; // Display inline
    chartContainer.style.width = '600px'; // Adjust the width as needed
    chartContainer.style.height = '400px'; // Adjust the height as needed
    container.appendChild(chartContainer);

    const chart = new google.visualization.BarChart(chartContainer);
    chart.draw(chartData, options);
}

// Function to display Line Chart for deaths 
function displayLineChart(data, selectedGraph, container) {
    const chartData = prepareLineChartData(data, selectedGraph);
    const options = {
        title: `${selectedGraph} (Line Chart)`,
        hAxis: { title: "Date" },
        vAxis: { title: selectedGraph },
        chartArea: { width: '70%', height: '60%' }, // Adjust the width and height as needed
    };

    // Create a new chart container div
    const chartContainer = document.createElement("div");
    chartContainer.style.display = "inline-block"; // Display inline
    chartContainer.style.width = '600px'; // Adjust the width as needed
    chartContainer.style.height = '400px'; // Adjust the height as needed
    container.appendChild(chartContainer);

    const chart = new google.visualization.LineChart(chartContainer);
    chart.draw(chartData, options);
}



  // Function to display Bar Chart for Total Test Results
function displayBarChartTotalTestResults(data, selectedGraph, container) {
    const chartData = prepareBarChartDataTotalTestResults(data, selectedGraph);
    const options = {
        title: `${selectedGraph} (Bar Chart)`,
        hAxis: { title: "Date" },
        vAxis: { title: selectedGraph },
        chartArea: { width: '70%', height: '60%' }, // Adjust the width and height as needed
    };

    // Create a new chart container div
    const chartContainer = document.createElement("div");
    chartContainer.style.display = "inline-block"; // Display inline
    chartContainer.style.width = '600px'; // Adjust the width as needed
    chartContainer.style.height = '400px'; // Adjust the height as needed
    container.appendChild(chartContainer);

    const chart = new google.visualization.BarChart(chartContainer);
    chart.draw(chartData, options);
}

// Function to display Line Chart for Total Test Results
function displayLineChartTotalTestResults(data, selectedGraph, container) {
    const chartData = prepareLineChartDataTotalTestResults(data, selectedGraph);
    const options = {
        title: `${selectedGraph} (Line Chart)`,
        hAxis: { title: "Date" },
        vAxis: { title: selectedGraph },
        chartArea: { width: '70%', height: '60%' }, // Adjust the width and height as needed
    };

    // Create a new chart container div
    const chartContainer = document.createElement("div");
    chartContainer.style.display = "inline-block"; // Display inline
    chartContainer.style.width = '600px'; // Adjust the width as needed
    chartContainer.style.height = '400px'; // Adjust the height as needed
    container.appendChild(chartContainer);

    const chart = new google.visualization.LineChart(chartContainer);
    chart.draw(chartData, options);
}

// Function to display Bar or Pie Chart for "State"
function displayChartForState(choice, container) {
    if (choice === "Bar") {
        displayBarChartState(loadedData, choice, container);
    } else if (choice === "Pie") {
        displayPieChartState(loadedData, container);
    }
}

// Function to display Bar Chart for State
function displayBarChartState(data, selectedGraph, container) {
    const chartData = prepareBarChartDataState(data);
    const options = {
        title: `${selectedGraph} (Bar Chart)`,
        hAxis: { title: "Date" },
        vAxis: { title: selectedGraph },
        chartArea: { width: '70%', height: '60%' }, // Adjust the width and height as needed
    };

    // Create a new chart container div
    const chartContainer = document.createElement("div");
    chartContainer.style.display = "inline-block"; // Display inline
    chartContainer.style.width = '600px'; // Adjust the width as needed
    chartContainer.style.height = '400px'; // Adjust the height as needed
    container.appendChild(chartContainer);

    const chart = new google.visualization.BarChart(chartContainer);
    chart.draw(chartData, options);
}

// Function to display Pie Chart for State
function displayPieChartState(data, container) {
    const chartData = preparePieChartDataState(data);
    const options = {
        title: "State (Pie Chart)",
        is3D: true, // Enable 3D view
        chartArea: { width: '70%', height: '60%' }, // Adjust the width and height as needed
    };

    // Create a new chart container div
    const chartContainer = document.createElement("div");
    chartContainer.style.display = "inline-block"; // Display inline
    chartContainer.style.width = '600px'; // Adjust the width as needed
    chartContainer.style.height = '400px'; // Adjust the height as needed
    container.appendChild(chartContainer);

    const chart = new google.visualization.PieChart(chartContainer);
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

    const filteredData = data.filter(row => {
        return row.hospitalizedCurrently !== null && row.hospitalizedIncrease !== null &&
               !isNaN(row.hospitalizedCurrently) && !isNaN(row.hospitalizedIncrease);
    });

    const chartDataArray = filteredData.map((row) => [
        row.date,
        parseFloat(row.hospitalizedCurrently),
        parseFloat(row.hospitalizedIncrease),
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

    const filteredData = data.filter(row => {
        return row.hospitalizedCurrently !== null && row.hospitalizedIncrease !== null &&
               !isNaN(row.hospitalizedCurrently) && !isNaN(row.hospitalizedIncrease);
    });

    const chartDataArray = filteredData.map((row) => [
        row.date,
        parseFloat(row.hospitalizedCurrently),
        parseFloat(row.hospitalizedIncrease),
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



// Function to display a confirmation popup for logout
function displayLogoutPopup() {
    const confirmLogout = confirm("Are you sure you want to logout?");
    if (confirmLogout) {
        // Clear user information and display a "Successful logout" message
        sessionStorage.removeItem("user");
        messageArea.textContent = "Successful logout.";
    }
}

// Event listener for "Login to DB" sub-menu
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


// Event listener for "Load DB Data1" submenu
const loadDBData1MenuItem = document.getElementById("load-db-data1");
loadDBData1MenuItem.addEventListener("click", loadDBData1);


// Function to load DB Data1
function loadDBData1() {
    // Check if the user is logged in
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user) {
        console.error("User not logged in");
        return;
    }

    // Send an AJAX request to load_vdv_data1.php
    fetch("load_vdv_data1.php") // Replace with the correct path
        .then(response => response.json())
        .then(responseData => {
            if (responseData.success) {
                // Data loaded successfully, handle the data as needed
                console.log("DB Data1 loaded:", responseData.data);
                // Display data in the Google table
                displayDataInGoogleTable(responseData.data);
            } else {
                // Failed to load data, display an error message
                console.error("Error loading DB Data1:", responseData.message);
            }
        })
        .catch(error => console.error("Error during DB Data1 request:", error));
}

// Function to display data in the Google table
function displayDataInGoogleTable(data) {
    // Load Google Charts API
    google.charts.load("current", { packages: ["table"] });
    google.charts.setOnLoadCallback(drawTable);

    // Callback function to draw the table
    function drawTable() {
        // Create the data table
        const dataTable = new google.visualization.DataTable();

        // Define columns
        dataTable.addColumn("string", "Location");
        dataTable.addColumn("string", "Decommissioned");
        dataTable.addColumn("string", "TaxReturnsFiled");
        dataTable.addColumn("string", "EstimatedPopulation");
        dataTable.addColumn("string", "TotalWages");
        dataTable.addColumn("string", "AvgWages");
        dataTable.addColumn("string", "City");
        dataTable.addColumn("string", "State");

        // Populate rows
        data.forEach(row => {
            dataTable.addRow([
                row.Location,
                row.Decommissioned,
                row.TaxReturnsFiled,
                row.EstimatedPopulation,
                row.TotalWages,
                row.AvgWages,
                row.City,
                row.State
            ]);
        });

        // Set table options
        const tableOptions = {
            showRowNumber: true,
            width: "100%",
            height: "100%"
            // Add more options as needed
        };

        // Instantiate and draw the table
        const table = new google.visualization.Table(document.getElementById("google-table"));
        table.draw(dataTable, tableOptions);
    }
}


// Function to display login popup
function displayLoginPopup() {
    // Prompt the user for login and password
    const username = prompt("Enter your login:");
    const password = prompt("Enter your password:");

    if (username && password) {
        // Prepare the data to send in the request
        const data = {
            userName: username,
            userPassword: password,
        };

        // Send an AJAX request to the login.php file
        fetch("login.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(responseData => {
            if (responseData.success) {
                // Login successful, store user information and show a welcome message
                const user = {
                    uid: responseData.uid,
                    login: responseData.login,
                    name: responseData.name,
                    gender: responseData.gender,
                };

                // Store user information in sessionStorage
                sessionStorage.setItem("user", JSON.stringify(user));

                // Display a welcome message in the message area
                messageArea.textContent = `Welcome, ${user.name}!`;
            } else {
                // Login failed, display an error message
                messageArea.textContent = "Login failed. Please check your credentials.";
            }
        })
        .catch(error => console.error("Error during login:", error));
    }
}

// Replace the following line with code to display the data in the Google table
// function displayDataInGoogleTable(data) {
//    // Your code to display data in the Google table
// }


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



//project 2 cont


});