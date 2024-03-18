// Importando o módulo path
const path = require('path');

// Importando as bibliotecas necessárias
const express = require('express'); // Importa o framework Express
const bodyParser = require('body-parser'); // Middleware para fazer parsing do corpo das requisições
const session = require('express-session'); // Middleware para gerenciar sessões de usuário

// Inicializando o aplicativo Express
const app = express();

// Configurando o mecanismo de visualização para EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Define o diretório de visualizações

// Utilizando o middleware bodyParser para analisar o corpo das solicitações
app.use(bodyParser.urlencoded({ extended: true }));

// Configurando o middleware de sessão
app.use(session({
    secret: 'chave-secreta', // Chave secreta para assinar a sessão
    resave: false, // Evita que a sessão seja salva novamente se não houver alterações
    saveUninitialized: true // Salva a sessão mesmo que ela não tenha sido inicializada
}));

// Lista de usuários cadastrados (simulada)
let users = [];

// Middleware para verificar autenticação do usuário
function verificarAutenticacao(req, res, next) {
    // Verifica se há um usuário na sessão
    if (req.session.usuario) {
        // Se houver, passa para a próxima middleware
        next();
    } else {
        // Caso contrário, redireciona para a página inicial
        res.redirect('/');
    }
}

// Rota para a página de perfil (requer autenticação)
app.get('/perfil/:email', verificarAutenticacao, (req, res) => {
    // Extrai o email dos parâmetros da URL
    const { email } = req.params;
    // Renderiza a página de perfil, passando o email e a lista de usuários como dados
    res.render('perfil', { email, users }); 
});

// Rota para a lista de usuários (requer autenticação)
app.get('/usuarios', verificarAutenticacao, (req, res) => {
    // Renderiza a página de usuários, passando a lista de usuários como dados
    res.render('usuarios', { users });
});

// Rota para excluir um usuário (requer autenticação)
app.post('/excluir/:email', verificarAutenticacao, (req, res) => {
    const email = req.params.email;
    // Encontra o índice do usuário com o email fornecido na lista de usuários
    const index = users.findIndex(user => user.email === email);
    if (index !== -1) {
        // Remove o usuário da lista de usuários
        users.splice(index, 1);
    }
    // Redireciona para a lista de usuários após a exclusão
    res.redirect('/usuarios');
});

// Rota para a página de registro
app.get('/register', (req, res) => {
    // Renderiza a página de registro, passando uma mensagem de erro vazia como dados
    res.render('registro', { errorMessage: '' });
});

// Rota para registrar um novo usuário
app.post('/register', (req, res) => {
    // Extrai os dados do corpo da requisição
    const { name, email, password, confirmPassword } = req.body;
    
    // Verifica se as senhas coincidem
    if (password !== confirmPassword) {
        // Se as senhas não coincidirem, renderiza a página de registro com uma mensagem de erro
        return res.render('registro', { errorMessage: 'As senhas não coincidem' });
    }

    // Verifica se o email já está cadastrado
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        // Se o email já estiver cadastrado, renderiza a página de registro com uma mensagem de erro
        return res.render('registro', { errorMessage: 'Este email já está cadastrado' });
    }

    // Cria um novo usuário
    const newUser = { name, email, password };
    // Adiciona o novo usuário à lista de usuários
    users.push(newUser);
    // Cria uma sessão para o usuário registrado
    req.session.usuario = newUser;
    // Redireciona para a página de perfil do novo usuário
    res.redirect(`/perfil/${newUser.email}`);
});

// Rota para a página de login
app.get('/', (req, res) => {
    // Renderiza a página de login, passando uma mensagem de erro vazia como dados
    res.render('index', { errorMessage: '' });
});

// Rota para processar o login
app.post('/login', (req, res) => {
    // Extrai os dados do corpo da requisição
    const { email, password } = req.body;
    // Procura um usuário com o email e senha fornecidos
    const user = users.find(user => user.email === email && user.password === password);
    // Se encontrar um usuário, cria uma sessão para ele e redireciona para sua página de perfil
    if (user) {
        req.session.usuario = user;
        res.redirect(`/perfil/${user.email}`);
    } else {
        // Se não encontrar um usuário, renderiza a página de login com uma mensagem de erro
        res.render('index', { errorMessage: 'Email ou senha incorretos' });
    }
});

// Rota para fazer logout
app.get('/logout', (req, res) => {
    // Destroi a sessão do usuário
    req.session.destroy(err => {
        if (err) {
            // Se houver um erro ao destruir a sessão, exibe uma mensagem de erro
            console.error('Erro ao fazer logout:', err);
            res.send('Erro ao fazer logout');
        } else {
            // Caso contrário, redireciona para a página de login
            res.redirect('/');
        }
    });
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log(`Servidor está rodando em http://localhost:${3000}`);
});
