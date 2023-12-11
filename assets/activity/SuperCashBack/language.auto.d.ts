declare interface SuperCashBack_keys {
}

/**多语言key全集，用于提示 */
declare type language_SuperCashBack_keys = {
  [key in keyof SuperCashBack_keys]: LanguageConfigType
}