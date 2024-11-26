require('dotenv').config();
const nodemailer = require('nodemailer');
const axios = require('axios');

// Validate Environment Variables
const validateEnv = () => {
  const requiredVars = [
    'EMAIL_SERVICE',
    'EMAIL_PORT',
    'EMAIL_USER',
    'EMAIL_PASS',
    'RECIPIENTS_API_URL',
  ];
  for (const variable of requiredVars) {
    if (!process.env[variable]) {
      throw new Error(`Missing environment variable: ${variable}`);
    }
  }
};
validateEnv();

// Webinar Details
const webinarDetails = {
  theme: 'Scale Up Series 3.7',
  topic: 'Proven Strategies for Revenue and Profitability Growth in Private Elementary and Secondary School Business.',
  date: '27th November, 2024',
  time: '3:00 pm',
  platform: { name: 'Google Meet' },
  duration: '2 - 3 hours',
  whatsappLink: 'https://chat.whatsapp.com/Gj5KemBw98oJdCFDARcr4N',
};

// Email Configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVICE,
  port: process.env.EMAIL_PORT,
  secure: true, // Use true for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to Fetch Recipients
const fetchRecipients = async (eventName) => {
  try {
    const response = await axios.get(process.env.RECIPIENTS_API_URL);
    if (!Array.isArray(response.data)) {
      console.error('Invalid response format from API.');
      return [];
    }

    const recipients = response.data
      .filter((item) => item.Event_Attending === eventName)
      .map((item) => ({
        email: item.Attendee_Email,
        name: item.Attendee_Full_Name,
      }));

    // Remove duplicates by email
    return Array.from(new Map(recipients.map((r) => [r.email, r])).values());
  } catch (error) {
    console.error('Error fetching emails:', error.message);
    return [];
  }
};

// Function to Send a Single Email
const sendEmail = async (recipient) => {
  const mailOptions = {
    from: `"Daily Reminder" <${process.env.EMAIL_USER}>`,
    to: recipient.email,
    subject: `Reminder: ${webinarDetails.theme}`,
    text: `Dear ${recipient.name},\nThis is a reminder about the upcoming webinar "${webinarDetails.theme}". Have a great day!`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #112F3A; font-size: 1.2rem;">
        <h1 style="font-size: 1.7rem; color: #5E17DD;">Gentle Reminder!</h1>
        <p>Hello <strong>${recipient.name}</strong>,</p>
        <p>We’re thrilled to have you join our upcoming webinar: <strong>${webinarDetails.theme}</strong>.</p>
        <p><strong>Details:</strong></p>
        <ul style="list-style-type: none; padding: 0;">
          <li style="margin-bottom: 0.5em;"><strong>Topic:</strong> <em>${webinarDetails.topic}</em></li>
          <li style="margin-bottom: 0.5em;"><strong>Date:</strong> ${webinarDetails.date}</li>
          <li style="margin-bottom: 0.5em;"><strong>Time:</strong> ${webinarDetails.time}</li>
          <li style="margin-bottom: 0.5em;"><strong>Platform:</strong> ${webinarDetails.platform.name}</li>
        </ul>
        <p style="text-align: center; margin-top: 1rem;">Click below to join our <strong>official WhatsApp group</strong> for more information:</p>
        <a href="${webinarDetails.whatsappLink}" style="padding: 10px 20px; background-color: #198754; color: white; text-decoration: none; border-radius: 5px; margin: 0 auto;">Join Now</a>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to: ${recipient.name} <${recipient.email}>`);
    return true;
  } catch (error) {
    console.error(`Error sending email to ${recipient.email}:`, error.message);
    return false;
  }
};

// Function to Send Emails in Batches
const sendBatchEmails = async (eventName, batchSize = 10) => {
  const recipients = await fetchRecipients(eventName);

  if (recipients.length === 0) {
    console.log('No recipients found for this event.');
    return;
  }

  console.log(`Found ${recipients.length} recipient(s) for the event "${eventName}".`);

  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    console.log(`Sending batch ${Math.floor(i / batchSize) + 1} (${batch.length} recipient(s))...`);

    const results = await Promise.all(batch.map((recipient) => sendEmail(recipient)));
    const sentCount = results.filter((result) => result).length;

    console.log(`Batch completed: ${sentCount}/${batch.length} emails sent successfully.`);

    // Rate limit between batches
    if (i + batchSize < recipients.length) {
      console.log('Waiting 1 second before sending the next batch...');
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log('All emails have been sent.');
};

// Main Execution
const eventName = 'Scale Up Series 3.7';
sendBatchEmails(eventName);
