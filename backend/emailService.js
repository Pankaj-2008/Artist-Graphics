const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


async function sendAdminOrderEmail(order) {

    const mailOptions = {

        from: process.env.EMAIL_USER,

        to: process.env.ADMIN_EMAIL,

        subject: `🔔 New Artist Graphics Order - ${order.service}`,

        html: `
            <h2>🔔 New Order Received</h2>

            <p>
                <strong>Customer Name:</strong>
                ${order.name}
            </p>

            <p>
                <strong>Phone:</strong>
                ${order.phone}
            </p>

            <p>
                <strong>Service:</strong>
                ${order.service}
            </p>

            <p>
                <strong>Payment Mode:</strong>
                ${order.paymentMode}
            </p>

            <p>
                <strong>Payment Status:</strong>
                ${order.paymentStatus}
            </p>

            ${
                order.utr
                    ? `<p><strong>UTR:</strong> ${order.utr}</p>`
                    : ""
            }

            <p>
                <strong>Details:</strong>
                ${order.details || "No details provided"}
            </p>

            <hr>

            <p>
                <strong>Order ID:</strong>
                ${order._id}
            </p>

            <p>
                <strong>Date:</strong>
                ${new Date(order.date).toLocaleString("en-IN")}
            </p>

            <br>

            <p>
                Please check the Artist Graphics Admin Panel
                for more details.
            </p>
        `
    };


    await transporter.sendMail(mailOptions);
}


module.exports = {
    sendAdminOrderEmail
};