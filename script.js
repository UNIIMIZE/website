// Initialize Lenis Smooth Scroll
const lenis = new Lenis({ duration: 1.2, smooth: true });
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// --- MOBILE MENU FUNCTIONALITY ---
let menuOpen = false;

function toggleMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileBtn = document.getElementById('mobile-menu-btn');

    if (!mobileMenu || !mobileBtn) return;

    menuOpen = !menuOpen;
    if (menuOpen) {
        mobileMenu.classList.add('active');
        mobileBtn.children[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
        mobileBtn.children[1].style.transform = 'rotate(-45deg) translate(5px, -6px)';
    } else {
        mobileMenu.classList.remove('active');
        mobileBtn.children[0].style.transform = 'none';
        mobileBtn.children[1].style.transform = 'none';
    }
}

// --- CURSOR FOLLOWER ---
const cursor = document.getElementById('cursor');
if (cursor) {
    document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.querySelectorAll('a, button, .bento-card, .faq-question, .pricing-card, .diff-card, .submit-btn').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%,-50%) scale(3)';
            cursor.style.background = 'rgba(255, 255, 255, 0.1)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%,-50%) scale(1)';
            cursor.style.background = 'var(--gold-light)';
        });
    });
}

// --- GSAP ANIMATIONS ---
function initAnimations() {
    ScrollTrigger.getAll().forEach(t => t.kill());
    gsap.killTweensOf('*');
    ScrollTrigger.refresh();

    // Hero Stagger
    if (document.querySelector('.stagger-text')) {
        gsap.fromTo(".stagger-text",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", clearProps: "all" }
        );
    }

    // Hero Tags
    if (document.querySelector('.hero-tag')) {
        gsap.fromTo(".hero-tag",
            { y: 10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, delay: 0.1, stagger: 0.05, ease: "power2.out", clearProps: "all" }
        );
    }

    // Generic Reveal Text
    gsap.utils.toArray('.reveal-text').forEach(text => {
        gsap.fromTo(text,
            { y: 20, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.5, ease: "power2.out", clearProps: "all",
                scrollTrigger: {
                    trigger: text,
                    start: "top 95%"
                }
            }
        );
    });

    // Bento Grid Cards
    gsap.utils.toArray('.bento-card').forEach((card, i) => {
        gsap.fromTo(card,
            { y: 20, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.5, delay: i * 0.05, ease: "power2.out", clearProps: "all",
                scrollTrigger: {
                    trigger: card,
                    start: "top 95%"
                }
            }
        );
    });

    // Problem Items
    if (document.querySelector('.problem-list')) {
        gsap.utils.toArray('.problem-item').forEach((item, i) => {
            gsap.fromTo(item,
                { x: -20, opacity: 0 },
                {
                    x: 0, opacity: 1, duration: 0.5, delay: i * 0.05, ease: "power2.out", clearProps: "all",
                    scrollTrigger: {
                        trigger: '.problem-list',
                        start: "top 90%"
                    }
                }
            );
        });
    }

    // Differentiation Cards
    if (document.querySelector('.diff-grid')) {
        gsap.utils.toArray('.diff-card').forEach((card, i) => {
            gsap.fromTo(card,
                { y: 20, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.5, delay: i * 0.1, ease: "power2.out", clearProps: "all",
                    scrollTrigger: {
                        trigger: '.diff-grid',
                        start: "top 90%"
                    }
                }
            );
        });
    }

    // Pricing Cards
    if (document.querySelector('.pricing-grid')) {
        gsap.utils.toArray('.pricing-card').forEach((card, i) => {
            gsap.fromTo(card,
                { y: 30, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.5, delay: i * 0.1, ease: "power3.out", clearProps: "all",
                    scrollTrigger: {
                        trigger: '.pricing-grid',
                        start: "top 90%"
                    }
                }
            );
        });
    }
}

// --- INITIALIZE ON PAGE LOAD ---
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu button
    const mobileBtn = document.getElementById('mobile-menu-btn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', toggleMenu);
    }

    // Mobile menu links
    document.querySelectorAll('.mobile-menu-link').forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu();
            const target = link.getAttribute('href');
            if (target && target.startsWith('#')) {
                lenis.scrollTo(target);
            }
        });
    });

    // FAQ Toggle
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => {
            const answer = q.nextElementSibling;
            const icon = q.querySelector('i');

            // PERFORMANCE FIX: Read layout properties BEFORE any writes
            const isOpen = answer.classList.contains('active');
            const targetHeight = isOpen ? 0 : answer.scrollHeight;

            // Batch all DOM writes together (no forced reflow)
            requestAnimationFrame(() => {
                // Close all others
                document.querySelectorAll('.faq-answer').forEach(a => {
                    a.style.height = '0';
                    a.classList.remove('active');
                });
                document.querySelectorAll('.faq-question i').forEach(i => {
                    i.classList.replace('ri-subtract-line', 'ri-add-line');
                });

                // Open current if it was closed
                if (!isOpen) {
                    answer.style.height = targetHeight + 'px';
                    answer.classList.add('active');
                    if (icon) icon.classList.replace('ri-add-line', 'ri-subtract-line');
                }
            });
        });
    });

    // Custom Dropdown
    const customSelect = document.getElementById('custom-plan-select');
    if (customSelect) {
        const selected = customSelect.querySelector('.select-selected');
        const items = customSelect.querySelector('.select-items');
        const hiddenInput = document.getElementById('plan');

        selected.addEventListener('click', function (e) {
            e.stopPropagation();
            customSelect.classList.toggle('open');
        });

        items.querySelectorAll('div').forEach(item => {
            item.addEventListener('click', function (e) {
                e.stopPropagation();
                selected.innerText = this.innerText;
                selected.classList.add('has-value');
                hiddenInput.value = this.getAttribute('data-value');
                customSelect.classList.remove('open');
            });
        });

        document.addEventListener('click', () => {
            customSelect.classList.remove('open');
        });
    }

    // Initialize animations
    initAnimations();
});

// Contact Form Submission
function sendMessage(event) {
    event.preventDefault();

    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerText;

    submitBtn.innerText = "Sending...";
    submitBtn.disabled = true;

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const institute = document.getElementById('institute').value;
    const email = document.getElementById('email').value;
    const goal = document.getElementById('goal').value;

    let plan = "Not Selected";
    const planSelect = document.getElementById('plan');
    if (planSelect && planSelect.value) {
        plan = planSelect.value;
    }

    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwx76LEFkvbJQGLSNdbyVy4VmZL3t_m8cjLPCSEDl-ipbuKDhMwfnQ5-N9f4VwpAH3f/exec";

    const formData = {
        name: name,
        phone: phone,
        institute: institute,
        email: email,
        goal: goal,
        plan: plan
    };

    fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            alert("Thanks! We've received your request and will contact you shortly.");
            document.getElementById('contactForm').reset();

            const customSelect = document.getElementById('custom-plan-select');
            if (customSelect) {
                customSelect.querySelector('.select-selected').innerText = "Select a Growth Plan";
                customSelect.querySelector('.select-selected').classList.remove('has-value');
                document.getElementById('plan').value = "";
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Something went wrong. Please try again or email us directly at uniimize@gmail.com");
        })
        .finally(() => {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        });
}
