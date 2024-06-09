import React, { useEffect, useState } from 'react';
import styles from "./alert.module.scss"

interface CustomAlertProps {
    type: 'success' | 'error';
    message: string;
    onClose: () => void;
}

const Alert: React.FC<CustomAlertProps> = ({ type, message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);
    const alertClass = `${styles.customAlert} ${type === "error" ? styles.error : styles.success}`;

    return (
        <div className={alertClass}>
            <span>{message}</span>
            <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>
    );
};

export default Alert;
