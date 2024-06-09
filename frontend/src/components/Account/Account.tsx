import MainLayout from "@/layouts/MainLayout";
import axios from "axios";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import Input from "@/components/Input/Input";
import Button from "@/components/Button/Button";

interface AccountInterface {
    onBack: () => void;
}

const Account = ({onBack}: AccountInterface) => {
    const [username, setUsername] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [currentUsername, setCurrentUsername] = useState('');



    useEffect(() => {
        const fetchCurrentUsername = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/username`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setCurrentUsername(response.data.name);
            } catch (error) {
                console.error('Помилка:', error);
            }
        };

        fetchCurrentUsername();
    }, []);
    const handleEditUsername = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/update-name`, {
                name: username,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                alert('Ім\'я користувача успішно змінено');
            }
        } catch (error) {
            console.error('Помилка при зміні ім\'я:', error);
            alert('Помилка при зміні ім\'я');
        }
    };

    const handleEditPassword = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/update-password`, {
                oldPassword,
                newPassword,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                alert('Пароль успішно змінено');
            }
        } catch (error) {
            console.error('Помилка при зміні паролю:', error);
            alert('Помилка при зміні паролю');
        }
    };

    return (
        <MainLayout>
            <div className="container">
                <div className="block">
                    <div className="subtitle linkGrey">
                        <p onClick={onBack} style={{border: 'none !important'}}>Назад</p>
                    </div>
                </div>
                <div className="title">
                    <h3 className="pageTitle">
                        Обліковий запис
                    </h3>
                </div>
                <div className="blockDescription">
                    <p className="categoryDescription" style={{fontSize: '20px', color: 'black'}}>Редагування даних</p>
                </div>
                <div className="blockDescription">
                    <p className="categoryDescription">Введіть нове ім&#39;я</p>
                </div>
                <div className="inputContainer">
                    <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        padding="19px 25px"
                        fontSize="16px"
                        placeholder={currentUsername || 'Ваше ім&#39;я'}
                        color='black'
                    />
                </div>
                <Button wide onClick={handleEditUsername}>Змінити ім&#39;я</Button>
                <div className="blockDescription">
                    <p className="categoryDescription">Введіть старий пароль</p>
                </div>
                <div className="inputContainer">
                    <Input
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        padding="19px 25px"
                        fontSize="16px"
                        type='password'
                        color='black'
                    />
                </div>
                <div className="blockDescription">
                    <p className="categoryDescription">Введіть новий пароль</p>
                </div>
                <div className="inputContainer">
                    <Input
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        padding="19px 25px"
                        fontSize="16px"
                        type='password'
                        color='black'
                    />
                </div>
                <Button wide onClick={handleEditPassword}>Змінити пароль</Button>
            </div>
        </MainLayout>
    );
}

export default Account;
