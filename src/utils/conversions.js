const secondsToTimestamp = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = (sec % 60).toFixed(0);
    const millis = Math.floor((sec % 1) * 1000);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds + '.' + Math.floor(millis / 10);
};

export default secondsToTimestamp;