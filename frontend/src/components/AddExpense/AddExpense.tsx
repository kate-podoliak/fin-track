import React, {useState, useEffect} from "react";
import axios from "axios";
import MainLayout from "@/layouts/MainLayout";
import NumberPad from "@/components/NumberPad/NumberPad";
import Button from "@/components/Button/Button";
import SelectBox from '@/components/SelectBox/SelectBox';
import TextInput from '@/components/Input/Input';
import Alert from "@/components/Alert/Alert";
import db from "@/db";

interface Category {
    id: number;
    name: string;
}

interface AddExpense {
    onBack: () => void;
}

const AddExpense = ({onBack}: AddExpense) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [descriptionText, setDescriptionText] = useState('');
    const [alert, setAlert] = useState<{ type: '' | 'error' | 'success'; message: string }>({ type: '', message: '' });


    const fetchCategories = async () => {
        const storedCategories = await db.categories
            .where({ type: 'expense' })
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
            await synchronizeExpenses();
        };

        window.addEventListener('online', handleOnline);
        // const token = localStorage.getItem('token');
        // if (token) {
        //     const categoryType = 'expense';
        //     axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories/my-categories/${categoryType}`, {
        //         headers: {'Authorization': `Bearer ${token}`}
        //     })
        //         .then(response => {
        //             setCategories(response.data);
        //         })
        //         .catch(error => console.error("Помилка завантаження категорії: ", error));
        // }
    }, []);

    const addTransaction = async () => {
        try {
            // const token = localStorage.getItem('token');
            // await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/transactions`, {
            //     categoryId: selectedCategory,
            //     amount: amount,
            //     description: descriptionText,
            //     type: 'expense'
            // }, {headers: {'Authorization': `Bearer ${token}`}});
            if(selectedCategory === '') {
                setAlert({ type: 'error', message: 'Оберіть категорію зі списку.' });
            } else if (parseFloat(amount) <= 0 ) {
                setAlert({ type: 'error', message: 'Введіть сумму більше 0' });
            } else {
                const now = new Date().toISOString();
                console.log(now)
                await db.expenses.add({
                    categoryId: parseInt(selectedCategory),
                    amount: parseFloat(amount),
                    description: descriptionText,
                    type: 'expense',
                    createdAt: '2024-01-12T19:42:48.880Z',
                    synced: false,
                });
                setAlert({ type: 'success', message: 'Транзакція успішно додана.' });
                setTimeout(() => {
                    onBack();
                    window.location.reload();
                }, 1000);
            }
            if (navigator.onLine) {
                await synchronizeExpenses();
            }
        } catch (error) {
            setAlert({ type: 'error', message: 'Оберіть категорію зі списку.' });
            console.error('Помилка: ' + error);
        }
    };

    const synchronizeExpenses = async () => {
        try {
            const unsyncedExpenses = await db.incomes
                .filter((income) => income.synced === false)
                .toArray();

            for (const income of unsyncedExpenses) {
                const token = localStorage.getItem("token");

                if (income.id !== undefined) {
                    const incomeData = {
                        categoryId: income.categoryId,
                        amount: income.amount,
                        type: 'expense',
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

                    await db.expenses.update(income.id, { synced: true });
                }
            }
        } catch (error) {
            console.error("Ошибка синхронизации доходов: ", error);
        }
    };

    const closeAlert = () => {
        setAlert({ type: '', message: '' });
    };

    return (
        <MainLayout>
            {alert.type && <Alert type={alert.type} message={alert.message} onClose={closeAlert} />}
            <div className="container">
                <div className="block">
                    <p onClick={onBack} className="subtitle linkGrey" style={{ border: 'none' }}>
                        Назад
                    </p>
                </div>
                <div className="title">
                    <h3 className="pageTitle">Витрата</h3>
                </div>
                <div className="inputContainer">
                    { !categories ? <div className="categoryDescription">Категорії відсутні.</div> :
                        <SelectBox
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            categories={categories}
                        />
                    }
                </div>
                <div className="inputContainer">
                    <TextInput
                        value={descriptionText}
                        onChange={(e) => setDescriptionText(e.target.value)}
                        padding="19px 25px"
                        placeholder="Опис транзакції (за бажанням)"
                    />
                </div>
                <NumberPad value={amount} onChange={setAmount}/>
                <Button wide onClick={addTransaction}>Додати</Button>
            </div>
        </MainLayout>
    );
}

export default AddExpense;