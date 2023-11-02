<?php
include "dbconfig.php";

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $conn = new mysqli($host, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $username = $_POST['username'];
    $password = $_POST['password'];

    $query = "SELECT uid, login, gender, name from datamining.DV_User where login = '$username' and password ='$password'";

    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $user_info = $result->fetch_assoc();
        // Authentication successful
        $response = array("success" => true, "user_info" => $user_info);
        echo json_encode($response);
    } else {
        // Authentication failed
        $response = array("success" => false, "message" => "Login failed. Invalid credentials.");
        echo json_encode($response);
    }

    // Close the database connection
    $conn->close();
}
?>
