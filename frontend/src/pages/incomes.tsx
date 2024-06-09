import React, { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "@/layouts/MainLayout";
import TimeFilter from "@/components/TimeFilter/TimeFilter";
import Button from "@/components/Button/Button";
import ItemReport from "@/components/ItemReport/ItemReport";
import Link from "next/link";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";
import AddIncome from "@/components/AddIncome/AddIncome";
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

interface IncomesData {
  totalIncomes: number;
  categories: CategoryData[];
}

type ComponentName = "AddCategory" | "AddIncome";

const Incomes = () => {
  const [data, setData] = useState<IncomesData | null>(null);
  const [timeFilter, setTimeFilter] = useState("all");
  const [activeComponent, setActiveComponent] = useState<ComponentName | null>(
    null,
  );

  ChartJS.register(ArcElement, Tooltip, Legend);

  const calculateTotalIncomes = (categories: CategoryData[], filter: string) => {
    const filteredCategories = categories.map(category => ({
      ...category,
      transactions: filter === "all"
        ? category.transactions
        : filterTransactionsByDate(category.transactions, filter),
    }));

    const totalIncome = filteredCategories.reduce((totalSum, category) => (
      totalSum + category.transactions.reduce((sum, transaction) => sum + Number(transaction.amount), 0)
    ), 0);

    const categoriesWithPercentages = filteredCategories.map(category => {
      const categoryTotal = category.transactions.reduce((sum, transaction) => sum + Number(transaction.amount), 0);
      const percentage = totalIncome > 0 ? (categoryTotal / totalIncome) * 100 : 0;
      return {
        ...category,
        total: categoryTotal,
        percentage: percentage,
      };
    });

    return {
      totalIncomes: totalIncome,
      categories: categoriesWithPercentages,
    };
  };

  const synchronizeIncomes = async () => {
    const unsyncedIncomes = await db.incomes.filter(income => !income.synced).toArray();
    const token = localStorage.getItem("token");

    for (const income of unsyncedIncomes) {
      if (income.id !== undefined) {
        const incomeData = {
          categoryId: income.categoryId,
          amount: income.amount,
          description: income.description,
          createdAt: income.createdAt
        };

        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/incomes`, incomeData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        await db.incomes.update(income.id, { synced: true });
      }
    }
  };


  useEffect(() => {
    const handleOnline = async () => {
      await synchronizeIncomes();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      const localData = await db.getIncomeData();
      const incomeDataWithPercentages = calculateTotalIncomes(localData.categories, timeFilter);
      setData(incomeDataWithPercentages);
    };
    // const fetchData = async () => {
    //   const localData = await db.getIncomeData();
    //   setData(localData)
    //   // if (!navigator.onLine) {
    //   //   const localData = await db.getIncomeData();
    //   //   setData(localData);
    //   // } else {
    //   //   const token = localStorage.getItem("token");
    //   //   axios
    //   //     .get(`${process.env.NEXT_PUBLIC_API_URL}/categories/incomes`, {
    //   //       headers: { Authorization: `Bearer ${token}` },
    //   //     })
    //   //     .then((response) => {
    //   //       if (response.data && response.data.categories) {
    //   //         const totalIncomes = calculateTotalIncomes(
    //   //           response.data.categories,
    //   //           timeFilter,
    //   //         );
    //   //         setData({
    //   //           totalIncomes: totalIncomes,
    //   //           categories: response.data.categories,
    //   //         });
    //   //       } else {
    //   //         setData({ totalIncomes: 0, categories: [] });
    //   //       }
    //   //     })
    //   //     .catch((error) => {
    //   //       console.error("Помилка отримання даних о доходах: ", error);
    //   //       setData({ totalIncomes: 0, categories: [] });
    //   //     });
    //   // }
    // }
    fetchData();
  }, [timeFilter]);


  const deleteCategory = async (categoryId: number) => {
    const token = localStorage.getItem("token");
    try {
      // if (navigator.onLine) {
      //   await axios.delete(
      //     `${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryId}`,
      //     {
      //       headers: { Authorization: `Bearer ${token}` },
      //     },
      //   );
      // }
      await db.deleteCategory(categoryId);

      setData((prevData) => {
        if (prevData === null) return null;

        const newCategories = prevData.categories.filter(
          (cat) => cat.categoryId !== categoryId,
        );
        const newTotalIncomes = newCategories.reduce(
          (sum, cat) => sum + (cat.total || 0),
          0,
        );

        return {
          ...prevData,
          categories: newCategories,
          totalIncomes: newTotalIncomes,
        };
      });
    } catch (error) {
      console.error("Помилка при видаленні категорії: ", error);
    }
  };

  const updateCategory = async (categoryId: number, name: string) => {
    const token = localStorage.getItem("token");
    const updatedName = { name: name };
    try {
      // if (navigator.onLine) {
      //   await axios.put(
      //     `${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryId}`,
      //     { name },
      //     {
      //       headers: { Authorization: `Bearer ${token}` },
      //     },
      //   );
      // }
      await db.updateCategory(categoryId, updatedName);

      setData((prevData) => {
        if (prevData === null) return null;
        const updatedCategories = prevData.categories.map((cat) =>
          cat.categoryId === categoryId ? { ...cat, categoryName: name } : cat,
        );

        return {
          totalIncomes: prevData.totalIncomes,
          categories: updatedCategories,
        };
      });
    } catch (error) {
      console.error("Помилка при оновленні категорії: ", error);
    }
  };

  const deleteTransaction = async (transactionId: number) => {
    const token = localStorage.getItem("token");
    try {
      // if (navigator.onLine) {
      //   await axios.delete(
      //     `${process.env.NEXT_PUBLIC_API_URL}/transactions/${transactionId}`,
      //     {
      //       headers: { Authorization: `Bearer ${token}` },
      //     },
      //   );
      // }
      await db.deleteIncome(transactionId);
      setData((prevData) => {
        if (prevData === null) return null;

        const updatedCategories = prevData.categories.map((category) => {
          const updatedTransactions = category.transactions.filter(
            (transaction) => transaction.id !== transactionId,
          );
          return { ...category, transactions: updatedTransactions };
        });

        return { ...prevData, categories: updatedCategories };
      });
    } catch (error) {
      console.error("Помилка при видаленні категорії: ", error);
    }
  };

  const updateTransaction = async (
    transactionId: number,
    updatedTransaction: Transaction,
  ) => {
    const token = localStorage.getItem("token");
    try {
      // if (navigator.onLine) {
      //   await axios.put(
      //     `${process.env.NEXT_PUBLIC_API_URL}/transactions/${transactionId}`,
      //     updatedTransaction,
      //     {
      //       headers: { Authorization: `Bearer ${token}` },
      //     },
      //   );
      // }

      await db.updateIncome(transactionId, updatedTransaction);
      setData((prevData) => {
        if (prevData === null) return null;

        const updatedCategories = prevData.categories.map((category) => {
          const updatedTransactions = category.transactions.map(
            (transaction) => {
              if (transaction.id === transactionId) {
                return { ...transaction, ...updatedTransaction };
              }
              return transaction;
            },
          );

          return { ...category, transactions: updatedTransactions };
        });

        return { ...prevData, categories: updatedCategories };
      });
    } catch (error) {
      console.error("Помилка при оновленні категорії: ", error);
    }
  };

  const changeTimeFilter = (filter: string) => {
    setTimeFilter(filter);
  };

  const filterTransactionsByDate = (
    transactions: Transaction[],
    filter: string,
  ) => {
    const now = new Date();
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      switch (filter) {
        case "День":
          return transactionDate.toDateString() === now.toDateString();
        case "Тиждень":
          const oneWeekAgo = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - 7,
          );
          return transactionDate > oneWeekAgo;
        case "Місяць":
          const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate(),
          );
          return transactionDate > oneMonthAgo;
        case "Всі":
        default:
          return true;
      }
    });
  };
  const filteredCategories = data
    ? data.categories.map((category) => {
        const filteredTransactions =
          timeFilter === "all"
            ? category.transactions
            : filterTransactionsByDate(category.transactions, timeFilter);

        const total = filteredTransactions.reduce(
          (sum, transaction) => sum + Number(transaction.amount),
          0,
        );

        const percentage = data.totalIncomes
          ? parseFloat(((total / data.totalIncomes) * 100).toFixed(2))
          : 0;

        return {
          ...category,
          total: total,
          percentage: percentage,
          transactions: filteredTransactions,
        };
      })
    : [];

  filteredCategories.sort((a, b) => {
    if (a.total === 0 && b.total > 0) {
      return 1;
    } else if (a.total > 0 && b.total === 0) {
      return -1;
    }
    return 0;
  });
  const pieChartData = {
    datasets: [
      {
        data: filteredCategories.map((cat) => cat.total),
        backgroundColor: filteredCategories.map((cat) => cat.color),
        hoverBackgroundColor: filteredCategories.map((cat) => cat.color),
      },
    ],
  };

  const handleShowComponent = (componentName: ComponentName) => {
    setActiveComponent(componentName);
  };

  const handleHideComponent = () => {
    setActiveComponent(null);
  };

  return (
    <MainLayout>
      {activeComponent === "AddIncome" && (
        <AddIncome onBack={handleHideComponent} />
      )}
      {activeComponent === "AddCategory" && (
        <AddCategory type={"income"} onBack={handleHideComponent} />
      )}

      { !activeComponent && (<div className="container">
        <TimeFilter onFilterChange={changeTimeFilter} />
        <div className="timeRanger">
          <p className="linkRange linkGrey">
            <Link href="/">01.01 - 08.01</Link>
          </p>
        </div>
        <div className="blockFlex">
          <div className="financialSummary">
            <p className="subtitle">Дохід</p>
            <p className="totalSum">
              {!data || data.totalIncomes === 0
                ? "₴" + 0
                : "+₴" + data.totalIncomes.toLocaleString()}
            </p>
          </div>
          <div style={{ maxWidth: "50%" }}>
            {pieChartData && <Pie updateMode={"show"} data={pieChartData} />}
          </div>
        </div>
        <div>Додати дохід - натисніть тут!</div>
        <div>
          <Button onClick={() => handleShowComponent("AddIncome")}>
            Додати
          </Button>
        </div>
        <div className="categoriesTitle">
          <div>
            <p className="titleBlock">Категорії</p>
          </div>
          <div>
            <div>
              <p
                onClick={() => handleShowComponent("AddCategory")}
                className="linkGrey"
              >
                Додати категорію
              </p>
            </div>
          </div>
        </div>
        <div className="categoriesList">
          {!data || data.categories.length <= 0 ? (
            <span>Немає категорій доходів</span>
          ) : (
            filteredCategories.map((category) => (
              <ItemReport
                key={category.categoryId}
                categoryId={category.categoryId}
                title={category.categoryName}
                isCategory={true}
                color={category.color}
                type={"income"}
                transactions={category.transactions}
                onUpdate={updateCategory}
                onDelete={deleteCategory}
                onDeleteTransaction={deleteTransaction}
                onUpdateTransaction={updateTransaction}
                subtitle={`${
                  category.percentage ? category.percentage : "0.00"
                }%`}
                amount={`${
                  category.total === null || category.total === 0
                    ? "₴" + 0
                    : "+₴" + category.total
                }`}
              />
            ))
          )}
        </div>
      </div> )}
    </MainLayout>
  );
};

export default Incomes;
