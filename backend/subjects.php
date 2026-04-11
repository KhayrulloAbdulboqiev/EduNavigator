<?php
require_once 'core.php';
header("Content-Type: application/json; charset=UTF-8");

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM subjects ORDER BY name ASC");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        $color = $data['color_code'] ?? '#0A2540';
        $stmt = $pdo->prepare("INSERT INTO subjects (name, color_code) VALUES (?, ?)");
        $stmt->execute([$data['name'], $color]);
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
    }
    elseif ($method === 'DELETE') {
        $id = $_GET['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing subject ID.']);
            exit;
        }
        $stmt = $pdo->prepare("DELETE FROM subjects WHERE id = ?");
        $stmt->execute([$id]);
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Subject not found.']);
        }
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
