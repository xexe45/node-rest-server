const express = require('express')
const app = express();
const bodyParser = require('body-parser');
require('./config/config');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/usuario', function(req, res) {
    res.status(200).json('getUsuario');
});

app.post('/usuario', function(req, res) {
    const body = req.body;
    if (!body.nombre) {
        res.status(400).json({
            ok: false,
            message: 'El nombre es necesario'
        })
    } else {
        res.status(200).json({
            persona: body
        });
    }

});

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    res.status(200).json('putUsuario' + id);
});

app.delete('/usuario/:id', function(req, res) {
    res.status(200).json('deleteUsuario');
});

app.listen(process.env.PORT, () => {
    console.log('Esuchando puerto: ' + 3000)
});