DROP TABLE IF EXISTS recipe_ingredients;
DROP TABLE IF EXISTS ingredients;
DROP TABLE IF EXISTS mealplan;
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS accounts;

CREATE TABLE accounts (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  first_name TEXT NOT NULL,
  user_name TEXT NOT NULL UNIQUE,
  user_email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  date_created TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE recipes (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  title TEXT NOT NULL UNIQUE,
  recipe_description TEXT NOT NULL,
  time_to_make TEXT NOT NULL,
  recipe_owner INTEGER REFERENCES accounts(id) ON DELETE CASCADE NOT NULL
);

DROP TYPE IF EXISTS stock;
CREATE TYPE stock AS ENUM ('in-stock', 'out-of-stock', 'low');

CREATE TABLE ingredients (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  ingredient_name TEXT NOT NULL UNIQUE,
  in_stock stock NOT NULL,
  notes TEXT,
  ingredient_owner INTEGER REFERENCES accounts(id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE recipe_ingredients (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  ingredient_id INTEGER REFERENCES ingredients(id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE mealplan (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  title TEXT NOT NULL UNIQUE,
  planned_date TEXT NOT NULL,
  prep_time TEXT NOT NULL,
  needed_ingredients TEXT NOT NULL
);
