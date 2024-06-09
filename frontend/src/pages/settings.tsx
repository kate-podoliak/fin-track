import React, { useState } from 'react';
import MainLayout from "@/layouts/MainLayout";
import Reminder from "@/components/Reminder/Reminder";
import styles from './../assets/styles/settings.module.scss';
import Account from "@/components/Account/Account";
import About from "@/components/About/About";
import {useAuth} from "@/context/AuthContext";
import EventCount from "@/components/EventCount/EventCount";

type ComponentName = 'reminders' | 'account' | 'about';

const Settings = () => {
    const auth = useAuth();
    const [activeComponent, setActiveComponent] = useState<ComponentName | null>(null);

    const showComponent = (componentName: ComponentName) => {
        setActiveComponent(componentName);
    };

    const hideComponent = () => {
        setActiveComponent(null);
    };

    return (
        <MainLayout>
            {activeComponent === null && (
                <div className="container">
                    <div className={styles.settingsMenu}>
                        <div className={styles.settingsMenuItem} onClick={() => showComponent('reminders')}>
                            <div className={styles.settingsMenuItemTitle}>Нагадування <EventCount type={'setings'}/></div>
                        </div>
                        <div className={styles.settingsMenuItem} onClick={() => showComponent('account')}>
                            <div className={styles.settingsMenuItemTitle}>Обліковий запис</div>
                        </div>
                        <div className={styles.settingsMenuItem} onClick={() => showComponent('about')}>
                            <div className={styles.settingsMenuItemTitle}>Про додаток</div>
                        </div>
                        {auth && auth.isLoggedIn && (
                            <div className={styles.settingsMenuItem} onClick={auth.logout}>
                                <div className={styles.settingsMenuItemTitle}>Вихід</div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {activeComponent === 'reminders' && <Reminder onBack={hideComponent}/>}
            {activeComponent === 'account' && <Account onBack={hideComponent}/>}
            {activeComponent === 'about' && <About/>}
        </MainLayout>
    );
};

export default Settings;
