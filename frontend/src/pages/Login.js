import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Settings & Carousel States
  const [settings, setSettings] = useState(null);
  const [carouselImages, setCarouselImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Fetch System Settings (Colors & Logo)
    axios.get('/api/settings')
      .then(res => setSettings(res.data))
      .catch(err => console.error(err));

    // 2. Fetch Carousel Images
    axios.get('/api/settings/carousel')
      .then(res => setCarouselImages(res.data))
      .catch(err => console.error(err));
  }, []);

  // 3. Auto-play the carousel every 5 seconds
  useEffect(() => {
    if (carouselImages.length <= 1) return; // Don't run timer if there's only 0 or 1 image
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000); 
    
    return () => clearInterval(interval); // Cleanup timer to prevent memory leaks
  }, [carouselImages.length]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); 
    try {
      const res = await axios.post('/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token); 
      if (res.data.role === 'admin' || res.data.role === 'superadmin') {
        navigate('/admin');
      } else {
        navigate('/employee'); 
      }
    } catch (err) {
      setError("Invalid username or password. Please try again.");
    }
  };

  // Function to go to the next slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  // Function to go to the previous slide
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <div className="login-split-container">
      
      {/* LEFT SIDE: CAROUSEL WITH CONTROLS */}
      {/* We use the secondary color as the background padding */}
      <div className="login-left-carousel" style={{ backgroundColor: settings?.secondary_color || '#000' }}>
        
        <div className="carousel-container">
          {carouselImages.length > 0 ? (
            <>
              {/* The Images */}
              {carouselImages.map((img, index) => (
                <div key={img.id} className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}>
                  <img 
                    src={`/uploads/${img.image_path}`} 
                    alt={`Slide ${index}`} 
                    className="carousel-image"
                  />
                </div>
              ))}

              {/* Arrow Buttons (Only show if more than 1 image) */}
              {carouselImages.length > 1 && (
                <>
                  <button className="carousel-arrow left" onClick={prevSlide}>
                    <FaChevronLeft />
                  </button>
                  <button className="carousel-arrow right" onClick={nextSlide}>
                    <FaChevronRight />
                  </button>
                </>
              )}

              {/* Indicator Dots */}
              <div className="carousel-indicators">
                {carouselImages.map((_, index) => (
                  <button 
                    key={index} 
                    className={`indicator-dot ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(index)} // Click a dot to jump to that slide
                  />
                ))}
              </div>
            </>
          ) : (
            // Fallback placeholder if no images exist
            <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
              Currently no images uploaded.
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE: FORM WITH DYNAMIC GRADIENT */}
      <div 
        className="login-right-form" 
        style={{ 
          // This creates a sleek gradient fading from pure white into the Superadmin's secondary color!
          background: `linear-gradient(135deg, #ffffff 40%, ${settings?.secondary_color || '#2c3e50'} 100%)` 
        }}
      >
        <div className="login-card">
          
          {settings?.logo_path ? (
            <img src={`/uploads/${settings.logo_path}`} alt="School Logo" className="login-logo" />
          ) : (
            <h2 style={{ color: '#2c3e50', margin: '0 0 20px 0' }}>Staff Portal</h2>
          )}
          
          <h3 style={{ color: '#7f8c8d', margin: '0 0 30px 0', fontSize: '16px', fontWeight: 'normal' }}>
            Sign in to manage the queue
          </h3>

          {error && <div className="error-box">{error}</div>}

          <form onSubmit={handleLogin}>
            
            <div className="input-group">
              <FaUser className="input-icon" />
              <input type="text" className="login-input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            
            <div className="input-group">
              <FaLock className="input-icon" />
              <input type="password" className="login-input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <button type="submit" className="login-btn" style={{ backgroundColor: settings?.primary_color || '#27ae60' }}>
              LOGIN
            </button>
            
          </form>
        </div>
      </div>
      
    </div>
  );
}

export default Login;