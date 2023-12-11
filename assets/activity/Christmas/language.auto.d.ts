declare interface Christmas_keys {
}

/**多语言key全集，用于提示 */
declare type language_Christmas_keys = {
  [key in keyof Christmas_keys]: LanguageConfigType
}