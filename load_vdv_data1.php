<?php
include './dbconfig.php'; // Include the database configuration

// Your SQL query to retrieve specific columns from vDV_data1
$sql = "SELECT Decommissioned, TaxReturnsFiled, EstimatedPopulation, TotalWages, AvgWages, RecordNumber, Zipcode, City, State FROM vDV_data1";
$result = $connection->query($sql);

// Check if the query was successful
if ($result) {
    $data = $result->fetch_all(MYSQLI_ASSOC);
    header("Content-Type: application/json");
    echo json_encode(["success" => true, "data" => $data]);
} else {
    // Add more error details for debugging
    echo json_encode(["success" => false, "message" => "Failed to load data from vDV_data1", "error" => $connection->error]);
}

$connection->close();
?>
