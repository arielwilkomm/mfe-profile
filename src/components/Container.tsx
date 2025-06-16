"use client";

import { StyledContainer } from "./Container/styles";
import React, { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className = "" }: ContainerProps) {
  return (
    <StyledContainer className={className}>
      {children}
    </StyledContainer>
  );
}
