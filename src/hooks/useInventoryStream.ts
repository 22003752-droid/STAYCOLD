'use client';

import { useEffect, useState, useCallback } from 'react';

export type InventoryEvent =
  | { type: 'connected'; timestamp: number }
  | { type: 'ping'; timestamp: number }
  | { type: 'stock_updated'; payload: { id: number; stock: number; name: string }; timestamp: number }
  | { type: 'product_added'; payload: { product: any }; timestamp: number }
  | { type: 'product_deleted'; payload: { id: number }; timestamp: number }
  | { type: 'product_updated'; payload: { product: any }; timestamp: number };

interface UseInventoryStreamOptions {
  onStockUpdate?: (data: { id: number; stock: number; name: string }) => void;
  onProductAdded?: (product: any) => void;
  onProductDeleted?: (id: number) => void;
  onProductUpdated?: (product: any) => void;
}

export function useInventoryStream(options: UseInventoryStreamOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<InventoryEvent | null>(null);

  const { onStockUpdate, onProductAdded, onProductDeleted, onProductUpdated } = options;

  const connect = useCallback(() => {
    const eventSource = new EventSource('/api/inventory/stream');

    eventSource.onopen = () => setIsConnected(true);

    eventSource.onmessage = (e) => {
      try {
        const event: InventoryEvent = JSON.parse(e.data);
        setLastEvent(event);

        switch (event.type) {
          case 'stock_updated':
            onStockUpdate?.(event.payload);
            break;
          case 'product_added':
            onProductAdded?.(event.payload.product);
            break;
          case 'product_deleted':
            onProductDeleted?.(event.payload.id);
            break;
          case 'product_updated':
            onProductUpdated?.(event.payload.product);
            break;
        }
      } catch {
        // Ignorar errores de parseo (pings, etc.)
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      eventSource.close();
      // Reconectar después de 5 segundos
      setTimeout(connect, 5000);
    };

    return eventSource;
  }, [onStockUpdate, onProductAdded, onProductDeleted, onProductUpdated]);

  useEffect(() => {
    const eventSource = connect();
    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, [connect]);

  return { isConnected, lastEvent };
}
