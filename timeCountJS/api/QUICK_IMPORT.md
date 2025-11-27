# Быстрый импорт базы данных

## Самый простой способ (через phpMyAdmin):

1. **Откройте:** http://localhost/phpmyadmin
2. **Нажмите:** вкладка "Импорт" (Import) вверху
3. **Нажмите:** "Выберите файл" (Choose File)
4. **Выберите файл:** `C:\xampp\htdocs\timeCountJS\timeCountJS\api\database.sql`
5. **Нажмите:** "Вперёд" (Go) внизу

✅ Готово! База данных создана.

---

## Если не работает - создайте вручную:

1. **Откройте:** http://localhost/phpmyadmin
2. **Создайте базу:** нажмите "Создать" → имя: `timecount_db` → кодировка: `utf8mb4_unicode_ci`
3. **Выберите базу** `timecount_db` в списке слева
4. **Нажмите:** вкладка "SQL"
5. **Скопируйте и вставьте** этот код:

```sql
CREATE TABLE activities (
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
```

6. **Нажмите:** "Вперёд"

✅ Готово!

---

## Проверка:

Откройте в браузере:
```
http://localhost/timeCountJS/timeCountJS/api/get_statistics.php
```

Должен вернуться JSON ответ - значит всё работает!

