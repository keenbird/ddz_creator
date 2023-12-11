let languageConfig: language_resources_keys = {
    Tip: "Dica",
    "tip...": "dica..."
}
fw.language.addLanguageConfig({
    languageType: fw.LanguageType.brasil,
    unique: `resources`,
    languageConfig: languageConfig,
    npriority: fw.LanguagePriority.Main,
});

export default languageConfig
