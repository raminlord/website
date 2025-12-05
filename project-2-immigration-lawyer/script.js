// تنظیمات اولیه و ثابت‌ها
document.addEventListener('DOMContentLoaded', function() {
    // مقداردهی اولیه AOS (انیمیشن‌های اسکرول)
    AOS.init({
        duration: 800,
        offset: 100,
        once: true,
        easing: 'ease-out-cubic'
    });
    
    // تنظیمات زبان
    const currentLang = 'fa'; // زبان پیش‌فرض فارسی
    initLanguage(currentLang);
    
    // اجرای تمام قابلیت‌ها
    initHeaderScroll();
    initMobileMenu();
    initLanguageSwitcher();
    initCounterAnimations();
    initFormSubmission();
    initSmoothScrolling();
    initStatsCounter();
});

/* ========== مدیریت زبان (دو زبانه) ========== */
function initLanguage(defaultLang) {
    // تنظیم زبان پیش‌فرض
    setLanguage(defaultLang);
    
    // ذخیره زبان در localStorage
    localStorage.setItem('preferredLanguage', defaultLang);
}

function setLanguage(lang) {
    // مخفی کردن تمام متون انگلیسی
    const englishElements = document.querySelectorAll('.english');
    const persianElements = document.querySelectorAll('.persian');
    
    if (lang === 'fa') {
        // نمایش فارسی، مخفی کردن انگلیسی
        persianElements.forEach(el => {
            el.style.display = 'block';
        });
        englishElements.forEach(el => {
            el.style.display = 'none';
        });
        
        // تغییر جهت صفحه
        document.documentElement.dir = 'rtl';
        document.documentElement.lang = 'fa';
        
        // آپدیت دکمه‌های زبان
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === 'fa') {
                btn.classList.add('active');
            }
        });
    } else {
        // نمایش انگلیسی، مخفی کردن فارسی
        persianElements.forEach(el => {
            el.style.display = 'none';
        });
        englishElements.forEach(el => {
            el.style.display = 'block';
        });
        
        // تغییر جهت صفحه
        document.documentElement.dir = 'ltr';
        document.documentElement.lang = 'en';
        
        // آپدیت دکمه‌های زبان
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === 'en') {
                btn.classList.add('active');
            }
        });
    }
    
    // آپدیت AOS برای تغییر زبان
    AOS.refresh();
}

function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedLang = this.dataset.lang;
            setLanguage(selectedLang);
            localStorage.setItem('preferredLanguage', selectedLang);
            
            // انیمیشن تغییر زبان
            this.classList.add('lang-change-animation');
            setTimeout(() => {
                this.classList.remove('lang-change-animation');
            }, 300);
        });
    });
    
    // بررسی زبان ذخیره شده
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
        setLanguage(savedLang);
    }
}

/* ========== هدر و اسکرول ========== */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // اضافه کردن کلاس scrolled وقتی اسکرول می‌کنیم
        if (currentScroll > 100) {
            header.classList.add('scrolled');
            
            // مخفی کردن هدر وقتی به پایین اسکرول می‌کنیم
            if (currentScroll > lastScroll && currentScroll > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        } else {
            header.classList.remove('scrolled');
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
}

/* ========== منوی موبایل ========== */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    // باز کردن منوی موبایل
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // انیمیشن ورود
        setTimeout(() => {
            mobileMenuOverlay.style.opacity = '1';
        }, 10);
    });
    
    // بستن منوی موبایل
    mobileMenuClose.addEventListener('click', function() {
        closeMobileMenu();
    });
    
    // بستن منو با کلیک روی لینک‌ها
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            closeMobileMenu();
            
            // اسکرول به بخش مورد نظر بعد از بسته شدن منو
            setTimeout(() => {
                smoothScrollTo(targetId);
            }, 500);
        });
    });
    
    // بستن منو با کلیک بیرون از آن
    mobileMenuOverlay.addEventListener('click', function(e) {
        if (e.target === mobileMenuOverlay) {
            closeMobileMenu();
        }
    });
    
    // بستن منو با کلید Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    function closeMobileMenu() {
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // انیمیشن خروج
        mobileMenuOverlay.style.opacity = '0';
    }
}

/* ========== اسکرول نرم ========== */
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // بستن منوی موبایل اگر باز است
            const mobileMenu = document.querySelector('.mobile-menu-overlay');
            if (mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            
            smoothScrollTo(targetId);
        });
    });
    
    // دکمه‌های CTA
    const ctaButtons = document.querySelectorAll('.cta-btn[href^="#"]');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                smoothScrollTo(this.getAttribute('href'));
            }
        });
    });
}

function smoothScrollTo(targetId) {
    if (targetId === '#home') {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        return;
    }
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

/* ========== انیمیشن شمارنده‌ها ========== */
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // سرعت شمارش
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function startCounter(counter) {
    const target = parseInt(counter.dataset.count);
    const increment = target / speed;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            counter.textContent = target;
            clearInterval(timer);
            
            // انیمیشن تکمیل
            counter.style.transform = 'scale(1.1)';
            setTimeout(() => {
                counter.style.transform = 'scale(1)';
            }, 300);
        } else {
            counter.textContent = Math.floor(current);
        }
    }, 10);
}

