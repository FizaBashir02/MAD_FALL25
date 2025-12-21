
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'WARDEN', 'KITCHEN', 'STUDENT'], required: true },
  avatar: String,
  studentId: String,
  roomNumber: String,
  contactNumber: String,
  emergencyContact: String,
  cnic: String,
  address: String,
  purposeOfStay: String,
}, { timestamps: true });

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  occupants: [{ type: String }],
  floor: Number,
  type: { type: String, enum: ['1-bed', '2-bed', '4-bed'] }
});

const complaintSchema = new mongoose.Schema({
  studentId: String,
  studentName: String,
  category: { type: String, required: true },
  description: String,
  date: String,
  status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' }
}, { timestamps: true });

const mealOrderSchema = new mongoose.Schema({
  studentId: String,
  studentName: String,
  items: [String],
  date: String,
  pickupTime: String,
  status: { type: String, enum: ['Pending', 'Preparing', 'Ready', 'Collected'], default: 'Pending' },
  qrCode: String
}, { timestamps: true });

module.exports = {
  User: mongoose.model('User', userSchema),
  Room: mongoose.model('Room', roomSchema),
  Complaint: mongoose.model('Complaint', complaintSchema),
  MealOrder: mongoose.model('MealOrder', mealOrderSchema)
};