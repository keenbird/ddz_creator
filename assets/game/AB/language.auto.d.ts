declare interface AB_keys {
}

/**多语言key全集，用于提示 */
declare type language_AB_keys = {
  [key in keyof AB_keys]: LanguageConfigType
}