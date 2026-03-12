const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
    enum: ['page_view', 'project_view', 'download_resume', 'contact_click', 'external_link']
  },
  page: {
    type: String,
    default: '/'
  },
  projectId: {
    type: String,
    default: null
  },
  referrer: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  country: {
    type: String,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
analyticsSchema.index({ eventType: 1, timestamp: -1 });
analyticsSchema.index({ projectId: 1, timestamp: -1 });

module.exports = mongoose.model("Analytics", analyticsSchema);
