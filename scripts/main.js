(function() {
    'use strict';

    const activities = [
        "coding and problem solving 💻",
        "playing pickup basketball with friends 🏀",
        "studying at the local coffee shop ☕️",
        "reading a fantasy novel 📖",
        "cooking a new dish 🍳",
        "jogging down Northwestern's Lakefill 🏃",
        "walking my dog Toby 🐶",
        "thrifting around Chicago neighborhoods 🧥",
        "eating Chipotle 🌯",
        "spending time with family back home in Albany, NY 🍎"
    ];

    let currentActivityIndex = 0;
    let isAnimationEnabled = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.addEventListener('DOMContentLoaded', function() {
        initializeNavigation();
        initializeAccessibilityFeatures();
        initializeActivityRotation();
        initializeAnimalInteraction();
        setupKeyboardNavigation();
        handleReducedMotionPreference();
        handleBrokenImages();
    });

    function initializeNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function() {
                const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', !isExpanded);
                navMenu.classList.toggle('active');
            });

            navMenu.addEventListener('click', function(e) {
                if (e.target.tagName === 'A') {
                    navToggle.setAttribute('aria-expanded', 'false');
                    navMenu.classList.remove('active');
                }
            });

            document.addEventListener('click', function(e) {
                if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navToggle.setAttribute('aria-expanded', 'false');
                    navMenu.classList.remove('active');
                }
            });
        }

        document.querySelectorAll('a[href^="#"]').forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').slice(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: isAnimationEnabled ? 'smooth' : 'auto'
                    });
                    targetElement.focus();
                }
            });
        });
    }

    function initializeAccessibilityFeatures() {
        const accessibilityToggle = document.getElementById('accessibility-toggle');
        const accessibilityPanel = document.getElementById('accessibility-panel');
        const closeButton = document.getElementById('close-accessibility');
        const animationToggle = document.getElementById('toggle-animations');
        const contrastToggle = document.getElementById('increase-contrast');

        if (accessibilityToggle && accessibilityPanel) {
            accessibilityToggle.addEventListener('click', function() {
                const isHidden = accessibilityPanel.getAttribute('aria-hidden') === 'true';
                accessibilityPanel.setAttribute('aria-hidden', !isHidden);
                
                if (!isHidden) {
                    const firstButton = accessibilityPanel.querySelector('button');
                    if (firstButton) firstButton.focus();
                }
            });
        }

        if (closeButton) {
            closeButton.addEventListener('click', function() {
                accessibilityPanel.setAttribute('aria-hidden', 'true');
                accessibilityToggle.focus();
            });
        }

        if (animationToggle) {
            animationToggle.addEventListener('click', function() {
                const isActive = this.classList.contains('active');
                this.classList.toggle('active');
                
                if (isActive) {
                    document.body.classList.remove('reduce-animations');
                    this.querySelector('.toggle-state').textContent = 'Off';
                    isAnimationEnabled = true;
                } else {
                    document.body.classList.add('reduce-animations');
                    this.querySelector('.toggle-state').textContent = 'On';
                    isAnimationEnabled = false;
                }
                
                this.setAttribute('aria-pressed', !isActive);
            });
        }

        if (contrastToggle) {
            contrastToggle.addEventListener('click', function() {
                const isActive = this.classList.contains('active');
                this.classList.toggle('active');
                
                if (isActive) {
                    document.body.classList.remove('high-contrast');
                    this.querySelector('.toggle-state').textContent = 'Off';
                } else {
                    document.body.classList.add('high-contrast');
                    this.querySelector('.toggle-state').textContent = 'On';
                }
                
                this.setAttribute('aria-pressed', !isActive);
            });
        }

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && accessibilityPanel.getAttribute('aria-hidden') === 'false') {
                accessibilityPanel.setAttribute('aria-hidden', 'true');
                accessibilityToggle.focus();
            }
        });
    }

    function initializeActivityRotation() {
        const activityElement = document.getElementById('activity-text');
        
        if (!activityElement) return;

        function updateActivity() {
            if (!isAnimationEnabled) {
                activityElement.textContent = activities[0];
                return;
            }

            const currentActivity = activities[currentActivityIndex];
            activityElement.textContent = currentActivity;
            
            currentActivityIndex = (currentActivityIndex + 1) % activities.length;
        }

        updateActivity();
        
        if (isAnimationEnabled) {
            setInterval(updateActivity, 3000);
        }
    }

    function initializeAnimalInteraction() {
        const animal = document.getElementById('animal');
        
        if (!animal) return;

        function rotateAnimal() {
            if (isAnimationEnabled) {
                animal.classList.add('rotate');
                setTimeout(function() {
                    animal.classList.remove('rotate');
                }, 1000);
            }
        }

        animal.addEventListener('click', rotateAnimal);
        
        animal.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                rotateAnimal();
            }
        });

        animal.setAttribute('tabindex', '0');
        animal.setAttribute('role', 'button');
        animal.setAttribute('aria-label', 'Click to spin the dog animation');
    }

    function setupKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', function() {
            document.body.classList.remove('keyboard-navigation');
        });

        const accessibilityPanel = document.getElementById('accessibility-panel');
        if (accessibilityPanel) {
            accessibilityPanel.addEventListener('keydown', function(e) {
                if (e.key === 'Tab' && this.getAttribute('aria-hidden') === 'false') {
                    const focusableElements = this.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];

                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            });
        }
    }

    function handleReducedMotionPreference() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        function handleMotionPreference(e) {
            isAnimationEnabled = !e.matches;
            
            if (e.matches) {
                document.body.classList.add('reduce-animations');
                const animationToggle = document.getElementById('toggle-animations');
                if (animationToggle) {
                    animationToggle.classList.add('active');
                    animationToggle.querySelector('.toggle-state').textContent = 'On';
                    animationToggle.setAttribute('aria-pressed', 'true');
                }
            }
        }

        handleMotionPreference(mediaQuery);
        
        if (mediaQuery.addListener) {
            mediaQuery.addListener(handleMotionPreference);
        }
    }

    function handleBrokenImages() {
        const skillLogos = document.querySelectorAll('.skill-logo');
        
        skillLogos.forEach(function(img) {
            setTimeout(function() {
                if (!img.complete || img.naturalWidth === 0 || img.offsetWidth === 0) {
                    replaceWithFallback(img);
                }
            }, 100);
            
            img.addEventListener('error', function() {
                replaceWithFallback(this);
            });
            
            img.addEventListener('load', function() {
                const fallback = this.nextElementSibling;
                if (fallback && fallback.classList.contains('skill-logo-fallback')) {
                    fallback.remove();
                    this.style.display = '';
                }
            });
        });
        
        function replaceWithFallback(img) {
            if (img.nextElementSibling && img.nextElementSibling.classList.contains('skill-logo-fallback')) {
                return;
            }
            
            img.style.display = 'none';
            
            const replacement = document.createElement('div');
            replacement.className = 'skill-logo-fallback';
            replacement.textContent = img.alt;
            
            img.parentNode.insertBefore(replacement, img.nextSibling);
        }
    }

    document.documentElement.classList.add('js-enabled');
    
    document.addEventListener('DOMContentLoaded', function() {
        const jsOnlyElements = document.querySelectorAll('.js-only');
        jsOnlyElements.forEach(function(element) {
            element.style.display = 'block';
        });

        const noJsElements = document.querySelectorAll('.no-js');
        noJsElements.forEach(function(element) {
            element.style.display = 'none';
        });
    });

})();
