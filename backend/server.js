//Importing modules
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

require('dotenv').config;

//Setting up an express application and middleware
const app = express();

app.use(express.json());
app.use(cors());

//Craeting MYSQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1p9kaau99@Java",
    database: "auth_db"
});

//Incase of connection error
db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        return;
    }
    console,log("Connected to database");
});

//Registration endpoint
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
     [username, email, hashedPassword],
    (err, result) => {
        if (err){
            res.status(500).json({ error: 'Error registering user'});
        }
        else{
            res.status(201).json({ message: 'User registered successfully'});
        }
    });
});

//Login endpoint
app.post("/login", (req, res) => {
    const {email, password} = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) {
            res.status(500).json({ error: "Error logging in"});
        }
        else if (results.length > 0){
            const comparison = await bcrypt.compare(password, results[0].password);
            if (comparison) {
                const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET, { expiresIn: '1h'});
                res.json({ token});
            }
            else{
                res.status(400).json({ error: 'Incorrect password'});
            }
        }
        else{
            res.status(404).json({ error: 'User not found'});
        }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));