import { MP } from "../data/materiasPrimas.js";
import { ENG } from "../data/engenharia.js";

export function calcularCustoMateriaPrima(produto) {
    const engenharia = ENG[produto];

    if (!engenharia) return 0;

    return engenharia.comps.reduce((total, componente) => {
        const materiaPrima = MP[componente.code];

        if (!materiaPrima) return total;

        return total + materiaPrima.preco * componente.qty;
    }, 0);
}

export function calcularPrecoBase({
    produto,
    valorVenda,
    quantidade,
    frete = 0,
    comissao1 = 0,
    comissao2 = 0,
    custoAdm = 0,
    volumeBase = 1
}) {
    const custoMP = calcularCustoMateriaPrima(produto);
    const freteKg = quantidade > 0 ? frete / quantidade : 0;
    const comissoes = valorVenda * ((comissao1 + comissao2) / 100);
    const admKg = volumeBase > 0 ? custoAdm / volumeBase : 0;

    const custoTotal = custoMP + freteKg + comissoes + admKg;
    const margemKg = valorVenda - custoTotal;
    const margemPercentual = valorVenda > 0 ? margemKg / valorVenda : 0;

    return {
        custoMP,
        freteKg,
        comissoes,
        admKg,
        custoTotal,
        margemKg,
        margemPercentual
    };
}