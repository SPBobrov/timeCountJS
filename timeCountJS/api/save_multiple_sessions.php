<?php
/**
 * API endpoint для массового сохранения сессий
 * POST: sessions[] - массив сессий
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Метод не разрешен']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['sessions']) || !is_array($input['sessions'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Отсутствует массив sessions']);
    exit;
}

$pdo = getDBConnection();
if (!$pdo) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка подключения к базе данных']);
    exit;
}

try {
    $pdo->beginTransaction();
    
    $stmt = $pdo->prepare("
        INSERT INTO activities (activity_id, activity_name, start_time, end_time, duration_minutes)
        VALUES (:activity_id, :activity_name, :start_time, :end_time, :duration_minutes)
    ");
    
    $saved = 0;
    $errors = [];
    
    foreach ($input['sessions'] as $index => $session) {
        $required = ['activity_id', 'start_time', 'end_time', 'duration_minutes'];
        $missing = [];
        
        foreach ($required as $field) {
            if (!isset($session[$field])) {
                $missing[] = $field;
            }
        }
        
        if (!empty($missing)) {
            $errors[] = "Сессия #$index: отсутствуют поля: " . implode(', ', $missing);
            continue;
        }
        
        try {
            $stmt->execute([
                ':activity_id' => $session['activity_id'],
                ':activity_name' => isset($session['activity_name']) ? $session['activity_name'] : $session['activity_id'],
                ':start_time' => $session['start_time'],
                ':end_time' => $session['end_time'],
                ':duration_minutes' => floatval($session['duration_minutes'])
            ]);
            $saved++;
        } catch (PDOException $e) {
            $errors[] = "Сессия #$index: " . $e->getMessage();
        }
    }
    
    $pdo->commit();
    
    if ($saved === 0 && !empty($errors)) {
        // Если ничего не сохранено и есть ошибки - возвращаем ошибку
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Не удалось сохранить ни одной сессии',
            'saved' => 0,
            'total' => count($input['sessions']),
            'errors' => $errors
        ], JSON_UNESCAPED_UNICODE);
    } else {
        // Возвращаем результат (может быть частичный успех)
        echo json_encode([
            'success' => true,
            'saved' => $saved,
            'total' => count($input['sessions']),
            'errors' => $errors
        ], JSON_UNESCAPED_UNICODE);
    }
    
} catch (Exception $e) {
    if (isset($pdo)) {
        $pdo->rollBack();
    }
    error_log("Ошибка массового сохранения: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Ошибка сохранения данных: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}

