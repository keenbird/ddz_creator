declare interface TenDayTask_keys {
}

/**多语言key全集，用于提示 */
declare type language_TenDayTask_keys = {
  [key in keyof TenDayTask_keys]: LanguageConfigType
}