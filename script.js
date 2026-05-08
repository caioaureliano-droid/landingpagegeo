document.addEventListener('DOMContentLoaded', () => {
    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 50) {
            document.body.classList.add('is-scrolled');
        } else {
            document.body.classList.remove('is-scrolled');
        }
    });

    // --- Counter Animation ---
    const startCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const startTime = performance.now();

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (easeOutExpo)
            const easeOutExpo = 1 - Math.pow(2, -10 * progress);
            const currentCount = Math.floor(easeOutExpo * target);

            el.innerText = currentCount;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                el.innerText = target;
            }
        };

        requestAnimationFrame(updateCounter);
    };

    // --- Intersection Observer for Scroll Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the element is visible
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the animation class
                entry.target.classList.add('active');
                entry.target.classList.add('visible'); // For fade-up classes

                // Trigger counter if this is a stat-card
                if (entry.target.classList.contains('stat-card')) {
                    const counters = entry.target.querySelectorAll('.counter');
                    counters.forEach(counter => startCounter(counter));
                }

                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select elements to reveal
    const revealElements = document.querySelectorAll('.reveal, .fade-up, .stat-card');
    revealElements.forEach(el => scrollObserver.observe(el));


    // --- Accordion Logic ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const currentItem = header.parentElement;

            // Close other items
            document.querySelectorAll('.accordion-item').forEach(item => {
                if (item !== currentItem) {
                    item.classList.remove('active');
                }
            });

            // Toggle current item
            currentItem.classList.toggle('active');
        });
    });

    // --- Demo Form Submission ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;

            btn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Enviando...';
            btn.style.opacity = '0.8';

            // Simulate API Call
            setTimeout(() => {
                btn.innerHTML = '<i class="ri-check-line"></i> Solicitação Enviada!';
                btn.style.background = 'var(--google-green)';
                btn.style.opacity = '1';
                contactForm.reset();

                // Reset button after 3 seconds
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = ''; // Reverts to CSS gradient
                }, 3000);
            }, 1500);
        });
    }

    // --- Portfolio & Solution Grid Interactivity ---
    const clickableCards = document.querySelectorAll('.clickable-card');
    const backButtons = document.querySelectorAll('.btn-back-solucoes');

    clickableCards.forEach(card => {
        card.addEventListener('click', () => {
            // Check if already expanded to avoid re-triggering
            if (card.classList.contains('is-expanded')) return;

            const targetId = card.getAttribute('data-target');
            const detailContent = document.getElementById(targetId);
            const section = card.closest('section');
            const grid = card.parentElement;
            const backBtn = section.querySelector('.btn-back-solucoes');

            if (!detailContent) return;

            // 1. Hide sibling cards in the same grid
            const allCardsInGrid = grid.querySelectorAll('.clickable-card');
            allCardsInGrid.forEach(c => {
                if (c !== card) {
                    c.style.display = 'none';
                }
            });

            // 2. Expand current card
            card.classList.add('is-expanded');
            detailContent.style.display = 'block';

            // 3. Show associated back button
            if (backBtn) backBtn.style.display = 'inline-flex';

            // 4. Scroll to top of section or card
            setTimeout(() => {
                const offset = 100;
                const elementPosition = card.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }, 100);
        });
    });

    backButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.closest('section');
            const grid = section.querySelector('.solutions-grid, .geo-core-grid, .geo-grid-container > div');
            const cards = grid.querySelectorAll('.clickable-card');

            // 1. Reset cards and details
            cards.forEach(card => {
                card.style.display = '';
                card.classList.remove('is-expanded');

                const targetId = card.getAttribute('data-target');
                const detailContent = document.getElementById(targetId);
                if (detailContent) detailContent.style.display = 'none';
            });

            // 2. Hide button
            btn.style.display = 'none';

            // 3. Scroll back to section header
            section.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // --- Interactive Topics (Accordion inside details) ---
    const clickableTopics = document.querySelectorAll('.clickable-topic');
    clickableTopics.forEach(topic => {
        topic.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card from triggering if it was already open
            const details = topic.querySelector('.topic-details');
            const icon = topic.querySelector('i');

            if (details) {
                const isOpen = details.style.display === 'block';
                details.style.display = isOpen ? 'none' : 'block';

                if (icon) {
                    icon.classList.toggle('ri-arrow-right-s-line', isOpen);
                    icon.classList.toggle('ri-arrow-down-s-line', !isOpen);
                }
            }
        });
    });

    // --- Discovery Checklist Interaction ---
    const stepDots = document.querySelectorAll('.step-dot');
    const stepContents = document.querySelectorAll('.step-content');

    stepDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const stepId = dot.getAttribute('data-step');

            // Update dots
            stepDots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');

            // Update contents
            stepContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `step-${stepId}`) {
                    content.classList.add('active');
                }
            });
        });
    });
    // --- Journey Mind Map Logic ---
    const journeyToggle = document.getElementById('journey-toggle');
    const journeyMap = document.getElementById('journey-map');

    if (journeyToggle && journeyMap) {
        journeyToggle.addEventListener('click', () => {
            journeyMap.classList.toggle('is-active');
        });
    }

    // --- Geo Specialized Mind Map Logic ---
    const geoToggle1 = document.getElementById('geo-toggle-1');
    const geoContainer = document.getElementById('geo-journey-container');
    const geoToggle2 = document.getElementById('geo-toggle-2');
    const geoLevel1 = document.getElementById('geo-level-1');
    const geoToggle3 = document.getElementById('geo-toggle-3');
    const geoLevel2 = document.getElementById('geo-level-2');

    if (geoToggle1 && geoContainer) {
        geoToggle1.addEventListener('click', () => {
            geoContainer.classList.toggle('is-active');
        });
    }

    if (geoToggle2 && geoLevel1) {
        geoToggle2.addEventListener('click', (e) => {
            e.stopPropagation();
            geoLevel1.classList.toggle('is-sub-active');
        });
    }

    if (geoToggle3 && geoLevel2) {
        geoToggle3.addEventListener('click', (e) => {
            e.stopPropagation();
            geoLevel2.classList.toggle('is-sub-active');
        });
    }

    // --- Global Journey Multilevel Logic (Mutual Exclusivity) ---
    const subLevels = document.querySelectorAll('.mindmap-sub-container');

    function closeOtherSubLevels(currentId, parentClass) {
        // Only close siblings within the same parent branch to allow deep-dive navigation
        const siblings = document.querySelectorAll(parentClass + ' .mindmap-sub-container');
        siblings.forEach(container => {
            if (container.id !== currentId) {
                container.classList.remove('is-sub-active');
            }
        });
    }

    const geoBranchToggle = document.getElementById('geo-branch-toggle');
    const geoMainLevel = document.getElementById('geo-main-level');
    const geoCoreToggle = document.getElementById('geo-core-toggle');
    const geoCoreLevel = document.getElementById('geo-core-level');

    if (geoBranchToggle && geoMainLevel) {
        geoBranchToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close other Level 1 areas if this one is being opened
            if (!geoMainLevel.classList.contains('is-sub-active')) {
                closeOtherSubLevels('geo-main-level', '.mindmap-branches');
            }
            geoMainLevel.classList.toggle('is-sub-active');
        });
    }

    if (geoCoreToggle && geoCoreLevel) {
        geoCoreToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            geoCoreLevel.classList.toggle('is-sub-active');
        });
    }

    // --- Collaboration Multilevel Logic ---
    const collabBranchToggle = document.getElementById('collab-branch-toggle');
    const collabMainLevel = document.getElementById('collab-main-level');
    const collabCoreToggle = document.getElementById('collab-core-toggle');
    const collabCoreLevel = document.getElementById('collab-core-level');
    const collabTrainingToggle = document.getElementById('collab-training-toggle');
    const collabTrainingLevel = document.getElementById('collab-training-level');

    if (collabBranchToggle && collabMainLevel) {
        collabBranchToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!collabMainLevel.classList.contains('is-sub-active')) {
                closeOtherSubLevels('collab-main-level', '.mindmap-branches');
            }
            collabMainLevel.classList.toggle('is-sub-active');
        });
    }

    if (collabCoreToggle && collabCoreLevel) {
        collabCoreToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            collabCoreLevel.classList.toggle('is-sub-active');
        });
    }

    if (collabTrainingToggle && collabTrainingLevel) {
        collabTrainingToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            collabTrainingLevel.classList.toggle('is-sub-active');
        });
    }

    // --- Tech Solution Multilevel Logic ---
    const tssBranchToggle = document.getElementById('tss-branch-toggle');
    const tssMainLevel = document.getElementById('tss-main-level');

    if (tssBranchToggle && tssMainLevel) {
        tssBranchToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!tssMainLevel.classList.contains('is-sub-active')) {
                closeOtherSubLevels('tss-main-level', '.mindmap-branches');
            }
            tssMainLevel.classList.toggle('is-sub-active');
        });
    }

    // --- Cloud Infra Multilevel Logic ---
    const cloudBranchToggle = document.getElementById('cloud-branch-toggle');
    const cloudMainLevel = document.getElementById('cloud-main-level');
    const cloudCoreToggle = document.getElementById('cloud-core-toggle');
    const cloudCoreLevel = document.getElementById('cloud-core-level');
    const cloudNocToggle = document.getElementById('cloud-noc-toggle');
    const cloudNocLevel = document.getElementById('cloud-noc-level');

    if (cloudBranchToggle && cloudMainLevel) {
        cloudBranchToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!cloudMainLevel.classList.contains('is-sub-active')) {
                closeOtherSubLevels('cloud-main-level', '.mindmap-branches');
            }
            cloudMainLevel.classList.toggle('is-sub-active');
        });
    }

    if (cloudCoreToggle && cloudCoreLevel) {
        cloudCoreToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!cloudCoreLevel.classList.contains('is-sub-active')) {
                // Close NOC inside Cloud if opening Core
                if (cloudNocLevel) cloudNocLevel.classList.remove('is-sub-active');
            }
            cloudCoreLevel.classList.toggle('is-sub-active');
        });
    }

    if (cloudNocToggle && cloudNocLevel) {
        cloudNocToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!cloudNocLevel.classList.contains('is-sub-active')) {
                // Close Core inside Cloud if opening NOC
                if (cloudCoreLevel) cloudCoreLevel.classList.remove('is-sub-active');
            }
            cloudNocLevel.classList.toggle('is-sub-active');
        });
    }

    // --- Data Services Multilevel Logic ---
    const dataBranchToggle = document.getElementById('data-branch-toggle');
    const dataMainLevel = document.getElementById('data-main-level');
    const dataCoreToggle = document.getElementById('data-core-toggle');
    const dataCoreLevel = document.getElementById('data-core-level');
    const dataBiToggle = document.getElementById('data-bi-toggle');
    const dataBiLevel = document.getElementById('data-bi-level');

    if (dataBranchToggle && dataMainLevel) {
        dataBranchToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!dataMainLevel.classList.contains('is-sub-active')) {
                closeOtherSubLevels('data-main-level', '.mindmap-branches');
            }
            dataMainLevel.classList.toggle('is-sub-active');
        });
    }

    if (dataCoreToggle && dataCoreLevel) {
        dataCoreToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!dataCoreLevel.classList.contains('is-sub-active')) {
                if (dataBiLevel) dataBiLevel.classList.remove('is-sub-active');
            }
            dataCoreLevel.classList.toggle('is-sub-active');
        });
    }

    if (dataBiToggle && dataBiLevel) {
        dataBiToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!dataBiLevel.classList.contains('is-sub-active')) {
                if (dataCoreLevel) dataCoreLevel.classList.remove('is-sub-active');
            }
            dataBiLevel.classList.toggle('is-sub-active');
        });
    }

    // --- FinOps Multilevel Logic ---
    const finopsBranchToggle = document.getElementById('finops-branch-toggle');
    const finopsMainLevel = document.getElementById('finops-main-level');

    if (finopsBranchToggle && finopsMainLevel) {
        finopsBranchToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!finopsMainLevel.classList.contains('is-sub-active')) {
                closeOtherSubLevels('finops-main-level', '.mindmap-branches');
            }
            finopsMainLevel.classList.toggle('is-sub-active');
        });
    }

    // --- Allocation & Dev Multilevel Logic ---
    const allocBranchToggle = document.getElementById('alloc-branch-toggle');
    const allocMainLevel = document.getElementById('alloc-main-level');
    const allocBodyToggle = document.getElementById('alloc-body-toggle');
    const allocBodyLevel = document.getElementById('alloc-body-level');
    const allocTechToggle = document.getElementById('alloc-tech-toggle');
    const allocTechLevel = document.getElementById('alloc-tech-level');
    const allocCaptchaToggle = document.getElementById('alloc-captcha-toggle');
    const allocCaptchaLevel = document.getElementById('alloc-captcha-level');

    if (allocBranchToggle && allocMainLevel) {
        allocBranchToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!allocMainLevel.classList.contains('is-sub-active')) {
                closeOtherSubLevels('alloc-main-level', '.mindmap-branches');
            }
            allocMainLevel.classList.toggle('is-sub-active');
        });
    }

    if (allocBodyToggle && allocBodyLevel) {
        allocBodyToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!allocBodyLevel.classList.contains('is-sub-active')) {
                if (allocTechLevel) allocTechLevel.classList.remove('is-sub-active');
                if (allocCaptchaLevel) allocCaptchaLevel.classList.remove('is-sub-active');
            }
            allocBodyLevel.classList.toggle('is-sub-active');
        });
    }

    if (allocTechToggle && allocTechLevel) {
        allocTechToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!allocTechLevel.classList.contains('is-sub-active')) {
                if (allocBodyLevel) allocBodyLevel.classList.remove('is-sub-active');
                if (allocCaptchaLevel) allocCaptchaLevel.classList.remove('is-sub-active');
            }
            allocTechLevel.classList.toggle('is-sub-active');
        });
    }

    if (allocCaptchaToggle && allocCaptchaLevel) {
        allocCaptchaToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!allocCaptchaLevel.classList.contains('is-sub-active')) {
                if (allocBodyLevel) allocBodyLevel.classList.remove('is-sub-active');
                if (allocTechLevel) allocTechLevel.classList.remove('is-sub-active');
            }
            allocCaptchaLevel.classList.toggle('is-sub-active');
        });
    }

    // --- Targeted Section Expansion (Deep Linking) ---
    const urlParams = new URLSearchParams(window.location.search);
    const urlTarget = urlParams.get('target');
    const urlCat = urlParams.get('cat');

    if (urlTarget || urlCat) {
        // Wait for page to fully load and reveal animations to settle
        window.addEventListener('load', () => {
            setTimeout(() => {
                if (urlTarget) {
                    const targetCard = document.querySelector(`.clickable-card[data-target="${urlTarget}"]`);
                    if (targetCard) {
                        targetCard.click();

                        // Specific scroll for deep links to ensure they are centered
                        setTimeout(() => {
                            const offset = 120;
                            const elementPosition = targetCard.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.pageYOffset - offset;
                            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                        }, 300);
                    }
                }

                if (urlCat) {
                    const catBtn = document.querySelector(`.category-btn[data-category="${urlCat}"]`);
                    if (catBtn) {
                        catBtn.click();
                        // Scroll to the training section
                        setTimeout(() => {
                            catBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 100);
                    }
                }
            }, 600);
        });
    }
});

