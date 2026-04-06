<?php
require_once 'core.php';

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
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
