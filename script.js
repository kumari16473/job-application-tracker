const jobForm = document.getElementById("jobForm");

const companyInput = document.getElementById("company");
const roleInput = document.getElementById("role");
const dateInput = document.getElementById("date");
const jobLinkInput = document.getElementById("jobLink");
const statusInput = document.getElementById("status");

const applicationsList = document.getElementById("applicationsList");
const emptyMessage = document.getElementById("emptyMessage");

const searchInput = document.getElementById("searchInput");
const filterStatus = document.getElementById("filterStatus");

const totalApplications = document.getElementById("totalApplications");
const appliedCount = document.getElementById("appliedCount");
const interviewCount = document.getElementById("interviewCount");
const selectedCount = document.getElementById("selectedCount");
const rejectedCount = document.getElementById("rejectedCount");

let applications = JSON.parse(localStorage.getItem("jobApplications")) || [];

// Add Application
jobForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const application = {
        id: Date.now(),
        company: companyInput.value.trim(),
        role: roleInput.value.trim(),
        date: dateInput.value,
        link: jobLinkInput.value.trim(),
        status: statusInput.value
    };

    applications.push(application);

    saveApplications();
    renderApplications();

    jobForm.reset();

});

// Save to Local Storage
function saveApplications() {

    localStorage.setItem(
        "jobApplications",
        JSON.stringify(applications)
    );

}

// Render Applications
function renderApplications() {

    const searchText = searchInput.value.toLowerCase();
    const selectedFilter = filterStatus.value;

    const filteredApplications = applications.filter(application => {

        const matchesSearch =
            application.company.toLowerCase().includes(searchText) ||
            application.role.toLowerCase().includes(searchText);

        const matchesStatus =
            selectedFilter === "All" ||
            application.status === selectedFilter;

        return matchesSearch && matchesStatus;

    });

    applicationsList.innerHTML = "";

    if (filteredApplications.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";

        filteredApplications.forEach(application => {

            const card = document.createElement("div");

            card.className = "application-card";

            card.innerHTML = `

                <div>

                    <h3>${escapeHTML(application.company)}</h3>

                    <p class="role">
                        ${escapeHTML(application.role)}
                    </p>

                    <span class="status status-${application.status}">
                        ${application.status}
                    </span>

                    <div class="details">

                        <span>
                            📅 ${formatDate(application.date)}
                        </span>

                        ${
                            application.link
                            ? `<span>🔗 Job Link Available</span>`
                            : ""
                        }

                    </div>

                </div>

                <div class="actions">

                    ${
                        application.link
                        ? `
                            <button
                                class="view-btn"
                                onclick="openJobLink('${application.link}')"
                            >
                                View
                            </button>
                        `
                        : ""
                    }

                    <button
                        class="delete-btn"
                        onclick="deleteApplication(${application.id})"
                    >
                        Delete
                    </button>

                </div>

            `;

            applicationsList.appendChild(card);

        });

    }

    updateDashboard();

}

// Delete Application
function deleteApplication(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this application?"
    );

    if (!confirmed) {
        return;
    }

    applications = applications.filter(
        application => application.id !== id
    );

    saveApplications();
    renderApplications();

}

// Open Job Link
function openJobLink(link) {

    window.open(link, "_blank");

}

// Format Date
function formatDate(date) {

    if (!date) {
        return "Not specified";
    }

    const formattedDate = new Date(date);

    return formattedDate.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}

// Dashboard Statistics
function updateDashboard() {

    totalApplications.textContent = applications.length;

    appliedCount.textContent =
        applications.filter(
            application => application.status === "Applied"
        ).length;

    interviewCount.textContent =
        applications.filter(
            application => application.status === "Interview"
        ).length;

    selectedCount.textContent =
        applications.filter(
            application => application.status === "Selected"
        ).length;

    rejectedCount.textContent =
        applications.filter(
            application => application.status === "Rejected"
        ).length;

}

// Search
searchInput.addEventListener(
    "input",
    renderApplications
);

// Filter
filterStatus.addEventListener(
    "change",
    renderApplications
);

// Basic HTML Security
function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}

// Initial Load
renderApplications();