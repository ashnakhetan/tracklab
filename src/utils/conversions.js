const secondsToTimestamp = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = (sec % 60).toFixed(0);
    const millis = Math.floor((sec % 1) * 1000);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds + '.' + millis;
};

export default secondsToTimestamp;