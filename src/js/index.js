import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import SpecLikes from './models/SpecLikes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import * as specLikesView from './views/specLikesView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};

/** 
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput();

    if (query) {
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4) Search for recipes
            await state.search.getResults();
    
            // 5) Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
            console.log(state.search.result)
        } catch (err) {
            alert('Something wrong with the search...');
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});


elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});


/** 
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
    // Get ID from url
    const id = window.location.hash.replace('#', '');

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight selected search item
        if (state.search) searchView.highlightSelected(id);

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
    
            // Render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id),
                state.speclikes.isSpecLiked(id)
            );

        } catch (err) {
            console.log(err);
            alert('Error processing recipe!');
        }
    }
};
 
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


/** 
 * LIST CONTROLLER
 */
const controlList = () => {
    // Create a new list IF there in none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);

    // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});


/** 
 * LIKE CONTROLLER
 */
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            state.recipe.author,
            currentID,
            state.recipe.img,
            state.recipe.title,
        );
        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to UI list
        likesView.renderLike(newLike)
    // User HAS liked current recipe
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);
        likesView.clearResults();

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    likesView.clearResults()
    likesView.renderLikeResults(state.likes.likes)
   
};

// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();
    
    // Restore likes
    state.likes.readStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing likes
    likesView.renderLikeResults(state.likes.likes);
    
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

// implement the correct panel behavior
// 1. when I click likes, it opens and stays open

const showClick = () => {
    console.log("clickedclose");
}

/*
const openDaLikes = () => {
    elements.likesListing.style.visibility = "visible";    
    elements.likesListing.style.opacity = "1";
};

elements.likesTop.addEventListener("click", openDaLikes);

*/

// 2. when I click button next or prev page, it stays opened
// 3. when I click away anytime, the panel closes

let stateOfLikeTop = true;

const closeDaLikes = () => {  
    if(!stateOfLikeTop){
    elements.likesListing.style.visibility = "hidden";        
    elements.likesListing.style.opacity = "none";
    stateOfLikeTop = true;
    console.log(stateOfLikeTop)
    showClick()
    return
    } else {
return
    }
    
};

elements.header.addEventListener("click",  e => {
    const btn = e.target.matches('.close_button');
    if (btn) {
     closeDaLikes();
    }
    });

/*
// when I click on add or add like or remove like, panel is closed and like correctly added
/*

const closeOrOpenDaLikes = () => {  
    if(elements.likesListing.style.visibility = "hidden"){
    elements.likesListing.style.visibility = "visibity";    
    elements.likesListing.style.opacity = "1";
    } else {
    elements.likesListing.style.visibility = "hidden";    
    elements.likesListing.style.opacity = "0";
    }
     } 
    }
};

elements.specLikesMenu.addEventListener("click", closeOrOpenDaLikes);



const btn = document.getElementsByClassName('likes__fieldcz');
let btn2 = document.getElementsByClassName('.btn-inline')
console.log(btn)
elements.likesMenu.addEventListener('click', e => {
    const btn = e.target.closest('likes__fieldcz');
    if (btn) {
        console.log(btn)
        let bttt = document.getElementsByClassName('.likes__panel');
   bttt.style.visibility = 'hidden';
      
    }
});

*/

//toggle like menu

const openDaLikesB = () => {
    if(stateOfLikeTop){
    elements.likesListing.style.visibility = "visible";    
    elements.likesListing.style.opacity = "1";
console.log("clickopen")
stateOfLikeTop = !stateOfLikeTop
console.log(stateOfLikeTop)
return
}
stateOfLikeTop = !stateOfLikeTop
}

elements.likesTop.addEventListener("click", openDaLikesB);

elements.header.addEventListener("click",  e => {
    const btn = e.target.matches('.likes__field');
    if (btn) {
        closeDaLikes();
    }
    });


    // open or close


    const OpenOrClose = () =>{

    }

/** 
 * SPECLIKE CONTROLLER
 */

const controlSpecLike = () => {
    if (!state.speclikes) state.speclikes = new SpecLikes();
    const currentID = state.recipe.id;

    // User has NOT yet liked current recipe
    if (!state.speclikes.isSpecLiked(currentID)) {
        // Add like to the state
        const newSpecLike = state.speclikes.addSpecLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle the like button
        specLikesView.toggleSpecLikeBtn(true);

        // Add like to UI list
        specLikesView.renderSpecLike(newSpecLike);

    // User HAS liked current recipe
    } else {
        // Remove like from the state
        state.speclikes.deleteSpecLike(currentID);

        // Toggle the like button
        specLikesView.toggleSpecLikeBtn(false);

        // Remove like from UI list
        specLikesView.deleteSpecLike(currentID);
    }
    specLikesView.toggleSpecLikeMenu(state.speclikes.getNumSpecLikes());
};

// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.speclikes = new SpecLikes();
    
    // Restore likes
    state.speclikes.readStorage();

    // Toggle like menu button
    specLikesView.toggleSpecLikeMenu(state.speclikes.getNumSpecLikes());

    // Render the existing likes
    state.speclikes.speclikes.forEach(speclike => specLikesView.renderSpecLike(speclike));    
});



// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    } else if (e.target.matches('.recipe__love-my-special, .recipe__love-my-special *')) {
        // Like controller
        controlSpecLike();
    }
});
