document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const messageContainer = document.getElementById('message-container');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const avatarStatusText = document.getElementById('avatar-status-text');
    const toggleAvatarButton = document.getElementById('toggle-avatar');
    const muteAvatarButton = document.getElementById('mute-avatar');
    const voiceButton = document.getElementById('btn-voice-record');
    const taskItems = document.querySelectorAll('.task-item');
    const togglePanelButton = document.getElementById('toggle-panel');
    const taskPanel = document.getElementById('task-panel');
    const clearChatButton = document.getElementById('btn-clear-chat');

    !function (window) {
        const host = "https://labs.heygen.com",
            url = host + "/guest/streaming-embed?share=eyJxdWFsaXR5IjoiaGlnaCIsImF2YXRhck5hbWUiOiJTaWxhc19DdXN0b21lclN1cHBvcnRfcHVi%0D%0AbGljIiwicHJldmlld0ltZyI6Imh0dHBzOi8vZmlsZXMyLmhleWdlbi5haS9hdmF0YXIvdjMvYTFl%0D%0AZDhjNzFlNGJmNGU2Y2I5MDcxZDJiN2NkNzFlNGVfNDU2NjAvcHJldmlld190YWxrXzEud2VicCIs%0D%0AIm5lZWRSZW1vdmVCYWNrZ3JvdW5kIjpmYWxzZSwia25vd2xlZGdlQmFzZUlkIjoiMmFkY2NkNWYz%0D%0ANmUxNDU2YmFkNDdmNzg2MGRlNWFmOGEiLCJ1c2VybmFtZSI6ImFkNDZkYWI3NTI5NjRhZjNhODNl%0D%0AZDJiMzY1NjdkMzBiIn0%3D&inIFrame=1",
            clientWidth = document.body.clientWidth,
            wrapDiv = document.createElement("div");

        wrapDiv.id = "heygen-streaming-embed";

        const container = document.createElement("div");
        container.id = "heygen-streaming-container";

        const stylesheet = document.createElement("style");
        stylesheet.innerHTML = `
            #heygen-streaming-embed {
                // z-index: 9999;
                position: fixed;
                top: 50%;
                left: 30px; /* Position on the left side */
                transform: translateY(-50%); /* Center vertically only */
                width: 440px; /* Fixed width for rectangular shape */
                height: 500px; /* Taller than width for rectangular shape */
                border-radius: 10px; /* Slight rounding on corners */
                border: 2px solid #007bff; /* Blue border to match your site theme */
                box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.12);
                transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                overflow: hidden;
                background-color: #fff;
    
                opacity: 0;
                visibility: hidden;
            }
            #heygen-streaming-embed.show {
                opacity: 1;
                visibility: visible;
            }
            #heygen-streaming-embed.expand {
                width: 320px; /* Keep the same width when expanded */
                height: 400px; /* Keep the same height when expanded */
            }
            #heygen-streaming-container {
                width: 100%;
                height: 100%;
            }
            #heygen-streaming-container iframe {
                width: 100%;
                height: 100%;
                border: 0;
            }
        `;

        const iframe = document.createElement("iframe");
        iframe.allowFullscreen = !1,
            iframe.title = "Streaming Embed",
            iframe.role = "dialog",
            iframe.allow = "microphone",
            iframe.src = url;

        let visible = !1, initial = !1;

        window.addEventListener("message", (e => {
            e.origin === host && e.data && e.data.type && "streaming-embed" === e.data.type && (
                "init" === e.data.action ? (initial = !0, wrapDiv.classList.toggle("show", initial)) :
                    "show" === e.data.action ? (visible = !0, wrapDiv.classList.toggle("expand", visible)) :
                        "hide" === e.data.action && (visible = !1, wrapDiv.classList.toggle("expand", visible))
            )
        }));

        container.appendChild(iframe);
        wrapDiv.appendChild(stylesheet);
        wrapDiv.appendChild(container);
        document.body.appendChild(wrapDiv);

        // Wait for DOM to be fully loaded
        document.addEventListener('DOMContentLoaded', function () {
            // Add event listener to the button
            const silasButton = document.getElementById('contact-silas');
            if (silasButton) {
                silasButton.addEventListener('click', function () {
                    // Send message to show HeyGen interface
                    if (iframe.contentWindow) {
                        iframe.contentWindow.postMessage({
                            type: 'streaming-embed',
                            action: 'show'
                        }, host);
                    }
                });
            }
        });
    }(window);
    // State
    let avatarVisible = true;
    let avatarMuted = false;
    let isRecording = false;
    let isPanelExpanded = false;

    // Response templates
    let responses = {
        greeting: [
            "Hello! How can I assist you today?",
            "Hi there! What can I help you with?",
            "Good day! How may I be of service?"
        ],
        help: [
            "I'm here to help! You can ask me questions, request information, or have me perform tasks for you.",
            "I can assist with a variety of tasks. Just let me know what you need help with.",
            "Need assistance? I can answer questions, schedule meetings, fill out forms, and much more."
        ],
        features: [
            "I can answer questions, schedule meetings, fill out forms, translate languages, and much more. What would you like me to help with?",
            "My capabilities include answering questions, managing your schedule, performing tasks, and providing information. How can I assist you today?",
            "I offer various services including information retrieval, task automation, language translation, and more."
        ],
        thanks: [
            "You're welcome! I'm happy to assist anytime.",
            "My pleasure! Feel free to reach out whenever you need help.",
            "Glad I could help! Let me know if you need anything else."
        ],
        default: [
            "I understand your request. Is there anything specific you'd like me to explain or help with?",
            "I've received your message. How would you like me to proceed?",
            "Thanks for your message. Would you like more information on this topic?"
        ]
    };

    // Initialize with greeting message
    addAIMessageToChat(getRandomResponse('greeting'));

    const speechSupported = speechRecognition.init();

    // HeyGen streaming initialization
    initHeyGenStreaming();

    // Event Listeners
    sendButton.addEventListener('click', handleSendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });

    toggleAvatarButton.addEventListener('click', toggleAvatar);
    muteAvatarButton.addEventListener('click', toggleMute);
    voiceButton.addEventListener('click', function () {
        if (speechSupported) {
            isRecording = !isRecording;

            if (isRecording) {
                voiceButton.classList.add('recording');
                avatarStatusText.textContent = 'Listening to you...';
                speechRecognition.startListening();
            } else {
                voiceButton.classList.remove('recording');
                avatarStatusText.textContent = 'AI Assistant is listening...';
                speechRecognition.stopListening();
            }
        } else {
            // Fallback if speech recognition not supported
            alert("Speech recognition is not supported in your browser.");
        }
    });

    togglePanelButton.addEventListener('click', togglePanel);
    clearChatButton.addEventListener('click', clearChat);

    // Task items
    taskItems.forEach(item => {
        item.addEventListener('click', () => handleTaskSelection(item.dataset.task));
    });

    // Functions
    function handleSendMessage() {
        if (!userInput || userInput.value.trim() === '') return;

        const messageText = userInput.value.trim();
        addUserMessageToChat(messageText);

        // Clear input
        userInput.value = '';

        // Process with the new unified function
        processUserInput(messageText);
    }

    // Update your existing function with this unified input processing function
    // Add this to silas.js to handle task processing
    function processUserInput(input) {
        // Try to match input to a task
        let taskMatched = false;
        let taskResponse = null;

        // Check each task type
        if (scheduleTask && scheduleTask.isMatch(input)) {
            taskResponse = scheduleTask.execute(input);
            taskMatched = true;
            highlightTaskPanel('schedule');
        }
        else if (emailTask && emailTask.isMatch(input)) {
            taskResponse = emailTask.execute(input);
            taskMatched = true;
            highlightTaskPanel('email');
        }
        else if (formTask && formTask.isMatch(input)) {
            taskResponse = formTask.execute(input);
            taskMatched = true;
            highlightTaskPanel('form');
        }
        else if (todoTask && todoTask.isMatch(input)) {
            taskResponse = todoTask.execute(input);
            taskMatched = true;
            highlightTaskPanel('task');
        }

        // If we matched a task, process it
        if (taskMatched && taskResponse) {
            // Show typing indicator
            showTypingIndicator();

            // Update avatar status
            setAvatarStatus('processing');

            // Process task and respond
            setTimeout(() => {
                removeTypingIndicator();
                speakWithAvatar(taskResponse);
            }, 1500);

            return true; // Handled as a task
        }

        // If it's not a task, continue with regular message processing
        let aiResponse;
        const lowerText = input.toLowerCase();

        // Simple pattern matching for demo purposes
        if (lowerText.includes("hello") || lowerText.includes("hi") || lowerText.includes("hey")) {
            aiResponse = getRandomResponse('greeting');
        } else if (lowerText.includes("help") || lowerText.includes("assist")) {
            aiResponse = getRandomResponse('help');
        } else if (lowerText.includes("feature") || lowerText.includes("can you do") || lowerText.includes("capabilities")) {
            aiResponse = getRandomResponse('features');
        } else if (lowerText.includes("thank")) {
            aiResponse = getRandomResponse('thanks');
        } else {
            aiResponse = getRandomResponse('default');
        }

        // Show typing indicator
        showTypingIndicator();

        // Update avatar status
        setAvatarStatus('processing');

        // Process message and respond after a delay
        setTimeout(() => {
            removeTypingIndicator();
            speakWithAvatar(aiResponse);
        }, 1500);

        return false; // Not handled as a task
    }

    // Add this function to silas.js to highlight task panel items
    function highlightTaskPanel(taskType) {
        // Find the corresponding task panel item
        const taskItem = document.querySelector(`.task-item[data-task="${taskType}"]`);

        if (taskItem) {
            // Add a highlight class
            taskItem.classList.add('task-executing');

            // Show the task panel if it's not already visible
            if (!isPanelExpanded) {
                togglePanel();
            }

            // Remove highlight after animation completes
            setTimeout(() => {
                taskItem.classList.remove('task-executing');
            }, 3000);
        }
    }

    // Remove the taskExecutionSystem object from silas.js
    // (since its functionality is now in the separate files)
    // Add a function to highlight the task panel
    function highlightTaskPanel(taskType) {
        // Find the corresponding task panel item
        const taskItem = document.querySelector(`.task-item[data-task="${taskType}"]`);

        if (taskItem) {
            // Add a highlight class
            taskItem.classList.add('task-executing');

            // Show the task panel if it's not already visible
            if (!isPanelExpanded) {
                togglePanel();
            }

            // Remove highlight after animation completes
            setTimeout(() => {
                taskItem.classList.remove('task-executing');
            }, 3000);
        }
    }

    function speakWithAvatar(text) {
        // Set avatar to talking state
        setAvatarStatus('talking');

        // Add the AI message to chat
        setTimeout(() => {
            addAIMessageToChat(text);

            // Reset avatar state after "speaking"
            setTimeout(() => {
                setAvatarStatus('listening');
            }, 1000);
        }, 500);
    }

    function addUserMessageToChat(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        const messageP = document.createElement('p');
        messageP.textContent = text;

        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = getCurrentTime();

        contentDiv.appendChild(messageP);
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeDiv);

        messageContainer.appendChild(messageDiv);
        scrollToBottom();
    }

    function addAIMessageToChat(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ai-message';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        const messageP = document.createElement('p');
        messageP.textContent = text;

        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = getCurrentTime();

        contentDiv.appendChild(messageP);
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeDiv);

        messageContainer.appendChild(messageDiv);
        scrollToBottom();
    }

    function showTypingIndicator() {
        const indicatorDiv = document.createElement('div');
        indicatorDiv.className = 'typing-indicator';
        indicatorDiv.id = 'typing-indicator';

        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            indicatorDiv.appendChild(dot);
        }

        messageContainer.appendChild(indicatorDiv);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    function scrollToBottom() {
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }

    function getCurrentTime() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;

        return `${hours}:${minutes} ${ampm}`;
    }

    function getRandomResponse(type) {
        const options = responses[type] || responses.default;
        return options[Math.floor(Math.random() * options.length)];
    }

    function toggleAvatar() {
        avatarVisible = !avatarVisible;
        const streamingEmbed = document.getElementById('heygen-streaming-embed');

        if (avatarVisible) {
            streamingEmbed.classList.remove('hidden');
            toggleAvatarButton.innerHTML = '<i class="fas fa-eye"></i>';
        } else {
            streamingEmbed.classList.add('hidden');
            toggleAvatarButton.innerHTML = '<i class="fas fa-eye-slash"></i>';
        }
    }

    function toggleMute() {
        avatarMuted = !avatarMuted;

        if (avatarMuted) {
            muteAvatarButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            muteAvatarButton.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    }

    function toggleVoiceRecording() {
        isRecording = !isRecording;

        if (isRecording) {
            voiceButton.classList.add('recording');
            avatarStatusText.textContent = 'Listening to you...';
        } else {
            voiceButton.classList.remove('recording');
            avatarStatusText.textContent = 'AI Assistant is listening...';
        }
    }

    function togglePanel() {
        isPanelExpanded = !isPanelExpanded;

        if (isPanelExpanded) {
            taskPanel.classList.add('expanded');
            togglePanelButton.querySelector('i').classList.remove('fa-chevron-right');
            togglePanelButton.querySelector('i').classList.add('fa-chevron-left');
        } else {
            taskPanel.classList.remove('expanded');
            togglePanelButton.querySelector('i').classList.remove('fa-chevron-left');
            togglePanelButton.querySelector('i').classList.add('fa-chevron-right');
        }
    }

    function clearChat() {
        // Clear all messages except the greeting
        while (messageContainer.firstChild) {
            messageContainer.removeChild(messageContainer.firstChild);
        }

        // Add a new greeting
        addAIMessageToChat(getRandomResponse('greeting'));
    }

    function handleTaskSelection(taskType) {
        // Add user message indicating task selection
        let userMessage = "";
        let aiResponse = "";

        switch (taskType) {
            case 'schedule':
                userMessage = "I need to schedule a meeting";
                aiResponse = "I'd be happy to help you schedule a meeting. Could you provide me with the date, time, and participants?";
                break;
            case 'email':
                userMessage = "I need to send an email";
                aiResponse = "I can help you draft an email. Who would you like to send it to, and what's the subject?";
                break;
            case 'form':
                userMessage = "I need to fill out a form";
                aiResponse = "I can assist with filling out forms. Which form do you need help with?";
                break;
            case 'task':
                userMessage = "I need to create a task";
                aiResponse = "I can help you create a task. What would you like to add to your task list?";
                break;
        }

        // Add user's selection as a message
        addUserMessageToChat(userMessage);

        // Show typing indicator
        showTypingIndicator();

        // Update avatar status
        setAvatarStatus('processing');

        // Process task selection and respond
        setTimeout(() => {
            removeTypingIndicator();
            speakWithAvatar(aiResponse);

            // Close the panel on mobile after selection
            if (window.innerWidth <= 768) {
                isPanelExpanded = false;
                taskPanel.classList.remove('expanded');
            }
        }, 1500);
    }

    function setAvatarStatus(status) {
        const statusIndicator = document.getElementById('avatar-status-indicator');
        const statusText = document.getElementById('avatar-status-text');
        const streamingEmbed = document.getElementById('heygen-streaming-embed');

        switch (status) {
            case 'listening':
                statusIndicator.style.backgroundColor = '#4CAF50'; // Green
                statusText.textContent = 'AI Assistant is listening...';
                streamingEmbed.classList.remove('talking');
                break;
            case 'processing':
                statusIndicator.style.backgroundColor = '#FFC107'; // Yellow
                statusText.textContent = 'AI Assistant is thinking...';
                streamingEmbed.classList.remove('talking');
                break;
            case 'talking':
                statusIndicator.style.backgroundColor = '#1e88e5'; // Blue
                statusText.textContent = 'AI Assistant is speaking...';
                streamingEmbed.classList.add('talking');
                break;
            case 'error':
                statusIndicator.style.backgroundColor = '#F44336'; // Red
                statusText.textContent = 'Something went wrong...';
                streamingEmbed.classList.remove('talking');
                break;
        }
    }

    function initHeyGenStreaming() {
        // Create container for HeyGen streaming
        const container = document.getElementById('heygen-ai-container');

        // Create streaming embed
        const streamingEmbed = document.createElement('div');
        streamingEmbed.id = 'heygen-streaming-embed';
        streamingEmbed.className = 'show';

        // Create inner container
        const streamingContainer = document.createElement('div');
        streamingContainer.id = 'heygen-streaming-container';

        // Placeholder for the actual HeyGen avatar iframe
        const placeholderFrame = document.createElement('div');
        placeholderFrame.style.width = '100%';
        placeholderFrame.style.height = '100%';
        placeholderFrame.style.background = 'linear-gradient(135deg, #1e88e5, #0d47a1)'; // Blue gradient
        placeholderFrame.style.borderRadius = '10px';
        placeholderFrame.style.display = 'flex';
        placeholderFrame.style.alignItems = 'center';
        placeholderFrame.style.justifyContent = 'center';

        // Add placeholder text
        const placeholderText = document.createElement('div');
        placeholderText.textContent = 'Myra AI Assistant';
        placeholderText.style.color = 'white';
        placeholderText.style.fontSize = '24px';
        placeholderText.style.fontWeight = 'bold';
        placeholderText.style.textShadow = '0 2px 4px rgba(0,0,0,0.3)';

        // Assemble the component
        placeholderFrame.appendChild(placeholderText);
        streamingContainer.appendChild(placeholderFrame);
        streamingEmbed.appendChild(streamingContainer);
        container.appendChild(streamingEmbed);
    }

    // Check for mobile devices and set initial panel state
    function checkMobileAndAdjustLayout() {
        if (window.innerWidth <= 992) {
            isPanelExpanded = false;
            taskPanel.classList.remove('expanded');
        } else {
            isPanelExpanded = true;
            taskPanel.classList.add('expanded');
        }
    }

    // Initial layout adjustment
    checkMobileAndAdjustLayout();

    // Add resize listener
    window.addEventListener('resize', checkMobileAndAdjustLayout);
});
// Add this to your existing JavaScript file

