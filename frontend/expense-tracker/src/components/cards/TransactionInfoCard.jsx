import React from 'react'
import { LuUtensils, LuTrendingUp, LuTrendingDown, LuTrash2, LuPencil } from 'react-icons/lu'

const TransactionInfoCard = ({ title, icon, date, amount, type, hideDeleteBtn, hideEditBtn, onDelete, onEdit }) => {
    const getAmountStyles = () =>
        type === "income" ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500";

    const getTitle = () =>
        type === "income" ? "Source" : "Category";

    // delete function 
    const handleDelete = (e) => {
        e.preventDefault();      // Prevent default behavior
        e.stopPropagation();     // Stop event from bubbling to parent
        if (onDelete) {
            onDelete();
        } else {
            console.log("onDelete is undefined!");
        }
    };

    // Handle Edit
    const handleEdit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onEdit) {
            onEdit();
        }
    };

    return (
        <div
            className={`card-btn !justify-between !p-4 ${type === "income" ? "hover:!bg-green-50" : "hover:!bg-red-50"}`}
        >
            {/* Left Section: Icon + Info */}
            <div
                className="flex items-center gap-3 flex-1 min-w-0"
            >
                <div className="w-10 h-10 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                    {icon ? (
                        <span>{icon}</span>
                    ) : (
                        <LuUtensils className="text-gray-600 text-xl" />
                    )}
                </div>

                <div className="flex-1 min-w-0" >
                    <h4
                        className="font-medium text-gray-900 text-sm truncate"
                        title={`${getTitle()}: ${title} `}
                    >
                        {title}
                    </h4>
                    <p
                        className="text-xs text-gray-500"
                        title={`Date: ${date}`}
                    >
                        {date}
                    </p>
                </div>
            </div>

            {/* Right Section: Amount + Delete Button */}
            <div
                className="flex items-center gap-2 sm:gap-3 flex-shrink-0"
            >
                {/* Amount Badge */}
                <div
                    className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold ${getAmountStyles()}`}
                    title={`Amount: $${amount}`}
                >
                    {type === "income" ? (
                        <>
                            <LuTrendingUp className="text-base" />
                            <span>+${amount}</span>
                        </>
                    ) : (
                        <>
                            <LuTrendingDown className="text-base" />
                            <span>-${amount}</span>
                        </>
                    )}
                </div>

                {/**Edit button */}
                {!hideEditBtn && onEdit && (
                    <button
                        onClick={handleEdit}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors group flex-shrink-0"
                        title="Edit"
                    >
                        <LuPencil
                            className="text-base sm:text-lg text-gray-400 group-hover:text-blue-600 transition-colors"
                        />
                    </button>
                )}

                {/* Delete Button */}
                {!hideDeleteBtn && onDelete && (
                    <button
                        onClick={handleDelete}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors group flex-shrink-0"
                        aria-label="Delete transaction"
                        type="button"
                        title="Delete"
                    >
                        <LuTrash2
                            className="text-base sm:text-lg text-gray-400 group-hover:text-red-600 transition-colors"
                        />
                    </button>
                )}
            </div>
        </div>
    )
}

export default TransactionInfoCard
