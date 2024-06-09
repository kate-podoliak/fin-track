import React, {useEffect, useRef, useState} from "react";
import MainLayout from "@/layouts/MainLayout";
import Button from "@/components/Button/Button";
import Alert from "@/components/Alert/Alert";
import axios from "axios";
import db from "../../db"
import { SwatchesPicker } from 'react-color';
import Input from "@/components/Input/Input";

interface AddCategory {
    type: string;
    onBack: () => void;
}
const AddCategory = ({type, onBack}: AddCategory) => {
    const [categoryName, setCategoryName] = useState('');
    const [color, setColor] = useState('#4f4f4f');
    const [showColorPicker, setShowColorPicker] = useState(false);
    const colorPickerRef = useRef<HTMLDivElement>(null);
    const [alert, setAlert] = useState<{ type: '' | 'error' | 'success'; message: string }>({ type: '', message: '' });


    useEffect(() => {
        synchronizeCategories();
    }, []);


    useEffect(() => {
        function clickOutside(event: any) {
            if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
                setShowColorPicker(false);
            }
        }

        if (showColorPicker) {
            document.addEventListener("click", clickOutside);
        }

        return () => document.removeEventListener("click", clickOutside);
    }, [showColorPicker]);


    async function addCategory(name: string, type: string, color: string) {
        try {
            await db.categories.add({ name, type, color, synced: false });
            setAlert({ type: 'success', message: 'Категорія успішно додана.' });
        } catch (error) {
            setAlert({ type: 'error', message: 'Введіть назву категорії.' });
            console.error("Помилка при додаванні категорії: ", error);
        }
    }

    async function synchronizeCategories() {
        try {
            const unsyncedCategories = await db.categories.filter(category => category.synced === false).toArray();
            for (const category of unsyncedCategories) {
                const token = localStorage.getItem('token');
                if (category.id !== undefined) {
                    const categoryData = {
                        name: category.name,
                        type: category.type,
                        color: color
                    };
                    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/categories/create-category`, categoryData, { headers: { 'Authorization': `Bearer ${token}` } });
                    await db.categories.update(category.id, {synced: true});
                }
            }
        } catch (error) {
            console.error("Помилка синхронізації категорій: ", error);
        }
    }

    const handleAddCategory = async () => {
        if (!categoryName) {
            setAlert({ type: 'error', message: 'Введіть назву категорії.' });
            return;
        }

        try {
            await addCategory(categoryName, type, color);
            setTimeout(() => {
                onBack();
                window.location.reload();
            }, 1000);

            if (navigator.onLine) {
                await synchronizeCategories();
            }
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                setAlert({ type: 'error', message: 'Помилка' });
            } else {
                setAlert({ type: 'error', message: 'Помилка' });
            }
        }
    };

    const closeAlert = () => {
        setAlert({ type: '', message: '' });
    };

    const changeColor = (color: any) => {
        setColor(color.hex);
        setShowColorPicker(false);
    };

    return (
        <MainLayout>
            {alert.type && <Alert type={alert.type} message={alert.message} onClose={closeAlert} />}
            <div className="container">
                <div className="block">
                    <p className="subtitle linkGrey">
                        <p onClick={onBack}>
                            Назад
                        </p>
                    </p>
                </div>
                <div className="title">
                    <h3 className="pageTitle">
                        {type === 'expense' ? 'Нова категорія витрат' : 'Нова категорія доходів'}
                    </h3>
                </div>
                <div className="blockDescription">
                    <p className="categoryDescription">Введіть категорію</p>
                </div>
                <div className="inputContainer">
                    <Input
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        padding="19px 25px"
                        fontSize="16px"
                    />
                </div>
                <div className='colorPickerContainer' ref={colorPickerRef}>
                    <div className="blockDescription">
                        <p className="categoryDescription">Оберіть колір категорії</p>
                    </div>
                    <button
                        className='colorPickerButton'
                        style={{backgroundColor: color}}
                        onClick={() => setShowColorPicker(true)}
                    />
                </div>
                {showColorPicker && (
                    <SwatchesPicker color={color} onChangeComplete={changeColor}/>
                )}
                <Button wide onClick={handleAddCategory}>Додати</Button>
            </div>
        </MainLayout>
    );
}

export default AddCategory;
