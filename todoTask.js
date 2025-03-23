// Todo Task Functionality
const todoTask = {
    // Keywords that trigger this task type
    keywords: ['task', 'todo', 'reminder', 'list', 'note', 'remember'],

    // Check if input matches this task
    isMatch(input) {
        const text = input.toLowerCase();
        return this.keywords.some(keyword => text.includes(keyword));
    },

    // Handle click on the Create Task task item
    handleTaskClick() {
        const userMessage = "I need to create a task";
        const aiResponse = "I can help you create a task. What would you like to add to your task list?";

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

    // Process task-related input
    execute(input) {
        // Extract task details and deadline
        const taskPattern = /(create|add|remember|note|make|set) (?:a )?(?:task|reminder|todo)(?: to| about)? (.*?)(?:by|before|on|due|at|$)/i;
        const deadlinePattern = /(by|before|on|due|at) ([a-z0-9]+(?: [a-z0-9]+)*)/i;

        const taskMatch = input.match(taskPattern);
        const deadlineMatch = input.match(deadlinePattern);

        const taskDetail = taskMatch ? taskMatch[2] : null;
        const deadline = deadlineMatch ? deadlineMatch[2] : null;

        // Create response based on extracted information
        let response = "I'm adding a task";
        if (taskDetail) response += ` to ${taskDetail}`;
        if (deadline) response += ` due ${deadline}`;

        // If we're missing information, ask for it
        if (!taskDetail) {
            response += ". What task would you like me to add?";
        } else if (!deadline) {
            response += ". When is this task due?";
        } else {
            response += ". The task has been added to your list.";
        }

        return response;
    }
};

// Initialize event listener
document.addEventListener('DOMContentLoaded', function () {
    const todoButton = document.querySelector('.task-item[data-task="task"]');
    if (todoButton) {
        todoButton.addEventListener('click', () => todoTask.handleTaskClick());
    }
});