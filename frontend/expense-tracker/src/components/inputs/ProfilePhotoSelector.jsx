import React, { useRef, useState, useEffect, useContext } from 'react';
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu';
import { UserContext } from '../../context/UserContext';

const ProfilePhotoSelector = ({ image, setImage, onDelete, imageDeleted }) => {
    const { user } = useContext(UserContext);
    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Update preview when component mounts or user changes
    useEffect(() => {
        if (imageDeleted) {
            setPreviewUrl(null);
            return;
        }

        if (!image && user?.profileImageUrl) {
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
            const fullUrl = user.profileImageUrl.startsWith('http')
                ? user.profileImageUrl
                : `${apiUrl}${user.profileImageUrl}`;
            setPreviewUrl(fullUrl);
        }
    }, [user?.profileImageUrl, imageDeleted, image]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreviewUrl(null);
        if (onDelete) {
            onDelete();
        }
    };

    const onChooseFile = () => {
        inputRef.current.click();
    };

    // Determine if we should show an image
    const showImage = (previewUrl && !imageDeleted) || (image && !imageDeleted);

    return (
        <div className='flex justify-center mb-6'>
            <input
                type="file"
                accept='image/*'
                ref={inputRef}
                onChange={handleImageChange}
                className='hidden'
            />

            {!showImage ? (
                // No image - show upload button
                <div className='w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full relative'>
                    <LuUser className='text-4xl text-primary' />
                    <button
                        type='button'
                        className='w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1'
                        onClick={onChooseFile}
                    >
                        <LuUpload />
                    </button>
                </div>
            ) : (
                // Has image - show image with delete and change buttons
                <div className="relative">
                    <img
                        src={previewUrl}
                        alt="profile photo"
                        className='w-20 h-20 rounded-full object-cover'
                    />
                    {/* Upload/Change button */}
                    <button
                        type='button'
                        className='w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1'
                        onClick={onChooseFile}
                    >
                        <LuUpload />
                    </button>
                    {/* Delete button */}
                    <button
                        type='button'
                        className='w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -top-1 -right-1'
                        onClick={handleRemoveImage}
                    >
                        <LuTrash />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfilePhotoSelector;
