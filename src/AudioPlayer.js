import React, { useState, useEffect } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import audioFile from './assets/DiwaliAudio.m4a';
import './index.css';
import secondsToTimestamp from './utils/conversions';

const AudioPlayer = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [breakpoints, setBreakpoints] = useState([]);

  const handleTimeUpdate = (e) => {
    setCurrentTime(e.target.currentTime);
  };

  const skipToTimestamp = (timestamp) => {
    // Access the audio element and set its currentTime
    const audioElement = document.getElementById('audio-element');
    if (audioElement) {
      audioElement.currentTime = timestamp;
      setCurrentTime(audioElement.currentTime);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const audioElement = document.getElementById('audio-element');
      if (audioElement) {
        setCurrentTime(audioElement.currentTime);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);


  // const pageStyle = {
  //   backgroundColor: 'black',
  //   color: 'white', // Set text color to white for better visibility
  //   // Add more styles as needed
  // };


  return (
    <div className='audioPlayer'>
      {/* Display the list of breakpoints */}
      <ul className='audioPlayer'>
        {breakpoints.map((timestamp, index) => (
          <li key={index}>
            <button onClick={() => skipToTimestamp(timestamp)}>
              Breakpoint {index + 1}: {timestamp.toFixed(2)} seconds
            </button>
          </li>
        ))}
      </ul>

      {/* Button to add a new breakpoint */}
      <button onClick={() => setBreakpoints([...breakpoints, currentTime])}>
        Add Breakpoint
      </button>

      <p>Current Time: {currentTime.toFixed(2)} seconds</p>
      
      <ReactAudioPlayer
        id="audio-element"
        src={audioFile} // Replace with the path to your audio file
        controls
        onTimeUpdate={handleTimeUpdate}
      />
      
      <button onClick={() => skipToTimestamp(30)}>Skip to 30 seconds</button>
      {/* Add more buttons or controls as needed */}
    </div>
  );
};

export default AudioPlayer;