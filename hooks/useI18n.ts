import { useMemo, useState } from 'react';
import i18n from '../services/i18n';

export default function useI18n() {
  const [locale, setLocaleState] = useState(i18n.locale);

  const t = useMemo(() => i18n.t.bind(i18n), [locale]);

  const setLocale = (newLocale: string) => {
    i18n.locale = newLocale;
    setLocaleState(newLocale);
  };

  return { t, locale, setLocale };
}