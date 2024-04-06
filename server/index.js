//*client - a node pg client
const {
    client,
    createTables,
    createFavorite,
    createProducts,
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

app.get('/api/restaurants', async(req, res, next) => {
    try{
        res.send(await fetchRestaurants());
    }catch(ex){
        next(ex);
    }
});
app.get('/api/reservations', async(req, res, next) => {
    try{
        res.send(await fetchReservations())
    }catch(ex){
        next(ex);
    }
});

//POST

app.post('/api/customers/:id/reservations', async(req, res, next) => {
    try{
        res.status(201).send(await createReservation(req.body));
        } catch(ex){
            next(ex);
        }
});

//DELETE
app.delete('/api/customers/:customer_id/reservations/:id', async(req, res, next) => {
    try{
        await destroyReservation(req.params.id);
        res.sendStatus(204);
    }catch(ex){
        next(ex);
    }  
});  


const init = async()=> {
    await client.connect();
    console.log('connected to database');
    await createTables();
    console.log('tables created');
    const [ling, amy, josh, HDL, DolarShop, ChengduMemory] = 
    await Promise.all([
        createCustomer('ling'),
        createCustomer('amy'),
        createCustomer('josh'),
        createRestaurant('HDL'),
        createRestaurant('DolarShop'),
        createRestaurant('ChengduMemory'),
    ]);
    console.log(`ling has an id of ${ling.id}`);
    console.log(`HDL has an id of ${HDL.id}`);
    console.log(await fetchCustomers());
    console.log(await fetchRestaurants());
    await Promise.all([
        createReservation({customer_id: ling.id, restaurant_id: HDL.id, date: '04/01/2024', party_count: '6'}),
        createReservation({customer_id: ling.id, restaurant_id: DolarShop.id, date: '04/15/2024', party_count: '7'}),
        createReservation({customer_id: amy.id, restaurant_id: ChengduMemory.id, date: '07/04/2024', party_count: '8'})
    ]);
    const reservations = await fetchReservations();
    console.log(reservations);
    await destroyReservation(reservations[0].id);
    console.log(await fetchReservations());

    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`));

};
  
  init();