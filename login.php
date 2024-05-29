<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$email = $data['email'];
$password = $data['password'];

$servername = "localhost";
$dbname = "login_sample_db";
$usernameDB = "root";
$passwordDB = ""; // Zmien na swoje hasło

$conn = new mysqli($servername, $usernameDB, $passwordDB, $dbname);

if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Błąd połączenia z bazą danych']));
}

$sql = "SELECT password FROM users WHERE user_id='$email'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    if (password_verify($password, $row['password'])) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Nieprawidłowe hasło']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Nie znaleziono użytkownika']);
}

$conn->close();
?>
