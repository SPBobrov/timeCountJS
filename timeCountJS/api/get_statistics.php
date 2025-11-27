<?php
/**
 * API endpoint для получения статистики по активностям
 * GET параметры:
 *   - date_from: дата начала (Y-m-d)
 *   - date_to: дата окончания (Y-m-d)
 *   - activity_id: фильтр по конкретной активности (опционально)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Обработка preflight запросов
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'config.php';

$pdo = getDBConnection();
if (!$pdo) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка подключения к базе данных']);
    exit;
}

try {
    // Получаем параметры запроса
    $dateFrom = isset($_GET['date_from']) ? $_GET['date_from'] : date('Y-m-d');
    $dateTo = isset($_GET['date_to']) ? $_GET['date_to'] : date('Y-m-d');
    $activityId = isset($_GET['activity_id']) ? $_GET['activity_id'] : null;
    
    // Валидация дат
    if (!strtotime($dateFrom) || !strtotime($dateTo)) {
        http_response_code(400);
        echo json_encode(['error' => 'Неверный формат даты']);
        exit;
    }
    
    // Строим запрос
    $sql = "
        SELECT 
            activity_id,
            activity_name,
            COUNT(*) as session_count,
            SUM(duration_minutes) as total_minutes,
            AVG(duration_minutes) as avg_minutes,
            MIN(start_time) as first_session,
            MAX(end_time) as last_session
        FROM activities
        WHERE DATE(start_time) BETWEEN :date_from AND :date_to
    ";
    
    $params = [
        ':date_from' => $dateFrom,
        ':date_to' => $dateTo
    ];
    
    if ($activityId) {
        $sql .= " AND activity_id = :activity_id";
        $params[':activity_id'] = $activityId;
    }
    
    $sql .= " GROUP BY activity_id, activity_name ORDER BY total_minutes DESC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $statistics = $stmt->fetchAll();
    
    // Получаем детали сессий для каждой активности
    $detailedStats = [];
    foreach ($statistics as $stat) {
        $detailSql = "
            SELECT 
                id,
                start_time,
                end_time,
                duration_minutes
            FROM activities
            WHERE activity_id = :activity_id
            AND DATE(start_time) BETWEEN :date_from AND :date_to
            ORDER BY start_time DESC
        ";
        
        $detailStmt = $pdo->prepare($detailSql);
        $detailStmt->execute([
            ':activity_id' => $stat['activity_id'],
            ':date_from' => $dateFrom,
            ':date_to' => $dateTo
        ]);
        $sessions = $detailStmt->fetchAll();
        
        $detailedStats[] = [
            'activity_id' => $stat['activity_id'],
            'activity_name' => $stat['activity_name'],
            'session_count' => intval($stat['session_count']),
            'total_minutes' => floatval($stat['total_minutes']),
            'total_hours' => round(floatval($stat['total_minutes']) / 60, 2),
            'avg_minutes' => round(floatval($stat['avg_minutes']), 2),
            'first_session' => $stat['first_session'],
            'last_session' => $stat['last_session'],
            'sessions' => $sessions
        ];
    }
    
    // Общая статистика
    $totalSql = "
        SELECT 
            COUNT(*) as total_sessions,
            SUM(duration_minutes) as total_minutes
        FROM activities
        WHERE DATE(start_time) BETWEEN :date_from AND :date_to
    ";
    
    if ($activityId) {
        $totalSql .= " AND activity_id = :activity_id";
    }
    
    $totalStmt = $pdo->prepare($totalSql);
    $totalStmt->execute($params);
    $total = $totalStmt->fetch();
    
    echo json_encode([
        'success' => true,
        'period' => [
            'date_from' => $dateFrom,
            'date_to' => $dateTo
        ],
        'total' => [
            'sessions' => intval($total['total_sessions']),
            'minutes' => floatval($total['total_minutes']),
            'hours' => round(floatval($total['total_minutes']) / 60, 2)
        ],
        'activities' => $detailedStats
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    
} catch (PDOException $e) {
    error_log("Ошибка получения статистики: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка получения данных']);
}

