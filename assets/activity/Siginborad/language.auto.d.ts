declare interface Siginborad_keys {
}

/**多语言key全集，用于提示 */
declare type language_Siginborad_keys = {
  [key in keyof Siginborad_keys]: LanguageConfigType
}