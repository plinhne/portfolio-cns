document.addEventListener("DOMContentLoaded", function () {
  
  // ==========================================
  // 1. XỬ LÝ TÍNH NĂNG DARK MODE
  // ==========================================
  const toggleBtn = document.getElementById('toggle-dark');
  
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      toggleBtn.textContent = document.body.classList.contains('dark-mode') 
        ? "☀️ Light Mode" 
        : "🌙 Dark Mode";
    });
  }

  // ==========================================
  // 2. XỬ LÝ HIỆU ỨNG SCROLL REVAL
  // ==========================================
  const revealElements = document.querySelectorAll(".reveal-on-scroll");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        } else {
          // Cuộn ngược lên thì ẩn đi để cuộn xuống hiện lại
          entry.target.classList.remove("active");
        }
      });
    },
    {
      root: null,
      threshold: 0.1, // Xuất hiện 10% là kích hoạt hiệu ứng
    }
  );

  revealElements.forEach((element) => observer.observe(element));
});
