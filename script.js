document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("file-input");
    const googleTableContainer = document.getElementById("google-table-container");
    const messageArea = document.getElementById("message-area");
    let loadedData = null; // Track loaded data
    let selectedGraph = null; // Track selected radio button
    let chartContainer = document.getElementById("chart-container"); // Element for the chart
    let chartErrorMessage = document.getElementById("chart-error-message"); // New element for the error message

    // Load the Google Charts library and set callback
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
    
            if (choice === "Line" || choice === "Bar") {
                if (isChartAllowedForChoice(choice)) {
                    if (choice === "Line") {
                        displayLineChart(loadedData);
                    } else if (choice === "Bar") {
                        displayBarChart(loadedData);
                    }
                    chartErrorMessage.style.display = "none"; // Hide error message
                    messageArea.textContent = `Displaying ${choice} Chart for ${selectedGraph}`;
                } else {
                    // Hide the chart and display an error message for unsupported options
                    chartContainer.style.display = "none";
                    chartErrorMessage.textContent = "Chart type not supported for this option.";
                    chartErrorMessage.style.display = "block"; // Show error message
                }
            } else {
                // This choice is not "Line" or "Bar"
                // Display a message in the "graph-display" section
                chartContainer.style.display = "none";
                chartErrorMessage.style.display = "none";
                messageArea.textContent = "Not Applicable";
            }
        }
    });
    
    // Function to check if a chart is allowed for the selected choice
    function isChartAllowedForChoice(choice) {
        return choice === "Line" || choice === "Bar";
    }

    // Chart creation functions
    function displayBarChart(data) {
        const chartData = prepareBarChartData(data);
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

    function displayLineChart(data) {
        const chartData = prepareLineChartData(data);
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

// Helper function to prepare data for Bar Chart
function prepareBarChartData(data) {
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
        row.deathProbable
    ]);

    chartData.addRows(chartDataArray);

    return chartData;
}

// Helper function to prepare data for Line Chart
function prepareLineChartData(data) {
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
        row.deathProbable
    ]);

    chartData.addRows(chartDataArray);

    return chartData;
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
});

    // Helper function to prepare data for Bar Chart
    function prepareBarChartData(data) {
        const chartData = new google.visualization.DataTable();
        chartData.addColumn("string", "Date");
        chartData.addColumn("number", "Deaths");

        const chartDataArray = data.map((row) => [row.date, row.deaths]);
        chartData.addRows(chartDataArray);

        return chartData;
    }

    // Helper function to prepare data for Line Chart
    function prepareLineChartData(data) {
        const chartData = new google.visualization.DataTable();
        chartData.addColumn("string", "Date");
        chartData.addColumn("number", "Deaths");

        const chartDataArray = data.map((row) => [row.date, row.deaths]);
        chartData.addRows(chartDataArray);

        return chartData;
    }

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
    const chartErrorMessage = document.getElementById("chart-error-message"); // New element for the error message
    const chartContainer = document.getElementById("chart-container"); // Element for the chart

    viewMenu.addEventListener("click", function (event) {
        if (event.target.tagName === "A" && selectedGraph) {
            const choice = event.target.textContent;
    
            if (selectedGraph === "Deaths" && choice !== "Bar" && choice !== "Line") {
                // Display a "Not Applicable" message in the "graph-display" section
                chartContainer.style.display = "none";
                chartErrorMessage.textContent = "Not Applicable for Deaths";
                chartErrorMessage.style.display = "block";
                messageArea.textContent = ""; // Clear the message area
            } else {
                if (isChartAllowedForChoice(choice)) {
                    if (choice === "Line") {
                        displayLineChart(loadedData);
                    } else if (choice === "Bar") {
                        displayBarChart(loadedData);
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
    
    // Function to check if a chart is allowed for the selected choice
    function isChartAllowedForChoice(choice) {
        return choice === "Line" || choice === "Bar";
    }

    // Function to display Bar Chart
    function displayBarChart(data) {
        const chartData = prepareBarChartData(data);
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

    // Function to display Line Chart
    function displayLineChart(data) {
        const chartData = prepareLineChartData(data);
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
