// =====================================================
// ARTIST GRAPHICS - MAIN SCRIPT
// =====================================================


// =====================================================
// SERVICE PRICES
// =====================================================

const SERVICE_PRICES = {
    "Graphic Design": 300,
    "Video Editing": 500,
    "Video Shoot": 1000
};


// =====================================================
// CONTACT FORM
// =====================================================

const form = document.getElementById("contactForm");

const paymentMode =
    document.getElementById("paymentMode");

const serviceSelect =
    document.getElementById("serviceSelect");

const onlinePaymentBox =
    document.getElementById("onlinePaymentBox");

const offlinePaymentBox =
    document.getElementById("offlinePaymentBox");

const paymentAmount =
    document.getElementById("paymentAmount");

const upiQrContainer =
    document.getElementById("upiQrContainer");

const upiQrImage =
    document.getElementById("upiQrImage");

const utrInput =
    document.getElementById("utr");

const paymentScreenshot =
    document.getElementById("paymentScreenshot");

const submitOrderBtn =
    document.getElementById("submitOrderBtn");


// =====================================================
// UPI QR
// =====================================================

// पुढच्या step मध्ये इथे तुझा actual QR image ठेवू.
if (upiQrImage) {

    upiQrImage.src = "images/qr.png";

    upiQrImage.alt =
        "Artist Graphics UPI Payment QR Code";
}


// =====================================================
// PAYMENT MODE CHANGE
// =====================================================

if (paymentMode) {

    paymentMode.addEventListener("change", function () {

        const mode = paymentMode.value;

        // -------------------------------
        // RESET
        // -------------------------------

        if (onlinePaymentBox) {
            onlinePaymentBox.style.display = "none";
        }

        if (offlinePaymentBox) {
            offlinePaymentBox.style.display = "none";
        }

        if (paymentAmount) {
            paymentAmount.style.display = "none";
            paymentAmount.textContent = "";
        }

        if (upiQrContainer) {
            upiQrContainer.style.display = "none";
        }

        if (utrInput) {
            utrInput.required = false;
        }

        if (paymentScreenshot) {
            paymentScreenshot.required = false;
        }


        // -------------------------------
        // ONLINE
        // -------------------------------

        if (mode === "online") {

            if (onlinePaymentBox) {
                onlinePaymentBox.style.display = "block";
            }

            if (upiQrContainer) {
                upiQrContainer.style.display = "block";
            }

            if (utrInput) {
                utrInput.required = true;
            }

            if (paymentScreenshot) {
                paymentScreenshot.required = true;
            }

            const service =
                serviceSelect?.value || "";

            const amount =
                SERVICE_PRICES[service];

            if (amount && paymentAmount) {

                paymentAmount.style.display = "block";

                paymentAmount.textContent =
                    `Amount to Pay: ₹${amount}`;
            }


            if (submitOrderBtn) {

                submitOrderBtn.textContent =
                    "Submit Payment Request →";

            }

        }


        // -------------------------------
        // OFFLINE
        // -------------------------------

        if (mode === "offline") {

            if (offlinePaymentBox) {
                offlinePaymentBox.style.display = "block";
            }

            if (submitOrderBtn) {

                submitOrderBtn.textContent =
                    "Request a Call →";

            }

        }

    });

}


// =====================================================
// SERVICE CHANGE
// =====================================================

if (serviceSelect) {

    serviceSelect.addEventListener("change", function () {

        const service =
            serviceSelect.value;

        const amount =
            SERVICE_PRICES[service];

        if (
            paymentMode &&
            paymentMode.value === "online" &&
            amount &&
            paymentAmount
        ) {

            paymentAmount.style.display = "block";

            paymentAmount.textContent =
                `Amount to Pay: ₹${amount}`;

        }

    });

}


// =====================================================
// READ PAYMENT SCREENSHOT
// =====================================================

