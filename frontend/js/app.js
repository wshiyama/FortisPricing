import { APP_NAME, VERSION } from "./core/constants.js";
import { AppState } from "./core/state.js";
import { MP } from "./data/materiasPrimas.js";
import { ENG } from "./data/engenharia.js";
import { PERFIS } from "./data/perfis.js";
import { fR, fp } from "./utils/formatters.js";
import { calcularPrecoBase } from "./modules/calculadora.js";

class Application {
    iniciar() {
        console.log(APP_NAME);
        console.log("Versão:", VERSION);
        console.log(AppState);
        console.log("Matérias-primas:", Object.keys(MP).length);
        console.log("Produtos engenharia:", Object.keys(ENG).length);
        console.log("Perfis:", Object.keys(PERFIS).length);

        document
            .getElementById("btnCalcular")
            .addEventListener("click", () => this.calcular());

        this.calcular();
    }

    obterNumero(id) {
        return parseFloat(document.getElementById(id).value) || 0;
    }

    calcular() {
        const resultado = calcularPrecoBase({
            produto: document.getElementById("produto").value,
            valorVenda: this.obterNumero("valorVenda"),
            quantidade: this.obterNumero("quantidade"),
            frete: this.obterNumero("frete"),
            comissao1: this.obterNumero("comissao1"),
            comissao2: this.obterNumero("comissao2"),
            custoAdm: this.obterNumero("custoAdm"),
            volumeBase: this.obterNumero("volumeBase")
        });

        document.getElementById("resultadoCustoMP").textContent = fR(resultado.custoMP);
        document.getElementById("resultadoFrete").textContent = fR(resultado.freteKg);
        document.getElementById("resultadoComissoes").textContent = fR(resultado.comissoes);
        document.getElementById("resultadoAdm").textContent = fR(resultado.admKg);
        document.getElementById("resultadoCustoTotal").textContent = fR(resultado.custoTotal);
        document.getElementById("resultadoMargemKg").textContent = fR(resultado.margemKg);
        document.getElementById("resultadoMargemPct").textContent = fp(resultado.margemPercentual);
    }
}

new Application().iniciar();