import React, { useState, useEffect } from 'react'
import Input from '../inputs/Input'
import EmojiPickerPopup from '../EmojiPickerPopup'

const AddIncomeForm = ({ onAddIncome, editingIncome }) => {

    const [income, setIncome] = useState({
        source: "",
        amount: "",
        date: "",
        icon: "",
    })

    // Populate form when editing
    useEffect(() => {
        if (editingIncome) {
            setIncome({
                source: editingIncome.source || "",
                amount: editingIncome.amount || "",
                date: editingIncome.date ? new Date(editingIncome.date).toISOString().split('T')[0] : "",
                icon: editingIncome.icon || "",
            });
        } else {
            // Reset form when adding new
            setIncome({
                source: "",
                amount: "",
                date: "",
                icon: "",
            });
        }
    }, [editingIncome]);

    const handleChange = (key, value) => setIncome({ ...income, [key]: value })

    // Handle Enter key press
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent default form submission
            onAddIncome(income); // Submit the form
        }
    };


    return (
        <div
            className="space-y-4"
            onKeyDown={handleKeyDown}
        >

            <EmojiPickerPopup
                icon={income.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <Input
                value={income.source}
                onChange={({ target }) => handleChange("source", target.value)}
                label="Income Source"
                placeholder="e.g. Freelance, Salary etc"
                type="text"
            />

            <Input
                value={income.amount}
                onChange={({ target }) => handleChange("amount", target.value)}
                label="Amount"
                placeholder="e.g. 1000"
                type="number"
            />

            <Input
                value={income.date}
                onChange={({ target }) => handleChange("date", target.value)}
                label="Date"
                placeholder=""
                type="date"
            />

            <div className="flex justify-end mt-6">
                <button
                    type="button"
                    className="add-btn add-btn-fill"
                    onClick={() => onAddIncome(income)}
                >
                    {editingIncome ? "Update Income" : "Add Income"}
                </button>
            </div>

        </div>
    )
}

export default AddIncomeForm