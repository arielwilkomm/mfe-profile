import styled from '@emotion/styled';

export const Input = styled.input`
  border: 1px solid #d1d5db;
  padding: 8px;
  width: 100%;
  border-radius: 4px;
  margin-bottom: 8px;
  font-size: 1rem;
`;

export const ErrorMsg = styled.div`
  color: #dc2626;
  font-size: 0.95rem;
  margin-bottom: 8px;
`;

export const Button = styled.button`
  background: #16a34a;
  color: #fff;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 8px;
  &:hover {
    background: #15803d;
  }
`;
