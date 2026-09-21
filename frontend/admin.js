// ==========================================
// ADMIN AUTHENTICATION
// ==========================================

const adminToken =
    localStorage.getItem("adminToken");


if (!adminToken) {

    window.location.href =
        "index.html";

}


// ==========================================
// GLOBAL ORDERS
// ==========================================

let allOrders = [];

const table =
    document.getElementById("ordersTable");


// ==========================================
// LOAD ORDERS
// ==========================================

async function loadOrders() {

    try {

        const response =
            await fetch("/api/orders", {

                method: "GET",

                headers: {
                    "Authorization":
                        `Bearer ${adminToken}`
                }

            });


        if (!response.ok) {

            if (response.status === 401 ||
                response.status === 403) {

                localStorage.removeItem(
                    "adminToken"
                );

                window.location.href =
                    "index.html";

                return;

            }

            throw new Error(
                "Failed to load orders"
            );

        }


        const orders =
            await response.json();


        allOrders = orders;


        updateDashboard(orders);

        renderOrders(orders);


    } catch (error) {

        console.error(
            "Orders Error:",
            error
        );

    }

}


// ==========================================
// DASHBOARD
// ==========================================

function updateDashboard(orders) {

    let pending = 0;
    let completed = 0;


    orders.forEach(order => {

        if (
            order.status ===
            "Completed"
        ) {

            completed++;

        } else {

            pending++;

        }

    });


    document.getElementById(
        "totalOrders"
    ).textContent = orders.length;


    document.getElementById(
        "pendingOrders"
    ).textContent = pending;


    document.getElementById(
        "completedOrders"
    ).textContent = completed;

}


// ==========================================
// RENDER ORDERS
// ==========================================

