import React, { useState, useEffect, useRef } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import audioFile from './assets/DiwaliAudio.m4a';
import './index.css';
import secondsToTimestamp from './utils/conversions';
import FileInput from './utils/FileInput';

const AudioPlayer = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [breakpoints, setBreakpoints] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentBlob, setCurrentBlob] = useState(null);
  const audioRef = useRef(null);

  // function to skip to a certain timestamp (when breakpoint selected)
  const skipToTimestamp = (timestamp) => {
    if (audioRef.current) {
      audioRef.current.currentTime = timestamp;
      setCurrentTime(audioRef.current.currentTime);
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

  // internally in ReactAudioPlayer; updates the time
  const handleTimeUpdate = (e) => {
    setCurrentTime(e.target.currentTime);
  };

  // when a new file is selected, set the currentTrack and the dataBlob that ReactAudioPlayer will accept
  const handleFileChange = (file) => {
    setCurrentTrack(file);
    var binaryData = [];
    binaryData.push(file);
    const mp3ObjectURL = window.URL.createObjectURL(new Blob(binaryData, {type: "audio/mpeg"}))
    setCurrentBlob(mp3ObjectURL);
  };


  return (
    <div className='audioPlayer'>
      {/* User selects an audio file and the name displays */}
      <FileInput onFileChange={handleFileChange} />
      {currentTrack ? (
        <p>Selected File: {currentTrack.name}</p>
      ) :
      <p>Selected File: Default (Diwali Mix)</p>
      }
      
      <div className="twoSides">

        <div className='audioSide'>
          {/* Button to add a new breakpoint */}
          <button onClick={() => setBreakpoints([...breakpoints, currentTime])}>
            Add Breakpoint
          </button>

          <p>Current Time: {secondsToTimestamp(currentTime.toFixed(2))}</p>
          
          <ReactAudioPlayer
            ref={audioRef}
            id="audio-element"
            src={currentTrack ? currentBlob : audioFile}
            controls
            onTimeUpdate={handleTimeUpdate}
            className="audioPlayerBar"
          />

          <br></br>
          
          <button onClick={() => skipToTimestamp(30)}>Skip to 30 seconds</button>
        </div>


        <div className='breakpointSide'>
          {/* Display the list of breakpoints */}
          <ul className='breakpointList'>
            {breakpoints.map((timestamp, index) => (
              <li className='breakpoint' key={index}>
                <button onClick={() => skipToTimestamp(timestamp)}>
                  Breakpoint {index + 1}: {timestamp.toFixed(2)} seconds
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