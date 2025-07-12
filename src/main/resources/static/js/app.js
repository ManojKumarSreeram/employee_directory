document.addEventListener("DOMContentLoaded", () => {
  let currentPage = 1;
  let itemsPerPageGlobal = 10;
  let filteredEmployees = [...mockEmployees];

  function renderEmployees() {
    const start = (currentPage - 1) * itemsPerPageGlobal;
    const paginatedEmployees = filteredEmployees.slice(start, start + itemsPerPageGlobal);

    const container = document.getElementById("employeeList");
    container.innerHTML = '';

    paginatedEmployees.forEach(emp => {
      const div = document.createElement("div");
      div.className = "employee-card";
      div.innerHTML = `
        <h3>${emp.firstName} ${emp.lastName}</h3>
        <p><strong>Email:</strong> ${emp.email}</p>
        <p><strong>Department:</strong> ${emp.department}</p>
        <p><strong>Role:</strong> ${emp.role}</p>
        <div class="buttons">
          <button onclick="editEmployee(${emp.id})">Edit</button>
          <button onclick="deleteEmployee(${emp.id})">Delete</button>
        </div>
      `;
      container.appendChild(div);
    });

    const pageText = filteredEmployees.length
      ? `Page ${currentPage} of ${Math.ceil(filteredEmployees.length / itemsPerPageGlobal)}`
      : "";
    document.getElementById("pageIndicator").innerText = pageText;
  }

 window.showForm = function () {
  document.getElementById("employeeFormContainer").style.display = "flex";
  document.getElementById("formTitle").innerText = "Add Employee";
  document.getElementById("employeeForm").reset();
  document.getElementById("employeeId").value = "";
};



  window.editEmployee = function(id) {
    const emp = mockEmployees.find(e => e.id === id);
    if (emp) {
      showForm();
      document.getElementById("formTitle").innerText = "Edit Employee";
      document.getElementById("employeeId").value = emp.id;
      document.getElementById("firstName").value = emp.firstName;
      document.getElementById("lastName").value = emp.lastName;
      document.getElementById("email").value = emp.email;
      document.getElementById("department").value = emp.department;
      document.getElementById("role").value = emp.role;
    }
  };

  window.deleteEmployee = function(id) {
    const index = mockEmployees.findIndex(e => e.id === id);
    if (index !== -1) {
      mockEmployees.splice(index, 1);
      applyFilters();
    }
  };

  function hideForm() {
    document.getElementById("employeeFormContainer").style.display = "none";
  }

  window.hideForm = hideForm;

  document.getElementById("employeeForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const id = document.getElementById("employeeId").value;
    const newEmp = {
      id: id ? parseInt(id) : Date.now(),
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      email: document.getElementById("email").value,
      department: document.getElementById("department").value,
      role: document.getElementById("role").value,
    };
    if (id) {
      const idx = mockEmployees.findIndex(e => e.id == id);
      mockEmployees[idx] = newEmp;
    } else {
      mockEmployees.push(newEmp);
    }
    hideForm();
    applyFilters();
  });

  function applyFilters() {
    const value = document.getElementById("searchInput").value.toLowerCase();
    filteredEmployees = mockEmployees.filter(emp =>
      emp.firstName.toLowerCase().includes(value) ||
      emp.lastName.toLowerCase().includes(value) ||
      emp.email.toLowerCase().includes(value)
    );
    currentPage = 1;
    renderEmployees();
  }

  function applyFilterForm() {
    const firstName = document.getElementById("filterFirstName").value.trim().toLowerCase();
    const department = document.getElementById("filterDepartment").value.trim().toLowerCase();
    const role = document.getElementById("filterRole").value.trim().toLowerCase();

    if (!firstName && !department && !role) {
      alert("Please enter at least one filter value.");
      return;
    }

    filteredEmployees = mockEmployees.filter(e =>
      (!firstName || e.firstName.toLowerCase().includes(firstName)) &&
      (!department || e.department.toLowerCase().includes(department)) &&
      (!role || e.role.toLowerCase().includes(role))
    );

    document.getElementById("filterForm").classList.add("hidden");

    if (filteredEmployees.length === 0) {
      document.getElementById("employeeList").innerHTML = "<p style='padding:20px'>User not found.</p>";
      document.getElementById("pageIndicator").innerText = "";
    } else {
      currentPage = 1;
      renderEmployees();
    }
  }

  window.applyFilterForm = applyFilterForm;

  function resetFilterForm() {
    document.getElementById("filterFirstName").value = "";
    document.getElementById("filterDepartment").value = "";
    document.getElementById("filterRole").value = "";
    filteredEmployees = [...mockEmployees];
    currentPage = 1;
    renderEmployees();
  }

  window.resetFilterForm = resetFilterForm;

  // Pagination
  document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderEmployees();
    }
  });

  document.getElementById("nextPage").addEventListener("click", () => {
    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPageGlobal);
    if (currentPage < totalPages) {
      currentPage++;
      renderEmployees();
    }
  });

  document.getElementById("searchInput").addEventListener("input", applyFilters);

  document.getElementById("sortSelect").addEventListener("change", () => {
    const sortKey = document.getElementById("sortSelect").value;
    if (sortKey) {
      filteredEmployees.sort((a, b) => a[sortKey].localeCompare(b[sortKey]));
      currentPage = 1;
      renderEmployees();
    }
  });

  document.getElementById("itemsPerPage").addEventListener("change", () => {
    const value = parseInt(document.getElementById("itemsPerPage").value);
    itemsPerPageGlobal = value;
    currentPage = 1;
    renderEmployees();
  });

  document.getElementById("filterToggle").addEventListener("click", () => {
    const form = document.getElementById("filterForm");
    form.classList.toggle("hidden");
  });

  applyFilters(); // initial load
});
