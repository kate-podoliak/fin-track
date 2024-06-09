import React from 'react';
import styles from './numberPad.module.scss';

interface NumberPadProps {
    value: string;
    onChange: (value: string) => void;
}

export default function NumberPad({ value, onChange }: NumberPadProps) {

    const handleNumberClick = (number: string) => {
        if (number === '.' && value.includes('.')) return;
        if (value === '0' && number !== '.') return;
        onChange(value === '0' ? number : value + number);
    };

    const handleBackspace = () => {
        onChange(value.slice(0, -1) || '0');
    };

    return (
        <div className={styles.numberPad}>
            <div className={styles.display}>{`₴${value}`}</div>
            <div className={styles.numbers}>
                {Array.from({ length: 9 }, (_, i) => (
                    <button key={i + 1} onClick={() => handleNumberClick(String(i + 1))}>
                        {i + 1}
                    </button>
                ))}
                <button onClick={() => handleNumberClick('.')}>.</button>
                <button onClick={() => handleNumberClick('0')}>0</button>
                <button onClick={handleBackspace}>⌫</button>
            </div>
        </div>
    );
}
