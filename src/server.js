// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // Serve frontend files

// Timetable and Faculty Data
const timetable = {
    monday: [
        { time: "9:00-10:00", subject: "BCS502", faculty: "Prof. Syeda Arbeena Kausar (SAK)"},
        { time: "10:00-11:00", subject: "BCS501", faculty: "Prof. Manjunath N (MN)" },
        { time: "11:15-12:15", subject: "BCS503", faculty: "Prof. Vinutha N (VN)" },
        { time: "12:15-1:15", subject: "BCS515B", faculty: "Prof. Seema Firdose (SF)"},
        { time: "2:00-3:00", subject: "BRMK557", faculty: "Dr. Archana B (AB)" },
        { time: "3:00-4:00", subject: "BESK508", faculty: "Dr. Madhu Navale (MD)" },
        { time: "4:00-5:00", subject: "BCS501(R)", faculty: "Prof. Manjunath N (MN)"  },
    ],
    tuesday: [
        { time: "9:00-11:00", subject: "BCS502 (B2)/ BCSL504 (B3)/ BCS586 (B1)", faculty: "SAK / MN / MB" },
        { time: "11:00-12:00", subject: "BCS503", faculty: "Prof. Vinutha N (VN)" },
        { time: "12:15-1:15", subject: "BCS502", faculty: "Prof. Syeda Arbeena Kausar (SAK)" },
        { time: "2:00-3:00", subject: "BRMK557", faculty: "Dr. Archana B (AB)" },
        { time: "3:00-4:00", subject: "BCS502(R)", faculty: "Prof. Syeda Arbeena Kausar (SAK)" },
    ],
    wednesday: [
        { time: "9:00-11:00", subject: "BCS502 (B3)/ BCSL504 (B1)/ BCS586 (B2)", faculty: "SAK / MN / MB" },
        { time: "11:00-12:00", subject: "BCS501", faculty: "Prof. Manjunath N (MN)" },
        { time: "12:15-1:15", subject: "BCS503", faculty: "Prof. Vinutha N (VN)" },
        { time: "2:00-3:00", subject: "BCS515B (R)", faculty: "Prof. Seema Firdose (SF)" },
    ],
    thursday: [
        { time: "9:00-10:00", subject: "BCS503", faculty: "Prof. Vinutha N (VN)" },
        { time: "10:00-11:00", subject: "BRMK557", faculty: "Dr. Archana B (AB)" },
        { time: "11:00-12:00", subject: "BESK508", faculty: "Dr. Madhu Navale (MD)" },
        { time: "12:15-1:15", subject: "BCS515B", faculty: "Prof. Seema Firdose (SF)" },
        { time: "2:00-4:00", subject: "BCS502 (B1)/ BCSL504 (B2)/ BCS586 (B3)", faculty: "SAK / MN / MB" },
    ],
    friday: [
        { time: "9:00-10:00", subject: "BRMK557", faculty: "Dr. Archana B (AB)" },
        { time: "10:00-11:00", subject: "BCS503", faculty: "Prof. Vinutha N (VN)" },
        { time: "11:00-12:00", subject: "BCS501", faculty: "Prof. Manjunath N (MN)" },
        { time: "12:15-1:15", subject: "BCS515B", faculty: "Prof. Seema Firdose (SF)" },
        { time: "2:00-3:00", subject: "BCS503 (R)", faculty: "Prof. Vinutha N (VN)" },
        { time: "3:00-4:00", subject: "BRMK557 (R)", faculty: "Dr. Archana B (AB)" },
        { time: "4:00-5:00", subject: "Student Activity", faculty: "-" },
    ],
};


const subjects = {
    BCS501: { name: "Software Engineering & Project Management", faculty: "Prof. Manjunath N (MN)" },
    BCS502: { name: "Computer Networks", faculty: "Prof. Syeda Arbeena Kausar (SAK)" },
    BCS503: { name: "Theory of Computation", faculty: "Prof. Vinutha N (VN)" },
    BCS515B: { name: "Artificial Intelligence", faculty: "Prof. Seema Firdose (SF)" },
    BCS586: { name: "Mini Project", faculty: "Prof. Meghashree MB (MB) / Prof. Rumana Anjum (RA)" },
    BRMK557: { name: "Research Methodology and IPR", faculty: "Dr. Archana B (AB)" },
    BESK508: { name: "Environmental Studies", faculty: "Dr. Madhu Navale (MD)" },
};

// Class info
const classInfo = {
    teacher: "Prof. Meghashree MB",
    room: "A309",
    year: "2024-25",
};
  
 
// Chatbot API
app.post('/api/chat', (req, res) => {
    const userMessage = req.body.message.toLowerCase();
    let response = "I didn't understand that. Can you rephrase?";

    // Timetable Queries
    if (userMessage.includes("timetable for") || userMessage.includes("what is the timetable of")) {
        const day = userMessage.split(/timetable for|what is the timetable of/)[1].trim();
        if (timetable[day]) {
            response = `
                <div class="overflow-x-auto">
                    <table class="w-full border-collapse text-sm md:text-base">
                        <tr class="bg-black bg-opacity-20">
                            <th class="p-2 text-left border-b border-white border-opacity-20">Time</th>
                            <th class="p-2 text-left border-b border-white border-opacity-20">Subject</th>
                            <th class="p-2 text-left border-b border-white border-opacity-20">Faculty</th>
                        </tr>
                        ${timetable[day].map(
                            (slot) =>
                                `<tr class="hover:bg-black hover:bg-opacity-10">
                                    <td class="p-2 border-b border-white border-opacity-10">${slot.time}</td>
                                    <td class="p-2 border-b border-white border-opacity-10">${slot.subject}</td>
                                    <td class="p-2 border-b border-white border-opacity-10">${slot.faculty}</td>
                                </tr>`
                        ).join("")}
                    </table>
                </div>
            `;
        } else {
            response = `I don't have timetable data for ${day}.`;
        }
    }
    // Full Timetable Request
    else if (userMessage.includes("class teacher")) {
        response = `The class teacher is ${classInfo.teacher}.`;
    } 
    else if (userMessage.includes("who handles")) {
        const subjectCode = userMessage.split("who handles")[1].trim().toUpperCase();
        if (subjects[subjectCode]) {
            response = `${subjects[subjectCode].name} (${subjectCode}) is handled by ${subjects[subjectCode].faculty}.`;
        } else {
            response = `I don't have information on who handles ${subjectCode}.`;
        }
    }
    // Subject Details
    else if (userMessage.includes("what is")) {
        const subjectCode = userMessage.split("what is")[1].trim().toUpperCase();
        if (subjects[subjectCode]) {
            response = `${subjectCode} is ${subjects[subjectCode].name}, taught by ${subjects[subjectCode].faculty}.`;
        } else {
            response = `I don't have information on ${subjectCode}.`;
        }
    }
    // Default Response
    else {
        response = "I'm here to help! You can ask about the timetable, class teacher, or subjects.";
    }

    res.json({ response });
});

// Start Server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
