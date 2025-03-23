// profile.js

// DOM Elements
const userNameElement = document.getElementById('userName');
const displayNameInput = document.getElementById('displayName');
const preferredLanguageSelect = document.getElementById('preferredLanguage');
const themeButtons = document.querySelectorAll('.theme-btn');
const recordVoiceBtn = document.getElementById('recordVoiceBtn');
const recordVoiceModal = document.getElementById('recordVoiceModal');
const audioFileInput = document.getElementById('audioFileInput'); // New input for file upload
const saveVoiceBtn = document.querySelector('.save-btn');
const cancelBtn = document.querySelector('.cancel-btn');
const voiceSamplesContainer = document.querySelector('.voice-samples');
const saveChangesBtn = document.querySelector('.save-changes-btn');

// Event Listeners

// Update User Name
userNameElement.textContent = displayNameInput.value;

// Display Name Change
displayNameInput.addEventListener('input', () => {
    userNameElement.textContent = displayNameInput.value;
});

// Preferred Language Change
preferredLanguageSelect.addEventListener('change', (event) => {
    console.log(`Preferred language changed to: ${event.target.value}`);
});

// Theme Change
themeButtons.forEach(button => {
    button.addEventListener('click', () => {
        themeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        document.body.setAttribute('data-theme', button.getAttribute('data-theme'));
    });
});

// Record New Voice Button
recordVoiceBtn.addEventListener('click', () => {
    recordVoiceModal.style.display = 'block';
});

// Close Modal
document.querySelector('.close-modal').addEventListener('click', () => {
    recordVoiceModal.style.display = 'none';
});

// Handle Audio File Upload
audioFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const audioUrl = URL.createObjectURL(file);

        // Create a new voice sample card
        const voiceSampleCard = document.createElement('div');
        voiceSampleCard.classList.add('voice-sample-card');
        voiceSampleCard.innerHTML = `
            <div class="voice-sample-header">
                <span>${file.name}</span>
                <div class="voice-controls">
                    <button class="voice-play-btn" onclick="playVoice('${audioUrl}')">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="voice-delete-btn" onclick="deleteVoice(this)">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="voice-waveform">
                <div class="waveform-placeholder"></div>
            </div>
        `;
        voiceSamplesContainer.appendChild(voiceSampleCard);

        // Reset the file input
        audioFileInput.value = '';
    }
});

// Save Voice
saveVoiceBtn.addEventListener('click', () => {
    recordVoiceModal.style.display = 'none';
});

// Cancel Modal
cancelBtn.addEventListener('click', () => {
    recordVoiceModal.style.display = 'none';
});

// Save Changes Button
saveChangesBtn.addEventListener('click', () => {
    const displayName = displayNameInput.value;
    const preferredLanguage = preferredLanguageSelect.value;
    const theme = document.body.getAttribute('data-theme');

    console.log(`Changes saved: Display Name: ${displayName}, Preferred Language: ${preferredLanguage}, Theme: ${theme}`);
});

// Functions to play and delete voice samples
function playVoice(url) {
    const audio = new Audio(url);
    audio.play();
}

function deleteVoice(button) {
    const voiceSampleCard = button.closest('.voice-sample-card');
    voiceSampleCard.remove();
}