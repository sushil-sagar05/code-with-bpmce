const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['internship', 'ppo', 'hackathon', 'open-source', 'gsoc', 'sih', 'leetcode', 'codeforces', 'other'],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    company: { type: String, default: '' },
    platform: { type: String, default: '' },
    date: { type: Date, required: true },
    proof: { type: String, default: '' },
    image: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    points: { type: Number, default: 50 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Achievement', achievementSchema);
