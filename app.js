const path = require('path');
const express = require('express'); 
const bodyParser = require('body-parser'); 
const session = require('express-session'); 

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Define o diretório de visualizações

app.use(bodyParser.urlencoded({ extended: true }));

//cookies
app.use(session({
    secret: 'chave-secreta', // garantir que  que os dados não sejam alterados para cliente
    resave: false, // Evita que a sessão seja salva novamente se não houver alterações
    saveUninitialized: true // Salva a sessão mesmo que ela não tenha sido inicializada
}));

// Array de usuários
let users = [
    { id: 1, email: 'usuario1@example.com', password: 'senha1' },
    { id: 2, email: 'usuario2@example.com', password: 'senha2' },
    { id: 3, email: 'usuario3@example.com', password: 'senha3' },
    { id: 4, email: 'usuario4@example.com', password: 'senha4' } ,
    { id: 5, email: 'usuario5@example.com', password: 'senha5' },
    { id: 6, email: 'usuario6@example.com', password: 'senha6' } ,
    { id: 7, email: 'usuario7@example.com', password: 'senha7' },
    { id: 8, email: 'usuario8@example.com', password: 'senha8' },
    { id: 9, email: 'usuario9@example.com', password: 'senha9' },
    { id: 10, email: 'usuario10@example.com', password: 'senha10' }
];

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
    res.render('registro', { errorMessage: '' });
});

app.post('/register', (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    
    if (password !== confirmPassword) {
        return res.render('registro', { errorMessage: 'As senhas não coincidem' });
    }

    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.render('registro', { errorMessage: 'Este email já está cadastrado' });
    }

    // Cria um novo usuário
    const newUser = { name, email, password };
    // Adiciona o novo usuário à lista de usuários
    users.push(newUser);
    req.session.usuario = newUser;
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
    const user = users.find(user => user.email === email && user.password === password);
    if (user) {
        req.session.usuario = user;
        res.redirect(`/perfil/${user.email}`);
    } else {
        // Se não encontrar um usuário, renderiza a página de login com uma mensagem de erro
        res.render('index', { errorMessage: 'Email ou senha incorretos' });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => { //destroi a sessão do usuário, incluindo o cookies
        if (err) { // se ocorrer erro, aparece a mensagem:
            console.error('Erro ao fazer logout:', err);
            res.send('Erro ao fazer logout');
        } else {
            res.redirect('/'); // caso não volta para página de login
        }
    });
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
    console.log(`Servidor está rodando em http://localhost:${3000}`);
});
