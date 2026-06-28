export class StorageService {

    static salvar(chave, valor) {
        localStorage.setItem(chave, JSON.stringify(valor));
    }

    static carregar(chave, padrao = null) {

        const valor = localStorage.getItem(chave);

        return valor
            ? JSON.parse(valor)
            : padrao;

    }

}