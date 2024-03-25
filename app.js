const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const routes = require('./routes');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'chave-secreta', //para acessar os cookies de sessão
    resave: false,
    saveUninitialized: true
}));

routes(app);

app.listen(port, () => {
    console.log(`Servidor está rodando em http://localhost:${port}`);
});
