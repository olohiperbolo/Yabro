<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$username = $data['username'];
$email = $data['email'];
$password = password_hash($data['password'], PASSWORD_BCRYPT);
$date = date('Y-m-d H:i:s');

$servername = "localhost";
$dbname = "login_sample_db";
$usernameDB = "root";
$passwordDB = ""; // Zmien na swoje hasło

$conn = new mysqli($servername, $usernameDB, $passwordDB, $dbname);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Błąd połączenia z bazą danych']));
}

$sql = "INSERT INTO users (user_name, user_id, password, date) VALUES ('$username', '$email', '$password', '$date')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Błąd przy rejestracji: ' . $conn->error]);
}

$conn->close();
?>
