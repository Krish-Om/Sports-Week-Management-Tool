import React, { useEffect, useState } from 'react'
import { socketManager } from '../config/socket'

interface SocketContextType {
  isConnected: boolean
  socket: ReturnType<typeof socketManager.getSocket>
}

const SocketContext = React.createContext<SocketContextType | undefined>(undefined)

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socket = socketManager.connect()

    socket.on('connect', () => {
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    return () => {
      socketManager.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider value={{ isConnected, socket: socketManager.getSocket() }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  const context = React.useContext(SocketContext)
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}
