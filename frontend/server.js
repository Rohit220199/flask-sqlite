const express = require('express');
const path = require('path');
const fetch = require('node-fetch'); // install node-fetch v2

const app = express();
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'static')));

// Proxy API requests to Flask backend
const BACKEND_URL = process.env.BACKEND_URL || 'http://flask-service:5000';

app.get('/notes', async (req, res) => {
    try {
        const response = await fetch(`${BACKEND_URL}/notes`);
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

app.post('/notes', async (req, res) => {
    try {
        const response = await fetch(`${BACKEND_URL}/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add note' });
    }
});

app.delete('/notes/:id', async (req, res) => {
    try {
        const response = await fetch(`${BACKEND_URL}/notes/${req.params.id}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete note' });
    }
});

// Catch-all route to serve index.html for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
