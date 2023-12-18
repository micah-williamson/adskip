console.debug('AdSkip Init');
startAdWatch();

function startAdWatch() {
    console.debug('Starting ad watch');
    const adWatchInterval = setInterval(() => {
        const adPlayerOverlay = document.getElementById('movie_player').querySelector('.ytp-ad-player-overlay');
        if (adPlayerOverlay) {
            clearInterval(adWatchInterval);
            startAdSkip(adPlayerOverlay);
        }
    }, 30);
}

function startAdSkip(adPlayerOverlay) {
    console.debug('Starting ad skip');

    let adSkipTarget;
    let adVideo;

    const skipInterval = setInterval(() => {
        // Attempt to seek the video to the end
        if (!adVideo) {
            adVideo = document.getElementById('movie_player').querySelector('video');
            if (adVideo) {
                console.debug('Found ad video. Seeking to end');
                adVideo.muted = true;
                adVideo.currentTime = 1e5;
            }
        }

        // Attempt to click the ad skip button
        if (!adSkipTarget) {
            adSkipTarget = document.getElementById('movie_player').querySelector('.ytp-ad-skip-button-container');
            if (adSkipTarget) {
                console.debug('Found ad skip button. Clicking');
                adSkipTarget.click();
            }
        }

        if (!adPlayerOverlay.parentNode) {
            console.debug('Ad is gone');
            // Skip target went away somehow. Resume
            resume();
        }
    }, 10);

    function resume() {
        console.debug('Resuming');
        clearInterval(skipInterval);

        console.debug('Unmuting video');
        const video = document.getElementById('movie_player').querySelector('video');
        video.muted = false;

        // Sometimes the main video will be paused for some time after the ad is skipped. Even after
        // unpausing, the video will somehow become paused again. So we will attempt to unpause the
        // video for some time
        unpauseTenaciously(video, 100);

        // Watch for mid-video ads
        startAdWatch();
    }
}

function unpauseTenaciously(video, attempt) {
    if (attempt <= 0) {
        console.debug('Finished tenaciously unpausing');
        return;
    }

    if (video.paused) {
        console.debug('Video was paused. Playing');
        video.play();
        // Video may become paused again even after unpausing. Keep checking
        setTimeout(unpauseTenaciously, 10, video, attempt-1);
    } else {
        setTimeout(unpauseTenaciously, 10, video, attempt-1);
    }
}
