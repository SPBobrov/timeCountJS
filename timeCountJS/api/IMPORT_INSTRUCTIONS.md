# Инструкция по импорту базы данных

## Способ 1: Через phpMyAdmin (Рекомендуется)

### Шаг 1: Откройте phpMyAdmin
1. Запустите XAMPP (Apache и MySQL должны быть активны)
2. Откройте браузер и перейдите по адресу: **http://localhost/phpmyadmin**

### Шаг 2: Импорт файла
1. В левом меню выберите базу данных (или создайте новую, если нужно)
2. Нажмите на вкладку **"Импорт"** (Import) в верхнем меню
3. Нажмите кнопку **"Выберите файл"** (Choose File)
4. Найдите и выберите файл: `api/database.sql`
   - Полный путь: `C:\xampp\htdocs\timeCountJS\timeCountJS\api\database.sql`
5. Убедитесь, что выбран формат **SQL**
6. Нажмите кнопку **"Вперёд"** (Go) внизу страницы

### Шаг 3: Проверка
После успешного импорта вы должны увидеть:
- Сообщение об успешном выполнении
- База данных `timecount_db` появится в списке слева
- Таблица `activities` будет создана

---

## Способ 2: Через командную строку MySQL

### Шаг 1: Откройте командную строку
1. Нажмите `Win + R`
2. Введите `cmd` и нажмите Enter

### Шаг 2: Перейдите в папку MySQL
```bash
cd C:\xampp\mysql\bin
```

### Шаг 3: Выполните импорт
```bash
mysql -u root -p < C:\xampp\htdocs\timeCountJS\timeCountJS\api\database.sql
```

**Примечание:** Если у вас нет пароля для root, используйте:
```bash
mysql -u root < C:\xampp\htdocs\timeCountJS\timeCountJS\api\database.sql
```

---

## Способ 3: Копирование SQL вручную

### Шаг 1: Откройте phpMyAdmin
Перейдите на: **http://localhost/phpmyadmin**

### Шаг 2: Откройте SQL вкладку
1. Выберите базу данных `timecount_db` (или создайте новую)
2. Нажмите на вкладку **"SQL"** в верхнем меню

### Шаг 3: Скопируйте и выполните
1. Откройте файл `api/database.sql` в текстовом редакторе
2. Скопируйте весь SQL код
3. Вставьте в поле SQL запроса в phpMyAdmin
4. Нажмите **"Вперёд"** (Go)

---

## Способ 4: Автоматическое создание (если импорт не работает)

База данных и таблицы создадутся автоматически при первом обращении к API, если в `config.php` правильно настроены параметры подключения.

Просто откройте в браузере:
```
http://localhost/timeCountJS/timeCountJS/api/get_statistics.php
```

---

## Проверка успешного импорта

После импорта проверьте:

1. **В phpMyAdmin:**
   - В левом меню должна появиться база `timecount_db`
   - Внутри должна быть таблица `activities`
   - Таблица должна иметь колонки: id, activity_id, activity_name, start_time, end_time, duration_minutes, created_at

2. **Через API:**
   - Откройте: `http://localhost/timeCountJS/timeCountJS/api/get_statistics.php`
   - Должен вернуться JSON с пустой статистикой (если нет данных)

---

## Возможные проблемы и решения

### Проблема: "База данных уже существует"
**Решение:** Это нормально, скрипт использует `CREATE DATABASE IF NOT EXISTS`, так что ничего не сломается.

### Проблема: "Ошибка доступа"
**Решение:** 
- Убедитесь, что MySQL запущен в XAMPP
- Проверьте логин и пароль в `config.php` (по умолчанию: root, без пароля)

### Проблема: "Файл не найден"
**Решение:** 
- Проверьте путь к файлу
- Убедитесь, что файл `database.sql` находится в папке `api/`

---

## Альтернатива: Создание вручную через phpMyAdmin

Если импорт не работает, создайте вручную:

1. Откройте phpMyAdmin
2. Создайте новую базу данных `timecount_db` с кодировкой `utf8mb4_unicode_ci`
3. Выберите эту базу
4. Перейдите на вкладку SQL
5. Скопируйте и выполните только часть создания таблицы:

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
    INDEX idx_created_at (created_at),
    INDEX idx_date_range (start_time, end_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

