const express = require('express');
const app = express();
const port = 3000;

const routes = require('./routes');
const { setup } = require('./middleware');
const { renderHomePage } = require('./controllers');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setup(app);
routes(app);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});