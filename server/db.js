/*client - a node pg client*/
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_store_db');
const uuid = require('uuid');

//createTables method - drops and creates the tables for your application
async function createTables() {
    const SQL = `
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS favorites;    

    CREATE TABLE users(
        id UUID PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) UNIQUE NOT NULL,
        );

    CREATE TABLE products(
        id UUID PRIMARY KEY,
        name VARCHAR(100)
      );
      
    CREATE TABLE favorites(
        id UUID PRIMARY KEY,
        product_id UUID REFERENCES product(id) NOT NULL,
        user_id UUID REFERENCES users(id) NOT NULL,
        CONSTRAINT unique_user_product UNIQUE (user_id, product_id)
      );
      `
    await client.query(SQL);

};

//createUser - creates a user in the database and returns the created record. The password of the user should be hashed using bcrypt.
const createUser = async({ username, password })=> {
    const SQL = `
      INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), username, password]);
    return response.rows[0];
  };
/*createProduct - creates a product in the database and returns the created record*/
const createProducts = async({ name })=> {
    const SQL = `
      INSERT INTO products(id, name) VALUES($1, $2) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
  };

//createFavorite - creates a favorite in the database and returns the created record
const createFavorite = async ({user_id, product_id})=> {
    const SQL =`
    INSERT INTO favorites(id, user_id, product_id) VALUES($1, $2, $3) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), user_id, product_id]);
    return response.rows[0];
};


//fetchUsers - returns an array of users in the database
const fetchUsers = async()=> {
    const SQL = `
      SELECT id, username FROM users
    `;
    const response = await client.query(SQL);
    return response.rows;
  };

//fetchProducts - returns an array of products in the database
async function fetchProducts() {
    const SQL = `
    SELECT * FROM products
  `;
  const response = await client.query(SQL);
  return response.rows;
};

//fetchFavorites - returns an array favorites for a user
async function fetchFavorites(id) {
    const SQL = `
    SELECT * FROM favorites
    WHERE user_id = $1
    `;
    const response = await client.query(SQL, [ id ]);
    return response.rows;
};


//destroyFavorite - deletes a favorite in the database*/
async function destroyFavorite() {

}




module.exports = {
    client,
    createTables,
    createFavorite,
    createProducts,
    createUser,
    fetchUsers,
    fetchProducts,
    fetchFavorites,
    destroyFavorite
}