const students = [
    {
        name: "Sarah",
        subject: "Maths",
        average: 78
    },
    {
        name: "Pierce",
        subject: "English",
        average: 65
    }
];

console.log(students);

const studentList = document.getElementById("student-list");

students.forEach(function(student) {
    const studentCard = document.createElement("div");

    studentCard.innerHTML = `
        <h3>${student.name}</h3>
        <p>${student.subject}</p>
        <p>Average: ${student.average}%</p>
    `;

    studentList.appendChild(studentCard);
});