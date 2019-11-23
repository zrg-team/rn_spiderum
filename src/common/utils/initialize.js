import I18n from 'i18n-js'
import { setUserLanguage } from '../actions/common'
import { DEFAULT_LANGUAGE } from '../../configs'

I18n.defaultLocale = DEFAULT_LANGUAGE
I18n.fallbacks = true
I18n.translations = {
  en: require('../../assets/lang/en.json')
}

export default async function (dispatch, locale = null) {
  try {
    const appLocale = locale || DEFAULT_LANGUAGE
    dispatch && dispatch(setUserLanguage(appLocale))
  } catch (error) {
    dispatch && dispatch(setUserLanguage(locale || DEFAULT_LANGUAGE))
  }
}
