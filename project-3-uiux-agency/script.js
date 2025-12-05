// DOM Ready Function
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.98)';
            navbar.style.padding = '15px 0';
        } else {
            navbar.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
            navbar.style.padding = '20px 0';
        }
    });
    
    // Form submission
    const contactForm = document.getElementById('projectForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!name || !email || !message) {
                alert('لطفاً تمامی فیلدهای ضروری را پر کنید.');
                return;
            }
            
            // In a real application, you would send this data to a server
            // For this demo, we'll just show a success message
            alert(`متشکریم ${name}! درخواست همکاری شما دریافت شد. به زودی با شما تماس خواهیم گرفت.`);
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // Animate elements on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements to animate
    const elementsToAnimate = document.querySelectorAll('.service-card, .project-card, .feature, .team-member');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
    
    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .service-card, .project-card, .feature, .team-member {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .service-card.animate-in, 
        .project-card.animate-in, 
        .feature.animate-in, 
        .team-member.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Staggered animation for service cards */
        .service-card:nth-child(1) { transition-delay: 0.1s; }
        .service-card:nth-child(2) { transition-delay: 0.2s; }
        .service-card:nth-child(3) { transition-delay: 0.3s; }
        
        /* Staggered animation for project cards */
        .project-card:nth-child(1) { transition-delay: 0.1s; }
        .project-card:nth-child(2) { transition-delay: 0.2s; }
        .project-card:nth-child(3) { transition-delay: 0.3s; }
        
        /* Staggered animation for features */
        .feature:nth-child(1) { transition-delay: 0.1s; }
        .feature:nth-child(2) { transition-delay: 0.2s; }
        .feature:nth-child(3) { transition-delay: 0.3s; }
        .feature:nth-child(4) { transition-delay: 0.4s; }
        
        /* Staggered animation for team members */
        .team-member:nth-child(1) { transition-delay: 0.1s; }
        .team-member:nth-child(2) { transition-delay: 0.2s; }
        .team-member:nth-child(3) { transition-delay: 0.3s; }
    `;
    document.head.appendChild(style);
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add hover effect to timeline steps
    const timelineSteps = document.querySelectorAll('.timeline-step');
    timelineSteps.forEach(step => {
        step.addEventListener('mouseenter', function() {
            this.querySelector('.step-number').style.transform = 'scale(1.1)';
        });
        
        step.addEventListener('mouseleave', function() {
            this.querySelector('.step-number').style.transform = 'scale(1)';
        });
    });
    
    // Add current year to copyright
    const copyrightElement = document.querySelector('.copyright');
    if (copyrightElement) {
        const currentYear = new Date().getFullYear();
        copyrightElement.innerHTML = copyrightElement.innerHTML.replace('2023', currentYear);
    }
    
    // Console greeting
    console.log('%c👋 سلام! به سایت استودیو طراحی UI/UX نُوا خوش آمدید.', 
        'color: #00d4ff; font-size: 16px; font-weight: bold;');
    console.log('%cاین سایت با HTML، CSS و JavaScript خالص توسعه داده شده است.', 
        'color: #6a11cb; font-size: 14px;');
});