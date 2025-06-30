import React, { useState, useEffect } from 'react';
import Header from './components/common/Header';
import BottomNav from './components/common/BottomNav';
import ProfileSlideout from './components/overlays/ProfileSlideout';
// OverlayMenu and HomePage are directly rendered now
import HomePage from './pages/HomePage';

import styles from './styles/App.module.css';

const desktopBreakpoint = 768; // Matches CSS media query

function App() {
    // We only need to track the profile slideout, no other pages for simplicity
    const [isProfileSlideoutOpen, setIsProfileSlideoutOpen] = useState(false);
    // OverlayMenu is removed from App.js state, will be handled if needed later
    const [isMobile, setIsMobile] = useState(window.innerWidth < desktopBreakpoint);

    // Effect to handle body scrolling when overlays are open
    useEffect(() => {
        if (isProfileSlideoutOpen) { // Only check profile slideout
            document.body.classList.add(styles.noScroll);
        } else {
            document.body.classList.remove(styles.noScroll);
        }
        return () => {
            document.body.classList.remove(styles.noScroll);
        };
    }, [isProfileSlideoutOpen]);

    // Effect to handle window resize for mobile/desktop layout
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < desktopBreakpoint);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Set body padding based on header visibility
    useEffect(() => {
        const setBodyPadding = () => {
            const headerElement = isMobile ? document.getElementById('mobile-header') : document.getElementById('desktop-header');
            const headerHeight = headerElement ? headerElement.offsetHeight : 0;
            document.body.style.paddingTop = `${headerHeight}px`;

            if (isMobile) {
                // Get CSS variable for bottom nav height
                const bottomNavHeight = getComputedStyle(document.documentElement).getPropertyValue('--bottom-nav-height');
                document.body.style.paddingBottom = bottomNavHeight;
            } else {
                document.body.style.paddingBottom = '0px';
            }
        };

        const timeoutId = setTimeout(setBodyPadding, 50); // Delay slightly to ensure header is rendered
        setBodyPadding(); // Initial call

        return () => clearTimeout(timeoutId); // Cleanup timeout
    }, [isMobile, isProfileSlideoutOpen]); // Re-run when these dependencies change

    // Simplified navigation handlers
    const openProfile = () => setIsProfileSlideoutOpen(true);
    const closeProfile = () => setIsProfileSlideoutOpen(false);
    // Other navigation actions (like search) can just be placeholders for now
    const handleNavigation = (action) => {
        if (action === 'profile') {
            openProfile();
        } else {
            alert(`Navigerade till: ${action}. (Endast profilfunktion implementerad i denna demo.)`);
            // Here you'd use react-router-dom for actual page changes
        }
    };

    return (
        <div className={styles.appContainer}>
            <Header
                isMobile={isMobile}
                onProfileClick={openProfile}
                onSearchClick={() => handleNavigation('search')} // Placeholder
                onLogoClick={() => handleNavigation('home')} // Placeholder
                currentPage="home" // Always "home" for this simplified demo
                onNavLinkClick={handleNavigation} // For desktop navigation
            />

            <HomePage /> {/* Always render the HomePage */}

            <BottomNav
                isMobile={isMobile}
                currentPage="home" // Always "home" for this simplified demo
                onNavItemClick={handleNavigation}
                isOverlayOpen={isProfileSlideoutOpen}
            />

            <ProfileSlideout
                isOpen={isProfileSlideoutOpen}
                onClose={closeProfile}
            />
            {/* OverlayMenu removed, as it was only for 'Mer' which is not a core demo focus */}
        </div>
    );
}

export default App;
