export const yx = {
    get game() {
		return <type_game_Landlord>app.game;
    },
    get internet() {
		return <type_internet_Landlord>app.game.internet;
    },
    get main() {
		return <type_main_Landlord>app.game.main;
    },
    get config() {
		return <type_config_Landlord>app.game.config;
    },
    get func() {
		return <type_func_Landlord>app.game.func;
    },
}