import React from "react";

import { Icons } from "../assets/svg";

const LoaderUI: React.FC = () => {
    return (
        <div className="loader">
            <svg>
                <use href={`${Icons}#icon-cw`}></use> 
            </svg>
        </div>
    );
};  

export default LoaderUI;