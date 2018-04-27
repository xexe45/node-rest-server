require('./config/config');

const express = require('express')
const path = require('path');
const app = express();

const bodyParser = require('body-parser');

// Using Node.js `require()`
const mongoose = require('mongoose');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

//configuración global de rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log('Base de datos online')
});

app.listen(process.env.PORT, () => {
    console.log('Esuchando puerto: ' + 3000)
});