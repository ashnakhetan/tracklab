import React, { useState, useEffect, useRef } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import defaultFile from './assets/NeverGonnaGiveYouUp.mp3'
import './index.css';
import secondsToTimestamp from './utils/conversions';
import FileInput from './utils/FileInput';

const AudioPlayer = () => {
  const [currentTime, setCurrentTime] = useState(0);
  // const [breakpoints, setBreakpoints] = useState([]);
  const [breakpoints, setBreakpoints] = useState(JSON.parse(localStorage.getItem('breakpoints')) || []);
  // const [currentTrack, setCurrentTrack] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(localStorage.getItem('selectedTrack') || null);
  // const [currentBlob, setCurrentBlob] = useState(null);
  const [currentBlob, setCurrentBlob] = useState(localStorage.getItem('selectedBlob') || null);
  const audioRef = useRef(null);
  console.log("selectedTrack:", localStorage.getItem('selectedTrack'));
  console.log("selectedBlob:", localStorage.getItem('selectedBlob'));

  // function to skip to a certain timestamp (when breakpoint selected)
  const skipToTimestamp = (timestamp) => {
    if (audioRef.current) {
      audioRef.current.audioEl.current.currentTime = timestamp;
      setCurrentTime(audioRef.current.audioEl.current.currentTime);
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
    console.log(file);
    setCurrentTrack(file); // SUPER WEIRD NOT UPDATING!!
    console.log(currentTrack);
    var binaryData = [];
    binaryData.push(file);
    const mp3ObjectURL = window.URL.createObjectURL(new Blob(binaryData, {type: "audio/mpeg"}))
    setCurrentBlob(mp3ObjectURL);
    console.log("currentTrack:", currentTrack);

    localStorage.setItem('selectedTrack', currentTrack);
    localStorage.setItem('selectedBlob', currentBlob);

    console.log("in handleFileChange, selectedTrack:", localStorage.getItem('selectedTrack'));
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
        <p>Selected File: {currentTrack.name}</p>
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
            Add Breakpoint
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