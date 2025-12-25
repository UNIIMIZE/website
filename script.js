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
// --- MOBILE MENU FUNCTIONALITY ---
// Variable to track state, but DOM elements must be queried dynamically
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

// Initial Listener (will be re-attached by reinitScripts)
const initialBtn = document.getElementById('mobile-menu-btn');
if (initialBtn) {
    initialBtn.addEventListener('click', toggleMenu);
}

document.querySelectorAll('.mobile-menu-link').forEach(link => {
    link.addEventListener('click', () => {
        toggleMenu(); // Close menu
        const target = link.getAttribute('href');
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
// All animations are now consolidated in initAnimations() to ensure consistency across SPA navigation.
initAnimations();


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
            if (icon) icon.classList.replace('ri-add-line', 'ri-subtract-line');
        }
    });
});

// Contact Form Submission
// Contact Form Submission
function sendMessage(event) {
    event.preventDefault();

    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.innerText;

    // Disable button and show loading state
    submitBtn.innerText = "Sending...";
    submitBtn.disabled = true;

    // Get form values
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const institute = document.getElementById('institute').value;
    const email = document.getElementById('email').value;
    const goal = document.getElementById('goal').value;

    // Get plan if available
    let plan = "Not Selected";
    const planSelect = document.getElementById('plan');
    if (planSelect && planSelect.value) {
        plan = planSelect.value;
    }

    // Google Apps Script URL (PLACEHOLDER)
    // IMPORTANT: User needs to replace this URL after deploying the script
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwx76LEFkvbJQGLSNdbyVy4VmZL3t_m8cjLPCSEDl-ipbuKDhMwfnQ5-N9f4VwpAH3f/exec";

    // Prepare JSON data
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
        mode: 'no-cors', // Important for Google Scripts
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            // Since mode is no-cors, we can't check response.ok or read JSON
            // Assume success if request completes
            alert("Thanks! We've received your request and will contact you shortly.");
            document.getElementById('contactForm').reset();

            // Reset Custom Dropdown Text
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

// --- ARTICLE SHARING ---
// --- ARTICLE SHARING ---
function shareArticle(platform) {
    // Check if we are local or production
    // If local (file: or localhost), construct the production URL for sharing
    // This ensures the shared link actually works for others
    let rawUrl = window.location.href;

    // Logic to construct production URL if local
    // Assumes file structure mirrors uniimize.in
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1);

    // If we are in the /posts/ directory logic
    // We can just force the production domain for sharing
    const productionDomain = 'https://uniimize.in';

    // Determine the relative path (simulated)
    // If filename is empty (root), it's index.html
    let finalUrl = rawUrl;

    if (rawUrl.startsWith('file:') || rawUrl.includes('localhost') || rawUrl.includes('127.0.0.1')) {
        // We are local. Construct the live URL.
        // Check if it's a blog post
        if (path.includes('/posts/')) {
            finalUrl = `${productionDomain}/posts/${filename}`;
        } else {
            finalUrl = `${productionDomain}/${filename}`;
        }
    }

    const url = encodeURIComponent(finalUrl);
    const title = encodeURIComponent(document.title);
    let shareUrl = '';

    if (platform === 'twitter') {
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
    } else if (platform === 'linkedin') {
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    } else if (platform === 'whatsapp') {
        shareUrl = `https://api.whatsapp.com/send?text=${title} ${url}`;
    }

    if (shareUrl) window.open(shareUrl, '_blank');
}

// --- SPA NAVIGATION (YouTube-like Transitions) ---
document.addEventListener('DOMContentLoaded', () => {
    // Initial initialization of all dynamic scripts (Dropdowns, Cursor, Mobile Menu)
    reinitScripts();

    // Intercept clicks on links
    document.body.addEventListener('click', e => {
        const link = e.target.closest('a');

        // Ignore if: no link, external link, has target=_blank, or is an anchor link
        if (!link ||
            link.host !== window.location.host ||
            link.target === '_blank' ||
            link.getAttribute('href').startsWith('#') ||
            link.getAttribute('href').includes('mailto:')
        ) {
            return;
        }

        e.preventDefault();
        const href = link.getAttribute('href');
        handleTransition(href);
    });

    // Handle Back/Forward buttons
    window.addEventListener('popstate', () => {
        loadPage(window.location.pathname, false);
    });
});

function handleTransition(href) {
    // Animate Out
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    document.body.appendChild(overlay);

    gsap.to(overlay, {
        scaleY: 1,
        duration: 0.6,
        ease: 'power4.inOut',
        onComplete: () => {
            loadPage(href, true);
        }
    });
}

async function loadPage(url, pushState = true) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Page not found');
        const text = await response.text();

        // Parse new HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        // Replace Content (Keep Nav and Footer separate if possible, but here we replace body content mostly or specific container)
        // Ideally we replace everything inside <body> but re-attach event listeners.
        // For simplicity and robustness with static files, let's swap the full body content but keep the scripts valid.

        // Better Strategy: Replace specific containers or Body innerHTML?
        // Replacing Body innerHTML is easiest for static sites but we need to re-run scripts.
        document.body.innerHTML = doc.body.innerHTML;
        document.title = doc.title;

        // Update URL
        if (pushState) {
            // Clean URL: remove .html
            let cleanUrl = url;
            if (url.endsWith('.html')) cleanUrl = url.slice(0, -5);
            if (url.endsWith('index')) cleanUrl = url.slice(0, -5); // remove index too

            history.pushState({}, '', cleanUrl);
        }

        // Scroll to top
        window.scrollTo(0, 0);

        // Re-initialize all dynamic logic
        reinitScripts();

        // Animate In
        const overlay = document.querySelector('.page-transition-overlay');
        if (overlay) {
            gsap.to(overlay, {
                scaleY: 0,
                transformOrigin: 'top',
                duration: 0.6,
                delay: 0.1,
                ease: 'power4.inOut',
                onComplete: () => overlay.remove()
            });
        }

    } catch (err) {
        console.error('Navigation Error:', err);
        window.location.href = url; // Fallback to hard reload
    }
}

