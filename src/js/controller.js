import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import likesView from './views/likesView.js';
import { isLiked } from './model.js';
import { addLike } from './model.js';
import { getNumLikes } from './model.js';
import { elements } from './views/likesView.js';
import { close } from './model.js';
import { open } from './model.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1) Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2) Loading recipe
    await model.loadRecipe(id);

    // 3) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    resultsView.render(model.getSearchResultsPage());

    // 4) Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // 1) Render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

/**
 * LIKE CONTROLLER
 */
const controlLike = () => {
  if (!model.state.likes) model.state.likes = new Likes();
  const currentID = model.state.recipe.id;

  // User has NOT yet liked current recipe
  if (!isLiked(currentID)) {
    // Add like to the state
    const newLike = addLike(
      model.state.recipe.publisher,
      currentID,
      model.state.recipe.image,
      model.state.recipe.title
    );
    // Toggle the like button
    // likesView.toggleLikeBtn(true);

    // Add like to UI list
    likesView.renderLike(newLike);
    // User HAS liked current recipe
    model.persistData();
  } else {
    // Remove like from the state
    model.deleteLike(currentID);
    model.persistData();

    likesView.clearResults();

    // Toggle the like button
    likesView.toggleLikeBtn(false);

    // Remove like from UI list
  }
  likesView.toggleLikeMenu(getNumLikes());
  likesView.clearResults();
  likesView.renderLikeResults(model.state.likes);
};

// // Restore liked recipes on page load
window.addEventListener('load', () => {
  model.addLike(model.state.likes);

  // Restore likes
  model.readStorage();

  //   // Toggle like menu button
  likesView.toggleLikeMenu(model.getNumLikes());

  // Render the existing likes
  likesView.renderLikeResults(model.state.likes);
});

elements.likesList.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline');
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    likesView.clearResults();
    likesView.renderLikeResults(state.likes.likes, goToPage);
    //    $('.likes__panel', '.likes__field').css({'visibility': 'visible', 'opacity': '1'})
  }
});

//open and close likes menu

elements.header.addEventListener('click', e => {
  const btn = e.target.matches('.likes__field');
  if (btn) {
    close();
  }
});

elements.likesMenu.addEventListener('click', open);

elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.recipe__love, .recipe__love *')) {
    // Like controller
    controlLike();
  }
});

/////////////////////////////////////////////////////////

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  likesView.addHandlerRender(controlLike);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();

// /**
//  * SPECLIKE CONTROLLER
//  */

// const controlSpecLike = () => {
//   if (!state.speclikes) state.speclikes = new SpecLikes();
//   const currentID = state.recipe.id;

//   // User has NOT yet liked current recipe
//   if (!state.speclikes.isSpecLiked(currentID)) {
//     // Add like to the state
//     const newSpecLike = state.speclikes.addSpecLike(
//       currentID,
//       state.recipe.title,
//       state.recipe.author,
//       state.recipe.img
//     );
//     // Toggle the like button
//     specLikesView.toggleSpecLikeBtn(true);

//     // Add like to UI list
//     specLikesView.renderSpecLike(newSpecLike);

//     // User HAS liked current recipe
//   } else {
//     // Remove like from the state
//     state.speclikes.deleteSpecLike(currentID);

//     // Toggle the like button
//     specLikesView.toggleSpecLikeBtn(false);

//     // Remove like from UI list
//     specLikesView.deleteSpecLike(currentID);
//   }
//   specLikesView.toggleSpecLikeMenu(state.speclikes.getNumSpecLikes());
// };

// // Restore liked recipes on page load
// window.addEventListener('load', () => {
//   state.speclikes = new SpecLikes();

//   // Restore likes
//   state.speclikes.readStorage();

//   // Toggle like menu button
//   specLikesView.toggleSpecLikeMenu(state.speclikes.getNumSpecLikes());

//   // Render the existing likes
//   state.speclikes.speclikes.forEach(speclike =>
//     specLikesView.renderSpecLike(speclike)
//   );
// });

// // Handling recipe button clicks
// elements.recipe.addEventListener('click', e => {
//   if (e.target.matches('.btn-decrease, .btn-decrease *')) {
//     // Decrease button is clicked
//     if (state.recipe.servings > 1) {
//       state.recipe.updateServings('dec');
//       recipeView.updateServingsIngredients(state.recipe);
//     }
//   } else if (e.target.matches('.btn-increase, .btn-increase *')) {
//     // Increase button is clicked
//     state.recipe.updateServings('inc');
//     recipeView.updateServingsIngredients(state.recipe);
//   } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
//     // Add ingredients to shopping list
//     controlList();
//   } else if (e.target.matches('.recipe__love, .recipe__love *')) {
//     // Like controller
//     controlLike();
//   } else if (
//     e.target.matches('.recipe__love-my-special, .recipe__love-my-special *')
//   ) {
//     // Like controller
//     controlSpecLike();
//   }
// });
