const jobForm =
    document.getElementById("jobForm");

const companyInput =
    document.getElementById("company");

const roleInput =
    document.getElementById("role");

const dateInput =
    document.getElementById("date");

const interviewDateInput =
    document.getElementById("interviewDate");

const salaryInput =
    document.getElementById("salary");

const locationInput =
    document.getElementById("location");

const statusInput =
    document.getElementById("status");

const jobLinkInput =
    document.getElementById("jobLink");

const notesInput =
    document.getElementById("notes");

const applicationsList =
    document.getElementById("applicationsList");

const emptyMessage =
    document.getElementById("emptyMessage");

const searchInput =
    document.getElementById("searchInput");

const filterStatus =
    document.getElementById("filterStatus");

const totalApplications =
    document.getElementById("totalApplications");

const appliedCount =
    document.getElementById("appliedCount");

const interviewCount =
    document.getElementById("interviewCount");

const selectedCount =
    document.getElementById("selectedCount");

const rejectedCount =
    document.getElementById("rejectedCount");

const submitBtn =
    document.getElementById("submitBtn");

const cancelBtn =
    document.getElementById("cancelBtn");

const formTitle =
    document.getElementById("formTitle");

const themeToggle =
    document.getElementById("themeToggle");


/* ==========================
   APPLICATION DATA
========================== */

let applications =
    JSON.parse(
        localStorage.getItem(
            "jobApplications"
        )
    ) || [];


let editingId = null;


/* ==========================
   ADD / UPDATE
========================== */

jobForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const applicationData = {

            company:
                companyInput.value.trim(),

            role:
                roleInput.value.trim(),

            date:
                dateInput.value,

            interviewDate:
                interviewDateInput.value,

            salary:
                salaryInput.value.trim(),

            location:
                locationInput.value.trim(),

            status:
                statusInput.value,

            link:
                jobLinkInput.value.trim(),

            notes:
                notesInput.value.trim()

        };


        if (editingId !== null) {

            applications =
                applications.map(
                    application => {

                        if (
                            application.id ===
                            editingId
                        ) {

                            return {

                                ...application,

                                ...applicationData

                            };

                        }


                        return application;

                    }
                );


            alert(
                "Application updated successfully!"
            );

        } else {

            const newApplication = {

                id: Date.now(),

                ...applicationData

            };


            applications.push(
                newApplication
            );


            alert(
                "Application added successfully!"
            );

        }


        saveApplications();

        renderApplications();

        resetForm();

    }
);


/* ==========================
   SAVE DATA
========================== */

function saveApplications() {

    localStorage.setItem(
        "jobApplications",
        JSON.stringify(
            applications
        )
    );

}


/* ==========================
   RENDER
========================== */

function renderApplications() {

    const searchText =
        searchInput.value
            .trim()
            .toLowerCase();


    const selectedFilter =
        filterStatus.value;


    const filteredApplications =
        applications.filter(
            application => {

                const matchesSearch =

                    application.company
                        .toLowerCase()
                        .includes(
                            searchText
                        )

                    ||

                    application.role
                        .toLowerCase()
                        .includes(
                            searchText
                        )

                    ||

                    application.location
                        .toLowerCase()
                        .includes(
                            searchText
                        );


                const matchesStatus =

                    selectedFilter ===
                    "All"

                    ||

                    application.status ===
                    selectedFilter;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    applicationsList.innerHTML = "";


    if (
        filteredApplications.length ===
        0
    ) {

        emptyMessage.style.display =
            "block";

    } else {

        emptyMessage.style.display =
            "none";


        filteredApplications.forEach(
            application => {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "application-card";


                card.innerHTML = `

                    <div class="card-top">

                        <div>

                            <h3 class="company-name">
                                ${escapeHTML(
                                    application.company
                                )}
                            </h3>

                            <p class="role">
                                ${escapeHTML(
                                    application.role
                                )}
                            </p>

                            <span class="status status-${application.status}">
                                ${application.status}
                            </span>

                            <div class="details">

                                <span>
                                    📅 Applied:
                                    ${formatDate(
                                        application.date
                                    )}
                                </span>

                                ${
                                    application.interviewDate
                                    ? `
                                        <span>
                                            🎯 Interview:
                                            ${formatDate(
                                                application.interviewDate
                                            )}
                                        </span>
                                    `
                                    : ""
                                }

                                ${
                                    application.salary
                                    ? `
                                        <span>
                                            💰 ${escapeHTML(
                                                application.salary
                                            )}
                                        </span>
                                    `
                                    : ""
                                }

                                ${
                                    application.location
                                    ? `
                                        <span>
                                            📍 ${escapeHTML(
                                                application.location
                                            )}
                                        </span>
                                    `
                                    : ""
                                }

                            </div>

                            ${
                                application.notes
                                ? `
                                    <div class="notes">
                                        📝 ${escapeHTML(
                                            application.notes
                                        )}
                                    </div>
                                `
                                : ""
                            }

                        </div>


                        <div class="card-actions">

                            ${
                                application.link
                                ? `
                                    <button
                                        class="view-btn"
                                        onclick="openJobLink('${encodeURIComponent(
                                            application.link
                                        )}')"
                                    >
                                        View
                                    </button>
                                `
                                : ""
                            }


                            <button
                                class="edit-btn"
                                onclick="editApplication(
                                    ${application.id}
                                )"
                            >
                                Edit
                            </button>


                            <button
                                class="delete-btn"
                                onclick="deleteApplication(
                                    ${application.id}
                                )"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                `;


                applicationsList.appendChild(
                    card
                );

            }
        );

    }


    updateDashboard();

}


