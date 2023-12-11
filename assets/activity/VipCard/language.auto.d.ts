declare interface VipCard_keys {
}

/**多语言key全集，用于提示 */
declare type language_VipCard_keys = {
  [key in keyof VipCard_keys]: LanguageConfigType
}