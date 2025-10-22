import React, { useEffect, useRef } from 'react'

const LogoutAlert = ({ onConfirm, onCancel }) => {


    const alertref = useRef(null);

    // Auto-focus when mounted
    useEffect(() => {
        if (alertref.current) {
            alertref.current.focus()
        }
    }, [])

    //Handle Enter Key press
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onConfirm()
        } else if (e.key === 'Escape') {
            e.preventDefault()
            onCancel()
        }
    }

    return (
        <div
            onKeyDown={handleKeyDown}
            ref={alertref}
            tabIndex="-1"
            className='outline-none'
        >
            <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to logout? You will need to login again to access your account.
            </p>

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    onClick={onCancel}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className="px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                    onClick={onConfirm}
                >
                    Yes, Logout
                </button>
            </div>
        </div>
    )
}

export default LogoutAlert