/**
 * Switch between 'Servicos' and 'Produtos' tabs in the portfolio section
 * @param {string} target - The target tab ID ('servicos' or 'produtos')
 */
function switchPortfolio(target) {
    // 1. Update Buttons
    const buttons = document.querySelectorAll('.portfolio-btn');
    buttons.forEach(btn => {
        if (btn.getAttribute('onclick').includes(target)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // 2. Update Content Areas
    const contents = document.querySelectorAll('.portfolio-tab-content');
    contents.forEach(content => {
        if (content.id === target + '-content') {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });

    // 3. Re-trigger animations for the newly visible content
    const revealElements = document.querySelectorAll(`#${target}-content .reveal`);
    revealElements.forEach(el => {
        el.classList.remove('active', 'visible');
        // Small timeout to allow the display:block to take effect before re-animating
        setTimeout(() => {
            el.classList.add('active', 'visible');
        }, 50);
    });
}

// --- Training Category Switcher ---
document.addEventListener("DOMContentLoaded", () => {
    const categoryBtns = document.querySelectorAll(".category-btn");
    const trainingMenus = document.querySelectorAll(".training-menu");

    if (categoryBtns.length > 0) {
        categoryBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                const targetCategory = btn.getAttribute("data-category");
                const isActive = btn.classList.contains("active");

                // 1. Reset all buttons and menus first
                categoryBtns.forEach(b => b.classList.remove("active"));
                trainingMenus.forEach(m => m.classList.remove("active"));

                // 2. If it wasn't active, activate it. If it was active, it stays closed (toggle)
                if (!isActive) {
                    btn.classList.add("active");
                    const targetMenu = document.getElementById("menu-" + targetCategory);
                    if (targetMenu) targetMenu.classList.add("active");
                }
            });
        });
    }

    // --- Training Sub-menu (Sidebar) Switcher ---
    const sidebarItems = document.querySelectorAll(".sidebar-item");
    const trainingTracks = document.querySelectorAll(".training-track");

    sidebarItems.forEach(item => {
        item.addEventListener("click", () => {
            const targetTrack = item.getAttribute("data-training");

            // Update sidebar buttons
            const sidebar = item.closest(".training-sidebar");
            sidebar.querySelectorAll(".sidebar-item").forEach(b => b.classList.remove("active"));
            item.classList.add("active");

            // Update track visibility
            const mainContent = item.closest(".training-split-view").querySelector(".training-main-content");
            mainContent.querySelectorAll(".training-track").forEach(track => {
                if (track.id === "track-" + targetTrack) {
                    track.classList.add("active");
                } else {
                    track.classList.remove("active");
                }
            });
        });
    });

    // --- Training Selector (Dropdown) Logic ---
    const selectors = document.querySelectorAll(".training-selector");
    
    selectors.forEach(selector => {
        const trigger = selector.querySelector(".selector-trigger");
        const options = selector.querySelector(".selector-options");
        const triggerText = trigger.querySelector("span");
        
        trigger.addEventListener("click", (e) => {
            e.stopPropagation();
            options.classList.toggle("show");
            trigger.classList.toggle("active");
        });
        
        options.querySelectorAll(".sidebar-item").forEach(item => {
            item.addEventListener("click", () => {
                triggerText.textContent = item.textContent.trim();
                options.classList.remove("show");
                trigger.classList.remove("active");
            });
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", () => {
        selectors.forEach(selector => {
            selector.querySelector(".selector-options").classList.remove("show");
            selector.querySelector(".selector-trigger").classList.remove("active");
        });
    });
});

// --- Training Close Button ---
document.addEventListener("DOMContentLoaded", () => {
    const closeBtns = document.querySelectorAll(".btn-close-training");
    closeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const activeCategoryBtn = document.querySelector(".category-btn.active");
            if (activeCategoryBtn) activeCategoryBtn.click();
        });
    });
});
