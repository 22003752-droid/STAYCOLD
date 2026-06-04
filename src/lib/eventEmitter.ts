// ─── Gestor de Eventos SSE para Inventario en Tiempo Real ───────────────────
// Permite que el servidor notifique a todos los clientes conectados
// cuando hay cambios en el inventario.

type EventListener = (data: string) => void;

class InventoryEventEmitter {
  private listeners: Set<EventListener> = new Set();

  subscribe(listener: EventListener): () => void {
    this.listeners.add(listener);
    // Retorna función para desuscribirse
    return () => {
      this.listeners.delete(listener);
    };
  }

  emit(eventType: string, payload: object) {
    const data = JSON.stringify({ type: eventType, payload, timestamp: Date.now() });
    this.listeners.forEach((listener) => {
      try {
        listener(data);
      } catch {
        this.listeners.delete(listener);
      }
    });
  }

  get listenerCount() {
    return this.listeners.size;
  }
}

// Singleton global (persiste entre requests en el mismo proceso del servidor)
const globalForEmitter = global as typeof globalThis & {
  inventoryEmitter?: InventoryEventEmitter;
};

if (!globalForEmitter.inventoryEmitter) {
  globalForEmitter.inventoryEmitter = new InventoryEventEmitter();
}

export const inventoryEmitter = globalForEmitter.inventoryEmitter;
