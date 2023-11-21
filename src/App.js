import './App.css';
import AudioPlayer from './AudioPlayer';

function App() {
  const pageStyle = {
    backgroundColor: '#121212',
    color: 'white', // Set text color to white for better visibility
    // Add more styles as needed
  };

  return (
    <div style={pageStyle} className="fullWindow">
      <AudioPlayer/>
    </div>
  );
}

export default App;
