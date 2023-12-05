console.debug('AdSkip Init');
startAdWatch();

function startAdWatch() {
    console.debug('Starting ad watch');
    const adWatchInterval = setInterval(() => {
        const adPlayerOverlay = document.querySelector('.ytp-ad-player-overlay');
        if (adPlayerOverlay) {
            clearInterval(adWatchInterval);
            startAdSkip(adPlayerOverlay);
        }
    }, 100);
}

function startAdSkip(adPlayerOverlay) {
    console.debug('Starting ad skip');

    let adSkipTarget;
    let adVideo;

    const skipInterval = setInterval(() => {
        // Attempt to seek the video to the end
        if (!adVideo) {
            adVideo = document.querySelector('video');
            if (adVideo) {
                console.debug('Found ad video. Seeking to end');
                adVideo.muted = true;
                adVideo.currentTime = 1e5;
            }
        }

        // Attempt to click the ad skip button
        if (!adSkipTarget) {
            adSkipTarget = document.querySelector('.ytp-ad-skip-button-container');
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
        const video = document.querySelector('video');
        video.muted = false;

        // Watch for mid-video ads
        startAdWatch();
    }
}
