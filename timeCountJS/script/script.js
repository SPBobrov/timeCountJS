// Конфигурация активностей
const activities = [
    {
        text: 'работа',
        image: 'https://img.icons8.com/?size=100&id=vDnUS6DqDutj&format=png&color=000000',
        description: 'Пилите, Шура, пилите!',
        id: 'work'
    },
    {
        text: 'кодинг',
        image: 'https://img.icons8.com/?size=100&id=zlzd62YNn3Gj&format=png&color=000000',
        description: 'Пишите, Шура, пишите!',
        id: 'coding'
    },
    {
        text: 'гитара',
        image: 'https://img.icons8.com/?size=100&id=6gikBvLmTJMi&format=png&color=000000',
        description: 'Играйте, Шура, играйте!',
        id: 'guitar'
    },
    {
        text: 'язык',
        image: 'https://img.icons8.com/?size=100&id=5LwuqCwzdOYG&format=png&color=000000',
        description: 'Учите, Шура, учите!',
        id: 'english'
    }
];

// Селекторы карточек
const cardSelectors = ['#card-1', '#card-2', '#card-3', '#card-4'];

// Хранилище данных о времени
// Структура: { activityId: [{ start: Date, end: Date, durationMinutes: number }, ...] }
const activitySessions = {};

// Активные активности (могут быть запущены несколько одновременно)
// Структура: { activityId: startTime, ... }
const activeActivities = {};

/**
 * Возвращает размер шрифта для текста на карточке
 * @param {string} text - Текст
 * @returns {string} - Размер шрифта в пикселях
 */
function getFontSizeByTextLength(text) {
    return text.length >= 8 ? '8px' : '14px';
}

/**
 * Создает элемент изображения для активности
 * @param {Object} activity - Объект активности
 * @returns {HTMLImageElement} - Элемент изображения
 */
function createActivityImage(activity) {
    const img = document.createElement('img');
    img.src = activity.image;
    img.alt = activity.description;
    img.id = activity.id;
    img.className = 'card-image';
    return img;
}

/**
 * Создает заголовок для активности
 * @param {Object} activity - Объект активности
 * @returns {HTMLHeadingElement} - Элемент заголовка
 */
function createActivityTitle(activity) {
    const h3 = document.createElement('h3');
    h3.textContent = activity.text;
    h3.style.fontSize = getFontSizeByTextLength(activity.text);
    h3.className = 'title-in-card';
    return h3;
}

/**
 * Инициализирует карточку активности
 * Функция добавляет активность на карточку:
 * 1. Находит HTML-элемент карточки по селектору
 * 2. Создаёт изображение и заголовок активности
 * 3. Добавляет оба элемента внутрь карточки
 * @param {Object} activity - Объект активности
 * @param {string} cardSelector - Селектор карточки
 */
function initializeActivityCard(activity, cardSelector) {
    const container = document.querySelector(cardSelector);
    if (!container) {
        console.warn(`Карточка не найдена: ${cardSelector}`);
        return;
    }

    const img = createActivityImage(activity);
    const title = createActivityTitle(activity);

    container.append(img, title);
}

/**
 * Вычисляет разницу между двумя датами в минутах
 * @param {Date} startDate - Дата начала
 * @param {Date} endDate - Дата окончания
 * @returns {number} - Разница в минутах (округленная до 2 знаков)
 */
function calculateDurationMinutes(startDate, endDate) {
    const diffMs = endDate - startDate;
    const diffMinutes = diffMs / (1000 * 60);
    return Math.round(diffMinutes * 100) / 100; // Округление до 2 знаков
}

/**
 * Сохраняет сессию на сервер
 * @param {Object} session - Объект сессии
 * @returns {Promise<boolean>}
 */
