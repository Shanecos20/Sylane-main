import { useState, useEffect, useRef } from 'react';
import './index.css';

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const cursorRef = useRef(null);
  const headerRef = useRef(null);
  const navRef = useRef(null);
  const mobileToggleRef = useRef(null);
  const testimonialSliderRef = useRef(null);
  const [animated, setAnimated] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState(false);
  
  // Define testimonials data
  const testimonials = [
    {
      quote: "Being part of Sylane's Cairde program has been incredibly rewarding. It's great to see the direct impact our contributions are making on the club's facilities and youth development programs. The sense of community is wonderful!",
      name: "Michael O'Connor",
      role: "Monthly subscriber since 2023"
    },
    {
      quote: "Joining Sylane Cairde has connected me with a fantastic community of hurling enthusiasts. The membership benefits are excellent, but knowing we're helping build a stronger future for the club is the real reward.",
      name: "Sarah Brennan",
      role: "Yearly subscriber since 2024"
    },
    {
      quote: "As someone who grew up playing with Sylane, it's incredible to see how the Cairde initiative is transforming our facilities. The progress tracker keeps us all motivated and it's great to see our community coming together for the club we love.",
      name: "Seamus Kelly",
      role: "Weekly subscriber since 2022"
    }
  ];

  useEffect(() => {
    // Custom cursor
    const cursor = cursorRef.current;
    const handleMouseMove = (e) => {
      if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
      }
    };
    
    const handleMouseDown = () => {
      if (cursor) cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
    };
    
    const handleMouseUp = () => {
      if (cursor) cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    };
    
    // Header scroll
    const header = headerRef.current;
    const handleScroll = () => {
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    };
    
    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Mobile navigation toggle
  const toggleMobileNav = () => {
    navRef.current.classList.toggle('active');
    mobileToggleRef.current.classList.toggle('active');
  };

  // Smooth scrolling
  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    
    document.querySelector(targetId).scrollIntoView({
      behavior: 'smooth'
    });
    
    // Close mobile menu if open
    if (navRef.current.classList.contains('active')) {
      navRef.current.classList.remove('active');
      mobileToggleRef.current.classList.remove('active');
    }
  };

  // Testimonial slider functions
  const showSlide = (index) => {
    let newIndex = index;
    if (index < 0) {
      newIndex = testimonials.length - 1;
    } else if (index >= testimonials.length) {
      newIndex = 0;
    }
    setCurrentSlide(newIndex);
  };

  // Animate numbers
  const animateNumber = (el, target) => {
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const animate = () => {
      current += increment;
      if (current < target) {
        el.textContent = Math.floor(current);
        requestAnimationFrame(animate);
      } else {
        el.textContent = target;
      }
    };
    
    animate();
  };

  // Check if element is in viewport
  const isInViewport = (element) => {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };
  
  // Animate stats when scrolled into view
  useEffect(() => {
    const handleScroll = () => {
      if (!animated) {
        const statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers.length > 0 && isInViewport(statNumbers[0])) {
          statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            animateNumber(stat, target);
          });
          setAnimated(true);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [animated]);
  
  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [currentSlide]);

  // Toggle accordion
  const toggleAccordion = () => {
    setAccordionOpen(!accordionOpen);
  };

  return (
    <>
      <div className="cursor" ref={cursorRef}></div>

      {/* Header Navigation */}
      <header className="header" ref={headerRef}>
        <div className="container header-inner">
          <a href="#" className="logo">
            <svg className="logo-icon" width="40" height="40" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 5C16.2 5 5 16.2 5 30C5 43.8 16.2 55 30 55C43.8 55 55 43.8 55 30C55 16.2 43.8 5 30 5ZM38 40L30 35.5L22 40V20H38V40Z" fill="#FFCC00"/>
            </svg>
            <span>SYLANE CAIRDE</span>
          </a>
          
          <div className="mobile-toggle" ref={mobileToggleRef} onClick={toggleMobileNav}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          
          <nav className="nav" ref={navRef}>
            <a href="#about" className="nav-link" onClick={(e) => handleSmoothScroll(e, '#about')}>About</a>
            <a href="#tiers" className="nav-link" onClick={(e) => handleSmoothScroll(e, '#tiers')}>Membership</a>
            <a href="#timeline" className="nav-link" onClick={(e) => handleSmoothScroll(e, '#timeline')}>Timeline</a>
            <a href="#testimonials" className="nav-link" onClick={(e) => handleSmoothScroll(e, '#testimonials')}>Testimonials</a>
            <a href="#" className="cta-button">Join Now</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="blob"></div>
          <div className="blob"></div>
          <div className="blob"></div>
        </div>
        <div className="container hero-content">
          <h1 className="hero-title animate__animated animate__fadeInUp">Cairde Sylane: <span className="highlight">Supporting</span> Our Club's Future</h1>
          <p className="hero-subtitle animate__animated animate__fadeInUp animate__delay-1s">Join a special group of supporters committed to the long-term development of Sylane Hurling Club. Your contributions make a lasting difference.</p>
          <div className="hero-cta animate__animated animate__fadeInUp animate__delay-2s">
            <a href="#tiers" className="cta-button" onClick={(e) => handleSmoothScroll(e, '#tiers')}>Become a Member</a>
            <a href="#about" className="secondary-button" onClick={(e) => handleSmoothScroll(e, '#about')}>Learn More</a>
          </div>
        </div>
        <div className="hero-scroller animate__animated animate__fadeIn animate__delay-3s">
          <span className="scroll-text">Scroll Down</span>
          <div className="scroll-icon">
            <div className="scroll-dot"></div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section">
        <div className="container">
          <h2 className="section-title">Cairde Sylane – Supporting Our Club's Future</h2>
          <div className="about-content">
            <div className="about-text">
              <p>Welcome to Cairde Sylane, a vital initiative supporting the growth and success of Sylane Hurling Club. As a community-driven club, we rely on the dedication of our players, coaches, supporters, and sponsors to ensure we continue to thrive.</p>
              <p>By joining Cairde Sylane, you become part of a special group of supporters who are committed to the long-term development of our club. Your contributions help us invest in:</p>
              
              <div className="benefits-list">
                <div className="benefit-item">
                  <i className="fas fa-check-circle"></i>
                  <div>
                    <strong>Player Development</strong> – Supporting coaching programs from underage to senior teams.
                  </div>
                </div>
                <div className="benefit-item">
                  <i className="fas fa-check-circle"></i>
                  <div>
                    <strong>Facilities & Equipment</strong> – Ensuring our players have the best resources to train and compete.
                  </div>
                </div>
                <div className="benefit-item">
                  <i className="fas fa-check-circle"></i>
                  <div>
                    <strong>Community Engagement</strong> – Strengthening the connection between Sylane Hurling Club and the wider community.
                  </div>
                </div>
              </div>
              
              <h3 className="about-subtitle">How to Get Involved</h3>
              <p>Becoming a member of Cairde Sylane is easy! Whether you're a lifelong supporter or new to the club, your involvement makes a difference. Choose from a range of support options and enjoy exclusive benefits as a valued member.</p>
              <p>Join us today and be part of Sylane Hurling Club's future success!</p>
              
              <div className="about-cta">
                <a href="#tiers" className="cta-button" onClick={(e) => handleSmoothScroll(e, '#tiers')}>View Subscription Plans</a>
              </div>
            </div>
            <div className="about-stats-container">
              <div className="about-image">
                <img src="https://sylanehc.ie/sylanehc/images/Gallery/IMG-20211227-WA0004.jpg" alt="Sylane Hurling in action" />
              </div>
              <div className="about-stats">
                <div className="stat-item">
                  <div className="stat-number" data-count="50">50+</div>
                  <div className="stat-label">Years of History</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number" data-count="300">300+</div>
                  <div className="stat-label">Club Members</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number" data-count="15">15</div>
                  <div className="stat-label">Teams Across Ages</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number" data-count="100%">100%</div>
                  <div className="stat-label">% Community Focused</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section id="tiers" className="section tiers">
        <div className="tiers-pattern"></div>
        <div className="container">
          <h2 className="section-title">Subscription Plans</h2>
          <div className="tiers-container">
            <div className="tier-card">
              <div className="tier-header">
                <h3 className="tier-name">Weekly</h3>
                <div className="tier-price">€5 <span>/ week</span></div>
                <p className="tier-description">Perfect for those who want to contribute on a weekly basis with maximum flexibility.</p>
              </div>
              <ul className="tier-features">
                <li><i className="fas fa-check"></i> Sylane Cairde membership</li>
                <li><i className="fas fa-check"></i> Support club development</li>
                <li><i className="fas fa-check"></i> Regular updates</li>
              </ul>
              <a href="#" className="cta-button">Select Plan</a>
            </div>
            <div className="tier-card featured">
              <div className="tier-header">
                <h3 className="tier-name">Monthly</h3>
                <div className="tier-price">€21 <span>/ month</span></div>
                <p className="tier-description">Our most popular plan, offering the perfect balance of benefits and commitment.</p>
              </div>
              <ul className="tier-features">
                <li><i className="fas fa-check"></i> Sylane Cairde membership</li>
                <li><i className="fas fa-check"></i> Support club development</li>
                <li><i className="fas fa-check"></i> Regular updates</li>
              </ul>
              <a href="#" className="cta-button">Select Plan</a>
            </div>
            <div className="tier-card">
              <div className="tier-header">
                <h3 className="tier-name">Quarterly</h3>
                <div className="tier-price">€63 <span>/ 3 months</span></div>
                <p className="tier-description">Perfect for those who prefer to contribute every three months with excellent value.</p>
              </div>
              <ul className="tier-features">
                <li><i className="fas fa-check"></i> Sylane Cairde membership</li>
                <li><i className="fas fa-check"></i> Support club development</li>
                <li><i className="fas fa-check"></i> Regular updates</li>
              </ul>
              <a href="#" className="cta-button">Select Plan</a>
            </div>
            <div className="tier-card">
              <div className="tier-header">
                <h3 className="tier-name">Yearly</h3>
                <div className="tier-price">€250 <span>/ year</span></div>
                <p className="tier-description">Our best value plan for committed supporters.</p>
              </div>
              <ul className="tier-features">
                <li><i className="fas fa-check"></i> Sylane Cairde membership</li>
                <li><i className="fas fa-check"></i> Support club development</li>
                <li><i className="fas fa-check"></i> Regular updates</li>
              </ul>
              <a href="#" className="cta-button">Select Plan</a>
            </div>
          </div>
        </div>
      </section>

      {/* Tax Relief Section */}
      <section className="section tax-relief">
        <div className="container">
          <div className="tax-relief-content">
            <div className="tax-relief-text">
              <div className="tax-relief-header">
                <h2 className="tax-relief-title">Support & Save</h2>
                <h3 className="tax-relief-subtitle">Tax Relief Benefits for Cairde Sylane</h3>
              </div>
              <p className="tax-relief-description">
                Did you know you could get tax back on your Cairde Sylane membership? Annual contributions of €250 or more qualify 
                for tax relief through the Revenue's Charitable Donation Scheme. This unique opportunity allows you to enhance your contribution 
                while helping us develop the future of our club.
              </p>
              
              <div className="tax-relief-accordion">
                <div className="accordion-item">
                  <button className="accordion-toggle" onClick={toggleAccordion}>
                    <span className="toggle-icon">
                      {accordionOpen ? '×' : '+'}
                    </span> 
                    How the Tax Relief Works
                  </button>
                  <div className={`accordion-content ${accordionOpen ? 'active' : ''}`}>
                    <div className="accordion-content-inner">
                      <p>
                        As a registered sports organization, Sylane Hurling Club can reclaim tax on qualifying donations under the <strong>Charitable 
                        Donation Scheme</strong>. This means your generosity goes even further - for every €250+ donation, we can claim additional funds 
                        from Revenue at no extra cost to you.
                      </p>
                      
                      <h4>Are You Eligible?</h4>
                      <p>
                        Tax relief is available to both <strong>PAYE</strong> and <strong>self-assessed</strong> taxpayers who have paid sufficient tax 
                        during the relevant year. The minimum qualifying donation is €250 within a single tax year, which works out at just €20.83 per month.
                      </p>
                      
                      <h4>Simple Process</h4>
                      <p>
                        The process is straightforward - just complete the CHY3 form (available below) with your basic details and PPS number. 
                        We'll handle the rest with Revenue, maximizing the value of your membership to the club.
                      </p>
                      
                      <h4>Your Contribution's Impact</h4>
                      <p>
                        See how your contribution grows through tax relief in this example:
                      </p>
                      
                      <div className="tax-relief-table">
                        <table>
                          <thead>
                            <tr>
                              <th>Your Annual Contribution</th>
                              <th>Your Tax Rate</th>
                              <th>Additional Funds to Club</th>
                              <th>Total Value to Sylane</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>€250</td>
                              <td>40%</td>
                              <td>€166</td>
                              <td>€416</td>
                            </tr>
                            <tr>
                              <td>€250</td>
                              <td>20%</td>
                              <td>€62</td>
                              <td>€312</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="tax-relief-buttons">
              <a href="#" className="document-link">
                <i className="fas fa-file-pdf"></i> <span>CHY3 Tax Relief Form</span>
              </a>
              <a href="#" className="document-link">
                <i className="fas fa-file-pdf"></i> <span>Direct Debit Mandate</span>
              </a>
              <a href="#" className="document-link">
                <i className="fas fa-file-pdf"></i> <span>Cairde Membership Guide</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Development Timeline Section */}
      <section id="timeline" className="section timeline-section">
        <div className="container">
          <h2 className="section-title">Redevelopment Progress</h2>
          <p className="timeline-description">Follow our journey as we transform Sylane Hurling Club with state-of-the-art facilities and improvements for our community.</p>
          
          <div className="timeline-container">
            <div className="timeline-line"></div>
            
            <div className="timeline-item">
              <div className="timeline-year-pointer">2023</div>
              <div className="timeline-content">
                <div className="timeline-phase">
                  <h3 className="phase-title">Phase 1 - Foundation & Land Acquisition</h3>
                  <div className="phase-year">2023</div>
                  <p className="phase-description">
                    Construction of our new wallball facility and strategic land acquisition for future development. 
                    This phase laid the groundwork for our comprehensive redevelopment plan.
                  </p>
                  <div className="phase-image">
                    <img src="/wallball.jpg" alt="Wallball Construction Progress" />
                  </div>
                  <div className="phase-status completed">Completed</div>
                </div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-year-pointer">2024</div>
              <div className="timeline-content">
                <div className="timeline-phase">
                  <h3 className="phase-title">Phase 2 - Clubhouse Redevelopment</h3>
                  <div className="phase-year">In Progress</div>
                  <p className="phase-description">
                    Complete renovation and modernization of our clubhouse facilities. This includes updated changing rooms, 
                    meeting spaces, and enhanced amenities for players and supporters.
                  </p>
                  <div className="phase-image">
                    <img src="/newclub.jpg" alt="New Clubhouse Development" />
                  </div>
                  <div className="phase-status in-progress">In Progress</div>
                </div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-year-pointer">2024</div>
              <div className="timeline-content">
                <div className="timeline-phase">
                  <h3 className="phase-title">Phase 3 - Pitch & Grounds Improvement</h3>
                  <div className="phase-year">Completed 2024</div>
                  <p className="phase-description">
                    Installation of new tarmac surfaces and comprehensive grounds improvement. 
                    Enhanced drainage, landscaping, and surface quality for optimal playing conditions.
                  </p>
                  <div className="phase-image">
                    <img src="/newpitches.jpg" alt="New Pitch and Grounds" />
                  </div>
                  <div className="phase-status completed">Completed</div>
                </div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-year-pointer">2025</div>
              <div className="timeline-content">
                <div className="timeline-phase">
                  <h3 className="phase-title">Phase 4 - Future Development</h3>
                  <div className="phase-year">Planned</div>
                  <p className="phase-description">
                    Development of additional pitches, spectator stands, and a new playground area. 
                    This final phase will complete our vision for a world-class community facility.
                  </p>
                  <div className="phase-image-placeholder">
                    <i className="fas fa-image"></i>
                    <span>Future Development Plans</span>
                  </div>
                  <div className="phase-status planned">Planned</div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Section */}
          <div className="timeline-video-section">
            <h3 className="video-section-title">Watch Our Progress</h3>
            <p className="video-section-description">See the transformation of Sylane Hurling Club through our development journey.</p>
            <div className="video-embed-placeholder">
              <div className="video-placeholder-content">
                <i className="fas fa-play-circle"></i>
                <span>Video will be embedded here</span>
                <p>Upload your video and replace this placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="section testimonials">
        <div className="container">
          <h2 className="section-title">What Our Members Say</h2>
          <div className="testimonials-container">
            <div className="testimonial-slider" ref={testimonialSliderRef}>
              {testimonials.map((testimonial, index) => (
                <div key={index} className={`testimonial-slide ${index === currentSlide ? 'active' : ''}`}>
                  <p className="testimonial-quote">{testimonial.quote}</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">
                      <img src="https://emedia1.nhs.wales/HEIW2/cache/file/F4C33EF0-69EE-4445-94018B01ADCF6FD4.png" alt="Testimonial avatar" />
                    </div>
                    <div className="testimonial-info">
                      <div className="testimonial-name">{testimonial.name}</div>
                      <div className="testimonial-role">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="testimonial-controls">
              <button className="testimonial-button prev-button" onClick={() => showSlide(currentSlide - 1)}>
                <i className="fas fa-arrow-left"></i>
              </button>
              <button className="testimonial-button next-button" onClick={() => showSlide(currentSlide + 1)}>
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
            <div className="testimonial-indicator">
              {testimonials.map((_, index) => (
                <div 
                  key={index} 
                  className={`indicator-dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => showSlide(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Be Part of Our Journey</h2>
            <p className="cta-text">Join Sylane Cairde today and help us build a brighter future for our club. Your support will make a lasting impact on our community for generations to come.</p>
            <div className="cta-buttons">
              <a href="#" className="cta-primary">Join Now</a>
              <a href="#" className="cta-secondary">Contact Us</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">Sylane Hurling Club</div>
              <p className="footer-description">Sylane Hurling Club is dedicated to the promotion and development of hurling in our community, providing opportunities for players of all ages and abilities.</p>
              <div className="footer-social">
                <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-youtube"></i></a>
              </div>
            </div>
            <div className="footer-nav">
              <h3 className="footer-nav-title">Quick Links</h3>
              <ul className="footer-nav-links">
                <li><a href="#" className="footer-nav-link">Home</a></li>
                <li><a href="#about" className="footer-nav-link" onClick={(e) => handleSmoothScroll(e, '#about')}>About</a></li>
                <li><a href="#tiers" className="footer-nav-link" onClick={(e) => handleSmoothScroll(e, '#tiers')}>Membership</a></li>
                <li><a href="#timeline" className="footer-nav-link" onClick={(e) => handleSmoothScroll(e, '#timeline')}>Timeline</a></li>
                <li><a href="#testimonials" className="footer-nav-link" onClick={(e) => handleSmoothScroll(e, '#testimonials')}>Testimonials</a></li>
              </ul>
            </div>
            <div className="footer-nav">
              <h3 className="footer-nav-title">Membership</h3>
              <ul className="footer-nav-links">
                <li><a href="#" className="footer-nav-link">Weekly Plan</a></li>
                <li><a href="#" className="footer-nav-link">Monthly Plan</a></li>
                <li><a href="#" className="footer-nav-link">Quarterly Plan</a></li>
                <li><a href="#" className="footer-nav-link">Yearly Plan</a></li>
                <li><a href="#" className="footer-nav-link">Benefits</a></li>
              </ul>
            </div>
            <div className="footer-nav">
              <h3 className="footer-nav-title">Contact</h3>
              <ul className="footer-nav-links">
                <li><a href="mailto:cairde@sylane.ie" className="footer-nav-link">cairde@sylane.ie</a></li>
                <li><a href="tel:+35391123456" className="footer-nav-link">+353 (0)91 123456</a></li>
                <li><a href="#" className="footer-nav-link">Sylane GAA, Galway</a></li>
                <li><a href="#" className="footer-nav-link">Privacy Policy</a></li>
                <li><a href="#" className="footer-nav-link">Terms & Conditions</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-copyright">
            <p>&copy; 2025 Sylane Hurling Club. All rights reserved. | Designed by Shane Costello</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
