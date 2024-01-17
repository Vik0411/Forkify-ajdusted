export const elements = {
  searchForm: document.querySelector(".search"),
  searchInput: document.querySelector(".search__field"),
  searchRes: document.querySelector(".results"),
  searchResList: document.querySelector(".results__list"),
  searchResPages: document.querySelector(".results__pages"),
  recipe: document.querySelector(".recipe"),
  shopping: document.querySelector(".shopping__list"),
  likesMenu: document.querySelector(".likes__field"),
  likesList: document.querySelector(".likes__list"),
  likesListing: document.querySelector(".likes__panel"),
  likesTop: document.querySelector(".likes"),
  likesItem: document.querySelector(".likes__link:link"),
  likesVisited: document.querySelector(".likes__link:visited"),
  likesActive: document.querySelector(".results__link--active"),
  likesData: document.querySelector(".likes__data"),
  specLikesMenu: document.querySelector(".likes__fieldcz"),
  specLikesList: document.querySelector(".likes__listcz"),
  closeButton: document.querySelector(".close_button"),
  header: document.querySelector(".header"),
};

export const elementStrings = {
  loader: "loader",
};

export const renderLoader = (parent) => {
  const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
  parent.insertAdjacentHTML("afterbegin", loader);
};

export const clearLoader = () => {
  const loader = document.querySelector(`.${elementStrings.loader}`);
  if (loader) loader.parentElement.removeChild(loader);
};
