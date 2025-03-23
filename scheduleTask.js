// Schedule Meeting Task Functionality
const scheduleTask = {
    // Keywords that trigger this task type
    keywords: ['schedule', 'meeting', 'appointment', 'book', 'calendar', 'plan'],

    // Check if input matches this task
    isMatch(input) {
        const text = input.toLowerCase();
        return this.keywords.some(keyword => text.includes(keyword));
    },

    // Handle click on the Schedule Meeting task item
    handleTaskClick() {
        const userMessage = "I need to schedule a meeting";
        const aiResponse = "I'd be happy to help you schedule a meeting. Could you provide me with the date, time, and participants?";

        // Add user's selection as a message
        addUserMessageToChat(userMessage);

        // Show typing indicator
        showTypingIndicator();

        // Update avatar status
        setAvatarStatus('processing');

        // Process and respond
        setTimeout(() => {
            removeTypingIndicator();
            speakWithAvatar(aiResponse);

            // Close panel on mobile
            if (window.innerWidth <= 768) {
                isPanelExpanded = false;
                document.getElementById('task-panel').classList.remove('expanded');
            }
        }, 1500);
    },

    // Process schedule-related input
    execute(input) {
        // Extract date, time, and participant details
        const datePattern = /(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}[-\.]\d{1,2}[-\.]\d{2,4}|\d{4}[-\.\/]\d{1,2}[-\.\/]\d{1,2}|\d{1,2}(?:st|nd|rd|th)? (?:of )?(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)(?: \d{2,4})?|(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?) \d{1,2}(?:st|nd|rd|th)?(?:,? \d{2,4})?|tomorrow|today|yesterday|next (?:mon|tues|wednes|thurs|fri|satur|sun)day|(?:mon|tues|wednes|thurs|fri|satur|sun)day(?:(?: the)? \d{1,2}(?:st|nd|rd|th)?)?)/i;
        const timePattern = /(\d{1,2}(?::\d{2})? ?(?:am|pm)|noon|midnight)/i;
        const peoplePattern = /(with|and) ([a-z]+(?: [a-z]+)*)/i;

        const dateMatch = input.match(datePattern);
        const timeMatch = input.match(timePattern);
        const peopleMatch = input.match(peoplePattern);

        const date = dateMatch ? dateMatch[1] : null;
        const time = timeMatch ? timeMatch[1] : null;
        const people = peopleMatch ? peopleMatch[2] : null;

        // Create response based on extracted information
        let response = "I'm scheduling a meeting";
        if (date) response += ` for ${date}`;
        if (time) response += ` at ${time}`;
        if (people) response += ` with ${people}`;

        // If we're missing information, ask for it
        if (!date && !time) {
            response += ". When would you like to schedule this meeting?";
        } else if (!people) {
            response += ". Who will be attending this meeting?";
        } else {
            response += ". The meeting has been added to your calendar.";
        }

        return response;
    }
};

// Initialize event listener
document.addEventListener('DOMContentLoaded', function () {
    const scheduleButton = document.querySelector('.task-item[data-task="schedule"]');
    if (scheduleButton) {
        scheduleButton.addEventListener('click', () => scheduleTask.handleTaskClick());
    }
});