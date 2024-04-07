//*client - a node pg client
const {
    client,
    createTables,
    createFavorite,
    createProduct,
    createUser,
    fetchUsers,
    fetchProducts,
    fetchFavorites,
    destroyFavorite
} = require('./db');

const express = require('express');
const app = express();

//GET /api/users - returns array of users
app.get('/api/users', async(req, res, next) => {
    try{
        res.send(await fetchUsers());
    }catch(ex){
        next(ex);
    }
});

//GET /api/products - returns an array of products
app.get('/api/products', async(req, res, next) => {
    try{
        res.send(await fetchProducts());
    }catch(ex){
        next(ex);
    }
});

//GET /api/users/:id/favorites - returns an array of favorites for a user

app.get('/api/users/:id/favorites', async(req, res, next) => {
    try{
        res.send(await fetchFavorites());
    }catch(ex){
        next(ex);
    }
});

//POST /api/users/:id/favorites - payload: a product_id returns the created favorite with a status code of 201
app.post('/api/users/:id/favorites', async(req, res, next) => {
    try {
        res.status(201).send(await createFavorite(req.body));
    }
    catch(ex){
        next(ex);
      }
});

//DELETE /api/users/:userId/favorites/:id - deletes a favorite for a user, returns nothing with a status code of 204
app.delete('/api/users/:userId/favorites/:id', async(req, res, next)=> {
    try {
      await destroyFavorite({ id: req.params.id, user_id: req.params.userId });
      res.sendStatus(204);
    }
    catch(ex){
      next(ex);
    }
  });
  

const init = async()=> {
    await client.connect();
    console.log('connected to database');
    await createTables();
    console.log('tables created');
    const [moe, lucy, ethyl, shoes, pants, jackets, accessories] = await Promise.all([
        createUser({ username: 'moe', password: 's3cr3t' }),
        createUser({ username: 'lucy', password: 's3cr3t!!' }),
        createUser({ username: 'ethyl', password: 'shhh' }),
        createProduct({ name: 'shoes'}),
        createProduct({ name: 'pants'}),
        createProduct({ name: 'jackets'}),
        createProduct({ name: 'accessories'}),
    ]);

    const users = await fetchUsers();
    console.log(users);

    const products = await fetchProducts();
    console.log(products);

    const favorites = await Promise.all([
        createFavorite({ user_id: moe.id, product_id: accessories.id}),
        createFavorite({ user_id: moe.id, product_id: jackets.id}),
        createFavorite({ user_id: ethyl.id, product_id: shoes.id}),
        createFavorite({ user_id: lucy.id, product_id: accessories.id}),
      ]);
    await Promise.all([

    ]);


    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`));

};
  
  init();