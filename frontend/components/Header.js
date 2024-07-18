import React from 'react'
import { categories } from '@/constants/data'
import useNotesStore from '@/store/notesStore'

const Header = ({ count }) => {
    const { category, setCategory } = useNotesStore();
    return (
        <div className="flex mt-3 px-4">
            <div className="title-sc">
                <span className='text-xs uppercase text-gray-600 dark:text-gray-100'>Overview</span>
                <h2 className='text-2xl font-semibold'>Notes <span className="text-gray-600 dark:text-gray-100 text-lg">({count})</span></h2>
            </div>
            <div className="flex ml-12 flex-shrink gap-1 items-end overflow-x-scroll hide-scrollbar">
                <span onClick={() => setCategory(null)} className={`cursor-pointer nav-item flex items-center p-2 py-1 justify-start flex-shrink-0 rounded-lg  font-medium ${category == null ? "bg-blue-400  text-white" : "bg-gray-50"}`}>
                    All
                </span>
                {
                    categories.map((item, index) => (
                        <span onClick={() => setCategory(item)} key={index} className={`cursor-pointer nav-item flex items-center p-2 py-1 justify-start flex-shrink-0 rounded-lg  font-medium ${category == item ? "bg-blue-400  text-white" : "bg-gray-50 dark:bg-gray-900"}`}>
                            {item.title}
                        </span>
                    ))
                }
            </div>
        </div>
    )
}

export default Header