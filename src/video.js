const constraints = {
    audio: false,
    video: {
        mandatory: {
            minWidth: 853,
            minHeight: 480,
            maxWidth: 853,
            maxHeight: 480
        }
    }
};

function handleSuccess(videoEL, stream) {
    video.srcObject = stream;
}

function handleError(error) {
    console.log('Camera error: ', error);
}

exports.init = (nav, videoEl) => {
    nav.mediaDevices.getUserMedia(constraints).then(stream => {
        handleSuccess(videoEl, stream);
    }).catch(err => {
        handleError(err);
    });
};
