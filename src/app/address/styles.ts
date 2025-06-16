import styled from '@emotion/styled';
import { Container } from '@/components/Container';

export const containerTable = styled(Container)`
  max-width: 1200px !important;
  width: 100%;
`;

export const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  position: relative;
`;

export const Title = styled.h1`
  flex: 0 1 auto;
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  margin: 0 auto;
  position: absolute;
  left: 0;
  right: 0;
  pointer-events: none;
`;

export const Button = styled.button<{
  color?: string;
  variant?: 'primary' | 'back' | 'action' | 'danger' | 'warning' | 'neutral' | undefined;
}>`
  min-width: 140px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  color: ${({ variant }) => {
    if (variant === 'primary') return '#fff';
    if (variant === 'back') return '#2563eb';
    if (variant === 'danger') return '#fff';
    if (variant === 'warning') return '#fff';
    if (variant === 'neutral') return '#111827';
    return '#16a34a';
  }};
  background: ${({ variant }) => {
    if (variant === 'primary') return '#16a34a';
    if (variant === 'back' || variant === 'action') return 'none';
    if (variant === 'danger') return '#dc2626';
    if (variant === 'warning') return '#d97706';
    if (variant === 'neutral') return '#e5e7eb';
    return '#16a34a';
  }};
  text-decoration: ${({ variant }) =>
    variant === 'back' || variant === 'action' ? 'underline' : 'none'};
  box-shadow: ${({ variant }) =>
    variant === 'back' || variant === 'action' ? 'none' : '0 2px 8px rgba(0,0,0,0.04)'};
  font-weight: 500;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
  margin-right: ${({ variant }) => (variant === 'action' ? '8px' : '0')};
  padding: ${({ variant }) => (variant === 'action' ? '0' : '8px 16px')};
  &:hover {
    background: ${({ variant }) => {
      if (variant === 'primary') return '#15803d';
      if (variant === 'back' || variant === 'action') return 'none';
      if (variant === 'danger') return '#b91c1c';
      if (variant === 'warning') return '#b45309';
      if (variant === 'neutral') return '#d1d5db';
      return '#15803d';
    }};
    color: ${({ variant }) => {
      if (variant === 'primary') return '#fff';
      if (variant === 'back') return '#1d4ed8';
      if (variant === 'danger' || variant === 'warning') return '#fff';
      if (variant === 'neutral') return '#111827';
      return '#16a34a';
    }};
  }
`;

export const Table = styled.table`
  min-width: 700px;
  width: 100%;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  font-size: 0.95rem;
  overflow: hidden;
`;

export const Thead = styled.thead`
  background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 100%);
`;

export const Th = styled.th`
  border-bottom: 1px solid #e5e7eb;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
`;

export const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: middle;
`;

export const ModalBg = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Modal = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.12);
  padding: 32px 24px 24px 24px;
  width: 100%;
  max-width: 1200px;
  position: relative;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6b7280;
  cursor: pointer;
`;

export const Link = styled.a`
  color: #2563eb;
  text-decoration: underline;
  &:hover {
    color: #1d4ed8;
  }
`;

export const FlexEnd = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

export const TopBar = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 16px auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ErrorMsg = styled.div`
  color: #dc2626;
`;

export const TableWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  overflow-x: auto;
  margin: 0 auto 24px auto;
  display: flex;
  justify-content: center;
`;

export const TdEmpty = styled.td`
  text-align: center;
  color: #6b7280;
`;

export const ActionTd = styled.td`
  white-space: nowrap;
  display: flex;
  justify-content: center;
  gap: 8px;
`;

export const TableRow = styled.tr<{ even?: boolean }>`
  background: ${({ even }) => (even ? '#f9fafb' : '#fff')};
`;

export const ModalTitle = styled.h2`
  font-weight: 600;
  margin-bottom: 8px;
  text-align: center;
`;

export const ModalTitleDelete = styled.h2`
  font-weight: 600;
  margin-bottom: 16px;
  text-align: center;
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;
