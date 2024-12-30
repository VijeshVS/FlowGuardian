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

// Initialize WebSocket Server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const wss = new WebSocket.Server({ server });

// Store connected WebSocket clients
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
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: authority.email,
          subject: "Emergency: High Water Pressure Difference",
          text: `The water pressure difference is dangerously high: ${pressureDifference} units.`,
        });
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
