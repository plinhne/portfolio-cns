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
