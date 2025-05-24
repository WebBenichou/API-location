const express = require('express');
const path = require('path');
const { users, cars } = require('./data/data.js'); 
const app = express();

app.use(express.json()); 
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// USERS CRUD 

// CREATE user
app.post('/users', (req, res) => {
    const newUser = req.body;
    newUser.id = users.length ? users[users.length - 1].id + 1 : 1;
    users.push(newUser);
    res.status(201).json(newUser);
});

// READ all users
app.get('/users', (req, res) => {
    res.json(users);
});

// READ one user
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    // Error
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    res.json(user);
});

// UPDATE user
app.put('/users/:id', (req, res) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
     // Error
    if (index === -1) return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    users[index] = { ...users[index], ...req.body };
    res.json(users[index]);
});

// DELETE user
app.delete('/users/:id', (req, res) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
     // Error
    if (index === -1) return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    const deleted = users.splice(index, 1);
    res.json(deleted[0]);
});

//  CARS CRUD 

// CREATE car
app.post('/cars', (req, res) => {
    const newCar = req.body;
    newCar.id = cars.length ? cars[cars.length - 1].id + 1 : 1;
    cars.push(newCar);
    res.status(201).json(newCar);
});

// READ all cars
app.get('/cars', (req, res) => {
    res.json(cars);
});

// READ one car
app.get('/cars/:id', (req, res) => {
    const car = cars.find(c => c.id === parseInt(req.params.id));
    if (!car) return res.status(404).json({ error: 'Voiture non trouvée.' });
    res.json(car);
});

// UPDATE car     
app.put('/cars/:id', (req, res) => {
    const index = cars.findIndex(c => c.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Voiture non trouvée.' });
    cars[index] = { ...cars[index], ...req.body };
    res.json(cars[index]);
});

// DELETE car
app.delete('/cars/:id', (req, res) => {
    const index = cars.findIndex(c => c.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'Voiture non trouvée.' });
    const deleted = cars.splice(index, 1);
    res.json(deleted[0]);
});

// Lancer le serveur
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
