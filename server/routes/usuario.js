const express = require('express')
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { verificaToken, verificaAdminToken } = require('../middlewares/autenticacion');

app.get('/usuario', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error de solicitud',
                    err: err
                });
            }

            Usuario.count({ estado: true }, (err, total) => {
                res.json({
                    ok: true,
                    usuarios: usuarios,
                    total: total
                });
            });
        })
});

app.post('/usuario', [verificaToken, verificaAdminToken], function(req, res) {

    const body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error de solicitud',
                err: err
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioDB
        });
    })

});

app.put('/usuario/:id', [verificaToken, verificaAdminToken], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error de solicitud',
                err: err
            });
        }

        res.json({
            usuario: usuarioDB
        });


    });
});

/*
app.delete('/:id', function(req, res) {

    let id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error de solicitud',
                err: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario no existe',
                err: { message: 'El usuario no existe' }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    })
});
*/

app.delete('/usuario/:id', [verificaToken, verificaAdminToken], (req, res) => {
    let id = req.params.id;
    let cambiaEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error de solicitud',
                err: err
            });
        }

        res.json({
            usuario: usuarioDB
        });


    });
})
module.exports = app;