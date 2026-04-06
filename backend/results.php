<?php
require_once 'core.php';
header("Content-Type: application/json; charset=UTF-8");

$method = $_SERVER['REQUEST_METHOD'];
$user_id = $_SESSION['user_id'] ?? null;

if (!$user_id) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Unauthorized. Please log in."]);
    exit;
}

try {
    if ($method === 'GET') {
        // Fetch results for the logged-in user
        $stmt = $pdo->prepare("SELECT r.*, t.title as test_title FROM user_results r JOIN tests t ON r.test_id = t.id WHERE r.user_id = ? ORDER BY r.completed_at DESC");
        $stmt->execute([$user_id]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } 
    elseif ($method === 'POST') {
        // Save test result
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['test_id'], $data['score'], $data['total_questions'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Missing required fields (test_id, score, or total_questions)."]);
            exit;
        }

        $stmt = $pdo->prepare("INSERT INTO user_results (user_id, test_id, score, total_questions) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $user_id,
            $data['test_id'],
            $data['score'],
            $data['total_questions']
        ]);

        echo json_encode([
            "status" => "success",
            "message" => "Result saved successfully.",
            "id" => $pdo->lastInsertId()
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
