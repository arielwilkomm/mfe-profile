import React, { ReactNode } from "react";

interface ContainerProps {
    children: ReactNode;
    className?: string;
}

export function Container({ children, className = "" }: ContainerProps) {
    return (
        <div
            className={`max-w-3xl w-full mx-auto my-8 p-4 sm:p-8 bg-white rounded-2xl shadow-lg border border-gray-100 ${className}`}
        >
            {children}
        </div>
    );
}
