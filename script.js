activity = [{text: 'работа', image: 'https://img.icons8.com/?size=100&id=vDnUS6DqDutj&format=png&color=000000', description: 'Пилите, Шура, пилите!', id: 'work'},
    {text: 'кодинг', image: 'https://img.icons8.com/?size=100&id=zlzd62YNn3Gj&format=png&color=000000', description: 'Пишите, Шура, пишите!', id: 'coding'}
];

cardArr = ['#card-1', '#card-2'];
/*let cardTitle = document.querySelector('.card-title');
if(cardTitle.textContent.length > 8) {
    cardTitle.textContent.style.fontSize = '8px';
} else {
    cardTitle.textContent.style.fontSize = '12px'
}
if(cardTitle.textContent.length == 6) {
    console.log('jjkl');
}*/

for(let i = 0; i <= 1; i = i + 1) {                     //здесь нужно будет поставить размер массива в качестве i
    const img = document.createElement('img');
    img.src = activity[i].image;
    img.alt = activity[i].description;
    img.id = activity[i].id;
    const container = document.querySelector(cardArr[i]);
    img.className += ' card-image'; 

   
    
    container.append(img);
    const h3 = document.createElement('h3');
    h3.textContent = activity[i].text;
    if(h3.textContent.length >= 8) {
        h3.style.fontSize = '8px';
    } else {
        h3.style.fontSize = '14px';
    }
    const containerText = document.querySelector(cardArr[i]);
    h3.className += ' title-in-card';
    container.append(h3);    

       
}

var timeLog = []; //глобальная переменная определенная вне функции, позволила собирать значения в массив
                  //когда timeLog была в функции массив все всемя состоял из одного значения
var timeLogStamp = [];

document.getElementById('work').onclick = function() {
        let timePoint = new Date();
        timeLog.push(timePoint);
        timeLogStamp.push(timePoint.getTime());
        console.log(timeLog);
        console.log(timeLogStamp);
        return timeLog;
 };

 function logForDay() {
    console.log(timeLogStamp); //функция вывода данных за день
 }

 //планирую перенести функцию присваивания учета времени кнопке активности в цикл создания активностей
// пока не получается закинуть в репозиторий... еще попытка... еще попытка2

 

 
