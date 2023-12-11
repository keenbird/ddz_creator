let languageConfig: language_update_keys = {
    FAQ: null,
    Feedback: null,
    "If you encounter login problems,\nplease leave a message.": null,
    "New version found.": null,
    "Please enter": null,
    Send: null,
    "Specialty Support": null,
    "The current version is the latest version.": null,
    Update: null,
    "VERSION UPDATE": null,
    "Your email": null,
    "Your phone": null,
    "emergency service": null,
    updating: null,
    "version download fail": null
}
fw.language.addLanguageConfig({
    languageType: fw.LanguageType.en,
    unique: `update`,
    languageConfig: languageConfig,
    npriority: fw.LanguagePriority.Main,
});

export default languageConfig
