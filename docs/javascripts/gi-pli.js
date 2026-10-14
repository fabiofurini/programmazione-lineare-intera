/* Laboratorio di «Programmazione lineare intera / Integer Linear Programming»: le quattro app.
 *
 *   pli-punti-interi   punti interi e rilassamento lineare (esempio delle automobili + altri problemi):
 *                      poliedro, punti interi, ottimo continuo, ottimo intero, retta di livello, divario
 *   pli-involucro      disuguaglianze valide e involucro convesso (automobili): si aggiungono una alla volta
 *   pli-bb             branch-and-bound passo per passo (automobili): regole per la variabile, il nodo e
 *                      l'ordine dei figli; albero, partizione della regione, LB e UB
 *   pli-gomory         tagli di Gomory sul piano (automobili): un taglio per iterazione; regole per la
 *                      riga del taglio (anche tutti i tagli violati, un giro per passo) e per
 *                      l'inserimento (primitivo o debole)
 *
 * Il motore è interattivi.js; gli helper comuni (frazioni esatte, poliedri in R^2, «Esegui») sono in
 * gi-comune.js (window.GI_MIP, lo stesso del laboratorio di Modellazione MIP); i numeri del
 * branch-and-bound e dei tagli stanno in gi-pli-dati.js (window.GI_PLI), calcolati dal motore esatto
 * motore_oc con python/genera_dati_lab.py: la regola del salto, la numerazione dei nodi nell'ordine di
 * risoluzione e la regola di parità dei tagli sono quelle della guida di stile §6.
 * Notazione delle dispense: \tilde{x} ottimo del rilassamento, \bar{x} incumbent, z(LP), z(ILP), LB, UB.
 */
