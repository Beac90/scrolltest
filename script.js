document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const body = document.body;
    const desktopHeader = document.getElementById('desktop-header');
    const mobileHeader = document.getElementById('mobile-header');
    const bottomNav = document.getElementById('bottom-nav');
    const pageContainers = document.querySelectorAll('.page-container');
    const navItems = document.querySelectorAll('#bottom-nav .nav-item');

    const desktopProfileIcon = document.getElementById('desktop-profile-icon');
    const mobileProfileIcon = document.getElementById('mobile-profile-icon');
    const profileSlideout = document.getElementById('profile-slideout');
    const closeProfileBtn = document.getElementById('close-profile-btn');

    const profileSegmentedButtons = document.querySelectorAll('.profile-content .segmented-button');
    const profileContentSections = document.querySelectorAll('.profile-content .content-section');

    const mobileSearchIcon = document.getElementById('mobile-search-icon');
    const overlayMenu = document.getElementById('overlay-menu');
    const closeOverlayMenuBtn = document.getElementById('close-overlay-menu');
    const moreNavItem = document.querySelector('.nav-item[data-page="more-menu"]');

    const heroTextLines = document.querySelectorAll('.hero-content-text .animated-text-line');
    const heroImage = document.querySelector('.hero-content-image');

    // --- Header and Footer Visibility Logic ---
    let lastScrollY = window.scrollY;
    let desktopBreakpoint = 768; // Matches CSS media query

    function setBodyPadding() {
        const isDesktop = window.innerWidth >= desktopBreakpoint;
        const headerHeight = isDesktop ? getComputedStyle(document.documentElement).getPropertyValue('--desktop-header-height') : getComputedStyle(document.documentElement).getPropertyValue('--mobile-header-height');
        const bottomNavHeight = getComputedStyle(document.documentElement).getPropertyValue('--bottom-nav-height');
        const searchPageMain = document.getElementById('search-page-main');
        const homePage = document.getElementById('home-page');

        // Apply padding to body based on header height
        body.style.paddingTop = headerHeight;

        // Apply padding-bottom only if bottom nav is visible and not on desktop
        if (!isDesktop) {
            body.style.paddingBottom = bottomNavHeight;
        } else {
            body.style.paddingBottom = '0px';
        }

        // Adjust specific page padding for consistency with headers
        pageContainers.forEach(page => {
             if (page.id === 'search-page') {
                // Search page handles its own padding, sticky header adjusts
                // Need to ensure the content inside search-page-content doesn't get additional top padding
                // This is mostly about making sure the fixed elements are accounted for on body padding.
            } else {
                // Other pages might need top padding if they don't have their own internal header handling
                // This logic is mostly handled by `body.paddingTop`
            }
        });
    }

    function handleHeaderVisibility() {
        if (window.innerWidth >= desktopBreakpoint) {
            desktopHeader.style.display = 'flex';
            mobileHeader.style.display = 'none';
            bottomNav.style.display = 'none';
        } else {
            desktopHeader.style.display = 'none';
            mobileHeader.style.display = 'flex';
            bottomNav.style.display = 'flex';
        }
        setBodyPadding(); // Re-calculate padding on resize
    }

    // Bottom Navigation Hide/Show on Scroll (Mobile only)
    function handleBottomNavVisibility() {
        if (window.innerWidth < desktopBreakpoint) {
            if (profileSlideout.classList.contains('show') || overlayMenu.classList.contains('show')) {
                // Don't hide bottom nav if profile or overlay menu is open
                bottomNav.classList.remove('hidden-nav');
                return;
            }

            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > mobileHeader.offsetHeight) {
                // Scrolling down, hide nav, but only if past the mobile header
                bottomNav.classList.add('hidden-nav');
            } else if (currentScrollY < lastScrollY || currentScrollY <= 0) {
                // Scrolling up or at the very top, show nav
                bottomNav.classList.remove('hidden-nav');
            }
            lastScrollY = currentScrollY;
        } else {
            bottomNav.style.display = 'none'; // Ensure hidden on desktop
            bottomNav.classList.remove('hidden-nav'); // Reset class in case of resize
        }
    }

    // --- Page Routing (Simplified) ---
    function showPage(pageId) {
        pageContainers.forEach(page => {
            page.style.display = 'none';
        });
        document.getElementById(pageId).style.display = 'flex'; // Use flex for home, block for others if needed

        // Update active state of bottom nav items
        navItems.forEach(item => {
            if (item.dataset.page === pageId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Specific actions per page
        if (pageId === 'home-page') {
            body.style.backgroundColor = 'var(--color-white)'; // Or hero background
            // Trigger home page animations
            setTimeout(() => {
                heroTextLines.forEach((line, index) => {
                    line.style.animationDelay = `${index * 0.2}s`;
                    line.classList.add('animate');
                });
                heroImage.classList.add('animate');
            }, 100); // Small delay to ensure display is set
            // Change mobile profile icon for home page hero
            document.getElementById('mobile-profile-icon').id = 'home-page-mobile-profile';
        } else {
            // Remove home page specific classes if not on home page
            heroTextLines.forEach(line => line.classList.remove('animate'));
            heroImage.classList.remove('animate');
            const mobileProfile = document.getElementById('home-page-mobile-profile');
            if (mobileProfile) {
                mobileProfile.id = 'mobile-profile-icon'; // Revert ID
            }
            body.style.backgroundColor = 'var(--color-white)';
        }

        // Reset scroll position to top when changing pages
        window.scrollTo(0, 0);
        lastScrollY = 0; // Reset last scroll position for bottom nav logic
        handleBottomNavVisibility(); // Ensure bottom nav state is correct
    }

    // Initial page load (show home page)
    showPage('home-page');

    // --- Event Listeners ---

    // Nav Item Clicks
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.currentTarget.dataset.page;
            if (page === 'profile') {
                profileSlideout.classList.add('show');
                body.style.overflow = 'hidden'; // Prevent body scroll when menu is open
                bottomNav.classList.add('hidden-nav'); // Hide bottom nav when profile is open
            } else if (page === 'more-menu') {
                overlayMenu.classList.add('show');
                body.style.overflow = 'hidden'; // Prevent body scroll when menu is open
                bottomNav.classList.add('hidden-nav'); // Hide bottom nav when overlay is open
            }
            else if (page === 'add-listing') {
                alert('Denna sida är under utveckling!'); // Placeholder for "Sälj" button
                // Ideally, navigate to an "add listing" page
            }
            else {
                showPage(page === 'home' ? 'home-page' : 'search-page'); // Map data-page to actual page ID
                profileSlideout.classList.remove('show'); // Close profile if open
                overlayMenu.classList.remove('show'); // Close overlay if open
                body.style.overflow = ''; // Allow body scroll
            }
        });
    });

    // Profile Menu Toggle
    if (desktopProfileIcon) {
        desktopProfileIcon.addEventListener('click', () => {
            profileSlideout.classList.add('show');
            body.style.overflow = 'hidden';
            bottomNav.classList.add('hidden-nav');
        });
    }
    if (mobileProfileIcon) { // Use a click listener on parent header if mobileProfileIcon is dynamic
         // Attach event listener directly to the icon. The ID is dynamically changed for home page, so let's use a class or more robust selector.
        document.addEventListener('click', (e) => {
            if (e.target.closest('#mobile-profile-icon') || e.target.closest('#home-page-mobile-profile')) {
                profileSlideout.classList.add('show');
                body.style.overflow = 'hidden';
                bottomNav.classList.add('hidden-nav');
            }
        });
    }

    if (closeProfileBtn) {
        closeProfileBtn.addEventListener('click', () => {
            profileSlideout.classList.remove('show');
            body.style.overflow = ''; // Restore body scroll
            handleBottomNavVisibility(); // Ensure bottom nav reappears if needed
        });
    }

    // Overlay Menu Toggle
    if (mobileSearchIcon) {
        mobileSearchIcon.addEventListener('click', (e) => {
            // If the search icon should also open the overlay for 'Mer'
            // For now, let's assume it leads to the search page directly as per current nav item.
            // If you want it to open a *different* search overlay, this needs more specific markup.
            // For now, it will just switch to the search page.
            showPage('search-page');
            profileSlideout.classList.remove('show'); // Close profile if open
            overlayMenu.classList.remove('show'); // Close overlay if open
            body.style.overflow = ''; // Allow body scroll
        });
    }

    if (moreNavItem) {
         moreNavItem.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default navigation
            overlayMenu.classList.add('show');
            body.style.overflow = 'hidden';
            bottomNav.classList.add('hidden-nav');
         });
    }

    if (closeOverlayMenuBtn) {
        closeOverlayMenuBtn.addEventListener('click', () => {
            overlayMenu.classList.remove('show');
            body.style.overflow = ''; // Restore body scroll
            handleBottomNavVisibility(); // Ensure bottom nav reappears if needed
        });
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

    // Search Page Tab Control
    const searchTabButtons = document.querySelectorAll('.search-tab-button');
    searchTabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            searchTabButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            // Add logic here to filter listings based on 'buy' or 'coming-soon'
            console.log(`Showing listings for: ${e.target.dataset.tab}`);
            // In a real app, you'd fetch/filter data here.
        });
    });

    // Scroll event for bottom nav
    window.addEventListener('scroll', handleBottomNavVisibility);

    // Resize event to handle header/footer display and padding
    window.addEventListener('resize', handleHeaderVisibility);

    // Initial setup calls
    handleHeaderVisibility(); // Sets initial header display and body padding
});
