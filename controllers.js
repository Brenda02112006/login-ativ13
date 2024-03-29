// Array vazio para armazenar os usuários
let users = [];

// Funções relacionadas aos usuários
const userController = {
    renderProfile: (req, res) => { // Renderiza o perfil de um usuário
        const { email } = req.params; // Extrai o email
        res.render('perfil', { email, users });
    },
    renderUsers: (req, res) => { // Renderiza a lista de usuários
        res.render('usuarios', { users });
    },
    deleteUser: (req, res) => { // Remove o usuário
        const email = req.params.email;
        const index = users.findIndex(user => user.email === email);
        if (index !== -1) {
            users.splice(index, 1); // Remove o usuário da lista
        }
        res.redirect('/usuarios');
    },
    renderRegister: (req, res) => { // Renderiza o formulário de registro de um novo usuário
        res.render('registro', { errorMessage: '' });
    },
    registerUser: (req, res) => { // Registra um novo usuário
        const { name, email, password, confirmPassword } = req.body;

        // Verifica se as senhas coincidem
        if (password !== confirmPassword) {
            return res.render('registro', { errorMessage: 'As senhas não coincidem' });
        }

        // Verifica se o email já está cadastrado
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.render('registro', { errorMessage: 'Este email já está cadastrado' });
        }

        // Adiciona o novo usuário à lista de usuários
        const newUser = { name, email, password };
        users.push(newUser);
        // Redireciona para a página de perfil do usuário
        res.redirect(`/perfil/${newUser.email}`);
    },
    renderLogin: (req, res) => { // Renderiza o formulário de login
        res.render('index', { errorMessage: '' });
    },
    logoutUser: (req, res) => { // Realiza o logout do usuário
        req.session.destroy(err => {
            if (err) {
                console.error('Erro ao fazer logout:', err);
                res.send('Erro ao fazer logout');
            } else {
                res.redirect('/');
            }
        });
    },

    // Middleware para verificar autenticação
    verificarAutenticacao: (req, res, next) => {
        if (req.session.usuario) {
            next();
        } else {
            res.redirect('/');
        }
    }
};

module.exports = userController;
