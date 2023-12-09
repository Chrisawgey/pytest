<?php n
include './dbconfig.php'; // Include the database configuration

// Your SQL query to retrieve data from vDV_data2
$sql = "SELECT * FROM vDV_data2"; // Adjust the view name if needed
$result = $connection->query($sql);

// Check if the query was successful
if ($result) {
    $data = $result->fetch_all(MYSQLI_ASSOC);
    header("Content-Type: application/json");
    echo json_encode(["success" => true, "data" => $data]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to load data from vDV_data2"]);
}

$connection->close();
?>
