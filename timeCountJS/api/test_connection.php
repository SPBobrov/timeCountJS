<?php
/**
 * Диагностический скрипт для проверки подключения к базе данных
 * Откройте в браузере: http://localhost/timeCountJS/timeCountJS/api/test_connection.php
 */

header('Content-Type: text/html; charset=utf-8');

echo "<h1>Диагностика подключения к базе данных</h1>";
echo "<pre>";

// Проверка настроек
echo "=== Настройки подключения ===\n";
echo "DB_HOST: " . (defined('DB_HOST') ? DB_HOST : 'НЕ ОПРЕДЕЛЕНО') . "\n";
echo "DB_NAME: " . (defined('DB_NAME') ? DB_NAME : 'НЕ ОПРЕДЕЛЕНО') . "\n";
echo "DB_USER: " . (defined('DB_USER') ? DB_USER : 'НЕ ОПРЕДЕЛЕНО') . "\n";
echo "DB_PASS: " . (defined('DB_PASS') ? (DB_PASS ? '***' : '(пусто)') : 'НЕ ОПРЕДЕЛЕНО') . "\n";
echo "\n";

require_once 'config.php';

// Проверка подключения к MySQL
echo "=== Проверка подключения к MySQL ===\n";
try {
    $mysql = new PDO("mysql:host=" . DB_HOST . ";charset=utf8mb4", DB_USER, DB_PASS);
    $mysql->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "✅ Подключение к MySQL успешно\n";
    
    // Проверка существования базы данных
    $stmt = $mysql->query("SHOW DATABASES LIKE '" . DB_NAME . "'");
    $dbExists = $stmt->rowCount() > 0;
    
    if ($dbExists) {
        echo "✅ База данных '" . DB_NAME . "' существует\n";
    } else {
        echo "⚠️  База данных '" . DB_NAME . "' не существует\n";
        echo "Попытка создать базу данных...\n";
        
        try {
            $mysql->exec("CREATE DATABASE " . DB_NAME . " CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            echo "✅ База данных создана успешно\n";
        } catch (PDOException $e) {
            echo "❌ Ошибка создания базы данных: " . $e->getMessage() . "\n";
        }
    }
    
} catch (PDOException $e) {
    echo "❌ Ошибка подключения к MySQL: " . $e->getMessage() . "\n";
    echo "\nВозможные причины:\n";
    echo "1. MySQL сервер не запущен (проверьте XAMPP)\n";
    echo "2. Неверные учетные данные в config.php\n";
    echo "3. Порт MySQL не стандартный (3306)\n";
    exit;
}

echo "\n";

// Проверка подключения к базе данных
echo "=== Проверка подключения к базе данных ===\n";
$pdo = getDBConnection();
if ($pdo) {
    echo "✅ Подключение к базе данных успешно\n";
    
    // Проверка существования таблицы
    try {
        $stmt = $pdo->query("SHOW TABLES LIKE 'activities'");
        $tableExists = $stmt->rowCount() > 0;
        
        if ($tableExists) {
            echo "✅ Таблица 'activities' существует\n";
            
            // Подсчет записей
            $stmt = $pdo->query("SELECT COUNT(*) as count FROM activities");
            $count = $stmt->fetch()['count'];
            echo "📊 Записей в таблице: " . $count . "\n";
        } else {
            echo "⚠️  Таблица 'activities' не существует\n";
            echo "Попытка создать таблицу...\n";
            
            if (initDatabase()) {
                echo "✅ Таблица создана успешно\n";
            } else {
                echo "❌ Ошибка создания таблицы\n";
            }
        }
    } catch (PDOException $e) {
        echo "❌ Ошибка проверки таблицы: " . $e->getMessage() . "\n";
    }
} else {
    echo "❌ Не удалось подключиться к базе данных\n";
}

echo "\n";
echo "=== Тест API endpoints ===\n";
echo "Проверьте следующие URL в браузере:\n";
echo "1. GET: " . (isset($_SERVER['HTTPS']) ? 'https' : 'http') . "://" . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . "/get_statistics.php\n";
echo "2. POST: " . (isset($_SERVER['HTTPS']) ? 'https' : 'http') . "://" . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . "/save_session.php\n";

echo "</pre>";
echo "<p><a href='get_statistics.php' target='_blank'>Тест: get_statistics.php</a></p>";
?>

