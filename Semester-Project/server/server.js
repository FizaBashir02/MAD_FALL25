require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { User, Room, Complaint, MealOrder } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// Database Connection
// Uses the variable from server/.env, falls back to the hardcoded string if file is missing (for safety)
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://fizakhan021206_db_user:fiza2002@cluster0.2qo2ken.mongodb.net/hostel_management?appName=Cluster0';

// Middleware
app.use(cors());
app.use(express.json());

// Seed Database Function
const seedDatabase = async () => {
  try {
    const adminExists = await User.findOne({ role: 'ADMIN' });
    if (!adminExists) {
      console.log('⚡ Seeding Default Admin...');
      await new User({
        name: 'System Admin',
        email: 'admin@hostel.com',
        password: 'password123',
        role: 'ADMIN',
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff'
      }).save();
      console.log('✅ Created: admin@hostel.com / password123');
    }

    const wardenExists = await User.findOne({ role: 'WARDEN' });
    if (!wardenExists) {
      console.log('⚡ Seeding Default Warden...');
      await new User({
        name: 'Head Warden',
        email: 'warden@hostel.com',
        password: 'password123',
        role: 'WARDEN',
        avatar: 'https://ui-avatars.com/api/?name=Warden&background=random'
      }).save();
      console.log('✅ Created: warden@hostel.com / password123');
    }

    const kitchenExists = await User.findOne({ role: 'KITCHEN' });
    if (!kitchenExists) {
      console.log('⚡ Seeding Default Kitchen Staff...');
      await new User({
        name: 'Head Chef',
        email: 'kitchen@hostel.com',
        password: 'password123',
        role: 'KITCHEN',
        avatar: 'https://ui-avatars.com/api/?name=Chef&background=random'
      }).save();
      console.log('✅ Created: kitchen@hostel.com / password123');
    }
  } catch (error) {
    console.error('Seeding Error:', error);
  }
};

// Connect
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected Successfully to hostel_management');
    await seedDatabase();
  })
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- Routes ---

// Auth
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Simple plain text password check for demo purposes
    const user = await User.findOne({ email, password });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    res.json(user);
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({
        ...req.body,
        avatar: req.body.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.body.name)}&background=random`
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch('/api/auth/profile/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Students
app.get('/api/students', async (req, res) => {
  try {
    const students = await User.find({ role: 'STUDENT' });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const newUser = new User({ 
      ...req.body, 
      role: 'STUDENT', 
      password: 'password123', // Default password
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(req.body.name)}&background=random&color=fff&background=2563eb`
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Rooms
app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/rooms', async (req, res) => {
  try {
    const newRoom = new Room({ ...req.body, occupants: [] });
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/rooms/assign', async (req, res) => {
  try {
    const { roomId, studentId } = req.body;

    // 1. Remove student from any previous room
    await Room.updateMany(
      { occupants: studentId },
      { $pull: { occupants: studentId } }
    );

    // 2. Add student to new room
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });
    
    room.occupants.push(studentId);
    await room.save();

    // 3. Update Student profile
    await User.findByIdAndUpdate(studentId, { roomNumber: room.roomNumber });

    res.json({ message: "Assigned successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Complaints
app.get('/api/complaints', async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { studentId: userId } : {};
    const complaints = await Complaint.find(query).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/complaints', async (req, res) => {
  try {
    const newComplaint = new Complaint({
      ...req.body,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    });
    await newComplaint.save();
    res.status(201).json(newComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch('/api/complaints/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/complaints/:id', async (req, res) => {
    try {
        await Complaint.findByIdAndDelete(req.params.id);
        res.json({ message: 'Complaint deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mess Orders
app.get('/api/orders', async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { studentId: userId } : {};
    const orders = await MealOrder.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new MealOrder({
      ...req.body,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await MealOrder.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Menu Endpoints
app.get('/api/menu', async (req, res) => {
    // Basic mock menu for now, could be moved to DB later
    res.json({
        Monday: { breakfast: 'Eggs & Toast', lunch: 'Chicken Curry', dinner: 'Vegetable Rice' },
        Tuesday: { breakfast: 'Oatmeal', lunch: 'Beef Stew', dinner: 'Pasta' },
        Wednesday: { breakfast: 'Pancakes', lunch: 'Lentils', dinner: 'Roast Chicken' },
        Thursday: { breakfast: 'Omelette', lunch: 'Fish Fry', dinner: 'Soup & Bread' },
        Friday: { breakfast: 'French Toast', lunch: 'Biryani', dinner: 'Burgers' },
        Saturday: { breakfast: 'Paratha', lunch: 'Sandwiches', dinner: 'Pizza' },
        Sunday: { breakfast: 'Halwa Puri', lunch: 'Noodles', dinner: 'Barbecue' },
    });
});

app.put('/api/menu', async (req, res) => {
    // In a full implementation, save to DB.
    res.json({ message: 'Menu updated' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
