import React, {useEffect, useState} from "react";
import axios from "axios";
import MainLayout from "@/layouts/MainLayout";
import TimeFilter from "@/components/TimeFilter/TimeFilter";
import Button from "@/components/Button/Button";
import ItemReport from "@/components/ItemReport/ItemReport";
import Link from "next/link";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import {Pie} from "react-chartjs-2";
import AddExpense from "@/components/AddExpense/AddExpense";
import AddCategory from "@/components/AddCategory/AddCategory";
import db from "@/db";

interface Transaction {
    id: number;
    amount: number;
    createdAt: string;
    description: string;
}

interface CategoryData {
    categoryId: number;
    categoryName: string;
    transactions: Transaction[];
    total?: number;
    color: string;
    percentage?: number;
}

interface ExpensesData {
    totalExpenses: number;
    categories: CategoryData[];
}

type ComponentName = "AddCategory" | "AddExpense";


const Expenses = () => {
    const [data, setData] = useState<ExpensesData | null>(null);
    const [timeFilter, setTimeFilter] = useState('all');
    const [activeComponent, setActiveComponent] = useState<ComponentName | null>(null);

    ChartJS.register(ArcElement, Tooltip, Legend);

    const calculateTotalExpenses = (categories: CategoryData[], filter: string) => {
        const filteredCategories = categories.map(category => ({
            ...category,
            transactions: filter === "all"
                ? category.transactions
                : filterTransactionsByDate(category.transactions, filter),
        }));

        const totalExpense = filteredCategories.reduce((totalSum, category) => (
            totalSum + category.transactions.reduce((sum, transaction) => sum + Number(transaction.amount), 0)
        ), 0);

        const categoriesWithPercentages = filteredCategories.map(category => {
            const categoryTotal = category.transactions.reduce((sum, transaction) => sum + Number(transaction.amount), 0);
            const percentage = totalExpense > 0 ? (categoryTotal / totalExpense) * 100 : 0;
            return {
                ...category,
                total: categoryTotal,
                percentage: percentage,
            };
        });

        return {
            totalExpenses: totalExpense,
            categories: categoriesWithPercentages,
        };
    };

    useEffect(() => {
        // const token = localStorage.getItem('token');

        const fetchData = async () => {
            const localData = await db.getExpenseData();
            const incomeDataWithPercentages = calculateTotalExpenses(localData.categories, timeFilter);
            setData(incomeDataWithPercentages);
        };
        // axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories/expenses`, { headers: { 'Authorization': `Bearer ${token}` } })
        //     .then(response => {
        //         if (response.data && response.data.categories) {
        //             const totalExpenses = calculateTotalExpenses(response.data.categories, timeFilter);
        //             setData({
        //                 totalExpenses: totalExpenses,
        //                 categories: response.data.categories
        //             });
        //         } else {
        //             setData({ totalExpenses: 0, categories: [] });
        //         }
        //     })
        //     .catch(error => console.error("Помилка отримання даних о витратах: ", error));
        fetchData()
    }, [timeFilter]);

    const updateCategory = async (categoryId: number, name: string) => {
        const token = localStorage.getItem('token');
        const updatedName = { name: name };

        try {
            // await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryId}`, { name }, {
            //     headers: { 'Authorization': `Bearer ${token}` }
            // });

            await db.updateCategory(categoryId, updatedName);

            setData((prevData) => {
                if (prevData === null) return null;
                const updatedCategories = prevData.categories.map((cat) =>
                    cat.categoryId === categoryId ? { ...cat, categoryName: name } : cat,
                );

                return {
                    totalExpenses: prevData.totalExpenses,
                    categories: updatedCategories,
                };
            });
        } catch (error) {
            console.error("Помилка при оновленні категорії: ", error);
        }
    };

    const deleteCategory = async (categoryId: number) => {
        const token = localStorage.getItem('token');
        try {
            // await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryId}`, {
            //     headers: { 'Authorization': `Bearer ${token}` }
            // });
            await db.deleteCategory(categoryId);

            setData(prevData => {
                if (prevData === null) return null;

                const newCategories = prevData.categories.filter(cat => cat.categoryId !== categoryId);
                const newTotalExpenses = newCategories.reduce((sum, cat) => sum + (cat.total || 0), 0);

                return {
                    ...prevData,
                    categories: newCategories,
                    totalExpenses: newTotalExpenses
                };
            });
        } catch (error) {
            console.error("Помилка при видаленні категорії: ", error);
        }
    };

    const updateTransaction = async (transactionId: number, updatedTransaction: Transaction) => {
        const token = localStorage.getItem('token');
        try {
            // await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/transactions/${transactionId}`, updatedTransaction, {
            //     headers: { 'Authorization': `Bearer ${token}` }
            // });
            await db.updateExpense(transactionId, updatedTransaction);

            setData(prevData => {
                if (prevData === null)
                    return null;

                const updatedCategories = prevData.categories.map(category => {
                    const updatedTransactions = category.transactions.map(transaction => {
                        if (transaction.id === transactionId) {
                            return { ...transaction, ...updatedTransaction };
                        }
                        return transaction;
                    });

                    return { ...category, transactions: updatedTransactions };
                });

                return { ...prevData, categories: updatedCategories };
            });
        } catch (error) {
            console.error("Помилка при оновленні транзакції: ", error);
        }
    };

    const deleteTransaction = async (transactionId: number) => {
        const token = localStorage.getItem('token');
        try {
            // await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/transactions/${transactionId}`, {
            //     headers: { 'Authorization': `Bearer ${token}` }
            // });
            await db.deleteExpense(transactionId);

            setData(prevData => {
                if (prevData === null)
                    return null;

                const updatedCategories = prevData.categories.map(category => {
                    const updatedTransactions = category.transactions.filter(transaction => transaction.id !== transactionId);
                    return { ...category, transactions: updatedTransactions };
                });

                return { ...prevData, categories: updatedCategories };
            });
        } catch (error) {
            console.error("Помилка при видаленні транзакції: ", error);
        }
    };


    const changeTimeFilter = (filter: string) => {
        setTimeFilter(filter);
    };

    const filterTransactionsByDate = (transactions: Transaction[], filter: string) => {
        const now = new Date();
        return transactions.filter(transaction => {
            const transactionDate = new Date(transaction.createdAt);
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

    const filteredCategories = data ? data.categories.map(category => {
        const filteredTransactions = timeFilter === 'all' ? category.transactions : filterTransactionsByDate(category.transactions, timeFilter);

        const total = filteredTransactions.reduce((sum, transaction) => sum + Number(transaction.amount), 0);

        const percentage = data.totalExpenses ? parseFloat(((total / data.totalExpenses) * 100).toFixed(2)) : 0;

        return {
            ...category,
            total: total,
            percentage: percentage,
            transactions: filteredTransactions
        };
    }) : [];

    filteredCategories.sort((a, b) => {
        if (a.total === 0 && b.total > 0) {
            return 1;
        } else if (a.total > 0 && b.total === 0) {
            return -1;
        }
        return 0;
    });

    const pieChartData = {
        datasets: [{
            data: filteredCategories.map(cat => cat.total),
            backgroundColor: filteredCategories.map(cat => cat.color),
            hoverBackgroundColor: filteredCategories.map(cat => cat.color),
        }]
    };

    const showComponent = (componentName: ComponentName) => {
        setActiveComponent(componentName);
    };

    const hideComponent = () => {
        setActiveComponent(null);
    };

    return (
        <MainLayout>
            {activeComponent === 'AddExpense' && <AddExpense onBack={hideComponent}/>}
            {activeComponent === 'AddCategory' && <AddCategory type={'expense'} onBack={hideComponent}/>}
            { !activeComponent && (<div className="container">
                <TimeFilter onFilterChange={changeTimeFilter}/>
                <div className="timeRanger">
                    <p className="linkRange linkGrey">
                        <Link href="/">
                            01.01 - 08.01
                        </Link>
                    </p>
                </div>
                <div className="blockFlex">
                    <div className="financialSummary">
                        <p className="subtitle">Витрати</p>
                        <p className="totalSum">{!data || data.totalExpenses === 0 ? '₴' + 0 : '-₴' + data.totalExpenses.toLocaleString()}</p>                    </div>
                    <div style={{maxWidth: '50%'}}>
                        {pieChartData && <Pie data={pieChartData}/>}
                    </div>
                </div>
                <div>Додати витрату - натисніть тут!</div>
                <div>
                    <Button onClick={() => showComponent('AddExpense')}>Додати</Button>
                </div>
                <div className="categoriesTitle">
                    <div>
                        <p className="titleBlock">Категорії</p>
                    </div>
                    <div>
                        <div>
                            <p onClick={() => showComponent('AddCategory')} className="linkGrey">Додати категорію</p>
                        </div>
                    </div>
                </div>
                <div className="categoriesList">
                    {!data || data.categories.length <= 0 ? <span>Немає категорій витрат</span>: filteredCategories.map(category => (
                        <ItemReport
                            key={category.categoryId}
                            title={category.categoryName}
                            isCategory={true}
                            type={"expense"}
                            categoryId={category.categoryId}
                            onDelete={deleteCategory}
                            onUpdate={updateCategory}
                            onDeleteTransaction={deleteTransaction}
                            color={category.color}
                            onUpdateTransaction={updateTransaction}
                            transactions={category.transactions}
                            subtitle={`${category.percentage ? category.percentage.toFixed(2) : '0.00'}%`}
                            amount={`${category.total === null || category.total === 0 ? '₴' + 0 : '−₴' + category.total}`}
                        />
                    ))}
                </div>
            </div>)}
        </MainLayout>
    );
}

export default Expenses;
