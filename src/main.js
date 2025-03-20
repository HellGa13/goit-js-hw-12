import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import 'loaders.css/loaders.min.css';

// Імпорт функцій з файлів
import { responseData, resetPage } from './js/pixabay-api';
import { renderImages, clearGallery, refreshLightbox } from './js/render-functions';
// Імпорт іконки
import iconSvgError from './img/webp/Group.png';

// Елементи DOM
const form = document.querySelector('.form');
const loaderElement = document.querySelector('.loader');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

// Налаштування повідомлень
const errorMesage = {
  message: 'Sorry, there are no images matching your search query. Please try again!',
  messageColor: '#fff',
  backgroundColor: '#ef4040',
  position: 'topRight',
  iconUrl: iconSvgError,
};

const endMessage = {
  message: "We're sorry, but you've reached the end of search results.",
  messageColor: '#fff',
  backgroundColor: '#ef4040',
  position: 'topRight',
  iconUrl: iconSvgError,
};

// Змінні для пошуку
let totalHits = 0;
let loadedImages = 0;
let query = '';

// Слухачі подій
form.addEventListener('submit', searchImages);
loadMoreBtn.addEventListener('click', loadMoreImages);

// Функція для пошуку зображень
async function searchImages(event) {
  event.preventDefault();
  
  // Отримуємо текст запиту
  query = event.currentTarget.elements.searchQuery.value.trim();
  if (!query) {
    return;
  }

  loaderElement.classList.remove('visually-hidden');
  clearGallery();
  form.reset();
  resetPage();

  loadedImages = 0; // Скидаємо лічильник завантажених зображень

  try {
    const data = await responseData(query);
    if (!data || !data.hits || data.hits.length === 0) {
      iziToast.show(errorMesage);
      loadMoreBtn.classList.add('visually-hidden');
      return;
    }

    const images = data.hits;
    totalHits = data.totalHits;
    loadedImages = images.length;

    renderImages(images);
    refreshLightbox();
    toggleLoadMoreButton(loadedImages, totalHits);
  } catch (error) {
    iziToast.show({
      ...errorMesage,
      message: `An error occurred: ${error.message}`,
    });
  } finally {
    loaderElement.classList.add('visually-hidden');
  }
}

// Функція для завантаження додаткових зображень
async function loadMoreImages() {
  loaderElement.classList.remove('visually-hidden');
  const galleryHeightBefore = gallery.scrollHeight;

  try {
    const data = await responseData(query);
    if (!data || !data.hits || data.hits.length === 0) {
      iziToast.show(errorMesage);
      loadMoreBtn.classList.add('visually-hidden');
      return;
    }

    const images = data.hits;
    loadedImages += images.length;

    renderImages(images);
    refreshLightbox();

    const galleryHeightAfter = gallery.scrollHeight;
    window.scrollBy({
      top: galleryHeightAfter - galleryHeightBefore,
      behavior: 'smooth',
    });

    toggleLoadMoreButton(loadedImages, totalHits);
  } catch (error) {
    iziToast.show({
      ...errorMesage,
      message: `An error occurred: ${error.message}`,
    });
  } finally {
    loaderElement.classList.add('visually-hidden');
  }
}

// Функція для увімкнення/вимкнення кнопки "Load More"
function toggleLoadMoreButton(loaded, total) {
  if (loaded >= total) {
    iziToast.show(endMessage);
    loadMoreBtn.classList.add('visually-hidden');
  } else {
    loadMoreBtn.classList.remove('visually-hidden');
  }
}
