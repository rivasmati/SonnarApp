// DOM Elements
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

// Application state
let isAudioPlaying = false;
let markerVisible = false;
let arInitialized = false;

let markerImage;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Check if browser supports getUserMedia (camera access)
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showError('Tu navegador no soporta acceso a la cámara. Por favor, intenta con otro navegador.');
        return;
    }

    // Show instructions after loading
    setTimeout(() => {
        loadingScreen.classList.add('d-none');
        instructions.classList.remove('d-none');
    }, 1500);

    // Start button click handler
    startButton.addEventListener('click', initializeAR);
});

// Initialize AR experience
function initializeAR() {
    instructions.classList.add('d-none');
    arContainer.classList.remove('d-none');
    statusIndicator.classList.remove('d-none');
    
    // Set up marker detection events once AR.js is initialized
    // We need to wait for the scene to load
    const scene = document.querySelector('a-scene');
    
    if (scene.hasLoaded) {
        setupMarkerEvents();
    } else {
        scene.addEventListener('loaded', setupMarkerEvents);
    }
}

function setupMarkerEvents() {
    arInitialized = true
  
    // Get reference to the marker image
    markerImage = document.getElementById("marker-image")
    markerImage2 = document.getElementById("marker-image2")
  
    // Initially hide the image (optional)
    if (markerImage) {
      markerImage.setAttribute("visible", "false")
    }
  
    // When marker is found
    hiroMarker.addEventListener("markerFound", () => {
      console.log("Marker found!")
      markerVisible = true
      updateStatus(true, "Marcador detectado")
  
      // Show the image
      if (markerImage) {
        markerImage.setAttribute("visible", "true")
      }
  
      // Play audio if not already playing
      if (!isAudioPlaying) {
        playAudio()
      }
    })
  
    // When marker is lost
    hiroMarker.addEventListener("markerLost", () => {
      console.log("Marker lost!")
      markerVisible = false
      updateStatus(false, "Buscando marcador...")
  
      // Hide the image
      if (markerImage) {
        markerImage.setAttribute("visible", "false")
      }
  
      // Pause audio when marker is lost
      pauseAudio()
    })




    //PARTE 2 ELIMINAR
    // When marker is found
    hiroMarker2.addEventListener("markerFound", () => {
      console.log("Marker found!")
      markerVisible = true
      updateStatus(true, "Marcador detectado")
  
      // Show the image
      if (markerImage) {
        markerImage.setAttribute("visible", "true")
      }
  
      // Play audio if not already playing
      if (!isAudioPlaying) {
        playAudio2()
      }
    })
  
    // When marker is lost
    hiroMarker2.addEventListener("markerLost", () => {
      console.log("Marker lost!")
      markerVisible = false
      updateStatus(false, "Buscando marcador...")
  
      // Hide the image
      if (markerImage) {
        markerImage.setAttribute("visible", "false")
      }
  
      // Pause audio when marker is lost
      pauseAudio2()
    })
}

// Play audio function
function playAudio() {
    audioPlayer.play()
        .then(() => {
            isAudioPlaying = true;
            console.log('Audio playing');
        })
        .catch(error => {
            console.error('Error playing audio:', error);
            // On mobile, autoplay might be blocked, so we need user interaction
            showPlayButton();
        });
}

// Pause audio function
function pauseAudio() {
    audioPlayer.pause();
    isAudioPlaying = false;
    console.log('Audio paused');
}


//PARTE 2 BORRAR
// Play audio function
function playAudio2() {
    audioPlayer2.play()
        .then(() => {
            isAudioPlaying = true;
            console.log('Audio playing');
        })
        .catch(error => {
            console.error('Error playing audio:', error);
            // On mobile, autoplay might be blocked, so we need user interaction
            showPlayButton();
        });
}

// Pause audio function
function pauseAudio2() {
    audioPlayer2.pause();
    isAudioPlaying = false;
    console.log('Audio paused');
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
function showPlayButton() {
    const playButtonContainer = document.createElement('div');
    playButtonContainer.id = 'play-button-container';
    playButtonContainer.className = 'position-fixed bottom-0 start-0 w-100 p-3 text-center';
    playButtonContainer.style.zIndex = '1000';
    
    const playButton = document.createElement('button');
    playButton.className = 'btn btn-lg btn-primary';
    playButton.textContent = 'Reproducir Audio';
    playButton.addEventListener('click', () => {
        playAudio();
        playButtonContainer.remove();
    });
    
    playButtonContainer.appendChild(playButton);
    document.body.appendChild(playButtonContainer);
}

// Handle visibility changes (when user switches tabs or apps)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause audio when app is in background
        pauseAudio();
    } else if (arInitialized && markerVisible) {
        // Resume audio if marker is visible when returning to app
        playAudio();
    }
});
