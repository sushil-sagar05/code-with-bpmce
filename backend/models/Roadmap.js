const mongoose = require('mongoose');

const roadmapNodeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  resources: [{ title: String, url: String, type: String }],
  order: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false },
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
    nodes: [roadmapNodeSchema],
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    estimatedTime: { type: String, default: '3 months' },
    enrolledCount: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Roadmap', roadmapSchema);
