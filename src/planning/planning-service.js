const planningService = {
  getAllMealPlans(knex, user_id) {
    return knex("mealplans")
      .where("mealplan_owner", user_id)
      .select("*");
  },
  getAllByUser(knex, accounts) {
    return knex("mealplans")
      .select("*")
      .where("mealplan_owner", accounts);
  },
  getMealPlanById(knex, id) {
    return knex("mealplans")
      .select("*")
      .where("mealplans.id", id)
      .first();
  },
  getMealPlanOwnerData(knex, mealplan_owner) {
    return knex("users")
      .where("mealplan_owner", mealplan_owner)
      .first();
  },
  insertMealPlan(knex, newMealPlan) {
    return knex("mealplans")
      .insert(newMealPlan)
      .returning("*")
      .then(rows => rows[0]);
  },
  deleteMealPlan(knex, id) {
    return knex("mealplans")
      .where({ id })
      .delete();
  },
  updateMealPlan(knex, id, updatedData) {
    return knex("mealplans")
      .where({ id })
      .update(updatedData);
  }
};

module.exports = planningService;