function renderOrders(orders) {

    table.innerHTML = "";


    if (!orders.length) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="11"
                    style="
                        text-align:center;
                        padding:30px;
                    "
                >
                    No orders found.

                </td>

            </tr>

        `;

        return;

    }


    orders.forEach(order => {


        const paymentMode =
            order.paymentMode ||
            "Not Provided";


        const paymentStatus =
            order.paymentStatus ||
            "Pending";


        const utr =
            order.utr ||
            "—";


        let screenshotHTML =
            "—";


        // ==================================
        // PAYMENT SCREENSHOT
        // ==================================

        if (
            order.paymentScreenshot
        ) {

            screenshotHTML = `

                <button
                    class="view-payment-btn"
                    onclick="viewScreenshot('${escapeAttribute(order.paymentScreenshot)}')"
                >
                    View Screenshot
                </button>

            `;

        }


        // ==================================
        // PAYMENT STATUS
        // ==================================

        let paymentStatusHTML = `

            <span class="payment-status pending">

                ${escapeHTML(paymentStatus)}

            </span>

        `;


        if (
            paymentStatus === "Paid"
        ) {

            paymentStatusHTML = `

                <span class="payment-status paid">

                    ✓ Paid

                </span>

            `;

        }


        if (
            paymentStatus === "Rejected"
        ) {

            paymentStatusHTML = `

                <span class="payment-status rejected">

                    ✕ Rejected

                </span>

            `;

        }


        // ==================================
        // PAYMENT ACTIONS
        // ==================================

        let paymentActions = "";


        if (
            paymentStatus ===
            "Payment Verification Pending"
        ) {

            paymentActions = `

                <button
                    class="paid-btn"
                    onclick="updatePaymentStatus(
                        '${order._id}',
                        'Paid'
                    )"
                >
                    ✓ Paid
                </button>


                <button
                    class="reject-btn"
                    onclick="updatePaymentStatus(
                        '${order._id}',
                        'Rejected'
                    )"
                >
                    ✕ Reject
                </button>

            `;

        }


        table.innerHTML += `

            <tr>


                <!-- NAME -->

                <td>
                    ${escapeHTML(order.name)}
                </td>


                <!-- PHONE -->

                <td>
                    ${escapeHTML(order.phone)}
                </td>


                <!-- SERVICE -->

                <td>
                    ${escapeHTML(order.service)}
                </td>


                <!-- DETAILS -->

                <td>
                    ${escapeHTML(
                        order.details || "—"
                    )}
                </td>


                <!-- PAYMENT MODE -->

                <td>

                    ${escapeHTML(
                        paymentMode
                    )}

                </td>


                <!-- UTR -->

                <td>

                    <strong>
                        ${escapeHTML(utr)}
                    </strong>

                </td>


                <!-- SCREENSHOT -->

                <td>

                    ${screenshotHTML}

                </td>


                <!-- PAYMENT STATUS -->

                <td>

                    ${paymentStatusHTML}

                    <div
                        style="
                            margin-top:8px;
                            display:flex;
                            gap:5px;
                            flex-wrap:wrap;
                        "
                    >

                        ${paymentActions}

                    </div>

                </td>


                <!-- DATE -->

                <td>

                    ${new Date(
                        order.date
                    ).toLocaleString()}

                </td>


                <!-- ORDER STATUS -->

                <td>

                    ${escapeHTML(
                        order.status ||
                        "Pending"
                    )}

                </td>


                <!-- ACTION -->

                <td>

                    <button
                        class="complete-btn"
                        onclick="completeOrder(
                            '${order._id}'
                        )"
                    >
                        Complete
                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteOrder(
                            '${order._id}'
                        )"
                    >
                        Delete
                    </button>

                </td>


            </tr>

        `;

    });

}


// ==========================================
// VIEW SCREENSHOT
// ==========================================

function viewScreenshot(imageData) {

    const popup =
        window.open(
            "",
            "_blank",
            "width=800,height=900"
        );


    if (!popup) {

        alert(
            "Please allow popups to view the payment screenshot."
        );

        return;

    }


    popup.document.write(`

        <!DOCTYPE html>

        <html>

        <head>

            <title>
                Payment Screenshot
            </title>

            <style>

                body {

                    margin:0;

                    padding:20px;

                    background:#111;

                    display:flex;

                    justify-content:center;

                    align-items:center;

                    min-height:100vh;

                }

                img {

                    max-width:100%;

                    max-height:95vh;

                    object-fit:contain;

                }

            </style>

        </head>

        <body>

            <img
                src="${imageData}"
                alt="Payment Screenshot"
            >

        </body>

        </html>

    `);


    popup.document.close();

}


// ==========================================
// UPDATE PAYMENT STATUS
// ==========================================

async function updatePaymentStatus(
    id,
    paymentStatus
) {

    const message =
        paymentStatus === "Paid"

            ? "Mark this payment as PAID?"

            : "Reject this payment?";


    if (!confirm(message)) {

        return;

    }


    try {

        const response =
            await fetch(
                `/api/orders/${id}/payment`,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${adminToken}`

                    },

                    body: JSON.stringify({
                        paymentStatus:
                            paymentStatus
                    })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Payment update failed"
            );

        }


        alert(
            paymentStatus === "Paid"

                ? "Payment marked as Paid."

                : "Payment Rejected."
        );


        loadOrders();


    } catch (error) {

        console.error(
            "Payment update error:",
            error
        );


        alert(
            "Error: " +
            error.message
        );

    }

}


// ==========================================
// COMPLETE ORDER
// ==========================================

async function completeOrder(id) {

    try {

        const response =
            await fetch(
                `/api/orders/${id}`,
                {

                    method: "PUT",

                    headers: {

                        "Authorization":
                            `Bearer ${adminToken}`

                    }

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to complete order"
            );

        }


        alert(
            "Order Completed"
        );


        loadOrders();


    } catch (error) {

        console.error(
            "Complete Order Error:",
            error
        );

    }

}


// ==========================================
// DELETE ORDER
// ==========================================

async function deleteOrder(id) {

    if (
        !confirm(
            "Delete this order?"
        )
    ) {

        return;

    }


    try {

        const response =
            await fetch(
                `/api/orders/${id}`,
                {

                    method: "DELETE",

                    headers: {

                        "Authorization":
                            `Bearer ${adminToken}`

                    }

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to delete order"
            );

        }


        alert(
            "Order Deleted"
        );


        loadOrders();


    } catch (error) {

        console.error(
            "Delete Order Error:",
            error
        );

    }

}


// ==========================================
// FILTER ORDERS
// ==========================================

function filterOrders(status) {

    if (status === "All") {

        renderOrders(
            allOrders
        );

    } else {

        const filtered =
            allOrders.filter(
                order => {

                    return (

                        order.status ===
                        status ||

                        order.paymentStatus ===
                        status

                    );

                }
            );


        renderOrders(
            filtered
        );

    }


    const buttons =
        document.querySelectorAll(
            ".filter-btn"
        );


    buttons.forEach(button => {

        button.classList.remove(
            "active-filter"
        );

    });


    buttons.forEach(button => {

        if (
            button.innerText.trim() ===
            status
        ) {

            button.classList.add(
                "active-filter"
            );

        }

    });

}


