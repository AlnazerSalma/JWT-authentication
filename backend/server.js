const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRouter');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.send('Welcome to the Haptic app API!');
});

app.use('/api/auth', authRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
