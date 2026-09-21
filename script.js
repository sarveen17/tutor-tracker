console.log('NEW SCRIPT LOADED');

let students = [
  // a const variable with an array value
  {
    id: 1,
    name: 'Sarah',
    subject: 'Maths',
    assessments: [],
    lessons: [],
  },
  {
    id: 2,
    name: 'Pierce',
    subject: 'English',
    assessments: [],
    lessons: [],
  },
];

console.log(students); // this is used for debugging/testing to see if the code works

const studentList = document.getElementById('std-list'); // store a reference to the element with the id student-list in the variable studentList

function formatDate(date) {
  const dateObject = new Date(date);

  return dateObject.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function displayStudent(student) {
  const studentCard = document.createElement('div');
  studentCard.dataset.studentId = student.id;

  studentCard.innerHTML = `
        <h3 class="student-name">${student.name}</h3>
        <p class="student-subject">${student.subject}</p>

        <button class="view-btn">View</button>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `; // toFixed(1) for the average means round off to one decimal place

  const deleteButton = studentCard.querySelector('.delete-btn');
  const editButton = studentCard.querySelector('.edit-btn');
  const viewButton = studentCard.querySelector('.view-btn');

  viewButton.addEventListener('click', function () {
    displayStudentDetails(student);
  });

  editButton.addEventListener('click', function () {
    studentBeingEdited = student;

    editName.value = student.name;
    editSubject.value = student.subject;
    // editAverage.value = student.average ?? ''; // ?? "" means return student.average, but if null then return ""

    editForm.hidden = false;
  });

  deleteButton.addEventListener('click', function () {
    const studentIndex = students.findIndex(function (item) {
      return item.id === student.id;
    });

    if (studentIndex !== -1) {
      students.splice(studentIndex, 1);
      // studentCard.remove();
      saveStudents();
      renderStudents();
      updateStudentCount();
      console.log(students);
    } // !== -1 is because if student is not found, the index value would be -1
  });

  studentList.appendChild(studentCard);
}

function displayStudentDetails(student) {
  sessionStorage.setItem('viewingStudentId', student.id);

  let total = 0;

  student.assessments.forEach(function (assessment) {
    total = total + assessment.score;
  });

  const average =
    student.assessments.length > 0 ? total / student.assessments.length : null;

  const latestAssessment = student.assessments[student.assessments.length - 1]; // minus one because JS arrays start at index 0, so the last item in a four-item array would be index 3
  const previousAssessment =
    student.assessments[student.assessments.length - 2];

  let progress =
    student.assessments.length >= 2
      ? latestAssessment.score - previousAssessment.score
      : null;

  studentSection.hidden = true;
  studentView.hidden = false;

  studentViewContent.innerHTML = `
    <h2>${student.name}</h2>
    <p>Subject: ${student.subject}</p>
    <p class="student-average">Average: ${average !== null ? average.toFixed(1) + '%' : 'No average yet'}</p>
    <p class="student-progress">Progress: ${progress === null ? 'No progress info yet' : progress === 0 ? 'Same score as last assessment' : progress + '%'}</p>

    <h3>Assessments</h3>
    <ul class="assessment-list"></ul>

    <h3>Lessons</h3>
    <ul class="lesson-list"></ul>
  `;

  const assessmentList = studentViewContent.querySelector('.assessment-list');
  const lessonList = studentViewContent.querySelector('.lesson-list');

  student.assessments.forEach(function (assessment) {
    const assessmentItem = document.createElement('li');

    assessmentItem.textContent = `${assessment.name}: ${assessment.score}% - ${formatDate(assessment.date)}`;

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    assessmentItem.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    assessmentItem.appendChild(deleteButton);

    editButton.addEventListener('click', function () {
      assessmentBeingEdited = assessment;

      editAssessmentName.value = assessment.name;
      editAssessmentScore.value = assessment.score ?? '';
      editAssessmentDate.value = assessment.date;

      editAssessmentForm.hidden = false;
    });

    deleteButton.addEventListener('click', function () {
      const assessmentIndex = student.assessments.findIndex(function (item) {
        return item.id === assessment.id;
      });

      if (assessmentIndex !== -1) {
        student.assessments.splice(assessmentIndex, 1);
        saveStudents();
        displayStudentDetails(student);
        console.log(students);
      }
    });

    assessmentList.appendChild(assessmentItem);
  });

  student.lessons.forEach(function (lesson) {
    const lessonItem = document.createElement('li');

    lessonItem.textContent = `${formatDate(lesson.date)} - ${lesson.note}`;

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    lessonItem.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    lessonItem.appendChild(deleteButton);

    editButton.addEventListener('click', function () {
      lessonBeingEdited = lesson;

      editLessonDate.value = lesson.date;
      editLessonNote.value = lesson.note;

      editLessonForm.hidden = false;
    });

    deleteButton.addEventListener('click', function () {
      const lessonIndex = student.lessons.findIndex(function (item) {
        return item.id === lesson.id;
      });

      if (lessonIndex !== -1) {
        student.lessons.splice(lessonIndex, 1);
        saveStudents();
        displayStudentDetails(student);
        console.log(students);
      }
    });

    lessonList.appendChild(lessonItem);
  });
}

function renderStudents() {
  studentList.innerHTML = '';

  const filteredStudents = students.filter(function (student) {
    return student.name
      .toLowerCase()
      .includes(studentSearch.value.toLowerCase());
  });

  filteredStudents.sort(function (a, b) {
    if (studentSort.value === 'name-asc') {
      return a.name.localeCompare(b.name);
    } else if (studentSort.value === 'name-desc') {
      return b.name.localeCompare(a.name);
    }
  });

  filteredStudents.forEach(function (student) {
    displayStudent(student);
  });
}

const stdForm = document.getElementById('std-form');
const editForm = document.getElementById('edit-form');
const editName = document.getElementById('edit-name');
const editSubject = document.getElementById('edit-subject');
const cancelEdit = document.getElementById('cancel-edit');
const studentCount = document.getElementById('std-count');

const assessmentForm = document.getElementById('assessment-form');
const assessmentStudent = document.getElementById('assessment-student');
const assessmentName = document.getElementById('assessment-name');
const assessmentScore = document.getElementById('assessment-score');
const assessmentDate = document.getElementById('assessment-date');

assessmentDate.value = new Date().toLocaleDateString('en-CA');

/* const today = new Date();
 const todayString = today.toISOString().split("T")[0];
 assessmentDate.value = todayString;
 this is another way to make the date for the assessment form to show the current date */

const editAssessmentForm = document.getElementById('edit-assessment-form');
const editAssessmentName = document.getElementById('edit-assessment-name');
const editAssessmentScore = document.getElementById('edit-assessment-score');
const editAssessmentDate = document.getElementById('edit-assessment-date');
const cancelAssessmentEdit = document.getElementById('cancel-assessment-edit');

const lessonForm = document.getElementById('lesson-form');
const lessonStudent = document.getElementById('lesson-student');
const lessonDate = document.getElementById('lesson-date');
const lessonNote = document.getElementById('lesson-note');

lessonDate.value = new Date().toLocaleDateString('en-CA');

const editLessonForm = document.getElementById('edit-lesson-form');
const editLessonDate = document.getElementById('edit-lesson-date');
const editLessonNote = document.getElementById('edit-lesson-note');
const cancelLessonEdit = document.getElementById('cancel-lesson-edit');

const studentSearch = document.getElementById('student-search');
const studentSort = document.getElementById('student-sort');

studentSearch.value = '';

const studentSection = document.getElementById('std-section');
const studentView = document.getElementById('student-view');
const backToStudents = document.getElementById('back-to-students');
const studentViewContent = document.getElementById('student-view-content');

function saveStudents() {
  localStorage.setItem('savedStudents', JSON.stringify(students));
} // setItem(new thing, thing you want to place in new thing);

const savedStudents = localStorage.getItem('savedStudents');

if (savedStudents != null) {
  students = JSON.parse(savedStudents);
}

const viewingStudentId = sessionStorage.getItem('viewingStudentId');

if (viewingStudentId !== null) {
  const student = students.find(function (student) {
    return student.id === Number(viewingStudentId);
  });

  if (student !== undefined) {
    displayStudentDetails(student);
  }
} // this is to keep the student view when refresh page rather than going back to dashboard; check first line of displayStudentDetails() for the first part of this

function updateStudentCount() {
  studentCount.textContent = students.length;
}

let studentBeingEdited = null;
let assessmentBeingEdited = null;
let lessonBeingEdited = null;

updateStudentCount();
renderStudents();
updateStudents(); // update student dropdown

stdForm.addEventListener('submit', function (event) {
  // callback function: function that's passed into some other function/method that's executed/called later
  event.preventDefault(); // prevent the browser from refreshing the page by default when a form is submitted so that the following code actually gets executed

  const nameInput = document.getElementById('std-name');
  const subjectInput = document.getElementById('std-subject');

  const newStudent = {
    id: Date.now(),
    name: nameInput.value,
    subject: subjectInput.value,
    assessments: [],
    lessons: [],
  };

  students.push(newStudent); // push means add something to an array - syntax: array.push(newItem)
  saveStudents();
  renderStudents();
  stdForm.reset();
  updateStudentCount();
  updateStudents();
  console.log(students);
});

editForm.addEventListener('submit', function (event) {
  event.preventDefault();

  if (studentBeingEdited === null) {
    return;
  }

  studentBeingEdited.name = editName.value;
  studentBeingEdited.subject = editSubject.value;

  const editedCard = studentList.querySelector(
    `[data-student-id="${studentBeingEdited.id}"]`,
  );

  editedCard.querySelector('.student-name').textContent =
    studentBeingEdited.name;
  editedCard.querySelector('.student-subject').textContent =
    studentBeingEdited.subject;

  editForm.hidden = true;
  studentBeingEdited = null;

  saveStudents();

  console.log(students);
});

cancelEdit.addEventListener('click', function () {
  editForm.hidden = true;
  studentBeingEdited = null;
});

function updateStudents() {
  assessmentStudent.innerHTML = '<option value="">Select student</option>';
  lessonStudent.innerHTML = '<option value="">Select student</option>';

  students.forEach(function (student) {
    const assessmentOption = document.createElement('option');
    const lessonOption = document.createElement('option');

    assessmentOption.value = student.id;
    assessmentOption.textContent = student.name;

    lessonOption.value = student.id;
    lessonOption.textContent = student.name;

    assessmentStudent.appendChild(assessmentOption);
    lessonStudent.appendChild(lessonOption);
  });
}

assessmentForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const studentId = Number(assessmentStudent.value);
  const name = assessmentName.value;
  const score = Number(assessmentScore.value);
  const date = assessmentDate.value;

  const student = students.find(function (student) {
    return student.id === studentId;
  });

  if (student === undefined) {
    return;
  } // this is just a defensive step; not actually necessary because the dropdown already has student's name, but still could be useful in the event that, for whatever reason, the student exists in the dropdown even after being deleted from the students array

  const assessment = {
    id: Date.now(),
    name: name,
    score: score,
    date: date,
  };

  student.assessments.push(assessment);
  saveStudents();
  renderStudents();
  assessmentForm.reset();
  assessmentDate.value = new Date().toLocaleDateString('en-CA');
  console.log(students);
});

