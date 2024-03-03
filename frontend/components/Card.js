import React from 'react';
import Link from 'next/link';

const Card = ({ id, category, title, preview, timestamp, displayName }) => {
    // const date = new Date(timestamp);
    const date = new Date().toLocaleDateString();
    return (
        <Link href={{
            pathname: "/edit/" + `${id}`,
            query: { id: `${id}` },

        }} as={`/edit/${id}`}>
            <div className="note-card bg-white dark:bg-gray-900 flex-1 rounded-lg shadow-md p-4">
                <div className="category flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-400 rounded-full capitalize"></span>
                    <span>{category || "Frontend"}</span>
                </div>
                <div className="note-title mt-2">
                    <h2 className='text-lg font-semibold'>{title || "Lorem ipsum dolor sit amet consectetur."}</h2>
                </div>
                <div className="note-body mt-2">
                    <p className='text-sm text-gray-600 dark:text-gray-300 line-clamp-2 '>{preview || "Lorem ipsum dolor sit amet consectetur."}</p>
                </div>
                <hr className='my-3' />
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src="/user.png" alt="user.png" className='h-8 w-8 rounded-full' />
                        <span className='text-gray-600 dark:text-gray-400 text-sm'>{displayName || "John Doe"}</span>
                    </div>
                    <div className="flex items-center gap-2 py-2">
                        {/* <span className='text-gray-600 text-sm'>12:00 PM</span> */}
                        <span className='text-gray-600 dark:text-gray-400 text-sm'>{date || "12/23"}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default Card;