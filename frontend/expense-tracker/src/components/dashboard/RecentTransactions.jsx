import React from 'react'
// import { LuArrowRight } from 'react-icons/lu'
import moment from 'moment'
import TransactionInfoCard from '../cards/TransactionInfoCard'

const RecentTransactions = ({ transactions, onDelete, onEdit }) => {
    return (
        <div className="card">
            <div className="flex items-center justify-between mb-6">
                <h5 className="text-base sm:text-lg md:text-xl">Recent Transactions </h5>
                {/* <button className="card-btn  flex-shrink-0" onClick={onSeeMore}>
                    See All <LuArrowRight className="text-base" />
                </button> */}

            </div>
            <div className="mt-6 space-y-3">
                {transactions?.slice(0, 5)?.map((transaction) => (
                    <TransactionInfoCard
                        key={transaction._id}
                        title={transaction.type === 'expense' ? transaction.category : transaction.source}
                        icon={transaction.icon}
                        date={moment(transaction.date).format("DD MMM YYYY")}
                        amount={transaction.amount}
                        type={transaction.type}
                        onDelete={() => {
                            onDelete(transaction._id, transaction.type);
                        }}
                        onEdit={() => {
                            onEdit && onEdit(transaction, transaction.type);
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

export default RecentTransactions

