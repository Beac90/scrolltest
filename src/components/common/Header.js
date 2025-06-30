import React from 'react';
import styles from '../../styles/App.module.css';

const Header = ({ isMobile, onProfileClick, onSearchClick, onLogoClick, onNavLinkClick, currentPage }) => {
    return (
        <>
            {/* Mobile Header */}
            {isMobile && (
                <header className={styles.mobileHeader} id="mobile-header">
                    <a href="#" className={styles.logo} onClick={(e) => { e.preventDefault(); onLogoClick(); }}>EO Market</a>
                    <div className={styles.headerIcons}>
                        <div className={styles.headerIcon} onClick={onSearchClick}><i className="fas fa-search"></i></div>
                        {/* Only show on home page for a specific style, always clickable */}
                        <div className={`${styles.headerIcon} ${currentPage === 'home' ? styles.onHomePage : ''}`} onClick={onProfileClick}><i className="fas fa-user"></i></div>
                    </div>
                </header>
            )}

            {/* Desktop Header */}
            {!isMobile && (
                <header className={styles.desktopHeader} id="desktop-header">
                    <a href="#" className={styles.logo} onClick={(e) => { e.preventDefault(); onLogoClick(); }}>EO Market</a>
                    <nav>
                        <ul>
                            <li><a href="#" onClick={(e) => { e.preventDefault(); onNavLinkClick('home'); }} data-page="home">Hem</a></li>
                            <li><a href="#" onClick={(e) => { e.preventDefault(); onNavLinkClick('search'); }} data-page="search">Sök bostad</a></li>
                            <li><a href="#" onClick={(e) => e.preventDefault()}>Värdera</a></li>
                            <li><a href="#" onClick={(e) => e.preventDefault()}>Kontakta oss</a></li>
                        </ul>
                    </nav>
                    <div>
                        <a href="#" className={styles.ctaButton} onClick={(e) => e.preventDefault()}>Boka möte</a>
                        <span className={styles.profileIcon} onClick={onProfileClick}><i className="fas fa-user"></i></span>
                    </div>
                </header>
            )}
        </>
    );
};

export default Header;
