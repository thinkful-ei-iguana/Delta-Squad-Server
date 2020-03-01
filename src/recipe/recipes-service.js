const INGREDIENT_REGEX = /([a-z]|[A-Z])+/;

const recipesService = {
  getAllRecipes(db, user_id) {
    return db("recipes")
      .select("*")
      .where("recipe_owner", user_id);
  },
  getAllByUser(db, accounts) {
    return db("recipes")
      .select("*")
      .where("owner", accounts);
  },
  getRecipeById(db, id) {
    return db("recipes")
      .select("*")
      .where("id", id)
      .first();
  },
  getRecipeOwnerData(db, owner) {
    return db("users")
      .where("owner", owner)
      .first();
  },
  insertRecipe(db, newRecipe) {
    return db
      .insert(newRecipe)
      .into("recipes")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },

  addRecipeIngredient(db, ingredient) {
    return db
      .insert(ingredient)
      .into("recipe_ingredients")
      .returning("*")
      .then(rows => {
        return rows[0];
      });
  },
  deleteRecipeIngredient(db, recipe_id) {
    return db("recipe_ingredients")
      .where({ recipe_id })
      .delete();
  },

  getRecipeIngredientsId(db, recipe_id) {
    return db("recipe_ingredients")
      .select("ingredient_id")
      .where({ recipe_id });
  },

  deleteRecipe(db, id) {
    return db("recipes")
      .where({ id })
      .delete();
  },
  updateRecipe(db, updatedRecipeId, recipeId) {
    return db("recipes")
      .where({ id: recipeId })
      .update(updatedRecipeId)
      .returning("*");
  },
  isValidTitleInput(title) {
    console.log("title is", title);
    if (title === "") {
      console.log("error title: ", title);
      return false;
    }
    return true;
  },
  isValidDescriptionInput(descriptionArr) {
    console.log("desc is", descriptionArr);
    for (let i = 0; i < descriptionArr.length; ++i) {

      let description = descriptionArr[i];
      console.log('desc is pre trim', "description");
      description = description.trim();
      console.log('desc is post trim', description);

      if (description === "") {
        console.log("error desc: ", description);
        return false;
      }
    }
    return true;
  },
  isValidIngredientsInput(ingredients) {
    console.log("ingredient is", ingredients);
    for (let i = 0; i < ingredients.length; ++i) {
      let ingredient = ingredients[i];
      ingredient = ingredient.trim();
      console.log("ingredients after trim is", ingredient);
      if (ingredient === "") {
        console.log("error ingredient: ", ingredient);
        return false;
      }
    }
    return true;
  }
};

module.exports = recipesService;
