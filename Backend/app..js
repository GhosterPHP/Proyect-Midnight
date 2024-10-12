import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql2/promise'; 

const app = express();
const PORT = 4321;

app.use(bodyParser.json());

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Midnight'
};

app.post('/login', async (req, res) => {
    const { nombre, password } = req.body;

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM users WHERE Usuario = ? AND Contra = ?', [nombre, password]);

        if (rows.length > 0) {
            req.session.userId = rows[0].IdUser;
            res.json({ success: true, message: 'Inicio de sesión exitoso' });
        } else {
            res.json({ success: false, message: 'Usuario o contraseña incorrectos' });
        }
    } catch (error) {
        console.error('Error en la conexión a la base de datos:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
