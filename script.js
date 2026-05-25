// ==========================================================================
// 1. LOGIC WINDOWS XP, PHÁO HOA & ĐIỀU HƯỚNG TRUNG GIAN
// ==========================================================================

const desktop = document.getElementById('desktop');
const contextMenu = document.getElementById('context-menu');
const xpScreen = document.getElementById('xp-screen');
const congratsScreen = document.getElementById('congrats-screen');
const portfolioScreen = document.getElementById('portfolio-screen');

// Hiện menu chuột phải trên Desktop XP
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

// GIAI ĐOẠN 1: Tạo thư mục mới -> Bắn pháo hoa -> Hiện màn hình chúc mừng tối màu
function createNewFolder() {
    if (!desktop) return;

    // Sinh Folder lớn trên Desktop
    const newFolder = document.createElement('div');
    newFolder.className = 'icon';
    newFolder.innerHTML = `
        <img src="folder.png" alt="Folder">
        <span>New Folder</span>
    `;
    desktop.appendChild(newFolder);
    contextMenu.style.display = 'none';

    // Kích hoạt bắn pháo hoa liên tục
    try {
        if (typeof confetti !== 'undefined' && typeof confetti.start === 'function') {
            confetti.start();
            setTimeout(() => {
                confetti.stop();
            }, 1800);
        }
    } catch (error) {
        console.log("Lỗi thư viện pháo hoa.");
    }

    // Chuyển từ màn hình Windows XP sang màn hình đen chúc mừng trung gian
    setTimeout(() => {
        if (xpScreen && congratsScreen) {
            xpScreen.style.opacity = '0';
            xpScreen.style.visibility = 'hidden';
            
            congratsScreen.style.display = 'flex';
        }
    }, 2200);
}

// GIAI ĐOẠN 2: Người dùng bấm nút "Xem đầy đủ portfolio" -> Chuyển cảnh reveal Portfolio
function revealPortfolio() {
    if (!congratsScreen || !portfolioScreen) return;

    // Ẩn màn hình chúc mừng
    congratsScreen.style.opacity = '0';
    congratsScreen.style.visibility = 'hidden';
    
    // Hiển thị mượt mà trang Portfolio chính
    setTimeout(() => {
        congratsScreen.style.display = 'none';
        portfolioScreen.style.visibility = 'visible';
        portfolioScreen.style.opacity = '1';
        
        // Mở khóa thanh cuộn dọc cho trình duyệt để xem Portfolio
        document.body.style.overflow = 'auto'; 
        
        // Kích hoạt ngay hiệu ứng trượt cuộn các Project đầu tiên
        if (typeof handleScrollReveal === 'function') {
            handleScrollReveal();
        }
    }, 800);
}

// Đồng hồ hệ thống Taskbar Win XP
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
