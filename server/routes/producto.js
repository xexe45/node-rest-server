const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();
const Producto = require('../models/producto');

/**
 * OBTENER TODOS LOS PRODUCTOS
 */
app.get('/productos', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limit = req.query.limit || 10;
    limit = Number(limit);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limit)
        .populate('usuario')
        .populate('categoria')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err
                });
            }

            Producto.count({}, (err, total) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err: err
                    });
                }

                res.json({
                    ok: true,
                    productos: productos,
                    total: total
                });
            });
        });

});

/**
 * OBTENER PRODUCTO X ID
 */
app.get('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: { message: 'No existe el producto' }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

/**
 * BUSCAR PRODUCTOS
 */
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regEx = new RegExp(termino, 'i');

    Producto.find({ nombre: regEx })
        .populate('categoria')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err: err
                });
            }

            res.json({
                ok: true,
                productos: productos
            });

        })
});

/**
 * CREAR NUEVO PRODUCTO
 */
app.post('/productos', verificaToken, (req, res) => {

    let body = req.body;
    let usuario = req.usuario._id;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: usuario
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'No se pudo crear el producto' }
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });
});

/**
 * ACTUALIZAR PRODUCTOS
 */
app.put('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'No existe el producto' }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });
});

/**
 * BORRAR LÓGICAMENTE PRODUCTOS
 */
app.delete('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let cambiaEstado = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'No existe el producto' }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });
});

module.exports = app;