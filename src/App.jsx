import React, { useState, useEffect } from 'react';
import './App.css';
import Dapp from './Dapp.tsx';

import video1 from './models/1.gif';
import video2 from './models/2.gif';
import video3 from './models/3.gif';
import video4 from './models/4.gif';
import video5 from './models/5.gif';
import video6 from './models/6.gif';
import video7 from './models/7.gif';
import video8 from './models/8.gif';


const App = () => {
  const modelGifFrames = [
    video1,
    video2,
    video3,
    video4,
    video5, 
    video6,
    video7,
    video8
  ];

  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrameIndex((prevIndex) => (prevIndex + 1) % modelGifFrames.length);
    }, 10000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Dapp />

      <div id="tv-container">
        <div
          id="tv-screen"
          style={{
            backgroundImage: `url(${modelGifFrames[currentFrameIndex]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '200px',  
            height: '200px', 
            display: 'block',
            borderRadius: '10px', 
            objectFit: 'contain', 
          }}
        ></div>
      </div>
    </div>
  );
};

export default App;
