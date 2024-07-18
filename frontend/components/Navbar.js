import { UserAuth } from '@/utils/auth';
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { MdKeyboardArrowDown, MdOutlineNotifications } from 'react-icons/md';

const Navbar = () => {
    const { user, signOut } = UserAuth();
    const [display, setDisplay] = useState(false);
    console.log(user);
    return (
        <header className='p-3  flex justify-between bg-gray-50 dark:bg-gray-800'>
            <div className="relative flex items-center lg:w-1/4 h-10 rounded-full focus-within:ring-1 border border-gray-400 focus:ring-blue-500 bg-white  dark:bg-gray-900 overflow-hidden">
                <div className="grid place-items-center h-full w-12 text-gray-300 dark:bg-gray-900" >
                    <FaSearch />
                </div>

                <input
                    className="peer h-full w-full outline-none text-sm text-gray-700 pr-2 dark:bg-gray-900"
                    type="text"
                    id="search"
                    placeholder="Search something.." />
            </div>

            <div className="flex gap-3 items-center relative ">
                <div className="w-10 h-10 rounded-full flex items-center justify-center active:bg-blue-200 px-2 py-1 cursor-pointer">

                    <MdOutlineNotifications className='text-2xl text-gray-800' />
                </div>
                <button onClick={() => setDisplay(!display)} className="rounded-full flex items-center justify-center  h-10 bg-blue-200 px-2 py-1 ">
                    <img src="/user.png" alt="user.png" className='h-8 w-8 rounded-full' />
                    <span className='w-20 text-ellipsis font-medium text-gray-800 mb-0'>{user ? user.displayName?.split(" ")[0] : "Lorem"}</span>
                    <MdKeyboardArrowDown />
                </button>
                <div className={`${display ? "block" : "hidden"}  dropdown w-32 px-3 py-2 absolute right-0 top-12 bg-white shadow-lg rounded-md`}>
                    <button className=" px-4 w-full text-white bg-blue-500 mb-3 py-1 rounded-md">Profile</button>
                    <button onClick={signOut} className=" px-4 w-full text-white bg-red-600 py-1 rounded-md">Logout</button>
                </div>
            </div>

        </header>
    );
};

export default Navbar;