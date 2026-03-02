const video = document.querySelector('#video-player');
const playBtn = document.querySelector('#play');
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');
const loopBtn = document.querySelector('#loop');
const speedupBtn = document.querySelector('#speed-up');
const speeddownBtn = document.querySelector('#speed-down');
const speedNormalBtn = document.querySelector('#speed-normal');
const currentTimeEl = document.querySelector('#out');
const durationEl = document.querySelector('#duration');
const progressBar = document.querySelector('#progress-bar');
const progressContainer = document.querySelector('#progress-container');

let speed = 1;
let tracknumber = 0;
let loopEnabled = false;
let displayedWidth = 0;
let trackExists = true;

video.playsInline = true;
video.preload = "metadata";


/* SHOW / HIDE PROGRESS BAR */

function showProgressBar() {
    progressContainer.style.opacity = '1';
}

function hideProgressBar() {
    progressContainer.style.opacity = '0';
}


/* RESET PROGRESS BAR */

function resetProgressBarInstantly() {

    progressBar.style.transition = 'none';

    displayedWidth = 0;

    progressBar.style.width = '0%';

    requestAnimationFrame(() => {
        progressBar.style.transition = 'width 0.2s linear';
    });

}


/* UPDATE PREV BUTTON STATE */

function updateButtonsState() {

    prevBtn.disabled = tracknumber === 0;

}


/* LOAD TRACK */

function loadTrack(index) {

    if (index < 0) {
        alert("This is the first track");
        return;
    }

    trackExists = true;

    resetProgressBarInstantly();

    video.pause();

    video.src = index + ".mp4";

    video.load();

    video.playbackRate = speed;

    tracknumber = index;

    updateButtonsState();

}


/* NEXT TRACK */

function playNextTrack() {

    if (!trackExists) return;

    loadTrack(tracknumber + 1);

}


/* PREVIOUS TRACK */

function playPrevTrack() {

    loadTrack(tracknumber - 1);

}


/* PROGRESS BAR SMOOTH UPDATE */

function updateProgressSmooth() {

    if (!isNaN(video.duration) && video.duration > 0) {

        const targetPercent =
            (video.currentTime / video.duration) * 100;

        displayedWidth +=
            (targetPercent - displayedWidth) * 0.15;

        progressBar.style.width =
            displayedWidth + '%';

    }

    requestAnimationFrame(updateProgressSmooth);

}

updateProgressSmooth();


/* PLAY / PAUSE BUTTON (FIXED FOR MOBILE) */

playBtn.onclick = () => {

    if (!trackExists) return;

    video.playbackRate = speed;

    if (video.paused)
        video.play();
    else
        video.pause();

};


/* REAL VIDEO EVENTS CONTROL BUTTON STATE */

video.addEventListener('play', () => {

    playBtn.innerText = "| |";

    showProgressBar();

});


video.addEventListener('pause', () => {

    playBtn.innerText = "▶";

});


/* VIDEO READY → AUTOPLAY */

video.addEventListener('canplay', () => {

    video.play().catch(()=>{});

});


/* VIDEO ERROR (FILE DOES NOT EXIST) */

video.addEventListener('error', () => {

    trackExists = false;

    video.pause();

    hideProgressBar();

    playBtn.innerText = "▶";

    alert("No more tracks");

});


/* NEXT BUTTON */

nextBtn.onclick = () => {

    playNextTrack();

};


/* PREV BUTTON */

prevBtn.onclick = () => {

    playPrevTrack();

};


/* LOOP BUTTON */

loopBtn.onclick = () => {

    loopEnabled = !loopEnabled;

    loopBtn.style.background =
        loopEnabled ? 'yellow' : 'WhiteSmoke';

};


/* TRACK ENDED */

video.addEventListener('ended', () => {

    if (loopEnabled) {

        video.currentTime = 0;

        video.play();

    }

    else {

        playNextTrack();

    }

});


/* SPEED UP */

speedupBtn.onclick = () => {

    speed =
        Math.min(4,
        parseFloat(video.playbackRate) + 0.05);

    video.playbackRate = speed;

    speedupBtn.innerText =
        speed !== 1 ?
        `+ Speed (${speed.toFixed(2)})` :
        "+ Speed";

    speedupBtn.style.border =
        speed !== 1 ?
        "1px solid grey" :
        "1px solid lightgray";

};


/* SPEED DOWN */

speeddownBtn.onclick = () => {

    speed =
        Math.max(0.1,
        parseFloat(video.playbackRate) - 0.05);

    video.playbackRate = speed;

    speeddownBtn.innerText =
        speed !== 1 ?
        `- Speed (${speed.toFixed(2)})` :
        "- Speed";

    speeddownBtn.style.border =
        speed !== 1 ?
        "1px solid grey" :
        "1px solid lightgray";

};


/* RESET SPEED */

speedNormalBtn.onclick = () => {

    speed = 1;

    video.playbackRate = speed;

    speedupBtn.innerText = "+ Speed";

    speeddownBtn.innerText = "- Speed";

    speedupBtn.style.border = "1px solid lightgray";

    speeddownBtn.style.border = "1px solid lightgray";

};


/* UPDATE TIME DISPLAY */

video.addEventListener('timeupdate', () => {

    if (!isNaN(video.duration)) {

        const currentMinutes =
            Math.floor(video.currentTime / 60);

        const currentSeconds =
            Math.floor(video.currentTime % 60);

        const durationMinutes =
            Math.floor(video.duration / 60);

        const durationSeconds =
            Math.floor(video.duration % 60);

        currentTimeEl.innerText =
            (currentMinutes < 10 ? "0" : "") +
            currentMinutes +
            ":" +
            (currentSeconds < 10 ? "0" : "") +
            currentSeconds;

        durationEl.innerText =
            (durationMinutes < 10 ? "0" : "") +
            durationMinutes +
            ":" +
            (durationSeconds < 10 ? "0" : "") +
            durationSeconds;

    }

});


/* SEEK */

progressContainer.onclick = (e) => {

    const width =
        progressContainer.clientWidth;

    const clickX = e.offsetX;

    video.currentTime =
        (clickX / width) * video.duration;

};


/* SPACE KEY PLAY / PAUSE */

document.addEventListener('keydown', (e) => {

    if (e.code === "Space") {

        e.preventDefault();

        playBtn.click();

    }

});


/* INITIAL LOAD */

loadTrack(0);

updateButtonsState();
