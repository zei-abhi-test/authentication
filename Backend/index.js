// const express = require('express');
// const connectDB = require('./src/Connect/db');
// const router = require('./src/Router/user');
// require('dotenv').config();
// const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(require('cors')());

// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

// app.use('/api',router)

// const startServer = async () => {
//     try {
//         await connectDB();
//         console.log('Database Connected Successfully');

//         app.listen(process.env.PORT, () => {
//             console.log(`Server is running on port ${process.env.PORT}`);
//         });

//     } catch (error) {
//         console.error('Error connecting to the database:', error);
//         process.exit(1);
//     }
// };

// startServer();

//3.15


// const express = require('express')
// const dotenv = require('dotenv')
// const cors = require('cors')
// const connectDB = require('./src/config/db')
// const userRoutes = require('./src/routes/userRoutes')

// dotenv.config()
// connectDB()

// const app = express()

// app.use(cors())
// app.use(express.json())
// app.use("/api/users", userRoutes)

// app.use('/api/users', require('./src/routes/userRoutes'))

// const PORT = process.env.PORT || 5000

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })

//3.16

require("dotenv").config()
const express = require("express")
const cors = require("cors")

const app = express()

app.use(express.json())

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
)

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected successfully" })
})

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})