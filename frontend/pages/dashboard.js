"use client";
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { UserAuth } from '@/utils/auth';
import React, { useEffect, useState } from 'react';
import Card from '@/components/Card';
import { MdAdd } from 'react-icons/md';
import Loading from '@/components/Loading';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import axios from 'axios';
import publicUrl from '@/utils/publicUrl';
import { initialData } from '@/constants/data';
import { useRouter } from 'next/router';
import useNotesStore from '@/store/notesStore';
import { Outfit } from 'next/font/google';


const outfit = Outfit({ subsets: ['latin'] });
const Dashboard = () =>
{

    const router = useRouter();
    const { user, setUser, signOut } = UserAuth();
    const { notes, category, setNotes } = useNotesStore();
    const [notesData, setNotesData] = useState([]);

    useEffect(() =>
    {
        console.log(user);
        const fetchData = async () =>
        {
            console.log(user);
            if (user)
            {
                const res = await axios.get(`${publicUrl()}/get-notes/${user.uid}`);
                const data = await res.data;
                console.log(data);
                setNotes(data);
                setNotesData(data);
            }
        };

        fetchData();
    }, []);

    const handleNewNote = async () =>
    {
        const docId = Math.floor(Math.random() * 10000000);
        try
        {
            const res = await axios.post(`${publicUrl()}/note`, {
                docId: docId.toString(),
                title: "New Note",
                content: initialData,
                uid: user.uid,
                category: "frontend",
                tags: ["tag"]
            });
            console.log(res);
            router.push(`/edit/${docId}`);
        } catch (error)
        {
            console.log(error);
            return;

        }
    };


    //handle filter
    useEffect(() =>
    {
        if (!category) return setNotesData(notes);
        const filterNotes = async () =>
        {
            //filter notes array 
            const filteredNotes = await notes.filter((note) => note.category === category.title);
            setNotesData(filteredNotes);
            console.log("Data From Server");
            console.log(notes);
        };
        filterNotes();
        console.log(notesData);
    }, [category]);

    return (
        <>
            {
                user ?
                    <main className={`${outfit.className} conatiner flex bg-gray-100 h-screen dark:bg-gray-800 `}>
                        <Sidebar />
                        <div className="w-full overflow-y-scroll ">
                            <Navbar />
                            {/* Heading Section */}
                            <Header count={notesData.length} />
                            {/* Notes Section */}
                            <div className="notes px-6 py-4 min-h-[70vh] items-start mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {/* Add New Note */}
                                <button onClick={handleNewNote}>
                                    <div className=" cursor-pointer note-card flex items-center justify-center bg-white dark:bg-gray-900 rounded-lg shadow-md flex-col p-4">
                                        <div className="border-2 flex items-center justify-center border-dashed border-blue-400 rounded-full h-28 w-28">
                                            <MdAdd className='text-3xl' />
                                        </div>
                                        <p className='text-blue-400 font-medium mt-4'>Add Note</p>
                                    </div>
                                </button>
                                {
                                    notesData.map((note) =>
                                    {
                                        return <Card key={note._id} id={note.docId} category={note.category} title={note.title} content={note.content[1].content.text} timestamp={note.timestamp} displayName={user.displayName} preview={note.preview} />;
                                    })
                                }
                            </div>
                            <Footer />
                        </div>
                    </main >
                    :
                    <Loading />

            }
        </>
    );
};

export default Dashboard


