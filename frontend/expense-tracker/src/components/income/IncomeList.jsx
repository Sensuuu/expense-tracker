import React from 'react'
import { LuDownload } from 'react-icons/lu'
import TransactionInfoCard from '../cards/TransactionInfoCard'
import moment from 'moment'

const IncomeList = ({ transactions, onDelete, onDownload, onEdit }) => {
    return (
        <div className="card">
            {/* Header - Keep on same line on all screens */}
            <div className="flex items-center justify-between mb-6">
                <h5 className="text-lg font-medium">All Income</h5>
                <button className="card-btn" onClick={onDownload}>
                    <LuDownload className='text-base' /> Download
                </button>
            </div>

            {/* Transaction Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {transactions?.map((income) => (
                    <TransactionInfoCard
                        key={income._id}
                        title={income.source}
                        icon={income.icon}
                        date={moment(income.date).format("Do MMM YYYY")}
                        amount={income.amount}
                        type="income"
                        onDelete={() => onDelete(income._id)}
                        onEdit={() => onEdit(income)}
                    />
                ))}
            </div>
        </div>
    )
}

export default IncomeList
