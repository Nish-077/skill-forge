"use client"
import React, { useEffect, useState } from 'react';
import './homepage.css'

const HomePage = () => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    // JavaScript code to handle animations and other effects
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-item');
    const progressBar = document.getElementById('progress-bar');

    const options = {
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          const sectionId = entry.target.getAttribute('id');
          navItems.forEach(item => {
            if (item instanceof HTMLElement) {
              item.classList.toggle('active', item.dataset.section === sectionId);
            }
          });
        }
      });
    }, options);

    sections.forEach(section => {
      observer.observe(section);
    });

    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      const visible = prevScrollPos > currentScrollPos;

      setVisible(visible);
      setPrevScrollPos(currentScrollPos);

      if (progressBar) {
        const scrollY = window.scrollY;
        const scrollHeight = document.body.scrollHeight - window.innerHeight;
        const progress = (scrollY / scrollHeight) * 100;
        progressBar.style.width = `${progress}%`;
      }
    };

    window.addEventListener('scroll', handleScroll);

    const gradientElement = document.getElementById('gradient-bg');
    let gradientAngle = 0;

    function animateGradient() {
      gradientAngle = (gradientAngle + 0.3) % 360;
      if (gradientElement) {
        gradientElement.style.background = `linear-gradient(${gradientAngle}deg, #000000, #0800fe, #9900d9)`;
      }
      requestAnimationFrame(animateGradient);
    }

    animateGradient();

    const handleNavClick = (event: Event) => {
      const targetId = (event.target as HTMLElement).dataset.section;
      console.log(targetId);
      const targetSection = targetId ? document.getElementById(targetId) : null;
      console.log(targetSection);
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop,
          behavior: 'smooth'
        });
      }
    };

    navItems.forEach(item => {
      item.addEventListener('click', handleNavClick);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      navItems.forEach(item => {
        item.removeEventListener('click', handleNavClick);
      });
    };
  }, [prevScrollPos, visible]);

  return (
    <div>
      <div id="gradient-bg" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }} />
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>SkillForge - Redefining Learning</title>
      <div id="canvas-container" />
      <div id="cursor" />
      <div id="progress-bar"></div>
      <section id="home" className="section">
        <h1 id="main-title">SkillForge</h1>
        <p id="subtitle">Revolutionizing learning through AI-driven personalization and project based certification</p>
        <button className="cta-button" onClick={() => window.location.href = 'http://localhost:3000/login'}>Embark on Your Journey</button>
      </section>
      <section id="about" className="section">
        <h2>Redefine Your Learning</h2>
        <p>SkillForge employs cutting-edge AI to create a learning experience as unique as you are. Our platform curates a course tailored to your learning needs in just a minute. Good-Bye to all the previous hassle that you&apos;d have to go through to find resources to study from.</p>
      </section>
      <section id="features" className="section">
        <h2>Future-Proof Skills</h2>
        <div className="feature-container">
          <div className="feature-box">
            <h3>AI-Driven Personalization</h3>
            <p>Our AI adapts course content and pacing to your unique learning style and goals. By analyzing your progress and preferences, it tailors the material to ensure you get the most effective and engaging learning experience possible, helping you to master new skills faster and with greater retention.</p>
          </div>
          <div className="feature-box">
            <h3>Gamified Learning</h3>
            <p>Earn points, badges, and level up as you acquire new skills and knowledge. Our gamified approach makes learning fun and motivating, encouraging you to continuously challenge yourself and achieve higher levels of expertise. Each milestone you reach will be a testament to your hard work and dedication.</p>
          </div>
          <div className="feature-box">
            <h3>Blockchain Certification</h3>
            <p>Receive immutable, verifiable credentials for your accomplishments. Our blockchain-based certification system ensures that your achievements are secure, tamper-proof, and recognized globally, providing you with a trusted and permanent record of your skills and knowledge.</p>
          </div>
        </div>
      </section>
      <section id="stats" className="section">
        <h2>Our Impact</h2>
        <div className="stats-container">
          <div>
            <div className="stat-number">12000</div>
            <div className="stat-label">Active Learners</div>
          </div>
          <div>
            <div className="stat-number">∞</div>
            <div className="stat-label">Courses</div>
          </div>
          <div>
            <div className="stat-number">5000</div>
            <div className="stat-label">Certificates Issued</div>
          </div>
        </div>
      </section>
      <section id="testimonials" className="section">
        <h2>What Our Users Say</h2>
        <div className="section-content">
          <div className="testimonial">
            <p>&quot;SkillForge has revolutionized my approach to learning. The interactive modules and real-world projects made complex concepts easy to grasp. I’ve seen a tangible improvement in my skills.&quot;</p>
            <div className="testimonial-author">- Emily Johnson</div>
          </div>
          <div className="testimonial">
            <p>&quot;The personalized learning path provided by SkillForge is incredible. The AI-driven recommendations have helped me focus on what truly matters for my career growth. Highly recommended!&quot;</p>
            <div className="testimonial-author">- Michael Brown</div>
          </div>
          <div className="testimonial">
            <p>&quot;SkillForge offers an unparalleled learning experience. The blend of theory and practical exercises keeps me engaged, and the certification adds real value to my professional profile.&quot;</p>
            <div className="testimonial-author">- Lisa Davis</div>
          </div>
          <div className="testimonial">
            <p>&quot;What sets SkillForge apart is its dedication to user engagement. The gamified learning approach not only makes the process enjoyable but also ensures deeper understanding and retention of knowledge.&quot;</p>
            <div className="testimonial-author">- Alex Martinez</div>
          </div>
          <div className="testimonial">
            <p>&quot;I’ve tried various learning platforms, but SkillForge stands out for its innovative teaching methods and effective use of technology. The impact on my professional development has been profound.&quot;</p>
            <div className="testimonial-author">- Jordan Lee</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;