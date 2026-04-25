const API_BASE = "http://localhost:5000/api";

const modules = {
  students: {
    title: "Students",
    subtitle: "Manage student records and profile details.",
    endpoint: "students",
    idKey: "STUDENTID",
    fields: ["StudentID", "FirstName", "LastName", "RegNo", "Email", "Program", "BatchYear", "DOB"],
    formFields: [
      { name: "StudentID", required: true },
      { name: "FirstName", required: true },
      { name: "LastName", required: true },
      { name: "RegNo" },
      { name: "Email", type: "email" },
      { name: "Program" },
      { name: "BatchYear", type: "number" },
      { name: "DOB", type: "date", required: true },
    ],
  },
  exams: {
    title: "Exams",
    subtitle: "Track exam details, duration, and assigned instructor.",
    endpoint: "exams",
    idKey: "EXAMID",
    fields: ["ExamID", "Title", "Duration", "TotalMarks", "ExamDate", "Type", "AllowedAttempts", "CourseID", "InstructorID"],
    formFields: [
      { name: "ExamID", required: true },
      { name: "Title", required: true },
      { name: "Duration", type: "number", required: true },
      { name: "TotalMarks", type: "number", required: true },
      { name: "ExamDate", type: "date" },
      { name: "Type", options: ["MCQ", "Subjective", "Mixed"] },
      { name: "AllowedAttempts", type: "number" },
      { name: "CourseID", required: true },
      { name: "InstructorID", required: true },
    ],
  },
  departments: {
    title: "Departments",
    subtitle: "Maintain academic departments and faculties.",
    endpoint: "departments",
    idKey: "DEPTID",
    fields: ["DeptID", "DeptName", "Faculty"],
    formFields: [
      { name: "DeptID", required: true },
      { name: "DeptName", required: true },
      { name: "Faculty" },
    ],
  },
  courses: {
    title: "Courses",
    subtitle: "Course catalog linked to departments.",
    endpoint: "courses",
    idKey: "COURSEID",
    fields: ["CourseID", "CourseTitle", "CreditHours", "Semester", "DeptID"],
    formFields: [
      { name: "CourseID", required: true },
      { name: "CourseTitle", required: true },
      { name: "CreditHours", type: "number", required: true },
      { name: "Semester", options: ["Fall", "Spring", "Summer"] },
      { name: "DeptID", required: true },
    ],
  },
  proctors: {
    title: "Proctors",
    subtitle: "Human and AI proctor records.",
    endpoint: "proctors",
    idKey: "PROCTORID",
    fields: ["ProctorID", "Name", "Email", "Role"],
    formFields: [
      { name: "ProctorID", required: true },
      { name: "Name", required: true },
      { name: "Email", type: "email" },
      { name: "Role", options: ["Faculty", "TA", "External"] },
    ],
  },
  attempts: {
    title: "Attempts",
    subtitle: "Weak entity records for student exam attempts.",
    endpoint: "attempts",
    composite: true,
    keyFields: ["AttemptNo", "StudentID", "ExamID"],
    fields: ["AttemptNo", "StudentID", "ExamID", "AttemptDate", "Status"],
    formFields: [
      { name: "AttemptNo", type: "number", required: true },
      { name: "StudentID", required: true },
      { name: "ExamID", required: true },
      { name: "Status", options: ["Completed", "Incomplete", "Cancelled"] },
    ],
  },
  results: {
    title: "Results",
    subtitle: "Result sheets generated from attempts.",
    endpoint: "results",
    composite: true,
    keyFields: ["ResultID", "AttemptNo", "StudentID"],
    fields: ["ResultID", "AttemptNo", "StudentID", "ExamID", "MarksObtained", "Grade", "Status", "PublishedDate"],
    formFields: [
      { name: "ResultID", required: true },
      { name: "AttemptNo", type: "number", required: true },
      { name: "StudentID", required: true },
      { name: "ExamID", required: true },
      { name: "MarksObtained", type: "number" },
      { name: "Grade" },
      { name: "Status", options: ["Pass", "Fail"] },
      { name: "PublishedDate", type: "date" },
    ],
  },
  violations: {
    title: "Violations",
    subtitle: "Proctoring violations logged by session.",
    endpoint: "violations",
    composite: true,
    readOnlyUpdate: true,
    keyFields: ["ViolationID", "SessionID"],
    fields: ["ViolationID", "SessionID", "ViolationTimestamp", "Severity", "Description", "EvidenceURL", "CategoryID"],
    formFields: [
      { name: "ViolationID", required: true },
      { name: "SessionID", required: true },
      { name: "Severity", options: ["Low", "Medium", "High"] },
      { name: "Description", type: "textarea", full: true },
      { name: "EvidenceURL" },
      { name: "CategoryID" },
    ],
  },
};

