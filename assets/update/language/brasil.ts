let languageConfig: language_update_keys = {
    FAQ: "FAQ",
    Feedback: "Feedback",
    "If you encounter login problems,\nplease leave a message.": "Se você encontrar problemas de login,\npor favor deixe uma mensagem.",
    "New version found.": "Nova versão encontrada.",
    "Please enter": "Por favor, insir",
    Send: "Enviar",
    "Specialty Support": "Suporte ao cliente",
    "The current version is the latest version.": "A versão atual está atualizada.",
    Update: "Atualizar",
    "VERSION UPDATE": "ATUALIZAÇÃO DE VERSÃO",
    "Your email": "Seu email",
    "Your phone": "Seu telefone",
    "emergency service": "Serviço de emergência",
    updating: "atualizando",
    "version download fail": "falha no download da versão"
}
fw.language.addLanguageConfig({
    languageType: fw.LanguageType.brasil,
    unique: `update`,
    languageConfig: languageConfig,
    npriority: fw.LanguagePriority.Main,
});

export default languageConfig