editAssessmentForm.addEventListener('submit', function (event) {
  event.preventDefault();

  if (assessmentBeingEdited === null) {
    return;
  }

  assessmentBeingEdited.name = editAssessmentName.value;
  assessmentBeingEdited.score =
    editAssessmentScore.value === '' ? null : Number(editAssessmentScore.value);
  assessmentBeingEdited.date = editAssessmentDate.value;

  const student = students.find(function (student) {
    return student.assessments.includes(assessmentBeingEdited);
  });

  saveStudents();
  displayStudentDetails(student);
  editAssessmentForm.hidden = true;
  assessmentBeingEdited = null;
});

cancelAssessmentEdit.addEventListener('click', function () {
  editAssessmentForm.hidden = true;
  assessmentBeingEdited = null;
});

lessonForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const studentId = Number(lessonStudent.value);
  const date = lessonDate.value;
  const note = lessonNote.value;

  const student = students.find(function (student) {
    return student.id === studentId;
  });

  if (student === undefined) {
    return;
  }

  const lesson = {
    id: Date.now(),
    date: date,
    note: note,
  };

  student.lessons.push(lesson);
  saveStudents();
  renderStudents();
  lessonForm.reset();
  lessonDate.value = new Date().toLocaleDateString('en-CA');
  console.log(students);
});

editLessonForm.addEventListener('submit', function (event) {
  event.preventDefault();

  if (lessonBeingEdited === null) {
    return;
  }

  lessonBeingEdited.date = editLessonDate.value;
  lessonBeingEdited.note = editLessonNote.value;

  const student = students.find(function (student) {
    return student.lessons.includes(lessonBeingEdited);
  });

  saveStudents();
  displayStudentDetails(student);
  editLessonForm.hidden = true;
  lessonBeingEdited = null;
});

cancelLessonEdit.addEventListener('click', function () {
  editLessonForm.hidden = true;
  lessonBeingEdited = null;
});

studentSearch.addEventListener('input', function () {
  renderStudents();
});

studentSort.addEventListener('change', function () {
  renderStudents();
}); // change here refers to the change in the dropdown option for sorting

backToStudents.addEventListener('click', function () {
  sessionStorage.removeItem('viewingStudentId'); // ensures that when we go back to dashboard and refresh page, it won't return to student view using the temporary sessionStorage student ID
  studentView.hidden = true;
  studentSection.hidden = false;
});
