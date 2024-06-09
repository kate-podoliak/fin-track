import axios from 'axios';
import {useEffect, useState} from 'react';
import {useAuth} from "@/context/AuthContext";
import styles from "../auth.module.scss"

interface Login {
    onToggleLogin: () => void;
}

export default function Login({onToggleLogin}: Login) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const auth = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
            localStorage.setItem('token', token);
            auth?.login(token);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [auth]);

    const login = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
              {email, password});
            localStorage.setItem('token', response.data.access_token);
            auth?.login(response.data.access_token);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const errors = error.response.data || {};
                setEmailError(errors.email || '');
                setPasswordError(errors.password || '');
            } else {
                console.error('Помилка: ', error);
            }
        }
    };

    const loginGoogle = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
    };

    return (
        <div style={{background: '-webkit-linear-gradient(top,#9382ff, #d2a4ff)'}}>
            <div className={styles.containerForm}>
                <div className={styles.wrapForm}>
                    <div className={styles.form}>
                        <p className={styles.formHeader}>Вхід</p>
                        <div className={styles.formBlock}>
                            <div className={styles.inputContainer}>
                                <label htmlFor="email" className={styles.icon}>
                                    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round"
                                           stroke-linejoin="round"></g>
                                        <g id="SVGRepo_iconCarrier">
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                  d="M3.17157 5.17157C2 6.34315 2 8.22876 2 12C2 15.7712 2 17.6569 3.17157 18.8284C4.34315 20 6.22876 20 10 20H14C17.7712 20 19.6569 20 20.8284 18.8284C22 17.6569 22 15.7712 22 12C22 8.22876 22 6.34315 20.8284 5.17157C19.6569 4 17.7712 4 14 4H10C6.22876 4 4.34315 4 3.17157 5.17157ZM18.5762 7.51986C18.8413 7.83807 18.7983 8.31099 18.4801 8.57617L16.2837 10.4066C15.3973 11.1452 14.6789 11.7439 14.0448 12.1517C13.3843 12.5765 12.7411 12.8449 12 12.8449C11.2589 12.8449 10.6157 12.5765 9.95518 12.1517C9.32112 11.7439 8.60271 11.1452 7.71636 10.4066L5.51986 8.57617C5.20165 8.31099 5.15866 7.83807 5.42383 7.51986C5.68901 7.20165 6.16193 7.15866 6.48014 7.42383L8.63903 9.22291C9.57199 10.0004 10.2197 10.5384 10.7666 10.8901C11.2959 11.2306 11.6549 11.3449 12 11.3449C12.3451 11.3449 12.7041 11.2306 13.2334 10.8901C13.7803 10.5384 14.428 10.0004 15.361 9.22291L17.5199 7.42383C17.8381 7.15866 18.311 7.20165 18.5762 7.51986Z"
                                                  fill="#fff"></path>
                                        </g>
                                    </svg>
                                </label>
                                <input type="email" className={styles.inputField} placeholder="Електронна пошта"
                                       value={email}
                                       onChange={(e) => {
                                           setEmail(e.target.value);
                                           setEmailError(''); // Очистка ошибок при изменении данных
                                       }}/>

                            </div>
                            {emailError && <span className={styles.errorMessage}>{emailError}</span>}
                        </div>

                        <div className={styles.formBlock}>
                            <div className={styles.inputContainer}>
                                <label htmlFor="password" className={styles.icon}>
                                    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round"
                                           stroke-linejoin="round"></g>
                                        <g id="SVGRepo_iconCarrier">
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                  d="M5.25 10.0546V8C5.25 4.27208 8.27208 1.25 12 1.25C15.7279 1.25 18.75 4.27208 18.75 8V10.0546C19.8648 10.1379 20.5907 10.348 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2 20.2426 2 18.8284 2 16C2 13.1716 2 11.7574 2.87868 10.8787C3.40931 10.348 4.13525 10.1379 5.25 10.0546ZM6.75 8C6.75 5.10051 9.10051 2.75 12 2.75C14.8995 2.75 17.25 5.10051 17.25 8V10.0036C16.867 10 16.4515 10 16 10H8C7.54849 10 7.13301 10 6.75 10.0036V8Z"
                                                  fill="#fff"></path>
                                        </g>
                                    </svg>
                                </label>
                                <input type="password" className={styles.inputField} placeholder="Пароль"
                                       value={password} onChange={(e) => {
                                    setPassword(e.target.value);
                                    setPasswordError('');
                                }}/>
                            </div>
                            {passwordError && <span className={styles.errorMessage}>{passwordError}</span>}
                        </div>

                        <button onClick={login} className={styles.button}>Увійти</button>
                        <div className={styles.separatorBlock}>
                            <div className={styles.separatorLine}></div>
                            <div className={styles.separatorText}>або</div>
                            <div className={styles.separatorLine}></div>
                        </div>
                        <div className={styles.authSocialBlock} onClick={loginGoogle}>
                            <div>
                                <svg width="36px" height="36px" viewBox="-0.5 0 48 48" version="1.1"
                                     xmlns="http://www.w3.org/2000/svg"
                                     fill="#000000">
                                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier"><title>Google-color</title>
                                        <desc>Created with Sketch.</desc>
                                        <defs></defs>
                                        <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                            <g id="Color-" transform="translate(-401.000000, -860.000000)">
                                                <g id="Google" transform="translate(401.000000, 860.000000)">
                                                    <path
                                                        d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                                                        id="Fill-1" fill="#FBBC05"></path>
                                                    <path
                                                        d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                                                        id="Fill-2" fill="#EB4335"></path>
                                                    <path
                                                        d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
                                                        id="Fill-3" fill="#34A853"></path>
                                                    <path
                                                        d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
                                                        id="Fill-4" fill="#4285F4"></path>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                            <div>Увійти через Google</div>
                        </div>
                        <div className={styles.linkToggle}>
                            <span onClick={onToggleLogin}>Ви ще не зареєстровані?</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
