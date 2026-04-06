<?php
require_once 'core.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        // Fetch schedules with joined subject and time_slot details
        $sql = "
            SELECT s.id, s.scheduled_date, s.topic_description, s.teacher,
                   sub.id as subject_id, sub.name as subject_name, sub.color_code,
                   ts.id as time_slot_id, ts.name as time_slot_name, ts.start_time, ts.end_time
            FROM schedule s
            JOIN subjects sub ON s.subject_id = sub.id
            JOIN time_slots ts ON s.time_slot_id = ts.id
            ORDER BY s.scheduled_date ASC, ts.start_time ASC
        ";
        $stmt = $pdo->query($sql);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
    elseif ($method === 'POST') {
        if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Unauthorized: Admin access required']);
            exit();
        }
        $data = json_decode(file_get_contents("php://input"), true);
        
        $stmt = $pdo->prepare("INSERT INTO schedule (scheduled_date, subject_id, time_slot_id, topic_description) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $data['scheduled_date'],
            $data['subject_id'],
            $data['time_slot_id'],
            $data['topic_description'] ?? null
        ]);
        
        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
    }
    elseif ($method === 'DELETE') {
        if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
            http_response_code(403);
            echo json_encode(['error' => 'Unauthorized: Admin access required']);
            exit();
        }
        $id = $_GET['id'] ?? null;
        if ($id) {
            $stmt = $pdo->prepare("DELETE FROM schedule WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true]);
        }
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
