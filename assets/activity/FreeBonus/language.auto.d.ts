declare interface FreeBonus_keys {
}

/**多语言key全集，用于提示 */
declare type language_FreeBonus_keys = {
  [key in keyof FreeBonus_keys]: LanguageConfigType
}