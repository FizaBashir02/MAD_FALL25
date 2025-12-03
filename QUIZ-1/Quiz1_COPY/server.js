// server.js
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ✅ In-memory DB (persists while server runs)
let students = [
    { id: 1, name: "Ali", status: "Absent" },
    { id: 2, name: "Ayesha", status: "Absent" },
    { id: 3, name: "Ahmed", status: "Absent" },
];

// 🔍 helper
function findStudent(id) {
    return students.find((s) => s.id === Number(id));
}

// 🏠 Root
app.get("/", (req, res) => res.send("✅ Attendance backend running!"));

// 📌 Get all students
app.get("/students", (req, res) => {
    res.json(students);
});

// 📌 Get one student by ID
app.get("/students/:id", (req, res) => {
    const student = findStudent(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
});

// 📌 Get attendance for one student
app.get("/attendance/:id", (req, res) => {
    const student = findStudent(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ id: student.id, name: student.name, status: student.status });
});

// 📌 Mark attendance (by ID in body)
app.post("/attendance", (req, res) => {
    const { id, status } = req.body;
    if (!id || !status) {
        return res.status(400).json({ message: "id and status are required" });
    }

    let student = findStudent(id);
    if (student) {
        student.status = status;
    } else {
        student = { id: Number(id), name: `Student ${id}`, status };
        students.push(student);
    }

    res.json({ message: "Attendance saved", student });
});

// 📌 Mark attendance (by ID in URL)
app.post("/attendance/:id", (req, res) => {
    const { status } = req.body;
    const id = req.params.id;

    if (!status) return res.status(400).json({ message: "status is required" });

    let student = findStudent(id);
    if (student) {
        student.status = status;
    } else {
        student = { id: Number(id), name: `Student ${id}`, status };
        students.push(student);
    }

    res.json({ message: "Attendance saved", student });
});

// 📌 Bulk save attendance
app.post("/attendance/save-all", (req, res) => {
    const { students: arr } = req.body;
    if (!Array.isArray(arr)) {
        return res.status(400).json({ message: "students array required" });
    }

    arr.forEach(({ id, status }) => {
        let student = findStudent(id);
        if (student) {
            student.status = status;
        } else {
            students.push({ id: Number(id), name: `Student ${id}`, status });
        }
    });

    res.json({ message: "Bulk attendance saved", students });
});

app.listen(PORT, () => {
    console.log(`🚀 Attendance server running at http://localhost:${PORT}`);
});
