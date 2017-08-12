function handleSuccess(videoEl, stream) {
    videoEl.src = window.URL.createObjectURL(stream);
}

function handleError(error) {
    console.log('Camera error: ', error);
}

window.addEventListener('DOMContentLoaded', _ => {
    const videoEl = document.getElementById('video');
    const canvasEl = document.getElementById('canvas');
    const recordEl = document.getElementById('record');
    const photosEl = document.querySelector('.photosContainer');
    const counterEl = document.getElementById('counter');

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

    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
        handleSuccess(videoEl, stream);
    }).catch(err => {
        handleError(err);
    });
});
