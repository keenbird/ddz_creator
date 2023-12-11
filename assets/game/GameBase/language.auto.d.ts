declare interface GameBase_keys {
  "ChipMaskRich": LanguageConfigType;
}

/**多语言key全集，用于提示 */
declare type language_GameBase_keys = {
  [key in keyof GameBase_keys]: LanguageConfigType
}