function initAnimations() {
    // 1. Kill all existing ScrollTriggers to prevent memory leaks and conflicts
    ScrollTrigger.getAll().forEach(t => t.kill());
    gsap.killTweensOf('*'); // Kill all active tweens

    // 2. Refresh ScrollTrigger to ensure fresh start
    ScrollTrigger.refresh();

    // 3. Hero Stagger
    if (document.querySelector('.stagger-text')) {
        gsap.fromTo(".stagger-text",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out", clearProps: "all" }
        );
    }

    // 4. Hero Tags
    if (document.querySelector('.hero-tag')) {
        gsap.fromTo(".hero-tag",
            { y: 10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, delay: 0.1, stagger: 0.05, ease: "power2.out", clearProps: "all" }
        );
    }

    // 5. Generic Reveal Text
    gsap.utils.toArray('.reveal-text').forEach(text => {
        gsap.fromTo(text,
            { y: 20, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.5, ease: "power2.out", clearProps: "all",
                scrollTrigger: {
                    trigger: text,
                    start: "top 95%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // 6. Bento Grid Cards
    gsap.utils.toArray('.bento-card').forEach((card, i) => {
        gsap.fromTo(card,
            { y: 20, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.5, delay: i * 0.05, ease: "power2.out", clearProps: "all",
                scrollTrigger: {
                    trigger: card,
                    start: "top 95%",
                }
            }
        );
    });

    // 7. Problem Items
    if (document.querySelector('.problem-list')) {
        gsap.utils.toArray('.problem-item').forEach((item, i) => {
            gsap.fromTo(item,
                { x: -20, opacity: 0 },
                {
                    x: 0, opacity: 1, duration: 0.5, delay: i * 0.05, ease: "power2.out", clearProps: "all",
                    scrollTrigger: {
                        trigger: '.problem-list',
                        start: "top 90%",
                    }
                }
            );
        });
    }

    // 8. Differentiation Cards
    if (document.querySelector('.diff-grid')) {
        gsap.utils.toArray('.diff-card').forEach((card, i) => {
            gsap.fromTo(card,
                { y: 20, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.5, delay: i * 0.1, ease: "power2.out", clearProps: "all",
                    scrollTrigger: {
                        trigger: '.diff-grid',
                        start: "top 90%",
                    }
                }
            );
        });
    }

    // 9. Pricing Cards
    if (document.querySelector('.pricing-grid')) {
        gsap.utils.toArray('.pricing-card').forEach((card, i) => {
            gsap.fromTo(card,
                { y: 30, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.5, delay: i * 0.1, ease: "power3.out", clearProps: "all",
                    scrollTrigger: {
                        trigger: '.pricing-grid',
                        start: "top 90%",
                    }
                }
            );
        });
    }
}

function reinitScripts() {
    // 1. Lenis
    // lenis instance persists, just need to restart raf loop if stopped? No, raf loop is on window. 
    // Just need to make sure scroll position is reset.

    // 2. Mobile Menu
    const newMobileBtn = document.getElementById('mobile-menu-btn');
    if (newMobileBtn) {
        newMobileBtn.addEventListener('click', toggleMenu);
        menuOpen = false; // reset state
    }

    // Re-attach link listeners to close menu on click
    document.querySelectorAll('.mobile-menu-link').forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu(); // Close menu
            const target = link.getAttribute('href');
            if (target.startsWith('#')) {
                lenis.scrollTo(target);
            }
        });
    });

    // 3. Cursor
    const cursor = document.getElementById('cursor');
    if (cursor) {
        document.addEventListener('mousemove', e => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        document.querySelectorAll('a, button').forEach(el => {
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

    // 4. FAQ
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => {
            const answer = q.nextElementSibling;
            const icon = q.querySelector('i');
            const isOpen = answer.style.height && answer.style.height !== '0px';
            document.querySelectorAll('.faq-answer').forEach(a => {
                a.style.height = 0;
            });
            // Reset all icons
            document.querySelectorAll('.faq-question i').forEach(i => i.classList.replace('ri-subtract-line', 'ri-add-line'));

            if (!isOpen) {
                answer.style.height = answer.scrollHeight + 'px';
                if (icon) icon.classList.replace('ri-add-line', 'ri-subtract-line');
            }
        });
    });

    // 5. Custom Dropdown Logic
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

        document.addEventListener('click', function (e) {
            customSelect.classList.remove('open');
        });
    }

    // 6. Animations
    initAnimations();
}

// Check and Clean URL on Initial Load
(function cleanUrlParams() {
    let url = window.location.href;
    if (url.endsWith('.html') || url.endsWith('index')) {
        let clean = url.replace(/(\/index)?\.html$/, '');
        if (clean !== url) {
            history.replaceState({}, document.title, clean);
        }
    }
})();

// Lenis Scroll Handling for Anchor Links
document.querySelectorAll('.nav-link').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetAttr = this.getAttribute('href');
        if (targetAttr.startsWith('#')) {
            e.preventDefault();
            lenis.scrollTo(targetAttr);
        }
    });
});
