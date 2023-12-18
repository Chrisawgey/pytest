<?php
include './dbconfig.php'; // Include the database configuration

$postData = json_decode(file_get_contents("php://input"), true);
$username = $postData["userName"];
$password = $postData["userPassword"];

$sql = "SELECT uid, login, name, gender, password FROM DV_User WHERE login = ?";
$stmt = $connection->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $row = $result->fetch_assoc();
    
    // Verify the entered password against the hashed password
    if (password_verify($password, $row["password"])) {
        $response = [
            "success" => true,
            "uid" => $row["uid"],
            "login" => $row["login"],
            "name" => $row["name"],
            "gender" => $row["gender"]
        ];
    } else {
        $response = ["success" => false, "error" => "Invalid password"];
    }
} else {
    $response = ["success" => false, "error" => "User not found"];
}

header("Content-Type: application/json");
echo json_encode($response);

$stmt->close();
?>
