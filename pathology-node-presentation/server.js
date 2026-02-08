const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
const port = process.env.PORT || 8000;

// ─── IN-MEMORY POLL STORE ────────────────────────────────────
// Structure: pollStore[lectureId][slideId] = { votes: {optionIndex: count}, voters: {fingerprintId: optionIndex} }
const pollStore = {};

function getPoll(lectureId, slideId) {
  if (!pollStore[lectureId]) pollStore[lectureId] = {};
  if (!pollStore[lectureId][slideId]) pollStore[lectureId][slideId] = { votes: {}, voters: {} };
  return pollStore[lectureId][slideId];
}

function tallyResults(poll) {
  return { votes: Object.assign({}, poll.votes), total: Object.values(poll.votes).reduce((a, b) => a + b, 0) };
}

// ─── MIDDLEWARE ───────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname, { index: false }));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// ─── ROUTES ──────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/lecture/:name', (req, res) => {
  res.redirect('/lecture.html?lecture=' + encodeURIComponent(req.params.name));
});

// Mobile vote page route
app.get('/vote/:lectureId/:slideId', (req, res) => {
  res.sendFile(path.join(__dirname, 'vote.html'));
});

// Poll config API — serves question + options to the mobile vote page
app.get('/api/poll/:lectureId/:slideId/config', (req, res) => {
  const { lectureId, slideId } = req.params;
  const jsonPath = path.join(__dirname, 'data', 'lectures', lectureId + '.json');

  try {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const slide = data.slides.find(s => s.id === slideId);
    if (!slide || slide.type !== 'poll') {
      return res.status(404).json({ error: 'Poll slide not found' });
    }
    res.json({
      title: slide.title,
      prompt: slide.prompt,
      options: slide.options,
      lectureTitle: (data.meta && data.meta.title) || lectureId
    });
  } catch (e) {
    res.status(404).json({ error: 'Lecture not found' });
  }
});

// API endpoint for processing text input
app.post('/api/process-text', (req, res) => {
  const { text } = req.body;
  const hasSpecialChars = /[$#]/.test(text);
  res.json({
    success: !hasSpecialChars,
    message: hasSpecialChars ? 'Input contains special characters ($ or #)' : 'Input processed successfully',
    processedText: text
  });
});

// ─── SOCKET.IO — REAL-TIME POLLING ───────────────────────────
io.on('connection', (socket) => {

  // Join a poll room
  socket.on('join-poll', ({ lectureId, slideId }) => {
    const room = `${lectureId}/${slideId}`;
    socket.join(room);
    const poll = getPoll(lectureId, slideId);
    socket.emit('poll-results', Object.assign({ slideId: slideId }, tallyResults(poll)));
  });

  // Submit or change a vote
  socket.on('vote', ({ lectureId, slideId, optionIndex, voterId: clientId }) => {
    const poll = getPoll(lectureId, slideId);
    const room = `${lectureId}/${slideId}`;
    const voterId = clientId || socket.id;

    // If voter already voted, decrement old choice
    if (poll.voters[voterId] !== undefined) {
      const oldIdx = poll.voters[voterId];
      poll.votes[oldIdx] = Math.max(0, (poll.votes[oldIdx] || 0) - 1);
    }

    // Record new vote
    poll.voters[voterId] = optionIndex;
    poll.votes[optionIndex] = (poll.votes[optionIndex] || 0) + 1;

    // Broadcast updated results to everyone in the room
    io.to(room).emit('poll-results', Object.assign({ slideId: slideId }, tallyResults(poll)));
  });

  // Presenter resets a single poll
  socket.on('reset-poll', ({ lectureId, slideId }) => {
    const room = `${lectureId}/${slideId}`;
    if (pollStore[lectureId]) pollStore[lectureId][slideId] = { votes: {}, voters: {} };
    io.to(room).emit('poll-results', { slideId: slideId, votes: {}, total: 0 });
    io.to(room).emit('poll-reset', { slideId: slideId });
  });

  // Presenter resets all polls for a lecture
  socket.on('reset-all', ({ lectureId }) => {
    if (pollStore[lectureId]) {
      Object.keys(pollStore[lectureId]).forEach(slideId => {
        const room = `${lectureId}/${slideId}`;
        pollStore[lectureId][slideId] = { votes: {}, voters: {} };
        io.to(room).emit('poll-results', { slideId: slideId, votes: {}, total: 0 });
        io.to(room).emit('poll-reset', { slideId: slideId });
      });
    }
  });
});

// ─── START ───────────────────────────────────────────────────
server.listen(port, () => {
  console.log(`Presentation server running at http://localhost:${port}`);
});
