<?php
include 'dbconfig.php'; // Include the database configuration

// Fetch user information from the database
$sql = "SELECT uid, login, name, gender FROM DV_User WHERE user_id = 1"; // Replace 1 with the user ID you want to retrieve
$result = $connection->query($sql);

if ($result && $result->num_rows > 0) {
    $userInfo = $result->fetch_assoc();
    echo json_encode($userInfo);
} else {
    echo json_encode(['error' => 'User not found']);
}

$connection->close();
?>
