import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

import en from '../locales/en.json';
import zhCN from '../locales/zh-CN.json';
import ko from '../locales/ko.json';
import ja from '../locales/ja.json';

const i18n = new I18n({
  en,
  'zh-CN': zhCN,
  ko,
  ja,
});

// Set the locale once at the beginning of your app.
const locales = Localization.getLocales();
const primaryLocale = locales[0]?.languageTag || 'en';
i18n.locale = primaryLocale;
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export default i18n;