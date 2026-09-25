const audio = document.getElementById('audio');
const player = document.querySelector('.player');
const songsImgContainer = document.querySelector('.songs-img-container');
const songInfo = document.querySelector('.song-info');
const actionBar = document.querySelector('.action-bar');
const actionBarItems = document.querySelectorAll('.action-bar-item');
const songProgress = document.querySelector('.song-progress');
const songProgressBar = document.querySelector('.song-progress-bar');
const timeContainer = document.querySelector('.time-container');
const songProgressTime = document.querySelector('.song-progress-time');
const songProgressTimeEnd = document.querySelector('.song-progress-time-end');

const songControls = document.querySelector('.song-controls');
const repeat = document.querySelector('.song-control-repeat');
const prev = document.querySelector('.song-control-prev');
const playPause = document.querySelector('.song-control-play-pause');
const next = document.querySelector('.song-control-next');
const volume = document.querySelector('.song-control-volume');
const volumeSlider = document.querySelector('.volume-slider');

const controlsIcons = document.querySelectorAll('.controls-icon');

const tracks = {
    'alec_koff-carnaval': {
        name: 'Carnaval',
        artist: 'Alec Koff',
        src: './assets/music/alec_koff-carnaval.mp3',
        img: './assets/songsImg/phonk.jpg'
    },

    "alexguz-funk-amp-breakbeat": {
        name: 'Funk & Breakbeat',
        artist: 'Alex Guz',
        src: './assets/music/alexguz-funk-amp-breakbeat.mp3',
        img: './assets/songsImg/funk.jpg'
    }
};

const trackKeys = Object.keys(tracks);
let currentIndex = 0;
let isPlaying = false;

function loadTrack(index) {
    const key = trackKeys[index];
    const track = tracks[key];

    audio.src = track.src;
    songsImgContainer.innerHTML = `<img src="${track.img}" class="song-img" alt="Song Image">`;
    songInfo.innerHTML = `<h1>${track.name}</h1><p>${track.artist}</p>`;
}

function playTrack() {
    audio.play();
    isPlaying = true;
}

function pauseTrack() {
    audio.pause();
    isPlaying = false;
}

function nextTrack() {
    currentIndex = (currentIndex + 1) % trackKeys.length;
    loadTrack(currentIndex);
    playTrack();
}

function prevTrack() {
    currentIndex = (currentIndex - 1 + trackKeys.length) % trackKeys.length;
    loadTrack(currentIndex);
    playTrack();
}

function repeatTrack() {
    audio.currentTime = 0;
}

function volumeTrack() {
    audio.volume = volumeSlider.value;
}

controlsIcons.forEach(icon => {
    if (icon.dataset.control === 'play') {
        icon.addEventListener('click', playTrack);
    }
    if (icon.dataset.control === 'pause') {
        icon.addEventListener('click', pauseTrack);
    }
    if (icon.dataset.control === 'prev') {
        icon.addEventListener('click', prevTrack);
    }
    if (icon.dataset.control === 'next') {
        icon.addEventListener('click', nextTrack);
    }
    if (icon.dataset.control === 'repeat') {
        icon.addEventListener('click', repeatTrack);
    }
    if (icon.dataset.control === 'volume') {
        icon.addEventListener('click', volumeTrack);
    }
});

loadTrack(currentIndex);