import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_PATHS } from '../../utils/apiPaths';
import { addThousandsSeparator } from '../../utils/helper';
import { LuHandCoins, LuWalletMinimal } from 'react-icons/lu';
import { IoMdCard } from "react-icons/io"
import axiosInstance from '../../utils/axiosInstance';

import DashboardLayout from '../../components/layouts/DashboardLayout'
import InfoCard from '../../components/cards/InfoCard';
import RecentTransactions from '../../components/dashboard/RecentTransactions';
import FinanceOverview from '../../components/dashboard/FinanceOverview';
import ExpenseTransactions from '../../components/dashboard/ExpenseTransactions';
import Last30DaysExpenses from '../../components/dashboard/Last30DaysExpenses';
import RecentIncomeWithChart from '../../components/dashboard/RecentIncomeWithChart';
import RecentIncome from '../../components/dashboard/RecentIncome';
import Modal from '../../components/Modal';
import DeleteAlert from '../../components/DeleteAlert';
import AddIncomeForm from '../../components/income/AddIncomeForm';
import AddExpenseForm from '../../components/expense/AddExpenseForm';


const Home = () => {

    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(false);

    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null,
        type: null
    });

    const [openEditModal, setOpenEditModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [editingType, setEditingType] = useState(null); // 'income' or 'expense'

    // Fetch All Dashboard Data
    const fetchDashboardData = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const response = await axiosInstance.get(
                `${API_PATHS.DASHBOARD.GET_DATA}`
            );
            if (response.data) {
                setDashboardData(response.data);
            }
        } catch (error) {
            console.log("Something went wrong. Please try again.", error);
        } finally {
            setLoading(false);
        }
    }

    // Delete Transactions from the dashboard
    const deleteTransaction = async () => {

        const { data: id, type } = openDeleteAlert;

        try {
            if (type === 'income') {
                await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
                toast.success("Income deleted successfully");
            } else if (type === 'expense') {
                await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
                toast.success("Expense deleted successfully");
            }
            setOpenDeleteAlert({ show: false, data: null, type: null });
            fetchDashboardData(); // Refresh dashboard data
        } catch (error) {
            console.error("Error deleting transaction:", error);
            toast.error("Failed to delete transaction");
            setOpenDeleteAlert({ show: false, data: null, type: null });
        }
    };

    // Edit Transactions from the dashboard
    const handleEditTransaction = (transaction, type) => {
        console.log('✅ Edit clicked:', transaction, type);
        setEditingTransaction(transaction);
        setEditingType(type);
        setOpenEditModal(true);
    };

    // Handle Income update on the dashboard
    const handleUpdateIncome = async (income) => {
        const { source, amount, date, icon } = income;

        // Validation
        if (!source.trim()) {
            toast.error("Source is required.");
            return;
        }
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            toast.error("Amount should be a valid number greater than 0.");
            return;
        }
        if (!date.trim()) {
            toast.error("Date is required.");
            return;
        }

        try {
            await axiosInstance.put(
                API_PATHS.INCOME.UPDATE_INCOME(editingTransaction._id),
                { source, amount, date, icon }
            );
            toast.success("Income updated successfully.");
            setOpenEditModal(false);
            setEditingTransaction(null);
            setEditingType(null);
            fetchDashboardData();
        } catch (error) {
            console.error("Error updating income:", error.response?.data?.message || error.message);
            toast.error("Failed to update income");
        }
    };

    // Handle Expense update on the dashboard
    const handleUpdateExpense = async (expense) => {
        const { category, amount, date, icon } = expense;

        // Validation
        if (!category.trim()) {
            toast.error("Category is required.");
            return;
        }
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            toast.error("Amount should be a valid number greater than 0.");
            return;
        }
        if (!date.trim()) {
            toast.error("Date is required.");
            return;
        }

        try {
            await axiosInstance.put(
                API_PATHS.EXPENSE.UPDATE_EXPENSE(editingTransaction._id),
                { category, amount, date, icon }
            );
            toast.success("Expense updated successfully.");
            setOpenEditModal(false);
            setEditingTransaction(null);
            setEditingType(null);
            fetchDashboardData();
        } catch (error) {
            console.error("Error updating expense:", error.response?.data?.message || error.message);
            toast.error("Failed to update expense");
        }
    };

    useEffect(() => {
        fetchDashboardData();
        return () => { };
    }, []);

    return (
        <DashboardLayout activeMenu="Dashboard">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InfoCard
                        icon={<IoMdCard />}
                        label="Total Balance"
                        value={addThousandsSeparator(dashboardData?.totalBalance || 0)}
                        color="bg-primary"
                    />
                    <InfoCard
                        icon={<LuWalletMinimal />}
                        label="Total Income"
                        value={addThousandsSeparator(dashboardData?.totalIncome || 0)}
                        color="bg-orange-500"
                    />
                    <InfoCard
                        icon={<LuHandCoins />}
                        label="Total Expense"
                        value={addThousandsSeparator(dashboardData?.totalExpenses || 0)}
                        color="bg-red-500"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <RecentTransactions
                        transactions={dashboardData?.recentTransactions || []}
                        // onSeeMore={() => navigate("/expense")}
                        onDelete={(id, type) => {
                            setOpenDeleteAlert({ show: true, data: id, type: type });
                        }}
                        onEdit={(transaction, type) => handleEditTransaction(transaction, type)}
                    />

                    <FinanceOverview
                        totalBalance={dashboardData?.totalBalance || 0}
                        totalIncome={dashboardData?.totalIncome || 0}
                        totalExpense={dashboardData?.totalExpenses || 0}
                    />

                    <ExpenseTransactions
                        transactions={dashboardData?.last30DaysExpenses?.transactions || []}
                        onSeeMore={() => navigate("/expense")}
                    />

                    <Last30DaysExpenses
                        data={dashboardData?.last30DaysExpenses?.transactions || []}
                    />

                    <RecentIncomeWithChart
                        data={dashboardData?.last60DaysIncome?.transactions?.slice(0, 4) || []}
                        totalIncome={dashboardData?.totalIncome || 0}
                    />

                    <RecentIncome
                        transactions={dashboardData?.last60DaysIncome?.transactions || []}
                        onSeeMore={() => navigate("/income")}
                    />
                </div>
            </div>

            {/**DeleteAlert Modal */}
            <Modal
                isOpen={openDeleteAlert.show}
                onClose={() => setOpenDeleteAlert({ show: false, data: null, type: null })}
                title="Delete Transaction"
            >
                <DeleteAlert
                    content="Are you sure you want to delete this transaction?"
                    onDelete={() => deleteTransaction()}
                />
            </Modal>

            {/**Edit Transactions Modal  */}
            <Modal
                isOpen={openEditModal}
                onClose={() => {
                    setOpenEditModal(false);
                    setEditingTransaction(null);
                    setEditingType(null);
                }}
                title={editingType === 'income' ? 'Edit Income' : 'Edit Expense'}
            >
                {editingType === 'income' ? (
                    <AddIncomeForm
                        editingIncome={editingTransaction}
                        onAddIncome={handleUpdateIncome}
                    />
                ) : (
                    <AddExpenseForm
                        editingExpense={editingTransaction}
                        onAddExpense={handleUpdateExpense}
                    />
                )}
            </Modal>
        </DashboardLayout>
    )
}

export default Home;