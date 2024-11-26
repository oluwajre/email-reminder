const axios = require('axios');

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

module.exports = fetchRecipients;
