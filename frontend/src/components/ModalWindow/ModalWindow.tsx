import React, { useEffect, useRef, FC } from 'react';
import styles from './ModalWindow.module.scss';

interface ModalWindowProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const ModalWindow: FC<ModalWindowProps> = ({ isOpen, onClose, title, children }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (!isOpen) return null;

    return (
        <div className={styles.modal} ref={modalRef}>
            <div className={styles.modalHeader}>
                <h3>{title}</h3>
                <div onClick={onClose} className={styles.closeButton}></div>
            </div>
            <div className={styles.modalContent}>
                {children}
            </div>
        </div>
    );
};

export default ModalWindow;
