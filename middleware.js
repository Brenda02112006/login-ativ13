module.exports = {
    setup: function (app) {
      // Middleware para registrar requisições no console
      app.use(function(req, res, next) {
        console.log(`Recebida uma requisição ${req.method} para ${req.url}`);
        next(); // Chama o próximo middleware na pilha
      });
    }
  };