// Task execution handler system
const taskExecutionSystem = {
    // Task patterns for detection
    patterns: {
        schedule: ['schedule', 'meeting', 'appointment', 'book', 'calendar', 'plan'],
        email: ['email', 'message', 'send', 'write', 'draft', 'compose'],
        form: ['form', 'fill', 'application', 'complete', 'document', 'paperwork'],
        task: ['task', 'todo', 'reminder', 'list', 'note', 'remember']
    },

    // Detect task type from input
    detectTask(input) {
        const text = input.toLowerCase();

        // Check for each task type
        for (const [taskType, keywords] of Object.entries(this.patterns)) {
            for (const keyword of keywords) {
                if (text.includes(keyword)) {
                    return taskType;
                }
            }
        }

        return null; // No task detected
    },

    // Execute the appropriate task
    executeTask(taskType, input) {
        switch (taskType) {
            case 'schedule':
                return this.handleScheduleTask(input);
            case 'email':
                return this.handleEmailTask(input);
            case 'form':
                return this.handleFormTask(input);
            case 'task':
                return this.handleTodoTask(input);
            default:
                return null;
        }
    },

    // Task-specific handlers
    handleScheduleTask(input) {
        // Extract date, time, and participant details
        const datePattern = /(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}(?:st|nd|rd|th)? of [a-z]+|tomorrow|today|next [a-z]+day)/i;
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
    },

    handleEmailTask(input) {
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
    },

    handleFormTask(input) {
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
    },

    handleTodoTask(input) {
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
// Add this to your existing JavaScript file

// Voice recognition setup
const speechRecognition = {
    recognition: null,
    isListening: false,

    init() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            // Create speech recognition instance
            this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

            // Configure
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            // Set up event handlers
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                console.log('Voice input:', transcript);

                // Stop recording visual indicator
                voiceButton.classList.remove('recording');
                isRecording = false;

                // Add user message to chat
                addUserMessageToChat(transcript);

                // Process the voice input
                processUserInput(transcript);
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                voiceButton.classList.remove('recording');
                isRecording = false;
                setAvatarStatus('error');
                setTimeout(() => setAvatarStatus('listening'), 2000);
            };

            this.recognition.onend = () => {
                this.isListening = false;
                voiceButton.classList.remove('recording');
            };

            return true;
        } else {
            console.error('Speech recognition not supported');
            return false;
        }
    },

    startListening() {
        if (this.recognition) {
            try {
                this.recognition.start();
                this.isListening = true;
                setAvatarStatus('listening');
                return true;
            } catch (error) {
                console.error('Error starting speech recognition:', error);
                return false;
            }
        }
        return false;
    },

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            return true;
        }
        return false;
    },

    toggle() {
        return this.isListening ? this.stopListening() : this.startListening();
    }
};