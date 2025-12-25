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
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-menu-link');
let menuOpen = false;

function toggleMenu() {
    menuOpen = !menuOpen;
    if (menuOpen) {
        mobileMenu.classList.add('active');
        if (mobileBtn) {
            mobileBtn.children[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
            mobileBtn.children[1].style.transform = 'rotate(-45deg) translate(5px, -6px)';
        }
    } else {
        mobileMenu.classList.remove('active');
        if (mobileBtn) {
            mobileBtn.children[0].style.transform = 'none';
            mobileBtn.children[1].style.transform = 'none';
        }
    }
}

if (mobileBtn) {
    mobileBtn.addEventListener('click', toggleMenu);
}

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        toggleMenu();
        const target = link.getAttribute('href');
        // Only scroll if target is on the same page and starts with #
        if (target.startsWith('#')) {
             lenis.scrollTo(target);
        }
    });
});


// --- CURSOR FOLLOWER ---
const cursor = document.getElementById('cursor');
if (cursor) {
    document.addEventListener('mousemove', e => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Add hover effect to interactive elements
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

// 1. Hero Stagger
if (document.querySelector('.stagger-text')) {
    gsap.from(".stagger-text", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power4.out"
    });
}

// 2. Hero Tags
if (document.querySelector('.hero-tag')) {
    gsap.from(".hero-tag", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        delay: 0.5,
        ease: "power2.out"
    });
}

// 3. Generic Reveal Text
gsap.utils.toArray('.reveal-text').forEach(text => {
    gsap.from(text, {
        scrollTrigger: {
            trigger: text,
            start: "top 85%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    });
});

// 4. Bento Grid Cards
gsap.utils.toArray('.bento-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 90%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: "power2.out"
    });
});

// 5. Problem Items
if (document.querySelector('.problem-list')) {
    gsap.utils.toArray('.problem-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: '.problem-list',
                start: "top 80%",
            },
            x: -30,
            opacity: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: "power2.out"
        });
    });
}

// 6. Differentiation Cards
if (document.querySelector('.diff-grid')) {
    gsap.utils.toArray('.diff-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: '.diff-grid',
                start: "top 80%",
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.15,
            ease: "power2.out"
        });
    });
}

// 7. Pricing Cards
if (document.querySelector('.pricing-grid')) {
    gsap.utils.toArray('.pricing-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: '.pricing-grid',
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            delay: i * 0.2,
            ease: "power3.out"
        });
    });
}


// --- INTERACTIVITY ---

// FAQ Toggle
document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
        const answer = q.nextElementSibling;
        const icon = q.querySelector('i');
        const isOpen = answer.style.height && answer.style.height !== '0px';

        // Close all others (optional - keeps it clean)
        document.querySelectorAll('.faq-answer').forEach(a => a.style.height = 0);
        document.querySelectorAll('.faq-question i').forEach(i => i.classList.replace('ri-subtract-line', 'ri-add-line'));

        if (!isOpen) {
            answer.style.height = answer.scrollHeight + 'px';
            if(icon) icon.classList.replace('ri-add-line', 'ri-subtract-line');
        }
    });
});

// Contact Form Submission
function sendMessage(event) {
    event.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const institute = document.getElementById('institute').value;
    const email = document.getElementById('email').value;
    const goal = document.getElementById('goal').value;
    
    // Get plan if available
    let plan = "Not Selected";
    const planSelect = document.getElementById('plan');
    if (planSelect) {
        plan = planSelect.value;
    }

    // Format message for WhatsApp
    const message = `*New Strategy Call Booking*%0A%0A` +
        `*Name:* ${name}%0A` +
        `*Phone:* ${phone}%0A` +
        `*Institute:* ${institute}%0A` +
        `*Email:* ${email}%0A` +
        `*Interested Plan:* ${plan}%0A` +
        `*Goal/Challenge:* ${goal}`;

    // Redirect to WhatsApp
    const whatsappUrl = `https://wa.me/919690623696?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

// Lenis Scroll Handling for Anchor Links
document.querySelectorAll('.nav-link').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetAttr = this.getAttribute('href');
        // Only prevent default if it's an on-page anchor link (starts with #)
        if (targetAttr.startsWith('#')) {
             e.preventDefault();
             lenis.scrollTo(targetAttr);
        }
        // If it's index.html#section, and we are not on index.html, let it navigate naturally.
    });
});