function readScreenshot(file) {

    return new Promise((resolve, reject) => {

        if (!file) {
            resolve("");
            return;
        }

        const reader =
            new FileReader();

        reader.onload = function () {

            resolve(reader.result);

        };

        reader.onerror = function () {

            reject(
                new Error(
                    "Could not read payment screenshot."
                )
            );

        };

        reader.readAsDataURL(file);

    });

}


// =====================================================
// FORM SUBMIT
// =====================================================

if (form) {

    form.addEventListener("submit", async function (e) {

        e.preventDefault();


        // -----------------------------------------
        // GET FORM VALUES
        // -----------------------------------------

        const name =
            document
                .getElementById("customerName")
                ?.value
                ?.trim() || "";


        const phone =
            document
                .getElementById("customerPhone")
                ?.value
                ?.trim() || "";


        const service =
            serviceSelect
                ?.value || "";


        const mode =
            paymentMode
                ?.value || "";


        const details =
            document
                .getElementById("projectDetails")
                ?.value
                ?.trim() || "";


        // -----------------------------------------
        // BASIC VALIDATION
        // -----------------------------------------

        if (!name || !phone || !service || !mode) {

            alert(
                "Please fill all required fields."
            );

            return;

        }


        // =================================================
        // OFFLINE / CALL REQUEST
        // =================================================

        if (mode === "offline") {

            submitOrderBtn.disabled = true;

            submitOrderBtn.textContent =
                "Sending Request...";


            try {

                const response =
                    await fetch(
                        "/api/payment/offline",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                name: name,

                                phone: phone,

                                service: service,

                                details: details

                            })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Call request failed."
                    );

                }


                alert(
                    "📞 Call request submitted successfully! We will contact you soon."
                );


                form.reset();


                if (onlinePaymentBox) {
                    onlinePaymentBox.style.display =
                        "none";
                }

                if (offlinePaymentBox) {
                    offlinePaymentBox.style.display =
                        "none";
                }


                submitOrderBtn.textContent =
                    "Send Request →";


            } catch (error) {

                console.error(
                    "Offline request error:",
                    error
                );


                alert(
                    "Error: " +
                    error.message
                );


            } finally {

                submitOrderBtn.disabled =
                    false;

            }


            return;

        }


        // =================================================
        // ONLINE UPI PAYMENT REQUEST
        // =================================================

        if (mode === "online") {


            const amount =
                SERVICE_PRICES[service];


            if (!amount) {

                alert(
                    "Invalid service selected."
                );

                return;

            }


            // -----------------------------------------
            // UTR
            // -----------------------------------------

            const utr =
                utrInput
                    ?.value
                    ?.trim() || "";


            if (!utr) {

                alert(
                    "Please enter your UTR / Transaction ID."
                );

                utrInput?.focus();

                return;

            }


            // -----------------------------------------
            // SCREENSHOT
            // -----------------------------------------

            const file =
                paymentScreenshot
                    ?.files?.[0];


            if (!file) {

                alert(
                    "Please upload your payment screenshot."
                );

                return;

            }


            // -----------------------------------------
            // CHECK IMAGE SIZE
            // -----------------------------------------

            const maxSize =
                5 * 1024 * 1024;


            if (file.size > maxSize) {

                alert(
                    "Payment screenshot must be less than 5 MB."
                );

                return;

            }


            submitOrderBtn.disabled = true;

            submitOrderBtn.textContent =
                "Submitting Payment Request...";


            try {

                const screenshot =
                    await readScreenshot(file);


                const response =
                    await fetch(
                        "/api/payment/online",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                name: name,

                                phone: phone,

                                service: service,

                                details: details,

                                utr: utr,

                                paymentScreenshot:
                                    screenshot

                            })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Payment request failed."
                    );

                }


                alert(
                    "✅ Payment details submitted successfully!\n\nYour payment is now under verification."
                );


                form.reset();


                if (onlinePaymentBox) {
                    onlinePaymentBox.style.display =
                        "none";
                }

                if (offlinePaymentBox) {
                    offlinePaymentBox.style.display =
                        "none";
                }


                if (paymentAmount) {

                    paymentAmount.textContent =
                        "";

                    paymentAmount.style.display =
                        "none";

                }


                submitOrderBtn.textContent =
                    "Send Request →";


            } catch (error) {

                console.error(
                    "Online payment error:",
                    error
                );


                alert(
                    "Error: " +
                    error.message
                );


            } finally {

                submitOrderBtn.disabled =
                    false;

            }

        }

    });

}


