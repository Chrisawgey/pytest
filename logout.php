<?php
// Start the session to access user data
session_start();

// Check if the user is logged in
if (isset($_SESSION['user'])) {
    // Unset all session variables
    session_unset();
    
    // Destroy the session
    session_destroy();

    // Redirect to a logged-out page or the login page
    $redirectPage = "login.php";
    header("Location: $redirectPage");
    exit();
} else {
    // If the user is not logged in, you can redirect to the login page or display a message
    // For example, redirect to the login page:
    $redirectPage = "login.php";
    header("Location: $redirectPage");
    exit();
}
?>
