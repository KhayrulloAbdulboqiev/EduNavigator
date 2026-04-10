<?php
require_once 'core.php';
header("Content-Type: application/json; charset=UTF-8");

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        $subject_id = $_GET['subject_id'] ?? null;
        
        if (!$subject_id) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Missing subject_id."]);
            exit;
        }

        // We find the best attempt for each test per user, and sum them up.
        // Secondary sort: earlier max completion time among those tests.
        $sql = "
            SELECT 
                u.id as user_id, 
                u.name as name, 
                SUM(best_attempts.max_score) as total_score,
                SUM(best_attempts.total_questions) as total_questions,
                MAX(best_attempts.latest_completed) as completed_at
            FROM users u
            JOIN (
                SELECT 
                    r.user_id,
                    t.subject_id,
                    MAX(r.score) as max_score,
                    MAX(r.total_questions) as total_questions,
                    MAX(r.completed_at) as latest_completed
                FROM user_results r
                JOIN tests t ON r.test_id = t.id
                WHERE t.subject_id = ?
                GROUP BY r.user_id, r.test_id, t.subject_id
            ) as best_attempts ON u.id = best_attempts.user_id
            GROUP BY u.id, u.name
            ORDER BY total_score DESC, completed_at ASC
        ";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$subject_id]);
        $leaderboard = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Add simple rank position field
        $rank = 1;
        foreach ($leaderboard as &$row) {
            $row['rank'] = $rank++;
        }
        
        echo json_encode($leaderboard);
    } else {
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        exit;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
