import axios from 'axios';
import { key, proxy } from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
           const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`).then(response => response.data)
        console.log(res.recipes);
        } catch (error) {
            alert(error);
        }
    }
}
