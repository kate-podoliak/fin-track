import React, { useState } from 'react';
import styles from '../ItemReport/itemReport.module.scss';
import {formatDateToTime} from "@/utils/formatDate";
import {formatAmount} from "@/utils/formatAmount";

interface Transaction {
    id: number;
    createdAt: string;
    amount: number;
    description: string;
    category: Category;
}

interface Category {
    name: string;
    color?: string;
}

interface MainItemReportProps {
    transaction: Transaction;
    onUpdateTransaction: (transactionId: number, newDescription: string, newAmount: number) => void;
    onDeleteTransaction: (transactionId: number) => void;
    type: string;
}

const MainItemReport: React.FC<MainItemReportProps> = ({ transaction, onUpdateTransaction, onDeleteTransaction, type }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newDescription, setNewDescription] = useState(transaction.description);
    const [newAmount, setNewAmount] = useState(transaction.amount.toString());

    const saveItem = () => {
        onUpdateTransaction(transaction.id, newDescription, parseFloat(newAmount));
        setIsEditing(false);
    };

    const editItem = () => {
        setIsEditing(true);
    };

    const deleteItem = () => {
        onDeleteTransaction(transaction.id);
    };

    return (
        <div className={styles.item}>
            <div className={styles.header}>
                <div className={styles.leftContainer}>
                    <div className={styles.icon} style={{backgroundColor: transaction.category.color}}></div>
                    <div className={styles.details}>
                        <div className={styles.title}>{transaction.category.name}</div>
                        <div className={styles.subtitleTransaction}>{transaction.description}</div>
                    </div>
                </div>
                <div className={styles.rightContainer}>
                    <div className={styles.date}>
                        {formatDateToTime(transaction.createdAt)}
                    </div>
                    <div className={styles.controlButton}>
                        <div className={styles.update} onClick={editItem}></div>
                        <div className={styles.delete} onClick={deleteItem}></div>
                    </div>
                    <div
                        className={styles.amount}
                        style={{backgroundColor: (type === "expense" ? 'rgba(235, 87, 87, 0.5)' : 'rgba(39, 174, 96, 0.5)')}}>
                        {transaction.amount === 0.00 ? '₴' + 0 : type === 'expense' && transaction.amount > 0.00 ? '-₴' + formatAmount(transaction.amount) : transaction.amount > 0.00 && type === 'income' ? '+₴' + formatAmount(transaction.amount) : '₴' + 0}
                    </div>
                </div>
            </div>
                {isEditing ? (
                    <div className={styles.containerUpdate} style={{ margin: '5px'}}>
                        <div className={styles.leftContainerEdit}>
                                <div className={styles.icon}
                                     style={{ backgroundColor: 'white' }}></div>
                            <input
                              type="text"
                              className={styles.inputDescription}
                              value={newDescription}
                              onChange={(e) => setNewDescription(e.target.value)}
                            />
                        </div>
                        <div className={styles.rightContainerEdit}>
                            <input
                              type="number"
                              className={styles.inputAmount}
                              value={newAmount}
                              onChange={(e) => setNewAmount(e.target.value)}
                            />
                            <div className={styles.buttonRight}>
                                <div className={styles.buttonSaveTransaction} onClick={saveItem}>ОК</div>
                            </div>
                        </div>


                    </div>
                ) : (
                  <></>
                )}
        </div>
    );
};

export default MainItemReport;
