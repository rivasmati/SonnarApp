// DOM Elements
const albumCards = document.querySelectorAll('.album-card');
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

// Application state
let isAudioPlaying = false;
let markerVisible = false;
let arInitialized = false;
let markerImage;
let markerImage2;

// Initialize the application with splash screen
document.addEventListener('DOMContentLoaded', () => {
    // First show splash screen for 2 seconds
    setTimeout(() => {
        splashScreen.classList.add('splash-fade-out');
        
        // After fade out animation completes
        setTimeout(() => {
            splashScreen.style.display = 'none';
            mainContent.classList.remove('d-none');
            
            // Now initialize the rest of the app
            initializeApp();
        }, 800); // Match this with CSS fadeOut duration
    }, 2000); // Splash screen display time (2000ms = 2 segundos)
});

function initializeApp() {
    // [NUEVO] Ocultar completamente el contenedor AR
    arContainer.style.display = 'none';
    arContainer.style.visibility = 'hidden';
    albumCards.forEach(card => {
    card.addEventListener('click', function() {
        // Remover selección previa
        albumCards.forEach(c => c.classList.remove('selected'));
        
        // Seleccionar este álbum
        this.classList.add('selected');
        
        // Aquí puedes añadir lógica para cargar el marcador específico
        const albumTitle = this.querySelector('.album-title').textContent;
        console.log(`Álbum seleccionado: ${albumTitle}`);
    });
});
    
    // [EXISTENTE] Verificar soporte de cámara
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showError('Tu navegador no soporta acceso a la cámara. Por favor, intenta con otro navegador.');
        return;
    }

    // [EXISTENTE] Mostrar instrucciones después de carga
    setTimeout(() => {
        loadingScreen.classList.add('d-none');
        instructions.classList.remove('d-none');
    }, 1500);

    // [EXISTENTE] Manejador del botón "Comenzar"
    startButton.addEventListener('click', initializeAR);
}

// Initialize AR experience
function initializeAR() {
    instructions.classList.add('d-none');
    arContainer.classList.remove('d-none');
    statusIndicator.classList.remove('d-none');
    
    // Set up marker detection events once AR.js is initialized
    const scene = document.querySelector('a-scene');
    
    if (scene.hasLoaded) {
        setupMarkerEvents();
    } else {
        scene.addEventListener('loaded', setupMarkerEvents);
    }
}

function setupMarkerEvents() {
    arInitialized = true;
  
    // Get reference to the marker images
    markerImage = document.getElementById("marker-image");
    markerImage2 = document.getElementById("marker-image2");
  
    // Initially hide the images
    if (markerImage) {
        markerImage.setAttribute("visible", "false");
    }
    if (markerImage2) {
        markerImage2.setAttribute("visible", "false");
    }
  
    // First marker events
    hiroMarker.addEventListener("markerFound", () => {
        console.log("Marker 1 found!");
        markerVisible = true;
        updateStatus(true, "Marcador detectado");
  
        if (markerImage) {
            markerImage.setAttribute("visible", "true");
        }
  
        if (!isAudioPlaying) {
            playAudio();
        }
    });
  
    hiroMarker.addEventListener("markerLost", () => {
        console.log("Marker 1 lost!");
        markerVisible = false;
        updateStatus(false, "Buscando marcador...");
  
        if (markerImage) {
            markerImage.setAttribute("visible", "false");
        }
  
        pauseAudio();
    });

    // Second marker events
    hiroMarker2.addEventListener("markerFound", () => {
        console.log("Marker 2 found!");
        markerVisible = true;
        updateStatus(true, "Marcador detectado");
  
        if (markerImage2) {
            markerImage2.setAttribute("visible", "true");
        }
  
        if (!isAudioPlaying) {
            playAudio2();
        }
    });
  
    hiroMarker2.addEventListener("markerLost", () => {
        console.log("Marker 2 lost!");
        markerVisible = false;
        updateStatus(false, "Buscando marcador...");
  
        if (markerImage2) {
            markerImage2.setAttribute("visible", "false");
        }
  
        pauseAudio2();
    });
}

// Audio functions for first marker
function playAudio() {
    audioPlayer.play()
        .then(() => {
            isAudioPlaying = true;
            console.log('Audio 1 playing');
        })
        .catch(error => {
            console.error('Error playing audio 1:', error);
            showPlayButton(audioPlayer);
        });
}

function pauseAudio() {
    audioPlayer.pause();
    isAudioPlaying = false;
    console.log('Audio 1 paused');
}

// Audio functions for second marker
function playAudio2() {
    audioPlayer2.play()
        .then(() => {
            isAudioPlaying = true;
            console.log('Audio 2 playing');
        })
        .catch(error => {
            console.error('Error playing audio 2:', error);
            showPlayButton(audioPlayer2);
        });
}

function pauseAudio2() {
    audioPlayer2.pause();
    isAudioPlaying = false;
    console.log('Audio 2 paused');
}

// Update status indicator
function updateStatus(active, message) {
    if (active) {
        statusIndicator.classList.add('status-active');
    } else {
        statusIndicator.classList.remove('status-active');
    }
    
    statusText.textContent = message;
}

// Show error message
function showError(message) {
    loadingScreen.innerHTML = `
        <div class="alert alert-danger" role="alert">
            <h4>Error</h4>
            <p>${message}</p>
        </div>
    `;
}

// Show play button for mobile devices that block autoplay
function showPlayButton(audioElement) {
    const playButtonContainer = document.createElement('div');
    playButtonContainer.id = 'play-button-container';
    playButtonContainer.className = 'position-fixed bottom-0 start-0 w-100 p-3 text-center';
    playButtonContainer.style.zIndex = '1000';
    
    const playButton = document.createElement('button');
    playButton.className = 'btn btn-lg btn-primary';
    playButton.textContent = 'Reproducir Audio';
    playButton.addEventListener('click', () => {
        audioElement.play()
            .then(() => playButtonContainer.remove())
            .catch(e => console.error('Still cannot play:', e));
    });
    
    playButtonContainer.appendChild(playButton);
    document.body.appendChild(playButtonContainer);
}

// Handle visibility changes (when user switches tabs or apps)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause audio when app is in background
        pauseAudio();
        pauseAudio2();
    } else if (arInitialized && markerVisible) {
        // Resume audio if marker is visible when returning to app
        // Need to check which marker is visible
        if (markerImage && markerImage.getAttribute('visible') === 'true') {
            playAudio();
        } else if (markerImage2 && markerImage2.getAttribute('visible') === 'true') {
            playAudio2();
        }
    }
});