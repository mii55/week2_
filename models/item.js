const {randomUUID} = require('crypto');

class ItemModel{
    constructor(){
    this.items = new Map;
    }

    validate(item){
        if(!item) return {valid:false, error:'Item is required'};
        if (!item.name || typeof item.name !== 'string' || item.name.trim()=== ''){
            return {valid:false, error:'Name is required and must be a non-empty string'}
        }
        if (!item.description || typeof item.description !== 'string'){
            return {valid:false, error: 'Description is required and must be a string'}
        }
        return {valid:true}
    }
    create({name,description}){
        const id = randomUUID();
        const newItem = {id,name,description};
        this.items.set(id,newItem);
        return newItem;

    }
    list(){
        return Array.from(this.items.values());
    }

    get(id){
        return this.items.get(id) || null;
    }

    update(id,{name,description}){
        const existing = this.items.get(id);
        if (!existing) return null
        const updated = {...existing}
        if (name !== undefined) updated.name = name;
        if(description !== undefined) updated.description = description
        this.items.set(id,updated);
        return updated;
    }
    delete(id){
        return this.items.delete(id);
    }
}

module.exports = new ItemModel()