# API для учета времени

## Установка

1. **Создайте базу данных MySQL:**
   - Откройте phpMyAdmin (http://localhost/phpmyadmin)
   - Импортируйте файл `database.sql` или выполните SQL команды вручную
   - Или база создастся автоматически при первом обращении к API

2. **Настройте подключение:**
   - Откройте `config.php`
   - При необходимости измените параметры подключения:
     ```php
     define('DB_HOST', 'localhost');
     define('DB_NAME', 'timecount_db');
     define('DB_USER', 'root');
     define('DB_PASS', '');
     ```

3. **Проверьте работу API:**
   - Откройте в браузере: `http://localhost/timeCountJS/timeCountJS/api/get_statistics.php`
   - Должен вернуться JSON с пустой статистикой

## API Endpoints

### 1. Сохранение одной сессии
**POST** `/api/save_session.php`

**Тело запроса:**
```json
{
    "activity_id": "work",
    "activity_name": "работа",
    "start_time": "2025-01-15 10:00:00",
    "end_time": "2025-01-15 11:30:00",
    "duration_minutes": 90.5
}
```

**Ответ:**
```json
{
    "success": true,
    "session_id": 1,
    "message": "Сессия успешно сохранена"
}
```

### 2. Массовое сохранение сессий
**POST** `/api/save_multiple_sessions.php`

**Тело запроса:**
```json
{
    "sessions": [
        {
            "activity_id": "work",
            "activity_name": "работа",
            "start_time": "2025-01-15 10:00:00",
            "end_time": "2025-01-15 11:30:00",
            "duration_minutes": 90.5
        },
        {
            "activity_id": "coding",
            "activity_name": "кодинг",
            "start_time": "2025-01-15 14:00:00",
            "end_time": "2025-01-15 16:00:00",
            "duration_minutes": 120
        }
    ]
}
```

### 3. Получение статистики
**GET** `/api/get_statistics.php`

**Параметры:**
- `date_from` (опционально) - дата начала в формате Y-m-d (по умолчанию: сегодня)
- `date_to` (опционально) - дата окончания в формате Y-m-d (по умолчанию: сегодня)
- `activity_id` (опционально) - фильтр по конкретной активности

**Пример:**
```
GET /api/get_statistics.php?date_from=2025-01-15&date_to=2025-01-15
```

**Ответ:**
```json
{
    "success": true,
    "period": {
        "date_from": "2025-01-15",
        "date_to": "2025-01-15"
    },
    "total": {
        "sessions": 5,
        "minutes": 450.5,
        "hours": 7.51
    },
    "activities": [
        {
            "activity_id": "work",
            "activity_name": "работа",
            "session_count": 2,
            "total_minutes": 180.5,
            "total_hours": 3.01,
            "avg_minutes": 90.25,
            "first_session": "2025-01-15 09:00:00",
            "last_session": "2025-01-15 17:00:00",
            "sessions": [
                {
                    "id": 1,
                    "start_time": "2025-01-15 09:00:00",
                    "end_time": "2025-01-15 11:00:00",
                    "duration_minutes": 120
                }
            ]
        }
    ]
}
```

## Структура базы данных

### Таблица `activities`
- `id` - уникальный идентификатор сессии
- `activity_id` - ID активности (work, coding, guitar, english)
- `activity_name` - название активности
- `start_time` - время начала сессии
- `end_time` - время окончания сессии
- `duration_minutes` - продолжительность в минутах
- `created_at` - время создания записи

## Безопасность

⚠️ **Важно:** Текущая версия API не имеет аутентификации. Для продакшена рекомендуется:
- Добавить систему авторизации (JWT токены, сессии)
- Валидировать и санитизировать все входные данные
- Использовать HTTPS
- Ограничить CORS для конкретных доменов

## Альтернативные решения

Если PHP не подходит, рассмотрите:
- **Node.js + Express + MySQL/SQLite** - для единого JS стека
- **Supabase/Firebase** - готовый backend-as-a-service
- **Python Flask + SQLite** - простое решение для небольших проектов

