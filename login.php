<?php
include './dbconfig.php'; // Include the database configuration

$postData = json_decode(file_get_contents("php://input"), true);
$username = $postData["userName"];
$password = $postData["userPassword"];

$sql = "SELECT uid, login, name, gender FROM DV_User WHERE login = ? AND password = ?";
$stmt = $connection->prepare($sql);
$stmt->bind_param("ss", $username, $password);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $row = $result->fetch_assoc();
    $response = [
        "success" => true,
        "uid" => $row["uid"],
        "login" => $row["login"],
        "name" => $row["name"],
        "gender" => $row["gender"]
    ];
} else {
    $response = ["success" => false];
}

header("Content-Type: application/json");
echo json_encode($response);

$stmt->close();
?>