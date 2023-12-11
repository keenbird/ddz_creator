declare interface Wheel_keys {
}

/**多语言key全集，用于提示 */
declare type language_Wheel_keys = {
  [key in keyof Wheel_keys]: LanguageConfigType
}