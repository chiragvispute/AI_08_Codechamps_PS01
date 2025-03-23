document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const avatarStatusText = document.getElementById('avatar-status-text');
    const toggleAvatarButton = document.getElementById('toggle-avatar');
    const muteAvatarButton = document.getElementById('mute-avatar');

    // HeyGen streaming initialization
    !function (window) {
        const host = "https://labs.heygen.com",
            url = host + "/guest/streaming-embed?share=eyJxdWFsaXR5IjoiaGlnaCIsImF2YXRhck5hbWUiOiJTaWxhc19DdXN0b21lclN1cHBvcnRfcHVi%0D%0AbGljIiwicHJldmlld0ltZyI6Imh0dHBzOi8vZmlsZXMyLmhleWdlbi5haS9hdmF0YXIvdjMvYTFl%0D%0AZDhjNzFlNGJmNGU2Y2I5MDcxZDJiN2NkNzFlNGVfNDU2NjAvcHJldmlld190YWxrXzEud2VicCIs%0D%0AIm5lZWRSZW1vdmVCYWNrZ3JvdW5kIjpmYWxzZSwia25vd2xlZGdlQmFzZUlkIjoiNzdkMmYwYTYx%0D%0AYWIxNGExYzgxYWFmNDBkM2EwNmUzNjYiLCJ1c2VybmFtZSI6IjJhOGUyYjQyZTZmODRkNjQ4ODVj%0D%0AMDVlNjdiZWUwN2IyIn0%3D&inIFrame=1",
            wrapDiv = document.createElement("div");
        wrapDiv.id = "heygen-streaming-embed";
        const container = document.createElement("div");
        container.id = "heygen-streaming-container";

        const stylesheet = document.createElement("style");
        stylesheet.innerHTML = `
            #heygen-streaming-embed {
                z-index: 9999;
                position: fixed;
                top: 50%;
                left: 50%; /* Center horizontally */
                transform: translate(-50%, -50%); /* Center both vertically and horizontally */
                width: 600px; /* Fixed width for rectangular shape */
                height: 500px; /* Taller than width for rectangular shape */
                border-radius: 10px; /* Slight rounding on corners */
                border: 2px solid #007bff; /* Blue border to match your site theme */
                box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.12);
                overflow: hidden;
                background-color: #fff;
                opacity: 0;
                visibility: hidden;
            }
            #heygen-streaming-embed.show {
                opacity: 1;
                visibility: visible;
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
                        "hide" === e.data.action && (visible = !1, wrapDiv.classList.toggle("expand", visible)))
        })),

            container.appendChild(iframe),
            wrapDiv.appendChild(stylesheet), wrapDiv.appendChild(container), document.body.appendChild(wrapDiv)
    }(globalThis);

    // State
    let avatarVisible = true;
    let avatarMuted = false;

    // Event Listeners
    toggleAvatarButton.addEventListener('click', toggleAvatar);
    muteAvatarButton.addEventListener('click', toggleMute);

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
});