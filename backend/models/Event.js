const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    endDate: { type: Date },
    venue: { type: String, default: 'Online' },
    type: { type: String, enum: ['workshop', 'hackathon', 'seminar', 'bootcamp', 'meetup', 'contest'], default: 'workshop' },
    status: { type: String, enum: ['upcoming', 'ongoing', 'past'], default: 'upcoming' },
    image: { type: String, default: '' },
    registrationLink: { type: String, default: '' },
    maxRegistrations: { type: Number, default: 100 },
    registrations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tags: [String],
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
