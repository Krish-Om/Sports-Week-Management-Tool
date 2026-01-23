import { io, Socket } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

class SocketManager {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5

  connect() {
    if (this.socket?.connected) {
      return this.socket
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    })

    this.socket.on('connect', () => {
      console.log('✅ Socket.io connected:', this.socket?.id)
      this.reconnectAttempts = 0
    })

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket.io disconnected:', reason)
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket.io connection error:', error)
      this.reconnectAttempts++
    })

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`🔄 Socket.io reconnected after ${attemptNumber} attempts`)
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  getSocket() {
    return this.socket
  }

  // Event listeners
  onScoreUpdate(callback: (data: any) => void) {
    this.socket?.on('scoreUpdate', callback)
  }

  onMatchStatusChange(callback: (data: any) => void) {
    this.socket?.on('matchStatusChange', callback)
  }

  onLeaderboardUpdate(callback: (data: any) => void) {
    this.socket?.on('leaderboardUpdate', callback)
  }

  // Emit events
  emitScoreUpdate(data: any) {
    this.socket?.emit('scoreUpdate', data)
  }

  emitMatchStatusChange(data: any) {
    this.socket?.emit('matchStatusChange', data)
  }

  // Remove listeners
  removeAllListeners() {
    this.socket?.removeAllListeners()
  }
}

export const socketManager = new SocketManager()
export default socketManager
