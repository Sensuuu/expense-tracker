import React, { useEffect, useState } from 'react'
import { LuPlus } from 'react-icons/lu'
import CustomBarChart from "../charts/CustomBarChart";
import { prepareIncomeBarChartData } from '../../utils/helper';

const IncomeOverview = ({ transactions, onAddIncome }) => {
    const [chartData, setChartData] = useState([])

    useEffect(() => {
        const result = prepareIncomeBarChartData(transactions);
        setChartData(result);
        return () => { }
    }, [transactions])

    return (
        <div className="card">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-3">
                <div>
                    <h2 className="text-xl font-medium text-gray-900 mb-1">
                        Income Overview
                    </h2>
                    <p className="text-sm text-gray-500">
                        Track your earnings over time and analyze your income trends.
                    </p>
                </div>

                <button
                    onClick={onAddIncome}
                    className="add-btn"
                >
                    <LuPlus className="text-lg" />
                    Add Income
                </button>
            </div>

            <div className="mt-6">
                <CustomBarChart data={chartData} />
            </div>
        </div>
    )
}

export default IncomeOverview
