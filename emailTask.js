// Email Task Functionality
const emailTask = {
    // Keywords that trigger this task type
    keywords: ['email', 'message', 'send', 'write', 'draft', 'compose'],

    // Check if input matches this task
    isMatch(input) {
        const text = input.toLowerCase();
        return this.keywords.some(keyword => text.includes(keyword));
    },

    // Handle click on the Send Email task item
    handleTaskClick() {
        const userMessage = "I need to send an email";
        const aiResponse = "I can help you draft an email. Who would you like to send it to, and what's the subject?";

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

    // Process email-related input
    execute(input) {
        // Extract recipient, subject, and content
        const recipientPattern = /(to|for) ([a-z]+(?: [a-z]+)*)/i;
        const subjectPattern = /(about|subject|regarding) ([a-z]+(?: [a-z]+)*)/i;

        const recipientMatch = input.match(recipientPattern);
        const subjectMatch = input.match(subjectPattern);

        const recipient = recipientMatch ? recipientMatch[2] : null;
        const subject = subjectMatch ? subjectMatch[2] : null;

        // Create response based on extracted information
        let response = "I'm drafting an email";
        if (recipient) response += ` to ${recipient}`;
        if (subject) response += ` regarding ${subject}`;

        // If we're missing information, ask for it
        if (!recipient) {
            response += ". Who would you like to send this email to?";
        } else if (!subject) {
            response += ". What should the subject be?";
        } else {
            response += ". What would you like the email to say?";
        }

        return response;
    }
};

// Initialize event listener
document.addEventListener('DOMContentLoaded', function () {
    const emailButton = document.querySelector('.task-item[data-task="email"]');
    if (emailButton) {
        emailButton.addEventListener('click', () => emailTask.handleTaskClick());
    }
});