// Function to load and display the specific columns from the CSV data using Google Table
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
                        'date': row.date,
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

                    // Display the filtered data
                    document.getElementById('message-area').innerText = '';
                    const dataTable = new google.visualization.DataTable();
                    dataTable.addColumn('string', 'Date');
                    dataTable.addColumn('string', 'State');
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

                    const table = new google.visualization.Table(document.getElementById('google-table'));
                    table.draw(dataTable, { showRowNumber: true });
                    document.getElementById('message-area').innerText = `Number of records: ${dataTable.getNumberOfRows()}`;
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

// Initialize Google Charts
google.charts.load('current', { 'packages': ['table'] });
google.charts.setOnLoadCallback(() => {
    // Code inside this callback function will run when Google Charts is ready
    // This is where we create and draw the table
});


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
                        // Store user information in browser
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

    // Check if the user is logged in on page load
    const storedUserInfo = localStorage.getItem('user_info');
    if (storedUserInfo) {
        const userInfo = JSON.parse(storedUserInfo);
        document.getElementById('message-area').innerText = `Welcome, ${userInfo.name}!`;
    }
});