async function saveSessionToServer(session) {
    const requestData = {
        activity_id: session.activityId,
        activity_name: session.activityName,
        start_time: session.start.toISOString().slice(0, 19).replace('T', ' '),
        end_time: session.end.toISOString().slice(0, 19).replace('T', ' '),
        duration_minutes: session.durationMinutes
    };
    
    // Логирование отправки данных
    console.log('\n📤 ОТПРАВКА ДАННЫХ НА СЕРВЕР');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📍 Endpoint:', 'api/save_session.php');
    console.log('📋 Метод:', 'POST');
    console.log('📦 Данные для отправки:');
    console.log('   • Активность ID:', requestData.activity_id);
    console.log('   • Название:', requestData.activity_name);
    console.log('   • Время начала:', requestData.start_time);
    console.log('   • Время окончания:', requestData.end_time);
    console.log('   • Продолжительность:', requestData.duration_minutes, 'минут');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    try {
        const startTime = Date.now();
        const response = await fetch('api/save_session.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });
        
        const responseTime = Date.now() - startTime;
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ ТРАНЗАКЦИЯ УСПЕШНА');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📊 Ответ сервера:');
            console.log('   • Статус:', response.status, response.statusText);
            console.log('   • ID сессии:', result.session_id);
            console.log('   • Сообщение:', result.message);
            console.log('   • Время ответа:', responseTime + 'мс');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
            return true;
        } else {
            console.error('❌ ОШИБКА ТРАНЗАКЦИИ');
            console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.error('📊 Ответ сервера:');
            console.error('   • Статус:', response.status, response.statusText);
            console.error('   • Ошибка:', result.error);
            console.error('   • Время ответа:', responseTime + 'мс');
            console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
            return false;
        }
    } catch (error) {
        console.error('❌ КРИТИЧЕСКАЯ ОШИБКА ТРАНЗАКЦИИ');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('📊 Детали ошибки:');
        console.error('   • Тип:', error.name);
        console.error('   • Сообщение:', error.message);
        console.error('   • Данные сохранены локально для последующей синхронизации');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        // Сохраняем в локальное хранилище для последующей синхронизации
        saveToLocalStorage(session);
        return false;
    }
}

/**
 * Сохраняет сессию в локальное хранилище браузера
 * @param {Object} session - Объект сессии
 */
function saveToLocalStorage(session) {
    try {
        const pending = JSON.parse(localStorage.getItem('pending_sessions') || '[]');
        pending.push(session);
        localStorage.setItem('pending_sessions', JSON.stringify(pending));
        console.log('Сессия сохранена в локальное хранилище для последующей синхронизации');
    } catch (error) {
        console.error('Ошибка сохранения в локальное хранилище:', error);
    }
}

/**
 * Синхронизирует несохраненные сессии с сервером
 */
async function syncPendingSessions() {
    try {
        const pending = JSON.parse(localStorage.getItem('pending_sessions') || '[]');
        if (pending.length === 0) {
            return;
        }
        
        console.log('\n🔄 СИНХРОНИЗАЦИЯ НЕСОХРАНЕННЫХ СЕССИЙ');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📦 Найдено несохраненных сессий:', pending.length);
        
        const sessions = pending.map(session => ({
            activity_id: session.activityId,
            activity_name: session.activityName,
            start_time: session.start.toISOString().slice(0, 19).replace('T', ' '),
            end_time: session.end.toISOString().slice(0, 19).replace('T', ' '),
            duration_minutes: session.durationMinutes
        }));
        
        // Логирование отправки
        console.log('📤 Отправка на сервер:');
        sessions.forEach((session, index) => {
            console.log(`   ${index + 1}. ${session.activity_name} (${session.duration_minutes} мин) - ${session.start_time}`);
        });
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const startTime = Date.now();
        const response = await fetch('api/save_multiple_sessions.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessions })
        });
        
        const responseTime = Date.now() - startTime;
        const result = await response.json();
        
        if (result.success && result.saved === pending.length) {
            localStorage.removeItem('pending_sessions');
            console.log('✅ СИНХРОНИЗАЦИЯ УСПЕШНА');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📊 Результат:');
            console.log('   • Отправлено:', result.total);
            console.log('   • Сохранено:', result.saved);
            console.log('   • Время ответа:', responseTime + 'мс');
            console.log('   • Локальное хранилище очищено');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        } else {
            console.warn('⚠️  ЧАСТИЧНАЯ СИНХРОНИЗАЦИЯ');
            console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.warn('📊 Результат:');
            console.warn('   • Отправлено:', result.total);
            console.warn('   • Сохранено:', result.saved);
            console.warn('   • Ошибки:', result.errors || []);
            console.warn('   • Время ответа:', responseTime + 'мс');
            console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        }
    } catch (error) {
        console.error('❌ ОШИБКА СИНХРОНИЗАЦИИ');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('📊 Детали ошибки:');
        console.error('   • Тип:', error.name);
        console.error('   • Сообщение:', error.message);
        console.error('   • Сессии остались в локальном хранилище');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    }
}

/**
 * Завершает активность и сохраняет сессию
 * @param {string} activityId - ID активности
 * @param {Date} endTime - Время окончания активности
 */
