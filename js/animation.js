document.addEventListener('DOMContentLoaded', function() {
    initPageLoader();
    initParticleCanvas();
    initEnhancedScrollReveal();
    initAnimatedCounters();
    initSkillBars();
    initTypingAnimation();
    initMouseParallax();
    initCursorGlow();
    initHoverEffects();
    initSectionAnimations();
    initHeroAnimations();
    initStaggerAnimations();
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
            initHeroEntranceAnimations();
            initEnhancedScrollReveal();
        }, 2200);
    });

    setTimeout(() => {
        if (!loader.classList.contains('hidden')) {
            loader.classList.add('hidden');
        }
    }, 3000);
}

function initHeroEntranceAnimations() {
    const heroText = document.querySelector('.hero-text');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroText) {
        heroText.style.opacity = '1';
        heroText.style.transform = 'translateX(0)';
    }
    
    if (heroVisual) {
        heroVisual.style.opacity = '1';
        heroVisual.style.transform = 'translateX(0)';
    }
}

function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseParticle = null;

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
            const colors = ['0, 212, 255', '123, 44, 191', '255, 0, 110', '248, 152, 28', '109, 179, 63'];
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
            
            if (mouseParticle) {
                const dx = mouseParticle.x - this.x;
                const dy = mouseParticle.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const force = (150 - distance) / 150;
                    this.speedX += (dx / distance) * force * 0.02;
                    this.speedY += (dy / distance) * force * 0.02;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
            ctx.fill();
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity * 0.3})`;
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

    document.addEventListener('mousemove', (e) => {
        mouseParticle = { x: e.clientX, y: e.clientY };
    });

    document.addEventListener('mouseleave', () => {
        mouseParticle = null;
    });

    initParticles();
    animate();
}

function initEnhancedScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-section, .section-header, .about-content, .about-image, .about-text, .skills-grid, .coding-content, .projects-grid, .stats-grid, .resume-content, .contact-content, .contact-info, .contact-form, .footer-content');
    
    if (!revealElements.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('reveal-active');
                }, index * 50);
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    window.addEventListener('scroll', () => {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < window.innerHeight - 100) {
                element.classList.add('reveal-active');
            }
        });
    }, { passive: true });
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

function initCursorGlow() {
    const cursorGlow = document.getElementById('cursor-glow');
    
    if (!cursorGlow) return;
    
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });
}

function initHoverEffects() {
    const glowElements = document.querySelectorAll('.skill-item, .stat-card, .platform-card');
    glowElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            el.style.zIndex = '10';
        });
        el.addEventListener('mouseleave', () => {
            el.style.zIndex = '1';
        });
    });
}

function initSectionAnimations() {
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-animated');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

function initHeroAnimations() {
    const heroShapes = document.querySelectorAll('.hero-shape');
    
    heroShapes.forEach((shape, index) => {
        shape.style.animationDelay = `${index * 2}s`;
    });
    
    const profileContainer = document.querySelector('.profile-container');
    if (profileContainer) {
        profileContainer.style.opacity = '1';
        profileContainer.style.transform = 'scale(1)';
    }
}

function initStaggerAnimations() {
    const staggerGroups = document.querySelectorAll('.skills-list, .skills-tags, .tools-grid, .projects-grid, .stats-grid, .platform-stats, .achievements-list, .about-details, .project-tags, .project-tech, .resume-skills-preview');
    
    staggerGroups.forEach((group, groupIndex) => {
        const items = group.querySelectorAll(':scope > *');
        items.forEach((item, itemIndex) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = `opacity 0.5s ease ${itemIndex * 0.1}s, transform 0.5s ease ${itemIndex * 0.1}s`;
        });
    });

    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll(':scope > *');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 80);
                });
                staggerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    staggerGroups.forEach(group => {
        staggerObserver.observe(group);
    });
}
