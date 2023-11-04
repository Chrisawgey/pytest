<?php
$host = "your_database_host"; // Replace with your database host name or IP address
$dbusername = "your_database_username"; // Replace with your database username
$dbpassword = "your_database_password"; // Replace with your database password
$database = "your_database_name"; // Replace with the name of your database

// Create a database connection
$connection = new mysqli($host, $dbusername, $dbpassword, $database);

if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}
?>