/* ========== مدیریت فرم ========== */
function initFormSubmission() {
    const consultationForm = document.getElementById('consultationForm');
    
    if (consultationForm) {
        consultationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // جمع‌آوری داده‌های فرم
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                visaType: document.getElementById('visa-type').value,
                message: document.getElementById('message').value,
                date: new Date().toISOString()
            };
            
            // اعتبارسنجی اولیه
            if (validateForm(formData)) {
                submitForm(formData);
            }
        });
    }
    
    // اعتبارسنجی زمان تایپ
    const formInputs = consultationForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateForm(formData) {
    let isValid = true;
    
    // بررسی نام
    if (!formData.name || formData.name.trim().length < 2) {
        showFieldError('name', 'لطفا نام کامل خود را وارد کنید');
        isValid = false;
    }
    
    // بررسی ایمیل
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
        showFieldError('email', 'لطفا یک ایمیل معتبر وارد کنید');
        isValid = false;
    }
    
    // بررسی شماره تلفن
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!formData.phone || !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
        showFieldError('phone', 'لطفا شماره تلفن معتبر وارد کنید');
        isValid = false;
    }
    
    // بررسی نوع ویزا
    if (!formData.visaType) {
        showFieldError('visa-type', 'لطفا نوع ویزا را انتخاب کنید');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const fieldId = field.id;
    const value = field.value.trim();
    
    switch (fieldId) {
        case 'name':
            if (value.length < 2) {
                showFieldError(fieldId, 'نام باید حداقل ۲ کاراکتر باشد');
                return false;
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(fieldId, 'ایمیل وارد شده معتبر نیست');
                return false;
            }
            break;
            
        case 'phone':
            const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
            if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                showFieldError(fieldId, 'شماره تلفن معتبر نیست');
                return false;
            }
            break;
            
        case 'visa-type':
            if (!value) {
                showFieldError(fieldId, 'لطفا نوع ویزا را انتخاب کنید');
                return false;
            }
            break;
    }
    
    clearFieldError(fieldId);
    return true;
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    
    // حذف خطاهای قبلی
    const existingError = formGroup.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // اضافه کردن خطای جدید
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #ff6b6b;
        font-size: 0.9rem;
        margin-top: 8px;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `;
    
    formGroup.appendChild(errorElement);
    field.style.borderColor = '#ff6b6b';
    
    // انیمیشن خطا
    field.style.transform = 'translateX(-10px)';
    setTimeout(() => {
        field.style.transform = 'translateX(0)';
    }, 300);
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.field-error');
    
    if (errorElement) {
        errorElement.remove();
    }
    
    field.style.borderColor = 'rgba(255, 255, 255, 0.2)';
}

function submitForm(formData) {
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // نمایش وضعیت در حال ارسال
    submitBtn.innerHTML = `
        <i class="fas fa-spinner fa-spin"></i>
        <span class="persian">در حال ارسال...</span>
        <span class="english">Sending...</span>
    `;
    submitBtn.disabled = true;
    
    // شبیه‌سازی ارسال به سرور (در حالت واقعی باید به API endpoint ارسال شود)
    setTimeout(() => {
        // نمایش موفقیت آمیز بودن ارسال
        showSuccessMessage();
        
        // بازنشانی فرم
        document.getElementById('consultationForm').reset();
        
        // بازگرداندن دکمه به حالت اولیه
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // ارسال به Google Analytics (در صورت وجود)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                'event_category': 'consultation',
                'event_label': formData.visaType
            });
        }
        
        // لاگ کردن داده‌ها در کنسول (برای تست)
        console.log('Form submitted:', formData);
        
    }, 2000);
}

function showSuccessMessage() {
    // ایجاد عنصر پیام موفقیت
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <div>
                <h4 class="persian">درخواست شما ثبت شد!</h4>
                <h4 class="english">Your request has been submitted!</h4>
                <p class="persian">همکاران ما در کمتر از ۲۴ ساعت با شما تماس خواهند گرفت.</p>
                <p class="english">Our colleagues will contact you within 24 hours.</p>
            </div>
        </div>
    `;
    
    // استایل‌های پیام موفقیت
    successMessage.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #2ecc71, #27ae60);
        color: white;
        padding: 20px 25px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(46, 204, 113, 0.3);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.5s ease;
        border-left: 5px solid #27ae60;
    `;
    
    successMessage.querySelector('.success-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 15px;
    `;
    
    successMessage.querySelector('i').style.cssText = `
        font-size: 2.5rem;
        color: white;
    `;
    
    successMessage.querySelector('h4').style.cssText = `
        margin: 0 0 5px 0;
        color: white;
        font-size: 1.1rem;
    `;
    
    successMessage.querySelector('p').style.cssText = `
        margin: 0;
        font-size: 0.95rem;
        opacity: 0.9;
    `;
    
    // اضافه کردن به صفحه
    document.body.appendChild(successMessage);
    
    // حذف خودکار بعد از 5 ثانیه
    setTimeout(() => {
        successMessage.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => {
            if (successMessage.parentNode) {
                successMessage.parentNode.removeChild(successMessage);
            }
        }, 500);
    }, 5000);
    
    // امکان بستن دستی
    successMessage.addEventListener('click', function() {
        this.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
        }, 500);
    });
}

