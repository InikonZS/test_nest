import React from "react";
import { FC } from "react";

export interface IGenericStyledProps extends React.HTMLAttributes<HTMLDivElement>{}

export const genericStyled: (baseClassName: string)=>FC<IGenericStyledProps> = (baseClassName)=> ({children, className, ...htmlAttributes})=>{
    return <div className={`${baseClassName} ${className || ''}`} {...htmlAttributes}>{children}</div>
}