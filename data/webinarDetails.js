const webinarDetails = {
    theme: 'Scale Up Series 3.8',
    topic: 'Proven Strategies for Revenue and Profitability Growth in Private Elementary and Secondary School Business.',
    date: 'December 02, 2024',
    time: '2:00 pm',
    platform: { name: 'Online' },
    duration: '2 - 3 hours',
    whatsappLink: 'https://chat.whatsapp.com/LUW9txtbiOa2oTk9VlEvrp',
    time_to_go: {
        value: '',
        text: ''
    } // Updated to be more flexible
};


// Get today's date and set it to 12:00 AM
const today = new Date();
today.setHours(0, 0, 0, 0); // Set time to 12:00 AM (midnight)


// Parse webinar date and set it to the exact webinar time
const webinarDate = new Date(`${webinarDetails.date}`); // 3:00 PM


// Calculate the difference in milliseconds
const timeDifference = webinarDate - today;

// Check if the time difference is less than a day
if (timeDifference < 1000 * 3600 * 24 && timeDifference > 0) {
    // Calculate hours to go
    const now = new Date();
    const hoursToGo = Math.ceil((webinarDate - now) / (1000 * 3600)); // Convert ms to hours
    webinarDetails.time_to_go.value = `${hoursToGo}`;
    webinarDetails.time_to_go.text = ` hours to go`;

} else if (timeDifference >= 1000 * 3600 * 24) {
    // Calculate days to go
    const daysToGo = Math.ceil(timeDifference / (1000 * 3600 * 24)); // Convert ms to days
    webinarDetails.time_to_go.value = `${daysToGo}`;
    webinarDetails.time_to_go.text = ` day(s) to go`;

} else {
    webinarDetails.time_to_go.value = "Webinar has started or passed!";
    webinarDetails.time_to_go.text = ``;
}

  
module.exports = webinarDetails;  