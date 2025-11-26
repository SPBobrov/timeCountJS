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
    }
];

// Селекторы карточек
const cardSelectors = ['#card-1', '#card-2'];

// Хранилище данных о времени
const timeLog = [];
const timeLogStamp = [];

/**
 * Определяет размер шрифта на основе длины текста
 * @param {string} text - Текст для проверки
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
 * Обработчик клика по активности для учета времени
 * @param {string} activityId - ID активности
 */
function createTimeLogHandler(activityId) {
    return function() {
        const timePoint = new Date();
        timeLog.push(timePoint);
        timeLogStamp.push(timePoint.getTime());
        console.log('Лог времени:', timeLog);
        console.log('Метки времени:', timeLogStamp);
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
 * Выводит данные за день
 */
function logForDay() {
    console.log('Данные за день:', timeLogStamp);
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
}

// Запуск приложения после загрузки DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