let currentView = "dashboard";
let currentModule = null;
let currentData = [];
let filterData = [];
let pendingDelete = null;

const navMenu = document.getElementById("navMenu");
const pageTitle = document.getElementById("pageTitle");
const pageSubtitle = document.getElementById("pageSubtitle");
const dashboardView = document.getElementById("dashboardView");
const moduleView = document.getElementById("moduleView");
const refreshBtn = document.getElementById("refreshBtn");

const formModal = document.getElementById("formModal");
const modalTitle = document.getElementById("modalTitle");
const entityForm = document.getElementById("entityForm");
const closeModalBtn = document.getElementById("closeModalBtn");

const confirmModal = document.getElementById("confirmModal");
const confirmText = document.getElementById("confirmText");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

const toastWrap = document.getElementById("toastWrap");

navMenu.addEventListener("click", (event) => {
  const button = event.target.closest(".nav-item");
  if (!button) return;

  document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");

  const view = button.dataset.view;
  if (view === "dashboard") {
    showDashboard();
  } else {
    showModule(view);
  }
});

refreshBtn.addEventListener("click", () => {
  if (currentView === "dashboard") {
    showDashboard();
  } else if (currentModule) {
    showModule(currentModule);
  }
});

closeModalBtn.addEventListener("click", () => toggleModal(false));
cancelDeleteBtn.addEventListener("click", () => toggleConfirm(false));
confirmDeleteBtn.addEventListener("click", handleDeleteConfirmed);

