// ==========================================================================
// 1. LOGIC WINDOWS XP, PHÁO HOA & MỞ KHÓA PORTFOLIO
// ==========================================================================

const desktop = document.getElementById('desktop');
const contextMenu = document.getElementById('context-menu');
const xpScreen = document.getElementById('xp-screen');
const portfolioScreen = document.getElementById('portfolio-screen');

// Hiển thị menu chuột phải tùy chỉnh trên Desktop Windows XP
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

// Ẩn menu chuột phải khi nhấp chuột trái ra vùng trống
document.addEventListener('click', function() {
    if (contextMenu) contextMenu.style.display = 'none';
});

// Hàm tạo thư mục mới -> Bắn pháo hoa -> Kích hoạt hiển thị Portfolio
function createNewFolder() {
    if (!desktop) return;

    // 1. Tạo biểu tượng Folder (Thay link ảnh bằng link Imgur dự phòng chất lượng cao)
    const newFolder = document.createElement('div');
    newFolder.className = 'icon';
    newFolder.innerHTML = `
        <img src="https://imgur.com" alt="Folder">
        <span>New Folder</span>
    `;
    desktop.appendChild(newFolder);
    contextMenu.style.display = 'none';

    // 2. Chạy hiệu ứng pháo hoa (Đặt trong bọc bảo vệ try-catch)
    // Nếu mạng lỗi không tải được pháo hoa, trang web sẽ tự bỏ qua chứ không bị sập mã nguồn nữa
    try {
        let duration = 2.5 * 1000;
        let end = Date.now() + duration;

        (function frame() {
            confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0, y: 0.85 } });
            confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1, y: 0.85 } });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    } catch (error) {
        console.log("Không tải được hiệu ứng pháo hoa, tự động bỏ qua để chuẩn bị vào Portfolio.");
    }

    // 3. Thực hiện hiệu ứng chuyển trang (Luôn luôn chạy bất kể pháo hoa có lỗi hay không)
    setTimeout(() => {
        if (xpScreen && portfolioScreen) {
            xpScreen.style.opacity = '0';
            xpScreen.style.visibility = 'hidden';
            
            portfolioScreen.style.visibility = 'visible';
            portfolioScreen.style.opacity = '1';
            
            // Mở lại thanh cuộn dọc cho Portfolio
            document.body.style.overflow = 'auto'; 
            
            // Kích hoạt hiệu ứng cuộn trang Portfolio
            if (typeof handleScrollReveal === 'function') {
                handleScrollReveal();
            }
        }
    }, 2500); // Sau 2.5 giây từ lúc bấm tạo thư mục sẽ tự chuyển sang Portfolio
}

// Logic đồng hồ ở khay hệ thống Taskbar Windows XP
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
        
        // Hoán đổi chữ hiển thị tương ứng trạng thái
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
        
        // Kiểm tra xem thẻ ứng dụng đã lọt vào tầm nhìn của người xem chưa
        if (elementTop < windowHeight - 100) {
            element.classList.add('active');
        } else {
            element.classList.remove('active');
        }
    });
}

// Gắn sự kiện cuộn trang
window.addEventListener('scroll', handleScrollReveal);
