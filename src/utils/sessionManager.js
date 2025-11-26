// Session Manager untuk Restaurant Ordering System
// Menggunakan table number + customer name sebagai session identifier

const SESSION_KEY = 'restaurant_session';
const SESSION_EXPIRY = 24 * 60 * 60 * 1000; // 24 jam dalam milliseconds

/**
 * Generate session ID dari table number dan customer name
 * Format: table_{tableNumber}_{timestamp}_{randomString}
 */
export const generateSessionId = (tableNumber, customerName) => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `table_${tableNumber}_${timestamp}_${random}`;
};

/**
 * Simpan session data ke localStorage
 */
export const saveSession = (sessionData) => {
  const session = {
    ...sessionData,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_EXPIRY,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
};

/**
 * Ambil session data dari localStorage
 * Return null jika expired atau tidak ada
 */
export const getSession = () => {
  try {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return null;

    const session = JSON.parse(sessionStr);
    
    // Check expiry
    if (Date.now() > session.expiresAt) {
      clearSession();
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error reading session:', error);
    return null;
  }
};

/**
 * Update session data (partial update)
 */
export const updateSession = (updates) => {
  const currentSession = getSession();
  if (!currentSession) return null;

  const updatedSession = {
    ...currentSession,
    ...updates,
  };
  
  localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));
  return updatedSession;
};

/**
 * Clear session dari localStorage
 */
export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

/**
 * Check apakah user sudah punya active session
 */
export const hasActiveSession = () => {
  const session = getSession();
  return session !== null;
};

/**
 * Get session ID untuk dikirim ke backend
 */
export const getSessionId = () => {
  const session = getSession();
  return session?.sessionId || null;
};

/**
 * Start new session untuk customer
 */
export const startSession = (tableNumber, customerName, customerPhone = '') => {
  const sessionId = generateSessionId(tableNumber, customerName);
  
  const sessionData = {
    sessionId,
    tableNumber,
    customerName,
    customerPhone,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_EXPIRY,
  };

  return saveSession(sessionData);
};

/**
 * Format time remaining untuk display
 */
export const getSessionTimeRemaining = () => {
  const session = getSession();
  if (!session) return null;

  const remaining = session.expiresAt - Date.now();
  if (remaining <= 0) return null;

  const hours = Math.floor(remaining / (60 * 60 * 1000));
  const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

  return { hours, minutes, milliseconds: remaining };
};

export default {
  generateSessionId,
  saveSession,
  getSession,
  updateSession,
  clearSession,
  hasActiveSession,
  getSessionId,
  startSession,
  getSessionTimeRemaining,
};
