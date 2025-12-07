// 8-script.js - Hamburger Menu Functionality

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;
    
    // Toggle Mobile Menu
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
        
        // Update ARIA attributes
        const isExpanded = hamburger.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
        
        // Announce menu state for screen readers
        const menuState = isExpanded ? 'Menu opened' : 'Menu closed';
        announceToScreenReader(menuState);
    }
    
    // Close Mobile Menu
    function closeMobileMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
    }
    
    // Handle Escape Key
    function handleEscapeKey(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    }
    
    // Handle Click Outside
    function handleClickOutside(e) {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
            closeMobileMenu();
        }
    }
    
    // Smooth Scroll to Section
    function smoothScroll(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId.startsWith('#')) {
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    closeMobileMenu();
                }
                
                // Smooth scroll to section
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Update active link
                updateActiveLink(this);
                
                // Announce navigation for screen readers
                const sectionName = this.textContent.trim();
                announceToScreenReader(`Navigated to ${sectionName} section`);
            }
        }
    }
    
    // Update Active Link
    function updateActiveLink(clickedLink) {
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        clickedLink.classList.add('active');
    }
    
    // Screen Reader Announcement
    function announceToScreenReader(message) {
        const announcement = document.getElementById('sr-announcement') || createAnnouncementElement();
        announcement.textContent = message;
        
        // Clear announcement after a delay
        setTimeout(() => {
            announcement.textContent = '';
        }, 1000);
    }
    
    // Create Screen Reader Announcement Element
    function createAnnouncementElement() {
        const announcement = document.createElement('div');
        announcement.id = 'sr-announcement';
        announcement.className = 'sr-only';
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        document.body.appendChild(announcement);
        return announcement;
    }
    
    // Handle Resize - Close menu on resize to desktop
    function handleResize() {
        if (window.innerWidth > 480 && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    }
    
    // Initialize ARIA attributes
    function initializeARIA() {
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-controls', 'nav-menu');
        
        navMenu.setAttribute('id', 'nav-menu');
        navMenu.setAttribute('aria-label', 'Main navigation');
    }
    
    // Add animation class on scroll for mobile
    function handleScroll() {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    }
    
    // Event Listeners
    hamburger.addEventListener('click', toggleMobileMenu);
    
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
    
    document.addEventListener('keydown', handleEscapeKey);
    document.addEventListener('click', handleClickOutside);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    // Initialize
    initializeARIA();
    createAnnouncementElement();
    
    // Set initial header style
    handleScroll();
    
    // Preload menu animation
    navMenu.style.transition = 'right 0.5s cubic-bezier(0.77, 0.2, 0.05, 1.0)';
    
    // Debug log (remove in production)
    console.log('Hamburger menu initialized successfully');
    
    // Mobile menu animation end handler
    navMenu.addEventListener('transitionend', function(e) {
        if (e.propertyName === 'right') {
            if (navMenu.classList.contains('active')) {
                // Menu fully opened
                navMenu.style.boxShadow = '-5px 0 25px rgba(0, 0, 0, 0.15)';
            } else {
                // Menu fully closed
                navMenu.style.boxShadow = 'none';
            }
        }
    });
});

// Add CSS for scroll behavior
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 480px) {
        .nav-link.active {
            color: #FF6565 !important;
            background-color: rgba(255, 101, 101, 0.1);
            padding-left: 30px !important;
            position: relative;
        }
        
        .nav-link.active::before {
            content: '';
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            width: 6px;
            height: 6px;
            background-color: #FF6565;
            border-radius: 50%;
        }
        
        /* Smooth scrolling for the whole page */
        html {
            scroll-behavior: smooth;
        }
        
        /* Prevent background scroll when menu is open */
        body.menu-open {
            overflow: hidden;
            position: fixed;
            width: 100%;
        }
    }
`;
document.head.appendChild(style);
