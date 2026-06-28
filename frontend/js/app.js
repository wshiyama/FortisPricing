import { fmt, fR, fp, uid } from "./utils/formatters.js";
import { APP_NAME, VERSION } from './core/constants.js';
import { AppState } from './core/state.js';
import { MP } from './data/materiasPrimas.js';
import { ENG } from './data/engenharia.js';
import { PERFIS } from './data/perfis.js';

class Application {
    iniciar() {
        console.log(APP_NAME);
        console.log('Versão:', VERSION);
        console.log('Estado:', AppState);
        console.log('Matérias-primas:', Object.keys(MP).length);
        console.log('Produtos engenharia:', Object.keys(ENG).length);
        console.log('Perfis:', Object.keys(PERFIS).length);
    }
}

new Application().iniciar();
console.log("Teste moeda:", fR(25.5));
console.log("Teste percentual:", fp(0.125));
console.log("Teste ID:", uid());