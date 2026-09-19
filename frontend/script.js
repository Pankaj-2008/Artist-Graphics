const form = document.getElementById("contactForm");

if (form) {
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const inputs = form.querySelectorAll("input");
        const select = form.querySelector("select");
        const textarea = form.querySelector("textarea");

        const order = {
            name: inputs[0]?.value?.trim() || "",
            phone: inputs[1]?.value?.trim() || "",
            service: select?.value || "",
            details: textarea?.value?.trim() || ""
        };

        console.log("Sending order:", order);

        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(order)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Request failed");
            }

            console.log("Order saved:", data);

            alert("Request Saved Successfully!");
            form.reset();

        } catch (err) {
            console.error("Order error:", err);
            alert("Error Saving Request: " + err.message);
        }
    });
}


// ===============================
// PORTFOLIO
// ===============================

const portfolioContainer =
    document.getElementById("portfolioContainer");

if (portfolioContainer) {

    fetch("/api/portfolio")
        .then(res => res.json())
        .then(projects => {

            if (!Array.isArray(projects)) {
                console.log("Invalid data:", projects);
                return;
            }

            let html = "";

            projects.forEach(project => {

                html += `
                    <div class="portfolio-card">

                        <img
                            src="${project.image}"
                            width="300"
                        />

                        <h3>
                            ${project.title}
                        </h3>

                        <p>
                            ${project.description}
                        </p>

                    </div>
                `;

            });

            portfolioContainer.innerHTML = html;

        })
        .catch(err => {
            console.log("Portfolio error:", err);
        });
}


// ===============================
// ADMIN LOGIN MODAL
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    const adminLoginBtn =
        document.getElementById("adminLoginBtn");

    const loginModal =
        document.getElementById("loginModal");

    const closeLogin =
        document.getElementById("closeLogin");

    const loginForm =
        document.getElementById("loginForm");

    const loginError =
        document.getElementById("loginError");


    // ===============================
    // OPEN LOGIN MODAL
    // ===============================

    if (adminLoginBtn && loginModal) {

        adminLoginBtn.addEventListener("click", function (e) {

            e.preventDefault();

            loginModal.classList.add("active");

            loginError.textContent = "";

        });

    }


    // ===============================
    // CLOSE LOGIN
    // ===============================

    if (closeLogin && loginModal) {

        closeLogin.addEventListener("click", function () {

            loginModal.classList.remove("active");

        });

    }


    // ===============================
    // CLICK OUTSIDE = CLOSE
    // ===============================

    if (loginModal) {

        loginModal.addEventListener("click", function (e) {

            if (e.target === loginModal) {

                loginModal.classList.remove("active");

            }

        });

    }


    // ===============================
    // BACKEND ADMIN LOGIN
    // ===============================

    if (loginForm) {

        loginForm.addEventListener("submit", async function (e) {

            e.preventDefault();


            const username =
                document.getElementById("adminUsername")
                    .value
                    .trim();


            const password =
                document.getElementById("adminPassword")
                    .value;


            loginError.textContent = "";


            try {

                const response = await fetch(
                    "/api/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            username: username,
                            password: password
                        })
                    }
                );


                const data = await response.json();


                // ===============================
                // LOGIN FAILED
                // ===============================

                if (!response.ok) {

                    loginError.textContent =
                        data.message ||
                        "Invalid username or password.";

                    return;

                }


                // ===============================
                // LOGIN SUCCESS
                // ===============================

                localStorage.setItem(
                    "adminToken",
                    data.token
                );


                // Open Admin Panel

                window.location.href =
                    "admin.html";


            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                loginError.textContent =
                    "Server connection failed.";

            }

        });

    }

});