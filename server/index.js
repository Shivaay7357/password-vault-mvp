const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Models
const User = mongoose.model('User', {
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
});

const Vault = mongoose.model('Vault', {
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  encryptedData: { type: String, required: true }
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({ email, passwordHash });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({ 
      message: 'User created successfully', 
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({ 
      message: 'Login successful', 
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get vault items
app.get('/api/vault', authenticateToken, async (req, res) => {
  try {
    const vaultItems = await Vault.find({ userId: req.user.userId });
    res.json(vaultItems);
  } catch (error) {
    console.error('Get vault error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create vault item
app.post('/api/vault', authenticateToken, async (req, res) => {
  try {
    const { encryptedData } = req.body;
    
    if (!encryptedData) {
      return res.status(400).json({ error: 'Encrypted data is required' });
    }

    const vaultItem = new Vault({
      userId: req.user.userId,
      encryptedData
    });

    await vaultItem.save();
    res.status(201).json(vaultItem);
  } catch (error) {
    console.error('Create vault item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update vault item
app.put('/api/vault/:id', authenticateToken, async (req, res) => {
  try {
    const { encryptedData } = req.body;
    const { id } = req.params;
    
    if (!encryptedData) {
      return res.status(400).json({ error: 'Encrypted data is required' });
    }

    const vaultItem = await Vault.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      { encryptedData },
      { new: true }
    );

    if (!vaultItem) {
      return res.status(404).json({ error: 'Vault item not found' });
    }

    res.json(vaultItem);
  } catch (error) {
    console.error('Update vault item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete vault item
app.delete('/api/vault/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const vaultItem = await Vault.findOneAndDelete({ _id: id, userId: req.user.userId });
    
    if (!vaultItem) {
      return res.status(404).json({ error: 'Vault item not found' });
    }

    res.json({ message: 'Vault item deleted successfully' });
  } catch (error) {
    console.error('Delete vault item error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
