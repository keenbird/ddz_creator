declare interface NewWheel_keys {
}

/**多语言key全集，用于提示 */
declare type language_NewWheel_keys = {
  [key in keyof NewWheel_keys]: LanguageConfigType
}