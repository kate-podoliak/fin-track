import React from 'react';
import styles from '../ItemReport/itemReport.module.scss';
import {formatDate} from "@/utils/formatDate";
import {formatAmount} from "@/utils/formatAmount";

interface Event {
    status: string,
    amount: number,
    name: string,
    date: string
}
const ItemReminder = ({status, amount, date, name}: Event) => {
    const deleteReminder = async () => {

    };

    const iconColor = status === 'Active' ? 'green' : 'red';

    return (
        <div className={styles.item}>
            <div className={styles.header}>
                <div className={styles.leftContainer}>
                    <div className={styles.icon} style={{backgroundColor: `${iconColor}`}}></div>
                    <div className={styles.details}>
                        <div className={styles.title} style={{fontSize: "14px"}}>{name}</div>
                        <div className={styles.subtitleTransaction}>{formatDate(date)}</div>
                    </div>
                </div>
                <div className={styles.rightContainer}>
                    <div className={styles.controlButton}>
                        <div className={styles.delete} onClick={deleteReminder}></div>
                    </div>
                    <div
                        className={styles.amount}
                        style={{backgroundColor: 'rgba(235, 87, 87, 0.5)'}}>
                        {amount === 0.00 ? '₴' + 0 : '₴' + formatAmount(amount)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemReminder;
