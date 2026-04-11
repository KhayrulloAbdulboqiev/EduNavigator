<?php
require_once 'core.php';
header("Content-Type: application/json; charset=UTF-8");

$method = $_SERVER['REQUEST_METHOD'];
$user_role = $_SESSION['role'] ?? 'user';

try {
    if ($method === 'GET') {
        // Fetch questions for a specific test
        $test_id = $_GET['test_id'] ?? null;
        if (!$test_id) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Test ID is required."]);
            exit;
        }

        // Fetch questions
        $stmt = $pdo->prepare("SELECT * FROM questions WHERE test_id = ?");
        $stmt->execute([$test_id]);
        $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // For each question, fetch options
        foreach ($questions as &$question) {
            $optStmt = $pdo->prepare("SELECT id, option_text, is_correct FROM options WHERE question_id = ?");
            $optStmt->execute([$question['id']]);
            $question['options'] = $optStmt->fetchAll(PDO::FETCH_ASSOC);
        }

        echo json_encode($questions);
    } 
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['test_id'], $data['question_text'], $data['options'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Missing required fields (test_id, question_text, or options)."]);
            exit;
        }

        $pdo->beginTransaction();

        // 1. Insert Question
        $stmt = $pdo->prepare("INSERT INTO questions (test_id, question_text, points) VALUES (?, ?, ?)");
        $stmt->execute([
            $test_id = $data['test_id'],
            $data['question_text'],
            $data['points'] ?? 1
        ]);
        $question_id = $pdo->lastInsertId();

        // 2. Insert Options
        $optStmt = $pdo->prepare("INSERT INTO options (question_id, option_text, is_correct) VALUES (?, ?, ?)");
        foreach ($data['options'] as $option) {
            $optStmt->execute([
                $question_id,
                $option['option_text'],
                (int)($option['is_correct'] ?? false)
            ]);
        }

        $pdo->commit();

        echo json_encode([
            "status" => "success",
            "message" => "Question and options added successfully.",
            "id" => $question_id
        ]);
    }
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
