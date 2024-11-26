const transporter = require('../config/transporter');
const webinarDetails = require('../data/webinarDetails');

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
        <h1 style="text-align: center; color: #5E17DD;">${webinarDetails.time_to_go.value}<span style="font-size: 0.5em;">${webinarDetails.time_to_go.text}</span></h1>
        <p>This is a reminder that the upcoming <strong>${webinarDetails.theme}</strong> webinar is nearby, below are the webinar details:</p>
        <p><strong>Details:</strong></p>
        <ul style="list-style-type: none; padding: 0;">
          <li style="margin-bottom: 0.5em;"><strong>Topic:</strong> <em>${webinarDetails.topic}</em></li>
          <li style="margin-bottom: 0.5em;"><strong>Date:</strong> ${webinarDetails.date}</li>
          <li style="margin-bottom: 0.5em;"><strong>Time:</strong> ${webinarDetails.time}</li>
          <li style="margin-bottom: 0.5em;"><strong>Platform:</strong> ${webinarDetails.platform.name}</li>
        </ul>
        <p style="text-align: center; margin-top: 1rem;">Click below to join our <strong>official WhatsApp group</strong> for more information:</p>
        <div style="text-align: center; margin-top: 1rem;">
            <a href="${webinarDetails.whatsappLink}" style="padding: 10px 20px; background-color: #198754; color: white; text-decoration: none; border-radius: 5px;">Join Now</a>
        </div>
        
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

module.exports = sendEmail;
