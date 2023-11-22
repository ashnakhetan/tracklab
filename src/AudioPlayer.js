import React, { useState, useEffect, useRef } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import defaultFile from './assets/NeverGonnaGiveYouUp.mp3'
import './index.css';
import secondsToTimestamp from './utils/conversions';
import FileInput from './utils/FileInput';

const AudioPlayer = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [breakpoints, setBreakpoints] = useState(JSON.parse(localStorage.getItem('breakpoints')) || []);
  const [currentTrack, setCurrentTrack] = useState(localStorage.getItem('selectedTrack') || null);
  const [currentBlob, setCurrentBlob] = useState(localStorage.getItem('selectedBlob') || null);
  const audioRef = useRef(null);

  // function to skip to a certain timestamp (when breakpoint selected)
  const skipToTimestamp = (timestamp) => {
    if (audioRef.current) {
      audioRef.current.audioEl.current.currentTime = timestamp;
      setCurrentTime(audioRef.current.audioEl.current.currentTime);
    }
  };

  // function to go back a certain number of seconds
  const goBack = (seconds) => {
    if (audioRef.current) {
      const newTime = Math.max(0, audioRef.current.audioEl.current.currentTime - seconds);
      audioRef.current.audioEl.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // updates the time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.audioEl.current.currentTime);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // listen for changes in currentTime and update the localStorage
  useEffect(() => {
    localStorage.setItem('currentTime', currentTime);
  }, [currentTime]);

  // internally in ReactAudioPlayer; updates the time
  const handleTimeUpdate = (e) => {
    setCurrentTime(e.target.currentTime);
  };

  // when a new file is selected, set the currentTrack and the dataBlob that ReactAudioPlayer will accept
  const handleFileChange = (file) => {
    setCurrentTrack(file.name);
    var binaryData = [];
    binaryData.push(file);  
    const mp3ObjectURL = window.URL.createObjectURL(new Blob(binaryData, {type: "audio/mpeg"}))
    setCurrentBlob(mp3ObjectURL);

    localStorage.setItem('selectedTrack', file.name);
    localStorage.setItem('selectedBlob', mp3ObjectURL);
  };


  const deleteBreakpoint = (index) => {
    const updatedBreakpoints = [...breakpoints];
    updatedBreakpoints.splice(index, 1);
    setBreakpoints(updatedBreakpoints);
    localStorage.setItem('breakpoints', JSON.stringify(updatedBreakpoints));
  };


  return (
    <div className='audioPlayer'>
      {/* User selects an audio file and the name displays */}
      <FileInput onFileChange={handleFileChange} />
      {currentTrack ? (
        <p>Selected File: {currentTrack}</p>
      ) :
      <p>Selected File: Default (Never Gonna Give You Up)</p>
      }
      
      <div className="twoSides">

        <div className='audioSide'>
          {/* Button to add a new breakpoint */}
          <button onClick={() => {
            const newBreakpoints = [...breakpoints, currentTime];
            setBreakpoints(newBreakpoints);
            // setBreakpoints([...breakpoints, currentTime]);
            localStorage.setItem('breakpoints', JSON.stringify(newBreakpoints));
            }}>
            add breakpoint
          </button>

          <p>Current Time: {secondsToTimestamp(currentTime)}</p>
          
          <ReactAudioPlayer
            ref={audioRef}
            id="audio-element"
            src={currentTrack ? currentBlob : defaultFile}
            controls
            onTimeUpdate={handleTimeUpdate}
            className="audioPlayerBar"
          />

          <br></br>
          <button onClick={() => skipToTimestamp(30)}>skip to 30 seconds</button>
          <br></br>
          <button onClick={() => goBack(10)}>back it up 10 seconds</button>
        </div>


        <div className='breakpointSide'>
          {/* Display the list of breakpoints */}
          <ul className='breakpointList'>
            {breakpoints.map((timestamp, index) => (
              <li className='breakpoint' key={index}>
                <button className="breakpointButton" onClick={() => skipToTimestamp(timestamp)}>
                  Breakpoint {index + 1}: {secondsToTimestamp(timestamp)}
                </button>
                <button className="deleteBreakpoint" onClick={() => deleteBreakpoint(index)}>
                  &#10006;
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;