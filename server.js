const express = require('express');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const { users, cars } = require('./data/data.js');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use('/public/images', express.static('public/images'));


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});



const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Limite: 2MB
});

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

app.post('/cars', upload.single('image'), (req, res) => {
    const { matricule, mark, sere } = req.body;
    const image = req.file;

    const newCar = {
        id: Date.now().toString(),
        matricule,
        mark,
        sere,
        image
    };

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
