declare interface login_keys {
  "Enter lobby...": LanguageConfigType;
  "Getting user data...": LanguageConfigType;
  "Login": LanguageConfigType;
  "No such account, please register": LanguageConfigType;
  "OTP sending failed, please try again": LanguageConfigType;
  "OTP sent successfully": LanguageConfigType;
  "Okay, login later": LanguageConfigType;
  "Please enter verification code": LanguageConfigType;
  "Please input valid number": LanguageConfigType;
  "Something went wrong with login, please login again": LanguageConfigType;
  "VERSION UPDATE": LanguageConfigType;
  "logging in...": LanguageConfigType;
  "wrong password": LanguageConfigType;
  "Send": LanguageConfigType;
}

/**多语言key全集，用于提示 */
declare type language_login_keys = {
  [key in keyof login_keys]: LanguageConfigType
}