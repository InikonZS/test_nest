import React from "react";
import './Collapser.css';

interface ICollapserProps extends React.HTMLAttributes<HTMLDivElement>{
    collapsed: boolean;
}

export const Collapser = ({collapsed, children, className, ...htmlAttributes}: React.PropsWithChildren<ICollapserProps>)=>{
    return <div className={`commonCollapser ${className || ''} ${collapsed ? 'commonCollapser--collapsed': ''}`} {...htmlAttributes}>
        <div className="commonCollapser_content">
            {children}
        </div>
    </div>
}