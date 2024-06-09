import React, {useEffect, useState} from "react";
import icon_down from "../../assets/img/icon_down.svg";
import icon_up from "../../assets/img/icon_up.svg";
import TimeFilter from "@/components/TimeFilter/TimeFilter";
import MainItemReport from "@/components/MainItemReport/MainItemReport";
import {formatDateHeader, groupTransactionsByDate} from "@/utils/formatDate";
import db from '@/db';
import {TuiDateRangePicker} from 'nextjs-tui-date-range-picker';

export interface Transaction {
    id: number;
    createdAt: string;
    amount: number;
    description: string;
    category: Category;
    type: "income" | "expense";
}

// interface Category {
//     name: string;
// }

interface Category {
    id?: number;
    color?: string;
    name: string;
}

// Дополнительные интерфейсы для Income и Expense, если они отличаются от Transaction
interface Income {
    id?: number;
    categoryId: number;
    amount: number;
    description: string;
    createdAt: string;
    synced?: boolean;
    category?: Category[];

}

interface Expense {
    id?: number;
    categoryId: number;
    amount: number;
    description: string;
    createdAt: string;
    synced?: boolean;
    category?: Category[];


}

const MainMobile = () => {
    const [activeTab, setActiveTab] = useState('income');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [totalIncome, setTotalIncome] = useState<number>(0);
    const [totalExpense, setTotalExpense] = useState<number>(0);
    const [timeFilter, setTimeFilter] = useState('day');
    const [useCustomDateRange, setUseCustomDateRange] = useState(false);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [startDate, setStartDate] = useState(() => {
        const today = new Date();
        const yesterday = new Date(today);

        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday;
    });

    const [endDate, setEndDate] = useState(new Date());
    const transformToTransaction = (item: Income | Expense, type: 'income' | 'expense', categories: Category[]): Transaction => {
        const category = categories.find(c => c.id === item.categoryId);

        return {
            id: item.id || 0,
            amount: item.amount,
            description: item.description,
            createdAt: item.createdAt,
            category: {
                name: category ? category.name : "Неизвестная категория",
                color: category ? category.color : '#000'
            },
            type: type
        };
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            try {
                const categories = await db.categories.toArray();
                const incomes = await db.getAllIncomes();
                const expenses = await db.getAllExpenses();

                const transformedIncomes = incomes.map(income =>
                    transformToTransaction(income, 'income', categories)
                );
                const transformedExpenses = expenses.map(expense =>
                    transformToTransaction(expense, 'expense', categories)
                );

                setTransactions([...transformedIncomes, ...transformedExpenses]);

                // Обновление общих доходов и расходов
                const totalIncome = transformedIncomes.reduce((acc, t) => acc + t.amount, 0);
                const totalExpense = transformedExpenses.reduce((acc, t) => acc + t.amount, 0);
                setTotalIncome(totalIncome);
                setTotalExpense(totalExpense);
                // const incomesResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/transactions/transactions-incomes`, {
                //     headers: {'Authorization': `Bearer ${token}`}
                // });
                // const totalIncome = incomesResponse.data.reduce((acc: any, transaction: any) => acc + Number(transaction.amount), 0);
                //
                // const expensesResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/transactions/transactions-expenses`, {
                //     headers: {'Authorization': `Bearer ${token}`}
                // });
                // const totalExpense = expensesResponse.data.reduce((acc: any, transaction: any) => acc + Number(transaction.amount), 0);
                //
                // setTotalIncome(totalIncome);
                // setTotalExpense(totalExpense);
                // setTransactions([...incomesResponse.data, ...expensesResponse.data]);
            } catch (error) {
                console.error("Помилка отримання даних: ", error);
            }
        };
        fetchData();
    }, []);

    // const handleChange = (start: Date, end: Date) => {
    //     setStartDate(start);
    //     setEndDate(end);
    // };

    useEffect(() => {
        let filteredIncomeTransactions, filteredExpenseTransactions;

        if (useCustomDateRange) {
            filteredIncomeTransactions = filterTransactionsByCustomDateRange(transactions, 'income');
            filteredExpenseTransactions = filterTransactionsByCustomDateRange(transactions, 'expense');
        } else {
            filteredIncomeTransactions = filterTransactions(transactions, timeFilter, 'income');
            filteredExpenseTransactions = filterTransactions(transactions, timeFilter, 'expense');
        }

        const totalIncome = filteredIncomeTransactions.reduce((acc, t) => acc + Number(t.amount), 0);
        const totalExpense = filteredExpenseTransactions.reduce((acc, t) => acc + Number(t.amount), 0);

        setTotalIncome(totalIncome);
        setTotalExpense(totalExpense);
        setFilteredTransactions([...filteredIncomeTransactions, ...filteredExpenseTransactions]);
    }, [transactions, timeFilter, useCustomDateRange, startDate, endDate]);

    // const deleteTransaction = async (transactionId: number) => {
    //     const token = localStorage.getItem('token');
    //     try {
    //         // await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/transactions/${transactionId}`, {
    //         //     headers: {'Authorization': `Bearer ${token}`}
    //         // });
    //         await db.deleteIncome(transactionId);
    //         setTransactions(prevTransactions => prevTransactions.filter(t => t.id !== transactionId));
    //     } catch (error) {
    //         console.error("Помилка при видаленні транзакції: ", error);
    //     }
    // };

    const deleteIncome = async (incomeId: number) => {
        try {
            await db.deleteIncome(incomeId);
            setTransactions(prevTransactions => prevTransactions.filter(t => t.id !== incomeId && t.type === 'income'));
        } catch (error) {
            console.error("Ошибка при удалении дохода: ", error);
        }
    };

    const deleteExpense = async (expenseId: number) => {
        try {
            await db.deleteExpense(expenseId);
            setTransactions(prevTransactions => prevTransactions.filter(t => t.id !== expenseId && t.type === 'expense'));
        } catch (error) {
            console.error("Ошибка при удалении расхода: ", error);
        }
    };

    const updateTransaction = async (transactionId: number, updatedTransaction: Transaction) => {
        const token = localStorage.getItem('token');
        try {
            // await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/transactions/${transactionId}`, updatedTransaction, {
            //     headers: {'Authorization': `Bearer ${token}`}
            // });
            const updatedData = {
                amount: updatedTransaction.amount,
                description: updatedTransaction.description,
                createdAt: updatedTransaction.createdAt,
            };

            if (updatedTransaction.type === 'income') {
                await db.updateIncome(transactionId, updatedData);
            } else if (updatedTransaction.type === 'expense') {
                await db.updateExpense(transactionId, updatedData);
            }

            setTransactions(prevTransactions => prevTransactions.map(t => t.id === transactionId ? updatedTransaction : t));
        } catch (error) {
            console.error("Помилка при оновленні транзакції: ", error);
        }
    };

    const updateItemReport = (transactionId: number, newDescription: string, newAmount: number) => {
        const transactionToUpdate = transactions.find(t => t.id === transactionId);
        if (transactionToUpdate) {
            const updatedTransaction = {
                ...transactionToUpdate,
                description: newDescription,
                amount: newAmount
            };
            updateTransaction(transactionId, updatedTransaction);
        }
    };


    const handleChange = (dates: Date[]) => {
        const [start, end] = dates;
        console.log("Start Date: ", start);
        console.log("End Date: ", end);

        setStartDate(start);
        setEndDate(end);
        setUseCustomDateRange(true);
    };

    const changeTimeFilter = (filter: string) => {
        setTimeFilter(filter);
        setUseCustomDateRange(false);
    };

    const filterTransactions = (transactions: Transaction[], filter: string, type: string) => {
        return transactions.filter(transaction => {
            const transactionDate = new Date(transaction.createdAt);

            if (transaction.type !== type) {
                return false;
            }
            switch (filter) {
                case 'День':
                    return transactionDate.toDateString() === new Date().toDateString();
                case 'Тиждень':
                    const oneWeekAgo = new Date(new Date().setDate(new Date().getDate() - 7));
                    return transactionDate > oneWeekAgo;
                case 'Місяць':
                    const oneMonthAgo = new Date(new Date().setMonth(new Date().getMonth() - 1));
                    return transactionDate > oneMonthAgo;
                case 'Всі':
                default:
                    return true;
            }
        });
    };

    const filterTransactionsByCustomDateRange = (transactions: Transaction[], type: string) => {
        return transactions.filter(transaction => {
            const transactionDate = new Date(transaction.createdAt);
            return transaction.type === type &&
                transactionDate >= startDate &&
                transactionDate <= endDate;
        });
    };

    console.log(startDate)
    console.log(endDate)
    return (
        <div className="container">
            <div className="block">
                <p className="subtitle">Ваш баланс</p>
            </div>
            <div className="block">
                <h2 className="totalBalance">
                    {
                        totalIncome - totalExpense > 0 ? `+₴${(totalIncome - totalExpense).toLocaleString()}` :
                            totalIncome - totalExpense < 0 ? `-₴${Math.abs(totalIncome - totalExpense).toLocaleString()}` :
                                `₴${(totalIncome - totalExpense).toLocaleString()}`
                    }
                </h2>
            </div>
            <TimeFilter onFilterChange={changeTimeFilter}/>
            <div className="timeRanger">
                <p className="linkRange linkGrey">
                    <TuiDateRangePicker
                        handleChange={handleChange}
                        inputWidth={50}
                        containerWidth={110}
                        format={'dd.MM'}
                        startpickerDate={startDate}
                        endpickerDate={endDate}
                    />
                    {/*<Link href="/">*/}
                    {/*    01.01 - 08.01*/}
                    {/*</Link>*/}
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
                        <span
                            className="financialAmount">{totalIncome > 0 ? '+₴' + totalIncome.toLocaleString() : '₴' + 0}</span>
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
                        <span
                            className="financialAmount">{totalExpense > 0 ? '-₴' + totalExpense.toLocaleString() : '₴' + 0}</span>
                    </div>
                </div>
            </div>

            {activeTab === 'income' && (
                <>
                    <div className="categoriesList">
                        {totalIncome === 0 && <div>Немає транзакцій</div>}
                        {Object.entries(groupTransactionsByDate(filteredTransactions.filter(t => t.type === 'income'))).map(([dateString, transactions]) => (
                            <React.Fragment key={dateString}>
                                <div className="transactionDate">
                                    {formatDateHeader(new Date(dateString))}
                                </div>
                                {transactions.map(transaction => (
                                    <MainItemReport
                                        key={transaction.id}
                                        transaction={transaction}
                                        onUpdateTransaction={updateItemReport}
                                        onDeleteTransaction={deleteIncome}
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
                        {totalExpense === 0 && <div>Немає транзакцій</div>}
                        {Object.entries(groupTransactionsByDate(filterTransactions(transactions, timeFilter, 'expense'))).map(([dateString, transactions]) => (
                            <React.Fragment key={dateString}>
                                <div className="transactionDate">
                                    {formatDateHeader(new Date(dateString))}
                                </div>
                                {transactions.map(transaction => (
                                    <MainItemReport
                                        key={transaction.id}
                                        transaction={transaction}
                                        onUpdateTransaction={updateItemReport}
                                        onDeleteTransaction={deleteExpense}
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

export default MainMobile;