// ==========================================
// SEARCH ORDERS
// ==========================================

const searchInput =
    document.getElementById(
        "searchInput"
    );


if (searchInput) {

    searchInput.addEventListener(
        "keyup",
        function () {

            const value =
                this.value
                    .toLowerCase()
                    .trim();


            const filtered =
                allOrders.filter(
                    order => {

                        return (

                            String(
                                order.name || ""
                            )
                            .toLowerCase()
                            .includes(value)

                            ||

                            String(
                                order.phone || ""
                            )
                            .toLowerCase()
                            .includes(value)

                            ||

                            String(
                                order.service || ""
                            )
                            .toLowerCase()
                            .includes(value)

                            ||

                            String(
                                order.utr || ""
                            )
                            .toLowerCase()
                            .includes(value)

                        );

                    }
                );


            renderOrders(
                filtered
            );

        }
    );

}


// ==========================================
// LOGOUT
// ==========================================

function logout() {

    localStorage.removeItem(
        "adminToken"
    );

    window.location.href =
        "index.html";

}


// ==========================================
// ADD PORTFOLIO PROJECT
// ==========================================

function addProject() {

    const title =
        document
            .getElementById(
                "projectTitle"
            )
            .value
            .trim();


    const description =
        document
            .getElementById(
                "projectDescription"
            )
            .value
            .trim();


    const image =
        document
            .getElementById(
                "projectImage"
            )
            .value
            .trim();


    if (
        !title ||
        !description ||
        !image
    ) {

        alert(
            "Please fill all project details."
        );

        return;

    }


    fetch(
        "/api/portfolio",
        {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json",

                "Authorization":
                    `Bearer ${adminToken}`

            },

            body: JSON.stringify({

                title:
                    title,

                description:
                    description,

                image:
                    image

            })

        }
    )

    .then(res =>
        res.json()
    )

    .then(data => {

        alert(
            "Project Added Successfully"
        );


        document.getElementById(
            "projectTitle"
        ).value = "";


        document.getElementById(
            "projectDescription"
        ).value = "";


        document.getElementById(
            "projectImage"
        ).value = "";


        location.reload();

    })

    .catch(err => {

        console.log(
            "Add Project Error:",
            err
        );

        alert(
            "Error Adding Project"
        );

    });

}


// ==========================================
// LOAD PORTFOLIO
// ==========================================

const portfolioList =
    document.getElementById(
        "portfolioList"
    );


if (portfolioList) {

    fetch(
        "/api/portfolio"
    )

    .then(res =>
        res.json()
    )

    .then(projects => {

        portfolioList.innerHTML =
            "";


        projects.forEach(
            project => {

                portfolioList.innerHTML += `

                    <div class="portfolio-admin-item">

                        <h3>
                            ${escapeHTML(
                                project.title
                            )}
                        </h3>

                        <p>
                            ${escapeHTML(
                                project.description
                            )}
                        </p>

                        <button
                            onclick="deleteProject(
                                '${project._id}'
                            )"
                        >
                            Delete Project
                        </button>

                    </div>

                    <hr>

                `;

            }
        );

    })

    .catch(err => {

        console.log(
            "Portfolio Load Error:",
            err
        );

    });

}


// ==========================================
// DELETE PORTFOLIO PROJECT
// ==========================================

function deleteProject(id) {

    if (
        !confirm(
            "Delete this project?"
        )
    ) {

        return;

    }


    fetch(
        `/api/portfolio/${id}`,
        {

            method: "DELETE",

            headers: {

                "Authorization":
                    `Bearer ${adminToken}`

            }

        }
    )

    .then(res =>
        res.json()
    )

    .then(data => {

        alert(
            "Project Deleted"
        );

        location.reload();

    })

    .catch(err => {

        console.log(
            "Delete Project Error:",
            err
        );

    });

}


// ==========================================
// SECURITY HELPERS
// ==========================================

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function escapeAttribute(value) {

    return String(value)
        .replaceAll("\\", "\\\\")
        .replaceAll("'", "\\'")
        .replaceAll('"', "&quot;");

}


// ==========================================
// INITIAL LOAD
// ==========================================

loadOrders();