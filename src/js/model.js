import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helpers.js';
import { AJAX } from './helpers.js';
import { elements } from './views/likesView.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
  likes: [],
  likeState: true,
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    console.log(state.recipe);
  } catch (err) {
    // Temp error handling
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 9

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQt = oldQt * newServings / oldServings // 2 * 8 / 4 = 4
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

///////////////////////////////////////////
export const addLike = function (publisher, id, image, title) {
  const like = { publisher, id, image, title };
  state.likes.push(like);

  // Persist data in localStorage
  // this.persistData();

  return like;
};

export const deleteLike = function (id) {
  const index = state.likes.findIndex(el => el.id === id);
  state.likes.splice(index, 1);

  // Persist data in localStorage
  // this.persistData();
};

export const isLiked = function (id) {
  return state.likes.findIndex(el => el.id === id) !== -1;
};

export const getNumLikes = function () {
  return state.likes.length;
};

export const persistData = function () {
  localStorage.setItem('likes', JSON.stringify(state.likes));
};

export const readStorage = function () {
  const storage = JSON.parse(localStorage.getItem('likes'));

  // Restoring likes from the localStorage
  if (storage) state.likes = storage;
};

///////////////////////////////////////////

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient fromat! Please use the correct format :)'
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

// implement the correct panel behavior
// when I click likes, it opens and stays open
// toggle open close like menu
export const openAndCLose = () => {
  //fade out likes menu function
  fade: () => {
    var box = document.getElementById('box');
    var oppArray = [
      '0.9',
      '0.8',
      '0.7',
      '0.6',
      '0.5',
      '0.4',
      '0.3',
      '0.2',
      '0.1',
      '0',
    ];
    var x = 0;
    (function next() {
      elements.likesListing.style.opacity = oppArray[x];
      if (++x < oppArray.length) {
        setTimeout(next, 6); //depending on how fast you want to fade
      }
    })();
  };
};

export const close = () => {
  if (state.likeState == false) {
    elements.likesListing.style.visibility = 'hidden';
    elements.likesListing.style.opacity = 'none';
    console.log('clickclose');
    state.likeState = true;
    openAndCLose.fade();
    return;
  } else {
    return;
  }
};

export const open = () => {
  if (state.likeState) {
    elements.likesListing.style.visibility = 'visible';
    elements.likesListing.style.opacity = '1';
    console.log('clickopen');
    state.likeState = !state.likeState;
    return;
  }
};
