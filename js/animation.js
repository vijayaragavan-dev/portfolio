document.addEventListener('DOMContentLoaded', function() {
    initPageLoader();
    initParticleCanvas();
    initScrollReveal();
    initAnimatedCounters();
    initSkillBars();
    initTypingAnimation();
    initMouseParallax();
    initNavbarScroll();
    initCursorGlow();
    initHoverEffects();
});

function initPageLoader() {
    const loader = document.querySelector('.page-loader');
    const progress = document.querySelector('.loader-progress');
    const percentage = document.querySelector('.loader-percentage');
    
    if (!loader) return;

    let percent = 0;
    const duration = 2000;
    const interval = duration / 100;

    const timer = setInterval(() => {
        percent += Math.random() * 15;
        if (percent >= 100) {
            percent = 100;
            clearInterval(timer);
        }
        
        progress.style.width = percent + '%';
        percentage.textContent = Math.floor(percent) + '%';
    }, interval);

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = '';
        }, 2200);
    });

    setTimeout(() => {
        if (!loader.classList.contains('hidden')) {
            loader.classList.add('hidden');
        }
    }, 3000);
}

function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.color = this.getRandomColor();
        }

        getRandomColor() {
            const colors = [
                '0, 212, 255',
                '123, 44, 191',
                '255, 0, 110',
                '248, 152, 28',
                '109, 179, 63'
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

            this.opacity += (Math.random() - 0.5) * 0.02;
            if (this.opacity < 0.1) this.opacity = 0.1;
            if (this.opacity > 0.6) this.opacity = 0.6;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const particleCount = Math.min(100, (canvas.width * canvas.height) / 15000);
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    const opacity = (1 - distance / 150) * 0.15;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        drawConnections();
        
        requestAnimationFrame(animate);
    }

    initParticles();
    animate();
}

function initScrollReveal() {
    const revealElements = document.querySelectorAll('.section-header, .about-content, .about-image, .about-text, .skills-grid, .coding-content, .projects-grid, .stats-grid, .resume-content, .resume-text, .resume-preview, .contact-content, .contact-info, .contact-form, .footer-content');
    
    if (!revealElements.length) return;

    const revealOnScroll = () => {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 200;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll, { passive: true });
    
    setTimeout(revealOnScroll, 100);
    
    window.addEventListener('load', revealOnScroll);
}

function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    if (!counters.length) return;

    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    };

    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function initSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    if (!skillItems.length) return;

    const animateSkillBars = () => {
        skillItems.forEach((item, index) => {
            const skillPercent = item.getAttribute('data-skill');
            const progressBar = item.querySelector('.skill-progress');
            
            setTimeout(() => {
                if (progressBar) {
                    progressBar.style.width = skillPercent + '%';
                }
            }, index * 150);
        });
    };

    const skillSection = document.getElementById('skills');
    
    if (skillSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkillBars();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(skillSection);
    }
}

function initTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const roles = [
        'Java Full Stack Developer',
        'Spring Boot Developer',
        'Backend Engineer',
        'Problem Solver'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1000);
}

function initMouseParallax() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    const profileVisual = document.querySelector('.hero-visual');
    const heroText = document.querySelector('.hero-text');
    
    heroSection.addEventListener('mousemove', (e) => {
        if (profileVisual) {
            const x = (window.innerWidth / 2 - e.clientX) / 50;
            const y = (window.innerHeight / 2 - e.clientY) / 50;
            profileVisual.style.transform = `translate(${x}px, ${y}px)`;
        }
    });

    heroSection.addEventListener('mouseleave', () => {
        if (profileVisual) {
            profileVisual.style.transform = 'translate(0, 0)';
        }
    });
}

function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });
}

function initCursorGlow() {
    let cursorGlow = document.getElementById('cursor-glow');
    
    if (!cursorGlow) {
        cursorGlow = document.createElement('div');
        cursorGlow.id = 'cursor-glow';
        cursorGlow.style.cssText = `
            position: fixed;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%);
            pointer-events: none;
            z-index: -1;
            transform: translate(-50%, -50%);
            transition: opacity 0.3s;
        `;
        document.body.appendChild(cursorGlow);
    }
    
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });
}

function initHoverEffects() {
    const glowElements = document.querySelectorAll('.skill-item, .project-card, .stat-card, .platform-card');
    glowElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.style.zIndex = '10';
        });
        el.addEventListener('mouseleave', () => {
            el.style.zIndex = '1';
        });
    });
}
