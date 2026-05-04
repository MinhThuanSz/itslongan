// Initialize AOS (Animate on Scroll)
AOS.init({
  duration: 1000,
  easing: 'ease-in-out',
  once: true,
  mirror: false,
  offset: 100,
});

// Header scroll effect
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
    header.style.padding = '0.5rem 0';
    header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)';
    header.style.background = 'rgba(255, 255, 255, 0.9)';
    header.style.backdropFilter = 'blur(10px)';
  } else {
    header.classList.remove('scrolled');
    header.style.padding = '1rem 0';
    header.style.boxShadow = 'none';
    header.style.background = 'rgba(255, 255, 255, 0.8)';
  }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Subtle 3D Tilt Effect for cards
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 25;
    const rotateY = (centerX - x) / 25;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
  });
});

// Form Submission (Simulated)
const contactForm = document.querySelector('form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Cảm ơn bạn đã gửi yêu cầu! Chúng tôi sẽ liên hệ lại sớm nhất.');
    contactForm.reset();
  });
}

// Automatic Slideshow for About Section
const slides = document.querySelectorAll('.slide');
if (slides.length > 0) {
  let currentSlide = 0;
  function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }
  setInterval(nextSlide, 4000); // Change image every 4 seconds
}

// Mobile Sidebar Logic
const menuToggle = document.getElementById('menuToggle');
const closeSidebar = document.getElementById('closeSidebar');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarLinks = document.querySelectorAll('.sidebar-link');

function toggleSidebar() {
  sidebar.classList.toggle('active');
  sidebarOverlay.classList.toggle('active');
  document.body.classList.toggle('body-locked');
}

if (menuToggle) {
  menuToggle.addEventListener('click', toggleSidebar);
}

if (closeSidebar) {
  closeSidebar.addEventListener('click', toggleSidebar);
}

if (sidebarOverlay) {
  sidebarOverlay.addEventListener('click', toggleSidebar);
}

// Close sidebar when clicking a link
sidebarLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (sidebar.classList.contains('active')) {
      toggleSidebar();
    }
  });
});

// Close on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && sidebar.classList.contains('active')) {
    toggleSidebar();
  }
});

// Scroll-Spy & Active Link Highlight
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link, .sidebar-link');

const observerOptions = {
  root: null,
  rootMargin: '-10% 0px -70% 0px',
  threshold: 0
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, observerOptions);

sections.forEach(section => observer.observe(section));

console.log('ITS Long An 2026 Premium UI Activated');
