import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import AIAssistant from '../../components/AIAssistant';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const AIChat = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchDashboardData = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);
            if (response.data) {
                setDashboardData(response.data);
            }
        } catch (error) {
            console.log("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <DashboardLayout activeMenu="AI Assistant">
            <div className="my-5 mx-auto h-[calc(100vh-120px)]">
                <div className="card h-full p-0 overflow-hidden">
                    <AIAssistant dashboardData={dashboardData} />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AIChat;
