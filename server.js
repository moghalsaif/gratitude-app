const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection (we'll get the URI later)
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Gratitude model
const Gratitude = mongoose.model('Gratitude', {
  name: String,
  gratitude: String,
  timestamp: { type: Date, default: Date.now }
});

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/api/gratitudes', async (req, res) => {
  try {
    const gratitudes = await Gratitude.find().sort({ timestamp: -1 }).limit(100);
    res.json(gratitudes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching gratitudes' });
  }
});

app.post('/api/gratitudes', async (req, res) => {
  try {
    const { name, gratitude } = req.body;
    const newGratitude = new Gratitude({ name, gratitude });
    await newGratitude.save();
    res.json(newGratitude);
  } catch (error) {
    res.status(500).json({ error: 'Error saving gratitude' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});