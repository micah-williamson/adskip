console.log('Init');
startAdWatch();

function startAdWatch() {
    console.log('Starting ad watch');
    const adWatchInterval = setInterval(() => {
        const adPlayerOverlay = getAdPlayerOverlay();
        if (adPlayerOverlay) {
            clearInterval(adWatchInterval);
            startAdSkip(adPlayerOverlay);
        }
    }, 100);
}

function startAdSkip(adPlayerOverlay) {
    console.log('Starting ad skip');
    const adSkipTarget = getSkipAdTarget();
    const muteTarget = getMuteTarget();
    if (!isMuted(muteTarget)) {
        console.log('Muting video');
        muteTarget.click();
    }

    if (adSkipTarget) {
        console.log('Found ad skip button');
    }

    const skipInterval = setInterval(() => {
        if (adSkipTarget) {
            // This only exists of the ad is skippable
            adSkipTarget.click();
        }

        if (!adPlayerOverlay.parentNode) {
            console.log('Ad is gone');
            // Skip target went away somehow. Resume
            resume();
        }
    }, 10);

    function resume() {
        console.log('Resuming');
        clearInterval(skipInterval);
        if (isMuted(muteTarget)) {
            console.log('Unmuting video');
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

function isMuted(muteTarget) {
    const dataTitle = muteTarget.getAttribute('data-title-no-tooltip');
    return dataTitle.toLowerCase() !== 'mute';
}
