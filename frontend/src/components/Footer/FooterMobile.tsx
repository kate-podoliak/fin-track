import React, {useEffect, useState} from 'react';
import styles from "../../assets/styles/footerMobile.module.scss"
import Link from "next/link";
import EventCount from "@/components/EventCount/EventCount";

export const FooterMobile = () => {

    const [activeMenuItem, setActiveMenuItem] = useState<string | null>('home');

    useEffect(() => {
        const savedActiveItem = localStorage.getItem('activeMenuItem');
        if (savedActiveItem) {
            setActiveMenuItem(savedActiveItem);
        }
    }, []);

    const handleMenuItemClick = (item: string) => {
        setActiveMenuItem(item);
        localStorage.setItem('activeMenuItem', item);
    };

    return (
        <div className={styles.footer1}>
            <div className="container">
                <div className={styles.footerMenu}>
                    <Link href="/" passHref>
                        <div className={`${styles.menuItem} ${activeMenuItem === 'home' ? styles.active : ''}`}
                             onClick={() => handleMenuItemClick('home')}>
                            <div className={styles.menuItemIcon}>
                                <svg width="22px" height="22px" viewBox="0 0 1024 1024" className="icon" version="1.1" fill="#4f4f4f"
                                     xmlns="http://www.w3.org/2000/svg"
                                     stroke-width="16.384">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path
                                            d="M981.4 502.3c-9.1 0-18.3-2.9-26-8.9L539 171.7c-15.3-11.8-36.7-11.8-52 0L70.7 493.4c-18.6 14.4-45.4 10.9-59.7-7.7-14.4-18.6-11-45.4 7.7-59.7L435 104.3c46-35.5 110.2-35.5 156.1 0L1007.5 426c18.6 14.4 22 41.1 7.7 59.7-8.5 10.9-21.1 16.6-33.8 16.6z"
                                        ></path>
                                        <path
                                            d="M810.4 981.3H215.7c-70.8 0-128.4-57.6-128.4-128.4V534.2c0-23.5 19.1-42.6 42.6-42.6s42.6 19.1 42.6 42.6v318.7c0 23.8 19.4 43.2 43.2 43.2h594.8c23.8 0 43.2-19.4 43.2-43.2V534.2c0-23.5 19.1-42.6 42.6-42.6s42.6 19.1 42.6 42.6v318.7c-0.1 70.8-57.7 128.4-128.5 128.4z"
                                        ></path>
                                    </g>
                                </svg>
                            </div>
                            <div
                                className={styles.menuItemTitle}>
                                <p>Головна</p>
                            </div>
                        </div>
                    </Link>
                    <Link href="/incomes" passHref>
                        <div className={`${styles.menuItem} ${activeMenuItem === 'incomes' ? styles.active : ''}`}
                             onClick={() => handleMenuItemClick('incomes')}>
                            <div className={styles.menuItemIcon}>
                                <svg width="22px" height="22px" viewBox="-0.5 0 25 25" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path d="M18 2.91992V10.9199" stroke-width="2.5" stroke-linecap="round"
                                              stroke-linejoin="round"></path>
                                        <path d="M21.2008 7.71997L18.0008 10.92L14.8008 7.71997" stroke-width="2.5"
                                              stroke-linecap="round" stroke-linejoin="round"></path>
                                        <path
                                            d="M10.58 3.96997H6C4.93913 3.96997 3.92178 4.39146 3.17163 5.1416C2.42149 5.89175 2 6.9091 2 7.96997V17.97C2 19.0308 2.42149 20.0482 3.17163 20.7983C3.92178 21.5485 4.93913 21.97 6 21.97H18C19.0609 21.97 20.0783 21.5485 20.8284 20.7983C21.5786 20.0482 22 19.0308 22 17.97V13.8999"
                                            stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                        <path
                                            d="M2 9.96997H5.37006C6.16571 9.96997 6.92872 10.286 7.49133 10.8486C8.05394 11.4112 8.37006 12.1743 8.37006 12.97C8.37006 13.7656 8.05394 14.5287 7.49133 15.0913C6.92872 15.6539 6.16571 15.97 5.37006 15.97H2"
                                            stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </g>
                                </svg>
                            </div>
                            <div
                                className={styles.menuItemTitle}>
                                <p>Доходи</p>
                            </div>
                        </div>
                    </Link>
                    <Link href="/expenses" passHref>
                        <div className={`${styles.menuItem} ${activeMenuItem === 'expenses' ? styles.active : ''}`}
                             onClick={() => handleMenuItemClick('expenses')}>
                            <div className={styles.menuItemIcon}>
                                <svg width="22px" height="22px" viewBox="-0.5 0 25 25" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path d="M18 10.9199V2.91992" stroke="#4F4F4F" stroke-width="2.5"
                                              stroke-linecap="round" stroke-linejoin="round"></path>
                                        <path d="M14.8008 6.11992L18.0008 2.91992L21.2008 6.11992" stroke="#4F4F4F"
                                              stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                        <path
                                            d="M10.58 3.96997H6C4.93913 3.96997 3.92178 4.39146 3.17163 5.1416C2.42149 5.89175 2 6.9091 2 7.96997V17.97C2 19.0308 2.42149 20.0482 3.17163 20.7983C3.92178 21.5485 4.93913 21.97 6 21.97H18C19.0609 21.97 20.0783 21.5485 20.8284 20.7983C21.5786 20.0482 22 19.0308 22 17.97V13.8999"
                                            stroke="#4F4F4F" stroke-width="2.5" stroke-linecap="round"
                                            stroke-linejoin="round"></path>
                                        <path
                                            d="M2 9.96997H5.37006C6.16571 9.96997 6.92872 10.286 7.49133 10.8486C8.05394 11.4112 8.37006 12.1743 8.37006 12.97C8.37006 13.7656 8.05394 14.5287 7.49133 15.0913C6.92872 15.6539 6.16571 15.97 5.37006 15.97H2"
                                            stroke="#4F4F4F" stroke-width="2.5" stroke-linecap="round"
                                            stroke-linejoin="round"></path>
                                    </g>
                                </svg>
                            </div>
                            <div
                                className={styles.menuItemTitle}>
                                <p>Витрати</p>
                            </div>
                        </div>
                    </Link>
                    <Link href="/settings" passHref>
                        <div className={`${styles.menuItem} ${activeMenuItem === 'settings' ? styles.active : ''}`}
                             onClick={() => handleMenuItemClick('settings')}>
                            <div className={styles.menuItemIcon}>
                                <EventCount type={'main'}/>
                                <svg width="22px" height="22px" viewBox="0 0 24 24" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <circle cx="12" cy="12" r="3" stroke-width="2.4"></circle>
                                        <path
                                            d="M13.7654 2.15224C13.3978 2 12.9319 2 12 2C11.0681 2 10.6022 2 10.2346 2.15224C9.74457 2.35523 9.35522 2.74458 9.15223 3.23463C9.05957 3.45834 9.0233 3.7185 9.00911 4.09799C8.98826 4.65568 8.70226 5.17189 8.21894 5.45093C7.73564 5.72996 7.14559 5.71954 6.65219 5.45876C6.31645 5.2813 6.07301 5.18262 5.83294 5.15102C5.30704 5.08178 4.77518 5.22429 4.35436 5.5472C4.03874 5.78938 3.80577 6.1929 3.33983 6.99993C2.87389 7.80697 2.64092 8.21048 2.58899 8.60491C2.51976 9.1308 2.66227 9.66266 2.98518 10.0835C3.13256 10.2756 3.3397 10.437 3.66119 10.639C4.1338 10.936 4.43789 11.4419 4.43786 12C4.43783 12.5581 4.13375 13.0639 3.66118 13.3608C3.33965 13.5629 3.13248 13.7244 2.98508 13.9165C2.66217 14.3373 2.51966 14.8691 2.5889 15.395C2.64082 15.7894 2.87379 16.193 3.33973 17C3.80568 17.807 4.03865 18.2106 4.35426 18.4527C4.77508 18.7756 5.30694 18.9181 5.83284 18.8489C6.07289 18.8173 6.31632 18.7186 6.65204 18.5412C7.14547 18.2804 7.73556 18.27 8.2189 18.549C8.70224 18.8281 8.98826 19.3443 9.00911 19.9021C9.02331 20.2815 9.05957 20.5417 9.15223 20.7654C9.35522 21.2554 9.74457 21.6448 10.2346 21.8478C10.6022 22 11.0681 22 12 22C12.9319 22 13.3978 22 13.7654 21.8478C14.2554 21.6448 14.6448 21.2554 14.8477 20.7654C14.9404 20.5417 14.9767 20.2815 14.9909 19.902C15.0117 19.3443 15.2977 18.8281 15.781 18.549C16.2643 18.2699 16.8544 18.2804 17.3479 18.5412C17.6836 18.7186 17.927 18.8172 18.167 18.8488C18.6929 18.9181 19.2248 18.7756 19.6456 18.4527C19.9612 18.2105 20.1942 17.807 20.6601 16.9999C21.1261 16.1929 21.3591 15.7894 21.411 15.395C21.4802 14.8691 21.3377 14.3372 21.0148 13.9164C20.8674 13.7243 20.6602 13.5628 20.3387 13.3608C19.8662 13.0639 19.5621 12.558 19.5621 11.9999C19.5621 11.4418 19.8662 10.9361 20.3387 10.6392C20.6603 10.4371 20.8675 10.2757 21.0149 10.0835C21.3378 9.66273 21.4803 9.13087 21.4111 8.60497C21.3592 8.21055 21.1262 7.80703 20.6602 7C20.1943 6.19297 19.9613 5.78945 19.6457 5.54727C19.2249 5.22436 18.693 5.08185 18.1671 5.15109C17.9271 5.18269 17.6837 5.28136 17.3479 5.4588C16.8545 5.71959 16.2644 5.73002 15.7811 5.45096C15.2977 5.17191 15.0117 4.65566 14.9909 4.09794C14.9767 3.71848 14.9404 3.45833 14.8477 3.23463C14.6448 2.74458 14.2554 2.35523 13.7654 2.15224Z"
                                            stroke-width="2.4"></path>
                                    </g>
                                </svg>
                            </div>
                            <div
                                className={styles.menuItemTitle}>
                                <p>Налаштування</p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};