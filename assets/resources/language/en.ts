let languageConfig: language_resources_keys = {
    Tip: null,
    "tip...": null
}
fw.language.addLanguageConfig({
    languageType: fw.LanguageType.en,
    unique: `resources`,
    languageConfig: languageConfig,
    npriority: fw.LanguagePriority.Main,
});

export default languageConfig
