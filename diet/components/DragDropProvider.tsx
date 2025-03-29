"use client"
import { createContext, useState } from 'react'

export const DragDropContext = createContext({ contextId: 0 })

export function DragDropProvider({ children }: { children: React.ReactNode }) {
    const [contextId] = useState(0)
    return (
        <DragDropContext.Provider value={{ contextId }}>
    {children}
    </DragDropContext.Provider>
)
}