let languageConfig: language_login_keys = {
    "Enter lobby...": "",
    "Getting user data...": "",
    Login: "",
    "No such account, please register": "",
    "OTP sending failed, please try again": "",
    "OTP sent successfully": "",
    "Okay, login later": "",
    "Please input valid number": "",
    "Something went wrong with login, please login again": "",
    "VERSION UPDATE": "",
    "logging in...": "",
    "wrong password": "",
    "Please enter verification code": "",
    Send: ""
}

fw.language.addLanguageConfig({
    languageType: fw.LanguageType.en,
    unique: `login`,
    languageConfig: languageConfig,
    npriority: fw.LanguagePriority.Main,
});

export default languageConfig
