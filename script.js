// Initialize Google Charts with the required packages
google.charts.load('current', { 'packages': ['corechart', 'table'] });

let dataTable; // Declare dataTable globally

function loadCSVData(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const csvText = e.target.result;

        // Use PapaParse to parse the CSV data
        Papa.parse(csvText, {
            header: true,  // Treat the first row as column headers
            skipEmptyLines: true,  // Skip empty lines
            complete: function (results) {
                const data = results.data;

                if (data.length > 0) {
                    // Map the specific columns you want to display
                    const filteredData = data.map(row => ({
                        'date': new Date(row.date), // Convert to Date object
                        'state': row.state,
                        'death': parseFloat(row.death),
                        'deathConfirmed': parseFloat(row.deathConfirmed),
                        'deathIncrease': parseFloat(row.deathIncrease),
                        'hospitalizedCurrently': parseFloat(row.hospitalizedCurrently),
                        'hospitalizedIncrease': parseFloat(row.hospitalizedIncrease),
                        'positive': parseFloat(row.positive),
                        'positiveIncrease': parseFloat(row.positiveIncrease),
                        'totalTestResults': parseFloat(row.totalTestResults)
                    }));

                    // Initialize dataTable
                    dataTable = new google.visualization.DataTable();
                    dataTable.addColumn('date', 'Date'); // Use 'date' type
                    dataTable.addColumn('string', 'State'); // Use 'string' type
                    dataTable.addColumn('number', 'Death');
                    dataTable.addColumn('number', 'Death Confirmed');
                    dataTable.addColumn('number', 'Death Increase');
                    dataTable.addColumn('number', 'Hospitalized Currently');
                    dataTable.addColumn('number', 'Hospitalized Increase');
                    dataTable.addColumn('number', 'Positive');
                    dataTable.addColumn('number', 'Positive Increase');
                    dataTable.addColumn('number', 'Total Test Results');

                    filteredData.forEach(row => {
                        dataTable.addRow([
                            row.date,
                            row.state,
                            row.death,
                            row.deathConfirmed,
                            row.deathIncrease,
                            row.hospitalizedCurrently,
                            row.hospitalizedIncrease,
                            row.positive,
                            row.positiveIncrease,
                            row.totalTestResults
                        ]);
                    });

                    // Display the filtered data and the number of records
                    const table = new google.visualization.Table(document.getElementById('google-table'));
                    table.draw(dataTable, { showRowNumber: true });
                    document.getElementById('message-area').innerText = `Number of records: ${filteredData.length}`;

                    // Now that the table is loaded, call generateGoogleChart
                    const selectedDataChoice = getSelectedDataChoice();
                    const chartType = 'line'; // Change this to 'line' or 'bar' as needed
                    generateGoogleChart(selectedDataChoice, chartType);
                } else {
                    // No data in the CSV
                    document.getElementById('google-table').innerHTML = '';
                    document.getElementById('message-area').innerText = "No data found in the CSV file.";
                }
            },
            error: function (error) {
                // Error parsing the CSV
                document.getElementById('google-table').innerHTML = '';
                document.getElementById('message-area').innerText = "Error loading the CSV file.";
            }
        });
    };

    reader.readAsText(file);
}

// Handle file input and trigger data loading
const fileInput = document.getElementById('file-input');

document.getElementById('load-csv-file').addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
        loadCSVData(selectedFile);
    }
});

/// Define and implement the generateGoogleChart function
function generateGoogleChart(dataChoice, chartType) {
    if (!dataTable) {
        displayMessage("Data table is not defined.");
        return;
    }

    // Ensure the chart is using the correct data columns for the "Deaths" category
    let columnsToDisplay = ["Date", "State", "Death", "DeathConfirmed"]; // Remove spaces from column names
    if (dataChoice !== "Deaths") {
        displayMessage(`Unsupported data choice: ${dataChoice}`);
        return;
    }

    const columnIndices = columnsToDisplay.map(column => getColumnIndex(column));

    if (columnIndices.some(index => index === -1)) {
        displayMessage("One or more columns not found in the data table.");
        return;
    }

    // Define the DataTable structure for the chart
    const chartData = new google.visualization.DataTable();

    // Extract the data from the dataTable
    const chartDataTable = [];
    const numRows = dataTable.getNumberOfRows();
    for (let i = 0; i < numRows; i++) {
        const data = columnIndices.map(index => dataTable.getValue(i, index));
        chartDataTable.push(data);
    }

    // Add columns to the DataTable
    columnsToDisplay.forEach(column => {
        chartData.addColumn(typeof dataTable.getValue(0, getColumnIndex(column)), column);
    });

    // Set the data in the DataTable
    chartData.addRows(chartDataTable);

    // Set chart options
    const chartOptions = {
        title: `Data Visualization for ${dataChoice}`,
        height: 400,
    };

    let chart;
    switch (chartType) {
        case 'line':
            chart = new google.visualization.LineChart(document.getElementById('graph-display'));
            break;
        case 'bar':
            chart = new google.visualization.BarChart(document.getElementById('graph-display'));
            break;
        default:
            displayMessage(`Unsupported chart type: ${chartType}`);
            return;
    }

    chart.draw(chartData, chartOptions);
}




