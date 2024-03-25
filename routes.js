const { renderHomePage, searchBooks } = require('./controllers');

module.exports = function (app) {
  // Rota para a página inicial
  app.get('/', (req, res) => {
    renderHomePage(req, res); // Aqui está ocorrendo o erro
  });

  // Rota para realizar buscas
  app.get('/search', (req, res) => {
    searchBooks(req, res);
  });
};
