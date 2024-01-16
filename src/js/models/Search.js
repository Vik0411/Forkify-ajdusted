import axios from "axios";
import { key, proxy } from "../config";

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    try {
      //for api v2
      // const res = await axios(
      //   `https://forkify-api.herokuapp.com/api/v2/recipes?search=${this.query}&key=${key}`
      // );
      // this.result = res.data.recipes;
      // console.log("dd", this.result);

      const res = await axios(
        `https://forkify-api.herokuapp.com/api/search?q=${this.query}`
      );
      this.result = res.data.recipes;
      console.log(this.result);
    } catch (error) {
      alert(error);
    }
  }
}