// Helper function to get the column index from the DataTable
function getColumnIndex(columnName) {
    const numCols = dataTable.getNumberOfColumns();
    for (let i = 0; i < numCols; i++) {
        if (dataTable.getColumnLabel(i) === columnName) {
            return i;
        }
    }
    return -1;
}

document.addEventListener("DOMContentLoaded", function () {
    // Function to display a login dialog and authenticate the user
    function loginToDB() {
        const username = prompt("Enter your username:");
        const password = prompt("Enter your password:");

        if (username && password) {
            // Send an HTTP request to the server for authentication
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'login.php', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    if (response.success) {
                        // Authentication successful
                        // Store user information in the browser
                        localStorage.setItem('user_info', JSON.stringify(response.user_info));
                        document.getElementById('message-area').innerText = `Welcome, ${response.user_info.name}!`;
                    } else {
                        // Authentication failed
                        document.getElementById('message-area').innerText = "Login failed. Invalid credentials.";
                    }
                }
            };
            const data = `username=${username}&password=${password}`;
            xhr.send(data);
        }
    }

    // Function to log out the user
    function logoutDB() {
        if (confirm("Are you sure you want to log out?")) {
            // Clear user information from the browser
            localStorage.removeItem('user_info');
            document.getElementById('message-area').innerText = "Successful logout";
        }
    }

    // Handle the "Login to DB" click event
    document.getElementById('login-to-db').addEventListener('click', loginToDB);

    // Handle the "Logout DB" click event
    document.getElementById('logout-db').addEventListener('click', logoutDB);

    // Handle the "Exit" click event
    document.getElementById('exit-app').addEventListener('click', function () {
        // Close the current browser tab or window
        window.close();
    });

    // Check if the user is logged in on page load
    const storedUserInfo = localStorage.getItem('user_info');
    if (storedUserInfo) {
        const userInfo = JSON.parse(storedUserInfo);
        document.getElementById('message-area').innerText = `Welcome, ${userInfo.name}!`;
    }
});

// Function to display a message in the graph area
function displayMessage(message) {
    document.getElementById('graph-display').innerHTML = `<p>${message}</p>`;
}


// Function to handle the sub-menu click event in the "View" menu
function viewSubMenuClickHandler(event) {
    // Check if data is loaded
    const table = document.getElementById('google-table');
    if (!table || table.getElementsByTagName('tr').length <= 1) {
        document.getElementById('message-area').innerText = "Please load data first";
        return;
    }

    const selectedDataChoice = getSelectedDataChoice();
    const chartType = event.target.innerText.toLowerCase();

    // Check if the selected chart type is allowed for the data choice
    if (isChartAllowed(selectedDataChoice, chartType)) {
        generateGoogleChart(selectedDataChoice, chartType);
    } else {
        document.getElementById('message-area').innerText = `Chart type '${chartType}' is not allowed for '${selectedDataChoice}' data`;
    }
}

// Add event listeners to submenu items under the "View" menu
const viewSubMenuItems = document.querySelectorAll('#view-menu .submenu li');
for (const subMenuItem of viewSubMenuItems) {
    subMenuItem.addEventListener('click', viewSubMenuClickHandler);
}

// Helper function to get the selected data choice from the radio buttons
function getSelectedDataChoice() {
    const dataChoiceRadios = document.getElementsByName('graph-choice');
    for (const radio of dataChoiceRadios) {
        if (radio.checked) {
            return radio.value;
        }
    }
    return null;
}

// Helper function to check if the chart is allowed for the selected data choice
function isChartAllowed(dataChoice, chartType) {
    // Define which chart types are allowed for each data choice
    const allowedCharts = {
        'Deaths': ['bar', 'line'],
        'Total Test Results': ['bar', 'line'],
        'State': ['bar', 'pie'],
    };

    return allowedCharts[dataChoice] && allowedCharts[dataChoice].includes(chartType);
}
