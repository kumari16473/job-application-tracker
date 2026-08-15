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

const exportBtn =
    document.getElementById("exportBtn");

const successRate =
    document.getElementById("successRate");

const appliedBar =
    document.getElementById("appliedBar");

const interviewBar =
    document.getElementById("interviewBar");

const selectedBar =
    document.getElementById("selectedBar");

const rejectedBar =
    document.getElementById("rejectedBar");

const chartAppliedValue =
    document.getElementById("chartAppliedValue");

const chartInterviewValue =
    document.getElementById("chartInterviewValue");

const chartSelectedValue =
    document.getElementById("chartSelectedValue");

const chartRejectedValue =
    document.getElementById("chartRejectedValue");

const upcomingInterviews =
    document.getElementById("upcomingInterviews");

const interviewReminderCount =
    document.getElementById("interviewReminderCount");


let applications =
    JSON.parse(
        localStorage.getItem(
            "jobApplications"
        )
    ) || [];


let editingId = null;


/* ADD / UPDATE */

jobForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const data = {

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
                    item => {

                        if (
                            item.id === editingId
                        ) {

                            return {
                                ...item,
                                ...data
                            };

                        }

                        return item;

                    }
                );


            alert(
                "Application updated successfully!"
            );


        } else {

            applications.push({

                id: Date.now(),

                ...data

            });


            alert(
                "Application added successfully!"
            );

        }


        saveApplications();

        renderApplications();

        renderUpcomingInterviews();

        resetForm();

    }
);


/* SAVE */

function saveApplications() {

    localStorage.setItem(
        "jobApplications",
        JSON.stringify(applications)
    );

}


/* RENDER */

function renderApplications() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    const filter =
        filterStatus.value;


    const filtered =
        applications.filter(
            item => {

                const searchMatch =

                    item.company
                        .toLowerCase()
                        .includes(search)

                    ||

                    item.role
                        .toLowerCase()
                        .includes(search)

                    ||

                    item.location
                        .toLowerCase()
                        .includes(search);


                const statusMatch =

                    filter === "All"

                    ||

                    item.status === filter;


                return (
                    searchMatch &&
                    statusMatch
                );

            }
        );


    applicationsList.innerHTML = "";


    if (filtered.length === 0) {

        emptyMessage.style.display =
            "block";

    } else {

        emptyMessage.style.display =
            "none";


        filtered.forEach(item => {

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
                                item.company
                            )}

                        </h3>


                        <p class="role">

                            ${escapeHTML(
                                item.role
                            )}

                        </p>


                        <span
                            class="status status-${item.status}"
                        >

                            ${item.status}

                        </span>


                        <div class="details">

                            <span>
                                📅 Applied:
                                ${formatDate(item.date)}
                            </span>


                            ${
                                item.interviewDate
                                ? `
                                    <span>
                                        🎯 Interview:
                                        ${formatDate(
                                            item.interviewDate
                                        )}
                                    </span>
                                `
                                : ""
                            }


                            ${
                                item.salary
                                ? `
                                    <span>
                                        💰
                                        ${escapeHTML(
                                            item.salary
                                        )}
                                    </span>
                                `
                                : ""
                            }


                            ${
                                item.location
                                ? `
                                    <span>
                                        📍
                                        ${escapeHTML(
                                            item.location
                                        )}
                                    </span>
                                `
                                : ""
                            }

                        </div>


                        ${
                            item.notes
                            ? `
                                <div class="notes">

                                    📝
                                    ${escapeHTML(
                                        item.notes
                                    )}

                                </div>
                            `
                            : ""
                        }

                    </div>


                    <div class="card-actions">


                        ${
                            item.link
                            ? `
                                <button
                                    class="view-btn"
                                    onclick="openJobLink(
                                        '${encodeURIComponent(
                                            item.link
                                        )}'
                                    "
                                >

                                    View

                                </button>
                            `
                            : ""
                        }


                        <button
                            class="edit-btn"
                            onclick="editApplication(
                                ${item.id}
                            )"
                        >

                            Edit

                        </button>


                        <button
                            class="delete-btn"
                            onclick="deleteApplication(
                                ${item.id}
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

        });

    }


    updateDashboard();

}


/* DASHBOARD */

function updateDashboard() {

    const total =
        applications.length;


    const applied =
        applications.filter(
            item =>
                item.status === "Applied"
        ).length;


    const interviews =
        applications.filter(
            item =>
                item.status === "Interview"
        ).length;


    const selected =
        applications.filter(
            item =>
                item.status === "Selected"
        ).length;


    const rejected =
        applications.filter(
            item =>
                item.status === "Rejected"
        ).length;


    totalApplications.textContent =
        total;

    appliedCount.textContent =
        applied;

    interviewCount.textContent =
        interviews;

    selectedCount.textContent =
        selected;

    rejectedCount.textContent =
        rejected;


    chartAppliedValue.textContent =
        applied;

    chartInterviewValue.textContent =
        interviews;

    chartSelectedValue.textContent =
        selected;

    chartRejectedValue.textContent =
        rejected;


    const max =
        Math.max(
            applied,
            interviews,
            selected,
            rejected,
            1
        );


    appliedBar.style.height =
        `${(applied / max) * 200}px`;

    interviewBar.style.height =
        `${(interviews / max) * 200}px`;

    selectedBar.style.height =
        `${(selected / max) * 200}px`;

    rejectedBar.style.height =
        `${(rejected / max) * 200}px`;


    const rate =
        total === 0
        ? 0
        : Math.round(
            (selected / total) * 100
        );


    successRate.textContent =
        `${rate}%`;

}


