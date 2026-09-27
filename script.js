const audio = document.getElementById('audio');
const player = document.querySelector('.player');
const coverImage = document.querySelector('.song-img');
const songTitle = document.querySelector('.song-info h1');
const songArtist = document.querySelector('.song-info p');
const actionBar = document.querySelector('.action-bar');
const progressBar = document.querySelector('.song-progress-bar');
const currentTimeLabel = document.querySelector('.song-progress-time');
const durationLabel = document.querySelector('.song-progress-time-end');
const controls = document.querySelector('.song-controls');
const playIcon = document.querySelector('.play');
const pauseIcon = document.querySelector('.pause');
const volumeControl = document.querySelector('.song-control-volume');
const volumeSlider = document.querySelector('.volume-slider');
const likeButton = actionBar.querySelector('[data-control="like"]');
const playlist = document.querySelector('.play-list');

const tracks = {
    'alec_koff-carnaval': {
        name: 'Carnaval',
        artist: 'Alec Koff',
        src: './assets/music/alec_koff-carnaval.mp3',
        img: './assets/songsImg/ai-generated-vintage.jpg'
    },
    'alexguz-funk-amp-breakbeat': {
        name: 'Funk & Breakbeat',
        artist: 'Alex Guz',
        src: './assets/music/alexguz-funk-amp-breakbeat.mp3',
        img: './assets/songsImg/Bocanada.jpg'
    },
    'alexzavesa-dance': {
        name: 'Dance',
        artist: 'Alex Zavesa',
        src: './assets/music/alexzavesa-dance.mp3',
        img: './assets/songsImg/gettyimages.jpg'
    },
    'fassounds-escape': {
        name: 'Escape',
        artist: 'Fassounds',
        src: './assets/music/fassounds-escape.mp3',
        img: './assets/songsImg/I_Am_Music.jpg'
    },
    'gvidon-gvidon-medicine': {
        name: 'Medicine',
        artist: 'Gvidon',
        src: './assets/music/gvidon-gvidon-medicine.mp3',
        img: './assets/songsImg/indieblog-best.jpg'
    },
    'ikoliks_aj-background-music': {
        name: 'Background Music',
        artist: 'Ikoliks_aj',
        src: './assets/music/ikoliks_aj-background-music.mp3',
        img: './assets/songsImg/Meddle_Pink.jpg'
    },
    'kontraa-water-afro': {
        name: 'Water Afro',
        artist: 'Kontraa',
        src: './assets/music/kontraa-water-afro.mp3',
        img: './assets/songsImg/paradise.jpg'
    },
    'mickeyscat-moment-of-peace-mickeyscat': {
        name: 'Moment of Peace',
        artist: 'Mickeyscat',
        src: './assets/music/mickeyscat-moment-of-peace-mickeyscat.mp3',
        img: './assets/songsImg/sm_5.jpg'
    }
};

const trackIds = Object.keys(tracks);
const likedTrackIds = new Set();
let currentTrackIndex = 0;
let isPlaying = false;
let isMuted = false;
let volumeBeforeMute = Number(volumeSlider.value) || 1;

