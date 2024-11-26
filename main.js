require('dotenv').config();
const fetchRecipients = require('./utils/fetchRecipients');
const sendEmail = require('./utils/sendEmail');
const webinarDetails = require('./data/webinarDetails');

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
const eventName = webinarDetails.theme;
sendBatchEmails(eventName);
