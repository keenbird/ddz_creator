declare interface update_keys {
  "FAQ": LanguageConfigType;
  "Feedback": LanguageConfigType;
  "If you encounter login problems,\nplease leave a message.": LanguageConfigType;
  "New version found.": LanguageConfigType;
  "Please enter": LanguageConfigType;
  "Send": LanguageConfigType;
  "Specialty Support": LanguageConfigType;
  "The current version is the latest version.": LanguageConfigType;
  "Update": LanguageConfigType;
  "VERSION UPDATE": LanguageConfigType;
  "Your email": LanguageConfigType;
  "Your phone": LanguageConfigType;
  "emergency service": LanguageConfigType;
  "updating": LanguageConfigType;
  "version download fail": LanguageConfigType;
}

/**多语言key全集，用于提示 */
declare type language_update_keys = {
  [key in keyof update_keys]: LanguageConfigType
}