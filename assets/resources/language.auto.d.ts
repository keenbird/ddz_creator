declare interface resources_keys {
  "Tip": LanguageConfigType;
  "tip...": LanguageConfigType;
}

/**多语言key全集，用于提示 */
declare type language_resources_keys = {
  [key in keyof resources_keys]: LanguageConfigType
}