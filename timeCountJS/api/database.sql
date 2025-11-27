-- SQL скрипт для создания базы данных и таблиц
-- Выполните этот скрипт в phpMyAdmin или через командную строку MySQL

CREATE DATABASE IF NOT EXISTS timecount_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE timecount_db;

CREATE TABLE IF NOT EXISTS activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activity_id VARCHAR(50) NOT NULL,
    activity_name VARCHAR(100) NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    duration_minutes DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_activity_id (activity_id),
    INDEX idx_start_time (start_time),
    INDEX idx_created_at (created_at),
    INDEX idx_date_range (start_time, end_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Пример запроса для просмотра данных
-- SELECT * FROM activities ORDER BY start_time DESC LIMIT 10;

-- Пример запроса для статистики за день
-- SELECT 
--     activity_name,
--     COUNT(*) as sessions,
--     SUM(duration_minutes) as total_minutes
-- FROM activities
-- WHERE DATE(start_time) = CURDATE()
-- GROUP BY activity_id, activity_name;

