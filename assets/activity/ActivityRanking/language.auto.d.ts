declare interface ActivityRanking_keys {
}

/**多语言key全集，用于提示 */
declare type language_ActivityRanking_keys = {
  [key in keyof ActivityRanking_keys]: LanguageConfigType
}