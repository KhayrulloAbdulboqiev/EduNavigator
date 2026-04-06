<?php
require_once 'core.php';
header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents("php://input"));

if (isset($data->name) && isset($data->email) && isset($data->password)) {
    $name = htmlspecialchars(strip_tags($data->name));
    $email = htmlspecialchars(strip_tags($data->email));
    $plain_password = $data->password;
    
    // Hash password
    $password_hash = password_hash($plain_password, PASSWORD_BCRYPT);

    try {
        // Check if email exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->rowCount() > 0) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Email already registered."]);
            exit();
        }

        $query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
        $stmt = $pdo->prepare($query);

        if ($stmt->execute([$name, $email, $password_hash])) {
            http_response_code(201);
            echo json_encode(["status" => "success", "message" => "User was created."]);
        } else {
            http_response_code(503);
            echo json_encode(["status" => "error", "message" => "Unable to create user."]);
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Incomplete data. Provide name, email, and password."]);
}
