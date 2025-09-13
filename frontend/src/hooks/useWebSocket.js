// src/hooks/useWebSocket.js
import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

export const useWebSocket = (url, options = {}) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(url);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('🛰️ Connected to SYZYGY 2.0 System');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('🔴 Disconnected from SYZYGY 2.0 System');
      setIsConnected(false);
    });

    if (options.onMessage) {
      newSocket.on('message', options.onMessage);
    }

    return () => {
      newSocket.close();
    };
  }, [url, options.onMessage]);

  const sendMessage = useCallback((message) => {
    if (socket && isConnected) {
      socket.emit('message', message);
    }
  }, [socket, isConnected]);

  return { isConnected, sendMessage };
};
