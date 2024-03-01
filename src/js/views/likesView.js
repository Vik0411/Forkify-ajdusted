import View from './View.js';
import { isLiked } from '../model.js';
import { elements } from '../helpers.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class likesView extends View {
  _parentElement = document.querySelector('.header');

  toggleLikeBtn() {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use');
    // .setAttribute('href', `${icons}#${iconString}`);
    // icons.svg#icon-heart-outlined
  }

  // addHandlerRender(handler) {
  //   window.addEventListener('load', handler);
  // }

  toggleLikeMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
  };

  clearResults = () => {
    elements.likesList.innerHTML = '';
  };

  renderLike = like => {
    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.image}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${like.title}</h4>
                    <p class="likes__author">${like.publisher}</p>
                </div>
            </a>
        </li>
    `;
    elements.likesList.insertAdjacentHTML('beforeend', markup);
  };

  deleteLike = id => {
    const el = document.querySelector(
      `.likes__link[href*="${id}"]`
    ).parentElement;
    if (el) el.parentElement.removeChild(el);
  };

  //implement listing through pages
  // type: 'prev' or 'next'
  createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${
    type === 'prev' ? page - 1 : page + 1
  }>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="${icons}#icon-triangle-${
    type === 'prev' ? 'left' : 'right'
  }"></use>
        </svg>
    </button>
`;

  renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);

    let button;
    if (page === 1 && pages > 1) {
      // Only button to go to next page
      button = this.createButton(page, 'next');
    } else if (page < pages) {
      // Both buttons
      button = `
            ${this.createButton(page, 'prev')}
            ${this.createButton(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {
      // Only button to go to prev page
      button = this.createButton(page, 'prev');
    } else {
      button = ``;
    }

    elements.likesList.insertAdjacentHTML('beforeend', button);
  };

  renderLikeResults = (likedLikes, page = 1, resPerPage = 3) => {
    // render results of currente page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    likedLikes.slice(start, end).forEach(this.renderLike);

    // render pagination buttons
    this.renderButtons(page, likedLikes.length, resPerPage);
  };

  // _generateMarkup() {
  //   return this._data
  //     .map(bookmark => previewView.render(bookmark, false))
  //     .join('');
  // }
}

export default new likesView();

/* different way of implementing and close functionality via close element

   export const renderClose = () => {
    elements.header.insertAdjacentHTML('beforeend', createClose);  
};

const createClose = () => `
<div class = "close_button">
<img class = "img-close" src= "img/close.png">
</img>
</div>`;

*/
