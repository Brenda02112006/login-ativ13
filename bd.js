const express = require('express');
const mysql = require('mysql2');

const app = express();
// Configuração da conexão com o banco de dados
const connection = mysql.createConnection({
host: 'roundhouse.proxy.rlwy.net',
user: 'root',
port: 30376,
password: 'hZBdysauZaMVWubVXvHLYofnQLAxyFHT',
database: 'railway'
});
// Conexão com o banco de dados
connection.connect((err) => {
if (err) {
console.error('Erro ao conectar ao banco de dados:', err);
return;
}
console.log('Conexão bem-sucedida ao banco de dados MySQL');
});
module.exports = connection;