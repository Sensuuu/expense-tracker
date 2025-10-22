import React from 'react'
import Portal from './Portal'

const Modal = ({ children, isOpen, onClose, title }) => {
    if (!isOpen) return null

    return (
        <Portal>
            <div className="fixed inset-0 z-50 overflow-y-auto bg-black/20 backdrop-blur-[5px] ">
                <div className="min-h-screen px-4 flex items-center justify-center py-8">
                    {/* Modal container */}
                    <div className="relative w-full max-w-2xl bg-white rounded-lg my-8 shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                            <button
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center cursor-pointer"
                                onClick={onClose}
                            >
                                <svg
                                    className="w-3 h-3"
                                    aria-hidden="true"
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

                        {/* Modal Body */}
                        <div className="p-4 md:p-5">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </Portal>
    )
}

export default Modal
