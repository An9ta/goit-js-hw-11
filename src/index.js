
import './styles.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const API_KEY = '43717619-dd56b7f6e3d741678eb84a8f8';
const URL = `https://pixabay.com/api/?key=${API_KEY}&image_type=photo&orientation=horizontal&safesearch=true`;

let page = 1;
let searchQuery = '';
const lightbox = new SimpleLightbox('.gallery a');
searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);
loadMoreBtn.classList.add('is-hidden');

async function fetchImages() {
  try {
    const response = await axios.get(URL, {
      params: {
        key: API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: page,
      },
    });
    const { hits, totalHits } = response.data;
    if (hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreBtn.classList.add('is-hidden');
    } else if (hits.length > 0 && loadMoreBtn.classList.contains('is-hidden')) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      loadMoreBtn.classList.remove('is-hidden');
    }
    return hits;
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there was an error fetching the images. Please try again.'
    );
    console.log(error);
  }
}

function onSearch(event) {
  event.preventDefault();
  clearGallery();
  searchQuery = event.currentTarget.elements.searchQuery.value.trim();
  page = 1;
  fetchImages()
    .then(renderGallery)
    .catch(error => console.log(error));
}

function onLoadMore() {
  page += 1;
  fetchImages()
    .then(renderGallery)
    .then(getBoundingClientRect)
    .catch(
      Notiflix.Notify(
        "We're sorry, but you've reached the end of search results."
      )
    );
}

function getBoundingClientRect() {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function renderGallery(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <div class="photo-card">
      <a href="${largeImageURL}">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
      </a>
      <div class="info">
      <p class="info-item">
      <b>Likes</b> ${likes}
      </p>
      <p class="info-item">
      <b>Views</b> ${views}
      </p>
      <p class="info-item">
      <b>Comments</b> ${comments}
      </p>
      <p class="info-item">
      <b>Downloads</b> ${downloads}
      </p>
      </div>
      </div>
      `
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function clearGallery() {
  gallery.innerHTML = '';
}

const { height: cardHeight } =
  gallery.firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: 'smooth',
});