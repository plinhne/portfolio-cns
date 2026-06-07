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

// GIAI ĐOẠN 1: Tạo folder -> Bắn pháo hoa -> Kích hoạt màn hình đen
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

    // Kích hoạt pháo hoa liên tục từ thư viện mới
// Kích hoạt pháo hoa theo chuẩn cú pháp thư viện @hiseb/confetti
try {
    if (typeof confetti === 'function') {
        confetti(); // Chỉ gọi một hàm duy nhất để bắn chùm pháo hoa mặc định
    }
} catch (error) {
    console.log("Lỗi nạp hiệu ứng pháo hoa.");
}


    // Làm mờ Windows XP và chuyển sang chế độ hiển thị màn hình chúc mừng màu đen che phủ
    setTimeout(() => {
        if (xpScreen && congratsScreen) {
            xpScreen.style.opacity = '0';
            xpScreen.style.visibility = 'hidden';
            
            congratsScreen.style.display = 'flex';
            congratsScreen.style.opacity = '1';
        }
    }, 2200);
}

// GIAI ĐOẠN 2: Bấm nút Xem đầy đủ portfolio -> Reveal mở màn hình Portfolio chính
function revealPortfolio() {
    if (!congratsScreen || !portfolioScreen) return;

    congratsScreen.style.opacity = '0';
    congratsScreen.style.visibility = 'hidden';
    
    setTimeout(() => {
        congratsScreen.style.display = 'none';
        portfolioScreen.style.visibility = 'visible';
        portfolioScreen.style.opacity = '1';
        
        // Mở khóa thanh cuộn dọc cho trình duyệt
        document.body.style.overflow = 'auto'; 
        
        // Kích hoạt ngay hiệu ứng trượt cuộn các Project đầu tiên
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
        // Ngăn chặn sự kiện click truyền xuống phía dưới (tránh lỗi context menu)
        e.stopPropagation();

        // 1. Ẩn màn hình XP hiện tại
        if (xpScreen) {
            xpScreen.style.opacity = '0';
            xpScreen.style.visibility = 'hidden';
        }
        
        // 2. Đảm bảo màn hình chúc mừng màu đen (congrats-screen) không hiện ra
        if (congratsScreen) {
            congratsScreen.style.display = 'none';
        }

        // 3. Hiện thẳng màn hình Portfolio chính
        if (portfolioScreen) {
            portfolioScreen.style.visibility = 'visible';
            portfolioScreen.style.opacity = '1';
            
            // Mở khóa thanh cuộn dọc cho trình duyệt
            document.body.style.overflow = 'auto'; 
            
            // Kích hoạt ngay hiệu ứng trượt cuộn các Project đầu tiên
            if (typeof handleScrollReveal === 'function') {
                handleScrollReveal();
            }
        }
    });
}

// ==========================================================================
// 5. HIỆU ỨNG CANVAS CÔNG NGHỆ (DÒNG KẺ XANH THEO CHUỘT)
// ==========================================================================
const canvas = document.getElementById('tech-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    // Cấu hình chuột
    const mouse = { x: null, y: null, radius: 150 };

    function resize() {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
    }
    
    window.addEventListener('resize', resize);
    resize();

    // Lấy tọa độ chuột khi di chuyển trong khu vực header
    canvas.parentElement.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    // Xóa tọa độ khi chuột rời khỏi
    canvas.parentElement.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Lớp Hạt (các chấm xanh)
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1.5; // Tốc độ di chuyển
            this.vy = (Math.random() - 0.5) * 1.5;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bật lại khi đập tường
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Tương tác chuột: Bị hút về phía chuột
            if (mouse.x != null && mouse.y != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    // Càng gần chuột hút càng mạnh
                    const force = (mouse.radius - distance) / mouse.radius; 
                    this.x += forceDirectionX * force * 3;
                    this.y += forceDirectionY * force * 3;
                }
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = '#00ff00';
            ctx.fill();
        }
    }

    function init() {
        particles = [];
        // Mật độ hạt tùy theo diện tích màn hình
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
            
            // Vẽ các dòng kẻ nối giữa các điểm gần nhau
            for (let j = i; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) { // Khoảng cách để nối dây
                    ctx.beginPath();
                    // Độ mờ của dây tỷ lệ nghịch với khoảng cách
                    ctx.strokeStyle = `rgba(0, 255, 0, ${1 - distance/100})`;
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
