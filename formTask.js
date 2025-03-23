// Form Task Functionality
const formTask = {
    // Keywords that trigger this task type
    keywords: ['form', 'fill', 'application', 'complete', 'document', 'paperwork'],
    
    // Check if input matches this task
    isMatch(input) {
        const text = input.toLowerCase();
        return this.keywords.some(keyword => text.includes(keyword));
    },
    
    // Handle click on the Auto-fill Forms task item
    handleTaskClick() {
        const userMessage = "I need to fill out a form";
        const aiResponse = "I can assist with filling out forms. Which form do you need help with?";
        
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
    
    // Process form-related input
    execute(input) {
        // Extract form type and information
        const formPattern = /(application|registration|signup|contact|request|claim|feedback|survey|assessment|order|complaint) form/i;
        
        const formMatch = input.match(formPattern);
        const formType = formMatch ? formMatch[1] : null;
        
        // Create response based on extracted information
        let response = "I'll help you complete a form";
        if (formType) response += ` for ${formType}`;
        
        // Ask for needed information
        if (!formType) {
            response += ". What type of form do you need to fill out?";
        } else {
            response += ". I can pre-fill your personal information. Would you like me to proceed?";
        }
        
        return response;
    }
};

// Initialize event listener
document.addEventListener('DOMContentLoaded', function() {
    const formButton = document.querySelector('.task-item[data-task="form"]');
    if (formButton) {
        formButton.addEventListener('click', () => formTask.handleTaskClick());
    }
});