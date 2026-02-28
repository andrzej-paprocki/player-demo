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
let flag = 0; // Loop flag
let displayedWidth = 0;

/* SHOW / HIDE PROGRESS BAR */
function showProgressBar() {
    progressContainer.style.opacity = '1';
}
function hideProgressBar() {
    progressContainer.style.opacity = '0';
}

/* INSTANTLY RESET PROGRESS BAR */
function resetProgressBarInstantly() {
    progressBar.style.transition = 'none';
    displayedWidth = 0;
    progressBar.style.width = '0%';
    requestAnimationFrame(() => {
        progressBar.style.transition = 'width 0.2s linear';
    });
}

/* UPDATE BUTTON STATES */
function updateButtonsState() {
    prevBtn.disabled = tracknumber === 0; // disable prev if first track
}

/* LOAD TRACK */
function loadTrack(index) {
    if (index < 0) {
        alert("This is the first track");
        return;
    }

    resetProgressBarInstantly();
    video.src = index + ".mp4";
    video.playbackRate = speed;

    tracknumber = index;
    updateButtonsState(); // update button states

    // If file does not exist, show alert
    video.onerror = () => {
        video.pause();
        playBtn.innerText = "Play";
        hideProgressBar();
        alert("No more tracks");
        video.onerror = null; // remove error handler
    };

    video.oncanplay = () => {
        video.play();
        playBtn.innerText = "Pause";
        showProgressBar();
        video.oncanplay = null; // remove canplay handler
    };
}

/* NEXT TRACK */
function playNextTrack() {
    tracknumber++;
    loadTrack(tracknumber);
}

/* PREVIOUS TRACK */
function playPrevTrack() {
    tracknumber--;
    loadTrack(tracknumber);
}

/* SMOOTH PROGRESS BAR UPDATE */
function updateProgressSmooth() {
    if (!isNaN(video.duration) && video.currentTime > 0) {
        const targetPercent = (video.currentTime / video.duration) * 100;
        displayedWidth += (targetPercent - displayedWidth) * 0.1;
        progressBar.style.width = displayedWidth + '%';
    }
    requestAnimationFrame(updateProgressSmooth);
}
updateProgressSmooth();

/* PLAY / PAUSE */
playBtn.onclick = () => {
    video.playbackRate = speed;
    if (playBtn.innerText === "Play") {
        video.play();
        playBtn.innerText = "Pause";
        showProgressBar();
    } else {
        video.pause();
        playBtn.innerText = "Play";
    }
};

/* SPEED UP */
speedupBtn.onclick = () => {
    video.playbackRate = (parseFloat(video.playbackRate) + 0.05).toFixed(2);
    speed = parseFloat(video.playbackRate);
    speedupBtn.innerText = speed !== 1 ? `+ Speed (${speed})` : "+ Speed";
    speedupBtn.style.border = speed !== 1 ? "1px solid grey" : "1px solid lightgray";
    speeddownBtn.style.border = "1px solid lightgray";
    speeddownBtn.innerText = "- Speed";
};

/* SPEED DOWN */
speeddownBtn.onclick = () => {
    if (video.playbackRate > 0) {
        video.playbackRate = (parseFloat(video.playbackRate) - 0.05).toFixed(2);
        speed = parseFloat(video.playbackRate);
        speeddownBtn.innerText = speed !== 1 ? `- Speed (${speed})` : "- Speed";
        speeddownBtn.style.border = speed !== 1 ? "1px solid grey" : "1px solid lightgray";
        speedupBtn.style.border = "1px solid lightgray";
        speedupBtn.innerText = "+ Speed";
    }
};

/* RESET SPEED TO 1 */
speedNormalBtn.onclick = () => {
    speed = 1;
    video.playbackRate = speed;
    speedupBtn.innerText = "+ Speed";
    speeddownBtn.innerText = "- Speed";
    speedupBtn.style.border = "1px solid lightgray";
    speeddownBtn.style.border = "1px solid lightgray";
    speedNormalBtn.blur();
};

/* NEXT BUTTON */
nextBtn.onclick = playNextTrack;

/* PREV BUTTON */
prevBtn.onclick = playPrevTrack;

/* LOOP TOGGLE */
loopBtn.onclick = () => {
    if (flag === 0) {
        loopBtn.style.background = 'yellow';
        flag = 1;
    } else {
        loopBtn.style.background = 'WhiteSmoke';
        flag = 0;
    }
};

/* AUTOMATIC TRACK END */
video.addEventListener('ended', () => {
    if (flag === 1) {
        video.currentTime = 0;
        video.play();
    } else {
        hideProgressBar();
        playNextTrack();
    }
});

/* UPDATE TIME DISPLAY */
video.addEventListener('timeupdate', () => {
    if (!isNaN(video.duration)) {
        const currentMinutes = Math.floor(video.currentTime / 60);
        const currentSeconds = Math.floor(video.currentTime % 60);
        const durationMinutes = Math.floor(video.duration / 60);
        const durationSeconds = Math.floor(video.duration % 60);

        currentTimeEl.innerText =
            (currentMinutes < 10 ? "0" : "") + currentMinutes + ":" +
            (currentSeconds < 10 ? "0" : "") + currentSeconds;

        durationEl.innerText =
            (durationMinutes < 10 ? "0" : "") + durationMinutes + ":" +
            (durationSeconds < 10 ? "0" : "") + durationSeconds;
    }
});

/* SEEK ON CLICK */
progressContainer.addEventListener('click', (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    video.currentTime = (clickX / width) * video.duration;
});

/* SPACE KEY PLAY/PAUSE */
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        e.preventDefault();
        playBtn.click();
    }
});

/* INITIALIZATION: disable prev button on first track */
updateButtonsState();
