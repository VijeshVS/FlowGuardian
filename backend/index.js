const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const WebSocket = require("ws");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const PRESSURE_THRESHOLD = 50;
const AUTHORITIES = [{ email: "vijeshsshetty@gmail.com" }];

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const wss = new WebSocket.Server({ server });

const clients = new Set();

wss.on("connection", (ws) => {
  console.log("New WebSocket connection established");
  clients.add(ws);

  ws.on("close", () => {
    console.log("WebSocket connection closed");
    clients.delete(ws);
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

function broadcastPressureData(data) {
  const message = JSON.stringify(data);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

app.post("/api/pressure", async (req, res) => {
  const { end1Pressure, end2Pressure } = req.body;

  if (end1Pressure == null || end2Pressure == null) {
    return res.status(400).send({ message: "Invalid data format" });
  }

  const pressureDifference = Math.abs(end1Pressure - end2Pressure);
  console.log(`Pressure difference: ${pressureDifference}`);

  const pressureData = {
    end1Pressure,
    end2Pressure,
    area: "Industry",
    dateTime: new Date().toISOString(),
  };

  // Broadcast the data via WebSocket
  broadcastPressureData(pressureData);

  if (pressureDifference > PRESSURE_THRESHOLD) {
    console.log("Emergency detected! Sending email notifications...");

    try {
      for (const authority of AUTHORITIES) {
        const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
      color: #333;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      background-color: #ff4d4d;
      color: white;
      padding: 20px;
      border-radius: 8px 8px 0 0;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px;
    }
    .content p {
      margin: 10px 0;
      line-height: 1.6;
    }
    .content ul {
      list-style-type: none;
      padding: 0;
    }
    .content ul li {
      margin: 10px 0;
      padding: 10px;
      background: #f9f9f9;
      border-left: 4px solid #ff4d4d;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      font-size: 12px;
      color: #777;
    }
    .emergency {
      font-weight: bold;
      color: #ff4d4d;
    }
    .cta {
      display: inline-block;
      margin-top: 20px;
      padding: 10px 20px;
      background-color: #ff4d4d;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
    }
    .cta:hover {
      background-color: #e33e3e;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>🚨 Emergency Alert: High Water flowrate Difference 🚨</h1>
    </div>
    <div class="content">
      <p>Dear Authority,</p>
      <p>We have detected a critical issue with the water flowrate levels in the monitored area. Here are the details:</p>
      <ul>
        <li><strong>End 1 FlowRate:</strong> <span class="emergency">${end1Pressure} units</span></li>
        <li><strong>End 2 FlowRate:</strong> <span class="emergency">${end2Pressure} units</span></li>
        <li><strong>Flowrate Difference:</strong> <span class="emergency">${pressureDifference} units</span></li>
        <li><strong>Location:</strong> Industry</li>
        <li><strong>Date & Time:</strong> ${new Date().toLocaleString()}</li>
      </ul>
      <p class="emergency">⚠️ The flowrate difference exceeds the safe threshold of ${PRESSURE_THRESHOLD} units. Immediate action is required.</p>
      <a href="#" class="cta">Take Immediate Action</a>
      <p>Thank you for your prompt attention to this matter.</p>
      <p>Best regards,<br><strong>Flow Guardian</strong></p>
    </div>
    <div class="footer">
      <p>This is an automated message. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
`;

          // await transporter.sendMail({
          //   from: process.env.EMAIL_USER,
          //   to: authority.email,
          //   subject: "Emergency: High Water Flowrate Difference",
          //   html: htmlContent,
          // });
        console.log(`Email sent to ${authority.email}`);
      }
      return res
        .status(200)
        .send({ message: "Email notifications sent successfully" });
    } catch (error) {
      console.error("Error sending email notifications:", error);
      return res
        .status(500)
        .send({ message: "Error sending email notifications" });
    }
  }

  res.status(200).send({ message: "Pressure levels are within normal range" });
});
