import React, { useEffect, useState } from "react";
import MainLayout from "@/layouts/MainLayout";
import NumberPad from "@/components/NumberPad/NumberPad";
import Button from "@/components/Button/Button";
import SelectBox from "@/components/SelectBox/SelectBox";
import TextInput from "@/components/Input/Input";
import axios from "axios";
import Alert from "@/components/Alert/Alert";
import db from "@/db";

interface Category {
  id: number;
  name: string;
}

interface AddIncome {
  onBack: () => void;
}

const AddIncome = ({ onBack }: AddIncome) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [alert, setAlert] = useState<{
    type: "" | "error" | "success";
    message: string;
  }>({ type: "", message: "" });

  const fetchCategories = async () => {
    const storedCategories = await db.categories
      .where({ type: 'income' })
      .toArray();

    setCategories(storedCategories.map(cat => ({
      id: cat.id ? cat.id : 0,
      name: cat.name
    })));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleOnline = async () => {
      await synchronizeIncomes();
    };

    window.addEventListener('online', handleOnline);
    // const fetchCategories = async () => {
    //   if (!navigator.onLine) {
    //     const storedCategories = await db.categories
    //       .filter((cat) => cat.type === "income")
    //       .toArray();
    //     setCategories(storedCategories.map(cat => ({
    //       id: cat.id ? cat.id : 0,
    //       name: cat.name
    //     })));
    //   } else {
    //     const token = localStorage.getItem("token");
    //     if (token) {
    //       const categoryType = "income";
    //       axios
    //         .get(
    //           `${process.env.NEXT_PUBLIC_API_URL}/categories/my-categories/${categoryType}`,
    //           {
    //             headers: { Authorization: `Bearer ${token}` },
    //           },
    //         )
    //         .then((response) => {
    //           setCategories(response.data);
    //         })
    //         .catch((error) =>
    //           console.error("Помилка завантаження категорій: ", error),
    //         );
    //     }
    //   }
    // };
    // fetchCategories();
  }, []);

  const addTransactionIncome = async () => {
    try {
      const now = new Date().toISOString();
      await db.incomes.add({
        categoryId: parseInt(selectedCategory),
        amount: parseFloat(amount),
        description: descriptionText,
        type: 'income',
        createdAt: '2024-01-03T19:42:48.880Z',
        synced: false,
      });

      if (navigator.onLine) {
        await synchronizeIncomes();
      }

      setAlert({ type: "success", message: "Доход успешно добавлен." });
      setTimeout(() => {
        onBack();
        window.location.reload();
      }, 1000);
    } catch (error) {
      setAlert({ type: "error", message: "Ошибка при добавлении дохода." });
      console.error("Ошибка: " + error);
    }
  };

  const synchronizeIncomes = async () => {
    try {
      const unsyncedIncomes = await db.incomes
        .filter((income) => income.synced === false)
        .toArray();

      for (const income of unsyncedIncomes) {
        const token = localStorage.getItem("token");

        if (income.id !== undefined) {
          const incomeData = {
            categoryId: income.categoryId,
            amount: income.amount,
            type: 'income',
            description: income.description,
            createdAt: income.createdAt,
          };

          await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/transactions`,
            incomeData,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          await db.incomes.update(income.id, { synced: true });
        }
      }
    } catch (error) {
      console.error("Ошибка синхронизации доходов: ", error);
    }
  };

  // const addTransaction = async () => {
  //     try {
  //         const token = localStorage.getItem('token');
  //         await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/transactions`, {
  //             categoryId: selectedCategory,
  //             amount: amount,
  //             type: 'income'
  //         }, { headers: { 'Authorization': `Bearer ${token}` } });
  //         setAlert({ type: 'success', message: 'Транзакція успішно додана.' });
  //     } catch (error) {
  //         setAlert({ type: 'error', message: 'Оберіть категорію зі списку.' });
  //         console.error('Помилка: ' + error);
  //     }
  // };

  const closeAlert = () => {
    setAlert({ type: "", message: "" });
  };

  return (
    <MainLayout>
      {alert.type && (
        <Alert type={alert.type} message={alert.message} onClose={closeAlert} />
      )}
      <div className="container">
        <div className="block">
          <div className="subtitle linkGrey" style={{border: 'none !important'}}>
            <p onClick={onBack}>Назад</p>
          </div>
        </div>
        <div className="title">
          <h3 className="pageTitle">Дохід</h3>
        </div>
        <div className="blockDescription">
          <p className="categoryDescription">Оберіть категорію</p>
        </div>
        <div className="inputContainer">
          {!categories ? (
            <div className="categoryDescription">Категорії відсутні.</div>
          ) : (
            <SelectBox
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
            />
          )}
        </div>
        <div className="inputContainer">
          <TextInput
            value={descriptionText}
            onChange={(e) => setDescriptionText(e.target.value)}
            padding="19px 25px"
            placeholder="Опис транзакції (за бажанням)"
          />
        </div>
        <NumberPad value={amount} onChange={setAmount} />
        <Button wide onClick={addTransactionIncome}>
          Додати
        </Button>
      </div>
    </MainLayout>
  );
};

export default AddIncome;
