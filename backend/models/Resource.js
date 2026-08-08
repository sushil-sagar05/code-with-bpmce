const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    type: {
      type: String,
      enum: ['book', 'doc', 'course', 'github', 'youtube', 'sheet', 'tool', 'other'],
      required: true,
    },
    url: { type: String, required: true },
    category: {
      type: String,
      enum: ['web-dev', 'dsa', 'ai-ml', 'genai', 'web3', 'app-dev', 'cyber-security', 'devops', 'cloud', 'general'],
      default: 'general',
    },
    tags: [String],
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isPremium: { type: Boolean, default: false },
    thumbnail: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', resourceSchema);
