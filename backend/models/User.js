const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { 
      type: String, 
      required: function() { return !this.googleId; }, 
      select: false 
    },
    googleId: { type: String },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    avatar: { type: String, default: '' },
    batch: { type: String, default: '' },
    branch: { type: String, default: '' },
    bio: { type: String, default: '' },
    phone: { type: String, default: '' },
    rollNumber: { type: String, default: '' },
    skills: [String],
    portfolio: { type: String, default: '' },
    year: { type: String, default: '' },
    location: { type: String, default: 'Madhepura, Bihar' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    experience: [
      {
        role: { type: String, default: '' },
        company: { type: String, default: '' },
        duration: { type: String, default: '' },
        description: { type: String, default: '' },
      },
    ],
    leetcode: { type: String, default: '' },
    codeforces: { type: String, default: '' },
    points: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    achievements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' }],
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
