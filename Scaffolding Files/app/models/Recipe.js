const db = require('../services/db');

class Recipe {
    recipe_id;
    user_id;
    title;
    description;
    ingredients;
    instructions;
    prep_time;
    cook_time;
    servings;
    image;
    created_at;

    constructor (recipe_id){
        this.recipe_id    = recipe_id;
    }

    async getRecipeTitle() {
        if (typeof this.title !== 'string') {
            var sql = "SELECT  from  where id = ?"
            const results = await db.query(sql, [this.id]);
            this.title = results[0].title;
        }
    }
    
    async getRecipeDescription()  {
        if(typeof this.description !== description) {
            var sql = "SELECT  from  where id = ?"
            const results = await db.query(sql, [this.id]);
            this.description = results[0].description;
        }
    }
    
    async getRecipeUserId() {
        if(typeof this.user_id !== this.user_id) {
            var sql = "SELECT  from  where id = ?"
            const results = await db.query(sql, [this.id]);
            this.user_id= results[0].user_id;
        }
    }
    async getRecipeIngredients() {
        if(typeof this.ingredients !== this.ingredients) {
            var sql = "SELECT  from  where id = ?"
            const results = await db.query(sql, [this.id]);
            this.ingredients= results[0].ingredients;
        }
    }
    
    async getRecipePrepTime()  {
        if(typeof this.ingredients !== this.ingredients) {
            var sql = "SELECT  from  where id = ?"
            const results = await db.query(sql, [this.id]);
            this.ingredients= results[0].ingredients;
        }
    }
    
    async getRecipeCookTime() {
        if(typeof this.cook_time !== this.cook_time) {
            var sql = "SELECT  from  where id = ?"
            const results = await db.query(sql, [this.id]);
            this.cook_time= results[0].cook_time;
        }
    }

    async getRecipeServings() {
        if(typeof this.servings !== this.servings) {
            var sql = "SELECT  from  where id = ?"
            const results = await db.query(sql, [this.id]);
            this.servings= results[0].servings;
        }
    }

    async getRecipeImage() {
        var sql = "SELECT * FROM Programme_Modules pm \
        JOIN Modules m on m.code = pm.module \
        WHERE programme = ?";
        const results = await db.query(sql, [this.programme.id]);
        for(var row of results) {
            this.modules.push(new Module(row.code, row.name));
        }
    }

    async getRecipeCreatedAt() {
        var sql = "SELECT * FROM Programme_Modules pm \
        JOIN Modules m on m.code = pm.module \
        WHERE programme = ?";
        const results = await db.query(sql, [this.programme.id]);
        for(var row of results) {
            this.modules.push(new Module(row.code, row.name));
        }
    }
}

module.exports = {
    Student
}