// =====================================================
// PORTFOLIO
// =====================================================

const portfolioContainer =
    document.getElementById(
        "portfolioContainer"
    );


if (portfolioContainer) {

    fetch("/api/portfolio")

        .then(res => res.json())

        .then(projects => {

            if (!Array.isArray(projects)) {

                console.log(
                    "Invalid portfolio data:",
                    projects
                );

                return;

            }


            let html = "";


            projects.forEach(project => {

                html += `

                    <div class="portfolio-card">

                        <img
                            src="${project.image}"
                            width="300"
                            alt="${project.title || "Portfolio Project"}"
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


            portfolioContainer.innerHTML =
                html;

        })

        .catch(err => {

            console.log(
                "Portfolio error:",
                err
            );

        });

}


// =====================================================
// ADMIN LOGIN MODAL
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        const adminLoginBtn =
            document.getElementById(
                "adminLoginBtn"
            );


        const loginModal =
            document.getElementById(
                "loginModal"
            );


        const closeLogin =
            document.getElementById(
                "closeLogin"
            );


        const loginForm =
            document.getElementById(
                "loginForm"
            );


        const loginError =
            document.getElementById(
                "loginError"
            );


        // ==========================================
        // OPEN LOGIN MODAL
        // ==========================================

        if (
            adminLoginBtn &&
            loginModal
        ) {

            adminLoginBtn.addEventListener(
                "click",
                function (e) {

                    e.preventDefault();

                    loginModal.classList.add(
                        "active"
                    );

                    if (loginError) {

                        loginError.textContent =
                            "";

                    }

                }
            );

        }


        // ==========================================
        // CLOSE LOGIN
        // ==========================================

        if (
            closeLogin &&
            loginModal
        ) {

            closeLogin.addEventListener(
                "click",
                function () {

                    loginModal.classList.remove(
                        "active"
                    );

                }
            );

        }


        // ==========================================
        // CLICK OUTSIDE = CLOSE
        // ==========================================

        if (loginModal) {

            loginModal.addEventListener(
                "click",
                function (e) {

                    if (
                        e.target ===
                        loginModal
                    ) {

                        loginModal.classList.remove(
                            "active"
                        );

                    }

                }
            );

        }


        // ==========================================
        // ADMIN LOGIN
        // ==========================================

        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                async function (e) {

                    e.preventDefault();


                    const username =
                        document
                            .getElementById(
                                "adminUsername"
                            )
                            .value
                            .trim();


                    const password =
                        document
                            .getElementById(
                                "adminPassword"
                            )
                            .value;


                    loginError.textContent =
                        "";


                    try {

                        const response =
                            await fetch(
                                "/api/login",
                                {
                                    method: "POST",

                                    headers: {
                                        "Content-Type":
                                            "application/json"
                                    },

                                    body: JSON.stringify({
                                        username:
                                            username,

                                        password:
                                            password
                                    })

                                }
                            );


                        const data =
                            await response.json();


                        // ==================================
                        // LOGIN FAILED
                        // ==================================

                        if (!response.ok) {

                            loginError.textContent =
                                data.message ||
                                "Invalid username or password.";

                            return;

                        }


                        // ==================================
                        // LOGIN SUCCESS
                        // ==================================

                        localStorage.setItem(
                            "adminToken",
                            data.token
                        );


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

                }
            );

        }

    }
);