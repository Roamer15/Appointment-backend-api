export async function emitSocketEvent(io, room, event, data) {
    if (!io || !room) return;
    
    try {
      await io.to(room).timeout(5000).emitWithAck(event, data);
      logger.info(`Event ${event} delivered to ${room}`);
    } catch (err) {
      logger.error(`Event ${event} failed for ${room}:`, {
        error: err.message,
        data: JSON.stringify(data)
      });
    }
  }

