import React, { useEffect, useRef } from 'react'

const DeleteAlert = ({ content, onDelete, onClose }) => {
    const deleteAlertRef = useRef(null)

    // Auto-focus when mounted
    useEffect(() => {
        if (deleteAlertRef.current) {
            deleteAlertRef.current.focus()
        }
    }, [])

    // handle Enter Key press
    const handleKeyDown = (e) => {
        console.log('🎹 Key pressed:', e.key)

        if (e.key === 'Enter') {
            e.preventDefault();
            onDelete();
        }
    }
    return (
        <div
            ref={deleteAlertRef}
            onKeyDown={handleKeyDown}
            tabIndex="-1"
            className="outline-none"
        >
            <p
                className="text-sm"
            >
                {content}
            </p>

            <div
                className="flex justify-end mt-6"
            >
                <button
                    type="button"
                    className="add-btn add-btn-fill"
                    onClick={onDelete}
                >
                    Delete
                </button>
            </div>
        </div>
    )
}

export default DeleteAlert