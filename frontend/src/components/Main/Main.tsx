import React, {useEffect, useState} from 'react';
import icon_down from "../../assets/img/icon_down.svg"
import icon_up from "../../assets/img/icon_up.svg"
import TimeFilter from "@/components/TimeFilter/TimeFilter";
import Link from "next/link";
import MainItemReport from "@/components/MainItemReport/MainItemReport";
import axios from "axios";
import {formatDateHeader, groupTransactionsByDate} from "@/utils/formatDate";
import EventCount from "@/components/EventCount/EventCount";

export interface Transaction {
    id: number;
    createdAt: string;
    amount: number;
    description: string;
    category: Category;
    type: 'income' | 'expense';
}

interface Category {
    name: string;
}

const Main = () => {
    const [activeTab, setActiveTab] = useState('income');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [totalIncome, setTotalIncome] = useState<number>(0);
    const [totalExpense, setTotalExpense] = useState<number>(0);
    const [timeFilter, setTimeFilter] = useState('day');

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const incomesResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/transactions/transactions-incomes`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const totalIncome = incomesResponse.data.reduce((acc: any, transaction: any) => acc + Number(transaction.amount), 0);

                const expensesResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/transactions/transactions-expenses`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const totalExpense = expensesResponse.data.reduce((acc: any, transaction: any) => acc + Number(transaction.amount), 0);

                setTotalIncome(totalIncome);
                setTotalExpense(totalExpense);
                setTransactions([...incomesResponse.data, ...expensesResponse.data]);
            } catch (error) {
                console.error("Помилка отримання даних:", error);
            }
        };

        fetchData();
    }, []);

    const handleDeleteTransaction = async (transactionId: number) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/transactions/${transactionId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setTransactions(prevTransactions => prevTransactions.filter(t => t.id !== transactionId));
        } catch (error) {
            console.error("Помилка при видаленні транзакції:", error);
        }
    };

    const handleUpdateTransaction = async (transactionId: number, updatedTransaction: Transaction) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/transactions/${transactionId}`, updatedTransaction, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setTransactions(prevTransactions => prevTransactions.map(t => t.id === transactionId ? updatedTransaction : t));
        } catch (error) {
            console.error("Помилка при оновленні транзакції:", error);
        }
    };

    const handleItemReportUpdate = (transactionId: number, newDescription: string, newAmount: number) => {
        const transactionToUpdate = transactions.find(t => t.id === transactionId);
        if (transactionToUpdate) {
            const updatedTransaction = {
                ...transactionToUpdate,
                description: newDescription,
                amount: newAmount
            };
            handleUpdateTransaction(transactionId, updatedTransaction);
        }
    };

    const handleTimeFilterChange = (filter: string) => {
        setTimeFilter(filter);
    };

    const filterTransactions = (transactions: Transaction[], filter: string, type: string) => {
        const now = new Date();
        return transactions.filter(transaction => {
            const transactionDate = new Date(transaction.createdAt);

            if (transaction.type !== type) {
                return false;
            }

            switch (filter) {
                case 'День':
                    return transactionDate.toDateString() === now.toDateString();
                case 'Тиждень':
                    const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
                    return transactionDate > oneWeekAgo;
                case 'Місяць':
                    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                    return transactionDate > oneMonthAgo;
                case 'Всі':
                default:
                    return true;
            }
        });
    };

    const filteredTransactions = filterTransactions(transactions, timeFilter, activeTab);
    const groupedTransactions = groupTransactionsByDate(transactions);

    return (
        <div className="container">
            <div className="block">
                <p className="subtitle">Ваш баланс</p>
            </div>
            <div className="block">
                <h2 className="totalBalance">
                {totalIncome - totalExpense > 0 ? `+₴${(totalIncome - totalExpense).toLocaleString()}` : `₴${(totalIncome - totalExpense).toLocaleString()}`}
                </h2>
            </div>
            <TimeFilter onFilterChange={handleTimeFilterChange} />
            <div className="timeRanger">
                <p className="linkRange linkGrey">
                    <Link href="/">
                        13.04 - 20.04
                    </Link>
                </p>
            </div>

            <div className="financeOverview">
                <div
                    className={`financeBlock ${activeTab === 'income' ? 'active' : ''}`}
                    onClick={() => setActiveTab('income')}
                >
                    <div className="iconContainer incomeIcon">
                        <img src={icon_up.src} alt="Дохід" className="icon"/>
                    </div>
                    <div className="financeInfo">
                        <span className="financeTitle">Дохід</span>
                        <span className="financialAmount">{totalIncome ? '+₴' + totalIncome.toLocaleString() : 0}</span>
                    </div>
                </div>
                <div
                    className={`financeBlock ${activeTab === 'expense' ? 'active' : ''}`}
                    onClick={() => setActiveTab('expense')}
                >
                    <div className="iconContainer expensesIcon">
                        <img src={icon_down.src} alt="Витрати" className="icon"/>
                    </div>
                    <div className="financeInfo">
                        <span className="financeTitle">Витрати</span>
                        <span className="financialAmount">{ totalExpense ? '-₴' + totalExpense.toLocaleString() : 0}</span>
                    </div>
                </div>
            </div>

            {activeTab === 'income' && (
                <>
                    <div className="categoriesList">
                        {Object.entries(groupTransactionsByDate(filterTransactions(transactions, timeFilter, 'income'))).map(([dateString, transactions]) => (
                            <React.Fragment key={dateString}>
                                <div className="transactionDate">
                                    {formatDateHeader(new Date(dateString))}
                                </div>
                                {transactions.map(transaction => (
                                    <MainItemReport
                                        key={transaction.id}
                                        transaction={transaction}
                                        onUpdateTransaction={handleItemReportUpdate}
                                        onDeleteTransaction={handleDeleteTransaction}
                                        type="income"
                                    />
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                </>
            )}

            {activeTab === 'expense' && (
                <>
                    <div className="categoriesList">
                        {Object.entries(groupTransactionsByDate(filterTransactions(transactions, timeFilter, 'expense'))).map(([dateString, transactions]) => (
                            <React.Fragment key={dateString}>
                                <div className="transactionDate">
                                    {formatDateHeader(new Date(dateString))}
                                </div>
                                {transactions.map(transaction => (
                                    <MainItemReport
                                        key={transaction.id}
                                        transaction={transaction}
                                        onUpdateTransaction={handleItemReportUpdate}
                                        onDeleteTransaction={handleDeleteTransaction}
                                        type="expense"
                                    />
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Main;