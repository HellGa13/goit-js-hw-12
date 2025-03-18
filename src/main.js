import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import 'loaders.css/loaders.min.css';
// Імпорт функцій з файлів
import { responseData, resetPage } from './js/pixabay-api';
import { renderImages, clearGallery, refreshLightbox } from './js/render-functions';
// Імпорт іконки
import iconSvgError from './img/webp/Group.png';



// Cам код
const form = document.querySelector('.form');
const loaderElement = document.querySelector('.loader');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');


// Налаштування повідомлення про помилку
const errorMesage = {
  message: 'Sorry, there are no images matching your search query. Please try again!',
  messageColor: '#fff',
  backgroundColor: '#ef4040',
  position: 'topRight',
  iconUrl: iconSvgError,
};

// Налаштування повідомлення про кінець пошуку
const endMessage = {
  message: "We're sorry, but you've reached the end of search results.",
  messageColor: '#fff',
  backgroundColor: '#ef4040',
  position: 'topRight',
  iconUrl: iconSvgError,
};


form.addEventListener('submit', searchImages);
loadMoreBtn.addEventListener('click', loadMoreImages);
let totalHits = 0;
let loadedImages = 0;
let query = '';

async function searchImages(event) {
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

  // Очищаємо значення сторінки до 1
  resetPage();

  // Виконуємо запит на сервер
  loadedImages = 0;

  // Виконуємо запит до API для отримання зображень
    try {
      const data = await responseData(query);
      const images = data.hits;
      totalHits = data.totalHits; // Зберігаємо загальну кількість зображень
      loadedImages = images.length; // Зберігаємо кількість завантажених зображень
    if (images.length === 0) {
      iziToast.show(errorMesage);
      loadMoreBtn.classList.add('visually-hidden'); // Ховаємо кнопку "Load more" 
     return;
    }


      // Додаємо отримані зображення в галерею
      renderImages(data.hits);
      refreshLightbox();
    if (loadedImages >= totalHits) {
    // Перевірка на кінець колекції
      iziToast.show(endOfSearch);
      loadMoreBtn.classList.add('visually-hidden');
    } else {
      loadMoreBtn.classList.remove('visually-hidden');
    }
  } catch (error) {
    iziToast.show(errorMesage);
  } finally {
    // Ховаємо лоадер
    loaderElement.classList.add('visually-hidden');
  }
}


async function loadMoreImages() {
  loaderElement.classList.remove('visually-hidden');
  const galleryHeightBefore = gallery.scrollHeight;
  try {
    const data = await responseData(query);
    const images = data.hits;
    loadedImages += images.length;
    if (images.length === 0) {
      iziToast.show(errorMesage);
      loadMoreBtn.classList.add('visually-hidden'); // Ховаємо кнопку "Load more" якщо більше немає зображень
      return;
    }
    renderImages(data.hits);
    refreshLightbox();
    const galleryHeightAfter = gallery.scrollHeight;
    window.scrollBy({
      top: galleryHeightAfter - galleryHeightBefore,
      behavior: 'smooth',
    }); // Прокручуємо сторінку вниз на висоту новозавантажених елементів
    if (loadedImages >= totalHits) {
      // Перевірка на кінець колекції
      iziToast.show(endMessage);
      loadMoreBtn.classList.add('visually-hidden');
    }
  } catch (error) {
    iziToast.show(errorMesage);
  } finally {
    loaderElement.classList.add('visually-hidden');
  }
}