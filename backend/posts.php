<?php
require_once 'core.php';
header("Content-Type: application/json; charset=UTF-8");

$method = $_SERVER['REQUEST_METHOD'];
$user_id = $_SESSION['user_id'] ?? null;
$user_role = $_SESSION['role'] ?? 'user';

// Helper: ensure uploads directory exists
$upload_dir = __DIR__ . '/uploads/posts/';
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

try {
    if ($method === 'GET') {
        // Fetch all posts with like count and whether current user liked
        $sql = "
            SELECT 
                p.*,
                u.name as author_name,
                COUNT(DISTINCT pl.id) as like_count,
                MAX(CASE WHEN pl.user_id = :uid THEN 1 ELSE 0 END) as user_liked
            FROM news p
            LEFT JOIN users u ON p.author_id = u.id
            LEFT JOIN post_likes pl ON p.id = pl.post_id
            GROUP BY p.id
            ORDER BY p.created_at DESC
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':uid' => $user_id ?? 0]);
        $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Cast types
        foreach ($posts as &$post) {
            $post['like_count'] = (int)$post['like_count'];
            $post['user_liked'] = (bool)$post['user_liked'];
        }

        echo json_encode($posts);
    }
    elseif ($method === 'POST') {
        // Admin only
        // if ($user_role !== 'admin') {
        //     http_response_code(403);
        //     echo json_encode(['error' => 'Admin access required.']);
        //     exit;
        // }

        $content = $_POST['content'] ?? '';
        $media_url = null;
        $media_type = 'none';

        // Handle file upload
        if (!empty($_FILES['media']['name'])) {
            $file = $_FILES['media'];
            $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            $allowed_img = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
            $allowed_vid = ['mp4', 'webm', 'ogg'];

            if (in_array($ext, $allowed_img)) {
                $media_type = 'image';
            } elseif (in_array($ext, $allowed_vid)) {
                $media_type = 'video';
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Unsupported file type.']);
                exit;
            }

            $filename = uniqid('post_', true) . '.' . $ext;
            $filepath = $upload_dir . $filename;

            if (!move_uploaded_file($file['tmp_name'], $filepath)) {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to save uploaded file.']);
                exit;
            }

            $media_url = '/api/uploads/posts/' . $filename;
        }

        if (!$content && !$media_url) {
            http_response_code(400);
            echo json_encode(['error' => 'Post must have content or media.']);
            exit;
        }

        $title = ''; // Empty title for news feed post
        $stmt = $pdo->prepare("INSERT INTO news (title, author_id, content, media_url, media_type) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$title, $user_id, $content, $media_url, $media_type]);

        echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
    }
    // elseif ($method === 'DELETE') {
    //     if ($user_role !== 'admin') {
    //         http_response_code(403);
    //         echo json_encode(['error' => 'Admin access required.']);
    //         exit;
    //     }

        $id = $_GET['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing post ID.']);
            exit;
        }

        // Get media_url to delete file
        $stmt = $pdo->prepare("SELECT media_url FROM news WHERE id = ?");
        $stmt->execute([$id]);
        $post = $stmt->fetch();

        if ($post && $post['media_url']) {
            $file_path = __DIR__ . str_replace('/api', '', $post['media_url']);
            if (file_exists($file_path)) {
                unlink($file_path);
            }
        }

        $stmt = $pdo->prepare("DELETE FROM news WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode(['success' => true]);
    }
    catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
