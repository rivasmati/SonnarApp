// main.js
const loadingScreen = document.getElementById('loading-screen');
const instructions = document.getElementById('instructions');
const startButton = document.getElementById('start-button');
const arContainer = document.getElementById('ar-container');
const statusIndicator = document.getElementById('status-indicator');
const statusText = document.getElementById('status-text');
const splashScreen = document.getElementById('splash-screen');
const mainContent = document.getElementById('main-content');
const albumCards = document.querySelectorAll('.album-card');

const audioPlayer1 = document.getElementById('audio-player1');
const audioPlayer2 = document.getElementById('audio-player2');
const audioPlayer3 = document.getElementById('audio-player3');
const audioPlayer4 = document.getElementById('audio-player4');
const audioPlayer5 = document.getElementById('audio-player5');
const audioPlayer6 = document.getElementById('audio-player6');

let isAudioPlaying = false;
let markerVisible = false;
let arInitialized = false;
let markerImage1, markerImage2, markerImage3, markerImage4, markerImage5, markerImage6;

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
    markerImage1 = document.getElementById("marker-image1");
    markerImage2 = document.getElementById("marker-image2");
    markerImage3 = document.getElementById("marker-image3");
    markerImage4 = document.getElementById("marker-image4");
    markerImage5 = document.getElementById("marker-image5");
    markerImage6 = document.getElementById("marker-image6");
    
    // Obtener referencias a los marcadores
    const hiroMarker1 = document.getElementById('hiro-marker1');
    const hiroMarker2 = document.getElementById('hiro-marker2');
    const hiroMarker3 = document.getElementById('hiro-marker3');
    const hiroMarker4= document.getElementById('hiro-marker4');
    const hiroMarker5= document.getElementById('hiro-marker5');
    const hiroMarker6 = document.getElementById('hiro-marker6');
    
    // Verificar que los elementos existen
    console.log("Marker Image 1:", markerImage1);
    console.log("Marker Image 2:", markerImage2);
    console.log("Marker Image 3:", markerImage3);
    console.log("Marker Image 4:", markerImage4);
    console.log("Marker Image 5:", markerImage5);
    console.log("Marker Image 6:", markerImage6);
    console.log("Hiro Marker 1:", hiroMarker1);
    console.log("Hiro Marker 2:", hiroMarker2);
    console.log("Hiro Marker 3:", hiroMarker3);
    console.log("Hiro Marker 4:", hiroMarker4);
    console.log("Hiro Marker 5:", hiroMarker5);
    console.log("Hiro Marker 6:", hiroMarker6);
    
    // Asegurarse de que las imágenes estén inicialmente ocultas
    if (markerImage1) markerImage1.setAttribute("visible", "false");
    if (markerImage2) markerImage2.setAttribute("visible", "false");
    if (markerImage3) markerImage3.setAttribute("visible", "false");
    if (markerImage4) markerImage4.setAttribute("visible", "false");
    if (markerImage5) markerImage5.setAttribute("visible", "false");
    if (markerImage6) markerImage6.setAttribute("visible", "false");

    // Configurar eventos para el primer marcador
    if (hiroMarker1) {
        hiroMarker1.addEventListener("markerFound", () => {
            console.log("Marcador 1 encontrado");
            handleMarkerFound(markerImage1, audioPlayer1);
        });
        
        hiroMarker1.addEventListener("markerLost", () => {
            console.log("Marcador 1 perdido");
            handleMarkerLost(markerImage1, audioPlayer1);
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
    
    // Configurar eventos para el tercer marcador
    if (hiroMarker3) {
        hiroMarker3.addEventListener("markerFound", () => {
            console.log("Marcador 3 encontrado");
            handleMarkerFound(markerImage3, audioPlayer3);
        });
        
        hiroMarker3.addEventListener("markerLost", () => {
            console.log("Marcador 3 perdido");
            handleMarkerLost(markerImage3, audioPlayer3);
        });
    }
    
    // Configurar eventos para el cuarto marcador
    if (hiroMarker4) {
        hiroMarker4.addEventListener("markerFound", () => {
            console.log("Marcador 4 encontrado");
            handleMarkerFound(markerImage4, audioPlayer4);
        });
        
        hiroMarker4.addEventListener("markerLost", () => {
            console.log("Marcador 4 perdido");
            handleMarkerLost(markerImage4, audioPlayer4);
        });
    }
    
    // Configurar eventos para el quinto marcador
    if (hiroMarker5) {
        hiroMarker5.addEventListener("markerFound", () => {
            console.log("Marcador 5 encontrado");
            handleMarkerFound(markerImage5, audioPlayer5);
        });
        
        hiroMarker5.addEventListener("markerLost", () => {
            console.log("Marcador 5 perdido");
            handleMarkerLost(markerImage5, audioPlayer5);
        });
    }
    
    // Configurar eventos para el sexto marcador
    if (hiroMarker6) {
        hiroMarker6.addEventListener("markerFound", () => {
            console.log("Marcador 6 encontrado");
            handleMarkerFound(markerImage6, audioPlayer6);
        });
        
        hiroMarker6.addEventListener("markerLost", () => {
            console.log("Marcador 6 perdido");
            handleMarkerLost(markerImage6, audioPlayer6);
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
                //showPlayButton(element);
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

/*
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
    */

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pausar audio cuando la app está en segundo plano
        if (audioPlayer1) pauseAudio(audioPlayer1);
        if (audioPlayer2) pauseAudio(audioPlayer2);
        if (audioPlayer3) pauseAudio(audioPlayer3);
        if (audioPlayer4) pauseAudio(audioPlayer4);
        if (audioPlayer5) pauseAudio(audioPlayer5);
        if (audioPlayer6) pauseAudio(audioPlayer6);
    } else if (arInitialized && markerVisible) {
        // Reanudar audio si el marcador es visible al volver a la app
        if (markerImage1 && markerImage1.getAttribute('visible') === 'true') {
            playAudio(audioPlayer1);
        }
        if (markerImage2 && markerImage2.getAttribute('visible') === 'true') {
            playAudio(audioPlayer2);
        }
        if (markerImage3 && markerImage3.getAttribute('visible') === 'true') {
            playAudio(audioPlayer3);
        }
        if (markerImage4 && markerImage4.getAttribute('visible') === 'true') {
            playAudio(audioPlayer4);
        }
        if (markerImage5 && markerImage5.getAttribute('visible') === 'true') {
            playAudio(audioPlayer5);
        }
        if (markerImage6 && markerImage6.getAttribute('visible') === 'true') {
            playAudio(audioPlayer6);
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