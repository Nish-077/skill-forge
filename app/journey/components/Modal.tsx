import React, { useEffect } from 'react';

interface ModalProps {
    details: string;
}

const Modal:React.FC<ModalProps> = ({ details }) => {
    useEffect(() => {
        const detailsElement = document.getElementById('details');
        if (detailsElement) {
            detailsElement.innerHTML = details;
        }
    }, [details]);

    return (
        <div className="w-full flex flex-col items-center justify-center">
            <div className='fixed top-1/4 z-10 w-2/5 h-2/5 overflow-auto rounded-xl'
            style={{
                background: "linear-gradient(45deg,#FBCEB1,#DA291C)",
              }}>
                <div className="bg-black my-10p mx-auto p-5 border-solid border-white w-4/5 max-w-xl rounded-xl shadow-custom">
                    <span className="text-white float-right text-3xl font-bold hover:text-amber-700 hover:no-underline hover:cursor-pointer focus:text-white focus:no-underline focus:cursor-pointer close -translate-y-2">&times;</span>
                    <p id="details">Learn Python ZERO TO HERO</p>
                </div>
            </div>
        </div>
    );
};

export default Modal;