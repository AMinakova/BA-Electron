export default class ToDoItem {
    constructor(text) {
        this.text = text;
        this.done = false;
        this.date = Date.now();
    } 
}