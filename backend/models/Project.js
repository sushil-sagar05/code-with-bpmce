const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    tech: [String],
    github: { type: String, default: '' },
    demo: { type: String, default: '' },
    image: { type: String, default: '' },
    team: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    category: { type: String, default: 'web' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isFeatured: { type: Boolean, default: false },
    status: { type: String, enum: ['completed', 'in-progress', 'idea'], default: 'completed' },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
