let nav = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

//Deklarerar konstanter för kalendern, tonad bakgrund och pop-up
const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
//Deklarerar konstanter för de alternativ som går att välja
const eventTitleTime = document.getElementById('eventTitleTime');
const eventTitleGame = document.getElementById('eventTitleGame');
const eventTitleCoach = document.getElementById('eventTitleCoach');

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//Funktion för när man klickar på ett datum, innehåller if-satser som filtrerar det som visas i pop-up
function openModal(date) {
  clicked = date;

  const clickedDate = new Date(date);
  const currentTime = new Date(Date.now());

  console.log(clickedDate.getTime());
  console.log(currentTime.getTime());

  if (currentTime < clickedDate) {
    const eventForDay = events.find(e => e.date === clicked);

    if (eventForDay) {
      document.getElementById('eventText').innerText = eventForDay.title;
      deleteEventModal.style.display = 'block';
    } else {
      newEventModal.style.display = 'block';
    }
  
    backDrop.style.display = 'block';
  }
}

//Funktion för kalendern
function load() {
  const dt = new Date();

  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

  document.getElementById('monthDisplay').innerText = 
    `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;

  calendar.innerHTML = '';

  for(let i = 1; i <= paddingDays + daysInMonth; i++) {
    const daySquare = document.createElement('div');
    daySquare.classList.add('day');

    const dayString = `${month + 1}/${i - paddingDays}/${year}`;

    if (i > paddingDays) {
      daySquare.innerText = i - paddingDays;
      const eventForDay = events.find(e => e.date === dayString);

      if (i - paddingDays === day && nav === 0) {
        daySquare.id = 'currentDay';
      }

      if (eventForDay) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = eventForDay.title;
        daySquare.appendChild(eventDiv);
      }

      daySquare.addEventListener('click', () => openModal(dayString));
    } else {
      daySquare.classList.add('padding');
    }

    calendar.appendChild(daySquare);    
  }
}

//Funktion för när man trycker på 'close'
function closeModal() {
  newEventModal.style.display = 'none';
  deleteEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  clicked = null;
  load();
}

//Funktion  för när man trycker på 'save'
function saveEvent() {
  var time_text = eventTitleTime.options[eventTitleTime.selectedIndex].text;
  var game_text = eventTitleGame.options[eventTitleGame.selectedIndex].text;
  var coach_text = eventTitleCoach.options[eventTitleCoach.selectedIndex].text;

  events.push({
    date: clicked,
    title: game_text + ' with ' + coach_text + ', '  + time_text,
  })

  
  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
}

//Funktion för när man trycker på 'delete'
function deleteEvent() {
  events = events.filter(e => e.date !== clicked);
  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
}

//Funktion för att bläddra mellan månader
function initButtons() {
  document.getElementById('nextButton').addEventListener('click', () => {
    nav++;
    load();
  });

  document.getElementById('backButton').addEventListener('click', () => {
    nav--;
    load();
  });

  document.getElementById('saveButton').addEventListener('click', saveEvent);
  document.getElementById('cancelButton').addEventListener('click', closeModal);
  document.getElementById('deleteButton').addEventListener('click', deleteEvent);
  document.getElementById('closeButton').addEventListener('click', closeModal);
}

initButtons();
load();