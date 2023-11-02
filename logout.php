<?php
// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Clear user information from the browser
    $response = array("success" => true, "message" => "Successful logout");
    echo json_encode($response);
}
?>
