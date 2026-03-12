const mongoose = require("mongoose");

const serviceInquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  company: {
    type: String,
    trim: true,
    default: ''
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['web-development', 'fullstack-app', 'api-development', 'consulting', 'other']
  },
  projectScope: {
    type: String,
    enum: ['small', 'medium', 'large', 'enterprise'],
    default: 'medium'
  },
  budget: {
    type: String,
    default: ''
  },
  timeline: {
    type: String,
    default: ''
  },
  requirements: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'in-progress', 'completed', 'declined'],
    default: 'new'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("ServiceInquiry", serviceInquirySchema);
