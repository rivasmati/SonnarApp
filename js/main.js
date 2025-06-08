// main.js
const loadingScreen = document.getElementById('loading-screen');
const instructions = document.getElementById('instructions');
const startButton = document.getElementById('start-button');
const arContainer = document.getElementById('ar-container');
const audioPlayer = document.getElementById('audio-player');
const statusIndicator = document.getElementById('status-indicator');
const statusText = document.getElementById('status-text');
const splashScreen = document.getElementById('splash-screen');
const mainContent = document.getElementById('main-content');
const albumCards = document.querySelectorAll('.album-card');

let isAudioPlaying = false;
let markerVisible = false;
let arInitialized = false;
let markerImage, markerImage2;

// Force full height on mobile browsers
function setFullHeight() {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}

window.addEventListener('resize', setFullHeight);
window.addEventListener('orientationchange', setFullHeight);
setFullHeight();

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
    // Inicialmente oculto, se mostrará cuando se inicie la experiencia AR
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

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(() => {
            instructions.classList.add('d-none');
            arContainer.style.display = 'block';
            statusIndicator.classList.remove('d-none');
            
            const scene = document.querySelector('a-scene');
            if (scene.hasLoaded) {
                setupAR();
                updateARViewport();
            }
            else scene.addEventListener('loaded', () => {
                setupAR();
                updateARViewport();
            });
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
    
    // Obtener referencias a los elementos de imagen
    markerImage = document.getElementById("marker-image");
    markerImage2 = document.getElementById("marker-image2");
    
    // Obtener referencias a los marcadores
    const hiroMarker = document.getElementById('hiro-marker');
    const hiroMarker2 = document.getElementById('hiro-marker2');
    
    // Verificar que los elementos existen
    console.log("Marker Image 1:", markerImage);
    console.log("Marker Image 2:", markerImage2);
    console.log("Hiro Marker 1:", hiroMarker);
    console.log("Hiro Marker 2:", hiroMarker2);
    
    // Asegurarse de que las imágenes estén inicialmente ocultas
    if (markerImage) markerImage.setAttribute("visible", "false");
    if (markerImage2) markerImage2.setAttribute("visible", "false");

    // Configurar eventos para el primer marcador
    if (hiroMarker) {
        hiroMarker.addEventListener("markerFound", () => {
            console.log("Marcador 1 encontrado");
            handleMarkerFound(markerImage, audioPlayer);
        });
        
        hiroMarker.addEventListener("markerLost", () => {
            console.log("Marcador 1 perdido");
            handleMarkerLost(markerImage, audioPlayer);
        });
    }
    
    // Configurar eventos para el segundo marcador
    if (hiroMarker2) {
        hiroMarker2.addEventListener("markerFound", () => {
            console.log("Marcador 2 encontrado");
            handleMarkerFound(markerImage2, audioPlayer2);
        });
        
        hiroMarker2.addEventListener("markerLost", () => {
            console.log("Marcador 2 perdido");
            handleMarkerLost(markerImage2, audioPlayer2);
        });
    }
}

function handleMarkerFound(imageElement, audioElement) {
    markerVisible = true;
    updateStatus(true, "Marcador detectado");
    
    // Mostrar la imagen
    if (imageElement) {
        console.log("Mostrando imagen:", imageElement.getAttribute("src"));
        imageElement.setAttribute("visible", "true");
    }
    
    // Reproducir audio
    if (!isAudioPlaying) {
        playAudio(audioElement);
    }
}

function handleMarkerLost(imageElement, audioElement) {
    markerVisible = false;
    updateStatus(false, "Buscando...");
    
    // Ocultar la imagen
    if (imageElement) {
        console.log("Ocultando imagen:", imageElement.getAttribute("src"));
        imageElement.setAttribute("visible", "false");
    }
    
    // Pausar audio
    pauseAudio(audioElement);
}

function playAudio(element) {
    if (element) {
        element.play()
            .then(() => { 
                isAudioPlaying = true;
                console.log("Audio reproduciendo");
            })
            .catch(err => {
                console.error("Error al reproducir audio:", err);
                showPlayButton(element);
            });
    }
}

function pauseAudio(element) {
    if (element) {
        element.pause();
        isAudioPlaying = false;
        console.log("Audio pausado");
    }
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
        // Pausar audio cuando la app está en segundo plano
        if (audioPlayer) pauseAudio(audioPlayer);
        if (audioPlayer2) pauseAudio(audioPlayer2);
    } else if (arInitialized && markerVisible) {
        // Reanudar audio si el marcador es visible al volver a la app
        if (markerImage && markerImage.getAttribute('visible') === 'true') {
            playAudio(audioPlayer);
        }
        if (markerImage2 && markerImage2.getAttribute('visible') === 'true') {
            playAudio(audioPlayer2);
        }
    }
});

// Función para actualizar el viewport de AR
function updateARViewport() {
    const scene = document.querySelector('a-scene');
    if (scene) {
        const canvas = scene.canvas;
        if (canvas) {
            // Configurar dimensiones del canvas para que coincida con el viewport
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.objectFit = 'cover';
            
            // Forzar a AR.js a recalcular la proyección de la cámara
            if (scene.camera && scene.camera.updateProjectionMatrix) {
                scene.camera.aspect = window.innerWidth / window.innerHeight;
                scene.camera.updateProjectionMatrix();
            }
        }
    }
}

// Añadir listener para el evento resize
window.addEventListener('resize', updateARViewport);