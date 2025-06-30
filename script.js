document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const body = document.body;
    const desktopHeader = document.getElementById('desktop-header');
    const mobileHeader = document.getElementById('mobile-header');
    const bottomNav = document.getElementById('bottom-nav');
    const pageContainers = document.querySelectorAll('.page-container');
    const navItems = document.querySelectorAll('#bottom-nav .nav-item');

    const desktopProfileIcon = document.getElementById('desktop-profile-icon');
    // Use class for mobile profile icon as its ID changes for home page styling
    const mobileProfileIcon = document.querySelector('.mobile-profile-icon');
    const profileSlideout = document.getElementById('profile-slideout');
    const closeProfileBtn = document.getElementById('close-profile-btn');

    const profileSegmentedButtons = document.querySelectorAll('.profile-content .segmented-button');
    const profileContentSections = document.querySelectorAll('.profile-content .content-section');

    const mobileSearchIcon = document.querySelector('.mobile-search-icon');
    const overlayMenu = document.getElementById('overlay-menu');
    const closeOverlayMenuBtn = document.getElementById('close-overlay-menu');
    const moreNavItem = document.querySelector('.nav-item[data-page="more-menu"]');

    const heroTextLines = document.querySelectorAll('.hero-content-text .animated-text-line');
    const heroImage = document.querySelector('.hero-content-image');

    const searchInput = document.querySelector('.search-input-container input');
    const clearSearchBtn = document.querySelector('.search-input-container .clear-input-btn');

    // --- State Variables ---
    let lastScrollY = window.scrollY;
    const desktopBreakpoint = 768; // Matches CSS media query breakpoint

    // --- Helper Functions ---

    /**
     * Updates body padding based on active header and bottom nav visibility.
     * Crucial for preventing content from being hidden behind fixed headers/footers.
     */
    function setBodyPadding() {
        const isDesktop = window.innerWidth >= desktopBreakpoint;
        const currentHeader = isDesktop ? desktopHeader : mobileHeader;
        const headerHeight = currentHeader.offsetHeight; // Get actual rendered height

        body.style.paddingTop = `${headerHeight}px`;

        if (!isDesktop) {
            body.style.paddingBottom = getComputedStyle(document.documentElement).getPropertyValue('--bottom-nav-height');
        } else {
            body.style.paddingBottom = '0px';
        }
    }

    /**
     * Manages desktop vs. mobile header/bottom nav display.
     */
    function handleLayoutVisibility() {
        if (window.innerWidth >= desktopBreakpoint) {
            desktopHeader.style.display = 'flex';
            mobileHeader.style.display = 'none';
            bottomNav.style.display = 'none';
            bottomNav.classList.remove('bottom-nav-hidden'); // Ensure reset
        } else {
            desktopHeader.style.display = 'none';
            mobileHeader.style.display = 'flex';
            bottomNav.style.display = 'flex';
        }
        setBodyPadding(); // Always recalculate padding on layout change
    }

    /**
     * Hides/shows the bottom navigation bar on scroll (mobile only).
     */
    function handleBottomNavVisibility() {
        if (window.innerWidth < desktopBreakpoint) {
            // Do not hide bottom nav if profile or overlay menu is open
            if (profileSlideout.classList.contains('show') || overlayMenu.classList.contains('show')) {
                bottomNav.classList.remove('bottom-nav-hidden');
                return; // Exit early
            }

            const currentScrollY = window.scrollY;
            // Only hide if scrolling down AND not at the very top AND scrolled past the header height
            if (currentScrollY > lastScrollY && currentScrollY > mobileHeader.offsetHeight + 10) { // Add a small threshold
                bottomNav.classList.add('bottom-nav-hidden');
            } else if (currentScrollY < lastScrollY || currentScrollY <= mobileHeader.offsetHeight) {
                // Scrolling up, or at/near the top, show nav
                bottomNav.classList.remove('bottom-nav-hidden');
            }
            lastScrollY = currentScrollY;
        } else {
            // Ensure bottom nav is hidden and reset on desktop
            bottomNav.style.display = 'none';
            bottomNav.classList.remove('bottom-nav-hidden');
        }
    }

    /**
     * Activates a given page and deactivates others.
     * Manages page-specific styling/animations.
     * @param {string} pageId - The ID of the page to show (e.g., 'home-page', 'search-page').
     */
    function showPage(pageId) {
        // Hide all pages first
        pageContainers.forEach(page => {
            page.style.display = 'none';
        });

        // Show the target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            // Home page uses flex, others generally block
            targetPage.style.display = (pageId === 'home-page') ? 'flex' : 'block';
        }

        // Update active state of bottom nav items
        navItems.forEach(item => {
            if (item.dataset.page === pageId.replace('-page', '')) { // Convert 'home-page' to 'home'
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Specific actions per page
        if (pageId === 'home-page') {
            // Trigger home page animations with a slight delay
            // RequestAnimationFrame ensures browser is ready for paint before animation starts
            requestAnimationFrame(() => {
                heroTextLines.forEach((line, index) => {
                    // Set custom property for delay (easier than style.animationDelay)
                    line.style.setProperty('--animation-delay', `${index * 0.2}s`);
                    line.classList.add('animate');
                });
                heroImage.classList.add('animate');
                // Adjust mobile profile icon style for home page hero
                mobileProfileIcon.classList.add('on-home-page');
            });
        } else {
            // Remove home page specific classes if not on home page
            heroTextLines.forEach(line => {
                line.classList.remove('animate');
                line.style.removeProperty('--animation-delay'); // Clean up custom property
            });
            heroImage.classList.remove('animate');
            mobileProfileIcon.classList.remove('on-home-page');
        }

        // Ensure overlays are closed
        profileSlideout.classList.remove('show');
        overlayMenu.classList.remove('show');
        body.classList.remove('no-scroll'); // Restore body scroll

        // Reset scroll position to top when changing pages, but defer to allow layout to settle
        window.scrollTo({ top: 0, behavior: 'instant' }); // Use 'instant' for direct page jumps
        lastScrollY = 0; // Reset last scroll position for bottom nav logic
        handleBottomNavVisibility(); // Ensure bottom nav state is correct
    }

    /**
     * Manages overlay (profile/more menu) open/close state.
     * @param {HTMLElement} overlayElement - The overlay DOM element.
     * @param {boolean} show - True to show, false to hide.
     */
    function toggleOverlay(overlayElement, show) {
        if (show) {
            overlayElement.classList.add('show');
            body.classList.add('no-scroll'); // Disable body scroll
            bottomNav.classList.add('bottom-nav-hidden'); // Hide bottom nav
        } else {
            overlayElement.classList.remove('show');
            body.classList.remove('no-scroll'); // Enable body scroll
            handleBottomNavVisibility(); // Re-evaluate bottom nav visibility
        }
    }

    // --- Event Listeners ---

    // Initial page load (show home page)
    showPage('home-page');
    // Set initial padding based on current layout
    handleLayoutVisibility();

    // Nav Item Clicks (Bottom Nav and Desktop Nav)
    // Use event delegation for desktop nav links
    desktopHeader.addEventListener('click', (e) => {
        const targetLink = e.target.closest('a[data-page]');
        if (targetLink) {
            e.preventDefault();
            showPage(`${targetLink.dataset.page}-page`);
        }
    });

    // Bottom Nav Item Clicks
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.currentTarget.dataset.page;

            if (page === 'profile') {
                toggleOverlay(profileSlideout, true);
            } else if (page === 'more-menu') {
                toggleOverlay(overlayMenu, true);
            } else if (page === 'add-listing') {
                alert('Denna sida är under utveckling!'); // Placeholder for "Sälj" button
            } else {
                showPage(`${page}-page`); // Map data-page to actual page ID
            }
        });
    });

    // Profile Menu Toggle (Desktop and Mobile)
    if (desktopProfileIcon) {
        desktopProfileIcon.addEventListener('click', () => toggleOverlay(profileSlideout, true));
    }

    // Mobile profile icon - use delegation as ID might change on home page
    document.addEventListener('click', (e) => {
        if (e.target.closest('.mobile-profile-icon')) {
            toggleOverlay(profileSlideout, true);
        }
    });

    if (closeProfileBtn) {
        closeProfileBtn.addEventListener('click', () => toggleOverlay(profileSlideout, false));
    }

    // Overlay Menu Toggle (Mobile search icon should actually go to search page, not open overlay for 'Mer')
    if (mobileSearchIcon) {
        mobileSearchIcon.addEventListener('click', () => showPage('search-page'));
    }

    if (closeOverlayMenuBtn) {
        closeOverlayMenuBtn.addEventListener('click', () => toggleOverlay(overlayMenu, false));
    }

    // Profile Segmented Control
    profileSegmentedButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const tabToActivate = e.target.dataset.profileTab;

            profileSegmentedButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            profileContentSections.forEach(section => {
                if (section.id === `profile-${tabToActivate}-content`) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
        });
    });

    // Search Page Tab Control (Till Salu / Kommande)
    const searchTabButtons = document.querySelectorAll('.search-tab-button');
    searchTabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            searchTabButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            // In a real app, you'd fetch/filter data here based on e.target.dataset.tab
            console.log(`Showing listings for: ${e.target.dataset.tab}`);
        });
    });

    // Search input clear button logic
    if (searchInput && clearSearchBtn) {
        searchInput.addEventListener('input', () => {
            clearSearchBtn.style.display = searchInput.value.length > 0 ? 'inline-block' : 'none';
        });
        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            clearSearchBtn.style.display = 'none';
            searchInput.focus(); // Keep focus on input after clearing
        });
    }


    // Global Event Listeners
    window.addEventListener('scroll', handleBottomNavVisibility);
    window.addEventListener('resize', () => {
        handleLayoutVisibility(); // Handle header/footer display and padding
        handleBottomNavVisibility(); // Adjust bottom nav visibility based on new size
    });
});
