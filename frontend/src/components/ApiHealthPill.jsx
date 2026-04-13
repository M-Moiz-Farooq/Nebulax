import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ApiHealthPill() {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    let alive = true;
    async function ping() {
      try {
        const r = await fetch('/api/health', { cache: 'no-store' });
        const j = await r.json();
        if (!alive) return;
        setStatus(r.ok && j.success ? 'live' : 'warn');
      } catch {
        if (alive) setStatus('down');
      }
    }
    ping();
    const id = setInterval(ping, 20000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  const label =
    status === 'live' ? 'API online' : status === 'checking' ? 'Checking API…' : 'API unreachable';

  return (
    <motion.div
      className={`api-pill api-pill--${status}`}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      title="Polls GET /api/health every 20s"
    >
      <span className="api-pill-dot" aria-hidden />
      <span>{label}</span>
    </motion.div>
  );
}
