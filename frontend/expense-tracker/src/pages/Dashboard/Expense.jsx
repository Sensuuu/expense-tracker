import React, { useEffect, useState } from 'react'
import DashboardLayout from "../../components/layouts/DashboardLayout"
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import ExpenseOverview from '../../components/expense/ExpenseOverview';
import axiosInstance from '../../utils/axiosInstance';
import Modal from '../../components/Modal'
import AddExpenseForm from '../../components/expense/AddExpenseForm';
import ExpenseList from '../../components/expense/ExpenseList';
import DeleteAlert from '../../components/DeleteAlert';

const Expense = () => {

    const [expenseData, setExpenseData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null, });
    const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);


    //Get All Expense Details
    const fetchExpenseDetails = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await axiosInstance.get(`${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`)

            if (response.data) {
                setExpenseData(response.data);
            }

        } catch (error) {
            console.log("Something went wrong. Please Try Again", error)
        } finally {
            setLoading(false);
        }

    };

    // Handle Add/Update Expense
    const handleAddExpense = async (expense) => {
        const { category, amount, date, icon } = expense;

        // Validation Checks
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
            if (editingExpense) {
                // UPDATE MODE
                await axiosInstance.put(API_PATHS.EXPENSE.UPDATE_EXPENSE(editingExpense._id), {
                    category,
                    amount,
                    date,
                    icon,
                });
                toast.success("Expense updated successfully");
            } else {
                // ADD MODE
                await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
                    category,
                    amount,
                    date,
                    icon,
                });
                toast.success("Expense added successfully");
            }

            setOpenAddExpenseModal(false)
            setEditingExpense(null); // Reset editing state
            fetchExpenseDetails();
        } catch (error) {
            console.error(
                "Error adding expense:", error.response?.data?.message || error.message
            );
        }
    };

    //Delete Expense
    const deleteExpense = async (id) => {
        try {
            await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id))

            setOpenDeleteAlert({ show: false, data: null });
            toast.success("Expense details deleted successfully");
            fetchExpenseDetails();
        } catch (error) {
            console.error(
                "Error deleting expense:",
                error.response?.data?.message || error.message
            );
        }
        setOpenDeleteAlert({ show: false, data: null });
    };

    // Handle Edit Click
    const handleEditClick = (expense) => {
        setEditingExpense(expense);
        setOpenAddExpenseModal(true);
    };

    //Handle download expense details 
    const handleDownloadExpenseDetails = async () => {
        try {
            const response = await axiosInstance.get(
                API_PATHS.EXPENSE.DOWNLOAD_EXPENSE,
                {
                    responseType: "blob"
                }
            );

            //Create a URL for the blob 
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "expense_details.xlsx");
            document.body.appendChild(link)
            link.click()
            link.parentNode.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error("Error downloading expense details:", error);
            toast.error("Failed to download expense details. Please try again.")
        }
    };

    useEffect(() => {
        fetchExpenseDetails()

        return () => {

        }
    }, [])


    return (
        <DashboardLayout activeMenu="Expense">
            <div className="my-5 mx-auto"></div>
            <div className="grid grid-cols-1 gap-6">
                <div className="">
                    <ExpenseOverview
                        transactions={expenseData}
                        onExpenseIncome={() => {
                            setEditingExpense(null); // Reset editing state when adding new
                            setOpenAddExpenseModal(true)
                        }}
                    />
                </div>

                <ExpenseList
                    transactions={expenseData}
                    onDelete={(id) => {
                        setOpenDeleteAlert({ show: true, data: id });
                    }}
                    onEdit={handleEditClick} // Pass edit handler
                    onDownload={handleDownloadExpenseDetails}
                />
            </div>

            <Modal
                isOpen={openAddExpenseModal}
                onClose={() => {
                    setOpenAddExpenseModal(false)
                    setEditingExpense(null); // Reset editing state on close
                }}
                title={editingExpense ? "Edit Expense" : "Add Expense"} // Dynamic title
            >
                <AddExpenseForm
                    editingExpense={editingExpense} // Pass editing data
                    onAddExpense={handleAddExpense}
                />
            </Modal>

            <Modal
                isOpen={openDeleteAlert.show}
                onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                title="Delete Expense"
            >
                <DeleteAlert
                    content="Are you sure you want to delete this expense detail?"
                    onDelete={() => deleteExpense(openDeleteAlert.data)}
                />
            </Modal>
        </DashboardLayout>
    );
}

export default Expense;