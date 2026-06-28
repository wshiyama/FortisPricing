export function fmt(v, n = 2) {
    if (v == null || isNaN(v)) return "—";

    return v.toLocaleString("pt-BR", {
        minimumFractionDigits: n,
        maximumFractionDigits: n
    });
}

export function fp(v) {
    return isNaN(v) ? "—" : (v * 100).toFixed(2) + "%";
}

export function fR(v, n = 2) {
    return "R$ " + fmt(v, n);
}

export function uid() {
    return "FT" + Date.now().toString(36).toUpperCase();
}

export function addD(ds, days) {
    if (!ds || !days) return null;

    const d = new Date(ds + "T12:00:00");
    d.setDate(d.getDate() + parseInt(days));

    return d;
}

export function dstr(d) {
    return d ? d.toLocaleDateString("pt-BR") : "—";
}