/* ========== انیمیشن آمار ========== */
function initStatsCounter() {
    const statsSection = document.querySelector('.hero-stats');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // اجرای شمارنده‌ها
                const counters = document.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    const target = parseInt(counter.dataset.count);
                    animateCounter(counter, target);
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    if (statsSection) {
        observer.observe(statsSection);
    }
}

function animateCounter(counter, target) {
    let current = 0;
    const increment = target / 100;
    const duration = 2000; // 2 ثانیه
    const interval = duration / 100;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            counter.textContent = target;
            clearInterval(timer);
            
            // انیمیشن تکمیل
            counter.style.transform = 'scale(1.1)';
            counter.style.color = '#D4AF37';
            setTimeout(() => {
                counter.style.transform = 'scale(1)';
            }, 300);
        } else {
            counter.textContent = Math.floor(current);
        }
    }, interval);
}

/* ========== انیمیشن‌های CSS ========== */
// اضافه کردن استایل‌های انیمیشن به صورت دینامیک
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
        100% {
            transform: scale(1);
        }
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }
    
    .lang-change-animation {
        animation: pulse 0.3s ease;
    }
    
    .service-card:hover .service-icon {
        animation: float 1s ease infinite;
    }
    
    .info-card:hover .info-icon {
        animation: pulse 0.5s ease;
    }
`;
document.head.appendChild(style);

/* ========== بهینه‌سازی عملکرد ========== */
// Lazy loading برای تصاویر
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Debounce برای اسکرول
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// بهینه‌سازی اسکرول
window.addEventListener('scroll', debounce(() => {
    // کدهای بهینه‌سازی شده اسکرول
}, 100));

/* ========== ویژگی‌های اضافی ========== */
// نمایش سال جاری در فوتر
function updateCurrentYear() {
    const yearElement = document.querySelector('.copyright');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        const persianYear = currentYear; // در حالت واقعی باید به شمسی تبدیل شود
        yearElement.innerHTML = yearElement.innerHTML.replace('2023', currentYear);
    }
}

// پر کردن خودکار شماره تلفن
function initPhoneMask() {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value.length <= 4) {
                    value = value;
                } else if (value.length <= 8) {
                    value = value.slice(0, 4) + ' ' + value.slice(4);
                } else {
                    value = value.slice(0, 4) + ' ' + value.slice(4, 8) + ' ' + value.slice(8, 11);
                }
            }
            
            e.target.value = value;
        });
    }
}

// مقداردهی اولیه ویژگی‌های اضافی
updateCurrentYear();
initPhoneMask();
initLazyLoading();

// انیمیشن‌های تعاملی برای کارت‌ها
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.service-card, .testimonial-card, .info-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = (x - centerX) / 25;
            const rotateX = (centerY - y) / 25;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// اجرای انیمیشن‌های کارت‌ها
setTimeout(initCardHoverEffects, 1000);

// اضافه کردن قابلیت چاپ
function initPrintFunctionality() {
    const printBtn = document.createElement('button');
    printBtn.innerHTML = '<i class="fas fa-print"></i>';
    printBtn.className = 'print-btn';
    printBtn.title = 'چاپ صفحه';
    
    printBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%);
        color: var(--primary-dark);
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    `;
    
    printBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 8px 25px rgba(212, 175, 55, 0.4)';
    });
    
    printBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 5px 15px rgba(212, 175, 55, 0.3)';
    });
    
    printBtn.addEventListener('click', function() {
        window.print();
    });
    
    document.body.appendChild(printBtn);
}

// اجرای قابلیت چاپ
initPrintFunctionality();

// گزارش خطاها
window.addEventListener('error', function(e) {
    console.error('Error occurred:', e.error);
    
    // می‌توانید این خطاها را به سرور خود ارسال کنید
    if (typeof gtag !== 'undefined') {
        gtag('event', 'exception', {
            'description': e.error.toString(),
            'fatal': false
        });
    }
});

// پیام خروج از صفحه
window.addEventListener('beforeunload', function(e) {
    const form = document.getElementById('consultationForm');
    if (form && Array.from(form.elements).some(el => el.value)) {
        e.preventDefault();
        e.returnValue = 'آیا مطمئن هستید می‌خواهید صفحه را ترک کنید؟ اطلاعات فرم ذخیره نشده است.';
    }
});