const PantryService = {
  getIngredients(db, user_id) {
    console.log("getting ingredients");
    return db("ingredients")
      .select("*")
      .where("ingredient_owner", user_id);
  },
  addIngredient(db, ingredient) {
    return db
      .insert(ingredient)
      .into("ingredients")
      .returning("*")
      .then((rows) => {
        return rows[0];
      })
      .catch((err) => {
        throw err;
      });
  },
  updateIngredient(db, ingredient_id) { // not finished
    return db("ingredients")
      .where({ id: ingredient_id })
      .returning("*");
  },
};

module.exports = PantryService;