import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import 'loaders.css/loaders.min.css';

// Імпорт функцій з файлів
import { responseData } from './js/pixabay-api';
import { renderImages, clearGallery } from './js/render-functions';

// Імпорт іконки
import iconSvgError from './img/webp/Group.png';

// Cам код
const form = document.querySelector('.form');
const loaderElement = document.querySelector('.loader');
const gallery = document.querySelector('.gallery');

// Налаштування повідомлення про помилку
const errorMesage = {
  message: 'Sorry, there are no images matching your search query. Please try again!',
  messageColor: '#fff',
  backgroundColor: '#ef4040',
  position: 'topRight',
  iconUrl: iconSvgError,
};

// Ініціалізація галереї
let lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionType: 'attr',
  captionDelay: 250,
  animationSpeed: 350,
  captionPosition: 'bottom',
});

// Додаємо обробники подій на галерею
lightbox.on('show.simplelightbox', function () {});
lightbox.on('error.simplelightbox', function (e) {
  console.log(e);
});


form.addEventListener('submit', searchImages);

function searchImages(event) {
  event.preventDefault();
  // Отримуємо текст запиту з поля вводу
  const query = event.currentTarget.elements.searchQuery.value.trim();
  if (!query) {
    return;
  }

  loaderElement.classList.remove('visually-hidden');
  
  clearGallery();
  // Очищаємо поле вводу
  form.reset();

  // Виконуємо запит до API для отримання зображень
  responseData(query)
    .then(data => {
      const images = data.hits;
      console.log('Отримані дані:', images); // Вивід даних у консоль для перевірки
      if (images.length === 0) {
        iziToast.show(errorMesage);
        return;
      }
      // Додаємо отримані зображення в галерею
      renderImages(data.hits);
      lightbox.refresh();
    })
    // Обробляємо помилки
    .catch(error => {
      iziToast.show(errorMesage);
    })
    // Ховаємо лоадер
    .finally(() => {
      loaderElement.classList.add('visually-hidden');
    });
}
