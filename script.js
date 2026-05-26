// Registering ScrollTrigger with GSAP Engine
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    init3DParticles();
    initGSAPAnimations();
    initCustomCursor();
    initMagneticElements();
});

// --- 1. 3D Particle Fluid Vector Canvas Logic ---
function init3DParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 10;
        }
        draw() {
            ctx.fillStyle = 'rgba(0, 242, 254, 0.4)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }
        update() {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.hypot(dx, dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            if (distance < mouse.radius) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 15;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 15;
                }
            }
        }
    }

    function init() {
        particles = [];
        const numberOfParticles = (canvas.width * canvas.height) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].draw();
            particles[i].update();
        }
        requestAnimationFrame(animate);
    }
    init();
    animate();
}

// --- 2. Custom Magnetic Cursor Tracking ---
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const dot = document.querySelector('.custom-cursor-dot');
    const links = document.querySelectorAll('.magnetic, a, .skill-glass-card');

    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.4, ease: 'power2.out' });
        gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.1 });
    });

    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.style.width = '50px';
            cursor.style.height = '50px';
            cursor.style.backgroundColor = 'rgba(0, 242, 254, 0.1)';
            cursor.style.borderColor = '#39ff14';
        });
        link.addEventListener('mouseleave', () => {
            cursor.style.width = '25px';
            cursor.style.height = '25px';
            cursor.style.backgroundColor = 'transparent';
            cursor.style.borderColor = '#00f2fe';
        });
    });
}

// --- 3. GSAP Timelines & ScrollTrigger Configuration ---
function initGSAPAnimations() {
    // Hero Entry Animation Sequence
    const tl = gsap.timeline();
    tl.from('.navbar', { y: -100, opacity: 0, duration: 1, ease: 'power4.out' })
      .from('.animate-hero', { opacity: 0, y: 50, duration: 1, stagger: 0.2, ease: 'power3.out' }, '-=0.5');

    // On-Scroll Dynamic Triggers
    const reveals = document.querySelectorAll('.gs-reveal');
    reveals.forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 60,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Dynamic Tracking Mesh Effect within Cards
    const cards = document.querySelectorAll('.skill-glass-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });
}

// --- 4. Magnetic Element Field Controls ---
function initMagneticElements() {
    const magneticElems = document.querySelectorAll('.magnetic');
    magneticElems.forEach(elem => {
        elem.addEventListener('mousemove', (e) => {
            const rect = elem.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(elem, { x: x * 0.4, y: y * 0.4, duration: 0.3, ease: 'power2.out' });
        });
        elem.addEventListener('mouseleave', () => {
            gsap.to(elem, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
        });
    });
}