async function apiCall(endpoint, method = "GET", body = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}/${endpoint}`, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || "Request failed");
  }

  return data;
}

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastWrap.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2800);
}

function normalizeValue(value) {
  if (value === null || value === undefined) return "";
  return String(value);
}

function renderDashboard(stats) {
  dashboardView.innerHTML = `
    <div class="cards-grid">
      <article class="stat-card"><h4>Total Students</h4><p class="value">${stats.students}</p></article>
      <article class="stat-card"><h4>Total Exams</h4><p class="value">${stats.exams}</p></article>
      <article class="stat-card"><h4>Total Violations</h4><p class="value">${stats.violations}</p></article>
      <article class="stat-card"><h4>Total Courses</h4><p class="value">${stats.courses}</p></article>
      <article class="stat-card"><h4>Total Proctors</h4><p class="value">${stats.proctors}</p></article>
      <article class="stat-card"><h4>Total Results</h4><p class="value">${stats.results}</p></article>
    </div>
  `;
}

async function showDashboard() {
  currentView = "dashboard";
  currentModule = null;

  pageTitle.textContent = "Dashboard";
  pageSubtitle.textContent = "Overview of key metrics and recent activity";

  dashboardView.classList.add("active");
  moduleView.classList.remove("active");

  try {
    const [students, exams, violations, courses, proctors, results] = await Promise.all([
      apiCall("students"),
      apiCall("exams"),
      apiCall("violations"),
      apiCall("courses"),
      apiCall("proctors"),
      apiCall("results"),
    ]);

    renderDashboard({
      students: students.length,
      exams: exams.length,
      violations: violations.length,
      courses: courses.length,
      proctors: proctors.length,
      results: results.length,
    });
  } catch (error) {
    renderDashboard({ students: 0, exams: 0, violations: 0, courses: 0, proctors: 0, results: 0 });
    showToast(error.message, "error");
  }
}

function getFieldValue(row, name) {
  return row[name.toUpperCase()] ?? row[name] ?? "";
}

function buildModuleLayout(config) {
  moduleView.innerHTML = `
    <div class="module-toolbar">
      <input id="searchInput" type="text" placeholder="Search in ${config.title}..." />
      <select id="filterField"></select>
      <select id="filterValue"><option value="">All values</option></select>
      <button class="primary-btn" id="addBtn"><i class="bi bi-plus-lg"></i> Add ${config.title.slice(0, -1)}</button>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            ${config.fields.map((field) => `<th>${field}</th>`).join("")}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="tableBody"></tbody>
      </table>
    </div>
  `;

  const filterField = document.getElementById("filterField");
  filterField.innerHTML = `<option value="">All fields</option>${config.fields
    .map((field) => `<option value="${field}">${field}</option>`)
    .join("")}`;
}

function refreshFilterValues(config, data) {
  const filterField = document.getElementById("filterField");
  const filterValue = document.getElementById("filterValue");
  const chosen = filterField.value;

  filterValue.innerHTML = `<option value="">All values</option>`;
  if (!chosen) return;

  const values = [...new Set(data.map((row) => normalizeValue(getFieldValue(row, chosen))).filter(Boolean))];
  values.sort();
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    filterValue.appendChild(option);
  });
}

function drawRows(config, rows) {
  const body = document.getElementById("tableBody");
  if (!rows.length) {
    body.innerHTML = `<tr><td colspan="${config.fields.length + 1}">No records found.</td></tr>`;
    return;
  }

  body.innerHTML = rows
    .map((row, index) => {
      const keyPayload = config.composite
        ? config.keyFields.reduce((acc, key) => {
            acc[key] = getFieldValue(row, key);
            return acc;
          }, {})
        : { [config.idKey]: getFieldValue(row, config.idKey) };

      return `
        <tr>
          ${config.fields
            .map((field) => `<td>${normalizeValue(getFieldValue(row, field))}</td>`)
            .join("")}
          <td>
            <div class="actions">
              ${config.readOnlyUpdate ? "" : `<button class="ghost-btn" data-action="edit" data-index="${index}">Edit</button>`}
              <button class="danger-btn" data-action="delete" data-key='${JSON.stringify(keyPayload)}'>Delete</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

function applySearchAndFilter(config) {
  const searchText = document.getElementById("searchInput").value.trim().toLowerCase();
  const filterField = document.getElementById("filterField").value;
  const filterValue = document.getElementById("filterValue").value;

  filterData = currentData.filter((row) => {
    const values = config.fields.map((field) => normalizeValue(getFieldValue(row, field)).toLowerCase());
    const searchMatch = !searchText || values.some((value) => value.includes(searchText));

    let filterMatch = true;
    if (filterField && filterValue) {
      filterMatch = normalizeValue(getFieldValue(row, filterField)) === filterValue;
    }

    return searchMatch && filterMatch;
  });

  drawRows(config, filterData);
}

async function showModule(moduleKey) {
  currentView = "module";
  currentModule = moduleKey;

  const config = modules[moduleKey];
  pageTitle.textContent = config.title;
  pageSubtitle.textContent = config.subtitle;

  dashboardView.classList.remove("active");
  moduleView.classList.add("active");

  buildModuleLayout(config);

  try {
    currentData = await apiCall(config.endpoint);
    filterData = [...currentData];
    refreshFilterValues(config, currentData);
    drawRows(config, currentData);
  } catch (error) {
    showToast(error.message, "error");
    currentData = [];
    drawRows(config, []);
  }

  document.getElementById("searchInput").addEventListener("input", () => applySearchAndFilter(config));
  document.getElementById("filterField").addEventListener("change", () => {
    refreshFilterValues(config, currentData);
    applySearchAndFilter(config);
  });
  document.getElementById("filterValue").addEventListener("change", () => applySearchAndFilter(config));

  document.getElementById("addBtn").addEventListener("click", () => openForm(config));

  document.getElementById("tableBody").addEventListener("click", (event) => {
    const target = event.target;
    if (target.dataset.action === "edit") {
      const row = filterData[Number(target.dataset.index)];
      openForm(config, row);
    }

    if (target.dataset.action === "delete") {
      const payload = JSON.parse(target.dataset.key);
      askDelete(config, payload);
    }
  });
}

