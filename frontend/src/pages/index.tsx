import React from "react";
import MainLayout from '../layouts/MainLayout';
import MainMobile from "@/components/Main/MainMobile";

const Home: React.FC = () => {
    return (
        <MainLayout>
            <MainMobile/>
        </MainLayout>
    );
}

export default Home;
