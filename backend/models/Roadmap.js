const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  platform: { type: String, default: 'LeetCode' }, // LeetCode, Codeforces, CodeChef, GFG, HackerRank, Other
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
  url: { type: String, required: true },
});

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, default: '' },
  type: { type: String, enum: ['video', 'article', 'docs', 'github', 'external', 'question'], default: 'article' },
  questions: [questionSchema],
});

const chapterSchema = new mongoose.Schema({
  chapterNumber: { type: Number },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  resources: [resourceSchema],
  questions: [questionSchema], // Direct chapter questions (when roadmap has no topics)
  order: { type: Number, default: 0 },
});

// Legacy node schema for backward compatibility
const roadmapNodeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  resources: [{ title: String, url: String, type: String }],
  order: { type: Number, default: 0 },
});

const roadmapSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['web-dev', 'dsa', 'ai-ml', 'genai', 'web3', 'app-dev', 'cyber-security', 'devops', 'cloud'],
      required: true,
    },
    icon: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    color: { type: String, default: '#FF6B00' },
    chapters: [chapterSchema],
    nodes: [roadmapNodeSchema], // fallback legacy nodes
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    estimatedTime: { type: String, default: '3 months' },
    enrolledCount: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Roadmap', roadmapSchema);
