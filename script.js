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
        const file = event.target.files[0];

        if (file) {
            Papa.parse(file, {
                header: true,
                dynamicTyping: true,
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


});
