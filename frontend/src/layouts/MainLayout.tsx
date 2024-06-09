import React, {useEffect, useState} from "react";
import {Footer} from "@/components/Footer/Footer";
import {FooterMobile} from "@/components/Footer/FooterMobile";
import Login from "@/components/Auth/Login/Login";
import Registration from "@/components/Auth/Registration/Registration";
import {NextUIProvider} from "@nextui-org/react";
import {useAuth} from "@/context/AuthContext";
import axios from "axios";

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({children}) => {
    const [showLogin, setShowLogin] = useState(true);

    let size: number | undefined;
    const auth = useAuth();
    const [isMobile, setIsMobile] = useState<boolean>(
        size ? size <= 991 : false
    );

    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsMobile(window.innerWidth <= 991);
        }
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 991);
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };

        const checkAuth = async () => {
            try {
                console.log(1)
                const response = await axios.get('/auth/check-auth');
                if (response.data.isAuthenticated) {
                    console.log(2)
                    auth?.login(response.data.user);
                }
                console.log(3)
            } catch (error) {
                console.error('Ошибка проверки аутентификации:', error);
            }
        };

        checkAuth();
    }, [auth]);

    const toggleAuthComponent = () => setShowLogin(!showLogin);
    if (auth?.isLoading) {
        return <div>Loading...</div>;
    }

    if (!auth || !auth.isLoggedIn) {
        return (
            <div>
                {showLogin ? (
                    <Login onToggleLogin={toggleAuthComponent} />
                ) : (
                    <Registration onToggleReg={toggleAuthComponent} />
                )}
            </div>
        );
    }

    return (
        <NextUIProvider>
            <div>
                <main className="content">
                    {children}
                </main>
                <footer>{isMobile ? <FooterMobile/> : <Footer/>}</footer>
            </div>
        </NextUIProvider>
    );
};

export default MainLayout;
