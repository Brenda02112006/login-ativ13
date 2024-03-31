const bcrypt = require('bcrypt');
let users = [];

const userController = {
    renderProfile: (req, res) => {
        const { email } = req.params;
        const user = users.find(user => user.email === email);
        if (!user) {
            return res.status(404).send('Usuário não encontrado');
        }
        // Passar a variável 'users' para o arquivo perfil.ejs
        res.render('perfil', { name: user.name, email: user.email, users });
    },
    renderUsers: (req, res) => {
        res.render('usuarios', { users });
    },
    deleteUser: (req, res) => {
        const email = req.params.email;
        const index = users.findIndex(user => user.email === email);
        if (index !== -1) {
            users.splice(index, 1);
        }
        res.redirect('/usuarios');
    },
    renderRegister: (req, res) => {
        res.render('registro', { errorMessage: '' });
    },
    registerUser: (req, res) => {
        const { name, email, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.render('registro', { errorMessage: 'As senhas não coincidem' });
        }
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.render('registro', { errorMessage: 'Este email já está cadastrado' });
        }
        const newUser = { name, email, password: bcrypt.hashSync(password, 10) }; // criptografa a senha antes de armazenar
        users.push(newUser);
        res.redirect(`/perfil/${newUser.email}`);
    },
    renderLogin: (req, res) => {
        res.render('index', { errorMessage: '' });
    },
    loginUser: (req, res) => {
        const { email, password } = req.body;
        
        // Verifica se um usuário com o email fornecido existe na base de dados
        const user = users.find(user => user.email === email);
        
        if (user) {
            // Se o usuário existe, compara a senha fornecida com a senha armazenada usando bcrypt
            if (bcrypt.compareSync(password, user.password)) {
                // Se as senhas coincidem, estabelece uma sessão para o usuário autenticado
                req.session.usuario = user;
                // Redireciona para a página de perfil ou outra página relevante
                return res.redirect('/perfil/' + user.email);
            }
        }
        
        // Se as credenciais forem inválidas, renderiza a página de login novamente com uma mensagem de erro
        return res.render('index', { errorMessage: 'Email ou senha inválidos' });
    },
    logoutUser: (req, res) => {
        req.session.destroy(err => {
            if (err) {
                console.error('Erro ao fazer logout:', err);
                res.send('Erro ao fazer logout');
            } else {
                res.redirect('/');
            }
        });
    },
};

module.exports = userController;