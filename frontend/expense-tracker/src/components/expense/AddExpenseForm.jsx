import React, { useState, useEffect } from 'react'
import Input from '../inputs/Input'
import EmojiPickerPopup from '../EmojiPickerPopup'

const AddExpenseForm = ({ onAddExpense, editingExpense }) => {
    const [expense, setExpense] = useState({
        category: "",
        amount: "",
        date: "",
        icon: "",
    });

    // Populate form when editing
    useEffect(() => {
        if (editingExpense) {
            setExpense({
                category: editingExpense.category || "",
                amount: editingExpense.amount || "",
                date: editingExpense.date ? new Date(editingExpense.date).toISOString().split('T')[0] : "",
                icon: editingExpense.icon || "",
            });
        } else {
            // Reset form when adding new
            setExpense({
                category: "",
                amount: "",
                date: "",
                icon: "",
            });
        }
    }, [editingExpense]);

    const handleChange = (key, value) => setExpense({ ...expense, [key]: value })

    // Handle Enter key press
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent default form submission
            onAddExpense(expense); // Submit the form
        }
    };

    return (
        <div
            className="space-y-4"
            onKeyDown={handleKeyDown}
        >
            <EmojiPickerPopup
                icon={expense.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <Input
                value={expense.category}
                onChange={({ target }) => handleChange("category", target.value)}
                label="Expense Category"
                placeholder="Rent, Groceries, etc."
                type="text"
            />

            <Input
                value={expense.amount}
                onChange={({ target }) => handleChange("amount", target.value)}
                label="Amount"
                placeholder=""
                type="number"
            />

            <Input
                value={expense.date}
                onChange={({ target }) => handleChange("date", target.value)}
                label="Date"
                placeholder=""
                type="date"
            />

            <div className="flex justify-end mt-6">
                <button
                    className="add-btn add-btn-fill"
                    type="button"
                    onClick={() => onAddExpense(expense)}
                >
                    {editingExpense ? "Update Expense" : "Add Expense"}
                </button>
            </div>

        </div>
    )
}

export default AddExpenseForm