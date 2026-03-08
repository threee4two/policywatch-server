require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

app.get('/tracker.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(__dirname + '/tracker.js');
});

app.post('/track', async (req, res) => {
  const { school_id, document_name, page_url, timestamp } = req.body;
  console.log(`Ping from ${school_id}: ${document_name}`);

  try {
    await mailer.sendMail({
      from: process.env.FROM_EMAIL,
      to: process.env.ALERT_EMAIL,
      subject: `🚨 Policy downloaded — ${document_name}`,
      html: `
        <p><strong>School:</strong> ${school_id}</p>
        <p><strong>Document:</strong> ${document_name}</p>
        <p><strong>Page:</strong> ${page_url}</p>
        <p><strong>Time:</strong> ${timestamp}</p>
      `
    });
    console.log('Alert email sent');
  } catch (err) {
    console.error('Email failed:', err.message);
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
