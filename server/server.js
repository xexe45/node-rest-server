require('./config/config');

const express = require('express')
const app = express();

const bodyParser = require('body-parser');

// Using Node.js `require()`
const mongoose = require('mongoose');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//declaracion rutas
var appInitRoute = require('./routes/app');
var userRoutes = require('./routes/usuario');

mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log('Base de datos online')
});

app.use('/usuario', userRoutes);
app.use('/', appInitRoute);

app.listen(process.env.PORT, () => {
    console.log('Esuchando puerto: ' + 3000)
});