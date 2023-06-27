// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const cors = require('cors');
const session = require('express-session'); // Ajoutez cette ligne

// Express app initialization
const app = express();

// Middleware

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(session({
    secret: 'H&HcOrP2023!', // Utilisez une clé secrète plus sécurisée dans une application de production
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Définir à 'true' si vous utilisez HTTPS
      httpOnly: true, 
      maxAge: 60 * 60 * 1000 // 1 heure en millisecondes
    }
  }));

mongoose.connect('mongodb+srv://gamenotcreator:didou1234@webapp.mymezal.mongodb.net/?retryWrites=true&w=majority', {
useNewUrlParser: true,
useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', () => console.log('Error in connecting to database'));
db.once('open', () => console.log('Connected to Database'));

// CORS

const allowedOrigins = ['https://hnh.tn/']; // Add your allowed origins here

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Import routes and configuration
const authRoutes = require('./routes/auth')(db);


app.get("/", (req, res) => {
return res.redirect("index.html");
});

app.get('/access_denied', function (req, res) {
res.sendFile(path.join(__dirname, 'public', 'access_denied.html'));
});

app.use('/api/auth', authRoutes);

app.listen(3500, () => console.log('Server listening on port 3500'));