function getTrack(index) {
    return tracks[trackIds[index]];
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function setSliderFill(slider, cssVariable) {
    const max = Number(slider.max) || 1;
    const percent = (Number(slider.value) / max) * 100;
    slider.style.setProperty(cssVariable, `${percent}%`);
}

function markActivePlaylistItem(index) {
    playlist.querySelectorAll('.play-list-item').forEach((item) => {
        item.classList.toggle('is-active', Number(item.dataset.index) === index);
    });
}

function updateLikeButton() {
    likeButton.classList.toggle('is-liked', likedTrackIds.has(trackIds[currentTrackIndex]));
}

function showTrack(index) {
    const track = getTrack(index);

    audio.src = track.src;
    coverImage.src = track.img;
    coverImage.alt = track.name;
    songTitle.textContent = track.name;
    songArtist.textContent = track.artist;
    markActivePlaylistItem(index);
    updateLikeButton();
}

function play() {
    audio.play();
    isPlaying = true;
    player.classList.add('is-playing');
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'flex';
}

function pause() {
    audio.pause();
    isPlaying = false;
    player.classList.remove('is-playing');
    pauseIcon.style.display = 'none';
    playIcon.style.display = 'flex';
}

function togglePlayback() {
    if (isPlaying) {
        pause();
    } else {
        play();
    }
}

function playTrackAt(index) {
    currentTrackIndex = index;
    showTrack(currentTrackIndex);
    play();
}

function playNext() {
    const nextIndex = (currentTrackIndex + 1) % trackIds.length;
    playTrackAt(nextIndex);
}

function playPrevious() {
    const previousIndex = (currentTrackIndex - 1 + trackIds.length) % trackIds.length;
    playTrackAt(previousIndex);
}

function restartTrack() {
    audio.currentTime = 0;
}

function setMuteState(muted) {
    isMuted = muted;
    volumeControl.classList.toggle('is-muted', muted);
}

function setVolume(value) {
    const volume = Number(value);

    audio.volume = volume;
    volumeSlider.value = volume;
    setSliderFill(volumeSlider, '--volume');

    if (volume > 0) {
        volumeBeforeMute = volume;
        setMuteState(false);
        return;
    }

    setMuteState(true);
}

function toggleMute() {
    if (isMuted) {
        setVolume(volumeBeforeMute > 0 ? volumeBeforeMute : 1);
        return;
    }

    volumeBeforeMute = Number(volumeSlider.value) || volumeBeforeMute || 1;
    setVolume(0);
}

function renderPlaylist() {
    playlist.innerHTML = trackIds.map((id, index) => {
        const track = tracks[id];
        const likedClass = likedTrackIds.has(id) ? ' is-liked' : '';

        return `<li class="play-list-item${likedClass}" data-index="${index}">
            <span class="play-list-title">
                <span class="play-list-name">${track.name}</span>
                <span class="play-list-like" aria-hidden="true"></span>
            </span>
            <span class="play-list-artist">${track.artist}</span>
        </li>`;
    }).join('');
}

function toggleLike() {
    const trackId = trackIds[currentTrackIndex];
    const playlistItem = playlist.querySelector(`[data-index="${currentTrackIndex}"]`);

    if (likedTrackIds.has(trackId)) {
        likedTrackIds.delete(trackId);
        playlistItem.classList.remove('is-liked');
    } else {
        likedTrackIds.add(trackId);
        playlistItem.classList.add('is-liked');
    }

    updateLikeButton();
}

async function copyTrackName() {
    const shareButton = actionBar.querySelector('[data-control="share"]');
    const trackName = getTrack(currentTrackIndex).name;

    try {
        await navigator.clipboard.writeText(trackName);
    } catch {
        const textArea = document.createElement('textarea');
        textArea.value = trackName;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
    }

    shareButton.classList.add('is-copied');
    setTimeout(() => shareButton.classList.remove('is-copied'), 700);
}

function downloadCurrentTrack() {
    const track = getTrack(currentTrackIndex);
    const link = document.createElement('a');

    link.href = track.src;
    link.download = track.src.split('/').pop();
    document.body.appendChild(link);
    link.click();
    link.remove();
}

function updateProgress() {
    if (isNaN(audio.duration)) return;

    progressBar.value = (audio.currentTime / audio.duration) * 100;
    setSliderFill(progressBar, '--progress');
    currentTimeLabel.textContent = formatTime(audio.currentTime);
}

function seekToProgress() {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
    setSliderFill(progressBar, '--progress');
}

function moveParallax(event) {
    const sensitivity = 0.1;
    const rotateX = (event.clientY - window.innerHeight / 2) * sensitivity;
    const rotateY = (event.clientX - window.innerWidth / 2) * -sensitivity / 2;

    document.documentElement.style.setProperty('--rotate-x', `${rotateX}deg`);
    document.documentElement.style.setProperty('--rotate-y', `${rotateY}deg`);
}

function bindEvents() {
    const controlActions = {
        repeat: restartTrack,
        prev: playPrevious,
        next: playNext,
        volume: toggleMute,
        play: togglePlayback
    };
    const actionBarActions = {
        like: toggleLike,
        share: copyTrackName,
        download: downloadCurrentTrack
    };

    controls.addEventListener('click', (event) => {
        if (event.target.closest('.volume-slider')) return;

        const control = event.target.closest('[data-control]');
        const action = control && controlActions[control.dataset.control];
        if (action) action();
    });

    playlist.addEventListener('click', (event) => {
        const playlistItem = event.target.closest('.play-list-item');
        if (!playlistItem) return;
        playTrackAt(Number(playlistItem.dataset.index));
    });

    actionBar.addEventListener('click', (event) => {
        const actionButton = event.target.closest('[data-control]');
        const action = actionButton && actionBarActions[actionButton.dataset.control];
        if (action) action();
    });

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', () => {
        durationLabel.textContent = formatTime(audio.duration);
    });
    progressBar.addEventListener('input', seekToProgress);
    volumeSlider.addEventListener('input', () => setVolume(volumeSlider.value));
    document.addEventListener('mousemove', moveParallax);
}

function init() {
    renderPlaylist();
    showTrack(currentTrackIndex);
    setSliderFill(volumeSlider, '--volume');
    setSliderFill(progressBar, '--progress');
    bindEvents();
}

init();
