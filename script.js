// ==========================================================================
// 1. LOGIC VẬN HÀNH MÀN HÌNH CHỜ WINDOWS XP & KÍCH HOẠT PHÁO HOA
// ==========================================================================

const desktop = document.getElementById('desktop');
const contextMenu = document.getElementById('context-menu');
const xpScreen = document.getElementById('xp-screen');
const portfolioScreen = document.getElementById('portfolio-screen');

// Hiển thị menu chuột phải trên màn hình Desktop Windows XP
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

// Ẩn menu chuột phải khi nhấp chuột trái ra ngoài
document.addEventListener('click', function() {
    if (contextMenu) contextMenu.style.display = 'none';
});

// Hàm tạo thư mục mới -> Kích hoạt pháo hoa chúc mừng -> Mở khóa Portfolio
function createNewFolder() {
    // 1. Tạo biểu tượng Thư mục mới trên màn hình XP
    const newFolder = document.createElement('div');
    newFolder.className = 'icon';
    newFolder.innerHTML = `
        <img src="https://wikimedia.org" alt="Folder">
        <span>New Folder</span>
    `;
    desktop.appendChild(newFolder);
    contextMenu.style.display = 'none';

    // 2. Bắn pháo hoa đa sắc màu liên tục trong 2.5 giây sử dụng thư viện canvas-confetti
    let duration = 2.5 * 1000;
    let end = Date.now() + duration;

    (function frame() {
        // Chùm pháo bên trái bắn chéo lên phải
        confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0, y: 0.85 } });
        // Chùm pháo bên phải bắn chéo lên trái
        confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1, y: 0.85 } });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());

    // 3. Làm mờ giao diện XP và hiển thị trang Portfolio cá nhân một cách mượt mà
    setTimeout(() => {
        xpScreen.style.opacity = '0';
        xpScreen.style.visibility = 'hidden';
        
        portfolioScreen.style.visibility = 'visible';
        portfolioScreen.style.opacity = '1';
        
        // Trả lại thanh cuộn dọc (scroll) bình thường cho trình duyệt
        document.body.style.overflow = 'auto'; 
        
        // Kích hoạt ngay lập tức hàm kiểm tra cuộn trang để hiển thị các phần tử đầu tiên
        handleScrollReveal();
    }, 2500);
}

// Cập nhật thời gian thực cho đồng hồ ở góc phải Taskbar XP
function updateClock() {
    const clockElement = document.getElementById('clock');
    if (!clockElement) return;
    
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12 || 12; // Chuyển định dạng 24h sang 12h
    clockElement.textContent = `${hours}:${minutes} ${ampm}`;
}
setInterval(updateClock, 1000);
updateClock();


// ==========================================================================
// 2. LOGIC NÚT ĐỔI CHẾ ĐỘ TỐI (DARK MODE) CHO PORTFOLIO
// ==========================================================================

const toggleDarkBtn = document.getElementById('toggle-dark');

if (toggleDarkBtn) {
    toggleDarkBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        // Cập nhật lại biểu tượng hiển thị trên nút bấm tương ứng với trạng thái
        if (document.body.classList.contains('dark-mode')) {
            toggleDarkBtn.textContent = '☀️ Light Mode';
        } else {
            toggleDarkBtn.textContent = '🌙 Dark Mode';
        }
    });
}


// ==========================================================================
// 3. HIỆU ỨNG TRƯỢT LÊN NỐI ĐUÔI NHAU KHI CUỘN CHUỘT (SCROLL REVEAL)
// ==========================================================================

const revealElements = document.querySelectorAll('.reveal-on-scroll');

function handleScrollReveal() {
    // Vòng lặp kiểm tra từng phần tử có class .reveal-on-scroll
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        // Nếu phần tử xuất hiện trong khung nhìn cách cạnh dưới màn hình 100px
        if (elementTop < windowHeight - 100) {
            element.classList.add('active');
        } else {
            element.classList.remove('active'); // Ẩn lại nếu cuộn ngược lên trên
        }
    });
}

// Lắng nghe sự kiện cuộn trang để kích hoạt hiệu ứng trượt của các Project
window.addEventListener('scroll', handleScrollReveal);
