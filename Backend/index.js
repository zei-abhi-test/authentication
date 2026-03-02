const express = require('express');
const connectDB = require('./src/Connect/db');
const router = require('./src/Router/user');
require('dotenv').config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('cors')());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api',router)

const startServer = async () => {
    try {
        await connectDB();
        console.log('Database Connected Successfully');

        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });

    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    }
};

startServer();