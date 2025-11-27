# Диагностика проблем с базой данных

## Быстрая проверка

1. **Откройте диагностический скрипт в браузере:**
   ```
   http://localhost/timeCountJS/timeCountJS/api/test_connection.php
   ```
   
   Этот скрипт покажет все проблемы с подключением к базе данных.

## Основные проблемы и решения

### Проблема 1: MySQL сервер не запущен

**Симптомы:**
- Ошибка "Ошибка подключения к MySQL"
- Ошибка "Connection refused"

**Решение:**
1. Откройте панель управления XAMPP
2. Убедитесь, что MySQL запущен (зеленая лампочка)
3. Если не запущен, нажмите кнопку "Start" рядом с MySQL

### Проблема 2: База данных не создана

**Симптомы:**
- Ошибка "Unknown database 'timecount_db'"
- Ошибка 1049 в логах

**Решение:**
База данных должна создаваться автоматически. Если этого не произошло:

1. **Через phpMyAdmin:**
   - Откройте http://localhost/phpmyadmin
   - Нажмите "Создать базу данных"
   - Имя: `timecount_db`
   - Сравнение: `utf8mb4_unicode_ci`
   - Нажмите "Создать"

2. **Или импортируйте SQL файл:**
   - В phpMyAdmin выберите "Импорт"
   - Выберите файл: `timeCountJS/api/database.sql`
   - Нажмите "Вперёд"

### Проблема 3: Неправильные учетные данные

**Симптомы:**
- Ошибка "Access denied for user"
- Ошибка 1045

**Решение:**
1. Откройте файл `timeCountJS/api/config.php`
2. Проверьте и измените при необходимости:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'timecount_db');
   define('DB_USER', 'root');      // Ваш пользователь MySQL
   define('DB_PASS', '');          // Ваш пароль MySQL (обычно пустой для XAMPP)
   ```

### Проблема 4: Таблица не создана

**Симптомы:**
- База данных существует, но таблица `activities` отсутствует

**Решение:**
Таблица должна создаваться автоматически. Если нет:

1. Откройте phpMyAdmin
2. Выберите базу данных `timecount_db`
3. Перейдите на вкладку "SQL"
4. Выполните:
   ```sql
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
       INDEX idx_created_at (created_at)
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
   ```

### Проблема 5: Неправильные пути к API

**Симптомы:**
- Ошибка 404 при обращении к API
- Ошибка "Failed to fetch"

**Решение:**
1. Убедитесь, что HTML файл находится в `timeCountJS/index1.html`
2. Убедитесь, что API файлы находятся в `timeCountJS/api/`
3. Откройте консоль браузера (F12) и проверьте ошибки
4. Проверьте, что Apache запущен в XAMPP

## Проверка работы API

### Тест 1: Получение статистики
Откройте в браузере:
```
http://localhost/timeCountJS/timeCountJS/api/get_statistics.php
```

Должен вернуться JSON:
```json
{
    "success": true,
    "period": {...},
    "total": {...},
    "activities": []
}
```

### Тест 2: Сохранение сессии
Используйте инструмент для тестирования API (Postman, curl, или консоль браузера):

```javascript
fetch('http://localhost/timeCountJS/timeCountJS/api/save_session.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        activity_id: 'work',
        activity_name: 'работа',
        start_time: '2025-01-15 10:00:00',
        end_time: '2025-01-15 11:00:00',
        duration_minutes: 60
    })
})
.then(r => r.json())
.then(console.log);
```

## Логи ошибок

Ошибки PHP записываются в:
- XAMPP: `C:\xampp\apache\logs\error.log`
- Или проверьте настройки `error_log` в `php.ini`

## После исправления

1. Обновите страницу приложения
2. Попробуйте запустить активность
3. Нажмите "Данные за день" для проверки сохранения

