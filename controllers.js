const bcrypt = require('bcrypt');

// Array vazio para armazenar os usuários
let users = [];

module.exports = {
    renderProfile: (req, res) => {
        const { email } = req.params;
        res.render('perfil', { email, users });
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

        // Verifica se as senhas coincidem
        if (password !== confirmPassword) {
            return res.render('registro', { errorMessage: 'As senhas não coincidem' });
        }

        // Verifica se o email já está cadastrado
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.render('registro', { errorMessage: 'Este email já está cadastrado' });
        }

        // Hash da senha antes de salvar no banco de dados
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Erro ao criar hash da senha:', err);
                return res.render('registro', { errorMessage: 'Erro ao registrar o usuário' });
            }

            // Cria um novo usuário com a senha criptografada
            const newUser = { name, email, password: hashedPassword };
            // Adiciona o novo usuário à lista de usuários
            users.push(newUser);
            // Define o usuário na sessão
            req.session.usuario = newUser;
            // Redireciona para a página de perfil do usuário
            res.redirect(`/perfil/${newUser.email}`);
        });
    },
    renderLogin: (req, res) => {
        res.render('index', { errorMessage: '' });
    },
    loginUser: (req, res) => {
        const { email, password } = req.body;
        const user = users.find(user => user.email === email);
        if (!user) {
            return res.render('index', { errorMessage: 'Email ou senha incorretos' });
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.error('Erro ao comparar senhas:', err);
                return res.render('index', { errorMessage: 'Erro ao fazer login' });
            }
            if (result) {
                req.session.usuario = user;
                res.redirect(`/perfil/${user.email}`);
            } else {
                res.render('index', { errorMessage: 'Email ou senha incorretos' });
            }
        });
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
    }
};
