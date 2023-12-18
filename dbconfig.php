<?php
$host = "imc.kean.edu"; // Replace with your database host name or IP address
$dbusername = "altamiad"; // Replace with your database username
$dbpassword = "1144588"; // Replace with your database password
$database = "datamining"; // Replace with the name of your database

// Create a database connection
$connection = new mysqli($host, $dbusername, $dbpassword, $database);

if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}
?>

