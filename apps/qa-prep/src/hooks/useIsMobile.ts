import { useEffect, useState } from 'react';

const MOBILE_QUERY = '(max-width: 639px)';

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia(MOBILE_QUERY).matches
      : false
  );

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    function onChange() {
      setIsMobile(mq.matches);
    }
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}
