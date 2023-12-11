export const yx = {
    get game() {
        return <type_game_AB>app.game;
    },
    get internet() {
        return <type_internet_AB>app.game.internet;
    },
    get main() {
        return <type_main_AB>app.game.main;
    },
    get config() {
        return <type_config_AB>app.game.config;
    },
    get func() {
        return <type_func_AB>app.game.func;
    },
}