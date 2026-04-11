<?php
require_once 'core.php';
header("Content-Type: application/json; charset=UTF-8");

$method = $_SERVER['REQUEST_METHOD'];
$user_id = $_SESSION['user_id'] ?? null;

if (!$user_id) {
    http_response_code(401);
    echo json_encode(['error' => 'Login required.']);
    exit;
}

try {
    if ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        $post_id = $data['post_id'] ?? null;

        if (!$post_id) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing post_id.']);
            exit;
        }

        // Check if already liked
        $stmt = $pdo->prepare("SELECT id FROM post_likes WHERE user_id = ? AND post_id = ?");
        $stmt->execute([$user_id, $post_id]);
        $existing = $stmt->fetch();

        if ($existing) {
            // Unlike
            $pdo->prepare("DELETE FROM post_likes WHERE user_id = ? AND post_id = ?")->execute([$user_id, $post_id]);
            $liked = false;
        } else {
            // Like
            $pdo->prepare("INSERT INTO post_likes (user_id, post_id) VALUES (?, ?)")->execute([$user_id, $post_id]);
            $liked = true;
        }

        // Get updated like count
        $countStmt = $pdo->prepare("SELECT COUNT(*) as cnt FROM post_likes WHERE post_id = ?");
        $countStmt->execute([$post_id]);
        $like_count = (int)$countStmt->fetchColumn();

        echo json_encode(['liked' => $liked, 'like_count' => $like_count]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
