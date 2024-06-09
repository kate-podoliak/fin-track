import MainLayout from "@/layouts/MainLayout";
import React, {useEffect, useRef, useState} from "react";
import Input from "@/components/Input/Input";
import Link from "next/link";
import Button from "@/components/Button/Button";
import ItemReminder from "@/components/ItemReminder/ItemReminder";
import ModalWindow from "@/components/ModalWindow/ModalWindow";
import axios from "axios";
import { TuiDatePicker } from 'nextjs-tui-date-picker';
import Alert from '@/components/Alert/Alert';

interface ReminderInterface {
    onBack: () => void;
}

interface Event {
    id: number;
    name: string;
    amount: number;
    date: string;
    status: string;
}

const Reminder = ({onBack}: ReminderInterface) => {
    const [event, setEvent] = useState('');
    const [events, setEvents] = useState<Event[]>([]);
    const [amountEvent, setAmountEvent] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const [dateEvent, setDateEvent] = useState('');
    const [alert, setAlert] = useState<{ type: '' | 'error' | 'success'; message: string }>({ type: '', message: '' });


    const openModal = async () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        loadEvents().then(() => {
            console.log("Events after loading:", events);
        });
        const clickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                closeModal();
            }
        };

        document.addEventListener("mousedown", clickOutside);
        return () => {
            document.removeEventListener("mousedown", clickOutside);
        };
    }, []);

    const loadEvents = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/events`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            console.log("API Response:", response.data);
            setEvents(response.data);
        } catch (error) {

            console.error('Помилка при завантаженні подій: ', error);
        }
    };

    const handleChange = (date: string) => {
        setDateEvent(date);
    };


    const addEvent = async () => {
        const formattedDate = new Date(dateEvent);

        try {
            const eventData = {
                name: event,
                amount: amountEvent,
                date: formattedDate
            };
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/events`, eventData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.status === 201) {
                setIsModalOpen(false);
                setAlert({ type: 'success', message: 'Нагадування успішне додане.' });
                loadEvents();
            }
        } catch (error) {
            setAlert({ type: 'error', message: 'Введіть дані події.' });
            console.error('Помилка при додаванні події:', error);
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
                    <p className="subtitle linkGrey">
                        <p onClick={onBack}>
                            Назад
                        </p>
                    </p>
                </div>
                <div className="title">
                    <h3 className="pageTitle">
                        Мої нагадування
                    </h3>
                </div>
                <div className="categoriesList">
                    {events.length === 0 ? (
                      <span>Немає фінансових подій</span>
                    ) : (
                      events.map((event) => (
                        <ItemReminder
                          key={event.id}
                          status={event.status}
                          date={event.date}
                          amount={event.amount}
                          name={event.name}
                        />
                      ))
                    )}
                </div>
                <Button wide onClick={openModal}>Додати нову подію</Button>

                {isModalOpen && (
                    <ModalWindow isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
                                 title="Додати нову фінансову подію">
                        <div className="inputContainer">
                            <Input
                                value={event}
                                onChange={(e) => setEvent(e.target.value)}
                                padding="19px 25px"
                                fontSize="16px"
                                placeholder="Введіть назву події"
                            />
                        </div>
                        <div className="inputContainer">
                            <Input
                                value={amountEvent}
                                onChange={(e) => setAmountEvent(e.target.value)}
                                padding="19px 25px"
                                fontSize="16px"
                                type="number"
                                placeholder="Введіть суму події"
                            />
                        </div>
                        <div className="inputContainer calendar">
                            {/*<Input*/}
                            {/*    value={amountEvent}*/}
                            {/*    onChange={(e) => setAmountEvent(e.target.value)}*/}
                            {/*    padding="19px 25px"*/}
                            {/*    fontSize="16px"*/}
                            {/*    placeholder="Оберіть дату нагадування"*/}
                            {/*/>*/}
                            <TuiDatePicker
                                handleChange={handleChange}
                                date={dateEvent ? new Date(dateEvent) : new Date()}
                                fontSize={16}

                            />
                        </div>
                        <Button wide onClick={addEvent}>Додати</Button>
                    </ModalWindow>
                )}
            </div>
        </MainLayout>
    );
}

export default Reminder;
