<?php
include './dbconfig.php'; // Include the database configuration

$sql = "SELECT name, class_id, project_due_date FROM your_table_name WHERE id = 1"; // Replace 'your_table_name' and '1' with appropriate values
$result = $connection->query($sql);

if ($result->num_rows === 1) {
    $row = $result->fetch_assoc();
    $response = [
        "name" => $row["name"],
        "class_id" => $row["class_id"],
        "project_due_date" => $row["project_due_date"],
    ];
} else {
    $response = ["error" => "Data not found"];
}

header("Content-Type: application/json");
echo json_encode($response);
?>
