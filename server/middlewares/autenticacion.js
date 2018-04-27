const jwt = require('jsonwebtoken');
//================================================
// Verificar token
//================================================
let verificaToken = (req, res, next) => {

    let token = req.get('Authorization');
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: err
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
}

//================================================
// Verificar Admin rol
//================================================
let verificaAdminToken = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {

        return res.status(401).json({
            ok: false,
            err: { message: 'No eres administrador' }
        });

    }
}

module.exports = {
    verificaToken,
    verificaAdminToken
}