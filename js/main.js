// main.js
const loadingScreen = document.getElementById('loading-screen');
const instructions = document.getElementById('instructions');
const startButton = document.getElementById('start-button');
const arContainer = document.getElementById('ar-container');
const audioPlayer = document.getElementById('audio-player');
const statusIndicator = document.getElementById('status-indicator');
const statusText = document.getElementById('status-text');
const hiroMarker = document.getElementById('hiro-marker');
const hiroMarker2 = document.getElementById('hiro-marker2');
const audioPlayer2 = document.getElementById('audio-player2');
const splashScreen = document.getElementById('splash-screen');
const mainContent = document.getElementById('main-content');
const albumCards = document.querySelectorAll('.album-card');

let isAudioPlaying = false;
let markerVisible = false;
let arInitialized = false;
let markerImage, markerImage2;

document.addEventListener('DOMContentLoaded', () => {
    // Reiniciar animaciones
    const logos = document.querySelectorAll('.rotating-logo, .rotating-logo-back');
    logos.forEach(logo => {
        logo.style.animation = 'none';
        void logo.offsetWidth;
        logo.style.animation = null;
    });

    setTimeout(() => {
        splashScreen.classList.add('splash-fade-out');
        setTimeout(() => {
            splashScreen.style.display = 'none';
            mainContent.classList.remove('d-none');
            initializeApp();
        }, 1000);
    }, 3000);
});

function initializeApp() {
    arContainer.style.display = 'none';
    
    albumCards.forEach(card => {
        card.addEventListener('click', function() {
            albumCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    if (!navigator.mediaDevices?.getUserMedia) {
        showError('Acceso a cámara no soportado');
        return;
    }

    setTimeout(() => {
        loadingScreen.classList.add('d-none');
        instructions.classList.remove('d-none');
    }, 1500);

    startButton.addEventListener('click', startARExperience);
}

function startARExperience() {
    startButton.classList.add('disabled');
    startButton.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Iniciando...';

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => {
            instructions.classList.add('d-none');
            arContainer.style.display = 'block';
            statusIndicator.classList.remove('d-none');
            
            const scene = document.querySelector('a-scene');
            if (scene.hasLoaded) setupAR();
            else scene.addEventListener('loaded', setupAR);
        })
        .catch(err => {
            console.error("Error cámara:", err);
            showError("Permiso de cámara requerido");
            startButton.classList.remove('disabled');
            startButton.innerHTML = 'Comenzar Experiencia';
        });
}

function setupAR() {
    arInitialized = true;
    
    markerImage = document.getElementById("marker-image");
    markerImage2 = document.getElementById("marker-image2");
    
    [markerImage, markerImage2].forEach(img => {
        if(img) img.setAttribute("visible", "false");
    });

    hiroMarker.addEventListener("markerFound", () => handleMarkerFound(markerImage, audioPlayer));
    hiroMarker.addEventListener("markerLost", () => handleMarkerLost(markerImage, audioPlayer));
    
    hiroMarker2.addEventListener("markerFound", () => handleMarkerFound(markerImage2, audioPlayer2));
    hiroMarker2.addEventListener("markerLost", () => handleMarkerLost(markerImage2, audioPlayer2));
}

function handleMarkerFound(imageElement, audioElement) {
    markerVisible = true;
    updateStatus(true, "Marcador detectado");
    if(imageElement) imageElement.setAttribute("visible", "true");
    if(!isAudioPlaying) playAudio(audioElement);
}

function handleMarkerLost(imageElement, audioElement) {
    markerVisible = false;
    updateStatus(false, "Buscando...");
    if(imageElement) imageElement.setAttribute("visible", "false");
    pauseAudio(audioElement);
}

function playAudio(element) {
    element.play()
        .then(() => { isAudioPlaying = true; })
        .catch(err => showPlayButton(element));
}

function pauseAudio(element) {
    element.pause();
    isAudioPlaying = false;
}

function updateStatus(active, message) {
    statusIndicator.classList.toggle('status-active', active);
    statusText.textContent = message;
}

function showError(message) {
    loadingScreen.innerHTML = `
        <div class="alert alert-dark border-neon text-center">
            <h4 class="text-neon">¡ERROR!</h4>
            <p class="text-light">${message}</p>
        </div>
    `;
}

function showPlayButton(audioElement) {
    const container = document.createElement('div');
    container.className = 'position-fixed bottom-0 start-0 w-100 p-3 text-center';
    
    const button = document.createElement('button');
    button.className = 'btn btn-neon';
    button.innerHTML = '<span class="blink">▶</span> Reproducir';
    button.onclick = () => audioElement.play().finally(() => container.remove());
    
    container.appendChild(button);
    document.body.appendChild(container);
}

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        [audioPlayer, audioPlayer2].forEach(pauseAudio);
    } else if (arInitialized && markerVisible) {
        [markerImage, markerImage2].forEach((img, i) => {
            if(img?.getAttribute('visible') === 'true') playAudio(i === 0 ? audioPlayer : audioPlayer2);
        });
    }
});