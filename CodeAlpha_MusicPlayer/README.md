# **Music Player**
A custom music player with a synced progress bar, playlist, and a 3D mouse-parallax background, built with HTML, CSS (SCSS), and vanilla JavaScript, created as part of the _CodeAlpha Frontend Development Internship_.

## **Features**
+ Full audio playback control — play/pause, next/previous track, repeat
+ Progress bar synced live to the audio's current time and duration, with seek support (drag to jump to any point in the track)
+ Custom-styled range inputs (progress and volume), driven by CSS variables updated in real time
+ Dynamic track loading — cover art, title, and artist update automatically for the active track
+ Playlist panel positioned relative to the player, staying visually attached regardless of screen width
+ Bonus: autoplay of the next track when the current one ends
+ 3D mouse-parallax background — layered glow elements respond to cursor movement using CSS `perspective` and `transform-style: preserve-3d`
+ Fully responsive — adapts to desktop, tablet, and mobile screens

## **Tech Stack**
+ HTML5
+ CSS3 / SCSS (Flexbox, custom properties, 3D transforms, transitions)
+ Vanilla JavaScript (HTMLMediaElement API, DOM manipulation, no frameworks/libraries)
+ Google Fonts (Bebas Neue, Orbitron)

## **Project Structure**
```
CodeAlpha_MusicPlayer/
├── index.html
├── style.scss
├── style.css
├── script.js
└── assets/
    ├── music/
    └── songsImg/
```

## **How to Run**

Open [Music Player](https://daniilgk.github.io/codealpha_tasks/CodeAlpha_MusicPlayer/) in your browser.

## **Author**

## Made by [DaniilGK](https://github.com/DaniilGK) for the CodeAlpha Frontend Development Internship.