async function finishActivity(activityId, endTime) {
    if (activeActivities[activityId]) {
        const startTime = activeActivities[activityId];
        const duration = calculateDurationMinutes(startTime, endTime);
        
        // Инициализируем массив для активности, если его еще нет
        if (!activitySessions[activityId]) {
            activitySessions[activityId] = [];
        }
        
        const activity = activities.find(a => a.id === activityId);
        const activityName = activity ? activity.text : activityId;
        
        // Создаем объект сессии
        const session = {
            activityId: activityId,
            activityName: activityName,
            start: new Date(startTime),
            end: new Date(endTime),
            durationMinutes: duration
        };
        
        // Сохраняем локально
        activitySessions[activityId].push(session);
        
        // Сохраняем на сервер
        await saveSessionToServer(session);
        
        // Удаляем из активных
        delete activeActivities[activityId];
        
        console.log(`Завершена активность "${activityName}": ${duration} минут`);
    }
}

/**
 * Завершает все активные активности
 * @param {Date} endTime - Время окончания
 */
async function finishAllActivities(endTime) {
    const activityIds = Object.keys(activeActivities);
    const promises = activityIds.map(activityId => finishActivity(activityId, endTime));
    await Promise.all(promises);
}

/**
 * Обработчик клика по активности для учета времени
 * @param {string} activityId - ID активности
 */
function createTimeLogHandler(activityId) {
    return function() {
        const currentTime = new Date();
        
        // Проверяем, запущена ли уже эта активность
        if (activeActivities[activityId]) {
            // Если активность уже запущена - останавливаем её
            finishActivity(activityId, currentTime);
            const activity = activities.find(a => a.id === activityId);
            const activityName = activity ? activity.text : activityId;
            console.log(`Активность "${activityName}" остановлена`);
        } else {
            // Если активность не запущена - начинаем её
            activeActivities[activityId] = currentTime;
            const activity = activities.find(a => a.id === activityId);
            const activityName = activity ? activity.text : activityId;
            console.log(`Начата активность "${activityName}" в ${currentTime.toLocaleTimeString()}`);
        }
    };
}

/**
 * Инициализирует обработчики событий для всех активностей
 */
function initializeActivityHandlers() {
    activities.forEach(activity => {
        const element = document.getElementById(activity.id);
        if (element) {
            element.addEventListener('click', createTimeLogHandler(activity.id));
        } else {
            console.warn(`Элемент активности не найден: ${activity.id}`);
        }
    });
}

/**
 * Получает статистику с сервера
 * @param {string} dateFrom - Дата начала (Y-m-d)
 * @param {string} dateTo - Дата окончания (Y-m-d)
 * @returns {Promise<Object|null>}
 */
async function getStatisticsFromServer(dateFrom = null, dateTo = null) {
    try {
        const today = new Date().toISOString().split('T')[0];
        const params = new URLSearchParams({
            date_from: dateFrom || today,
            date_to: dateTo || today
        });
        
        const url = `api/get_statistics.php?${params}`;
        
        // Логирование запроса
        console.log('\n📥 ЗАПРОС СТАТИСТИКИ С СЕРВЕРА');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📍 Endpoint:', url);
        console.log('📋 Метод:', 'GET');
        console.log('📅 Параметры:');
        console.log('   • Дата начала:', dateFrom || today);
        console.log('   • Дата окончания:', dateTo || today);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const startTime = Date.now();
        const response = await fetch(url);
        const responseTime = Date.now() - startTime;
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ ДАННЫЕ ПОЛУЧЕНЫ');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📊 Статистика ответа:');
            console.log('   • Статус:', response.status, response.statusText);
            console.log('   • Всего активностей:', result.activities.length);
            console.log('   • Всего сессий:', result.total.sessions);
            console.log('   • Общее время:', result.total.minutes.toFixed(2), 'минут');
            console.log('   • Время ответа:', responseTime + 'мс');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
            return result;
        } else {
            console.error('❌ ОШИБКА ПОЛУЧЕНИЯ ДАННЫХ');
            console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.error('📊 Ответ сервера:');
            console.error('   • Статус:', response.status, response.statusText);
            console.error('   • Ошибка:', result.error);
            console.error('   • Время ответа:', responseTime + 'мс');
            console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
            return null;
        }
    } catch (error) {
        console.error('❌ КРИТИЧЕСКАЯ ОШИБКА ЗАПРОСА');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('📊 Детали ошибки:');
        console.error('   • Тип:', error.name);
        console.error('   • Сообщение:', error.message);
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        return null;
    }
}

