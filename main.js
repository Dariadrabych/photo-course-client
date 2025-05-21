let token = null;
const BASE_URL = 'https://photo-course-serve5.onrender.com';

// Вхід користувача
async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok && data.token) {
      token = data.token;
      alert('Успішно увійшли');
    } else {
      alert('Помилка входу: ' + (data.error || 'Невідома помилка'));
    }
  } catch (err) {
    alert('Помилка підключення до сервера');
    console.error(err);
  }
}

// Зберегти урок
async function saveLesson() {
  const lessonId = document.getElementById('lessonId').value;

  if (!token) {
    alert('Ви не авторизовані');
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/lessons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        lessonId,
        date: new Date().toISOString()
      })
    });

    const text = await res.text();
    if (res.ok) {
      alert('Урок збережено: ' + text);
    } else {
      alert('Помилка: ' + text);
    }
  } catch (err) {
    alert('Помилка запиту');
    console.error(err);
  }
}

// Завантажити пройдені уроки
async function loadLessons() {
  if (!token) {
    alert('Ви не авторизовані');
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/lessons`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    if (!res.ok) {
      const msg = await res.text();
      alert('Помилка: ' + msg);
      return;
    }

    const data = await res.json();
    const list = document.getElementById('lessonList');
    list.innerHTML = '';

    data.forEach(lesson => {
      let dateText = 'Невідома дата';

      // Перевірка формату дати з Firestore
      if (lesson.date && lesson.date.seconds) {
        const dateObj = new Date(lesson.date.seconds * 1000);
        dateText = dateObj.toLocaleString();
      }

      const li = document.createElement('li');
      li.innerText = `${lesson.lessonId} — ${dateText}`;
      list.appendChild(li);
    });
  } catch (err) {
    alert('Помилка завантаження');
    console.error(err);
  }
}