/* EDIT */

function editApplication(id) {

    const item =
        applications.find(
            application =>
                application.id === id
        );


    if (!item) return;


    editingId = id;


    companyInput.value =
        item.company;

    roleInput.value =
        item.role;

    dateInput.value =
        item.date;

    interviewDateInput.value =
        item.interviewDate || "";

    salaryInput.value =
        item.salary || "";

    locationInput.value =
        item.location || "";

    statusInput.value =
        item.status;

    jobLinkInput.value =
        item.link || "";

    notesInput.value =
        item.notes || "";


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


/* RESET */

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


/* DELETE */

function deleteApplication(id) {

    if (
        !confirm(
            "Are you sure you want to delete this application?"
        )
    ) {

        return;

    }


    applications =
        applications.filter(
            item =>
                item.id !== id
        );


    saveApplications();

    renderApplications();

    renderUpcomingInterviews();

}


/* JOB LINK */

function openJobLink(encodedLink) {

    const link =
        decodeURIComponent(
            encodedLink
        );


    window.open(
        link,
        "_blank"
    );

}


/* DATE */

function formatDate(date) {

    if (!date) {

        return "Not specified";

    }


    return new Date(
        date
    ).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* SEARCH */

searchInput.addEventListener(
    "input",
    renderApplications
);


/* FILTER */

filterStatus.addEventListener(
    "change",
    renderApplications
);


/* CSV EXPORT */

exportBtn.addEventListener(
    "click",
    exportToCSV
);


function exportToCSV() {

    if (applications.length === 0) {

        alert(
            "No applications available to export."
        );

        return;

    }


    const headers = [

        "Company",

        "Job Role",

        "Applied Date",

        "Interview Date",

        "Salary",

        "Location",

        "Status",

        "Job Link",

        "Notes"

    ];


    const rows =
        applications.map(
            item => [

                item.company,

                item.role,

                item.date,

                item.interviewDate || "",

                item.salary || "",

                item.location || "",

                item.status,

                item.link || "",

                item.notes || ""

            ]
        );


    const csv = [

        headers,

        ...rows

    ]

        .map(
            row =>
                row
                    .map(
                        value =>
                            `"${String(value)
                                .replace(
                                    /"/g,
                                    '""'
                                )}"`
                    )
                    .join(",")
        )

        .join("\n");


    const blob =
        new Blob(
            [
                "\uFEFF" + csv
            ],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;


    link.download =
        `JobTrack-Applications-${new Date()
            .toISOString()
            .split("T")[0]}.csv`;


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);


    alert(
        "Applications exported successfully!"
    );

}


/* INTERVIEW REMINDER */

function renderUpcomingInterviews() {

    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    const upcoming =
        applications

            .filter(
                item =>
                    item.interviewDate
            )

            .filter(item => {

                const date =
                    new Date(
                        item.interviewDate
                    );


                date.setHours(
                    0,
                    0,
                    0,
                    0
                );


                return date >= today;

            })

            .sort(
                (a, b) =>
                    new Date(
                        a.interviewDate
                    ) -
                    new Date(
                        b.interviewDate
                    )
            );


    interviewReminderCount.textContent =
        `${upcoming.length} Upcoming`;


    upcomingInterviews.innerHTML = "";


    if (upcoming.length === 0) {

        upcomingInterviews.innerHTML = `

            <div class="no-interviews">

                🎉 No upcoming interviews

                <br>

                <small>
                    Add an interview date to see it here.
                </small>

            </div>

        `;

        return;

    }


    upcoming.forEach(item => {

        const interviewDate =
            new Date(
                item.interviewDate
            );


        const difference =
            Math.ceil(
                (
                    interviewDate - today
                ) /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            );


        let dayText;


        if (difference === 0) {

            dayText = "🔥 Today";

        } else if (
            difference === 1
        ) {

            dayText = "⚡ Tomorrow";

        } else {

            dayText =
                `📆 In ${difference} days`;

        }


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "interview-card";


        card.innerHTML = `

            <div>

                <div class="interview-company">

                    🏢
                    ${escapeHTML(
                        item.company
                    )}

                </div>


                <div class="interview-role">

                    ${escapeHTML(
                        item.role
                    )}

                </div>

            </div>


            <div class="interview-date">

                <strong>

                    ${dayText}

                </strong>


                <span>

                    ${formatDate(
                        item.interviewDate
                    )}

                </span>

            </div>

        `;


        upcomingInterviews.appendChild(
            card
        );

    });

}


/* SECURITY */

function escapeHTML(text) {

    const div =
        document.createElement("div");


    div.textContent =
        text;


    return div.innerHTML;

}


/* DARK / LIGHT MODE */

const savedTheme =
    localStorage.getItem(
        "jobTrackTheme"
    );


if (
    savedTheme === "light"
) {

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


        const light =
            document.body.classList.contains(
                "light-mode"
            );


        if (light) {

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


/* INITIAL LOAD */

renderApplications();

renderUpcomingInterviews();