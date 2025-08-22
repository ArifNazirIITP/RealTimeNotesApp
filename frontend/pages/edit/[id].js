'use client';
import axios from "axios";
import React from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { initialData } from "@/constants/data";
import publicUrl from "@/utils/publicUrl";
import { useRouter } from "next/router";
const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

function Edit() {
    const [noteData, setNoteData] = React.useState(null);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get(`${publicUrl()}/note/${id}`);

            const data = await res.data[0];
            console.log(data);
            data && setNoteData(data);
            console.log(data);
        };
        fetchData();
    }, []);
    return (
        <>
            {noteData && <Editor data={noteData} id={id} />}
        </>

    );
}

export async function getServerSideProps(context) {
    return {
        props: {}, 
    };
}

export default Edit;

