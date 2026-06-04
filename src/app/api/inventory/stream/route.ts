import { inventoryEmitter } from '@/lib/eventEmitter';

// Evita que Next.js intente pre-renderizar este endpoint en build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// ─── SSE Stream — Inventario en Tiempo Real ──────────────────────────────────
// Los clientes se conectan a este endpoint y reciben actualizaciones
// en tiempo real cuando el inventario cambia.
export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Enviar "ping" de conexión inicial
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'connected', timestamp: Date.now() })}\n\n`)
      );

      // Suscribirse a eventos del emitter
      const unsubscribe = inventoryEmitter.subscribe((data: string) => {
        try {
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        } catch {
          unsubscribe();
        }
      });

      // Ping cada 30s para mantener la conexión viva
      const pingInterval = setInterval(() => {
        try {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'ping', timestamp: Date.now() })}\n\n`)
          );
        } catch {
          clearInterval(pingInterval);
          unsubscribe();
        }
      }, 30000);

      // Cleanup al cerrar la conexión
      return () => {
        clearInterval(pingInterval);
        unsubscribe();
      };
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
