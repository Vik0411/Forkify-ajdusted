import axios from "axios";
import { key, proxy } from "../config";

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      //for api v2
      // const res = await axios(
      //   `https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bcf01?key=${key}`
      // );
      // console.log(res);

      // this.result = res.data.data.recipe;
      // this.title = res.data.data.recipe.title;
      // this.author = res.data.data.recipe.publisher;
      // this.img = res.data.data.recipe.image_url;
      // this.url = res.data.data.recipe.source_url;
      // this.ingredients = res.data.data.recipe.ingredients;

      const res = await axios(
        `https://forkify-api.herokuapp.com/api/get?rId=${this.id}`
      );
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
      console.log(this.ingredients);
    } catch (error) {
      console.log(error);
      alert("Something went wrong :(");
    }
  }

  calcTime() {
    // Assuming that we need 15 min for each 3 ingredients
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }

  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    const unitsLong = [
      "tablespoons",
      "tablespoon",
      "ounces,",
      "ounces",
      "ounce",
      "teaspoons",
      "teaspoon",
      "cups",
      "pound",
      "pounds",
      "lbs",
    ];
    // add also handelling for lbs

    const unitsShort = [
      "tbsp",
      "tbsp",
      "gr,",
      "gr",
      "gr",
      "tsp",
      "tsp",
      "cup",
      "kg",
      "kgs",
      "kgs",
    ];
    const units = [...unitsShort];

    const newIngredients = this.ingredients.map((el) => {
      // 1) Uniform units
      console.log(el);
      // let ingredient = el.description.toLowerCase();
      let ingredient = el.toLowerCase();

      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });

      // 2) Remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

      // 3) Parse ingredients into count, unit and ingredient
      const arrIng = ingredient.split(" ");
      const unitIndex = arrIng.findIndex((el2) => units.includes(el2));

      let objIng;
      if (unitIndex > -1) {
        // There is a unit
        // Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
        // Ex. 4 cups, arrCount is [4]
        const arrCount = arrIng.slice(0, unitIndex);

        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace("-", "+"));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join("+"));
        }

        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(" "),
        };

        // console.log(objIng.unit);
        //convert to gram
        if (objIng.unit.includes("gr")) {
          // console.log(objIng.count, "grams");
          objIng.count = objIng.count * 28.35;
        }
        //convert to kg
        if (objIng.unit.includes("kg")) {
          // console.log(objIng.count, "kgs");
          objIng.count = objIng.count * 0.454;
        }
      } else if (parseInt(arrIng[0], 10)) {
        // There is NO unit, but 1st element is number
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: "",
          ingredient: arrIng.slice(1).join(" "),
        };
      } else if (unitIndex === -1) {
        // There is NO unit and NO number in 1st position
        objIng = {
          count: 1,
          unit: "",
          ingredient,
        };
      }

      return objIng;
    });
    this.ingredients = newIngredients;
  }

  updateServings(type) {
    // Servings
    const newServings = type === "dec" ? this.servings - 1 : this.servings + 1;

    // Ingredients
    this.ingredients.forEach((ing) => {
      ing.count *= newServings / this.servings;
    });

    this.servings = newServings;
  }
}
