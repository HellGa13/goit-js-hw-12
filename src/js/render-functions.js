export function renderImages(images) {
  console.log('Дані для рендерингу:', images); // Додано для перевірки даних
  const gallery = document.querySelector('.gallery');
  const galleryArray = images.map(image => {
    const {
      webformatURL,
      largeImageURL,
      likes,
      views,
      tags,
      comments,
      downloads,
    } = image;
    const li = document.createElement('li');
    li.classList.add('gallery-item');
    const link = document.createElement('a');
    link.classList.add('gallery-link');
    link.href = largeImageURL;
    const img = document.createElement('img');
    img.classList.add('gallery-image');
    img.src = webformatURL;
    img.alt = tags;
    img.width = 360;
    img.height = 200;
    li.appendChild(link);
    link.appendChild(img);
    const infoContainer = document.createElement('div');
    infoContainer.classList.add('gallery-item-info');
    infoContainer.innerHTML = `
  <div class="item-info-container">
    <span class="description-name">Likes</span>
    <span class="description-counts">${likes}</span>
  </div>
  <div class="item-info-container">
    <span class="description-name">Views</span>
    <span class="description-counts">${views}</span>
  </div>
  <div class="item-info-container">
    <span class="description-name">Comments</span>
    <span class="description-counts">${comments}</span>
  </div>
  <div class="item-info-container">
    <span class="description-name">Downloads</span>
    <span class="description-counts">${downloads}</span>
  </div>
`;
    li.appendChild(infoContainer);
    return li;
  });
  gallery.append(...galleryArray);
}
export function clearGallery() {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = '';
}