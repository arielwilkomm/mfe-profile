"use client";

import styled from "styled-components";
import React, { ReactNode } from "react";

const StyledContainer = styled.div`
  max-width: 768px;
  width: 100%;
  margin: 32px auto;
  padding: 16px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid #f3f4f6;
  @media (min-width: 640px) {
    padding: 32px;
  }
`;

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
