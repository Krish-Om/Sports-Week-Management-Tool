import React from 'react'
import { useSocket } from '../../contexts/SocketContext'
import { WifiOff } from 'lucide-react'

export const ConnectionBanner: React.FC = () => {
  const { isConnected } = useSocket()

  if (isConnected) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-500 text-white py-2 px-4 flex items-center justify-center gap-2 z-50 animate-pulse">
      <WifiOff size={20} />
      <span className="font-medium">Connection Lost - Attempting to reconnect...</span>
    </div>
  )
}
