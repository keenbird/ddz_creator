declare interface ScratchCard_keys {
}

/**多语言key全集，用于提示 */
declare type language_ScratchCard_keys = {
  [key in keyof ScratchCard_keys]: LanguageConfigType
}