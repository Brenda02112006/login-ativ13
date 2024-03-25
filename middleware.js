//exporta verificarAutentificacao
// se tiver autenticado encaminha para o proximo middelewares

module.exports = {
    verificarAutenticacao: (req, res, next) => {
        if (req.session.usuario) {
            next();
        } else {
            res.redirect('/');
        }
    }
};
