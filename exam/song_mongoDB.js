const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/song_DB');

const songSchema = new mongoose.Schema({
  name: { type: String, required: true },
  author: { type: String, required: true },
  size: { type: Number, required: true },
  views: { type: Number, default: 0 },
});

const Song = mongoose.model('Song', songSchema);

app.use(bodyParser.json());

// Route để lấy tất cả các bài hát
app.get('/api/songs', async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route để lấy một bài hát theo ID
app.get('/api/songs/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ error: 'Không tìm thấy bài hát' });
    }
    res.json(song);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route để thêm một bài hát mới
app.post('/api/songs', async (req, res) => {
  const { name, author, size } = req.body;
  try {
    const newSong = new Song({ name, author, size });
    const savedSong = await newSong.save();
    res.json(savedSong);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route để cập nhật một bài hát theo ID
app.put('/api/songs/:id', async (req, res) => {
  const { name, author, size } = req.body;
  try {
    const updatedSong = await Song.findByIdAndUpdate(
      req.params.id,
      { name, author, size },
      { new: true }
    );
    if (!updatedSong) {
      return res.status(404).json({ error: 'Không tìm thấy bài hát' });
    }
    res.json(updatedSong);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route để xóa một bài hát theo ID
app.delete('/api/songs/:id', async (req, res) => {
  try {
    const deletedSong = await Song.findByIdAndDelete(req.params.id);
    if (!deletedSong) {
      return res.status(404).json({ error: 'Không tìm thấy bài hát' });
    }
    res.json({ message: 'Bài hát đã được xóa thành công' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bắt đầu server
app.listen(port, () => {
  console.log(`Server đang chạy ở cổng ${port}`);
});
