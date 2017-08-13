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

function handleSuccess(videoEl, stream) {
    videoEl.srcObject = stream;
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

exports.captureBytes = (videoEl, ctx, canvasEl) => {
    ctx.drawImage(videoEl, 0, 0);
    return canvasEl.toDataURL('image/png');
}

exports.captureBytesFromLiveCanvas = canvas => {
    return canvas.toDataURL('image/png');
}
