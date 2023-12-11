import '../language'

let languageConfig: LanguageConfig = {
    //--大厅通用--began------------------
    [`New Message`]: `Nova Mensagem`,
    [`New message`]: `Nova mensagem`,
    [`new message`]: `nova mensagem`,
    [`TOTAL GET`]: `GANHO TOTAL`,
    [`Add Cash`]: `Recarregar`,
    [`ADD CASH`]: `RECARREGAR`,
    [`Record`]: `Histórico`,
    [`Activity`]: `Atividade`,
    [`Name`]: `Nome`,
    ["Email"]: "Email",
    [`Okey`]: `OK`,
    [`Okay`]: `OK`,
    [`Oops`]: `Aviso`,
    [`Oops!`]: `Aviso!`,
    [`Tip`]: `Dica`,
    ["tip"]: "dica",
    ["tip..."]: "dica...",
    [`Get`]: `Obter`,
    [`get`]: `obter`,
    [`Now`]: `Agora`,
    [`now`]: `agora`,
    [`ALL`]: `Tudo`,
    [`All`]: `Tudo`,
    [`all`]: `tudo`,
    [`Select`]: `Selecionar`,
    [`Confirm`]: `Confirme`,
    ['CASH']: 'DINHEIRO',
    [`Cash`]: `Dinheiro`,
    [`cash`]: `dinheiro`,
    [`WITHDRAW`]: `SAQUE`,
    [`Withdraw`]: `Saque`,
    [`withdraw`]: `saque`,
    [`Recharge`]: `Recargas`,
    [`recharge`]: `recargas`,
    [`Service`]: `Serviço`,
    [`service`]: `serviço`,
    ['BONUS']: 'BÔNUS',
    [`Bonus`]: `Bônus`,
    [`bonus`]: `bônus`,
    [`Other`]: `Outro`,
    [`other`]: `outro`,
    [`GO`]: `IR`,
    [`Go`]: `Ir`,
    [`go`]: `ir`,
    [`Completed`]: `Concluído`,
    [`completed`]: `concluído`,
    [`DAY`]: `DAY`,
    [`TODAY`]: `HOJE`,
    [`Every Day`]: `Iariamente`,
    [`Every day`]: `Iariamente`,
    [`every day`]: `iariamente`,
    [`Login timed out`]: `Tempo limite de login excedido`,
    [`Network connection timed out`]: `Conexão de rede expirada`,
    [`Network connection interrupted, please retry.`]: `Conexão de rede interrompida, por favor tente novamente.`,
    [`number`]: `Número`,
    [`Notice`]: `AVISO`,
    [`time`]: `Tempo`,
    [`state`]: `Estado`,
    [`Please try again later.`]: `Por favor, tente novamente mais tarde.`,
    ["Cancel"]: "Cancelar",
    [`Other Amount`]: `Outro valor`,
    [`Deposit Cash`]: `Depositado`,
    [`Other Amount>>`]: `Outro valor>>`,
    [`DT_hot`]: () => { return fw.BundleConfig.plaza.res[`plaza/gameItems/img/DT_hot_brasil/spriteFrame`]; },
    [`DT_new`]: () => { return fw.BundleConfig.plaza.res[`plaza/gameItems/img/DT_new_brasil/spriteFrame`]; },
    [`plaza_addCash_txt`]: () => { return fw.BundleConfig.plaza.res[`plaza/img/plaza_addCash_txt_brasil/spriteFrame`]; },
    [`plaza_btn_withdraw_txt`]: () => { return fw.BundleConfig.plaza.res[`plaza/img/plaza_btn_withdraw_txt_brasil/spriteFrame`]; },
    [`plaza_btn_service_txt`]: () => { return fw.BundleConfig.plaza.res[`plaza/img/plaza_btn_service_txt_brasil/spriteFrame`]; },
    [`plaza_btn_activity_txt`]: () => { return fw.BundleConfig.plaza.res[`plaza/img/plaza_btn_activity_txt_brasil/spriteFrame`]; },
    [`plaza_more_txt`]: () => { return fw.BundleConfig.plaza.res[`plaza/img/plaza_more_txt_brasil/spriteFrame`]; },
    [`plaza_btn_share_txt`]: () => { return fw.BundleConfig.plaza.res[`plaza/img/plaza_btn_share_txt_brasil/spriteFrame`]; },
    [`plaza_btn_freeCash_txt`]: () => { return fw.BundleConfig.plaza.res[`plaza/img/plaza_btn_freeCash_txt_brasil/spriteFrame`]; },
    //--大厅通用--end--------------------

    //--提现--began------------------
    [`PIX key`]: `Chave PIX`,
    [`Withdraw ID`]: `ID de saque`,
    //--提现--end--------------------

    //--premium--began------------------
    [`premium_tips_num`]: `<color=#8e4936>Recarregue <color=#f93b21>R$%s </color>ou mais para se tornar um jogador<color=#f93b21> VIP</color></color>`,
    [`premium_tips_num_2`]: `<color=#8e4936>Adicione <color=#f93b21>R$%s </color>em dinheiro agora para se tornar um<color=#f93b21> VIP2</color></color>`,
    [`premium_tips_num_3`]: `<color=#8e4936>Recarregue <color=#f93b21>R$%s </color>ou mais para se tornar um jogador<color=#f93b21> VIP1</color></color>`,
    [`premium_tips`]: `<color=#8e4936>Recarregue qualquer valor para se tornar um jogador<color=#f93b21> VIP</color></color>`,
    [`VIP_RECHARGE_TIPS_1`]: `<color=#8e4936>Somente jogadores<color=#f93b21> VIP </color>podem usar esse recurso</color>`,
    [`VIP_RECHARGE_TIPS_2`]: `<color=#8e4936>Continue jogando com dinheiro real, você precisa ser um jogador VIP</color>`,
    [`VIP_RECHARGE_TIPS_3`]: `<color=#8e4936>Apenas jogadores<color=#f93b21> VIP </color> podem fazer apostas múltiplas</color>`,
    [`VIP_RECHARGE_TIPS_4`]: `<color=#8e4936>Apenas jogadores<color=#f93b21> VIP1 </color> podem fazer retiradas</color>`,
    [`VIP_RECHARGE_TIPS_5`]: `<color=#8e4936>Somente jogadores<color=#f93b21> VIP2 </color>podem usar esse recurso</color>`,
    //--premium--end--------------------

    //--系统广播--began------------------
    broadcast_msg_1: "[<color=#72ff00>[1]</color>] ganha [<color=#fff373>JACKPOT</color>] e ganha [<color=#fff373>R$[2]</color>] no [<color=#ff7315>[3]</color>]",
    broadcast_msg_2: "[<color=#72ff00>[1]</color>] ganhou [<color=#fff373>R$[2]</color>] no [<color=#ff7315>[3]</color>]",
    broadcast_msg_3: "[<color=[3]>[1]</color>] Retirou [<color=[4]>R$[2]</color>]",
    broadcast_msg_4: "[<color=#fd8e22>[1]</color>] Recarregar [<color=#fd8e22>R$[2]</color>]",
    //--系统广播--end--------------------

    //plaza
    ["Game"]: "Jogo",
    ["Amount"]: "Quantia",
    ["Min Entry"]: "Entrar",
    ["Online Players"]: "Online",
    ["Join"]: "Jogar",
    ["Free"]: "grátis",
    ["Clean"]: "Limpo",
    ["Dirty"]: "Sujo",
    ["You have no experience today.\nDo you want to play the cash game?"]: "Você não tem experiência hoje.\nQuer jogar cash games?",
    ["You have enough money to go to a higher table and win more money."]: "Você tem dinheiro suficiente para ir para uma mesa mais alta e ganhar mais dinheiro.",
    ["Can't open, please log in the game again. Still can't open, please contact us."]: "Não é possível abrir, faça login no jogo novamente. Ainda não pode abrir, entre em contato conosco.",
    ["The game is under development, please wait"]: "O jogo está em desenvolvimento, aguarde",
    //退游戏弹框
    ["Do you really want to quit the game?"]: "Você realmente quer sair do jogo?",
    ["Earn money"]: "Ganhar dinheiro",
    //停服公告
    ["VERSION UPDATE"]: "ATUALIZAÇÃO DE VERSÃO",
    ["Okay, login later"]: "Ok, faça o login mais tarde",
    //update
    ["New version found."]: "Nova versão encontrada.",
    ["The current version is the latest version."]: "A versão atual está atualizada.",
    ["Update"]: "Atualizar",
    ["updating"]: "atualizando",
    //more
    ["Settings"]: "Configurações",
    ["Check for updates"]: "Verifique se há atualizações",
    ["How to play"]: "Como jogar",
    ["Logout"]: "Sair",
    // 十天任务
    ["The event is about to end"]: "O evento está prestes a terminar",
    ["Collect"]: "Resgatar",
    ["Total recharge R$300"]: "Recarregue R$300",
    ["Day${day}"]: "${day}º dia",
    ["${day} days"]: "${day}º dia",
    ["Win R$300"]: "Ganhe R$300",
    ["log into the game"]: "Entre no jogo",
    ["Unlock tomorrow"]: "Desbloqueie amanhã",
    ["time remaining"]: "tempo restante",
    ["Has ended"]: "Terminou",
    //login
    ["logging in..."]: "logando...",
    ["Getting user data..."]: "Obtendo dados do usuário...",
    ["Enter lobby..."]: "Entre no saguão...",
    ["No such account, please register"]: "Essa conta não existe, registre-se",
    ["wrong password"]: "senha incorreta",
    ["Something went wrong with login, please login again"]: "Algo deu errado com o login, por favor, faça o login novamente",
    //bankruptcy
    ["WEALTH BLESSINHG,PLAY TO WIN MORE"]: "BÊNÇÃO DE RIQUEZA, JOGUE PARA GANHAR MAIS",
    // ["GO"]:"IR",
    ["Get 1 spin for every 3 tasks completed"]: "Ganhe 1 passe a cada 3 tarefas completadas",
    ["Also need ${DF_SYMBOL}${value} to collect"]: "Ainda precisa de ${DF_SYMBOL}${value} para resgatar",
    //刮刮卡
    ["Empty"]: "Vazio",
    ["Login every day can get rewards"]: "Faça login todos os dias para ganhar recompensas",
    ["Recharge to activate 30 cards"]: "Ative 30 cartões com uma recarga",
    ["You can claim the reward once a day, up to 30 times"]: "Você pode resgatar a recompensa uma vez por dia por até 30 dias.",
    //server
    ["Help&Support"]: "Ajuda&Suporte",
    ["Quick links"]: "Links Rápidos",
    ["Select Question"]: "Selecione a pergunta",
    ["<< Others Support"]: "<< Outro suporte",
    ["I still need help >>"]: "Ainda preciso de ajuda >>",
    ["Feedback Type:"]: "Tipo de Feedback:",
    ["Game Bug"]: "Bug do jogo",
    ["Invitation Help"]: "Ajuda do convite",
    ["Other Help"]: "Outra Ajuda",
    ["Please describe your problems"]: "Por favor, descreva seus problemas",
    ["Feedback after 30 seconds"]: "Feedback após 30 segundos",
    ["Please enter your idea or suggestions"]: "Por favor, insira seus pensamentos ou sugestões",
    ["Please select feedback type"]: "Selecione o tipo de feedback",
    ["Feedback successful"]: "Feedback bem-sucedido",
    ["* You will receive our reply in the [Email ] in the lobby.\n\n* Dear Sir, Thank you very much for your feedback, we will reply you within 24 hours."]:
        "*Você receberá nossa resposta no [E-mail] no lobby.\n\n*Prezado Senhor, Muito obrigado pelo seu feedback, responderemos em até 24 horas.",
    ["Specialty Support"]: "Suporte ao cliente",
    ["emergency service"]: "Serviço de emergência",
    ["Your email"]: "Seu email",
    ["Please enter"]: "Por favor, insir",
    ["Your phone"]: "Seu telefone",
    ["Send"]: "Enviar",
    ["FAQ"]: "FAQ",
    ["Feedback"]: "Feedback",
    ["If you encounter login problems,\nplease leave a message."]: "Se você encontrar problemas de login,\npor favor deixe uma mensagem.",
    //商城
    ["Select payment amount"]: "Selecione o valor do pagamento",
    ["Select payment method"]: "Selecione o método de pagamento",
    ["Payment update, please use later"]: "Atualização de pagamento, use mais tarde",
    ["How to Add Cash?"]: "Como Adicionar Dinheiro?",
    ["Get 10% Cash Back on your losing amount."]: "Receba 10% de volta em dinheiro sobre o seu valor perdido.",
    ["Recharge Amount"]: "Valor de Recarga",
    ["Recharge ID"]: "ID da recarga",
    ["Processing"]: "Processando",
    ["Successed"]: "Sucesso",
    ["Failed"]: "Falha",
    ["Pay"]: "Pagar",
    ["<color=#ffffff>Get </color><color=#FDFF7C>${DF_SYMBOL}${num}</color><color=#ffffff> now</color>"]: "<color=#ffffff>Ganhe </color><color=#FDFF7C>${DF_SYMBOL}${num}</color><color=#ffffff> agora</color>",
    ["<color=#ffffff>Valid for </color><color=#FDFF7C>${num}</color><color=#ffffff> days</color>"]: "<color=#ffffff>Válido por: </color><color=#FDFF7C>${num}</color><color=#ffffff> dia</color>",
    ["<color=#ffffff>Get </color><color=#FDFF7C>${DF_SYMBOL}${num}</color><color=#ffffff> every day</color>"]: "<color=#ffffff>Ganhe </color><color=#FDFF7C>${DF_SYMBOL}${num}</color><color=#ffffff> todos os dias</color>",
    ["Your balance is not enough to continue."]: "Seu saldo não é suficiente para continuar.",
    ["You can add cash by one click."]: "Você pode adicionar dinheiro com um clique.",
    //email
    ["Reply"]:"Responder",
    //megaGift
    ["Only one chance,choose any one to buy."]: "Apenas uma chance, escolha qualquer um para comprar.",
    //userinfo
    ["Fill Infomation"]: "Insira os dados",
    ["Verify your Mobile number, Email and Name to Withdraw"]: "Verifique seu número de celular, email e nome para retirar.",
    ["Perfect Information"]: "Dados completos",
    ["Mobile Number"]: "Nº de Celular",
    ["Enter your mobile number"]: "Insira o nº de celular ",
    ["Verification Code"]: "Código de Verificação",
    ["Enter your OTP"]: "Insira o código de verificação",
    ["Get OTP"]: "ENVIAR",
    ["Submit"]: "Enviar",
    ["Mobile"]: "Celular",
    ["Documents"]: "Documentos",
    ["Mobile information has been filled in.  You could login via Phone&OTP later."]: "As informações do celular foram preenchidas. Você pode fazer o login via Phone&OTP mais tarde.",
    ["Note:You could login via Phone&OTP later"]: "Atenção: você pode logar com o nº de celular e código de verificação posteriormente.",
    ["Enter your name"]: "Insira seu nome",
    ["Enter your Email"]: "Insira seu email",
    ["Edit"]: "Trocar",
    ["Deposited"]: "Depositado",
    ["Winnings"]: "Ganhos",
    ["Total Cash"]: "Saldo total",
    ["Bind"]: "Vincular",
    ["Change Avatar"]: "Mudar Avatar",
    ["Please input valid name"]: "Insira um nome válido",
    ["Please input valid email"]: "Insira um e-mail válido",
    ["Please input valid number"]: "Insira um número válido",
    //Withdraw
    ["Total Balance"]: "Total dinheiro",
    ["History"]: "Histórico",
    ["Winnings Cash"]: "Ganhos em Dinheiro",
    ["Withdrawable Balance"]: "Valor de saque disponível",
    ["Withdraw Amount"]: "Valor de saque",
    ["Select Amount"]:"Escolher o valor do saque",
    ["VIP${vipLevel}: You can withdraw ${cashoutCountMax} times a day, and you can withdraw ${cashoutNumMax} per day."]: "VIP${vipLevel}: Você pode fazer ${cashoutCountMax} saques por dia e pode sacar até ${cashoutNumMax} por dia.",
    ["Deposit Cash is the Cash that you've added to yourWallet."]: "Depósito em dinheiro é o dinheiro que você adicionou à sua carteira",
    ["Winnings Cash is the Cash that you have won in cash games.You can use Winnings Cash and Deposit Cash to play for cash games.\n\nNote: You can withdraw your Winnings Cash"]: "Ganhos são o dinheiro que você ganhou em jogos de dinheiro. Você pode usar seus Ganhos com o Dinheiro de Depósito para pagar jogos de dinheiro.\n\nAtenção: você pode retirar seus Ganhos.",
    ["The 'Total Balance' is equal to the 'Withdrawable Balance' plus the 'Deposit Cash'."]: "O 'Saldo Total' é igual ao 'Saldo Disponível para Saque' mais o 'Depósito em Dinheiro'.",
    ["1. Withdrawable balance is the money you win in cash games.\n\n2. When you apply for a withdrawal, the money will usually arrive in your account within 5 minutes.\n\n3. If you have any questions, please practice us in time."]
        : "1.O saldo disponível para saque é o dinheiro que você ganha em jogos em dinheiro.\n\n2.Quando você solicita um saque, o dinheiro geralmente chega à sua conta em até 5 minutos.\n\n3.Se você tiver alguma dúvida, entre em contato conosco imediatamente.",
    //superCashBack
    ["Task\nCashback"]: "Tarefa de\nCashback",
    ["Total Get"]: "Total",
    ["Complete"]: "Completo",
    ["Play\nNow"]: "Jogar\nagora",
    ["complete the previous mission ot unlock"]: "Completa a missão anterior para desbloquear",
    //bankruptcyGift
    ["Your coins do not meet the requirements."]: "Suas moedas não atendem aos requisitos.",
    ["You have reached the purchase limit."]: "Você atingiu o limite de compras.",
    ["This activity has been closed."]: "Esta atividade foi encerrada.",
    ["Configuration error. Please try again later."]: "Erro de configuração. Por favor, tente novamente mais tarde.",
    //freecash
    ["SHARE TO FRIENDS"]: "Compartilhar com os amigos",
    ["Invitation List"]: "Lista de Convites",
    ["<color=#2781a0>You can withdraw!</color>"]: "<color=#2781a0>Você pode retirar!</color>",
    ["<color=#2781a0>Only need </color><color=#ED675A>${DF_SYMBOL1}${num1}</color><color=#2781a0> to withdraw </color><color=#ED675A>${DF_SYMBOL2}${num2}</color>"]: "<color=#2781a0>Falta apenas </color><color=#ED675A>${DF_SYMBOL1}${num1}</color><color=#2781a0> para retirar</color><color=#ED675A>${DF_SYMBOL2}${num2}</color>",
    ["<color=#8beef6>1.You can withdraw when your Activated cash reaches </color><color=#ffe84b>${DF_SYMBOL1}100</color>"]: "<color=#8beef6>1.Você pode retirar quando seu dinheiro ativado atingir </color><color=#ffe84b>${DF_SYMBOL1}100</color>",
    ["<color=#8beef6>2.After your friends play game ,you will randomly get </color><color=#ffe84b>${DF_SYMBOL1}0.01-${DF_SYMBOL2}10</color>"]: "<color=#8beef6>2.Quando seus amigos jogarem o jogo, você ganhará um valor aleatório entre </color><color=#ffe84b>${DF_SYMBOL1}0.01-${DF_SYMBOL2}10</color>",
    ["<color=#8beef6>3.When your friend recharges, you will get </color><color=#ffe84b>${DF_SYMBOL1}0.1-${DF_SYMBOL2}10</color><color=#0fffff>. (only once)</color>"]: "<color=#8beef6>3.Quando seus amigos recarregarem, você ganhará um valor aleatório entre </color><color=#ffe84b>${DF_SYMBOL1}0.1-${DF_SYMBOL2}10</color><color=#0fffff>. (Apenas uma vez.)</color>",
    ["<color=#8beef6>Notice:Only inviting new device users is valid</color>"]: "<color=#8beef6>Aviso: apenas convites de novos dispositivos são válidos.</color>",
    ["share to friends help get bonus"]: "Compartilhe com os amigos para ganhar bônus",
    ["Others"]: "Outros",
    ["Copy link"]: "Copiar link",
    ["Sharing configuration error!"]: "Erro de configuração de compartilhamento!",
    //一套转盘 
    ["<color=#ffffff>Add Cash </color><color=#FDFF2F>${DF_SYMBOL}${num} get 1 spin</color>"]: "<color=#ffffff>Adicione Dinheiro </color><color=#FDFF2F>${DF_SYMBOL}${num} e ganhe 1 giro</color>",
    //三套转盘
    ["SPIN"]: "PASSE",
    ["Spin to get rewards"]: "Gire para obter recompensas",
    ["Spin ${num} times to get all rewards"]: "Gire ${num} vezes para obter todas as recompensas",
    ["${DF_SYMBOL}${num} get 1 spin"]: "${DF_SYMBOL}${num} para ganhar um passe",
    //二套签到转盘
    ["<color=#ffffff>Only </color><color=#FDFF2F>${DF_SYMBOL1}${num} </color><color=#ffffff>to get cash </color><color=#FDFF2F>${DF_SYMBOL2}${cash} </color><color=#ffffff>+bonus </color><color=#FDFF2F>${DF_SYMBOL3}${bonus} </color>"]:
        "<color=#ffffff>Apenas </color><color=#FDFF2F>${DF_SYMBOL1}${num} </color><color=#ffffff>para obter </color><color=#FDFF2F>${DF_SYMBOL2}${cash} </color><color=#ffffff>em dinheiro + bônus de </color><color=#FDFF2F>${DF_SYMBOL3}${bonus} </color>",
    //vip礼包
    ["VIP GIFT"]: "PRESENTE VIP",
    ["<color=#ffffff>1% </color><color=#22936F>of the money you lose will become bonus for you</color>"]: "<color=#ffffff>1% </color><color=#22936F>do dinheiro perdido será convertido em bônus para você</color>",
    ["Daily Bonus"]: "Bônus Diário",
    ["Weekly Bonus"]: "Bônus Semanal",
    ["Monthly Bonus"]: "Bônus Mensal",
    ["Have Bonus"]: "Bônus já obtido",
    ["Get time"]: "Próxima vez",
    ["UP to"]: "Até",
    ["1 point for every ${DF_SYMBOL}1 recharge"]: "1 ponto para cada ${DF_SYMBOL}1 recarregado",
    ["Add Cash to become VIP${lv}"]: "Adicione dinheiro para se tornar VIP${lv}",
    ["You can only bet once ,unless you are an premium player."]: "Você só pode apostar uma vez, a menos que seja um jogador premium.",
    //停服预处理提示
    ["<color=#8e4936>This game will undergo maintenance at <color=#f93b21>${STOP_TIME}</color>. You can play other games during this time.</color>"]:"<color=#8e4936>Este jogo passará por manutenção às <color=#f93b21>${STOP_TIME}</color>. Você pode jogar outros jogos durante esse período.</color>",
}
fw.language.addLanguageConfig({
    languageType: fw.LanguageType.brasil,
    unique: `common_brasil`,
    languageConfig: languageConfig,
    npriority: fw.LanguagePriority.Common,
});

export default languageConfig