function fieldInput(field, value = "") {
  if (field.options) {
    return `
      <select name="${field.name}" ${field.required ? "required" : ""}>
        <option value="">Select ${field.name}</option>
        ${field.options
          .map((option) => `<option value="${option}" ${String(value) === option ? "selected" : ""}>${option}</option>`)
          .join("")}
      </select>
    `;
  }

  if (field.type === "textarea") {
    return `<textarea name="${field.name}" rows="3">${normalizeValue(value)}</textarea>`;
  }

  const inputType = field.type || "text";
  const formattedDate = inputType === "date" && value ? normalizeValue(value).slice(0, 10) : normalizeValue(value);
  return `<input type="${inputType}" name="${field.name}" value="${formattedDate}" ${field.required ? "required" : ""} />`;
}

function openForm(config, record = null) {
  const isEdit = Boolean(record);
  modalTitle.textContent = `${isEdit ? "Edit" : "Add"} ${config.title.slice(0, -1)}`;

  entityForm.innerHTML = `
    ${config.formFields
      .map((field) => {
        const currentValue = record ? getFieldValue(record, field.name) : "";
        const disableOnEdit = isEdit && ((config.composite && config.keyFields.includes(field.name)) || (!config.composite && field.name.toUpperCase() === config.idKey));

        return `
          <div class="form-group ${field.full ? "full" : ""}">
            <label>${field.name}</label>
            ${fieldInput(field, currentValue).replace(
              ">",
              disableOnEdit ? " disabled>" : ">"
            )}
          </div>
        `;
      })
      .join("")}
    <div class="form-actions">
      <button type="button" class="ghost-btn" id="cancelFormBtn">Cancel</button>
      <button type="submit" class="primary-btn">${isEdit ? "Update" : "Create"}</button>
    </div>
  `;

  document.getElementById("cancelFormBtn").addEventListener("click", () => toggleModal(false));

  entityForm.onsubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(entityForm);
    const payload = Object.fromEntries(formData.entries());

    for (const key of Object.keys(payload)) {
      if (payload[key] === "") {
        payload[key] = null;
      }
    }

    try {
      if (isEdit) {
        if (config.composite) {
          for (const keyField of config.keyFields) {
            payload[keyField] = getFieldValue(record, keyField);
          }
          await apiCall(config.endpoint, "PUT", payload);
        } else {
          const idValue = getFieldValue(record, config.idKey);
          await apiCall(`${config.endpoint}/${idValue}`, "PUT", payload);
        }
        showToast(`${config.title.slice(0, -1)} updated`);
      } else {
        await apiCall(config.endpoint, "POST", payload);
        showToast(`${config.title.slice(0, -1)} created`);
      }

      toggleModal(false);
      await showModule(currentModule);
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  toggleModal(true);
}

function askDelete(config, keyPayload) {
  pendingDelete = { config, keyPayload };
  confirmText.textContent = `Delete selected ${config.title.slice(0, -1).toLowerCase()} record?`;
  toggleConfirm(true);
}

async function handleDeleteConfirmed() {
  if (!pendingDelete) return;

  const { config, keyPayload } = pendingDelete;
  try {
    if (config.composite) {
      await apiCall(config.endpoint, "DELETE", keyPayload);
    } else {
      const idValue = keyPayload[config.idKey];
      await apiCall(`${config.endpoint}/${idValue}`, "DELETE");
    }

    showToast(`${config.title.slice(0, -1)} deleted`);
    toggleConfirm(false);
    await showModule(currentModule);
  } catch (error) {
    showToast(error.message, "error");
  }
}

function toggleModal(show) {
  formModal.classList.toggle("hidden", !show);
}

function toggleConfirm(show) {
  confirmModal.classList.toggle("hidden", !show);
  if (!show) pendingDelete = null;
}

showDashboard();
