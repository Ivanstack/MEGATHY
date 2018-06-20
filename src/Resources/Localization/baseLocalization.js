import baseLocal from 'react-native-i18n';
import en from './en';
import ar from './ar';

baseLocal.fallbacks = true;

baseLocal.translations = {
  en,
  ar
};

export default baseLocal;
