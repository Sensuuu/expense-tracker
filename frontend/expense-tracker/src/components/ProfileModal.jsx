import React, { useEffect } from 'react'
import Portal from './Portal'

const ProfileModal = ({ children, isOpen, onClose, title = 'Profile Settings' }) => {
    // Stop background scroll while modal is open
    useEffect(() => {
        if (!isOpen) return
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    if (!isOpen) return null

    return (
        <Portal>
            <div className="fixed inset-0 z-[9999] bg-black/20 backdrop-blur-[5px]">
                {/* Scrollable wrapper */}
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        {/* Modal container */}
                        <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                                <button
                                    type="button"
                                    className="text-gray-400 hover:text-gray-700 bg-transparent hover:bg-gray-100 rounded-lg text-lg w-8 h-8 flex justify-center items-center"
                                    onClick={onClose}
                                    aria-label="Close"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 14"
                                    >
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 max-h-[calc(100vh-180px)] overflow-y-auto md:overflow-y-hidden">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Portal>
    )
}

export default ProfileModal
