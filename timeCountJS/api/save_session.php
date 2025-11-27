<?php
/**
 * API endpoint для сохранения сессии активности
 * POST: activity_id, start_time, end_time, duration_minutes
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Обработка preflight запросов
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

// Получаем данные из запроса
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    $input = $_POST;
}

// Валидация данных
$required = ['activity_id', 'start_time', 'end_time', 'duration_minutes'];
foreach ($required as $field) {
    if (!isset($input[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Отсутствует обязательное поле: $field"]);
        exit;
    }
}

$activityId = trim($input['activity_id']);
$activityName = isset($input['activity_name']) ? trim($input['activity_name']) : $activityId;
$startTime = $input['start_time'];
$endTime = $input['end_time'];
$durationMinutes = floatval($input['duration_minutes']);

// Валидация времени
if (!strtotime($startTime) || !strtotime($endTime)) {
    http_response_code(400);
    echo json_encode(['error' => 'Неверный формат времени']);
    exit;
}

$pdo = getDBConnection();
if (!$pdo) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка подключения к базе данных']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO activities (activity_id, activity_name, start_time, end_time, duration_minutes)
        VALUES (:activity_id, :activity_name, :start_time, :end_time, :duration_minutes)
    ");
    
    $stmt->execute([
        ':activity_id' => $activityId,
        ':activity_name' => $activityName,
        ':start_time' => $startTime,
        ':end_time' => $endTime,
        ':duration_minutes' => $durationMinutes
    ]);
    
    $sessionId = $pdo->lastInsertId();
    
    echo json_encode([
        'success' => true,
        'session_id' => $sessionId,
        'message' => 'Сессия успешно сохранена'
    ]);
    
} catch (PDOException $e) {
    error_log("Ошибка сохранения сессии: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка сохранения данных']);
}

