console.debug('AdSkip Init');
startAdWatch();

function startAdWatch() {
    console.debug('Starting ad watch');
    const adWatchInterval = setInterval(() => {
        const adPlayerOverlay = getAdPlayerOverlay();
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

    const muteTarget = getMuteTarget();
    if (!isMuted(muteTarget)) {
        console.debug('Muting video');
        muteTarget.click();
    }

    const skipInterval = setInterval(() => {
        // Attempt to seek the video to the end
        if (!adVideo) {
            adVideo = getAdVideo();
            if (adVideo) {
                console.debug('Found ad video. Seeking to end');
                adVideo.currentTime = 1e5;
            }
        }

        // Attempt to click the ad skip button
        if (!adSkipTarget) {
            adSkipTarget = getSkipAdTarget();
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
        if (isMuted(muteTarget)) {
            console.debug('Unmuting video');
            muteTarget.click();
        }

        // Watch for mid-video ads
        startAdWatch();
    }
}

function getAdPlayerOverlay() {
    const skipAdTargets = document.getElementsByClassName('ytp-ad-player-overlay');
    return skipAdTargets.length > 0 ? skipAdTargets[0] : null;
}

function getSkipAdTarget() {
    const skipAdTargets = document.getElementsByClassName('ytp-ad-skip-button-container');
    return skipAdTargets.length > 0 ? skipAdTargets[0] : null;
}

function getMuteTarget() {
    return document.getElementsByClassName('ytp-mute-button')[0];
}

function getAdVideo() {
    return document.querySelector('#container video');
}

function isMuted(muteTarget) {
    const dataTitle = muteTarget.getAttribute('data-title-no-tooltip');
    return dataTitle.toLowerCase() !== 'mute';
}
