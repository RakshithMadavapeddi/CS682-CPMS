const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const { check, validationResult } = require('express-validator');
const  path = require('path');
const Project = require('./models/project');



require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Parse JSON body
app.use(express.json());

// Connect to MongoDB
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Set up session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Change to true if using HTTPS
      maxAge: 1000 * 60 * 60 * 24, // Session expires after 1 day
    },
  })
);

// Middleware to check for authenticated users
const requireAuth = (req, res, next) => {
  const token = req.session.token;
  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error(err.message);
    res.redirect('/login');
  }
};

// Define auth routes
const authRouter = express.Router();

// Import auth controller
const auth = require('./controllers/auth');

// Register a new user
authRouter.post(
  '/register',
  [
    check('name', 'Please enter your name').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({
      min: 6,
    }),
  ],
  auth.register
);

// Login a user
authRouter.post(
  '/login',
  [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  auth.login
);

// Logout user
authRouter.get('/logout', auth.logout);

// didnt understand 
// Get authenticated user's info// didnt understand here 
// authRouter.get('/me', auth.me);

// Mount auth routes
app.use('/api/auth', authRouter);

// Import profile controller
const profile = require('./controllers/profile');

// Define profile routes
const profileRouter = express.Router();

// Get user profile
profileRouter.get('/', requireAuth, (req, res) => {
    res.send('This is the user profile');
  });
  


// Update user profile
profileRouter.put('/', requireAuth, (req, res) => {
    profile.updateProfile(req, res);
  });
  

// Mount profile routes
app.use('/api/profile', profileRouter);



// Import client controller
const client = require('./controllers/client');

// Define client routes
const clientRouter = express.Router();

// Client Dashboard
clientRouter.get('/dashboard', requireAuth ,(req, res) => {
  client.getDashboard(req, res, next);
});

// Create a new project
profileRouter.post('/projects', requireAuth ,(req, res) => {
    profile.createProject(req, res);
});


//no such fucntion
// Get project form
//clientRouter.get('/create-project', requireAuth, client.getProjectForm);

// Get project edit form
//clientRouter.get('/edit-project/:id', requireAuth, client.getProjectEditForm);

// Update a project
clientRouter.put('/projects/:id', requireAuth ,(req, res) => {
  client.updateProject(req, res);
});


// Delete a project no such fucntion
//clientRouter.delete('/projects/:id', requireAuth, client.deleteProject);

// Mount client routes
app.use('/client', clientRouter);

// Serve static files
app.use(express.static(path.join(__dirname, '..', 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});