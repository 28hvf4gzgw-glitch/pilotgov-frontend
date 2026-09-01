import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PilotColumn, pilotColumns as fallbackColumns } from '@/lib/data';

interface PilotBoardContextType {
  columns: PilotColumn[];
  setColumns: React.Dispatch<React.SetStateAction<PilotColumn[]>>;
}

const PilotBoardContext = createContext<PilotBoardContextType | undefined>(undefined);

export function PilotBoardProvider({ children }: { children: ReactNode }) {
  const [columns, setColumns] = useState<PilotColumn[]>(fallbackColumns);

  return (
    <PilotBoardContext.Provider value={{ columns, setColumns }}>
      {children}
    </PilotBoardContext.Provider>
  );
}

export function usePilotBoard() {
  return useContext(PilotBoardContext);
}
