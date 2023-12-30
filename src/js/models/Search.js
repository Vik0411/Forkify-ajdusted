import axios from "axios";
import { key, proxy } from "../config";

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults(query) {
    try {
      const res = await axios(
        `https://forkify-api.herokuapp.com/api/v2/recipes/?search=${query}&key=${KEY}`
      ).then((response) => response.data);
      console.log(res.recipes, "dd");
    } catch (error) {
      alert(error);
    }
  }
}
