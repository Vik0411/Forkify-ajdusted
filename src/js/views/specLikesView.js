import { elements } from "./base";
import { limitRecipeTitle } from "./searchView";

export const toggleSpecLikeBtn = (isSpecLiked) => {
  const iconString = isSpecLiked ? "icon-heart" : "icon-heart-outlined";
  document
    .querySelector(".recipe__love-my-special use")
    .setAttribute("href", `img/icons.svg#${iconString}`);
  // icons.svg#icon-heart-outlined
};

export const toggleSpecLikeMenu = (numSpecLikes) => {
  elements.specLikesMenu.style.visibility =
    numSpecLikes > 0 ? "visible" : "hidden";
};

export const renderSpecLike = (specLike) => {
  const markup = `
        <li>
            <a class="likes__link" href="#${specLike.id}">
                <figure class="likes__fig">
                    <img src="${specLike.img}" alt="${specLike.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTitle(
                      specLike.title
                    )}</h4>
                    <p class="likes__author">${specLike.author}</p>
                </div>
            </a>
        </li>
    `;
  elements.specLikesList.insertAdjacentHTML("beforeend", markup);
};

export const deleteSpecLike = (id) => {
  const el = document.querySelector(
    `.likes__link[href*="${id}"]`
  ).parentElement;
  if (el) el.parentElement.removeChild(el);
};
