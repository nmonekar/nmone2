/**
 * MOBILETECH - اسکریپت بک‌اند اختصاصی و مدیریت فرانت‌اند وبسایت
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ۱. حذف انیمیشن پیش‌بارگذاری (Preloader) پس از بارگذاری کامل منابع DOM
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                // اجرای شمارنده‌ها و ریویل‌ها پس از اتمام لودر
                initScrollReveal();
                initAnimatedCounters();
            }, 500);
        }, 800);
    }

    // ۲. مدیریت منوی همبرگری موبایل (Mobile Drawer System)
    const mobileMenuTrigger = document.getElementById('mobileMenuTrigger');
    const navNavigation = document.getElementById('navNavigation');
    
    if (mobileMenuTrigger && navNavigation) {
        mobileMenuTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            navNavigation.classList.toggle('active');
            const icon = mobileMenuTrigger.querySelector('i');
            if (navNavigation.classList.contains('active')) {
                icon.className = 'fas fa-xmark';
            } else {
                icon.className = 'fas fa-bars-staggered';
            }
        });

        // بستن منو با کلیک بر روی فضاهای خالی بیرونی منو
        document.addEventListener('click', (e) => {
            if (!navNavigation.contains(e.target) && !mobileMenuTrigger.contains(e.target)) {
                navNavigation.classList.remove('active');
                mobileMenuTrigger.querySelector('i').className = 'fas fa-bars-staggered';
            }
        });
    }

    // ۳. بستن خودکار منوی موبایل پس از کلیک روی لینک بخش‌ها
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navNavigation) navNavigation.classList.remove('active');
            if (mobileMenuTrigger) mobileMenuTrigger.querySelector('i').className = 'fas fa-bars-staggered';
        });
    });

    // ۴. سیستم آکاردئون پیشرفته سوالات متداول (Animated FAQ Accordion)
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');

        if (trigger && content) {
            trigger.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // بستن سایر آکاردئون‌ها برای تمرکز بهتر کاربری (UX Single Open)
                faqItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-content').style.maxHeight = null;
                });

                if (!isActive) {
                    item.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            });
        }
    });

    // ۵. تغییر ظاهر هدر هنگام اسکرول به پایین (Sticky Header State)
    const mainHeader = document.getElementById('mainHeader');
    window.addEventListener('scroll', () => {
        if (mainHeader) {
            if (window.scrollY > 50) {
                mainHeader.style.padding = '2px 0';
                mainHeader.style.background = 'rgba(9, 13, 26, 0.95)';
                mainHeader.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
            } else {
                mainHeader.style.padding = '';
                mainHeader.style.background = 'var(--glass-bg)';
                mainHeader.style.boxShadow = 'none';
            }
        }
        
        // فعال‌سازی وضعیت اکتیو منوها بر اساس موقعیت اسکرول ساب‌سکشن‌ها
        trackNavigationSpy();
    });

    function trackNavigationSpy() {
        const scrollPosition = window.scrollY + 120;
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(current => {
            const sectionId = current.getAttribute('id');
            const sectionTop = current.offsetTop;
            const sectionHeight = current.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ۶. سیستم انیمیشن پیشرفته کنترل اسکرول (Scroll Reveal Engine)
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.scroll-reveal');
        
        const revealOnScroll = () => {
            revealElements.forEach(el => {
                const elementTop = el.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                // اگر المان ۸۵ درصد وارد ویوپورت شد، انیمیشن اجرا شود
                if (elementTop < windowHeight * 0.85) {
                    el.classList.add('revealed');
                }
            });
        };

        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll(); // اجرای اولیه برای المان‌های بالای صفحه هیرو
    }

    // ۷. انیمیشن هوشمند افزایش اعداد آماری (Animated Digital Counters)
    function initAnimatedCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const speed = 150; // فاکتور سرعت تغییر پله‌ای اعداد

        const startCounting = (counter) => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(() => startCounting(counter), 15);
            } else {
                // درج نماد پلاس یا فرمت محلی پس از پایان شمارش
                if (target === 45000) {
                    counter.innerText = target.toLocaleString('fa-IR') + '+';
                } else if (target === 99 || target === 100) {
                    counter.innerText = target + '%';
                } else {
                    counter.innerText = target + '+';
                }
            }
        };

        // استفاده از Intersection Observer جهت بهینه‌سازی پرفورمنس مرورگر
        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        counters.forEach(counter => startCounting(counter));
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });

            observer.observe(statsSection);
        }
    }
});