let languageConfig: language_login_keys = {
    "Enter lobby...": "Entre no saguão...",
    "Getting user data...": "Obtendo dados do usuário...",
    Login: "Login",
    "No such account, please register": "Essa conta não existe, registre-se",
    "OTP sending failed, please try again": "Falha no envio de OTP, por favor tente novamente",
    "OTP sent successfully": "OTP enviado com sucesso",
    "Okay, login later": "Ok, faça o login mais tarde",
    "Please input valid number": "Insira um número válido",
    "Something went wrong with login, please login again": "Algo deu errado no login, por favor faça login novamente",
    "VERSION UPDATE": "ATUALIZAÇÃO DE VERSÃO",
    "logging in...": "logando...",
    "wrong password": "senha incorreta",
    "Please enter verification code": "Por favor, digite o código de verificação.",
    Send: "ENVIAR"
}

fw.language.addLanguageConfig({
    languageType: fw.LanguageType.brasil,
    unique: `login`,
    languageConfig: languageConfig,
    npriority: fw.LanguagePriority.Main,
});

export default languageConfig
