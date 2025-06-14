const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const mysql = require('mysql2');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Static file serving
app.use(express.static('public'));

function getConnection() {
    return mysql.createConnection({
            host: process.env.DB_HOST || 'localhost', 
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'password',
            database: process.env.DB_NAME || 'mydatabase'
    });
}

// Routes
app.get('/api/test', (req, res) => {
    res.send('Welcome to the Express.js backend!');
});

// Get users route
app.get('/api/users', (req, res) => {
    let connection;

    try {
        // Create a MySQL connection
        connection = getConnection();
        connection.connect();
        connection.query('SELECT * FROM app_users', (error, results) => {
            if (error) {
                console.error('Error fetching users:', error);
                return res.status(500).send({ message: 'Error fetching users', error: error.message });
            }
            res.status(200).send(results.map(user => ({
                id: user.id,
                username: user.username,
                email: user.email
            })));
        });
    }
    catch (error) {
        console.error('Error getting users:', error);
        return res.status(500).send({ message: 'Error getting users', error: error.message });
    }
    finally {
        if (connection) {
            connection.end();
        }
    }
});

// Create user route
app.post('/api/users', (req, res) => {
    const user = req.body;
    
    if (!user || !user.username || !user.email) {
        return res.status(400).send({ message: 'Invalid user data' });
    }

    let connection;

    try {
        // Create a MySQL connection
        connection = getConnection();
        connection.connect();
        connection.execute('INSERT INTO app_users (username, email, password) VALUES (?, ?, ?)', [user.username, user.email, user.password], (error, results) => {
            if (error) {
                console.error('Error inserting user:', error);
                return res.status(500).send({ message: 'Error inserting user', error: error.message });
            }
            user.id = results.insertId; // Assuming the table has an auto-incrementing ID
        });
    }
    catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).send({ message: 'Error creating user', error: error.message });
    }
    finally {
        connection.end();
    }

    console.log('User created:', user);
    res.status(201).send({ message: 'User created successfully' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something broke!', error: err.message });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});