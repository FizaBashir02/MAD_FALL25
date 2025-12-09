import React, { useState } from "react";

function App() {
    const [studentId, setStudentId] = useState("");
    const [attendance, setAttendance] = useState(null);
    const [message, setMessage] = useState("");

    const saveAttendance = async () => {
        if (!studentId || attendance === null) {
            setMessage("⚠️ Please enter ID and select Present/Absent.");
            return;
        }
        try {
            const response = await fetch("http://localhost:3000/attendance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: studentId, status: attendance }),
            });
            const data = await response.json();
            setMessage(`✅ ${data.message}`);
        } catch (error) {
            setMessage("❌ Error saving attendance.");
        }
    };

    const fetchAttendance = async () => {
        if (!studentId) {
            setMessage("⚠️ Please enter a student ID.");
            return;
        }
        try {
            const response = await fetch(
                `http://localhost:3000/attendance/${studentId}`
            );
            if (response.status === 404) {
                setMessage("❌ Student not found.");
                setAttendance(null);
                return;
            }
            const data = await response.json();
            setAttendance(data.status);
            setMessage(`📌 Attendance for ID ${studentId}: ${data.status}`);
        } catch (error) {
            setMessage("❌ Error fetching attendance.");
        }
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.container}>
                <h1>🎓 Student Attendance App</h1>

                <input
                    type="text"
                    placeholder="Enter Student ID"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    style={styles.input}
                />

                <div style={styles.checkboxGroup}>
                    <label>
                        <input
                            type="radio"
                            name="attendance"
                            value="Present"
                            checked={attendance === "Present"}
                            onChange={() => setAttendance("Present")}
                        />
                        Present
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="attendance"
                            value="Absent"
                            checked={attendance === "Absent"}
                            onChange={() => setAttendance("Absent")}
                        />
                        Absent
                    </label>
                </div>

                <div style={styles.buttonBox}>
                    <button style={styles.saveBtn} onClick={saveAttendance}>
                        💾 Save
                    </button>
                    <button style={styles.fetchBtn} onClick={fetchAttendance}>
                        🔍 Fetch
                    </button>
                </div>

                {message && <p style={styles.message}>{message}</p>}
            </div>
        </div>
    );
}

const styles = {
    wrapper: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f4f4",
    },
    container: {
        background: "#fff",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        textAlign: "center",
        width: "350px",
    },
    input: {
        width: "90%",
        padding: "10px",
        margin: "15px 0",
        border: "1px solid #ccc",
        borderRadius: "6px",
        fontSize: "16px",
    },
    checkboxGroup: {
        margin: "15px 0",
        display: "flex",
        justifyContent: "space-around",
        fontSize: "18px",
    },
    buttonBox: {
        marginTop: "20px",
    },
    saveBtn: {
        padding: "10px 15px",
        marginRight: "10px",
        background: "#4CAF50",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
    },
    fetchBtn: {
        padding: "10px 15px",
        background: "#2196F3",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
    },
    message: {
        marginTop: "20px",
        fontSize: "16px",
        color: "#333",
    },
};

export default App;
