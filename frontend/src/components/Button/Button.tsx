import React from 'react';
import styles from './button.module.scss';

interface ButtonProps {
    children: React.ReactNode;
    wide?: boolean;
    onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, wide = false, onClick }) => {
    const buttonClass = wide ? `${styles.button} ${styles.buttonWide}` : styles.button;
    const containerClass = wide ? `${styles.buttonContainer} ${styles.buttonContainerCenter}` : styles.buttonContainer;

    return (
        <div className={containerClass}>
            <button className={buttonClass} onClick={onClick}>{children}</button>
        </div>
    );
};

export default Button;