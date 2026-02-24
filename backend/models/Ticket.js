const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    required: true,
    unique: true
  },
  serviceType: {
    type: String, // e.g., 'Registrar', 'Cashier', 'Accounting'
    required: true
  },
  status: {
    type: String,
    enum: ['waiting', 'serving', 'completed'],
    default: 'waiting'
  },
  counter: {
    type: Number, // Which window/desk is calling the student
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Ticket', TicketSchema);