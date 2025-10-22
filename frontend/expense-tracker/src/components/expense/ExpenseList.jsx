import React from 'react'
import { LuDownload } from 'react-icons/lu'
import TransactionInfoCard from '../cards/TransactionInfoCard'
import moment from 'moment'

const ExpenseList = ({ transactions, onDelete, onDownload, onEdit }) => {
    return (
        <div className="card">
            {/* Header - Keep on same line on all screens */}
            <div className="flex items-center justify-between mb-6">
                <h5 className="text-lg font-medium">All Expense</h5>
                <button className="card-btn" onClick={onDownload}>
                    <LuDownload className='text-base' /> Download
                </button>
            </div>

            {/* Transaction Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {transactions?.map((expense) => (
                    <TransactionInfoCard
                        key={expense._id}
                        title={expense.category}
                        icon={expense.icon}
                        date={moment(expense.date).format("Do MMM YYYY")}
                        amount={expense.amount}
                        type="expense"
                        onDelete={() => onDelete(expense._id)}
                        onEdit={() => onEdit(expense)}
                    />
                ))}
            </div>
        </div>
    )
}

export default ExpenseList