/* ==========================
   EDIT
========================== */

function editApplication(id) {

    const application =
        applications.find(
            item => item.id === id
        );


    if (!application) {

        return;

    }


    editingId = id;


    companyInput.value =
        application.company;

    roleInput.value =
        application.role;

    dateInput.value =
        application.date;

    interviewDateInput.value =
        application.interviewDate || "";

    salaryInput.value =
        application.salary || "";

    locationInput.value =
        application.location || "";

    statusInput.value =
        application.status;

    jobLinkInput.value =
        application.link || "";

    notesInput.value =
        application.notes || "";


    formTitle.textContent =
        "Edit Job Application";

    submitBtn.textContent =
        "Update Application";

    cancelBtn.style.display =
        "inline-block";


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* ==========================
   CANCEL EDIT
========================== */

cancelBtn.addEventListener(
    "click",
    resetForm
);


function resetForm() {

    jobForm.reset();

    editingId = null;

    formTitle.textContent =
        "Add Job Application";

    submitBtn.textContent =
        "+ Add Application";

    cancelBtn.style.display =
        "none";

}


/* ==========================
   DELETE
========================== */

function deleteApplication(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this application?"
        );


    if (!confirmed) {

        return;

    }


    applications =
        applications.filter(
            application =>
                application.id !== id
        );


    saveApplications();

    renderApplications();

}


/* ==========================
   OPEN JOB LINK
========================== */

function openJobLink(
    encodedLink
) {

    const link =
        decodeURIComponent(
            encodedLink
        );


    window.open(
        link,
        "_blank",
        "noopener,noreferrer"
    );

}


/* ==========================
   DATE FORMAT
========================== */

function formatDate(date) {

    if (!date) {

        return "Not specified";

    }


    const formattedDate =
        new Date(date);


    return formattedDate.toLocaleDateString(
        "en-IN",
        {

            day: "2-digit",

            month: "short",

            year: "numeric"

        }
    );

}


/* ==========================
   DASHBOARD
========================== */

function updateDashboard() {

    totalApplications.textContent =
        applications.length;


    appliedCount.textContent =
        applications.filter(
            application =>
                application.status ===
                "Applied"
        ).length;


    interviewCount.textContent =
        applications.filter(
            application =>
                application.status ===
                "Interview"
        ).length;


    selectedCount.textContent =
        applications.filter(
            application =>
                application.status ===
                "Selected"
        ).length;


    rejectedCount.textContent =
        applications.filter(
            application =>
                application.status ===
                "Rejected"
        ).length;

}


/* ==========================
   SEARCH
========================== */

searchInput.addEventListener(
    "input",
    renderApplications
);


/* ==========================
   FILTER
========================== */

filterStatus.addEventListener(
    "change",
    renderApplications
);


/* ==========================
   HTML SECURITY
========================== */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent = text;


    return div.innerHTML;

}


/* ==========================
   DARK / LIGHT MODE
========================== */

const savedTheme =
    localStorage.getItem(
        "jobTrackTheme"
    );


if (savedTheme === "light") {

    document.body.classList.add(
        "light-mode"
    );

    themeToggle.textContent =
        "🌙 Dark Mode";

} else {

    themeToggle.textContent =
        "☀️ Light Mode";

}


themeToggle.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "light-mode"
        );


        const isLight =
            document.body.classList.contains(
                "light-mode"
            );


        if (isLight) {

            themeToggle.textContent =
                "🌙 Dark Mode";


            localStorage.setItem(
                "jobTrackTheme",
                "light"
            );

        } else {

            themeToggle.textContent =
                "☀️ Light Mode";


            localStorage.setItem(
                "jobTrackTheme",
                "dark"
            );

        }

    }
);


/* ==========================
   INITIAL LOAD
========================== */

renderApplications();