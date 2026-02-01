
let members = JSON.parse(localStorage.getItem("members")) || [];
let programs = JSON.parse(localStorage.getItem("programs")) || [
  "Leadership Essentials",
  "1-Crore Club",
  "100 Board Members"
];

const totalMembers = document.getElementById("totalMembers");
const totalPrograms = document.getElementById("totalPrograms");
const mentoringCompleted = document.getElementById("mentoringCompleted");
const totalFeedback = document.getElementById("totalFeedback");

const programSelect = document.getElementById("programSelect");
const filterProgram = document.getElementById("filterProgram");
const searchMember = document.getElementById("searchMember");
const filterCategory = document.getElementById("filterCategory");
const memberTable = document.getElementById("memberTable");

let programChart, mentoringChart;

function initPrograms() {
  programSelect.innerHTML = "";
  filterProgram.innerHTML = `<option value="">All Programs</option>`;

  programs.forEach(p => {
    programSelect.innerHTML += `<option>${p}</option>`;
    filterProgram.innerHTML += `<option>${p}</option>`;
  });

  totalPrograms.innerText = programs.length;
}

function addProgram() {
  const input = document.getElementById("programInput");
  const name = input.value.trim();

  if (!name || programs.includes(name)) return alert("Invalid program");

  programs.push(name);
  localStorage.setItem("programs", JSON.stringify(programs));
  input.value = "";
  initPrograms();
  renderDashboard();
}

function removeProgram() {
  const input = document.getElementById("programInput");
  const name = input.value.trim();

  programs = programs.filter(p => p !== name);
  localStorage.setItem("programs", JSON.stringify(programs));

  members.forEach(m => { if (m.program === name) m.program = ""; });
  localStorage.setItem("members", JSON.stringify(members));

  input.value = "";
  initPrograms();
  renderDashboard();
}


function addMember() {

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const mentorInput = document.getElementById("mentor");
  const categoryInput = document.getElementById("category");
  const feedbackInput = document.getElementById("feedback");

 
  const member = {
    id: Date.now(),
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    mentor: mentorInput.value.trim(),
    program: programSelect.value,
    category: categoryInput.value.trim(),
    feedback: feedbackInput.value.trim(),
    mentoringStatus: "Pending"
  };

  
  if (!member.name || !member.email) {
    return alert("Fill required fields");
  }

  members.push(member);
  localStorage.setItem("members", JSON.stringify(members));

 
  nameInput.value = "";
  emailInput.value = "";
  mentorInput.value = "";
  categoryInput.value = "";
  feedbackInput.value = "";
  programSelect.value = "";

  renderDashboard();
}

function deleteMember(id) {
  members = members.filter(m => m.id !== id);
  localStorage.setItem("members", JSON.stringify(members));
  renderDashboard();
}

function enableEdit(id) {
  document.querySelectorAll(`.row-${id} [contenteditable]`)
    .forEach(td => td.contentEditable = "true");
}

function saveEdit(id) {
  document.querySelectorAll(`.row-${id} [contenteditable]`)
    .forEach(td => td.contentEditable = "false");
}

function updateField(id, field, value) {
  const m = members.find(x => x.id === id);
  m[field] = value.trim();
  localStorage.setItem("members", JSON.stringify(members));
  renderDashboard();
}


function renderDashboard() {
  let filtered = [...members]
    .sort((a, b) => b.id - a.id)
    .filter(m =>
      (!filterProgram.value || m.program === filterProgram.value) &&
      (!filterCategory.value || m.category === filterCategory.value) &&
      (m.name.toLowerCase().includes(searchMember.value.toLowerCase()) ||
       m.email.toLowerCase().includes(searchMember.value.toLowerCase()))
    );

  memberTable.innerHTML = `
    <tr>
      <th>Name</th><th>Email</th><th>Mentor</th>
      <th>Program</th><th>Status</th><th>Actions</th>
    </tr>
  `;

  filtered.forEach(m => {
    memberTable.innerHTML += `
      <tr class="row-${m.id}">
        <td contenteditable="false" onblur="updateField(${m.id},'name',this.innerText)">${m.name}</td>
        <td contenteditable="false" onblur="updateField(${m.id},'email',this.innerText)">${m.email}</td>
        <td contenteditable="false" onblur="updateField(${m.id},'mentor',this.innerText)">${m.mentor}</td>
        <td>${m.program}</td>
        <td>
          <select onchange="updateField(${m.id},'mentoringStatus',this.value)">
            <option ${m.mentoringStatus==="Pending"?"selected":""}>Pending</option>
            <option ${m.mentoringStatus==="Completed"?"selected":""}>Completed</option>
          </select>
        </td>
        <td>
          <button class="edit" onclick="enableEdit(${m.id})">Edit</button>
          <button class="save" onclick="saveEdit(${m.id})">Save</button>
          <button class="delete" onclick="deleteMember(${m.id})">Delete</button>
        </td>
      </tr>`;
  });

  totalMembers.innerText = members.length;
  mentoringCompleted.innerText = members.filter(m => m.mentoringStatus === "Completed").length;
  totalFeedback.innerText = members.filter(m => m.feedback).length;

  updateCharts();
}


function updateCharts() {
  if (programChart) programChart.destroy();
  programChart = new Chart(document.getElementById("programChart"), {
    type: "bar",
    data: {
      labels: programs,
      datasets: [{
        data: programs.map(p => members.filter(m => m.program === p).length),
        backgroundColor: "#6C63FF"
      }]
    }
  });

  if (mentoringChart) mentoringChart.destroy();
  mentoringChart = new Chart(document.getElementById("mentoringChart"), {
    type: "doughnut",
    data: {
      labels: ["Completed", "Pending"],
      datasets: [{
        data: [
          members.filter(m => m.mentoringStatus === "Completed").length,
          members.filter(m => m.mentoringStatus === "Pending").length
        ],
        backgroundColor: ["#00C897", "#FF6584"]
      }]
    }
  });
}

function logout() {
  window.location.href = "index.html";
}

initPrograms();
renderDashboard();
