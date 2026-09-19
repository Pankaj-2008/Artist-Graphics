// ==========================================
// ADMIN AUTHENTICATION
// ==========================================

const adminToken = localStorage.getItem("adminToken");

if (!adminToken) {
    window.location.href = "index.html";
}


// ==========================================
// ORDERS
// ==========================================

let allOrders = [];

const table = document.getElementById("ordersTable");

fetch("http://localhost:5000/api/orders", {
    method: "GET",
    headers: {
        "Authorization": `Bearer ${adminToken}`
    }
})
    .then(res => res.json())
    .then(orders => {

        allOrders = orders;

        let pending = 0;
        let completed = 0;

        orders.forEach(order => {

            if (order.status === "Completed") {
                completed++;
            } else {
                pending++;
            }

        });


        // Dashboard statistics

        document.getElementById("totalOrders").textContent =
            orders.length;

        document.getElementById("pendingOrders").textContent =
            pending;

        document.getElementById("completedOrders").textContent =
            completed;


        // Clear table

        table.innerHTML = "";


        // Display orders

        orders.forEach(order => {

            table.innerHTML += `

                <tr>

                    <td>
                        ${order.name}
                    </td>

                    <td>
                        ${order.phone}
                    </td>

                    <td>
                        ${order.service}
                    </td>

                    <td>
                        ${order.details}
                    </td>

                    <td>
                        ${new Date(order.date).toLocaleString()}
                    </td>

                    <td>
                        ${order.status || "Pending"}
                    </td>

                    <td>

                        <button
                            class="complete-btn"
                            onclick="completeOrder('${order._id}')"
                        >
                            Complete
                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteOrder('${order._id}')"
                        >
                            Delete
                        </button>

                    </td>

                </tr>

            `;

        });

    })
    .catch(err => {

        console.log("Orders Error:", err);

    });


// ==========================================
// COMPLETE ORDER
// ==========================================

function completeOrder(id) {

    fetch(`http://localhost:5000/api/orders/${id}`, {

        method: "PUT",

        headers: {
            "Authorization": `Bearer ${adminToken}`
        }

    })

    .then(res => res.json())

    .then(data => {

        alert("Order Completed");

        location.reload();

    })

    .catch(err => {

        console.log("Complete Order Error:", err);

    });

}


// ==========================================
// DELETE ORDER
// ==========================================

function deleteOrder(id) {

    if (!confirm("Delete this order?")) {
        return;
    }


    fetch(`http://localhost:5000/api/orders/${id}`, {

        method: "DELETE",

        headers: {
            "Authorization": `Bearer ${adminToken}`
        }

    })

    .then(res => res.json())

    .then(data => {

        alert("Order Deleted");

        location.reload();

    })

    .catch(err => {

        console.log("Delete Order Error:", err);

    });

}


// ==========================================
// LOGOUT
// ==========================================

function logout() {

    localStorage.removeItem("adminToken");

    window.location.href = "index.html";

}


// ==========================================
// ADD PORTFOLIO PROJECT
// ==========================================

function addProject() {

    const title =
        document.getElementById("projectTitle").value.trim();


    const description =
        document
            .getElementById("projectDescription")
            .value
            .trim();


    const image =
        document
            .getElementById("projectImage")
            .value
            .trim();


    if (!title || !description || !image) {

        alert("Please fill all project details.");

        return;

    }


    fetch("http://localhost:5000/api/portfolio", {

        method: "POST",

        headers: {

            "Content-Type": "application/json",

            "Authorization": `Bearer ${adminToken}`

        },

        body: JSON.stringify({

            title: title,

            description: description,

            image: image

        })

    })

    .then(res => res.json())

    .then(data => {

        alert("Project Added Successfully");


        document.getElementById("projectTitle").value = "";

        document.getElementById("projectDescription").value = "";

        document.getElementById("projectImage").value = "";


        location.reload();

    })

    .catch(err => {

        console.log("Add Project Error:", err);

        alert("Error Adding Project");

    });

}


// ==========================================
// LOAD PORTFOLIO PROJECTS
// ==========================================

const portfolioList =
    document.getElementById("portfolioList");


if (portfolioList) {

    fetch("http://localhost:5000/api/portfolio")

        .then(res => res.json())

        .then(projects => {

            portfolioList.innerHTML = "";


            projects.forEach(project => {

                portfolioList.innerHTML += `

                    <div class="portfolio-admin-item">

                        <h3>
                            ${project.title}
                        </h3>

                        <p>
                            ${project.description}
                        </p>

                        <button
                            onclick="deleteProject('${project._id}')"
                        >
                            Delete Project
                        </button>

                    </div>

                    <hr>

                `;

            });

        })

        .catch(err => {

            console.log("Portfolio Load Error:", err);

        });

}


// ==========================================
// DELETE PORTFOLIO PROJECT
// ==========================================

function deleteProject(id) {

    if (!confirm("Delete this project?")) {
        return;
    }


    fetch(`http://localhost:5000/api/portfolio/${id}`, {

        method: "DELETE",

        headers: {

            "Authorization": `Bearer ${adminToken}`

        }

    })

    .then(res => res.json())

    .then(data => {

        alert("Project Deleted");

        location.reload();

    })

    .catch(err => {

        console.log("Delete Project Error:", err);

    });

}


// ==========================================
// FILTER ORDERS
// ==========================================

function filterOrders(status) {

    const rows =
        document.querySelectorAll("#ordersTable tr");


    rows.forEach(row => {

        if (status === "All") {

            row.style.display = "";

        } else {

            if (row.innerText.includes(status)) {

                row.style.display = "";

            } else {

                row.style.display = "none";

            }

        }

    });


    // Update active filter button

    const buttons =
        document.querySelectorAll(".filter-btn");


    buttons.forEach(button => {

        button.classList.remove("active-filter");

    });


    buttons.forEach(button => {

        if (button.innerText.trim() === status) {

            button.classList.add("active-filter");

        }

    });

}


// ==========================================
// SEARCH ORDERS
// ==========================================

const searchInput =
    document.getElementById("searchInput");


if (searchInput) {

    searchInput.addEventListener("keyup", function () {

        const value =
            this.value.toLowerCase().trim();


        const rows =
            document.querySelectorAll("#ordersTable tr");


        rows.forEach(row => {

            if (
                row.innerText
                    .toLowerCase()
                    .includes(value)
            ) {

                row.style.display = "";

            } else {

                row.style.display = "none";

            }

        });

    });

}