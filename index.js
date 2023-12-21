const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // Import body-parser

const app = express();
app.use(express.json()); // Use express.json() for parsing JSON bodies

mongoose.connect('mongodb://localhost:27017/blog-api', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Could not connect to MongoDB', err);
    process.exit(1);
  });


const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const BlogPost = mongoose.model('BlogPost', blogSchema);

app.post('/api/blog', async (req, res) => {
  try {
    // Validate request body
    if (!req.body.title || !req.body.content || !req.body.author) {
      return res.status(400).send('Bad Request: Title, content, and author are required.');
    }

    const blogPost = new BlogPost({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author
    });

    const savedBlogPost = await blogPost.save();
    res.status(201).json(savedBlogPost);
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).send('Internal Server Error');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port http://localhost/${port}...`));