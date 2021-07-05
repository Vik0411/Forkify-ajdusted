export default class SpecLikes {
    constructor() {
        this.speclikes = [];
    }

    addSpecLike(id, title, author, img) {
        const speclike = { id, title, author, img };
        this.speclikes.push(speclike);

        // Perist data in localStorage
        this.persistData();

        return speclike;
    }

    deleteSpecLike(id) {
        const index = this.speclikes.findIndex(el => el.id === id);
        this.speclikes.splice(index, 1);

        // Perist data in localStorage
        this.persistData();
    }

    isSpecLiked(id) {
        return this.speclikes.findIndex(el => el.id === id) !== -1;
    }

    getNumSpecLikes() {
        return this.speclikes.length;
    }

    persistData() {
        localStorage.setItem('likescz', JSON.stringify(this.speclikes));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likescz'));
        
        // Restoring likes from the localStorage
        if (storage) this.speclikes = storage;
    }
}