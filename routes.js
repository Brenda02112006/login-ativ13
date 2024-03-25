const express = require('express');
const controllers = require('./controllers');
const middlewares = require('./middlewares');
const router = express.Router();

router.get('/perfil/:email', middlewares.verificarAutenticacao, controllers.renderProfile);
router.get('/usuarios', middlewares.verificarAutenticacao, controllers.renderUsers);
router.post('/excluir/:email', middlewares.verificarAutenticacao, controllers.deleteUser);
router.get('/register', controllers.renderRegister);
router.post('/register', controllers.registerUser);
router.get('/', controllers.renderLogin);
router.post('/login', controllers.loginUser);
router.get('/logout', controllers.logoutUser);

module.exports = app => {
    app.use('/', router);
};
