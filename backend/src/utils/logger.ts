type Meta = Record<string, unknown>

const write = (level: string, message: string, meta: Meta = {}) => {
  console.log(JSON.stringify({ timestamp: new Date().toISOString(), level, message, ...meta }))
}

export const logger = {
  info: (message: string, meta?: Meta) => write('info', message, meta),
  warn: (message: string, meta?: Meta) => write('warn', message, meta),
  error: (message: string, meta?: Meta) => write('error', message, meta),
}
