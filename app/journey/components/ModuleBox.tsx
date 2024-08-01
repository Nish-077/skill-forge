import React, { useRef, useState, useEffect } from "react";
import {Info} from 'lucide-react';


interface ModuleProps {
    name: String;
    select: boolean;
    start: () => void;
    details: () => void;
    selectHandle: () => void;
}

const Module: React.FC<ModuleProps> = ({ name, select, start, selectHandle, details }) => {
    return (
        <div className="flex flex-col gap-1.5 px-10 py-6 items-center justify-center bg-gray-50 rounded-2xl w-64 h-40 relative m-5 shadow-custom">
            <p className="text-gray-800 text-lg font-semibold text-center">{name}</p>
            <button
                className="w-full bg-blue-500 py-2 px-4 rounded hover:bg-blue-700"
                onClick={select ? selectHandle : start}
            >
                {select ? "Select Module": "Start Module"}
            </button>
            <button
                className="w-full flex justify-center items-center py-2 px-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                onClick={details}
            >
                <Info size={18} className="mr-2"/>Module Details
            </button>
        </div>

    )
};

export default Module;