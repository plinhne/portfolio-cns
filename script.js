// ==========================================================================
// 1. LOGIC WINDOWS XP, PHÁO HOA & ĐIỀU HƯỚNG TRUNG GIAN
// ==========================================================================

const desktop = document.getElementById('desktop');
const contextMenu = document.getElementById('context-menu');
const xpScreen = document.getElementById('xp-screen');
const congratsScreen = document.getElementById('congrats-screen');
const portfolioScreen = document.getElementById('portfolio-screen');

if (desktop) {
    desktop.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        if (e.target === desktop) {
            contextMenu.style.display = 'block';
            contextMenu.style.left = e.clientX + 'px';
            contextMenu.style.top = e.clientY + 'px';
        } else {
            contextMenu.style.display = 'none';
        }
    });
}

document.addEventListener('click', function() {
    if (contextMenu) contextMenu.style.display = 'none';
});

// Tạo folder -> Bắn pháo hoa -> Kích hoạt màn hình đen
function createNewFolder() {
    if (!desktop) return;

    const newFolder = document.createElement('div');
    newFolder.className = 'icon';
    newFolder.innerHTML = `
        <img src="folder.png" alt="Folder">
        <span>New Folder</span>
    `;
    desktop.appendChild(newFolder);
    contextMenu.style.display = 'none';

    try {
        if (typeof confetti === 'function') {
            confetti(); 
        }
    } catch (error) {
        console.log("Lỗi nạp hiệu ứng pháo hoa.");
    }

    setTimeout(() => {
        if (xpScreen && congratsScreen) {
            xpScreen.style.opacity = '0';
            xpScreen.style.visibility = 'hidden';
            
            congratsScreen.style.display = 'flex';
            congratsScreen.style.opacity = '1';
        }
    }, 2200);
}

// Bấm nút Xem đầy đủ portfolio
function revealPortfolio() {
    if (!congratsScreen || !portfolioScreen) return;

    congratsScreen.style.opacity = '0';
    congratsScreen.style.visibility = 'hidden';
    
    setTimeout(() => {
        congratsScreen.style.display = 'none';
        portfolioScreen.style.visibility = 'visible';
        portfolioScreen.style.opacity = '1';
        
        document.body.style.overflow = 'auto'; 
        
        if (typeof handleScrollReveal === 'function') {
            handleScrollReveal();
        }
    }, 800);
}

function updateClock() {
    const clockElement = document.getElementById('clock');
    if (!clockElement) return;
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    clockElement.textContent = `${hours}:${minutes} ${ampm}`;
}
setInterval(updateClock, 1000);
updateClock();

// ==========================================================================
// 2. LOGIC NÚT ĐỔI CHẾ ĐỘ TỐI (DARK MODE) CỦA PORTFOLIO
// ==========================================================================
const toggleDarkBtn = document.getElementById('toggle-dark');
if (toggleDarkBtn) {
    toggleDarkBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            toggleDarkBtn.textContent = '☀️ Light Mode';
        } else {
            toggleDarkBtn.textContent = '🌙 Dark Mode';
        }
    });
}

// ==========================================================================
// 3. HIỆU ỨNG TRƯỢT NỐI ĐUÔI KHI CUỘN CHUỘT (SCROLL REVEAL)
// ==========================================================================
const revealElements = document.querySelectorAll('.reveal-on-scroll');
function handleScrollReveal() {
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementTop < windowHeight - 100) {
            element.classList.add('active');
        } else {
            element.classList.remove('active');
        }
    });
}
window.addEventListener('scroll', handleScrollReveal);

// ==========================================================================
// 4. LOGIC NÚT BỎ QUA GAME (SKIP BUTTON)
// ==========================================================================
const skipBtn = document.getElementById('skip-btn');

if (skipBtn) {
    skipBtn.addEventListener('click', function(e) {
        e.stopPropagation();

        if (xpScreen) {
            xpScreen.style.opacity = '0';
            xpScreen.style.visibility = 'hidden';
        }
        
        if (congratsScreen) {
            congratsScreen.style.display = 'none';
        }

        if (portfolioScreen) {
            portfolioScreen.style.visibility = 'visible';
            portfolioScreen.style.opacity = '1';
            
            document.body.style.overflow = 'auto'; 
            
            if (typeof handleScrollReveal === 'function') {
                handleScrollReveal();
            }
        }
    });
}

// ==========================================================================
// 5. HIỆU ỨNG CANVAS CÔNG NGHỆ (DÒNG KẺ THEO CHUỘT)
// ==========================================================================
const canvas = document.getElementById('tech-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    const mouse = { x: null, y: null, radius: 150 };

    function resize() {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
    }
    
    window.addEventListener('resize', resize);
    resize();

    canvas.parentElement.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.parentElement.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1.5; 
            this.vy = (Math.random() - 0.5) * 1.5;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            if (mouse.x != null && mouse.y != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius; 
                    this.x += forceDirectionX * force * 3;
                    this.y += forceDirectionY * force * 3;
                }
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
            // Màu đổi theo chế độ
            const isDark = document.body.classList.contains('dark-mode');
            ctx.fillStyle = isDark ? '#0055ff' : '#ffffff'; 
            ctx.fill();
        }
    }

    function init() {
        particles = [];
        let numberOfParticles = (width * height) / 7000;
        for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            for (let j = i; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) { 
                    ctx.beginPath();
                    const isDark = document.body.classList.contains('dark-mode');
                    const alpha = 1 - distance/100;
                    // Dây nối đổi màu theo chế độ
                    ctx.strokeStyle = isDark ? `rgba(0, 85, 255, ${alpha})` : `rgba(255, 255, 255, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    init();
    animate();
}