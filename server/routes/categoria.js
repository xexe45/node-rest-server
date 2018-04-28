const express = require('express');
const app = express();
const Categoria = require('../models/categoria');
const { verificaToken, verificaAdminToken } = require('../middlewares/autenticacion');

/**
 * Listar categorías
 */
app.get('/categoria', [verificaToken], (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario_id', 'nombre email')
        .exec(
            (err, categorias) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err: err
                    });
                }

                Categoria.count({}, (err, total) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err: err
                        });
                    }

                    res.json({
                        ok: true,
                        categorias: categorias,
                        total: total
                    });

                })
            })

});

/**
 * Listar Categoría por ID
 */
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id)
        .populate('usuario_id', 'nombre email')
        .exec(
            (err, categoriaDB) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err: err
                    });
                }

                if (!categoriaDB) {
                    return res.status(400).json({
                        ok: false,
                        err: { message: 'No se pudo encontrar la categoría' }
                    });
                }

                res.json({
                    ok: true,
                    categoria: categoriaDB
                })
            })

});

/**
 * Registrar Categoría
 */
app.post('/categoria', [verificaToken, verificaAdminToken], (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario_id: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'No se pudo crear la categoría' }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });
});

/**
 * Modificar categoría
 */
app.put('/categoria/:id', [verificaToken, verificaAdminToken], (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'No existe la categoría' }
            });
        }

        categoriaDB.descripcion = body.descripcion;

        categoriaDB.save((err, categoria) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            }
            res.json({
                ok: true,
                categoria: categoria
            })
        })

    });

});

/**
 * Eliminar categoria
 */
app.delete('/categoria/:id', [verificaToken, verificaAdminToken], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaEliminada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        }

        if (!categoriaEliminada) {
            return res.status(400).json({
                ok: false,
                err: { message: 'No existe la categoría' }
            });
        }

        res.json({
            message: 'Categoría Eliminada'
        })
    })
})


module.exports = app;