(function () {
  "use strict";
  const GI = window.GI, M = window.GI_MIP;
  const T = GI.T;
  window.GI_RICETTE = window.GI_RICETTE || {};
  const { Q, Qv, Qtex, Qadd, Qmul, coppiaQ, coppia, lin, tinta } = M;

  // ================================================================ problemi
  // max c'x, A x <= b, x >= 0 intero: il catalogo comune del laboratorio (gi-pli-dati.js, generato da
  // python/genera_dati_lab.py), con gli stessi nomi in tutte le app: «Automobili», «Problema A», … .
  // Le app dei punti interi usano tutto il catalogo (i due vincoli si muovono con i cursori b_1, b_2);
  // il B&B e i tagli solo i problemi precalcolati (D0.problemi). Numeri verificati con python
  // (motore_oc, enumerazione e Gurobi): auto z(LP) = 31/2 in (7/2; 5/2), z(ILP) = 14 in (4; 1);
  // A 214/5 in (24/5; 2), 40 in (2; 4); B 195/4 in (345/64; 5/8), 43 in (2; 3); C 165/4 in (9/4; 15/4),
  // 40 in (0; 5); D 23/5 in (9/5; 14/5), 4; E 63/2 in (9/4; 9/2), 30 in (3; 3).
  const CATALOGO = window.GI_PLI.catalogo;
  const ESEMPI = Object.fromEntries(Object.entries(CATALOGO).map(([k, p]) => [k, { c: p.c, V: p.A.map((a, i) => ({ a, b: p.b[i] })) }]));
  /** i pulsanti «Problema» con i nomi del catalogo (chiavi: tutte, o solo quelle date) */
  const VOCI = (chiavi = Object.keys(CATALOGO)) => Object.fromEntries(chiavi.map((k) => [k, { etichetta: T(CATALOGO[k].it, CATALOGO[k].en) }]));
  // intervallo dei cursori b_i: dal 60 % al 130 % circa del valore di partenza
  const rangeB = (b) => [Math.max(1, Math.round(b * 0.6)), Math.round(b * 1.3)];

  // ================================================================ aritmetica esatta
  const cmpQ = (a, b) => Math.sign(a.n * b.d - b.n * a.d);
  const valore = (c, x) => Qadd(Qmul(Q(c[0]), x[0]), Qmul(Q(c[1]), x[1]));
  /** max c'x su {x : V} in modo esatto, enumerando i vertici; a parità di valore
   *  il vertice con x_1 minore (poi x_2 minore). null se la regione è vuota. */
  const risolvi = (V, c) => {
    let best = null, bz = null;
    for (const p of M.verticiEsatti(V)) {
      const z = valore(c, p);
      const s = best ? cmpQ(z, bz) : 1;
      if (s > 0 || (s === 0 && (cmpQ(p[0], best[0]) < 0 || (cmpQ(p[0], best[0]) === 0 && cmpQ(p[1], best[1]) < 0)))) { best = p; bz = z; }
    }
    return best ? { x: best, z: bz } : null;
  };
  /** frazione come testo semplice (per le scritte sul grafico): 63/2, −3 */
  const qt = (q) => (q.n < 0 ? "−" : "") + (q.d === 1 ? Math.abs(q.n) : Math.abs(q.n) + "/" + q.d);
  const SUB = ["₁", "₂"];
  const vincoliTex = (V) => V.map((v) => `${lin(v.a)} \\le ${v.b}`);
  // il problema in una riga (o in due, se la finestra è stretta)
  const problemaTex = (ob, vincoli) => {
    const con = `\\text{${T("con", "s.t.")}}`, dom = "\\vet{x} \\in \\Z^2_+";
    return window.innerWidth < 700
      ? `\\begin{array}{l}\\max\\ ${ob},\\ \\ ${dom} \\\\ ${vincoli.join(",\\ ")}\\end{array}`
      : `\\max\\ ${ob}\\quad ${con}\\quad ${vincoli.join(",\\ ")},\\ ${dom}`;
  };

  // segmento della retta a'x = b dentro il riquadro [x0, x1] x [y0, y1] (o null)
  const segmento = (a, b, x0, x1, y0, y1) => {
    const P = [];
    if (a[1] !== 0) for (const x of [x0, x1]) { const y = (b - a[0] * x) / a[1]; if (y >= y0 - 1e-9 && y <= y1 + 1e-9) P.push([x, y]); }
    if (a[0] !== 0) for (const y of [y0, y1]) { const x = (b - a[1] * y) / a[0]; if (x >= x0 - 1e-9 && x <= x1 + 1e-9) P.push([x, y]); }
    if (P.length < 2) return null;
    let lo = P[0], hi = P[0];
    const u = (p) => -a[1] * p[0] + a[0] * p[1];
    for (const p of P) { if (u(p) < u(lo)) lo = p; if (u(p) > u(hi)) hi = p; }
    return [lo, hi];
  };
  // il tratto della retta c'x = z dentro il poligono P (o null)
  const trattoRetta = (P, c, z) => {
    const pts = [], f = (p) => c[0] * p[0] + c[1] * p[1] - z, tol = 1e-9 * (1 + Math.abs(z));
    for (let k = 0; k < P.length; k++) {
      const p = P[k], q = P[(k + 1) % P.length], fp = f(p), fq = f(q);
      if (Math.abs(fp) <= tol) pts.push(p);
      if ((fp < -tol && fq > tol) || (fp > tol && fq < -tol)) {
        const t = fp / (fp - fq);
        pts.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]);
      }
    }
    if (!pts.length) return null;
    const u = (p) => -c[1] * p[0] + c[0] * p[1];
    let lo = pts[0], hi = pts[0];
    for (const p of pts) { if (u(p) < u(lo)) lo = p; if (u(p) > u(hi)) hi = p; }
    return [lo, hi];
  };
  // sposta il riquadro delle letture subito dopo l'elemento dopo (le letture restano in vista
  // senza scorrere la colonna dei controlli)
  const lettureDopo = (st, dopo) => {
    const l = st.el.querySelector(".gi-letture");
    if (l && dopo && dopo.nextElementSibling !== l) dopo.after(l);
  };
  // La board segue le dimensioni del suo contenitore (il motore le cambia per riempire la
  // finestra): il ridimensionamento automatico di JSXGraph è spento (opzioni ADATTA) e qui la
  // tela si rimisura e la ricetta ridisegna. Il contenitore resta lo stesso quando la board si
  // ricrea, quindi l'osservatore è uno solo; il callback arriva al più una volta per fotogramma.
  const ADATTA = Object.assign({}, M.OPZ, { resize: { enabled: false } });
  const seguiDimensioni = (board, st) => {
    const el = board.containerObj;
    if (window.ResizeObserver && el && !el._mipRO) {
      el._mipRO = new ResizeObserver(() => { if (document.body.contains(el)) st.aggiorna(); });
      el._mipRO.observe(el);
    }
  };
  /** rimisura la tela sul contenitore e restituisce [larghezza, altezza] in pixel */
  const misura = (board) => {
    const el = board.containerObj, W = el.clientWidth || board.canvasWidth, H = el.clientHeight || board.canvasHeight;
    if (Math.abs(board.canvasWidth - W) > 1 || Math.abs(board.canvasHeight - H) > 1) board.resizeContainer(W, H, true, true);
    return [W, H];
  };
  // il pulsante «Azzera» del motore: dopo il suo clic, i cursori tornano ai valori dell'esempio
  const dopoAzzera = (st, fz) => {
    const az = [...st.el.querySelectorAll("button.gi-btn")].find((b) => b.textContent.trim() === T("Azzera", "Reset"));
    if (az && !az._mipA) { az._mipA = true; az.addEventListener("click", fz); }
  };

  // ================================================================
  // 1. Punti interi e rilassamento continuo
  // ================================================================
  // il problema corrente (esempio + cursori)
  const problemaPI = (st) => {
    const E = ESEMPI[st.chiave()], p = st.p();
    const V = E.V.map((v, i) => (i < 2 ? { a: v.a, b: Math.round(i ? p.b2 : p.b1) } : v));
    return { c: [Math.round(p.c1), Math.round(p.c2)], V, V0: V.concat(M.nonneg()) };
  };
  // riquadro che contiene il poliedro anche con i b_i al massimo
  const cacheBox = {};
  const boxDi = (k) => {
    if (cacheBox[k]) return cacheBox[k];
    const E = ESEMPI[k];
    const V = E.V.map((v, i) => (i < 2 ? { a: v.a, b: rangeB(v.b)[1] } : v)).concat(M.nonneg());
    const P = M.poligono(V, 1e3);
    const X = Math.max(4, ...P.map((q) => q[0])), Y = Math.max(4, ...P.map((q) => q[1]));
    return (cacheBox[k] = { X: Math.ceil(X), Y: Math.ceil(Y) });
  };
  // tutti i calcoli dell'app (memorizzati per firma)
  const analisiPI = (st) => {
    const P = problemaPI(st), firma = st.chiave() + "|" + P.c + "|" + P.V.map((v) => v.b);
    if (st.dati.an && st.dati.an.firma === firma) return st.dati.an;
    const B = boxDi(st.chiave());
    const lp = risolvi(P.V0, P.c);
    const interi = M.puntiInteri(P.V0, 0, B.X + 1, 0, B.Y + 1);
    let ip = null;
    for (const q of interi) { const z = P.c[0] * q[0] + P.c[1] * q[1]; if (!ip || z > ip.z) ip = { x: q, z }; }
    const tondo = lp ? lp.x.map((q) => Math.round(Qv(q))) : null;
    const violati = tondo ? P.V0.map((v, i) => [v, i]).filter(([v]) => v.a[0] * tondo[0] + v.a[1] * tondo[1] > v.b) : [];
    const poli = M.poligono(P.V0, 1e3);
    const vals = poli.map((q) => P.c[0] * q[0] + P.c[1] * q[1]);
    return (st.dati.an = { firma, P, B, lp, interi, ip, tondo, violati, poli, zmin: Math.min(0, ...vals) });
  };
  // il cursore z: l'intervallo segue il problema (da min c'x sul poliedro a z(LP) + 2)
  const preparaZ = (st, A) => {
    const i = M.inputDi(st, "z");
    if (!i || !A.lp) return;
    const lo = Math.floor(A.zmin), hi = Math.ceil(Qv(A.lp.z)) + 2;
    if (+i.min !== lo) i.min = lo;
    if (+i.max !== hi) i.max = hi;
    if (+i.value > hi) i.value = hi;
    if (+i.value < lo) i.value = lo;
  };
  const valoriEsempio = (st) => {
    const E = ESEMPI[st.chiave()], k = st.chiave();
    const imposta = (nome, v, lo, hi) => {
      const i = M.inputDi(st, nome);
      if (!i) return;
      if (lo !== undefined) { i.min = lo; i.max = hi; }
      i.value = v;
    };
    imposta("c_1", E.c[0]); imposta("c_2", E.c[1]);
    imposta("b_1", E.V[0].b, ...rangeB(E.V[0].b));
    imposta("b_2", E.V[1].b, ...rangeB(E.V[1].b));
    st.dati.es = k;
    st.dati.an = null;
    const A = analisiPI(st);
    preparaZ(st, A);
    const iz = M.inputDi(st, "z");
    if (iz && A.ip) iz.value = A.ip.z;
  };

  window.GI_RICETTE["pli-punti-interi"] = {
    titolo: T("Punti interi e rilassamento", "Integer points and relaxation"),
    funzioni: VOCI(),
    etichettaFunzioni: T("Problema", "Problem"),
    parametri: [
      { k: "z", nome: "z", min: 0, max: 10, step: 0.25, val: 4, colore: "a", cifre: 2,
        descr: T("livello della retta \\(\\vet{c}'\\vet{x} = z\\) (▶ la fa scorrere)", "level of the line \\(\\vet{c}'\\vet{x} = z\\) (▶ slides it)") },
      { k: "c1", nome: "c_1", min: -4, max: 9, step: 1, val: 1, colore: "b", cifre: 0,
        descr: T("coefficiente di \\(x_1\\) nell'obiettivo", "coefficient of \\(x_1\\) in the objective") },
      { k: "c2", nome: "c_2", min: -4, max: 9, step: 1, val: 1, colore: "b", cifre: 0,
        descr: T("coefficiente di \\(x_2\\) nell'obiettivo", "coefficient of \\(x_2\\) in the objective") },
      { k: "b1", nome: "b_1", min: 1, max: 20, step: 1, val: 12, colore: "e", cifre: 0,
        descr: T("termine noto del vincolo 1: sposta la retta", "right-hand side of constraint 1: moves the line") },
      { k: "b2", nome: "b_2", min: 1, max: 20, step: 1, val: 10, colore: "e", cifre: 0,
        descr: T("termine noto del vincolo 2", "right-hand side of constraint 2") },
    ],
    // stessa unità sui due assi: la vista si adatta alla board in aggiorna (M.adatta)
    vista: (k) => { const B = boxDi(k); return [-0.7, B.Y + 0.7, B.X + 0.7, -0.7]; },
    opzioniBoard: ADATTA,
    legenda: (st) => {
      const C = M.COL(st);
      return [
        [C.rosso, T("rilassamento continuo", "continuous relaxation"), "pieno"],
        [C.verde, T("punti interi ammissibili", "feasible integer points"), "punto"],
        [C.verde, T("involucro dei punti interi", "hull of the integer points"), "dashed"],
        [C.blu, T("\\(\\tilde{\\vet{x}}\\) ottimo continuo", "\\(\\tilde{\\vet{x}}\\) continuous optimum"), "punto"],
        [C.viola, T("\\(\\tilde{\\vet{x}}\\) arrotondato", "\\(\\tilde{\\vet{x}}\\) rounded"), "punto"],
        [st.colore("a"), T("retta \\(\\vet{c}'\\vet{x} = z\\)", "line \\(\\vet{c}'\\vet{x} = z\\)"), ""],
      ];
    },
    monta(board, st) {
      if (st.dati.es !== st.chiave()) valoriEsempio(st);
      dopoAzzera(st, () => { st.dati.es = null; valoriEsempio(st); st.aggiorna(); });
      lettureDopo(st, M.ctrlDi(st, "z"));
      seguiDimensioni(board, st);
      const C = M.COL(st), A = () => analisiPI(st);
      // la retta di livello e il suo tratto dentro il poliedro (seguono il cursore z)
      board.create("line", [() => -st.p().z, () => A().P.c[0], () => A().P.c[1]], {
        strokeColor: st.colore("a"), strokeWidth: 2, fixed: true, highlight: false, withLabel: false,
        visible: () => A().P.c[0] !== 0 || A().P.c[1] !== 0,
      });
      GI.spezzata(board, () => trattoRetta(A().poli, A().P.c, st.p().z) || [], {
        strokeColor: st.colore("a"), strokeWidth: 6, strokeOpacity: 0.8, fixed: true,
      });
      // i punti interi ammissibili che stanno sulla retta
      GI.nuvola(board, 40, () => {
        const a = A(), z = st.p().z;
        return a.interi.filter((q) => Math.abs(a.P.c[0] * q[0] + a.P.c[1] * q[1] - z) < 1e-9);
      }, { size: 8, fillColor: "none", fillOpacity: 0, strokeColor: st.colore("a"), strokeWidth: 2.5 });
      void C;
    },
    aggiorna(board, st) {
      const A = analisiPI(st), C = M.COL(st), B0 = boxDi(st.chiave());
      preparaZ(st, A);
      misura(board);
      M.adatta(board, -0.7, B0.Y + 0.7, B0.X + 0.7, -0.7);
      M.ridisegna(board, st, [A.firma, M.scuro()].join("|"), (crea) => {
        const { P, B } = A, c = P.c;
        // le rette dei vincoli (1 e 2 dei colori dei loro cursori, gli altri grigi)
        P.V.forEach((v, i) => {
          const s = segmento(v.a, v.b, -0.9, B.X + 0.9, -0.9, B.Y + 0.9);
          if (s) crea("curve", [[s[0][0], s[1][0]], [s[0][1], s[1][1]]], {
            strokeColor: i < 2 ? st.colore("e") : C.grigio, strokeWidth: i < 2 ? 1.8 : 1.3,
            dash: 2, fixed: true, highlight: false,
          });
        });
        if (A.poli.length) M.area(crea, A.poli, { strokeColor: C.rosso, fillColor: C.rosso, fillOpacity: 0.16 });
        // l'involucro convesso dei punti interi ammissibili
        const H = M.involucro(A.interi);
        if (H.length >= 3) M.area(crea, H, { strokeColor: C.verde, strokeWidth: 2, dash: 2, fillColor: C.verde, fillOpacity: 0.1 });
        else if (H.length === 2) M.linea(crea, H[0][0], H[0][1], H[1][0], H[1][1], { strokeColor: C.verde, strokeWidth: 2, dash: 2 });
        // il reticolo: punti interi fuori in grigio, dentro in verde
        for (let i = 0; i <= B.X; i++) for (let j = 0; j <= B.Y; j++) {
          const dentro = P.V0.every((v) => v.a[0] * i + v.a[1] * j <= v.b);
          if (!dentro) M.pallino(crea, i, j, { size: 1.5, fillColor: C.grigio, strokeColor: C.grigio });
        }
        for (const q of A.interi) M.pallino(crea, q[0], q[1], { size: 3.5, fillColor: C.verde, strokeColor: C.verde });
        // la direzione di c, nell'origine
        const nc = Math.hypot(c[0], c[1]);
        if (nc) crea("arrow", [[0, 0], [(c[0] / nc) * 1.2, (c[1] / nc) * 1.2]], {
          strokeColor: C.blu, strokeWidth: 3, fixed: true, highlight: false, withLabel: false, lastArrow: { type: 2, size: 5 },
        });
        // l'arrotondamento di x~, l'ottimo intero e l'ottimo continuo
        if (A.tondo && !(A.lp.x[0].d === 1 && A.lp.x[1].d === 1)) {
          M.linea(crea, Qv(A.lp.x[0]), Qv(A.lp.x[1]), A.tondo[0], A.tondo[1], { strokeColor: C.viola, strokeWidth: 1.5, dash: 2 });
          M.pallino(crea, A.tondo[0], A.tondo[1], { face: "x", size: 6, strokeWidth: 3, strokeColor: C.viola, fillColor: C.viola });
        }
        if (A.ip) M.pallino(crea, A.ip.x[0], A.ip.x[1], { size: 5, fillColor: C.verde, strokeColor: C.testo, strokeWidth: 2 });
        if (A.lp) M.pallino(crea, Qv(A.lp.x[0]), Qv(A.lp.x[1]), { size: 6, fillColor: C.blu, strokeColor: C.blu });
      });
    },
    formula(p, st) {
      const A = analisiPI(st), c = A.P.c;
      const t = (v, k, x, primo) => `${v < 0 ? "-" : primo ? "" : "+"}${st.col(k, Math.abs(v))}\\,${x}`;
      const righe = A.P.V.map((v, i) => {
        const s = `${lin(v.a)} \\le ${i < 2 ? st.col(i ? "b2" : "b1", v.b) : v.b}`;
        return s;
      });
      return problemaTex(`${t(c[0], "c1", "x_1", true)} ${t(c[1], "c2", "x_2", false)}`, righe);
    },
    letture(p, st) {
      const A = analisiPI(st), C = M.COL(st), c = A.P.c;
      if (!A.lp) return T("Il poliedro è vuoto.", "The polyhedron is empty.");
      if (!c[0] && !c[1]) return T("Con \\(\\vet{c} = \\vet{0}\\) tutti i punti hanno valore \\(0\\): scegli un \\(c_1\\) o un \\(c_2\\) diverso da zero.",
        "With \\(\\vet{c} = \\vet{0}\\) every point has value \\(0\\): pick a nonzero \\(c_1\\) or \\(c_2\\).");
      const zl = A.lp.z, righe = [];
      righe.push(T(`${tinta(C.blu, "Rilassamento continuo")}: \\(\\tilde{\\vet{x}} = ${coppiaQ(A.lp.x)}\\), \\(z(\\LP) = ${Qtex(zl)}\\)`,
        `${tinta(C.blu, "Continuous relaxation")}: \\(\\tilde{\\vet{x}} = ${coppiaQ(A.lp.x)}\\), \\(z(\\LP) = ${Qtex(zl)}\\)`));
      if (!A.ip) { righe.push(T("Nessun punto intero ammissibile: il problema intero è inammissibile.", "No feasible integer point: the integer problem is infeasible.")); return righe.join("<br>"); }
      const n = A.interi.length, nott = A.interi.filter((q) => c[0] * q[0] + c[1] * q[1] === A.ip.z).length;
      righe.push(T(`${tinta(C.verde, "Ottimo intero")}: \\(\\vet{x}^* = ${coppia(A.ip.x[0], A.ip.x[1])}\\), \\(z(\\ILP) = ${A.ip.z}\\) (${n} ${n === 1 ? "punto intero ammissibile" : "punti interi ammissibili"}${nott > 1 ? `, ${nott} ottimi` : ""})`,
        `${tinta(C.verde, "Integer optimum")}: \\(\\vet{x}^* = ${coppia(A.ip.x[0], A.ip.x[1])}\\), \\(z(\\ILP) = ${A.ip.z}\\) (${n} feasible integer ${n === 1 ? "point" : "points"}${nott > 1 ? `, ${nott} optimal` : ""})`));
      const gap = M.Qsub(zl, Q(A.ip.z));
      righe.push(gap.n === 0
        ? T(`<strong>Bound</strong>: \\(z(\\ILP) = z(\\LP) = ${A.ip.z}\\): il rilassamento chiude il problema, divario \\(0\\).`,
          `<strong>Bound</strong>: \\(z(\\ILP) = z(\\LP) = ${A.ip.z}\\): the relaxation closes the problem, gap \\(0\\).`)
        : T(`<strong>Bound</strong>: \\(z(\\ILP) = ${A.ip.z} \\le z(\\LP) = ${Qtex(zl)}\\); divario \\(z(\\LP) - z(\\ILP) = ${Qtex(gap)}\\).`,
          `<strong>Bound</strong>: \\(z(\\ILP) = ${A.ip.z} \\le z(\\LP) = ${Qtex(zl)}\\); gap \\(z(\\LP) - z(\\ILP) = ${Qtex(gap)}\\).`));
      // arrotondare
      const intero = A.lp.x[0].d === 1 && A.lp.x[1].d === 1;
      if (intero) {
        righe.push(T("\\(\\tilde{\\vet{x}}\\) è già intero: è anche l'ottimo intero.", "\\(\\tilde{\\vet{x}}\\) is already integer: it is also the integer optimum."));
      } else {
        const r = A.tondo, rt = `\\(${coppia(r[0], r[1])}\\)`, zr = c[0] * r[0] + c[1] * r[1];
        let s;
        if (A.violati.length) {
          const [v] = A.violati[0], lhs = v.a[0] * r[0] + v.a[1] * r[1];
          s = T(`${rt} ${tinta(C.viola, "non è ammissibile")}: \\(${lin(v.a)} = ${lhs} > ${v.b}\\).`, `${rt} ${tinta(C.viola, "is infeasible")}: \\(${lin(v.a)} = ${lhs} > ${v.b}\\).`);
        } else if (zr < A.ip.z) {
          s = T(`${rt} è ammissibile ma ${tinta(C.viola, "non è ottimo")}: vale \\(${zr} < ${A.ip.z}\\).`, `${rt} is feasible but ${tinta(C.viola, "not optimal")}: its value is \\(${zr} < ${A.ip.z}\\).`);
        } else {
          s = T(`${rt} è ammissibile e ottimo: qui arrotondare funziona.`, `${rt} is feasible and optimal: here rounding works.`);
        }
        righe.push(T(`<strong>Arrotondare</strong> \\(\\tilde{\\vet{x}}\\) dà `, `<strong>Rounding</strong> \\(\\tilde{\\vet{x}}\\) gives `) + s);
      }
      // la retta di livello
      const z = p.z, zs = GI.num(z, 2), zc = st.colore("a");
      const sopra = A.interi.filter((q) => c[0] * q[0] + c[1] * q[1] >= z - 1e-9).length;
      let r;
      if (z > Qv(zl) + 1e-9) r = T(`la retta non incontra più il poliedro: \\(z > z(\\LP)\\).`, `the line no longer meets the polyhedron: \\(z > z(\\LP)\\).`);
      else if (z > A.ip.z + 1e-9) r = T(`la retta taglia ancora il poliedro, ma nessun punto intero ha \\(\\vet{c}'\\vet{x} \\ge ${zs}\\): siamo nel divario, \\(z(\\ILP) < z \\le z(\\LP)\\).`,
        `the line still cuts the polyhedron, but no integer point has \\(\\vet{c}'\\vet{x} \\ge ${zs}\\): we are in the gap, \\(z(\\ILP) < z \\le z(\\LP)\\).`);
      else r = T(`${sopra} ${sopra === 1 ? "punto intero ammissibile ha" : "punti interi ammissibili hanno"} \\(\\vet{c}'\\vet{x} \\ge ${zs}\\).`,
        `${sopra} feasible integer ${sopra === 1 ? "point has" : "points have"} \\(\\vet{c}'\\vet{x} \\ge ${zs}\\).`);
      righe.push(`${tinta(zc, T("Retta", "Line"))} \\(z = ${zs}\\): ` + r);
      return righe.join("<br>");
    },
    domanda: T("Nell'esempio delle automobili premi ▶ su \\(z\\): fra quali valori la retta taglia il poliedro senza toccare punti interi? Arrotonda \\(\\tilde{\\vet{x}}\\): il punto è ammissibile? Muovi \\(b_1\\) e \\(b_2\\): riesci ad annullare il divario?",
      "In the car example press ▶ on \\(z\\): for which values does the line cut the polyhedron without touching integer points? Round \\(\\tilde{\\vet{x}}\\): is the point feasible? Move \\(b_1\\) and \\(b_2\\): can you bring the gap to zero?"),
  };


  // ================================================================
  // Strumenti comuni alle tre app sull'esempio delle automobili
  // ================================================================
  const D0 = window.GI_PLI;                       // dati calcolati da motore_oc (gi-pli-dati.js)
  const AUTO = ESEMPI.auto;                       // max 3x1 + 2x2, 10x1 + 4x2 <= 45, 4x1 + 14x2 <= 49
  const AUTO_V0 = AUTO.V.concat(M.nonneg());
  const AUTO_INTERI = M.puntiInteri(AUTO_V0, 0, 6, 0, 6);          // i 16 punti interi ammissibili
  const AUTO_HULL = M.involucro(AUTO_INTERI);                      // i 6 vertici dell'involucro
  const Qs = M.Qs;
  const num = (q) => (typeof q === "string" ? Qs(q) : q);
  const tq = (q) => Qtex(num(q));                                  // frazione (stringa o {n,d}) in TeX
  const pq = (x) => coppiaQ([num(x[0]), num(x[1])]);               // (a; b) / (a, b) in TeX
  const floorQ = (q) => M.Qfloor(num(q));
  /** frazione in testo semplice per le scritte sulla board: 31/2 */
  const qtx = (q) => qt(num(q));
  const mr = (x) => `\\(${x}\\)`;                                  // formula in linea
  const zLP = "z(\\LP)", zILP = "z(\\ILP)";
  /** vista della board con la stessa unità sui due assi (la board si ridimensiona: M.adatta) */
  const vistaAuto = [-0.5, 3.95, 5.2, -0.5];
  // ---- i problemi del B&B e dei tagli (gi-pli-dati.js: auto, A, B, C del catalogo), scelti con i pulsanti «Problema»
  const cacheP = {};
  const probDi = (k) => {
    if (cacheP[k]) return cacheP[k];
    const R = D0.problemi[k] || D0.problemi.auto;
    const V = R.A.map((a, i) => ({ a, b: R.b[i] })), V0 = V.concat(M.nonneg());
    const Pg = M.poligono(V0, 1e3);
    const X = Math.ceil(Math.max(...Pg.map((q) => q[0])) - 1e-9), Y = Math.ceil(Math.max(...Pg.map((q) => q[1])) - 1e-9);
    const INTERI = M.puntiInteri(V0, 0, X + 1, 0, Y + 1);
    const ob = lin(R.c), vinc = V.map((v) => `${lin(v.a)} \\le ${v.b}`);
    return (cacheP[k] = { R, V, V0, X, Y, INTERI, HULL: M.involucro(INTERI), ob, vinc,
      vista: [-0.5, Y + 0.45, X + 0.7, -0.5] });
  };
  const VOCI_P = () => VOCI(Object.keys(D0.problemi));
  /** al cambio di problema (il motore ricrea la board e richiama monta): k torna a 0 */
  const nuovoProblema = (st) => {
    const k = st.chiave();
    if (st.dati.pb !== undefined && st.dati.pb !== k) {
      M.ferma(st);
      const i = M.inputDi(st, "k");
      if (i) i.value = 0;
    }
    st.dati.pb = k;
  };
  // ---- il dizionario nella notazione delle note: x_i = b̄_i - sum ā_ij x_j, z = z̄ + sum c̄_j x_j
  let dizAperto = window.innerWidth >= 860;
  document.addEventListener("toggle", (e) => { if (e.target.classList && e.target.classList.contains("pli-diz")) dizAperto = e.target.open; }, true);
  const xv = (j) => (String(j).length === 1 ? `x_${j}` : `x_{${j}}`);
  const termine = (q, j) => {
    if (q.n === 0) return "";
    const a = { n: Math.abs(q.n), d: q.d }, c = a.n === 1 && a.d === 1 ? "" : Qtex(a) + "\\,";
    return (q.n < 0 ? "- " : "+ ") + c + xv(j);
  };
  /** [TeX del dizionario compatto d, TeX di B e N]; col: {indice o "z": colore} per evidenziare righe */
  const dizTex = (d, col = {}) => {
    const riga = (testa, b, coeff, c) => {
      const celle = [testa, "=", tq(b)].concat(coeff.map((q, i) => termine(q, d.N[i])));
      return celle.map((x) => (c && x ? `\\color{${c}}{${x}}` : x)).join(" & ");
    };
    const righe = d.B.map((i, r) => riga(xv(i), d.r[r][0], d.r[r].slice(1).map((q) => { const v = num(q); return { n: -v.n, d: v.d }; }), col[i]));
    righe.push(riga("z", d.z[0], d.z.slice(1).map(num), col.z));
    return [`\\left\\{\\begin{array}{rcr${"l".repeat(d.N.length)}}${righe.join(" \\\\[3pt] ")}\\end{array}\\right.`,
      `\\pazocal{B} = \\{${d.B.join(", ")}\\},\\ \\pazocal{N} = \\{${d.N.join(", ")}\\}`];
  };
  /** il riquadro richiudibile «Dizionario» (aperto su schermi larghi), che scorre da solo */
  const dizBox = (parti) => `<details class="pli-diz" style="margin:.4em 0"${dizAperto ? " open" : ""}><summary style="cursor:pointer;font-weight:700">${T("Dizionario", "Dictionary")}</summary>` +
    `<div style="overflow:auto;max-height:38vh;font-size:.92em">${parti.map(([tit, [arr, ins]]) => `<div style="margin:.35em 0 .1em">${tit}</div><div style="white-space:nowrap">\\(\\displaystyle ${arr}\\)</div><div style="white-space:nowrap">\\(${ins}\\)</div>`).join("")}</div></details>`;
  /** Su schermi larghi il dizionario sta in un riquadro richiudibile sopra l'angolo destro del disegno
   *  (la ricetta gli lascia libera quella striscia, vedi `riserva`); sul telefono resta nelle letture.
   *  Restituisce la larghezza in pixel da lasciare libera a destra (0 se non c'è il riquadro). */
  const schermoLargo = () => window.innerWidth >= 860;
  let dizFAperto = true;
  const dizFlottante = (st, board, parti) => {
    const be = board.containerObj, sx = be.parentElement;
    let box = sx.querySelector(".pli-diz-f");
    if (!schermoLargo() || !parti) { if (box) box.remove(); return 0; }
    if (!box) {
      sx.style.position = "relative";
      box = GI.h("div", { class: "pli-diz-f", style: "position:absolute;z-index:3;right:8px;overflow:auto;font-size:.82em;box-sizing:border-box;" +
        "background:var(--md-default-bg-color);border:1px solid var(--gi-line);border-radius:8px;padding:.2em .6em .4em;box-shadow:0 2px 8px rgba(0,0,0,.12)" });
      box.addEventListener("click", (e) => { if (e.target.closest(".pli-diz-testa")) { dizFAperto = !dizFAperto; box._html = null; st.aggiorna(); } });
      if (window.ResizeObserver) new ResizeObserver(() => { if (document.body.contains(box) && Math.abs((box._w || 0) - box.offsetWidth) > 2) st.aggiorna(); }).observe(box);
      sx.append(box);
    }
    box.style.top = be.offsetTop + 8 + "px";
    box.style.maxHeight = Math.max(120, be.clientHeight - 16) + "px";
    box.style.maxWidth = Math.round(Math.min(620, be.clientWidth * 0.55)) + "px";
    const testa = `<button class="pli-diz-testa" style="all:unset;cursor:pointer;font-weight:700;display:block;padding:.15em 0">${dizFAperto ? "▾" : "▸"} ${T("Dizionario", "Dictionary")}</button>`;
    const html = testa + (dizFAperto ? `<div style="display:flex;flex-wrap:wrap;gap:.3em 1.4em">` +
      parti.map(([tit, [arr, ins]]) => `<div><div style="margin:.2em 0 .1em;max-width:17em">${tit}</div><div style="white-space:nowrap">\\(\\displaystyle ${arr}\\)</div><div style="white-space:nowrap">\\(${ins}\\)</div></div>`).join("") + "</div>" : "");
    if (box._html !== html) { box._html = html; box.innerHTML = GI.mj(html); GI.typeset(box); }
    box._w = box.offsetWidth;
    return dizFAperto ? box._w + 16 : 0;
  };
  /** come M.adatta, ma il disegno sta nella parte sinistra della board, lasciando `riserva` pixel a destra */
  const adattaRiserva = (board, x0, y1, x1, y0, riserva) => {
    const W = board.canvasWidth || 400, H = board.canvasHeight || 300, Wl = Math.max(W * 0.45, W - riserva);
    const u = Math.min(Wl / (x1 - x0), H / (y1 - y0)), cy = (y0 + y1) / 2;
    const sin = x0 - (Wl / u - (x1 - x0)) / 2;
    board.setBoundingBox([sin, cy + H / u / 2, sin + W / u, cy - H / u / 2], false);
  };
  /** un menu a tendina nel pannello dei controlli (le regole di un algoritmo) */
  const menu = (st, etichetta, chiave, voci, dopo) => {
    const D = st.dati;
    const lab = GI.h("label", { class: "pli-regola", style: "display:inline-flex;align-items:center;gap:.35em;margin:0 .8em .3em 0;font-size:.95em" },
      `<span>${etichetta}</span>`);
    const sel = GI.h("select", { class: "gi-btn", style: "margin:0;padding:.3em .5em", "aria-label": etichetta },
      voci.map(([k, t]) => `<option value="${k}">${t}</option>`).join(""));
    sel.value = D[chiave] || voci[0][0];
    sel.onchange = () => { M.ferma(st); D[chiave] = sel.value; D.regoleCambiate = true; st.imposta("k", 0); st.aggiorna(); };
    lab.append(sel);
    dopo.append(lab);
  };
  const regole = (st, voci) => {
    const pan = M.pannello(st);
    let box = pan.querySelector(".pli-regole");
    if (box) box.remove();
    box = GI.h("div", { class: "pli-regole", style: "margin:0 0 .4em" });
    for (const [et, ch, vs] of voci) menu(st, et, ch, vs, box);
    const prima = pan.querySelector(".gi-ctrl");
    if (prima) prima.before(box); else pan.append(box);
    return box;
  };

  // ================================================================
  // 2. Disuguaglianze valide e involucro convesso
  // ================================================================
  // Le disuguaglianze nell'ordine delle dispense (cap. «Disuguaglianze valide»): le prime due
  // abbassano il bound; x1 <= 4 e x2 <= 3 sono valide ma da sole non lo cambiano. Con tutte e
  // quattro la formulazione è ideale (involucro convesso dei 16 punti interi).
  const DISUG = [
    { a: [1, 1], b: 5, tex: "x_1 + x_2 \\le 5" },
    { a: [1, 2], b: 7, tex: "x_1 + 2x_2 \\le 7" },
    { a: [1, 0], b: 4, tex: "x_1 \\le 4" },
    { a: [0, 1], b: 3, tex: "x_2 \\le 3" },
  ];
  // verifica a caricamento: ogni disuguaglianza è soddisfatta da tutti i punti interi ammissibili
  for (const d of DISUG) if (!AUTO_INTERI.every((q) => d.a[0] * q[0] + d.a[1] * q[1] <= d.b)) console.error("GI: disuguaglianza non valida", d);
  const attive = (st) => {
    const D = st.dati, k = M.passoK(st, 4);
    if (!D.on || D.kPrec !== k) { D.on = DISUG.map((_, i) => i < k); D.kPrec = k; }
    return D.on;
  };
  const analisiInv = (st) => {
    const on = attive(st), firma = on.join("");
    if (st.dati.an && st.dati.an.firma === firma) return st.dati.an;
    const V = AUTO.V.concat(DISUG.filter((_, i) => on[i])), V0 = V.concat(M.nonneg());
    const lp = risolvi(V0, AUTO.c), vert = M.verticiEsatti(V0);
    const ideale = vert.length === AUTO_HULL.length && vert.every((p) => p[0].d === 1 && p[1].d === 1 &&
      AUTO_HULL.some((h) => h[0] === p[0].n && h[1] === p[1].n));
    return (st.dati.an = { firma, V, V0, lp, vert, ideale, poli: M.poligono(V0, 1e3), on });
  };

  window.GI_RICETTE["pli-involucro"] = {
    titolo: T("Disuguaglianze valide e involucro convesso", "Valid inequalities and the convex hull"),
    sottotitolo: T("esempio delle automobili", "the car example"),
    parametri: [{ k: "k", nome: "k", min: 0, max: 4, step: 1, val: 0, colore: "a", cifre: 0,
      descr: T("quante disuguaglianze valide sono aggiunte (nell'ordine delle dispense): ◀ ▶ una alla volta, «Esegui» per tutte",
        "how many valid inequalities are added (in the order of the notes): ◀ ▶ one at a time, «Run» for all") }],
    vista: vistaAuto,
    opzioniBoard: ADATTA,
    legenda: (st) => {
      const C = M.COL(st);
      return [
        [C.rosso, T("rilassamento lineare", "LP relaxation"), "pieno"],
        [C.verde, T("involucro dei punti interi", "hull of the integer points"), "dashed"],
        [C.viola, T("disuguaglianze valide aggiunte", "added valid inequalities"), ""],
        [C.verde, T("punti interi ammissibili", "feasible integer points"), "punto"],
        [C.blu, T("\\(\\tilde{\\vet{x}}\\) ottimo continuo", "\\(\\tilde{\\vet{x}}\\) LP optimum"), "punto"],
        [C.blu, T("retta \\(\\vet{c}'\\vet{x} = z(\\LP)\\)", "line \\(\\vet{c}'\\vet{x} = z(\\LP)\\)"), "dashed"],
      ];
    },
    monta(board, st) {
      attive(st);
      const pan = M.pannello(st);
      M.comandi(st, []);
      // le quattro disuguaglianze come pulsanti (anche in ordine diverso da quello delle dispense)
      const box = GI.h("div", { class: "pli-disug", style: "margin:.2em 0 .5em" },
        `<strong>${T("Disuguaglianze valide", "Valid inequalities")}</strong>`);
      const chips = GI.h("div", { class: "gi-chips" });
      DISUG.forEach((d, i) => {
        const b = GI.h("button", { class: "gi-chip", "aria-pressed": String(!!(st.dati.on && st.dati.on[i])), "data-i": i }, `\\(${d.tex}\\)`);
        b.onclick = () => { M.ferma(st); st.dati.on[i] = !st.dati.on[i]; st.dati.an = null; st.aggiorna(); };
        chips.append(b);
      });
      box.append(chips);
      pan.querySelector(".gi-comandi").after(box);
      GI.typeset(box);
      lettureDopo(st, box);
      seguiDimensioni(board, st);
    },
    aggiorna(board, st) {
      const A = analisiInv(st), C = M.COL(st);
      st.el.querySelectorAll(".pli-disug .gi-chip").forEach((b) => b.setAttribute("aria-pressed", String(!!A.on[+b.dataset.i])));
      misura(board);
      M.adatta(board, ...vistaAuto);
      M.ridisegna(board, st, [A.firma, M.scuro(), board.canvasWidth, board.canvasHeight].join("|"), (crea) => {
        const x0 = -0.9, x1 = 5.5, y0 = -0.9, y1 = 4.5;
        AUTO.V.forEach((v) => {
          const s = segmento(v.a, v.b, x0, x1, y0, y1);
          if (s) crea("curve", [[s[0][0], s[1][0]], [s[0][1], s[1][1]]], { strokeColor: C.grigio, strokeWidth: 1.3, dash: 2, fixed: true, highlight: false });
        });
        DISUG.forEach((d, i) => {
          const s = segmento(d.a, d.b, x0, x1, y0, y1);
          if (!s) return;
          crea("curve", [[s[0][0], s[1][0]], [s[0][1], s[1][1]]], A.on[i]
            ? { strokeColor: C.viola, strokeWidth: 2.4, fixed: true, highlight: false }
            : { strokeColor: C.viola, strokeWidth: 1, strokeOpacity: 0.35, dash: 3, fixed: true, highlight: false });
        });
        if (A.poli.length) M.area(crea, A.poli, { strokeColor: C.rosso, fillColor: C.rosso, fillOpacity: 0.16 });
        M.area(crea, AUTO_HULL, { strokeColor: C.verde, strokeWidth: 2.2, dash: 2, fillColor: C.verde, fillOpacity: 0.1 });
        for (let i = 0; i <= 5; i++) for (let j = 0; j <= 4; j++) {
          const amm = AUTO_INTERI.some((q) => q[0] === i && q[1] === j);
          M.pallino(crea, i, j, amm ? { size: 3.5, fillColor: C.verde, strokeColor: C.verde } : { size: 1.5, fillColor: C.grigio, strokeColor: C.grigio });
        }
        if (A.lp) {
          const zl = Qv(A.lp.z), c = AUTO.c;
          const s = segmento(c, zl, x0, x1, y0, y1);
          if (s) crea("curve", [[s[0][0], s[1][0]], [s[0][1], s[1][1]]], { strokeColor: C.blu, strokeWidth: 1.8, dash: 2, fixed: true, highlight: false });
          M.pallino(crea, Qv(A.lp.x[0]), Qv(A.lp.x[1]), { size: 6, fillColor: C.blu, strokeColor: C.blu });
          M.scritta(crea, Qv(A.lp.x[0]) + 0.1, Qv(A.lp.x[1]) + 0.22, `z = ${qt(A.lp.z)}`, { fontSize: 13, strokeColor: C.blu, anchorX: "left" });
        }
        M.pallino(crea, 4, 1, { size: 5, fillColor: "none", strokeColor: C.testo, strokeWidth: 2, fillOpacity: 0 });
      });
    },
    formula(p, st) {
      const A = analisiInv(st), t = DISUG.filter((_, i) => A.on[i]).map((d) => d.tex);
      return `\\max\\ 3x_1 + 2x_2\\quad \\text{${T("con", "s.t.")}}\\quad 10x_1 + 4x_2 \\le 45,\\ 4x_1 + 14x_2 \\le 49${t.length ? ",\\ " + t.join(",\\ ") : ""},\\ \\vet{x} \\ge \\vet{0}`;
    },
    letture(p, st) {
      const A = analisiInv(st), C = M.COL(st), zl = A.lp.z, ub = M.Qfloor(zl), righe = [];
      const n = A.on.filter(Boolean).length;
      righe.push(T(`${tinta(C.blu, "Rilassamento lineare")}: \\(\\tilde{\\vet{x}} = ${coppiaQ(A.lp.x)}\\), \\(${zLP} = ${Qtex(zl)}\\)`,
        `${tinta(C.blu, "LP relaxation")}: \\(\\tilde{\\vet{x}} = ${coppiaQ(A.lp.x)}\\), \\(${zLP} = ${Qtex(zl)}\\)`));
      righe.push(T(`Bound superiore \\(\\UB = \\lfloor ${Qtex(zl)} \\rfloor = ${ub}\\), inferiore \\(\\LB = 14\\) (da \\(\\bar{\\vet{x}} = (4, 1)\\)): divario \\(${ub - 14}\\).`,
        `Upper bound \\(\\UB = \\lfloor ${Qtex(zl)} \\rfloor = ${ub}\\), lower bound \\(\\LB = 14\\) (from \\(\\bar{\\vet{x}} = (4, 1)\\)): gap \\(${ub - 14}\\).`));
      const nonVinc = A.lp.x[0].d !== 1 || A.lp.x[1].d !== 1;
      righe.push(nonVinc
        ? T(`L'ottimo non è intero: la formulazione ${tinta(C.rosso, "non è ideale")}.`, `The optimum is not integer: the formulation is ${tinta(C.rosso, "not ideal")}.`)
        : T(`L'ottimo è intero: \\(\\tilde{\\vet{x}} = \\vet{x}^*\\) e il bound è esatto.`, `The optimum is integer: \\(\\tilde{\\vet{x}} = \\vet{x}^*\\) and the bound is exact.`));
      righe.push(A.ideale
        ? T(`${tinta(C.verde, "Formulazione ideale")}: il poliedro coincide con l'involucro convesso dei \\(16\\) punti interi (\\(6\\) vertici, tutti interi).`,
          `${tinta(C.verde, "Ideal formulation")}: the polyhedron is the convex hull of the \\(16\\) integer points (\\(6\\) vertices, all integer).`)
        : T(`Il poliedro ha \\(${A.vert.length}\\) vertici e contiene l'involucro convesso (\\(6\\) vertici); i punti interi sono sempre i \\(16\\) di partenza.`,
          `The polyhedron has \\(${A.vert.length}\\) vertices and contains the convex hull (\\(6\\) vertices); the integer points are always the same \\(16\\).`));
      if (n === 0) righe.push(`<small>${T("Aggiungi una disuguaglianza: ◀ ▶ oppure i pulsanti qui sopra.", "Add an inequality: ◀ ▶ or the buttons above.")}</small>`);
      return righe.join("<br>");
    },
    domanda: T("Aggiungi solo \\(x_1 + x_2 \\le 5\\): quanto vale il bound? E con solo \\(x_1 + 2x_2 \\le 7\\)? Quali disuguaglianze non cambiano il bound da sole, e perché servono comunque per ottenere l'involucro?",
      "Add only \\(x_1 + x_2 \\le 5\\): what is the bound? And with only \\(x_1 + 2x_2 \\le 7\\)? Which inequalities do not change the bound alone, and why are they still needed to get the hull?"),
  };

  // ================================================================
  // 3. Branch-and-bound passo per passo
  // ================================================================
  const regoleBB = (D) => `${D.var || "min"}|${D.nodo || "lifo"}|${D.figli || "giu"}`;
  const chiaveBB = (D) => `${D.pb || "auto"}|${regoleBB(D)}`;
  /** L'albero della configurazione scelta: i dati del motore più la posizione dei nodi (foglie in fila,
   *  ramo ≤ a sinistra, ramo ≥ a destra, padre al centro dei figli; i figli saltati sono «fantasmi»). */
  const alberoDi = (st) => {
    const D = st.dati, chiave = chiaveBB(D);
    if (D.tr && D.trChiave === chiave) return D.tr;
    const R = D0.problemi[D.pb || "auto"].bb[regoleBB(D)], nodi = {};
    R.nodi.forEach((n) => { nodi[n.id] = Object.assign({ prof: 0 }, n); });
    R.nodi.forEach((n) => { if (n.padre !== null) nodi[n.id].prof = nodi[n.padre].prof + 1; });
    const fant = R.passi[R.passi.length - 1].fantasmi;           // [[padre, ramo]]
    const figli = {};
    R.nodi.forEach((n) => { if (n.padre !== null) (figli[n.padre] = figli[n.padre] || []).push({ nodo: n.id, ramo: n.ramo }); });
    fant.forEach(([p, ramo]) => (figli[p] = figli[p] || []).push({ ghost: true, ramo, padre: p }));
    for (const k in figli) figli[k].sort((u, w) => (u.ramo === "giu" ? 0 : 1) - (w.ramo === "giu" ? 0 : 1));
    let foglia = 0;
    const pos = {}, posG = {};
    const visita = (id) => {
      const f = figli[id];
      if (!f) { pos[id] = foglia++; return; }
      f.forEach((c) => { if (c.ghost) posG[id + c.ramo] = foglia++; else visita(c.nodo); });
      const xs = f.map((c) => (c.ghost ? posG[id + c.ramo] : pos[c.nodo]));
      pos[id] = (Math.min(...xs) + Math.max(...xs)) / 2;
    };
    visita(1);
    const prof = Math.max(...Object.values(nodi).map((n) => n.prof));
    D.trChiave = chiave;
    return (D.tr = { R, nodi, pos, posG, foglie: foglia, prof, figli });
  };
  const vincoloBB = (v) => ({ j: v[0], rel: v[1], v: v[2] });
  const vincoliDi = (t, id) => { const out = []; for (let n = t.nodi[id]; n && n.padre !== null; n = t.nodi[n.padre]) out.unshift(vincoloBB(n.vincoli[n.vincoli.length - 1])); return out; };
  const vTex = (c) => `x_${c.j} ${c.rel === "<=" ? "\\le" : "\\ge"} ${c.v}`;
  const vTxt = (c) => `x${SUB[c.j - 1]} ${c.rel === "<=" ? "≤" : "≥"} ${c.v}`;
  // vincoli del nodo come {a, b} per disegnare la regione
  const vincoliRegione = (t, id) => {
    const out = [];
    for (let n = t.nodi[id]; n && n.padre !== null; n = t.nodi[n.padre]) {
      const [j, rel, v] = n.vincoli[n.vincoli.length - 1], a = [0, 0];
      a[j - 1] = rel === "<=" ? 1 : -1;
      out.push({ a, b: rel === "<=" ? v : -v });
    }
    return out;
  };

  /** il dizionario ottimo del nodo del passo E (o dell'incumbent alla fine) */
  const partiBB = (t, E) => {
    const n = E.nodo ? t.nodi[E.nodo] : null;
    const nd = n && n.diz ? n : E.tipo === "fine" && E.inc ? t.nodi[E.inc] : null;
    if (!nd) return null;
    return [[T(`Dizionario ottimo di \\(\\LP_{${nd.id}}\\)` + (nd.padre !== null ? " (con gli scarti dei vincoli di branching)" : ""),
      `Optimal dictionary of \\(\\LP_{${nd.id}}\\)` + (nd.padre !== null ? " (with the slacks of the branching constraints)" : "")), dizTex(nd.diz)]];
  };

  window.GI_RICETTE["pli-bb"] = {
    titolo: T("Branch-and-bound passo per passo", "Branch-and-bound step by step"),
    sottotitolo: T("esempio delle automobili e altri problemi", "the car example and other problems"),
    funzioni: VOCI_P(),
    etichettaFunzioni: T("Problema", "Problem"),
    parametri: [{ k: "k", nome: "k", min: 0, max: 24, step: 1, val: 0, colore: "a", cifre: 0,
      descr: T("passo: ◀ ▶ un passo alla volta, «Esegui» per vederli tutti", "step: ◀ ▶ one step at a time, «Run» to watch all of them") }],
    assi: false,
    opzioniBoard: ADATTA,
    vista: [0, 1, 1, 0],
    legenda: (st) => {
      const C = M.COL(st);
      return [
        [C.rosso, T("nodo corrente", "current node"), "pieno"],
        [C.e, T("nodi in lista", "nodes in the list"), "pieno"],
        [C.verde, T("nodo intero / incumbent \\(\\bar{\\vet{x}}\\)", "integer node / incumbent \\(\\bar{\\vet{x}}\\)"), "pieno"],
        [C.grigio, T("nodo potato", "pruned node"), "pieno"],
        [C.viola, T("rami", "branches"), "dashed"],
        [C.blu, T("\\(\\tilde{\\vet{x}}\\) del nodo", "node's \\(\\tilde{\\vet{x}}\\)"), "punto"],
      ];
    },
    monta(board, st) {
      nuovoProblema(st);
      regole(st, [
        [T("Variabile", "Variable"), "var", [["min", T("indice minimo", "lowest index")], ["max", T("indice massimo", "highest index")],
          ["mininf", T("minima infeasibility", "min infeasibility")], ["maxinf", T("massima infeasibility", "max infeasibility")]]],
        [T("Nodo", "Node"), "nodo", [["lifo", "LIFO"], ["fifo", "FIFO"], ["best", "best bound"]]],
        [T("Primo figlio", "First child"), "figli", [["giu", T("giù (≤)", "down (≤)")], ["su", T("su (≥)", "up (≥)")]]],
      ]);
      M.comandi(st, []);
      lettureDopo(st, st.dati.comandi);
      seguiDimensioni(board, st);
    },
    aggiorna(board, st) {
      const t = alberoDi(st), k = M.passoK(st, t.R.passi.length - 1), E = t.R.passi[k], C = M.COL(st);
      const el = board.containerObj;
      if (window.innerWidth < 860 && el.clientHeight < 560) { el.style.height = Math.round(Math.min(680, Math.max(560, window.innerHeight * 0.75))) + "px"; }
      const [W, H] = misura(board);
      const Rs = dizFlottante(st, board, partiBB(t, E)), Wd = W - Rs;
      board.setBoundingBox([0, H, W, 0], false);
      M.ridisegna(board, st, [st.dati.trChiave, k, W, H, Rs, M.scuro()].join("|"), (crea) => {
        const largo = Wd >= 1.15 * H, pad = 12;
        const zp = largo ? [0, 0, Wd * 0.45, H] : [0, H * 0.5, Wd, H];
        const za = largo ? [Wd * 0.45, 0, Wd, H] : [0, 0, Wd, H * 0.5];
        // ---- la regione, in scala
        const Pb = probDi(st.chiave()), X = Pb.X, Y = Pb.Y, x0 = -0.7, x1 = X + 0.5, y0 = -0.7, y1 = Y + 0.5;
        const s = Math.min((zp[2] - zp[0] - 2 * pad) / (x1 - x0), (zp[3] - zp[1] - 2 * pad) / (y1 - y0));
        const ox = (zp[0] + zp[2]) / 2 - (s * (x0 + x1)) / 2, oy = (zp[1] + zp[3]) / 2 - (s * (y0 + y1)) / 2;
        const px = (x, y) => [ox + s * x, oy + s * y];
        const curva = (pts, attr) => crea("curve", [pts.map((q) => px(...q)[0]), pts.map((q) => px(...q)[1])],
          Object.assign({ fixed: true, highlight: false, strokeWidth: 1 }, attr));
        const regione = (V, attr) => { const Rg = M.poligono(V, 1e3); if (Rg.length) curva(Rg.concat([Rg[0]]), attr); return Rg; };
        const retta = (a, b, attr) => { const sg = segmento(a, b, x0, x1, y0, y1); if (sg) curva(sg, attr); };
        const fs = Math.max(10, Math.min(13, s * 0.4));
        for (let i = 1; i <= X; i++) curva([[i, y0], [i, y1]], { strokeColor: C.line, strokeWidth: 1 });
        for (let j = 1; j <= Y; j++) curva([[x0, j], [x1, j]], { strokeColor: C.line, strokeWidth: 1 });
        crea("arrow", [px(x0, 0), px(x1, 0)], { strokeColor: C.muted, strokeWidth: 1.2, fixed: true, highlight: false, lastArrow: { type: 2, size: 4 } });
        crea("arrow", [px(0, y0), px(0, y1)], { strokeColor: C.muted, strokeWidth: 1.2, fixed: true, highlight: false, lastArrow: { type: 2, size: 4 } });
        for (let i = 1; i <= X; i++) M.scritta(crea, ...px(i, -0.32), i, { fontSize: fs, strokeColor: C.muted });
        for (let j = 1; j <= Y; j++) M.scritta(crea, ...px(-0.32, j), j, { fontSize: fs, strokeColor: C.muted });
        M.scritta(crea, ...px(x1 - 0.15, 0.35), "x₁", { fontSize: fs + 1, strokeColor: C.muted, anchorX: "right" });
        M.scritta(crea, ...px(0.3, y1 - 0.2), "x₂", { fontSize: fs + 1, strokeColor: C.muted, anchorX: "left" });
        // il poliedro di partenza (grigio) con le sue rette
        for (const v of Pb.V) retta(v.a, v.b, { strokeColor: C.grigio, strokeWidth: 1.2, dash: 2 });
        regione(Pb.V0, { strokeColor: C.grigio, strokeWidth: 1.5, fillColor: "none", fillOpacity: 0 });
        // le regioni dei nodi: in lista (giallo), interi (verde), potati (grigio); il nodo in esame in rosso
        const foc = E.nodo;
        const colSt = { lista: C.e, intero: C.verde, bound: C.grigio, tolto: C.grigio };
        const idsSt = Object.keys(E.stati).map(Number);
        for (const id of idsSt) {
          const stt = E.stati[id];
          if (stt === "ramificato" || stt === "inamm") continue;
          const V = Pb.V0.concat(vincoliRegione(t, id));
          if (stt === "corrente") regione(V, { strokeColor: C.rosso, strokeWidth: 2.4, fillColor: C.rosso, fillOpacity: 0.25 });
          else regione(V, { strokeColor: id === foc ? C.rosso : colSt[stt], strokeWidth: id === foc ? 3 : 1.6, fillColor: colSt[stt], fillOpacity: id === foc ? 0.34 : 0.24 });
        }
        if (E.tipo === "radice") regione(Pb.V0, { strokeColor: C.rosso, strokeWidth: 3, fillColor: C.rosso, fillOpacity: 0.12 });
        // al passo di estrazione: le due rette di ramo e la striscia senza punti interi
        if (E.tipo === "estratto") {
          const n = t.nodi[foc], j = E.var, fl = floorQ(n.x[j - 1]);
          const a = [0, 0], a2 = [0, 0]; a[j - 1] = 1; a2[j - 1] = -1;
          const strisc = M.poligono(Pb.V0.concat(vincoliRegione(t, foc), [{ a: a2, b: -fl }, { a, b: fl + 1 }]), 1e3);
          if (strisc.length) curva(strisc.concat([strisc[0]]), { strokeColor: C.viola, strokeWidth: 0, fillColor: C.viola, fillOpacity: 0.22 });
          retta(a, fl, { strokeColor: C.viola, strokeWidth: 2.2, dash: 2 });
          retta(a, fl + 1, { strokeColor: C.viola, strokeWidth: 2.2, dash: 2 });
        } else if (E.tipo === "risolto") {
          const v = t.nodi[foc].vincoli[t.nodi[foc].vincoli.length - 1], a = [0, 0];
          a[v[0] - 1] = v[1] === "<=" ? 1 : -1;
          retta(a, v[1] === "<=" ? v[2] : -v[2], { strokeColor: C.viola, strokeWidth: 2.2, dash: 2 });
        }
        // i punti interi ammissibili, l'incumbent e l'ottimo del nodo in esame
        for (const q of Pb.INTERI) crea("circle", [px(...q), Math.min(3.5, Math.max(2.2, s * 0.04))], { fixed: true, highlight: false, strokeColor: C.verde, fillColor: C.verde, fillOpacity: 1, strokeWidth: 1 });
        if (E.inc) { const xi = t.nodi[E.inc].x; crea("circle", [px(Qv(Qs(xi[0])), Qv(Qs(xi[1]))), Math.min(7, Math.max(5, s * 0.085))], { fixed: true, highlight: false, strokeColor: C.verde, strokeWidth: 2.2, fillColor: C.verde, fillOpacity: 0.15 }); }
        if (foc && t.nodi[foc].x) { const xf = t.nodi[foc].x; crea("circle", [px(Qv(Qs(xf[0])), Qv(Qs(xf[1]))), Math.min(5, Math.max(3.2, s * 0.055))], { fixed: true, highlight: false, strokeColor: C.blu, fillColor: C.blu, fillOpacity: 1, strokeWidth: 1 }); }

        // ---- l'albero
        const L = t.foglie, Dp = Math.max(1, t.prof);
        const tw = za[2] - za[0] - 2 * pad - 58, th = za[3] - za[1] - 2 * pad - 14;
        const dx = tw / L, dy = th / (Dp + 0.45);
        const r = Math.max(10, Math.min(19, dx * 0.32, dy * 0.3));
        const fsT = Math.max(11, Math.min(15, r * 0.95)), stretto = dx < 100;
        const P = (id) => [za[0] + pad + (t.pos[id] + 0.5) * dx, za[3] - pad - r - 4 - t.nodi[id].prof * dy];
        const PG = (p, ramo) => [za[0] + pad + (t.posG[p + ramo] + 0.5) * dx, za[3] - pad - r - 4 - (t.nodi[p].prof + 1) * dy];
        const visibili = idsSt;
        for (const id of visibili) {
          const n = t.nodi[id];
          if (n.padre === null) continue;
          const [xa, ya] = P(n.padre), [xb, yb] = P(id);
          M.linea(crea, xa, ya - r, xb, yb + r, { strokeColor: C.muted, strokeWidth: 1.5 });
          const sx = n.ramo === "giu" ? -1 : 1, c = vincoloBB(n.vincoli[n.vincoli.length - 1]);
          M.scritta(crea, (xa + xb) / 2 + sx * 5, (ya + yb) / 2 + 3, vTxt(c), { fontSize: fsT - 1, strokeColor: C.viola, anchorX: sx < 0 ? "right" : "left" });
        }
        for (const [p, ramo] of E.fantasmi) {
          const [xa, ya] = P(p), [xb, yb] = PG(p, ramo), rg = r * 0.7;
          M.linea(crea, xa, ya - r, xb, yb + rg, { strokeColor: C.grigio, strokeWidth: 1.2, dash: 2 });
          crea("circle", [[xb, yb], rg], { fixed: true, highlight: false, strokeColor: C.grigio, strokeWidth: 1.5, dash: 2, fillOpacity: 0 });
          M.scritta(crea, xb, yb, "×", { fontSize: fsT, strokeColor: C.grigio });
          M.scritta(crea, xb, yb - rg - 9, T("saltato", "skipped"), { fontSize: fsT - 3, strokeColor: C.grigio });
        }
        const stile = {
          lista: { strokeColor: C.e, fillColor: C.e, fillOpacity: 0.3 },
          corrente: { strokeColor: st.colore("a"), fillColor: st.colore("a"), fillOpacity: 0.2 },
          ramificato: { strokeColor: C.blu, fillColor: C.blu, fillOpacity: 0.22 },
          intero: { strokeColor: C.verde, fillColor: C.verde, fillOpacity: 0.55 },
          bound: { strokeColor: C.grigio, fillColor: C.grigio, fillOpacity: 0.45 },
          tolto: { strokeColor: C.grigio, fillColor: C.grigio, fillOpacity: 0.45, dash: 2 },
          inamm: { strokeColor: C.grigio, fillColor: C.grigio, fillOpacity: 0.45 },
        };
        for (const id of visibili) {
          const n = t.nodi[id], [x, y] = P(id), stt = E.stati[id];
          if (id === foc) crea("circle", [[x, y], r + 4], { fixed: true, highlight: false, strokeColor: st.colore("a"), strokeWidth: 3, fillOpacity: 0 });
          crea("circle", [[x, y], r], Object.assign({ fixed: true, highlight: false, strokeWidth: 2 }, stile[stt]));
          M.scritta(crea, x, y, id, { fontSize: fsT, strokeColor: C.testo, cssStyle: "font-weight:700" });
          const z = stt === "inamm" ? "∅" : n.z ? (stretto ? "" : "z = ") + qtx(n.z) : "";
          const perche = { inamm: T("inamm.", "infeas."), bound: "⌊z⌋ ≤ LB", tolto: T("tolto", "removed"), intero: T("intero", "integer") }[stt] || "";
          const colT = stt === "intero" ? C.verde : C.muted;
          if (z) M.scritta(crea, x + r + 7, perche ? y + fsT * 0.55 : y, z, { fontSize: fsT - 1, strokeColor: colT, anchorX: "left" });
          if (perche) M.scritta(crea, x + r + 7, y - fsT * 0.6, perche, { fontSize: fsT - 2, strokeColor: colT, anchorX: "left" });
        }
      });
    },
    formula(p, st) {
      const Pb = probDi(st.chiave());
      return problemaTex(Pb.ob, Pb.vinc);
    },
    letture(p, st) {
      const t = alberoDi(st), k = M.passoK(st, t.R.passi.length - 1), E = t.R.passi[k], C = M.COL(st);
      const n = E.nodo ? t.nodi[E.nodo] : null, righe = [];
      righe.push(`<strong>${T("Passo", "Step")} ${k}/${t.R.passi.length - 1}</strong>` + (n ? T(` · nodo ${n.id}`, ` · node ${n.id}`) : ""));
      const xt = n && n.x ? `\\(\\tilde{\\vet{x}} = ${pq(n.x)}\\), \\(z = ${tq(n.z)}\\)` : "";
      const lb = E.LB ? tq(E.LB) : "-\\infty", ubv = E.UB ? tq(E.UB) : "+\\infty";
      const rn = { lifo: "LIFO", fifo: "FIFO", best: "best bound" }[st.dati.nodo || "lifo"];
      switch (E.tipo) {
        case "radice":
          righe.push(T(`Nodo \\(1\\): il rilassamento lineare. ${xt}. Dati interi: \\(\\UB = \\lfloor ${tq(n.z)} \\rfloor = ${E.UB}\\). Nessun incumbent: \\(\\LB = -\\infty\\).`,
            `Node \\(1\\): the LP relaxation. ${xt}. Integer data: \\(\\UB = \\lfloor ${tq(n.z)} \\rfloor = ${E.UB}\\). No incumbent: \\(\\LB = -\\infty\\).`));
          break;
        case "estratto": {
          const j = E.var, v = n.x[j - 1], fl = floorQ(v);
          const rv = { min: T("indice minimo", "lowest index"), max: T("indice massimo", "highest index"),
            mininf: T("minima infeasibility", "min infeasibility"), maxinf: T("massima infeasibility", "max infeasibility") }[st.dati.var || "min"];
          righe.push(T(`Il nodo \\(${n.id}\\) esce dalla lista (${rn}). ${xt}. Variabile (${rv}): \\(\\tilde x_${j} = ${tq(v)}\\) è frazionaria, si ramifica con \\(x_${j} \\le ${fl}\\) e \\(x_${j} \\ge ${fl + 1}\\). La striscia \\(${fl} < x_${j} < ${fl + 1}\\) non ha punti interi.`,
            `Node \\(${n.id}\\) leaves the list (${rn}). ${xt}. Variable (${rv}): \\(\\tilde x_${j} = ${tq(v)}\\) is fractional, so we branch with \\(x_${j} \\le ${fl}\\) and \\(x_${j} \\ge ${fl + 1}\\). The strip \\(${fl} < x_${j} < ${fl + 1}\\) has no integer point.`));
          break;
        }
        case "risolto": {
          const c = vTex(vincoloBB(n.vincoli[n.vincoli.length - 1])), stt = E.stati[n.id];
          let esito;
          if (stt === "inamm") esito = T(`il rilassamento è ${tinta(C.rosso, "vuoto")}: nodo potato per inammissibilità.`, `the relaxation is ${tinta(C.rosso, "empty")}: node pruned by infeasibility.`);
          else if (stt === "intero") esito = T(`${xt}: soluzione ${tinta(C.verde, "intera")}, nodo potato per interezza; nuovo incumbent \\(\\bar{\\vet{x}} = ${pq(n.x)}\\), \\(\\LB = ${tq(n.z)}\\).`,
            `${xt}: ${tinta(C.verde, "integer")} solution, node pruned by integrality; new incumbent \\(\\bar{\\vet{x}} = ${pq(n.x)}\\), \\(\\LB = ${tq(n.z)}\\).`);
          else if (stt === "bound") esito = T(`${xt}: \\(\\lfloor z \\rfloor = ${floorQ(n.z)} \\le \\LB = ${lb}\\), nodo ${tinta(C.muted, "potato per bound")}.`,
            `${xt}: \\(\\lfloor z \\rfloor = ${floorQ(n.z)} \\le \\LB = ${lb}\\), node ${tinta(C.muted, "pruned by bound")}.`);
          else esito = T(`${xt}: frazionario, \\(\\lfloor z \\rfloor = ${floorQ(n.z)} > \\LB\\), il nodo ${tinta(C.e, "entra in lista")}.`,
            `${xt}: fractional, \\(\\lfloor z \\rfloor = ${floorQ(n.z)} > \\LB\\), the node ${tinta(C.e, "enters the list")}.`);
          righe.push(T(`Nodo \\(${n.id}\\), figlio di \\(${n.padre}\\) (\\(${c}\\)): `, `Node \\(${n.id}\\), child of \\(${n.padre}\\) (\\(${c}\\)): `) + esito);
          if (E.tolti) righe.push(T(`Il nuovo \\(\\LB\\) toglie dalla lista ${E.tolti.map((i) => `\\(${i}\\)`).join(", ")}: \\(\\lfloor z \\rfloor \\le \\LB\\).`,
            `The new \\(\\LB\\) removes from the list ${E.tolti.map((i) => `\\(${i}\\)`).join(", ")}: \\(\\lfloor z \\rfloor \\le \\LB\\).`));
          break;
        }
        case "saltato": {
          const p = t.nodi[E.padre];
          righe.push(T(`${tinta(C.muted, "Regola del salto")}: \\(\\lfloor z(\\LP_${p.id}) \\rfloor = ${floorQ(p.z)} \\le \\LB = ${lb}\\), il secondo figlio (ramo ${E.ramo === "giu" ? "≤" : "≥"}) non si risolve e non prende numero.`,
            `${tinta(C.muted, "Skip rule")}: \\(\\lfloor z(\\LP_${p.id}) \\rfloor = ${floorQ(p.z)} \\le \\LB = ${lb}\\), the second child (${E.ramo === "giu" ? "≤" : "≥"} branch) is not solved and gets no number.`));
          break;
        }
        case "fine":
          righe.push(T(`Lista vuota: l'incumbent è ottimo, \\(\\vet{x}^* = ${pq(t.R.x)}\\), \\(${zILP} = ${tq(t.R.z)}\\). Nodi risolti: \\(${t.R.nodi.length}\\); alla radice \\(${zLP} = ${tq(t.nodi[1].z)}\\).`,
            `Empty list: the incumbent is optimal, \\(\\vet{x}^* = ${pq(t.R.x)}\\), \\(${zILP} = ${tq(t.R.z)}\\). Nodes solved: \\(${t.R.nodi.length}\\); at the root \\(${zLP} = ${tq(t.nodi[1].z)}\\).`));
          break;
      }
      righe.push(`\\(\\LB = ${lb} \\le ${zILP} \\le \\UB = ${ubv}\\)` + (E.inc ? T(` · incumbent \\(\\bar{\\vet{x}} = ${pq(t.nodi[E.inc].x)}\\)`, ` · incumbent \\(\\bar{\\vet{x}} = ${pq(t.nodi[E.inc].x)}\\)`) : ""));
      righe.push(T("Lista: ", "List: ") + (E.lista.length ? E.lista.slice().sort((a, b) => a - b).map((i) => `\\(${i}\\)`).join(", ") : "—"));
      const parti = partiBB(t, E);
      if (parti && !schermoLargo()) righe.push(dizBox(parti));
      else if (!parti && n && E.stati[n.id] === "inamm") righe.push(`<small>${T("Il duale non trova un pivot: nessun dizionario ammissibile.", "The dual simplex finds no pivot: no feasible dictionary.")}</small>`);
      return righe.join("<br>");
    },
    domanda: T("Confronta le regole: quanti nodi servono con LIFO, FIFO e best bound? Con quale regola si trova prima l'ottimo? Cambia il primo figlio: l'albero si allunga o si accorcia? Quando scatta la regola del salto? Cambia problema: con quale l'albero è più grande?",
      "Compare the rules: how many nodes do LIFO, FIFO and best bound need? With which rule is the optimum found first? Change the first child: does the tree grow or shrink? When does the skip rule apply? Change the problem: which one gives the largest tree?"),
  };

  // ================================================================
  // 4. Tagli di Gomory sul piano
  // ================================================================
  // un'esecuzione per combinazione «riga|inserimento» (righe: rhs, min, z; inserimento: prim, debole)
  const chiaveG = (D) => `${D.riga || "rhs"}|${D.ins || "prim"}`;
  const esecG = (st) => D0.problemi[st.chiave()].gomory[chiaveG(st.dati)];
  const G0 = D0.problemi.auto.gomory["rhs|prim"];
  const debole = (st) => st.dati.ins === "debole";
  const tutti = (st) => st.dati.riga === "tutti";
  // i tagli inseriti in un'iterazione (uno solo, o tutti quelli violati del giro)
  const tagliDi = (it) => it.tagli || [it];
  const nomeVar = (j) => `x_${j}`;
  const taglioTex = (it) => {
    const f = it.f, js = Object.keys(f).map(Number).sort((a, b) => a - b);
    const t = js.map((j, i) => { const q = Qs(f[j]); return `${i ? "+ " : ""}${q.n === 1 && q.d === 1 ? "" : Qtex(q)}${nomeVar(j)}`; }).join(" ");
    return `${t} \\ge ${tq(it.f0)}`;
  };
  const xTexOrig = (it) => `${lin(it.a)} \\le ${it.b}`;
  const xTexPrima = (it) => `${lin(it.a0)} \\le ${it.b0}`;
  const xTexPrim = (it) => `${lin(it.ap)} \\le ${it.bp}`;
  const scartoTex = (it) => `x_{${it.s || 4 + it.k}} = ${it.b} - ${it.a[0] && it.a[1] ? `(${lin(it.a)})` : lin(it.a)}`;
  // il taglio in x1, x2 reso primitivo (diviso per g = MCD, termine noto per difetto), poi il suo scarto
  const primitivoTex = (it) => (it.g > 1
    ? T(`cioè in \\(x_1, x_2\\): \\(${xTexPrima(it)}\\); diviso per \\(${it.g}\\) (MCD dei coefficienti) e arrotondato per difetto diventa il taglio primitivo \\(${xTexOrig(it)}\\)`,
        `that is, in \\(x_1, x_2\\): \\(${xTexPrima(it)}\\); divided by \\(${it.g}\\) (gcd of the coefficients) and rounded down it becomes the primitive cut \\(${xTexOrig(it)}\\)`)
    : T(`cioè in \\(x_1, x_2\\) il taglio primitivo \\(${xTexOrig(it)}\\) (coefficienti senza divisori comuni)`,
        `that is, in \\(x_1, x_2\\) the primitive cut \\(${xTexOrig(it)}\\) (coefficients with no common divisor)`));
  // inserimento debole: il surplus del taglio frazionario così com'è (nelle x: a0'x <= b0, senza arrotondare)
  const deboleTex = (it) => {
    const uguale = it.ap[0] * it.g === it.a0[0] && it.ap[1] * it.g === it.a0[1] && it.bp * it.g === it.b0;
    return T(`cioè in \\(x_1, x_2\\): \\(${xTexPrima(it)}\\), inserito così com'è (né divisione né arrotondamento)`,
      `that is, in \\(x_1, x_2\\): \\(${xTexPrima(it)}\\), inserted as it is (no division, no rounding)`) +
      (uguale ? T(" e qui uguale al taglio primitivo", ", here the same as the primitive cut")
        : T(`; il taglio primitivo \\(${xTexPrim(it)}\\) sarebbe più forte`, `; the primitive cut \\(${xTexPrim(it)}\\) would be stronger`));
  };
  // le spiegazioni delle regole scelte (in fondo alle letture)
  const regolaRigaTxt = (st) => ({
    rhs: T("Riga: termine noto frazionario più grande; a parità, la variabile di base di indice minimo (la riga di \\(z\\) per ultima).",
      "Row: the largest fractional right-hand side; ties go to the basic variable of lowest index (the row of \\(z\\) last)."),
    min: T("Riga: la prima riga frazionaria, cioè la variabile di base di indice minimo con \\(\\bar b_i\\) frazionario (la riga di \\(z\\) solo se non ce ne sono altre).",
      "Row: the first fractional row, i.e. the basic variable of lowest index with fractional \\(\\bar b_i\\) (the row of \\(z\\) only if there is no other)."),
    tutti: T("Tutti i tagli violati: a ogni passo (un giro) i tagli di tutte le righe con termine noto frazionario, riga di \\(z\\) per ultima; si tengono quelli violati da \\(\\tilde{\\vet{x}}\\), i doppioni nelle \\(x\\) una volta sola; poi il simplesso duale.",
      "All violated cuts: at each step (a round) the cuts of all the rows with a fractional right-hand side, the row of \\(z\\) last; the cuts violated by \\(\\tilde{\\vet{x}}\\) are kept, duplicates in \\(x\\) only once; then the dual simplex."),
    z: T("Riga: prima la riga della funzione obiettivo, se \\(\\bar z\\) è frazionario; altrimenti il termine noto frazionario più grande (a parità, indice minimo).",
      "Row: the objective row first, if \\(\\bar z\\) is fractional; otherwise the largest fractional right-hand side (ties: lowest index)."),
  })[st.dati.riga || "rhs"];
  const regolaInsTxt = (st) => (debole(st)
    ? T("Inserimento debole: si aggiunge il surplus del taglio frazionario prima di arrotondare; il taglio è più debole e ne servono di più.",
      "Weak insertion: the surplus of the fractional cut is added before rounding; the cut is weaker and more cuts are needed.")
    : T("Inserimento primitivo: il taglio in \\(x_1, x_2\\) si divide per il MCD, il termine noto si arrotonda per difetto, poi si aggiunge lo scarto.",
      "Primitive insertion: the cut in \\(x_1, x_2\\) is divided by the gcd, the right-hand side is rounded down, then the slack is added."));
  // gli stati dell'esecuzione: k = 0 è il rilassamento, k = i dopo il taglio i
  const xStato = (G, k, st) => (k === 0 ? probDi(st.chiave()).R.lp : { x: G.iterazioni[k - 1].xdopo, z: G.iterazioni[k - 1].zdopo });

  window.GI_RICETTE["pli-gomory"] = {
    titolo: T("Tagli di Gomory sul piano", "Gomory cuts on the plane"),
    sottotitolo: T("esempio delle automobili e altri problemi", "the car example and other problems"),
    funzioni: VOCI_P(),
    etichettaFunzioni: T("Problema", "Problem"),
    parametri: [{ k: "k", nome: "k", min: 0, max: G0.iterazioni.length, step: 1, val: 0, colore: "a", cifre: 0,
      descr: T("iterazione: ◀ ▶ un taglio alla volta, «Esegui» per vederli tutti", "iteration: ◀ ▶ one cut at a time, «Run» to watch them all") }],
    vista: (k) => probDi(k).vista,
    opzioniBoard: ADATTA,
    legenda: (st) => {
      const C = M.COL(st);
      return [
        [C.rosso, T("rilassamento con i tagli", "relaxation with the cuts"), "pieno"],
        [C.viola, T("taglio dell'iterazione", "cut of this iteration"), ""],
        [C.viola, T("tagli precedenti", "previous cuts"), "dashed"],
        [C.verde, T("involucro dei punti interi", "hull of the integer points"), "dashed"],
        [C.verde, T("punti interi ammissibili", "feasible integer points"), "punto"],
        [C.blu, T("ottimo continuo corrente", "current LP optimum"), "punto"],
        [C.grigio, T("ottimo precedente (tagliato)", "previous optimum (cut off)"), "punto"],
      ];
    },
    monta(board, st) {
      nuovoProblema(st);
      regole(st, [
        [T("Riga del taglio", "Row of the cut"), "riga", [["rhs", T("parte frazionaria più grande", "largest fractional part")],
          ["min", T("prima riga frazionaria", "first fractional row")], ["z", T("prima la riga dell'obiettivo", "objective row first")],
          ["tutti", T("tutti i tagli violati", "all violated cuts")]]],
        [T("Inserimento", "Insertion"), "ins", [["prim", T("primitivo (arrotonda, poi scarto)", "primitive (round, then slack)")],
          ["debole", T("debole (scarto prima di arrotondare)", "weak (slack before rounding)")]]],
      ]);
      M.comandi(st, []);
      lettureDopo(st, st.dati.comandi);
      seguiDimensioni(board, st);
    },
    aggiorna(board, st) {
      const G = esecG(st), k = M.passoK(st, G.iterazioni.length), C = M.COL(st);
      misura(board);
      const Pb = probDi(st.chiave()), Rs = dizFlottante(st, board, partiG(st, G, k, C));
      adattaRiserva(board, ...Pb.vista, Rs);
      M.ridisegna(board, st, [st.chiave(), chiaveG(st.dati), k, Rs, M.scuro(), board.canvasWidth, board.canvasHeight].join("|"), (crea) => {
        const x0 = -0.9, x1 = Pb.X + 0.5, y0 = -0.9, y1 = Pb.Y + 0.5;
        const tagli = G.iterazioni.slice(0, k).flatMap((it, i) => tagliDi(it).map((c) => Object.assign({ giro: i }, c)));
        const V = Pb.V0.concat(tagli.map((it) => ({ a: it.a, b: it.b })));
        Pb.V.forEach((v) => {
          const s = segmento(v.a, v.b, x0, x1, y0, y1);
          if (s) crea("curve", [[s[0][0], s[1][0]], [s[0][1], s[1][1]]], { strokeColor: C.grigio, strokeWidth: 1.3, dash: 2, fixed: true, highlight: false });
        });
        tagli.forEach((it) => {
          const s = segmento(it.a, it.b, x0, x1, y0, y1);
          if (!s) return;
          const ult = it.giro === k - 1;
          crea("curve", [[s[0][0], s[1][0]], [s[0][1], s[1][1]]], ult
            ? { strokeColor: C.viola, strokeWidth: 3, fixed: true, highlight: false }
            : { strokeColor: C.viola, strokeWidth: 1.2, strokeOpacity: 0.55, dash: 2, fixed: true, highlight: false });
        });
        const P = M.poligono(V, 1e3);
        if (P.length) M.area(crea, P, { strokeColor: C.rosso, fillColor: C.rosso, fillOpacity: 0.18 });
        M.area(crea, Pb.HULL, { strokeColor: C.verde, strokeWidth: 2, dash: 2, fillColor: C.verde, fillOpacity: 0.08 });
        for (let i = 0; i <= Pb.X; i++) for (let j = 0; j <= Pb.Y; j++) {
          const amm = Pb.INTERI.some((q) => q[0] === i && q[1] === j);
          M.pallino(crea, i, j, amm ? { size: 3.5, fillColor: C.verde, strokeColor: C.verde } : { size: 1.5, fillColor: C.grigio, strokeColor: C.grigio });
        }
        if (k > 0) { const xp = xStato(G, k - 1, st).x; M.pallino(crea, Qv(Qs(xp[0])), Qv(Qs(xp[1])), { size: 6, face: "x", fillColor: C.grigio, strokeColor: C.grigio, strokeWidth: 3 }); }
        const xc = xStato(G, k, st);
        M.pallino(crea, Qv(Qs(xc.x[0])), Qv(Qs(xc.x[1])), { size: 6, fillColor: C.blu, strokeColor: C.blu });
        M.scritta(crea, Qv(Qs(xc.x[0])) + 0.12, Qv(Qs(xc.x[1])) + 0.24, `z = ${qtx(xc.z)}`, { fontSize: 13, strokeColor: C.blu, anchorX: "left" });
      });
    },
    formula(p, st) {
      const Pb = probDi(st.chiave());
      return problemaTex(Pb.ob, Pb.vinc);
    },
    letture(p, st) {
      const G = esecG(st), k = M.passoK(st, G.iterazioni.length), C = M.COL(st), righe = [];
      const xc = xStato(G, k, st), intero = Qs(xc.x[0]).d === 1 && Qs(xc.x[1]).d === 1;
      righe.push(`<strong>${tutti(st) ? T("Giro", "Round") : T("Iterazione", "Iteration")} ${k}/${G.iterazioni.length}</strong>`);
      const Pb = probDi(st.chiave());
      const scarti = (e) => Pb.V.map((v, i) => `\\(x_${3 + i} = ${v.b} - ${lin(v.a).replace(/\+/g, "-")}\\)`).join(e);
      if (k === 0) {
        righe.push(debole(st)
          ? T(`Rilassamento lineare: \\(\\tilde{\\vet{x}} = ${pq(xc.x)}\\), \\(${zLP} = ${tq(xc.z)}\\). Non è intero: si cerca un taglio. Gli scarti sono ${scarti(" e ")}; ogni taglio riceve subito il suo surplus \\(x_5, x_6, \\dots\\), senza arrotondare.`,
            `LP relaxation: \\(\\tilde{\\vet{x}} = ${pq(xc.x)}\\), \\(${zLP} = ${tq(xc.z)}\\). It is not integer: we look for a cut. The slacks are ${scarti(" and ")}; each cut gets its surplus \\(x_5, x_6, \\dots\\) right away, without rounding.`)
          : T(`Rilassamento lineare: \\(\\tilde{\\vet{x}} = ${pq(xc.x)}\\), \\(${zLP} = ${tq(xc.z)}\\). Non è intero: si cerca un taglio. Gli scarti sono ${scarti(" e ")}; ogni taglio, scritto in \\(x_1, x_2\\), si rende primitivo e poi riceve il suo scarto \\(x_5, x_6, \\dots\\).`,
            `LP relaxation: \\(\\tilde{\\vet{x}} = ${pq(xc.x)}\\), \\(${zLP} = ${tq(xc.z)}\\). It is not integer: we look for a cut. The slacks are ${scarti(" and ")}; each cut, written in \\(x_1, x_2\\), is made primitive and then gets its slack \\(x_5, x_6, \\dots\\).`));
      } else {
        const ins = debole(st) ? deboleTex : primitivoTex;
        const it = G.iterazioni[k - 1], riga = it.riga === "z"
          ? T("la riga della funzione obiettivo", "the objective row")
          : T(`la riga di \\(x_${it.riga}\\)`, `the row of \\(x_${it.riga}\\)`);
        righe.push(T(`Prima ${tutti(st) ? "dei tagli" : "del taglio"}: \\(\\tilde{\\vet{x}} = ${pq(it.xprima)}\\), \\(z = ${tq(it.zprima)}\\).`, `Before the ${tutti(st) ? "cuts" : "cut"}: \\(\\tilde{\\vet{x}} = ${pq(it.xprima)}\\), \\(z = ${tq(it.zprima)}\\).`));
        if (tutti(st)) {
          const nomeR = (r) => (r === "z" ? "\\(z\\)" : `\\(x_${r}\\)`), tg = tagliDi(it);
          righe.push(T(`${tinta(C.viola, `${tg.length} tagli violati`)} inseriti insieme, ognuno col suo scarto (violazione \\(\\vet{a}^\\top \\tilde{\\vet{x}} - b\\) del taglio \\(\\vet{a}^\\top \\vet{x} \\le b\\)):`, `${tinta(C.viola, `${tg.length} violated cuts`)} inserted together, each with its slack (violation \\(\\vet{a}^\\top \\tilde{\\vet{x}} - b\\) of the cut \\(\\vet{a}^\\top \\vet{x} \\le b\\)):`));
          for (const c of tg) righe.push(T(`· riga ${nomeR(c.riga)}: \\(${taglioTex(c)}\\) → \\(${xTexOrig(c)}\\), violazione \\(${tq(c.v)}\\), scarto \\(x_{${c.s}}\\).`,
            `· row ${nomeR(c.riga)}: \\(${taglioTex(c)}\\) → \\(${xTexOrig(c)}\\), violation \\(${tq(c.v)}\\), slack \\(x_{${c.s}}\\).`));
          if (it.doppi.length) righe.push(T(`Doppioni nelle \\(x\\), inseriti una volta sola (riga che dà lo stesso taglio di un'altra): ${it.doppi.map((d) => `${nomeR(d.riga)} come ${nomeR(d.uguale)}`).join(", ")}.`,
            `Duplicates in \\(x\\), inserted only once (row giving the same cut as another): ${it.doppi.map((d) => `${nomeR(d.riga)} as ${nomeR(d.uguale)}`).join(", ")}.`));
        } else righe.push(T(`${tinta(C.viola, "Taglio")} dalla ${riga} (termine noto frazionario \\(f_0 = ${tq(it.f0)}\\)): \\(${taglioTex(it)}\\), ${ins(it)}. Scarto: \\(${scartoTex(it)} \\ge 0\\).`,
          `${tinta(C.viola, "Cut")} from ${riga} (fractional right-hand side \\(f_0 = ${tq(it.f0)}\\)): \\(${taglioTex(it)}\\), ${ins(it)}. Slack: \\(${scartoTex(it)} \\ge 0\\).`));
        righe.push(T(`Dopo ${tutti(st) ? "i tagli" : "il taglio"} (simplesso duale): \\(\\tilde{\\vet{x}} = ${pq(xc.x)}\\), \\(${zLP} = ${tq(xc.z)}\\)` +
          (intero ? `: ${tinta(C.verde, "intero")}, quindi ottimo.` : "."),
          `After the ${tutti(st) ? "cuts" : "cut"} (dual simplex): \\(\\tilde{\\vet{x}} = ${pq(xc.x)}\\), \\(${zLP} = ${tq(xc.z)}\\)` + (intero ? `: ${tinta(C.verde, "integer")}, hence optimal.` : ".")));
      }
      const nt = G.iterazioni.reduce((m, it) => m + tagliDi(it).length, 0);
      if (intero && k > 0) righe.push(tutti(st)
        ? T(`Fine dopo \\(${k}\\) giri e \\(${nt}\\) tagli: \\(\\vet{x}^* = ${pq(xc.x)}\\), \\(${zILP} = ${tq(xc.z)}\\).`, `Done after \\(${k}\\) rounds and \\(${nt}\\) cuts: \\(\\vet{x}^* = ${pq(xc.x)}\\), \\(${zILP} = ${tq(xc.z)}\\).`)
        : T(`Fine dopo \\(${k}\\) tagli: \\(\\vet{x}^* = ${pq(xc.x)}\\), \\(${zILP} = ${tq(xc.z)}\\).`, `Done after \\(${k}\\) cuts: \\(\\vet{x}^* = ${pq(xc.x)}\\), \\(${zILP} = ${tq(xc.z)}\\).`));
      if (!schermoLargo()) righe.push(dizBox(partiG(st, G, k, C)));
      righe.push(`<small>${regolaRigaTxt(st)} ${regolaInsTxt(st)}</small>`);
      return righe.join("<br>");
    },
    domanda: T("Confronta il numero di tagli con l'inserimento debole e con quello primitivo, e con le regole per la riga, anche con tutti i tagli violati insieme: quale combinazione arriva prima all'ottimo intero? Cambia problema: le regole si ordinano allo stesso modo? Controlla che nessun punto verde sia mai tolto.",
      "Compare the number of cuts with the weak and the primitive insertion, and with the row rules, also with all the violated cuts at once: which combination reaches the integer optimum first? Change the problem: do the rules rank the same way? Check that no green point is ever removed."),
  };
  // i dizionari: LP_k con le righe del taglio (viola), poi LP_{k+1} dopo il duale con le righe nuove (blu)
  function partiG(st, G, k, C) {
    const righeTaglio = (it) => Object.fromEntries(tagliDi(it).concat(it.doppi || []).map((c) => [c.riga, C.viola]));
    const LPk = (i) => `\\(\\LP_{${i + 1}}\\)`;
    if (k === 0) return [[T(`Dizionario ottimo di ${LPk(0)}, il rilassamento` + (G.iterazioni.length ? `; in ${tinta(C.viola, "viola")} la riga del primo taglio` : ""),
      `Optimal dictionary of ${LPk(0)}, the relaxation` + (G.iterazioni.length ? `; in ${tinta(C.viola, "violet")} the row of the first cut` : "")),
      dizTex(G.diz[0], G.iterazioni.length ? righeTaglio(G.iterazioni[0]) : {})]];
    const it = G.iterazioni[k - 1], nuove = Object.fromEntries(tagliDi(it).map((c) => [c.s, C.blu]));
    return [
      [T(`Dizionario ottimo di ${LPk(k - 1)}: in ${tinta(C.viola, "viola")} ${tutti(st) ? "le righe dei tagli" : "la riga del taglio"}`,
        `Optimal dictionary of ${LPk(k - 1)}: in ${tinta(C.viola, "violet")} the ${tutti(st) ? "rows of the cuts" : "row of the cut"}`), dizTex(G.diz[k - 1], righeTaglio(it))],
      [T(`Dopo il simplesso duale, dizionario ottimo di ${LPk(k)}: in ${tinta(C.blu, "blu")} ${tutti(st) ? "gli scarti nuovi" : "lo scarto nuovo"}`,
        `After the dual simplex, optimal dictionary of ${LPk(k)}: in ${tinta(C.blu, "blue")} the new ${tutti(st) ? "slacks" : "slack"}`), dizTex(G.diz[k], nuove)],
    ];
  }
})();
