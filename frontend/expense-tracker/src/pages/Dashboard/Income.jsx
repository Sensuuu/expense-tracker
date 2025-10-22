import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import IncomeOverview from '../../components/income/IncomeOverview';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import Modal from '../../components/Modal';
import AddIncomeForm from '../../components/income/AddIncomeForm';
import toast from 'react-hot-toast';
import IncomeList from '../../components/income/IncomeList';
import DeleteAlert from '../../components/DeleteAlert';


const Income = () => {

    const [incomeData, setIncomeData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null, });
    const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);
    const [editingIncome, setEditingIncome] = useState(null);


    //Get All Income Details
    const fetchIncomeDetails = async () => {
        if (loading) return;

        setLoading(true);

        try {
            const response = await axiosInstance.get(`${API_PATHS.INCOME.GET_ALL_INCOME}`)

            if (response.data) {
                setIncomeData(response.data);
            }

        } catch (error) {
            console.log("Something went wrong. Please Try Again", error)
        } finally {
            setLoading(false);
        }

    };

    // Handle Add/Update Income
    const handleAddIncome = async (income) => {
        const { source, amount, date, icon } = income;

        // Validation Checks
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
            if (editingIncome) {
                // Update income
                await axiosInstance.put(API_PATHS.INCOME.UPDATE_INCOME(editingIncome._id), {
                    source,
                    amount,
                    date,
                    icon,
                });
                toast.success("Income updated successfully.")
            } else {
                // Add income
                await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, {
                    source,
                    amount,
                    date,
                    icon,
                });
                toast.success("Income added successfully.")
            }

            setOpenAddIncomeModal(false)
            setEditingIncome(null); //Reset editing state
            fetchIncomeDetails();
        } catch (error) {
            console.error(
                "Error adding income:", error.response?.data?.message || error.message
            );
        }
    };

    //Delete Income
    const deleteIncome = async (id) => {
        try {
            await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id))

            setOpenDeleteAlert({ show: false, data: null });
            toast.success("Income details deleted successfully");
            fetchIncomeDetails();
        } catch (error) {
            console.error(
                "Error deleting income:",
                error.response?.data?.message || error.message
            );
        }
        setOpenDeleteAlert({ show: false, data: null });
    };

    // Handle Edit Click
    const handleEditClick = (income) => {
        setEditingIncome(income);
        setOpenAddIncomeModal(true);
    };

    //Handle download income details 
    const handleDownloadIncomeDetails = async () => {
        try {
            const response = await axiosInstance.get(
                API_PATHS.INCOME.DOWNLOAD_INCOME,
                {
                    responseType: "blob"
                }
            );

            //Create a URL for the blob 
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "income_details.xlsx");
            document.body.appendChild(link)
            link.click()
            link.parentNode.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error("Error downloading income details:", error);
            toast.error("Failed to download income details. Please try again.")
        }
    };

    useEffect(() => {
        fetchIncomeDetails()

        return () => {

        }
    }, [])


    return (
        <DashboardLayout activeMenu="Income">
            <div className="my-5 mx-auto">
                <div className="grid grid-cols-1 gap-6">
                    <div className="">
                        <IncomeOverview
                            transactions={incomeData}
                            onAddIncome={() => {
                                setEditingIncome(null) // Reset editing state when adding new
                                setOpenAddIncomeModal(true)
                            }}
                        />
                    </div>

                    <IncomeList
                        transactions={incomeData}
                        onDelete={(id) => {
                            setOpenDeleteAlert({ show: true, data: id });
                        }}
                        onEdit={handleEditClick} // Pass edit handler
                        onDownload={handleDownloadIncomeDetails}
                    />
                </div>

                <Modal
                    isOpen={openAddIncomeModal}
                    onClose={() => {
                        setOpenAddIncomeModal(false);
                        setEditingIncome(null); // Reset editing state on close
                    }}
                    title={editingIncome ? "Edit Income" : "Add Income"} // Dynamic title
                >
                    <AddIncomeForm
                        onAddIncome={handleAddIncome}
                        editingIncome={editingIncome} // Pass editing data
                    />
                </Modal>

                <Modal
                    isOpen={openDeleteAlert.show}
                    onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                    title="Delete Income"
                >
                    <DeleteAlert
                        content="Are you sure you want to delete this income detail?"
                        onDelete={() => deleteIncome(openDeleteAlert.data)}
                    />
                </Modal>
            </div>
        </DashboardLayout>
    )
}

export default Income