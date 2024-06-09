import React, { useState } from 'react';
import styles from './timeFilter.module.scss';

interface TimeFilterProps {
    onFilterChange: (filter: string) => void;
}
export default function TimeFilter({ onFilterChange }: TimeFilterProps) {
    const [activeFilter, setActiveFilter] = useState('Всі');

    const handleFilterClick = (filter: string) => {
        setActiveFilter(filter);
        onFilterChange(filter);
    };

    return (
        <div className={styles.timeFilter}>
            {['Всі', 'День', 'Тиждень', 'Місяць'].map((filter) => (
                <div
                    key={filter}
                    onClick={() => handleFilterClick(filter)}
                    className={`${styles.filter} ${activeFilter === filter ? styles.active : ''}`}
                >
                    {filter[0].toUpperCase() + filter.slice(1)}
                </div>
            ))}
        </div>
    );
}
