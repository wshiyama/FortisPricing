import { APP_NAME, VERSION } from "./core/constants.js";
import { AppState } from "./core/state.js";
import { MP } from "./data/materiasPrimas.js";
import { ENG } from "./data/engenharia.js";
import { PERFIS } from "./data/perfis.js";
import { fmt, fR, fp, uid } from "./utils/formatters.js";
import { calcularCustoMateriaPrima, calcularPrecoBase } from "./modules/calculadora.js";

class Application {
    iniciar() {
        console.log(APP_NAME);
        console.log("Versão:", VERSION);
        console.log(AppState);

        console.log("Matérias-primas:", Object.keys(MP).length);
        console.log("Produtos engenharia:", Object.keys(ENG).length);
        console.log("Perfis:", Object.keys(PERFIS).length);

        console.log("Teste moeda:", fR(25.5));
        console.log("Teste percentual:", fp(0.125));
        console.log("Teste ID:", uid());

        console.log(
            "Custo MP MICROFIBRA 12mm SM:",
            calcularCustoMateriaPrima("MICROFIBRA 12mm SM")
        );

        console.log(
            "Teste cálculo:",
            calcularPrecoBase({
                produto: "MICROFIBRA 12mm SM",
                valorVenda: 20,
                quantidade: 1000,
                frete: 500,
                comissao1: 3,
                comissao2: 0,
                custoAdm: 280000,
                volumeBase: 50000
            })
        );
    }
}

new Application().iniciar();