/**
 * Выводит данные за день по всем активностям
 */
async function logForDay() {
    console.log('\n========== ДАННЫЕ ЗА ДЕНЬ ==========');
    
    // Сохраняем количество активных активностей до их завершения
    const activeCount = Object.keys(activeActivities).length;
    
    // Завершаем все активные активности
    const endTime = new Date();
    if (activeCount > 0) {
        // Ждем завершения всех активностей
        const promises = Object.keys(activeActivities).map(id => finishActivity(id, endTime));
        await Promise.all(promises);
        console.log(`Завершено активных активностей: ${activeCount}`);
    }
    
    // Синхронизируем несохраненные сессии
    await syncPendingSessions();
    
    // Получаем статистику с сервера
    const today = new Date().toISOString().split('T')[0];
    const serverStats = await getStatisticsFromServer(today, today);
    
    if (serverStats) {
        // Выводим данные с сервера
        console.log(`\n📅 Период: ${serverStats.period.date_from}`);
        console.log(`\n⏱️  ОБЩЕЕ ВРЕМЯ ЗА ДЕНЬ: ${serverStats.total.minutes.toFixed(2)} минут (${serverStats.total.hours.toFixed(2)} часов)`);
        console.log(`📊 Всего сессий: ${serverStats.total.sessions}`);
        
        if (serverStats.activities.length === 0) {
            console.log('\n   Нет записей за этот день');
        } else {
            serverStats.activities.forEach(activity => {
                console.log(`\n📋 ${activity.activity_name.toUpperCase()}:`);
                console.log(`   Всего сессий: ${activity.session_count}`);
                console.log(`   Общее время: ${activity.total_minutes.toFixed(2)} минут (${activity.total_hours.toFixed(2)} часов)`);
                console.log(`   Средняя длительность: ${activity.avg_minutes.toFixed(2)} минут`);
                console.log('   Детали сессий:');
                
                activity.sessions.forEach((session, index) => {
                    const startTime = new Date(session.start_time).toLocaleTimeString('ru-RU');
                    const endTime = new Date(session.end_time).toLocaleTimeString('ru-RU');
                    console.log(`     ${index + 1}. ${startTime} - ${endTime} (${session.duration_minutes} мин)`);
                });
            });
        }
    } else {
        // Если сервер недоступен, выводим локальные данные
        console.log('⚠️  Сервер недоступен, показываю локальные данные:');
        
        let totalTimeAll = 0;
        activities.forEach(activity => {
            const sessions = activitySessions[activity.id];
            
            if (!sessions || sessions.length === 0) {
                console.log(`\n📋 ${activity.text.toUpperCase()}:`);
                console.log('   Нет записей');
                return;
            }
            
            const totalTime = sessions.reduce((sum, session) => sum + session.durationMinutes, 0);
            totalTimeAll += totalTime;
            
            console.log(`\n📋 ${activity.text.toUpperCase()}:`);
            console.log(`   Всего сессий: ${sessions.length}`);
            console.log(`   Общее время: ${totalTime.toFixed(2)} минут (${(totalTime / 60).toFixed(2)} часов)`);
            console.log('   Детали сессий:');
            
            sessions.forEach((session, index) => {
                const startTime = session.start.toLocaleTimeString('ru-RU');
                const endTime = session.end.toLocaleTimeString('ru-RU');
                console.log(`     ${index + 1}. ${startTime} - ${endTime} (${session.durationMinutes} мин)`);
            });
        });
        
        console.log(`\n⏱️  ОБЩЕЕ ВРЕМЯ ЗА ДЕНЬ: ${totalTimeAll.toFixed(2)} минут (${(totalTimeAll / 60).toFixed(2)} часов)`);
    }
    
    console.log('=====================================\n');
}

/**
 * Инициализация приложения
 */
function init() {
    // Создание карточек активностей
    activities.forEach((activity, index) => {
        if (cardSelectors[index]) {
            initializeActivityCard(activity, cardSelectors[index]);
        }
    });

    // Инициализация обработчиков событий
    initializeActivityHandlers();
    
    // Синхронизация несохраненных сессий при загрузке
    syncPendingSessions();
    
    // Периодическая синхронизация (каждые 5 минут)
    setInterval(syncPendingSessions, 5 * 60 * 1000);
}

// Запуск приложения после загрузки DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
