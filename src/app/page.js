'use client';

import { useEffect, useState, useRef } from 'react';

export default function Page() {
  // Adding a log to see initial render
  console.log("Rendering Page component");
  
  const [stars, setStars] = useState([]);
  const [shootingStars, setShootingStars] = useState([]);
  const [selectedButton, setSelectedButton] = useState("About me"); // Default selected button
  
  // Log when selection changes
  useEffect(() => {
    console.log("Selected button changed to:", selectedButton);
  }, [selectedButton]);
  
  // Create a handler function to help debug
  const handleButtonClick = (text) => {
    console.log("Button clicked:", text);
    setSelectedButton(text);
  };
  
  // Fixed settings as requested
  const density = 400;
  const fadeThreshold = 99;
  const curveIntensity = 6;
  const galaxyPattern = true;
  const twinkleTime = 5; // Updated to 9s as per your previous request
  const xOffset = -10;
  const yOffset = -15;
  const tailLength = 50;
  const starDuration = 3; // Updated to 3s as per your previous request
  const travelDistance = 180;
  
  // Mouse movement tracking
  const lastPositionRef = useRef({ x: 0, y: 0 });
  const movementStartRef = useRef(0);
  const isMovingRef = useRef(false);
  const lastStarTimeRef = useRef(0);

  useEffect(() => {
    generateStars(density, fadeThreshold, curveIntensity, galaxyPattern);
  }, [density, fadeThreshold, curveIntensity, galaxyPattern]);

  // Fix the mouse movement tracking useEffect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const currentTime = Date.now();
      const { clientX: x, clientY: y } = e;
      
      // Only track movement in the threshold area
      const screenHeight = window.innerHeight;
      const thresholdHeight = (fadeThreshold / 100) * screenHeight;
      
      if (y > thresholdHeight) {
        // Reset tracking when outside threshold area
        isMovingRef.current = false;
        return;
      }
      
      // Calculate distance moved
      const lastPos = lastPositionRef.current;
      const distance = Math.sqrt(Math.pow(x - lastPos.x, 2) + Math.pow(y - lastPos.y, 2));
      
      // Update last position
      lastPositionRef.current = { x, y };
      
      // If not already tracking movement and mouse has moved enough
      if (!isMovingRef.current && distance > 5) {
        isMovingRef.current = true;
        movementStartRef.current = currentTime;
      }
      
      // If movement has been consistent for ~1 second
      if (isMovingRef.current && 
          currentTime - movementStartRef.current > 1000 &&
          currentTime - lastStarTimeRef.current > 2000) { // Don't create stars too quickly
        
        // Calculate the angle of movement
        const angle = Math.atan2(y - lastPos.y, x - lastPos.x) * (180 / Math.PI);
        
        // Create a shooting star
        createShootingStar(x, y, angle);
        
        // Reset tracking
        isMovingRef.current = false;
        lastStarTimeRef.current = currentTime;
      }
    };

    // Add event listener
    window.addEventListener('mousemove', handleMouseMove);
    
    // Clean up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const generateStars = (totalStars, threshold, curve, useGalaxyPattern) => {
    const newStars = [];
    
    // Number of spiral arms in our galaxy
    const spiralArms = 3;
    // How tightly wound the spirals are
    const spiralTightness = 4;
    // How much random deviation from the perfect spiral
    const spiralNoise = 0.2;
    
    // Generate stars with galaxy-like distribution
    for (let i = 0; i < totalStars; i++) {
      // Generate random position for vertical distribution
      const top = Math.random() * 100;
      
      // Apply threshold check
      if (top < threshold) {
        // Get normalized position for density calculation
        const normalizedPosition = top / threshold;
        
        // Standard probability check for vertical distribution
        if (Math.random() < 1 - Math.pow(normalizedPosition, curve)) {
          // Generate star position based on galaxy pattern or random
          let left, width, height, color, opacity;
          
          if (useGalaxyPattern) {
            // Galaxy pattern: create spiral arm structure
            // Start with random distance from center (weighted toward center)
            const distanceFromCenter = Math.pow(Math.random(), 0.5) * 50; // 0-50% from center for edge-to-edge
            
            // Select a random spiral arm
            const arm = Math.floor(Math.random() * spiralArms);
            
            // Angle depends on distance from center (creates spiral)
            const angle = (arm * 2 * Math.PI / spiralArms) + 
                         (distanceFromCenter / 100 * spiralTightness * Math.PI);
            
            // Add some random variation to make it look natural
            const noiseX = (Math.random() - 0.5) * spiralNoise * distanceFromCenter;
            const noiseY = (Math.random() - 0.5) * spiralNoise * distanceFromCenter;
            
            // Calculate position (50,50 is center of screen)
            left = 50 + Math.cos(angle) * distanceFromCenter + noiseX;
            
            // Bulge in the center (more stars)
            if (Math.random() < 0.3) {
              left = 50 + (Math.random() - 0.5) * 20;
            }
            
            // Ensure stars don't go off-screen
            left = Math.max(0, Math.min(100, left));
            
            // Vary star size based on distance from center
            width = height = `${Math.random() * 3}px`;
            color = `rgba(255, 255, 255, ${Math.random()})`;
            opacity = Math.random();
          } else {
            // Random star position
            left = Math.random() * 100;
            width = height = `${Math.random() * 3}px`;
            color = `rgba(255, 255, 255, ${Math.random()})`;
            opacity = Math.random();
          }
          
          newStars.push({
            width,
            height,
            top: `${top}%`,
            left: `${left}%`,
            backgroundColor: color,
            opacity,
            animationDelay: `${Math.random() * 5}s`,
          });
        }
      }
      // Stars beyond the fadeThreshold won't be included
    }
    setStars(newStars);
  };

  // Generate a random rotation angle for shooting stars
  const getRandomRotation = () => {
    // Random angle between 0 and 360 degrees with bias toward downward direction
    const direction = Math.random();
    
    if (direction < 0.6) {
      // 60% chance of downward direction (20-70 degrees)
      return Math.random() * 50 + 20;
    } else if (direction < 0.8) {
      // 20% chance of rightward direction (0-20 or 340-360 degrees)
      return Math.random() * 20;
    } else {
      // 20% chance of leftward direction (160-200 degrees)
      return Math.random() * 40 + 160;
    }
  };

  const createShootingStar = (x, y, angle) => {
    // Only create shooting stars in the top threshold area
    const screenHeight = window.innerHeight;
    const thresholdHeight = (fadeThreshold / 100) * screenHeight;
    
    if (y > thresholdHeight) {
      return; // Don't create shooting stars below the threshold
    }
    
    // Higher probability in the center (horizontally)
    const centerBias = 1 - Math.abs((x / window.innerWidth) - 0.5) * 1.5;
    if (Math.random() > centerBias) {
      return; // Skip based on horizontal position
    }
    
    // Create a unique ID for this star
    const id = Date.now();
    
    const newShootingStar = {
      id,
      x,
      y,
      rotation: angle,
      created: Date.now()
    };
    
    setShootingStars(prev => [...prev, newShootingStar]);
    
    // Remove the shooting star after animation completes
    setTimeout(() => {
      setShootingStars(prev => prev.filter(star => star.id !== id));
    }, starDuration * 1000); // Use the dynamic duration
  };

  return (
    <div 
      className="relative w-full h-screen bg-black flex overflow-hidden"
    >
      {/* Left sidebar with adjusted positioning */}
      <div className="w-96 z-20 pl-6 pt-16 flex flex-col">
        {/* Profile section - image and name side by side */}
        <div className="flex items-center ml-22 mb-20 relative">
          {/* Profile Picture - keep this fixed */}
          <img
            src="/pfp.png" 
            alt="Profile"
            className="w-45 h-70 rounded-lg object-cover"
          />
          
          {/* Name pushed further to the right */}
          <div className="ml-16 mb-28">
            <h1 className="text-white font-bold" style={{ fontSize: '48px', lineHeight: '1.1' }}>
              Mohammad<br/>
              Umar
            </h1>
            <h2 className="text-gray-400 font-medium" style={{ fontSize: '24px', color: '#b4b4b4' }}>
              CSE undergrad @ IIITD
            </h2>
          </div>
        </div>
        
        {/* Navigation buttons with 48px spacing and centered */}
        <div className="flex flex-col items-center" style={{ gap: '48px' }}>
          {["About me", "Projects", "Work", "Contact"].map((text) => (
            <button
              key={text}
              onClick={() => handleButtonClick(text)}
              className="text-center text-lg font-medium transition-colors duration-200 ease-in-out"
              style={{ 
                color: selectedButton === text ? '#FFFFFF' : '#B4B4B4'
              }}
            >
              {text}
            </button>
          ))}
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center">
        {/* Content based on selected button */}
        <div className="text-white p-6 relative z-40"> {/* Added z-40 to ensure it's above stars */}
          {selectedButton === "About me" && (
            <div className='user' style={{ userSelect: 'text', pointerEvents: 'auto' }}>
              <p className='pl-4 pr-50 pt-25'>I am a second-year Computer Science student at IIIT Delhi, with a strong interest in Quantum Computing and Quantum Information, particularly in quantum algorithms and quantum complexity theory.<br/>
                I am also passionate about algorithm design, quantum communication, and graph theory, as I enjoy exploring the mathematical and computational aspects of these fields
<br/>
<br/>
Beyond academics, I have a creative side and love engaging with fictional arts, 3D modeling, and animation. I also enjoy playing tennis and traveling
<br/>
<br/>
You can find my curriculum vitae <a href="https://drive.google.com/file/d/1NQIL1RazZmD2SdZ-9C6Eq7ggY7H8e1uB/view?usp=sharing">here</a>.
              </p>
            </div>
          )}
          
          {selectedButton === "Projects" && (
            <div>
              <h2 className="text-3xl mb-4">Projects</h2>
              <p>This is where my projects will be displayed.</p>
            </div>
          )}
          
          {selectedButton === "Work" && (
            <div>
              <h2 className="text-3xl mb-4">Work Experience</h2>
              <p>This is my work experience section.</p>
            </div>
          )}
          
          {selectedButton === "Contact" && (
            <div>
              <h2 className="text-3xl mb-4">Contact Me</h2>
              <p>Here&apos;s how you can get in touch with me.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Debug display 
      <div className="absolute top-4 right-4 bg-black/50 p-2 text-white text-sm z-50">
        Selected: {selectedButton}
      </div>
      */}
      
      {/* Star background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-0 animate-twinkle"
            style={star}
          />
        ))}
      </div>

      {shootingStars.map(star => (
        <div 
          key={star.id} 
          className="night"
          style={{
            transform: `translate(
              calc(${star.x}px + ${xOffset}vw), 
              calc(${star.y}px + ${yOffset}vh)
            ) rotateZ(${star.rotation}deg)`,
            zIndex: 30
          }}
        >
          <div className="star"></div>
        </div>
      ))}

      {/* Add a test button */}
      
      
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .animate-twinkle {
          animation: twinkle ${twinkleTime}s infinite;
        }
        
        .night {
          position: absolute;
          width: 300px;
          height: 300px;
          transform-origin: center center;
        }
        
        .star {
          position: absolute;
          left: 50%;
          top: 50%;
          height: 0.5px;
          background: linear-gradient(-45deg, #FFF, rgba(0, 0, 255, 0));
          border-radius: 999px;
          filter: drop-shadow(0 0 4px #FFF);
          animation: tail ${starDuration}s ease-in-out infinite,
                     falling ${starDuration}s ease-in-out infinite;
        }
        
        @keyframes tail {
          0% {
            width: 0;
          }
          30% {
            width: ${tailLength}px;
          }
          100% {
            width: 0;
          }
        }
        
        @keyframes falling {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(${travelDistance}px);
          }
        }

        /* Add these new styles */
        .user {
          pointer-events: auto !important;
          user-select: text !important;
          -webkit-user-select: text !important;
          -moz-user-select: text !important;
          -ms-user-select: text !important;
        }
        
        /* Make stars non-interactive */
        .absolute.bg-white.rounded-full {
          pointer-events: none;
        }
        
        /* Make shooting stars non-interactive */
        .night {
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
