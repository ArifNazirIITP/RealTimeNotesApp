"use client"; // this registers <Editor> as a Client Component
import { getRandomUser } from "@/utils/randomuser";
import Link from 'next/link';
import { MdEdit, MdSave } from 'react-icons/md';
import publicUrl from '@/utils/publicUrl';
import React from "react";
import axios from "axios";
import EditorSidebar from "./EditorSidebar";
import EditorInfo from "./EditorInfo";
import EditorNav from "./EditorNav";
import { HiDotsVertical } from "react-icons/hi";


import { BlockNoteView, SideMenu, useBlockNote, Theme, darkDefaultTheme } from "@blocknote/react";
import "@blocknote/core/style.css";
import * as Y from "yjs";
import { WebsocketProvider } from 'y-websocket';
import { useTheme } from "next-themes";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { markdownToPlainText } from "../utils/markdown_to_text";

// Our <Editor> component we can reuse later
export default function Editor({ data, id })
{
    //theme

    const { theme } = useTheme();

    //content is the doc where docId == id
    const content = data.content;
    const initData = content.map((block) =>
    {
        console.log(block.content);
        return {
            id: `${block.id}`,
            type: `${block.type}`,
            props: block.props,
            content: `${block.content[0]?.text !== undefined ? block.content[0]?.text : ""}` || [],
            children: [],
        };
    });
    // console.log("initData", initData);
    const doc = new Y.Doc();
    const provider = new WebsocketProvider(`wss://websocket-im9l.onrender.com`, `room-${id}`, doc);



    const editor = useBlockNote({
        initialContent: initData,
        collaboration: {
            provider,
            // Where to store BlockNote data in the Y.Doc:
            fragment: doc.getXmlFragment("document-store"),
            // Information (name and color) for this user:
            user: getRandomUser(),
        },
        onEditorContentChange: (editor) =>
        {
            //To handkle changes
            console.log(provider);
            return;
        }
    });


    //Theme 
    const darkRedTheme = {
        ...darkDefaultTheme,
        colors: {
            ...darkDefaultTheme.colors,
            editor: {
                ...darkDefaultTheme.colors,
                background: "#1f2937",
            },
            sideMenu: "#ffffff",
            highlights: darkDefaultTheme.colors.highlights,
        },
    };


    const handleSave = async () =>
    {
        // const note = localStorage.getItem("editorContent");
        console.log(editor.topLevelBlocks);
        console.log("wow", editor.topLevelBlocks.find((block) => block.type === "text"));
        //get the content
        // const content = editor.topLevelBlocks.find((block) => block.type === "paragraph").content[0].text;
        const md = await editor.blocksToMarkdownLossy(editor.topLevelBlocks);
        const preview = markdownToPlainText(md);
        const res = axios.put(`${publicUrl()}/note/${id}`, {
            title: editor.topLevelBlocks.find((block) => block.type === "heading").content[0].text || "Untitled",
            content: editor.topLevelBlocks,
            preview: preview,
        });
        // console.log(note);
        console.log("saved");
        console.log(editor.topLevelBlocks);
    };




    // Renders the editor instance using a React component.
    return (
        content && (
            <main className={`conatiner flex bg-white h-screen dark:bg-gray-800 `}>
                <Sidebar />
                <div className="flex-1 overflow-y-scroll border-l-2 border-gray-200 dark:border-gray-600">
                    {/* <Navbar /> */}
                    <div className="border-b-2  dark:border-gray-600 px-6 py-3 flex justify-between items-center">
                        <h3 className="font-semibold max-w-72">{data.title}</h3>

                        <div className="options flex items-center ">
                            <button onClick={handleSave} className="hover:bg-gray-300/20 hover:text-blue-400 font-semibold cursor-pointer   px-2 py-.5 rounded-md">
                                save
                            </button>
                            <button className="px-2 py-1 hover:bg-gray-300/20 rounded-md">
                                <HiDotsVertical />
                            </button>
                        </div>
                    </div>
                    {/* Heading Section */}
                    <div className="notes px-6 py-4 min-h-[70vh] items-start mt-8]">
                        <div className="flex">
                            <div className="w-10/12 mx-auto py-20 px-4 sm:px-6 lg:px-8 min-h-screen  dark:bg-gray-800 ">
                                <BlockNoteView editor={editor} theme={theme == "dark" ? darkRedTheme : 'light'} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        )
    );
};