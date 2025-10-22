import React, { useEffect, useState } from 'react'
import { prepareExpenseBarChartData } from '../../utils/helper'
import { LuPlus } from 'react-icons/lu';
import CustomLineChart from '../charts/CustomLineChart';

const ExpenseOverview = ({ transactions, onExpenseIncome }) => {
    const [chartData, setChartData] = useState([])

    useEffect(() => {
        const result = prepareExpenseBarChartData(transactions);
        setChartData(result)
        return () => { };
    }, [transactions]);

    return (
        <div className="card">
            {/* Header - Desktop: side by side, Mobile: stacked */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-3">
                <div>
                    <h3 className="text-xl font-medium text-gray-900 mb-1">
                        Expense Overview
                    </h3>
                    <p className="text-sm text-gray-500">
                        Track your earnings over time and gain insights into where your money goes.
                    </p>
                </div>

                {/* Add Expense Button */}
                <button
                    onClick={onExpenseIncome}
                    className="add-btn"
                >
                    <LuPlus className="text-lg" />
                    Add Expense
                </button>
            </div>

            {/* Chart */}
            <div className="mt-6">
                <CustomLineChart data={chartData} />
            </div>
        </div>
    )
}

export default ExpenseOverview
