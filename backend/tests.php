<?php
require_once 'core.php';
header("Content-Type: application/json; charset=UTF-8");

$method = $_SERVER['REQUEST_METHOD'];
$user_id = $_SESSION['user_id'] ?? null;
$user_role = $_SESSION['role'] ?? 'user';

try {
    if ($method === 'GET') {
        // Fetch tests, optionally filtered by subject_id
        $subject_id = $_GET['subject_id'] ?? null;
        
        if ($subject_id) {
            $stmt = $pdo->prepare("SELECT * FROM tests WHERE subject_id = ? AND is_active = 1 ORDER BY created_at DESC");
            $stmt->execute([$subject_id]);
        } else {
            $stmt = $pdo->query("SELECT t.*, s.name as subject_name FROM tests t JOIN subjects s ON t.subject_id = s.id ORDER BY t.created_at DESC");
        }
        
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['subject_id'], $data['title'], $data['time_limit'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Missing required fields."]);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO tests (subject_id, title, description, time_limit) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $data['subject_id'],
            $data['title'],
            $data['description'] ?? '',
            (int)$data['time_limit']
        ]);

        echo json_encode([
            "status" => "success",
            "message" => "Test created successfully.",
            "id" => $pdo->lastInsertId()
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
