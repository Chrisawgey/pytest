<?php
// Start the session to access user data
session_start();

// Check if the user is logged in
if (isset($_SESSION['user'])) {
    // Unset and destroy the user session
    session_unset(); // Unset all session variables
    session_destroy(); // Destroy the session
    
    // Redirect to a logged-out page or the login page
    header("Location: login.php");
    exit();
} else {
    // If the user is not logged in, you can redirect to the login page or display a message
    // For example, redirect to the login page:
    header("Location: login.php");
    exit();
}
?>
