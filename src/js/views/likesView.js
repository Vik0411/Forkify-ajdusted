import { elements } from "./base";
import { limitRecipeTitle } from "./searchView";

export const toggleLikeBtn = (isLiked) => {
  const iconString = isLiked ? "icon-heart" : "icon-heart-outlined";
  document
    .querySelector(".recipe__love use")
    .setAttribute("href", `/dist/img/icons.svg#${iconString}`);
  // icons.svg#icon-heart-outlined
};

export const toggleLikeMenu = (numLikes) => {
  elements.likesMenu.style.visibility = numLikes > 0 ? "visible" : "hidden";
};

export const clearResults = () => {
  elements.likesList.innerHTML = "";
};

export const renderLike = (like) => {
  const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>
    `;
  elements.likesList.insertAdjacentHTML("beforeend", markup);
};

export const deleteLike = (id) => {
  const el = document.querySelector(
    `.likes__link[href*="${id}"]`
  ).parentElement;
  if (el) el.parentElement.removeChild(el);
};

//implement listing through pages

// type: 'prev' or 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${
  type === "prev" ? page - 1 : page + 1
}>
        <span>Page ${type === "prev" ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="/dist/img/icons.svg#icon-triangle-${
              type === "prev" ? "left" : "right"
            }"></use>
        </svg>
    </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
  const pages = Math.ceil(numResults / resPerPage);

  let button;
  if (page === 1 && pages > 1) {
    // Only button to go to next page
    button = createButton(page, "next");
  } else if (page < pages) {
    // Both buttons
    button = `
            ${createButton(page, "prev")}
            ${createButton(page, "next")}
        `;
  } else if (page === pages && pages > 1) {
    // Only button to go to prev page
    button = createButton(page, "prev");
  }

  elements.likesList.insertAdjacentHTML("beforeend", button);
};

export const renderLikeResults = (likedLikes, page = 1, resPerPage = 5) => {
  // render results of currente page
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;
  likedLikes.slice(start, end).forEach(renderLike);

  // render pagination buttons
  renderButtons(page, likedLikes.length, resPerPage);
};

// implement the correct panel behavior
// when I click likes, it opens and stays open
//toggle open close like menu
export const openAndCLose = {
  //fade out likes menu function
  fade: function () {
    var box = document.getElementById("box");
    var oppArray = [
      "0.9",
      "0.8",
      "0.7",
      "0.6",
      "0.5",
      "0.4",
      "0.3",
      "0.2",
      "0.1",
      "0",
    ];
    var x = 0;
    (function next() {
      elements.likesListing.style.opacity = oppArray[x];
      if (++x < oppArray.length) {
        setTimeout(next, 6); //depending on how fast you want to fade
      }
    })();
  },

  state: true,

  close: function () {
    if (openAndCLose.state == false) {
      elements.likesListing.style.visibility = "hidden";
      elements.likesListing.style.opacity = "none";
      console.log("clickclose");
      openAndCLose.state = true;
      openAndCLose.fade();
      return;
    } else {
      return;
    }
  },

  open: () => {
    if (openAndCLose.state) {
      elements.likesListing.style.visibility = "visible";
      elements.likesListing.style.opacity = "1";
      console.log("clickopen");
      openAndCLose.state = !openAndCLose.state;
      return;
    }
  },
};

/* different way of implementing and close functionality via close element

   export const renderClose = () => {
    elements.header.insertAdjacentHTML('beforeend', createClose);  
};

const createClose = () => `
<div class = "close_button">
<img class = "img-close" src= "/dist/img/close.png">
</img>
</div>`;

*/
