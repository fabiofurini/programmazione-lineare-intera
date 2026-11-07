// Domande generate dell'autovalutazione del modulo «Programmazione lineare intera» /
// «Integer Linear Programming» (specifica comune: 02_MODULI_TEMATICI/QUIZ_SPEC.md).
// Ogni generatore crea un'istanza nuova con rng(), calcola la risposta in aritmetica esatta
// (frazioni) e costruisce i distrattori dagli errori tipici delle dispense.
// Il campo `verifica` di ogni risposta (dati dell'istanza e opzioni in forma strutturata) serve
// solo al gemello di verifica in quiz/verifica/: l'app lo ignora.
(function () {
  "use strict";
  var MOD = "integer-linear-programming";
  var EN = "https://fabiofurini.github.io/integer-linear-programming/";
  var IT = "https://fabiofurini.github.io/programmazione-lineare-intera/";
  var PAG = {
    "ilp": ["models-and-bounds/ilp/", "modelli-e-bound/ilp/"],
    "lp-relaxation": ["models-and-bounds/lp-relaxation/", "modelli-e-bound/lp-relaxation/"],
    "ideal-formulations": ["formulations/ideal-formulations/", "formulazioni/ideal-formulations/"],
    "valid-inequalities": ["formulations/valid-inequalities/", "formulazioni/valid-inequalities/"],
    "cover": ["formulations/cover/", "formulazioni/cover/"],
    "gomory": ["exact-methods/gomory/", "metodi-esatti/gomory/"],
    "bb": ["exact-methods/bb/", "metodi-esatti/bb/"],
    "branch-and-cut": ["exact-methods/branch-and-cut/", "metodi-esatti/branch-and-cut/"],
    "mip-solvers": ["solvers/mip-solvers/", "solver/mip-solvers/"],
    "mip-heuristics": ["mip-heuristics/mip-heuristics/", "euristiche-mip/mip-heuristics/"]
  };
  function link(cap, anc, ancIt) {
    return { it: IT + PAG[cap][1] + "#" + (ancIt || anc), en: EN + PAG[cap][0] + "#" + anc };
  }
  function L(lingua, it, en) { return lingua === "it" ? it : en; }

  // ---------------------------------------------------------------- frazioni esatte
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
  function lcm(a, b) { return a / gcd(a, b) * b; }
  function F(n, d) {
    if (typeof n === "object") return n;
    d = d === undefined ? 1 : d;
    if (d === 0) throw new Error("denominatore nullo");
    if (d < 0) { n = -n; d = -d; }
    var g = gcd(n, d) || 1;
    return { n: n / g, d: d / g };
  }
  function add(a, b) { a = F(a); b = F(b); return F(a.n * b.d + b.n * a.d, a.d * b.d); }
  function sub(a, b) { a = F(a); b = F(b); return F(a.n * b.d - b.n * a.d, a.d * b.d); }
  function mul(a, b) { a = F(a); b = F(b); return F(a.n * b.n, a.d * b.d); }
  function div(a, b) { a = F(a); b = F(b); return F(a.n * b.d, a.d * b.n); }
  function neg(a) { a = F(a); return F(-a.n, a.d); }
  function cmp(a, b) { var s = sub(a, b); return s.n > 0 ? 1 : (s.n < 0 ? -1 : 0); }
  function eq(a, b) { return cmp(a, b) === 0; }
  function flo(a) { a = F(a); return Math.floor(a.n / a.d); }
  function cei(a) { a = F(a); return Math.ceil(a.n / a.d); }
  function isInt(a) { return F(a).d === 1; }
  function frac(a) { return sub(a, flo(a)); }
  function rnd(a) { return flo(add(a, F(1, 2))); }      // arrotondamento all'intero più vicino (note, Def. 10.3)
  function fs(a) { a = F(a); return a.d === 1 ? String(a.n) : a.n + "/" + a.d; }  // forma testuale per la verifica
  function tx(a) {                                       // LaTeX di una frazione
    a = F(a);
    if (a.d === 1) return String(a.n);
    return (a.n < 0 ? "-" : "") + "\\frac{" + Math.abs(a.n) + "}{" + a.d + "}";
  }
  function txPt(v) { return "(" + v.map(tx).join(", ") + ")"; }
  function txLin(coef, nomi) {                            // 3x_1 - \frac{1}{2}x_2 + x_3
    var s = "";
    for (var j = 0; j < coef.length; j++) {
      var c = F(coef[j]);
      if (c.n === 0) continue;
      var ab = F(Math.abs(c.n), c.d);
      var cs = (ab.n === 1 && ab.d === 1) ? "" : tx(ab) + "\\,";
      if (s === "") s = (c.n < 0 ? "-" : "") + cs + nomi[j];
      else s += (c.n < 0 ? " - " : " + ") + cs + nomi[j];
    }
    return s === "" ? "0" : s;
  }
  var X = ["x_1", "x_2", "x_3", "x_4", "x_5", "x_6"];
  function txIneq(coef, rel, rhs, nomi) { return txLin(coef, nomi || X) + " " + rel + " " + tx(rhs); }
  function txSet(idx, nome) { return "\\{" + idx.map(function (j) { return (nome || "x") + "_{" + (j + 1) + "}"; }).join(", ") + "\\}"; }
  function txIdx(idx) { return "\\{" + idx.map(function (j) { return j + 1; }).join(", ") + "\\}"; }

  // ---------------------------------------------------------------- casualità
  function ri(rng, a, b) { return a + Math.floor(rng() * (b - a + 1)); }
  function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
  function mescola(rng, arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rng() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  // corr: {s: testo, v: valore strutturato}; distr: elenco di {s, v}. Restituisce null se le opzioni coincidono.
  function chiudi(rng, testo, corr, distr, spieg, ver) {
    if (distr.length < 3) return null;
    var tutte = [corr].concat(distr.slice(0, 3));
    var visti = {};
    for (var i = 0; i < 4; i++) { if (visti[tutte[i].s]) return null; visti[tutte[i].s] = 1; }
    var ord = mescola(rng, [0, 1, 2, 3]);
    ver = ver || {};
    ver.opzioni = ord.map(function (k) { return tutte[k].v; });
    return { testo: testo, opzioni: ord.map(function (k) { return tutte[k].s; }), corretta: ord.indexOf(0), spiegazione: spieg, verifica: ver };
  }
  // sceglie fino a 3 distrattori con testo diverso dalla risposta e fra loro
  function filtra(corr, pool) {
    var out = [], visti = {}; visti[corr.s] = 1;
    for (var i = 0; i < pool.length; i++) { if (pool[i] && !visti[pool[i].s]) { visti[pool[i].s] = 1; out.push(pool[i]); } }
    return out;
  }
  function ripeti(f) {
    return function (rng, lingua) {
      for (var t = 0; t < 4000; t++) { var r = f(rng, lingua); if (r) return r; }
      throw new Error("generatore senza istanza valida");
    };
  }

  // ---------------------------------------------------------------- LP in due variabili (vertici, esatto)
  // vincoli [a1, a2, b] significa a1 x1 + a2 x2 <= b; le non negatività vanno incluse.
  function lp2(c, cons) {
    var vert = [];
    for (var i = 0; i < cons.length; i++) for (var j = i + 1; j < cons.length; j++) {
      var p = cons[i], q = cons[j];
      var det = sub(mul(p[0], q[1]), mul(p[1], q[0]));
      if (F(det).n === 0) continue;
      var x1 = div(sub(mul(p[2], q[1]), mul(p[1], q[2])), det);
      var x2 = div(sub(mul(p[0], q[2]), mul(p[2], q[0])), det);
      var ok = true;
      for (var k = 0; k < cons.length && ok; k++) {
        if (cmp(add(mul(cons[k][0], x1), mul(cons[k][1], x2)), cons[k][2]) > 0) ok = false;
      }
      if (!ok) continue;
      var dup = false;
      for (k = 0; k < vert.length; k++) if (eq(vert[k][0], x1) && eq(vert[k][1], x2)) dup = true;
      if (!dup) vert.push([x1, x2]);
    }
    if (!vert.length) return { stato: "inf" };
    var best = null, z = null, nb = 0;
    vert.forEach(function (v) {
      var zz = add(mul(c[0], v[0]), mul(c[1], v[1]));
      if (z === null || cmp(zz, z) > 0) { z = zz; best = v; nb = 1; } else if (eq(zz, z)) nb++;
    });
    return { stato: "ott", x: best, z: z, unico: nb === 1, vertici: vert };
  }
  function nonneg() { return [[-1, 0, 0], [0, -1, 0]]; }
  function intero(v) { return v.every(isInt); }
  function interi(A, b) {                                // punti interi di {Ax <= b, x >= 0} (2 variabili, coefficienti positivi in qualche riga)
    var U1 = 30, U2 = 30, pts = [];
    for (var x1 = 0; x1 <= U1; x1++) for (var x2 = 0; x2 <= U2; x2++) {
      var ok = true;
      for (var i = 0; i < A.length; i++) if (A[i][0] * x1 + A[i][1] * x2 > b[i]) { ok = false; break; }
      if (ok) pts.push([x1, x2]);
    }
    return pts;
  }
  function ammissibile(A, b, x) {
    for (var i = 0; i < A.length; i++) {
      var s = 0; for (var j = 0; j < x.length; j++) s = add(s, mul(A[i][j], x[j]));
      if (cmp(s, b[i]) > 0) return false;
    }
    return x.every(function (v) { return cmp(v, 0) >= 0; });
  }
  function valore(c, x) { var s = F(0); for (var j = 0; j < c.length; j++) s = add(s, mul(c[j], x[j])); return s; }

  // istanza "tipo auto": max c x, a11 x1 + a12 x2 <= b1, a21 x1 + a22 x2 <= b2, x interi >= 0
  function istanzaAuto(rng) {
    for (var t = 0; t < 500; t++) {
      var c = [ri(rng, 2, 6), ri(rng, 2, 6)];
      var A = [[ri(rng, 5, 12), ri(rng, 2, 6)], [ri(rng, 2, 6), ri(rng, 5, 14)]];
      var b = [ri(rng, 18, 50), ri(rng, 18, 50)];
      if (gcd(c[0], c[1]) !== 1) continue;
      var r = lp2(c, [[A[0][0], A[0][1], b[0]], [A[1][0], A[1][1], b[1]]].concat(nonneg()));
      if (r.stato !== "ott" || !r.unico) continue;
      // ottimo nel vertice dei due vincoli, con entrambe le coordinate positive
      var det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
      if (det === 0) continue;
      var x1 = F(b[0] * A[1][1] - A[0][1] * b[1], det), x2 = F(A[0][0] * b[1] - b[0] * A[1][0], det);
      if (!(eq(x1, r.x[0]) && eq(x2, r.x[1]))) continue;
      if (cmp(x1, 0) <= 0 || cmp(x2, 0) <= 0) continue;
      return { c: c, A: A, b: b, lp: r };
    }
    return null;
  }
  function vincoliAuto(ist) { return [[ist.A[0][0], ist.A[0][1], ist.b[0]], [ist.A[1][0], ist.A[1][1], ist.b[1]]].concat(nonneg()); }
  function txPLI(ist, lingua, dominio) {
    var s = "$\\max\\ " + txLin(ist.c, X) + "$ " + L(lingua, "soggetto a", "subject to") + " ";
    var v = [];
    for (var i = 0; i < ist.A.length; i++) v.push("$" + txIneq(ist.A[i], "\\le", ist.b[i]) + "$");
    s += v.join(", ") + ", $" + X.slice(0, ist.c.length).join(", ") + " " + (dominio || "\\in \\Z_{\\ge 0}") + "$";
    return s;
  }
  function verIst(ist) { return { c: ist.c, A: ist.A, b: ist.b }; }

  // dizionario ottimo del rilassamento lineare in forma standard (base {x1, x2}, scarti x3, x4 fuori base)
  function dizionario(ist) {
    var A = ist.A, det = A[0][0] * A[1][1] - A[0][1] * A[1][0];
    var Bi = [[F(A[1][1], det), F(-A[0][1], det)], [F(-A[1][0], det), F(A[0][0], det)]];
    var bb = [add(mul(Bi[0][0], ist.b[0]), mul(Bi[0][1], ist.b[1])), add(mul(Bi[1][0], ist.b[0]), mul(Bi[1][1], ist.b[1]))];
    var cb = [neg(add(mul(ist.c[0], Bi[0][0]), mul(ist.c[1], Bi[1][0]))), neg(add(mul(ist.c[0], Bi[0][1]), mul(ist.c[1], Bi[1][1])))];
    var zb = add(mul(ist.c[0], bb[0]), mul(ist.c[1], bb[1]));
    return { abar: Bi, bbar: bb, cbar: cb, zbar: zb };
  }
  function txRiga(base, cost, coef, nn) {            // x_i = b - a3 x3 - a4 x4 (coef = abar della riga)
    var s = base + " = " + tx(cost);
    for (var q = 0; q < coef.length; q++) {
      var a = neg(coef[q]);
      if (F(a).n === 0) continue;
      var ab = F(Math.abs(a.n), a.d);
      s += (a.n < 0 ? " - " : " + ") + ((ab.n === 1 && ab.d === 1) ? "" : tx(ab) + "\\,") + nn[q];
    }
    return s;
  }
  function txDiz(dz) {
    var nn = ["x_3", "x_4"];
    var r1 = txRiga("x_1", dz.bbar[0], dz.abar[0], nn), r2 = txRiga("x_2", dz.bbar[1], dz.abar[1], nn);
    var r3 = txRiga("z", dz.zbar, [neg(dz.cbar[0]), neg(dz.cbar[1])], nn);
    return "$" + r1 + "$, $\\;" + r2 + "$, $\\;" + r3 + "$";
  }
  function txScarti(ist) {
    function r(i) { return "x_" + (i + 3) + " = " + ist.b[i] + " - " + txLin([ist.A[i][0], 0], X) + " - " + txLin([0, ist.A[i][1]], X); }
    return "$" + r(0) + "$, $" + r(1) + "$";
  }

  var G = [];

  // ================================================================ 1. bound dal rilassamento lineare
  G.push({
    id: "pli-g-lp-bound", livello: "facile", capitolo: "lp-relaxation", link: link("lp-relaxation", "box-9-obs-floor"),
    genera: ripeti(function (rng, lingua) {
      var ist = istanzaAuto(rng); if (!ist) return null;
      var x = ist.lp.x, z = ist.lp.z;
      if (isInt(z) || intero(x)) return null;
      var xb = [flo(x[0]), flo(x[1])], lb = valore(ist.c, xb);
      if (cmp(lb, flo(z)) >= 0) return null;
      function iv(a, b) { return { s: "$" + tx(a) + " \\le z(\\ILP) \\le " + tx(b) + "$", v: [fs(a), fs(b)] }; }
      var corr = iv(lb, flo(z));
      var d = [iv(lb, z), iv(lb, cei(z)), { s: "$z(\\ILP) = " + tx(lb) + "$", v: [fs(lb), fs(lb)] }];
      var testo = L(lingua,
        "Nel problema PLI " + txPLI(ist, lingua) + " il rilassamento lineare ha soluzione ottima $\\tilde{\\vet x}(\\LP) = " + txPt(x) + "$ di valore $z(\\LP) = " + tx(z) + "$. Arrotondando per difetto si ottiene la soluzione ammissibile $" + txPt(xb) + "$. Qual è l'intervallo più stretto per il valore ottimo $z(\\ILP)$ del problema PLI che questi dati certificano?",
        "In the ILP problem " + txPLI(ist, lingua) + " the LP relaxation has the optimal solution $\\tilde{\\vet x}(\\LP) = " + txPt(x) + "$ of value $z(\\LP) = " + tx(z) + "$. Rounding down gives the feasible solution $" + txPt(xb) + "$. What is the tightest interval for the optimal value $z(\\ILP)$ of the ILP problem certified by these data?");
      var sp = L(lingua,
        "La soluzione arrotondata dà il lower bound $" + tx(lb) + "$; variabili e costi sono interi, quindi $z(\\ILP) \\le \\lfloor z(\\LP) \\rfloor = " + flo(z) + "$. Arrotondare per eccesso non è valido, e la soluzione arrotondata non è certificata ottima.",
        "The rounded solution gives the lower bound $" + tx(lb) + "$; variables and costs are integer, so $z(\\ILP) \\le \\lfloor z(\\LP) \\rfloor = " + flo(z) + "$. Rounding up is not valid, and the rounded solution is not certified optimal.");
      return chiudi(rng, testo, corr, d, sp, { ist: verIst(ist) });
    })
  });

  // ================================================================ 2. gap di ottimalità
  G.push({
    id: "pli-g-gap", livello: "facile", capitolo: "lp-relaxation", link: link("lp-relaxation", "box-1-def-bounds"),
    genera: ripeti(function (rng, lingua) {
      var LB = ri(rng, 10, 60), q = pick(rng, [2, 3, 4, 5, 6, 7]), p = ri(rng, 1, q - 1);
      var z = add(LB + ri(rng, 1, 6), F(p, q));
      var U = flo(z);
      function g(num, den) { var v = div(num, den); return { s: "$" + tx(v) + "$", v: fs(v) }; }
      var corr = g(sub(U, LB), LB);
      var d = [g(sub(z, LB), LB), g(sub(U, LB), U), g(sub(cei(z), LB), LB)];
      var testo = L(lingua,
        "In un problema PLI di massimizzazione con variabili e costi interi si conoscono una soluzione ammissibile di valore $\\LB = " + LB + "$ (lower bound) e il valore ottimo del rilassamento lineare $z(\\LP) = " + tx(z) + "$. Quanto vale il gap di ottimalità $\\frac{\\UB - \\LB}{|\\LB|}$, dove $\\UB$ è il miglior upper bound che si ricava da questi dati?",
        "In a maximization ILP problem with integer variables and costs we know a feasible solution of value $\\LB = " + LB + "$ (lower bound) and the optimal value of the LP relaxation $z(\\LP) = " + tx(z) + "$. What is the optimality gap $\\frac{\\UB - \\LB}{|\\LB|}$, where $\\UB$ is the best upper bound given by these data?");
      var sp = L(lingua,
        "Con variabili e costi interi $\\UB = \\lfloor z(\\LP) \\rfloor = " + U + "$, quindi il gap è $\\frac{" + U + " - " + LB + "}{" + LB + "}$: al denominatore va $|\\LB|$, non l'upper bound.",
        "With integer variables and costs $\\UB = \\lfloor z(\\LP) \\rfloor = " + U + "$, so the gap is $\\frac{" + U + " - " + LB + "}{" + LB + "}$: the denominator is $|\\LB|$, not the upper bound.");
      return chiudi(rng, testo, corr, d, sp, { LB: LB, z: fs(z) });
    })
  });

  // ================================================================ 3. upper bound sulle variabili
  G.push({
    id: "pli-g-vub", livello: "facile", capitolo: "lp-relaxation", link: link("lp-relaxation", "box-14-prop-vub"),
    genera: ripeti(function (rng, lingua) {
      var A = [[ri(rng, 2, 9), ri(rng, 2, 9)], [ri(rng, 2, 9), ri(rng, 2, 9)], [-ri(rng, 1, 4), ri(rng, 2, 9)]];
      var b = [ri(rng, 15, 60), ri(rng, 15, 60), ri(rng, 2, 20)];
      var j = ri(rng, 0, 1);
      if (j === 0) { A[2] = [A[2][1], A[2][0]]; }        // il vincolo con il coefficiente negativo ha a_{3j} > 0
      var k = 1 - j;
      var u = [F(b[0], A[0][j]), F(b[1], A[1][j])];
      var corrV = Math.min(flo(u[0]), flo(u[1]));
      var mx = Math.max(flo(u[0]), flo(u[1]));
      var trap = flo(F(b[2], A[2][j]));
      var umin = cmp(u[0], u[1]) <= 0 ? u[0] : u[1];
      if (isInt(umin) || trap >= corrV || mx === corrV) return null;
      // la "trappola" deve essere davvero non valida: un punto intero ammissibile con x_j > trap
      var pts = interi(A, b), viola = false;
      pts.forEach(function (p) { if (p[j] > trap) viola = true; });
      if (!viola) return null;
      var xn = X[j];
      function o(v) { return { s: "$" + xn + " \\le " + tx(v) + "$", v: fs(v) }; }
      var corr = o(corrV);
      var d = [o(trap), o(mx), o(umin)];
      var vinc = A.map(function (r, i) { return "$" + txIneq(r, "\\le", b[i]) + "$"; }).join(", ");
      var testo = L(lingua,
        "Un problema PLI con $x_1, x_2 \\in \\Z_{\\ge 0}$ ha i vincoli " + vinc + ". Considerando un vincolo alla volta si cercano bound della forma $" + xn + " \\le \\lfloor b_i / a_{ij} \\rfloor$. Qual è il miglior upper bound valido su $" + xn + "$ che se ne ricava?",
        "An ILP problem with $x_1, x_2 \\in \\Z_{\\ge 0}$ has the constraints " + vinc + ". Considering one constraint at a time, we look for bounds of the form $" + xn + " \\le \\lfloor b_i / a_{ij} \\rfloor$. What is the best valid upper bound on $" + xn + "$ obtained in this way?");
      var sp = L(lingua,
        "Si usano solo i vincoli con tutti i coefficienti non negativi: $\\min\\{\\lfloor " + tx(u[0]) + " \\rfloor, \\lfloor " + tx(u[1]) + " \\rfloor\\} = " + corrV + "$. Il terzo vincolo ha un coefficiente negativo e non dà alcun bound; il bound va arrotondato per difetto e si tiene il più piccolo.",
        "Only the constraints with all coefficients non-negative are used: $\\min\\{\\lfloor " + tx(u[0]) + " \\rfloor, \\lfloor " + tx(u[1]) + " \\rfloor\\} = " + corrV + "$. The third constraint has a negative coefficient and gives no bound; the bound is rounded down and the smallest one is kept.");
      return chiudi(rng, testo, corr, d, sp, { A: A, b: b, j: j });
    })
  });

  // ================================================================ 4. moltiplicatori e bound duale
  G.push({
    id: "pli-g-mult", livello: "facile", capitolo: "lp-relaxation", link: link("lp-relaxation", "box-18-prop-dual-bound"),
    genera: ripeti(function (rng, lingua) {
      var ist = istanzaAuto(rng); if (!ist) return null;
      var A = ist.A, b = ist.b, c = ist.c;
      var grid = [F(0), F(1, 4), F(1, 3), F(1, 2), F(2, 3), F(3, 4), F(1), F(3, 2), F(2)];
      function valido(p) { return cmp(p[0], 0) >= 0 && cmp(p[1], 0) >= 0 && cmp(add(mul(A[0][0], p[0]), mul(A[1][0], p[1])), c[0]) >= 0 && cmp(add(mul(A[0][1], p[0]), mul(A[1][1], p[1])), c[1]) >= 0; }
      function ub(p) { return add(mul(b[0], p[0]), mul(b[1], p[1])); }
      var vv = [], nv = [];
      grid.forEach(function (p1) { grid.forEach(function (p2) { var p = [p1, p2]; (valido(p) ? vv : nv).push(p); }); });
      if (!vv.length) return null;
      var pc = pick(rng, vv);
      // distrattori: non negativi che violano una condizione, e uno con un moltiplicatore negativo
      var cand = nv.filter(function (p) { return cmp(ub(p), 0) > 0; });
      if (cand.length < 2) return null;
      var d1 = pick(rng, cand), d2 = pick(rng, cand);
      var pn = [neg(pick(rng, grid.slice(1, 6))), pick(rng, grid.slice(3))];
      if (rng() < 0.5) pn = [pn[1], pn[0]];
      if (cmp(ub(pn), 0) <= 0) return null;
      function o(p) { return { s: "$\\vet\\pi = " + txPt(p) + "$, $\\UB = " + tx(ub(p)) + "$", v: [fs(p[0]), fs(p[1])] }; }
      var corr = o(pc);
      var d = filtra(corr, [o(d1), o(pn), o(d2)]);
      var ubs = {}; [pc, d1, pn, d2].forEach(function (p) { ubs[fs(ub(p))] = (ubs[fs(ub(p))] || 0) + 1; });
      if (Object.keys(ubs).length < 4) return null;
      var testo = L(lingua,
        "Nel problema PLI " + txPLI(ist, lingua) + " si moltiplicano i due vincoli per $\\pi_1$ e $\\pi_2$ e si sommano, per ottenere un upper bound $\\UB = " + b[0] + "\\pi_1 + " + b[1] + "\\pi_2$ sul valore ottimo $z(\\ILP)$. Quale scelta dà un upper bound valido, e quanto vale?",
        "In the ILP problem " + txPLI(ist, lingua) + " the two constraints are multiplied by $\\pi_1$ and $\\pi_2$ and summed, to obtain an upper bound $\\UB = " + b[0] + "\\pi_1 + " + b[1] + "\\pi_2$ on the optimal value $z(\\ILP)$. Which choice gives a valid upper bound, and what is its value?");
      var sp = L(lingua,
        "Servono $\\pi_1, \\pi_2 \\ge 0$ con $" + A[0][0] + "\\pi_1 + " + A[1][0] + "\\pi_2 \\ge " + c[0] + "$ e $" + A[0][1] + "\\pi_1 + " + A[1][1] + "\\pi_2 \\ge " + c[1] + "$; allora $z(\\ILP) \\le " + b[0] + "\\pi_1 + " + b[1] + "\\pi_2$. Gli altri vettori hanno un moltiplicatore negativo o un coefficiente combinato minore del costo.",
        "We need $\\pi_1, \\pi_2 \\ge 0$ with $" + A[0][0] + "\\pi_1 + " + A[1][0] + "\\pi_2 \\ge " + c[0] + "$ and $" + A[0][1] + "\\pi_1 + " + A[1][1] + "\\pi_2 \\ge " + c[1] + "$; then $z(\\ILP) \\le " + b[0] + "\\pi_1 + " + b[1] + "\\pi_2$. The other vectors have a negative multiplier or a combined coefficient smaller than the cost.");
      return chiudi(rng, testo, corr, d, sp, { ist: verIst(ist) });
    })
  });

  // ================================================================ 5. euristica a due passi
  G.push({
    id: "pli-g-two-step", livello: "facile", capitolo: "lp-relaxation", link: link("lp-relaxation", "box-6-ex-heur-car"),
    genera: ripeti(function (rng, lingua) {
      var ist = istanzaAuto(rng); if (!ist) return null;
      var A = ist.A, b = ist.b, c = ist.c, first = ri(rng, 0, 1), second = 1 - first;
      function maxv(j, res) { return Math.min(Math.floor(res[0] / A[0][j]), Math.floor(res[1] / A[1][j])); }
      function due(f) {
        var s = 1 - f, x = [0, 0];
        x[f] = maxv(f, b);
        var res = [b[0] - A[0][f] * x[f], b[1] - A[1][f] * x[f]];
        x[s] = maxv(s, res);
        return x;
      }
      var xc = due(first), xr = due(second);
      var x1 = [0, 0]; x1[first] = maxv(first, b);
      var xn = [0, 0]; xn[first] = maxv(first, b); xn[second] = maxv(second, b);
      function o(x) { return { s: "$\\bar{\\vet x} = " + txPt(x) + "$, $\\LB = " + valore(c, x).n + "$", v: x }; }
      var corr = o(xc);
      var d = filtra(corr, [o(xr), o(x1), o(xn)]);
      if (d.length < 3) return null;
      if (xc[second] === 0) return null;
      var testo = L(lingua,
        "Nel problema PLI " + txPLI(ist, lingua) + " si applica l'euristica a due passi fissando prima $" + X[first] + "$ al suo valore massimo e poi $" + X[second] + "$ al valore massimo con i termini noti residui (valori massimi interi ammessi dai vincoli). Quale soluzione si ottiene, e qual è il suo valore $\\LB$ (lower bound)?",
        "In the ILP problem " + txPLI(ist, lingua) + " the two-step heuristic sets first $" + X[first] + "$ to its maximum value and then $" + X[second] + "$ to its maximum value with the residual right-hand sides (largest integer values allowed by the constraints). Which solution is obtained, and what is its value $\\LB$ (lower bound)?");
      var sp = L(lingua,
        "$" + X[first] + " = \\min\\{\\lfloor " + b[0] + "/" + A[0][first] + " \\rfloor, \\lfloor " + b[1] + "/" + A[1][first] + " \\rfloor\\} = " + xc[first] + "$; con i residui $" + (b[0] - A[0][first] * xc[first]) + "$ e $" + (b[1] - A[1][first] * xc[first]) + "$ si ha $" + X[second] + " = " + xc[second] + "$. Usare i termini noti originali al secondo passo può dare un punto non ammissibile.",
        "$" + X[first] + " = \\min\\{\\lfloor " + b[0] + "/" + A[0][first] + " \\rfloor, \\lfloor " + b[1] + "/" + A[1][first] + " \\rfloor\\} = " + xc[first] + "$; with the residuals $" + (b[0] - A[0][first] * xc[first]) + "$ and $" + (b[1] - A[1][first] * xc[first]) + "$ we get $" + X[second] + " = " + xc[second] + "$. Using the original right-hand sides in the second step can give an infeasible point.");
      return chiudi(rng, testo, corr, d, sp, { ist: verIst(ist), primo: first });
    })
  });

  // ================================================================ 6. conteggio delle soluzioni ammissibili
  G.push({
    id: "pli-g-count", livello: "facile", capitolo: "ilp", link: link("ilp", "box-3-defFeasRegILP"),
    genera: ripeti(function (rng, lingua) {
      var A = [[ri(rng, 2, 6), ri(rng, 1, 4)], [ri(rng, 1, 4), ri(rng, 2, 6)]];
      var b = [ri(rng, 6, 16), ri(rng, 6, 16)];
      var pts = interi(A, b), N = pts.length;
      if (N < 6 || N > 13) return null;
      var U1 = Math.min(Math.floor(b[0] / A[0][0]), Math.floor(b[1] / A[1][0])), U2 = Math.min(Math.floor(b[0] / A[0][1]), Math.floor(b[1] / A[1][1]));
      var box = (U1 + 1) * (U2 + 1);
      var ist = { c: [1, 1], A: A, b: b };
      function o(v) { return { s: "$" + v + "$", v: v }; }
      var corr = o(N);
      var d = filtra(corr, [o(N - 1), o(box), o(N + 1), o(N + 2)]);
      var vinc = A.map(function (r, i) { return "$" + txIneq(r, "\\le", b[i]) + "$"; }).join(", ");
      var testo = L(lingua,
        "Quanti punti ha la regione ammissibile $F$ di un problema PLI con i vincoli " + vinc + " e $x_1, x_2 \\in \\Z_{\\ge 0}$?",
        "How many points does the feasible region $F$ of an ILP problem with the constraints " + vinc + " and $x_1, x_2 \\in \\Z_{\\ge 0}$ have?");
      var sp = L(lingua,
        "$F = P \\cap \\Z^2$: si contano i punti interi non negativi che soddisfano entrambi i vincoli, origine e punti sugli assi compresi; sono $" + N + "$. Il rettangolo dei bound $0 \\le x_1 \\le " + U1 + "$, $0 \\le x_2 \\le " + U2 + "$ ne contiene di più.",
        "$F = P \\cap \\Z^2$: we count the non-negative integer points satisfying both constraints, including the origin and the points on the axes; there are $" + N + "$. The box of the bounds $0 \\le x_1 \\le " + U1 + "$, $0 \\le x_2 \\le " + U2 + "$ contains more points.");
      return chiudi(rng, testo, corr, d, sp, { A: A, b: b, ist: ist });
    })
  });

  // ================================================================ 7. disuguaglianza per arrotondamento (Prop. 4.3)
  G.push({
    id: "pli-g-rounding-vi", livello: "facile", capitolo: "valid-inequalities", link: link("valid-inequalities", "box-4-prop-rounding"),
    genera: ripeti(function (rng, lingua) {
      var A = [[ri(rng, 1, 9), ri(rng, 1, 9)], [ri(rng, 1, 9), ri(rng, 1, 9)]];
      var b = [ri(rng, 10, 40), ri(rng, 10, 40)];
      var P = [F(0), F(1, 4), F(1, 3), F(1, 2), F(2, 3), F(3, 4)];
      var p = [pick(rng, P), pick(rng, P)];
      if (F(p[0]).n === 0 && F(p[1]).n === 0) return null;
      var comb = [add(mul(p[0], A[0][0]), mul(p[1], A[1][0])), add(mul(p[0], A[0][1]), mul(p[1], A[1][1]))];
      var rhs = add(mul(p[0], b[0]), mul(p[1], b[1]));
      if (isInt(rhs) || intero(comb)) return null;
      var al = [flo(comb[0]), flo(comb[1])], au = [cei(comb[0]), cei(comb[1])];
      if (al[0] === 0 && al[1] === 0) return null;
      function o(co, r) { return { s: "$" + txIneq(co, "\\le", r) + "$", v: [co.map(fs), fs(r)] }; }
      var corr = o(al, flo(rhs));
      var d = [o(al, cei(rhs)), o(au, flo(rhs)), o(al, rhs)];
      var testo = L(lingua,
        "Un problema PLI con $x_1, x_2 \\in \\Z_{\\ge 0}$ ha i vincoli $" + txIneq(A[0], "\\le", b[0]) + "$ e $" + txIneq(A[1], "\\le", b[1]) + "$. Con i moltiplicatori $\\pi_1 = " + tx(p[0]) + "$, $\\pi_2 = " + tx(p[1]) + "$ si sommano i vincoli moltiplicati, si prendono i coefficienti $\\alpha_j = \\lfloor \\pi_1 a_{1j} + \\pi_2 a_{2j} \\rfloor$ e si sfrutta l'integralità del membro sinistro. Quale disuguaglianza valida si ottiene?",
        "An ILP problem with $x_1, x_2 \\in \\Z_{\\ge 0}$ has the constraints $" + txIneq(A[0], "\\le", b[0]) + "$ and $" + txIneq(A[1], "\\le", b[1]) + "$. With the multipliers $\\pi_1 = " + tx(p[0]) + "$, $\\pi_2 = " + tx(p[1]) + "$ the multiplied constraints are summed, the coefficients $\\alpha_j = \\lfloor \\pi_1 a_{1j} + \\pi_2 a_{2j} \\rfloor$ are taken and the integrality of the left-hand side is exploited. Which valid inequality is obtained?");
      var sp = L(lingua,
        "La combinazione è $" + txIneq(comb, "\\le", rhs) + "$; con $\\alpha = (" + al.join(", ") + ")$ il membro sinistro è intero, quindi il termine noto si arrotonda per difetto a $" + flo(rhs) + "$. Arrotondare per eccesso il termine noto o i coefficienti non dà la disuguaglianza più forte ottenibile.",
        "The combination is $" + txIneq(comb, "\\le", rhs) + "$; with $\\alpha = (" + al.join(", ") + ")$ the left-hand side is integer, so the right-hand side is rounded down to $" + flo(rhs) + "$. Rounding up the right-hand side or the coefficients does not give the strongest inequality obtainable.");
      return chiudi(rng, testo, corr, d, sp, { A: A, b: b, pi: p.map(fs) });
    })
  });

  // ================================================================ 8. disuguaglianza valida saturata (media)
  G.push({
    id: "pli-g-tight", livello: "media", capitolo: "valid-inequalities", link: link("valid-inequalities", "box-2-def-tight"),
    genera: ripeti(function (rng, lingua) {
      var ist = istanzaAuto(rng); if (!ist) return null;
      var pts = interi(ist.A, ist.b);
      if (pts.length > 30) return null;
      var al = pick(rng, [[1, 1], [1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2]]);
      var best = -1; pts.forEach(function (p) { best = Math.max(best, al[0] * p[0] + al[1] * p[1]); });
      var lpv = add(mul(al[0], ist.lp.x[0]), mul(al[1], ist.lp.x[1]));
      if (cmp(lpv, best + 1) < 0) return null;            // il taglio saturato deve eliminare l'ottimo LP
      function o(r) { return { s: "$" + txIneq(al, "\\le", r) + "$", v: r }; }
      var corr = o(best);
      var d = filtra(corr, [o(best - 1), o(best + 1), o(flo(lpv)), o(best + 2)]);
      var testo = L(lingua,
        "Nel problema PLI " + txPLI(ist, lingua) + " si cerca una disuguaglianza con coefficienti $\\alpha = (" + al.join(", ") + ")$. Quale delle seguenti è valida (soddisfatta da tutti i punti interi ammissibili $F$) e saturata (soddisfatta all'uguaglianza da almeno un punto di $F$)?",
        "In the ILP problem " + txPLI(ist, lingua) + " we look for an inequality with coefficients $\\alpha = (" + al.join(", ") + ")$. Which of the following is valid (satisfied by all the feasible integer points $F$) and tight (satisfied with equality by at least one point of $F$)?");
      var sp = L(lingua,
        "Il termine noto più piccolo valido è il massimo di $" + txLin(al, X) + "$ su $F$, cioè $" + best + "$, raggiunto da un punto intero ammissibile (si abbassa il termine noto finché la retta tocca un punto di $F$). Con $" + (best - 1) + "$ si perde una soluzione ammissibile; con un termine noto maggiore è valida ma non saturata.",
        "The smallest valid right-hand side is the maximum of $" + txLin(al, X) + "$ over $F$, that is $" + best + "$, attained by a feasible integer point (lower the right-hand side until the line touches a point of $F$). With $" + (best - 1) + "$ a feasible solution is lost; with a larger right-hand side it is valid but not tight.");
      return chiudi(rng, testo, corr, d, sp, { ist: verIst(ist), alpha: al });
    })
  });

  // ================================================================ 9. vertici dell'inviluppo convesso (media)
  function inviluppo(pts) {                              // catena monotona, senza punti allineati
    var p = pts.slice().sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; });
    if (p.length < 3) return p;
    function cr(o, a, b) { return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); }
    var lo = [], up = [];
    p.forEach(function (q) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); });
    for (var i = p.length - 1; i >= 0; i--) { var q = p[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
    return lo.slice(0, -1).concat(up.slice(0, -1));
  }
  G.push({
    id: "pli-g-hull", livello: "media", capitolo: "ideal-formulations", link: link("ideal-formulations", "box-1-def-hull"),
    genera: ripeti(function (rng, lingua) {
      var A = [[ri(rng, 2, 7), ri(rng, 1, 4)], [ri(rng, 1, 4), ri(rng, 2, 7)]];
      var b = [ri(rng, 8, 24), ri(rng, 8, 24)];
      var pts = interi(A, b);
      if (pts.length < 7 || pts.length > 16) return null;
      var h = inviluppo(pts), v = h.length;
      var r = lp2([1, 1], [[A[0][0], A[0][1], b[0]], [A[1][0], A[1][1], b[1]]].concat(nonneg()));
      var vp = r.vertici.length;
      if (r.vertici.every(intero)) return null;             // formulazione già ideale: domanda banale
      function o(k) { return { s: "$" + k + "$", v: k }; }
      var corr = o(v);
      var d = filtra(corr, [o(vp), o(v + 1), o(v - 1), o(v + 2)]);
      var vinc = A.map(function (rr, i) { return "$" + txIneq(rr, "\\le", b[i]) + "$"; }).join(", ");
      var testo = L(lingua,
        "Un problema PLI ha i vincoli " + vinc + " e $x_1, x_2 \\in \\Z_{\\ge 0}$. Sia $F$ l'insieme delle sue soluzioni (intere) ammissibili. Quanti vertici ha l'inviluppo convesso $\\mathrm{conv}(F)$?",
        "An ILP problem has the constraints " + vinc + " and $x_1, x_2 \\in \\Z_{\\ge 0}$. Let $F$ be the set of its feasible (integer) solutions. How many vertices does the convex hull $\\mathrm{conv}(F)$ have?");
      var sp = L(lingua,
        "Si elencano i $" + pts.length + "$ punti di $F$ e si prende il poligono convesso più piccolo che li contiene: i suoi vertici sono $" + h.map(function (q) { return "(" + q[0] + "," + q[1] + ")"; }).join(", ") + "$. I punti sui lati che non sono vertici non contano, e i vertici del poliedro $P$ dei vincoli ($" + vp + "$) non sono tutti interi.",
        "List the $" + pts.length + "$ points of $F$ and take the smallest convex polygon containing them: its vertices are $" + h.map(function (q) { return "(" + q[0] + "," + q[1] + ")"; }).join(", ") + "$. Points on the edges that are not vertices do not count, and the vertices of the polyhedron $P$ of the constraints ($" + vp + "$) are not all integer.");
      return chiudi(rng, testo, corr, d, sp, { A: A, b: b });
    })
  });

  // ================================================================ cover: utilità
  function zaino(rng, n) {
    for (var t = 0; t < 200; t++) {
      var a = []; for (var j = 0; j < n; j++) a.push(ri(rng, 2, 11));
      var s = a.reduce(function (u, v) { return u + v; }, 0);
      var mx = Math.max.apply(null, a);
      var b = ri(rng, Math.max(mx, Math.floor(s / 2)), s - 2);
      if (b < mx || s <= b) continue;
      return { a: a, b: b };
    }
    return null;
  }
  function sommaA(a, C) { return C.reduce(function (u, j) { return u + a[j]; }, 0); }
  function eCover(z, C) { return sommaA(z.a, C) > z.b; }
  function minimale(z, C) { return eCover(z, C) && C.every(function (i) { return sommaA(z.a, C) - z.a[i] <= z.b; }); }
  function sottoinsiemi(n) { var out = []; for (var m = 1; m < (1 << n); m++) { var C = []; for (var j = 0; j < n; j++) if (m & (1 << j)) C.push(j); out.push(C); } return out; }
  function txZaino(z) { return "$" + txIneq(z.a, "\\le", z.b) + "$, $x_j \\in \\{0,1\\}$"; }
  function txCov(C, rhs) { return "$" + C.map(function (j) { return X[j]; }).join(" + ") + " \\le " + rhs + "$"; }

  // ================================================================ 10. cover minimale
  G.push({
    id: "pli-g-cover-min", livello: "facile", capitolo: "cover", link: link("cover", "box-5-def-minimal"),
    genera: ripeti(function (rng, lingua) {
      var z = zaino(rng, 5); if (!z) return null;
      var S = sottoinsiemi(5);
      var mins = S.filter(function (C) { return minimale(z, C) && C.length >= 2; });
      var nonmin = S.filter(function (C) { return eCover(z, C) && !minimale(z, C) && C.length <= 4; });
      var nonc = S.filter(function (C) { return !eCover(z, C) && C.length >= 2; });
      if (!mins.length || !nonmin.length || !nonc.length) return null;
      var C = pick(rng, mins), D = pick(rng, nonmin), E = pick(rng, nonc), M2 = pick(rng, mins);
      function o(K, r) { return { s: txCov(K, r), v: [K, r] }; }
      var corr = o(C, C.length - 1);
      var d = filtra(corr, [o(D, D.length - 1), o(E, E.length - 1), o(M2, M2.length)]);
      var testo = L(lingua,
        "Si consideri il vincolo " + txZaino(z) + ". Un cover è un insieme $C$ di indici con $\\sum_{j \\in C} a_j > " + z.b + "$, minimale se nessun suo sottoinsieme proprio è un cover; la sua disuguaglianza è $\\sum_{j \\in C} x_j \\le |C| - 1$. Quale delle seguenti è la disuguaglianza di un cover minimale?",
        "Consider the constraint " + txZaino(z) + ". A cover is a set $C$ of indices with $\\sum_{j \\in C} a_j > " + z.b + "$, minimal if no proper subset of it is a cover; its inequality is $\\sum_{j \\in C} x_j \\le |C| - 1$. Which of the following is the inequality of a minimal cover?");
      var sp = L(lingua,
        "$C = " + txIdx(C) + "$ ha $\\sum_{j \\in C} a_j = " + sommaA(z.a, C) + " > " + z.b + "$ e togliendo un qualsiasi indice la somma scende a $\\le " + z.b + "$; la disuguaglianza è $\\sum_{j \\in C} x_j \\le |C| - 1$. Un insieme con somma $\\le b$ non è un cover, e un cover che contiene un cover più piccolo non è minimale.",
        "$C = " + txIdx(C) + "$ has $\\sum_{j \\in C} a_j = " + sommaA(z.a, C) + " > " + z.b + "$ and removing any index brings the sum to $\\le " + z.b + "$; the inequality is $\\sum_{j \\in C} x_j \\le |C| - 1$. A set with sum $\\le b$ is not a cover, and a cover containing a smaller cover is not minimal.");
      return chiudi(rng, testo, corr, d, sp, { a: z.a, b: z.b });
    })
  });

  // ================================================================ 11. separazione dei cover (media)
  G.push({
    id: "pli-g-cover-sep", livello: "media", capitolo: "cover", link: link("cover", "sez-sec-separation"),
    genera: ripeti(function (rng, lingua) {
      var n = 5, z = zaino(rng, n); if (!z) return null;
      // punto frazionario di P: alcune componenti 1, una o due frazionarie, le altre 0
      var vals = [F(1), F(1), F(0), F(1, 2), F(2, 3), F(3, 4), F(1, 3), F(1, 4), F(3, 5), F(4, 5)];
      var x = []; for (var j = 0; j < n; j++) x.push(pick(rng, vals));
      if (!ammissibile([z.a], [z.b], x) || intero(x)) return null;
      var S = sottoinsiemi(n), covers = S.filter(function (C) { return eCover(z, C); });
      function q(C) { var s = F(0); C.forEach(function (j) { s = add(s, sub(1, x[j])); }); return s; }
      function viol(C) { var s = F(0); C.forEach(function (j) { s = add(s, x[j]); }); return sub(s, C.length - 1); }
      var qmin = null; covers.forEach(function (C) { var v = q(C); if (qmin === null || cmp(v, qmin) < 0) qmin = v; });
      if (cmp(qmin, 1) >= 0 || F(qmin).n === 0) return null;
      var opt = covers.filter(function (C) { return eq(q(C), qmin); }).sort(function (u, v) { return u.length - v.length; })[0];
      var vmax = sub(1, qmin);
      // distrattori: sottoinsieme non cover con la stessa "violazione", cover meno violato, valore confuso con il costo
      var uno = opt.filter(function (j) { return eq(x[j], 1); });
      var nonc = null;
      for (var k = 0; k < uno.length; k++) { var T = opt.filter(function (j) { return j !== uno[k]; }); if (!eCover(z, T) && T.length >= 2) { nonc = T; break; } }
      var altri = covers.filter(function (C) { return cmp(viol(C), 0) > 0 && cmp(viol(C), vmax) < 0 && C.length <= 4; });
      if (!nonc || !altri.length) return null;
      var C2 = pick(rng, altri);
      function o(C, v) { return { s: txCov(C, C.length - 1) + L(lingua, ", violazione $", ", violation $") + tx(v) + "$", v: [C, fs(v)] }; }
      var corr = o(opt, vmax);
      var d = filtra(corr, [o(nonc, viol(nonc)), o(C2, viol(C2)), o(opt, qmin)]);
      var testo = L(lingua,
        "Per il vincolo " + txZaino(z) + " si separa il punto $\\tilde{\\vet x} = " + txPt(x) + "$. Un cover è un insieme $C$ di indici con $\\sum_{j \\in C} a_j > " + z.b + "$, con disuguaglianza $\\sum_{j \\in C} x_j \\le |C| - 1$; la violazione è il membro sinistro in $\\tilde{\\vet x}$ meno il termine noto. Quale disuguaglianza di cover è violata al massimo da $\\tilde{\\vet x}$, e di quanto?",
        "For the constraint " + txZaino(z) + " we separate the point $\\tilde{\\vet x} = " + txPt(x) + "$. A cover is a set $C$ of indices with $\\sum_{j \\in C} a_j > " + z.b + "$, with inequality $\\sum_{j \\in C} x_j \\le |C| - 1$; the violation is the left-hand side at $\\tilde{\\vet x}$ minus the right-hand side. Which cover inequality is maximally violated by $\\tilde{\\vet x}$, and by how much?");
      var sp = L(lingua,
        "Si cerca il cover di costo minimo $\\sum_{j \\in C} (1 - \\tilde x_j)$: è $" + txIdx(opt) + "$ con costo $z(\\mathrm{CSP}) = " + tx(qmin) + " < 1$, quindi la violazione massima è $1 - z(\\mathrm{CSP}) = " + tx(vmax) + "$. Togliendo un indice con $\\tilde x_j = 1$ la somma dei coefficienti può scendere sotto $b$: non è più un cover.",
        "We look for the cover of minimum cost $\\sum_{j \\in C} (1 - \\tilde x_j)$: it is $" + txIdx(opt) + "$ with cost $z(\\mathrm{CSP}) = " + tx(qmin) + " < 1$, so the maximum violation is $1 - z(\\mathrm{CSP}) = " + tx(vmax) + "$. Removing an index with $\\tilde x_j = 1$ can bring the sum of the coefficients below $b$: it is no longer a cover.");
      return chiudi(rng, testo, corr, d, sp, { a: z.a, b: z.b, x: x.map(fs) });
    })
  });

  // ================================================================ 12. cover estesa
  G.push({
    id: "pli-g-cover-ext", livello: "facile", capitolo: "cover", link: link("cover", "box-18-def-extended"),
    genera: ripeti(function (rng, lingua) {
      var n = 5, z = zaino(rng, n); if (!z) return null;
      var mins = sottoinsiemi(n).filter(function (C) { return minimale(z, C) && C.length >= 2 && C.length <= 3; });
      if (!mins.length) return null;
      var C = pick(rng, mins);
      var amax = Math.max.apply(null, C.map(function (j) { return z.a[j]; }));
      var amin = Math.min.apply(null, C.map(function (j) { return z.a[j]; }));
      var fuori = []; for (var j = 0; j < n; j++) if (C.indexOf(j) < 0) fuori.push(j);
      function un(cond) { return C.concat(fuori.filter(cond)).sort(); }
      var E = un(function (j) { return z.a[j] >= amax; });
      if (E.length === C.length) return null;
      var Es = un(function (j) { return z.a[j] > amax; }), Em = un(function (j) { return z.a[j] >= amin; });
      function o(K, r) { return { s: txCov(K, r), v: [K, r] }; }
      var corr = o(E, C.length - 1);
      var pool = [o(E, E.length - 1)];
      if (Es.join() !== E.join()) pool.push(o(Es, C.length - 1));
      if (Em.join() !== E.join()) pool.push(o(Em, C.length - 1));
      pool.push(o(C, C.length - 1));
      var d = filtra(corr, pool);
      var testo = L(lingua,
        "Per il vincolo " + txZaino(z) + " si considera il cover $C = " + txIdx(C) + "$ ($\\sum_{j \\in C} a_j > " + z.b + "$). Sia $E(C) = C \\cup \\{j \\notin C : a_j \\ge \\max_{i \\in C} a_i\\}$. Qual è la disuguaglianza di cover estesa di $C$, sulle variabili di $E(C)$?",
        "For the constraint " + txZaino(z) + " consider the cover $C = " + txIdx(C) + "$ ($\\sum_{j \\in C} a_j > " + z.b + "$). Let $E(C) = C \\cup \\{j \\notin C : a_j \\ge \\max_{i \\in C} a_i\\}$. What is the extended cover inequality of $C$, on the variables of $E(C)$?");
      var sp = L(lingua,
        "$\\widehat a(C) = " + amax + "$, quindi $E(C) = C \\cup \\{j \\notin C : a_j \\ge " + amax + "\\} = " + txIdx(E) + "$, e il termine noto resta $|C| - 1 = " + (C.length - 1) + "$, non $|E(C)| - 1$.",
        "$\\widehat a(C) = " + amax + "$, so $E(C) = C \\cup \\{j \\notin C : a_j \\ge " + amax + "\\} = " + txIdx(E) + "$, and the right-hand side stays $|C| - 1 = " + (C.length - 1) + "$, not $|E(C)| - 1$.");
      return chiudi(rng, testo, corr, d, sp, { a: z.a, b: z.b, C: C });
    })
  });

  // ================================================================ 13. taglio di Gomory da una riga
  G.push({
    id: "pli-g-gomory-row", livello: "facile", capitolo: "gomory", link: link("gomory", "box-2-def-gomory-cut"),
    genera: ripeti(function (rng, lingua) {
      var den = [2, 3, 4, 5, 6, 8, 10];
      var nn = mescola(rng, ["x_3", "x_4", "x_5", "x_6"]).slice(0, 2).sort();
      var obj = rng() < 0.3;
      var a = [], ok = false;
      for (var q = 0; q < 2; q++) {
        var dd = pick(rng, den), v = F(ri(rng, -2 * dd, 2 * dd), dd);
        if (obj) v = F(-Math.abs(v.n) || -1, v.d);          // nella riga dell'obiettivo i coefficienti ridotti sono <= 0 (scritti come -(-cbar))
        a.push(v);
      }
      var bd = pick(rng, den), bb = F(ri(rng, bd + 1, 6 * bd), bd);
      if (isInt(bb) || eq(frac(bb), F(1, 2))) return null;
      var base = obj ? "z" : pick(rng, ["x_1", "x_2"]);
      // riga scritta come base = bb - sum abar x ; per l'obiettivo abar = -cbar
      var abar = obj ? a.map(neg) : a;
      if (!abar.some(function (v) { return !isInt(v) && !eq(frac(v), F(1, 2)); })) return null;
      if (abar.every(function (v) { return isInt(v); })) return null;
      var f = abar.map(frac), fsg = abar.map(function (v) { return frac(neg(v)); });
      function o(co, rel, r) { return { s: "$" + txIneq(co, rel, r, nn) + "$", v: [co.map(fs), rel, fs(r)] }; }
      var corr = o(f, "\\ge", frac(bb));
      var d = [o(fsg, "\\ge", frac(bb)), o(f, "\\ge", sub(cei(bb), bb)), o(f, "\\le", frac(bb))];
      var riga = "$" + txRiga(base, bb, abar, nn) + "$";
      var testo = L(lingua,
        "La riga " + riga + " appartiene a un dizionario ammissibile del rilassamento lineare (in forma standard) di un problema PLI con dati interi, in cui tutte le variabili, scarti compresi, sono intere; $" + nn.join("$ e $") + "$ sono fuori base. Qual è il taglio frazionario di Gomory generato da questa riga?",
        "The row " + riga + " belongs to a feasible dictionary of the LP relaxation (in standard form) of an ILP problem with integer data, in which all variables, slacks included, are integer; $" + nn.join("$ and $") + "$ are non-basic. What is the Gomory fractional cut generated by this row?");
      var sp = L(lingua,
        "Scritta la riga come $" + base + " = \\bar b - \\sum_j \\bar a_j x_j$, il taglio è $\\sum_j (\\bar a_j - \\lfloor \\bar a_j \\rfloor) x_j \\ge \\bar b - \\lfloor \\bar b \\rfloor$: la parte frazionaria va presa del coefficiente $\\bar a_j$ (con il segno opposto a quello che compare nella riga), e $\\lfloor -\\frac{1}{5} \\rfloor = -1$.",
        "Writing the row as $" + base + " = \\bar b - \\sum_j \\bar a_j x_j$, the cut is $\\sum_j (\\bar a_j - \\lfloor \\bar a_j \\rfloor) x_j \\ge \\bar b - \\lfloor \\bar b \\rfloor$: the fractional part is taken of the coefficient $\\bar a_j$ (with the sign opposite to the one shown in the row), and $\\lfloor -\\frac{1}{5} \\rfloor = -1$.");
      return chiudi(rng, testo, corr, d, sp, { abar: abar.map(fs), bbar: fs(bb) });
    })
  });

  // ================================================================ Gomory: istanza con dizionario ottimo e taglio primitivo
  function istanzaGomory(rng) {
    var ist = istanzaAuto(rng); if (!ist) return null;
    var dz = dizionario(ist);
    if (!(cmp(dz.cbar[0], 0) < 0 && cmp(dz.cbar[1], 0) < 0)) return null;
    if (intero(dz.bbar)) return null;
    if (ist.A[0][0] * ist.A[1][1] - ist.A[0][1] * ist.A[1][0] > 160) return null;
    return { ist: ist, dz: dz };
  }
  // candidati: righe 0, 1 (x1, x2) e "z"; regola: parte frazionaria massima, a parità indice minimo, obiettivo per ultimo
  function righeGomory(g) {
    var dz = g.dz, out = [];
    [0, 1].forEach(function (i) { if (!isInt(dz.bbar[i])) out.push({ riga: i, f: frac(dz.bbar[i]), co: dz.abar[i], b: dz.bbar[i] }); });
    if (!isInt(dz.zbar)) out.push({ riga: "z", f: frac(dz.zbar), co: dz.cbar.map(neg), b: dz.zbar });
    out.sort(function (u, v) { var c = cmp(v.f, u.f); if (c) return c; var iu = u.riga === "z" ? 9 : u.riga, iv = v.riga === "z" ? 9 : v.riga; return iu - iv; });
    return out;
  }
  // taglio sum f_q x_{q} >= f0 negli scarti -> forma primitiva nelle x
  function primitivo(ist, f3, f4, f0) {
    var A = ist.A, b = ist.b;
    var p = [add(mul(f3, A[0][0]), mul(f4, A[1][0])), add(mul(f3, A[0][1]), mul(f4, A[1][1]))];
    var R = sub(add(mul(f3, b[0]), mul(f4, b[1])), f0);
    var Lc = lcm(F(p[0]).d, F(p[1]).d);
    var q = [mul(p[0], Lc).n, mul(p[1], Lc).n];
    var g = gcd(q[0], q[1]);
    if (g === 0) return null;
    var co = [q[0] / g, q[1] / g], rr = div(mul(R, Lc), g);
    return { co: co, rhs: flo(rr), debole: rr, R: R, p: p };
  }
  function tagliDa(g, riga, segnoSbagliato) {
    var co = riga.co.map(function (v) { return segnoSbagliato ? frac(neg(v)) : frac(v); });
    return primitivo(g.ist, co[0], co[1], riga.f);
  }
  function txTaglio(t, rhs) { return "$" + txIneq(t.co, "\\le", rhs === undefined ? t.rhs : rhs) + "$"; }
  function nomeRiga(r, lingua) { return r.riga === "z" ? L(lingua, "la riga dell'obiettivo", "the objective-function row") : L(lingua, "la riga di $x_" + (r.riga + 1) + "$", "the row of $x_" + (r.riga + 1) + "$"); }
  function stessoSemispazio(t1, r1, t2, r2) {
    // co primitivi interi: stessi coefficienti e stesso termine noto
    return t1.co[0] === t2.co[0] && t1.co[1] === t2.co[1] && eq(r1, r2);
  }
  function testoGomory(g, lingua) {
    return L(lingua,
      "Si consideri il problema PLI " + txPLI(g.ist, lingua) + ". Con gli scarti " + txScarti(g.ist) + ", il dizionario ottimo del rilassamento lineare è " + txDiz(g.dz) + ". Si genera un taglio frazionario di Gomory dalla riga con il termine noto di parte frazionaria massima (a parità, la variabile di base di indice minimo; la riga dell'obiettivo per ultima), lo si riscrive nelle variabili originali e lo si rende primitivo (diviso per il MCD dei coefficienti, termine noto arrotondato per difetto).",
      "Consider the ILP problem " + txPLI(g.ist, lingua) + ". With the slack variables " + txScarti(g.ist) + ", the optimal dictionary of the LP relaxation is " + txDiz(g.dz) + ". A Gomory fractional cut is generated from the row whose right-hand side has the largest fractional part (ties: the basic variable with the smallest index; the objective-function row last), rewritten in the original variables and made primitive (divided by the gcd of the coefficients, right-hand side rounded down).");
  }

  // ================================================================ 14. taglio di Gomory in forma primitiva (media)
  G.push({
    id: "pli-g-gomory-primitive", livello: "media", capitolo: "gomory", link: link("gomory", "612-inclusion-of-gomory-fractional-cuts-into-the-simplex-dictionary", "612-inserimento-dei-tagli-frazionari-di-gomory-nel-dizionario-del-simplesso"),
    genera: ripeti(function (rng, lingua) {
      var g = istanzaGomory(rng); if (!g) return null;
      var rr = righeGomory(g); if (!rr.length) return null;
      var t = tagliDa(g, rr[0], false); if (!t) return null;
      if (t.co[0] < 0 || t.co[1] < 0 || (t.co[0] === 0 && t.co[1] === 0)) return null;
      function o(tt, rhs) { return { s: txTaglio(tt, rhs), v: [tt.co, fs(rhs)] }; }
      var corr = o(t, t.rhs);
      var pool = [];
      if (!isInt(t.debole)) { pool.push(o(t, t.debole)); pool.push(o(t, cei(t.debole))); }
      var ts = tagliDa(g, rr[0], true);
      if (ts && !(ts.co[0] === 0 && ts.co[1] === 0) && !stessoSemispazio(ts, ts.rhs, t, t.rhs)) pool.push(o(ts, ts.rhs));
      if (rr.length > 1) { var t2 = tagliDa(g, rr[1], false); if (t2 && !stessoSemispazio(t2, t2.rhs, t, t.rhs)) pool.push(o(t2, t2.rhs)); }
      pool.push(o(t, t.rhs - 1));
      var d = filtra(corr, pool);
      var testo = testoGomory(g, lingua) + L(lingua, " Qual è il taglio ottenuto?", " Which cut is obtained?");
      var sp = L(lingua,
        "Si sceglie " + nomeRiga(rr[0], lingua) + " (parte frazionaria $" + tx(rr[0].f) + "$); il taglio negli scarti, sostituito $x_3$ e $x_4$, diventa $" + txIneq(t.p, "\\le", t.R) + "$, e la forma primitiva è $" + txIneq(t.co, "\\le", t.rhs) + "$. Solo dopo si aggiunge la variabile di scarto: senza arrotondare il termine noto si ottiene il taglio più debole.",
        "We choose " + nomeRiga(rr[0], lingua) + " (fractional part $" + tx(rr[0].f) + "$); the cut in the slack variables, after substituting $x_3$ and $x_4$, becomes $" + txIneq(t.p, "\\le", t.R) + "$, and the primitive form is $" + txIneq(t.co, "\\le", t.rhs) + "$. Only then the slack variable is added: without rounding the right-hand side we get the weaker cut.");
      return chiudi(rng, testo, corr, d, sp, { ist: verIst(g.ist) });
    })
  });

  // ================================================================ 15. Gomory: taglio e riottimizzazione (complessa)
  G.push({
    id: "pli-g-gomory-reopt", livello: "complessa", capitolo: "gomory", link: link("gomory", "623-re-optimization-with-the-dual-simplex-algorithm", "623-riottimizzazione-con-lalgoritmo-del-simplesso-duale"),
    genera: ripeti(function (rng, lingua) {
      var g = istanzaGomory(rng); if (!g) return null;
      var rr = righeGomory(g); if (!rr.length) return null;
      var t = tagliDa(g, rr[0], false); if (!t) return null;
      var base = vincoliAuto(g.ist);
      function lpcon(co, rhs) { return lp2(g.ist.c, base.concat([[co[0], co[1], rhs]])); }
      var r2 = lpcon(t.co, t.rhs);
      if (r2.stato !== "ott" || !r2.unico) return null;
      function o(r) { return { s: "$\\tilde{\\vet x}(\\LP_2) = " + txPt(r.x) + "$, $z(\\LP_2) = " + tx(r.z) + "$, $\\UB = " + flo(r.z) + "$", v: [r.x.map(fs), fs(r.z)] }; }
      var corr = o(r2);
      var pool = [];
      if (!isInt(t.debole)) { var rw = lpcon(t.co, t.debole); if (rw.stato === "ott" && rw.unico) pool.push(o(rw)); }
      var ts = tagliDa(g, rr[0], true);
      if (ts) { var rs = lpcon(ts.co, ts.rhs); if (rs.stato === "ott" && rs.unico) pool.push(o(rs)); }
      if (rr.length > 1) { var t2 = tagliDa(g, rr[1], false); if (t2) { var r3 = lpcon(t2.co, t2.rhs); if (r3.stato === "ott" && r3.unico) pool.push(o(r3)); } }
      var rd = lpcon(t.co, t.rhs - 1); if (rd.stato === "ott" && rd.unico) pool.push(o(rd));
      pool.push(o(g.ist.lp));
      var d = filtra(corr, pool);
      var testo = testoGomory(g, lingua) + L(lingua,
        " Il taglio si aggiunge al rilassamento e si riottimizza (simplesso duale). Qual è la soluzione ottima del nuovo problema $\\LP_2$?",
        " The cut is added to the relaxation, which is re-optimized (dual simplex algorithm). What is the optimal solution of the new problem $\\LP_2$?");
      var sp = L(lingua,
        "Il taglio primitivo è $" + txIneq(t.co, "\\le", t.rhs) + "$ (da " + nomeRiga(rr[0], lingua) + "). Aggiunto ai vincoli, l'ottimo di $\\LP_2$ è $" + txPt(r2.x) + "$ con $z(\\LP_2) = " + tx(r2.z) + "$, quindi $z(\\ILP) \\le " + flo(r2.z) + "$.",
        "The primitive cut is $" + txIneq(t.co, "\\le", t.rhs) + "$ (from " + nomeRiga(rr[0], lingua) + "). Added to the constraints, the optimum of $\\LP_2$ is $" + txPt(r2.x) + "$ with $z(\\LP_2) = " + tx(r2.z) + "$, hence $z(\\ILP) \\le " + flo(r2.z) + "$.");
      return chiudi(rng, testo, corr, d, sp, { ist: verIst(g.ist) });
    })
  });

  // ================================================================ 16. variabile di branching e vincoli dei figli
  G.push({
    id: "pli-g-branch", livello: "facile", capitolo: "bb", link: link("bb", "723-branching-operations", "723-operazioni-di-branching"),
    genera: ripeti(function (rng, lingua) {
      var n = 4, x = [], fr = [];
      var den = [2, 3, 4, 5, 8, 10];
      for (var j = 0; j < n; j++) {
        if (rng() < 0.4) x.push(F(ri(rng, 0, 6)));
        else { var dd = pick(rng, den); x.push(F(ri(rng, 0, 5) * dd + ri(rng, 1, dd - 1), dd)); }
      }
      x.forEach(function (v, k) { if (!isInt(v)) fr.push(k); });
      var ints = []; x.forEach(function (v, k) { if (isInt(v)) ints.push(k); });
      if (fr.length < 2 || !ints.length) return null;
      function fv(k) { var a = frac(x[k]), b = sub(1, a); return cmp(a, b) <= 0 ? a : b; }
      // nessun pareggio fra i valori frazionari (strategie univoche)
      for (var u = 0; u < fr.length; u++) for (var w = u + 1; w < fr.length; w++) if (eq(fv(fr[u]), fv(fr[w]))) return null;
      var minI = fr.slice().sort(function (p, q) { return cmp(fv(p), fv(q)); })[0];
      var maxI = fr.slice().sort(function (p, q) { return cmp(fv(q), fv(p)); })[0];
      var st = { small: fr[0], large: fr[fr.length - 1], minInf: minI, maxInf: maxI };
      var chiavi = ["small", "large", "minInf", "maxInf"];
      var k0 = pick(rng, chiavi), jc = st[k0];
      var altri = chiavi.map(function (k) { return st[k]; }).filter(function (j) { return j !== jc; });
      if (!altri.length) return null;
      var jo = altri[0], ji = pick(rng, ints);
      var nome = {
        small: L(lingua, "lessicografica (indice minimo)", "lexicographic (smallest index)"),
        large: L(lingua, "lessicografica (indice massimo)", "lexicographic (largest index)"),
        minInf: L(lingua, "minima inammissibilità (variabile frazionaria più vicina a un intero)", "minimum infeasibility (fractional variable closest to an integer)"),
        maxInf: L(lingua, "massima inammissibilità (variabile frazionaria più lontana da un intero)", "maximum infeasibility (fractional variable farthest from an integer)")
      }[k0];
      function o(j, lo, hi) { return { s: "$x_" + (j + 1) + " \\le " + lo + "$ " + L(lingua, "e", "and") + " $x_" + (j + 1) + " \\ge " + hi + "$", v: [j, lo, hi] }; }
      var fl = flo(x[jc]);
      var corr = o(jc, fl, fl + 1);
      var d = filtra(corr, [o(jo, flo(x[jo]), flo(x[jo]) + 1), o(ji, flo(x[ji]), flo(x[ji]) + 1), o(jc, fl + 1, fl + 2)]);
      var testo = L(lingua,
        "Nel nodo $k$ di un branch-and-bound per un problema PLI con quattro variabili intere, il rilassamento lineare ha soluzione $\\tilde{\\vet x}(\\LP_k) = " + txPt(x) + "$. Con la strategia " + nome + " per la scelta della variabile di branching, quali sono i vincoli dei due figli?",
        "At node $k$ of a branch-and-bound algorithm for an ILP problem with four integer variables, the LP relaxation has solution $\\tilde{\\vet x}(\\LP_k) = " + txPt(x) + "$. With the " + nome + " branching-variable selection strategy, what are the constraints of the two children?");
      var sp = L(lingua,
        "La strategia sceglie $x_" + (jc + 1) + " = " + tx(x[jc]) + "$; i figli hanno $x_" + (jc + 1) + " \\le \\lfloor " + tx(x[jc]) + " \\rfloor = " + fl + "$ e $x_" + (jc + 1) + " \\ge " + (fl + 1) + "$. Una variabile con valore intero non elimina $\\tilde{\\vet x}(\\LP_k)$, e con $x_" + (jc + 1) + " \\le " + (fl + 1) + "$ il figlio verso il basso contiene ancora $\\tilde{\\vet x}(\\LP_k)$.",
        "The strategy selects $x_" + (jc + 1) + " = " + tx(x[jc]) + "$; the children have $x_" + (jc + 1) + " \\le \\lfloor " + tx(x[jc]) + " \\rfloor = " + fl + "$ and $x_" + (jc + 1) + " \\ge " + (fl + 1) + "$. A variable with an integer value does not cut off $\\tilde{\\vet x}(\\LP_k)$, and with $x_" + (jc + 1) + " \\le " + (fl + 1) + "$ the down-branching child still contains $\\tilde{\\vet x}(\\LP_k)$.");
      return chiudi(rng, testo, corr, d, sp, { x: x.map(fs), strategia: k0 });
    })
  });

  // ================================================================ 17. potatura di un nodo
  G.push({
    id: "pli-g-prune", livello: "facile", capitolo: "bb", link: link("bb", "724-bounding-operations-and-the-bound-of-a-node", "724-operazioni-di-bounding-e-bound-di-un-nodo"),
    genera: ripeti(function (rng, lingua) {
      var LB = ri(rng, 10, 40), caso = ri(rng, 0, 3), z, intz;
      var q = pick(rng, [2, 3, 4, 5, 7]);
      if (caso === 0) { z = add(LB, F(ri(rng, 1, q - 1), q)); intz = false; }           // floor(z) = LB: potato per bound
      else if (caso === 1) { z = add(LB + ri(rng, 1, 3), F(ri(rng, 1, q - 1), q)); intz = false; }
      else if (caso === 2) { z = F(LB + ri(rng, 1, 4)); intz = true; }
      else { z = F(LB - ri(rng, 0, 3)); intz = true; }
      var esiti = {
        bound: { s: L(lingua, "potato per bound", "pruned by bound"), v: "bound" },
        lista: { s: L(lingua, "inserito nella lista dei nodi aperti", "inserted into the list of open nodes"), v: "lista" },
        intUp: { s: L(lingua, "potato per integralità, con $\\LB \\leftarrow " + tx(z) + "$", "pruned by integrality, with $\\LB \\leftarrow " + tx(z) + "$"), v: "intUp" },
        intNo: { s: L(lingua, "potato per integralità, $\\LB$ invariato", "pruned by integrality, $\\LB$ unchanged"), v: "intNo" }
      };
      var giusto = ["bound", "lista", "intUp", "intNo"][caso];
      var corr = esiti[giusto];
      var d = ["bound", "lista", "intUp", "intNo"].filter(function (k) { return k !== giusto; }).map(function (k) { return esiti[k]; });
      var st = intz ? L(lingua, "intera", "integer") : L(lingua, "frazionaria", "fractional");
      var testo = L(lingua,
        "In un branch-and-bound per un problema PLI di massimizzazione con variabili e costi interi, l'incumbent (migliore soluzione intera trovata) ha valore $\\LB = " + LB + "$. Si risolve il rilassamento lineare $\\LP_k$ del nodo $k$: ha valore ottimo $z(\\LP_k) = " + tx(z) + "$ e soluzione ottima $\\tilde{\\vet x}(\\LP_k)$ " + st + ". Che cosa succede al nodo?",
        "In a branch-and-bound algorithm for a maximization ILP problem with integer variables and costs, the incumbent (best integer solution found) has value $\\LB = " + LB + "$. The LP relaxation $\\LP_k$ of node $k$ is solved: it has optimal value $z(\\LP_k) = " + tx(z) + "$ and an optimal solution $\\tilde{\\vet x}(\\LP_k)$ that is " + st + ". What happens to the node?");
      var sp = L(lingua,
        "I criteri si controllano nell'ordine inammissibilità, integralità, bound; il bound del nodo è $\\lfloor z(\\LP_k) \\rfloor = " + flo(z) + "$ e si pota anche con l'uguaglianza $\\lfloor z(\\LP_k) \\rfloor = \\LB$. Con una soluzione intera l'LB si aggiorna solo se $z(\\LP_k) > \\LB$.",
        "The criteria are checked in the order infeasibility, integrality, bound; the bound of the node is $\\lfloor z(\\LP_k) \\rfloor = " + flo(z) + "$ and the node is pruned also with the equality $\\lfloor z(\\LP_k) \\rfloor = \\LB$. With an integer solution the LB is updated only if $z(\\LP_k) > \\LB$.");
      return chiudi(rng, testo, corr, d, sp, { LB: LB, z: fs(z), intera: intz });
    })
  });

  // ================================================================ 18. upper bound e gap dalla lista
  G.push({
    id: "pli-g-bb-ub", livello: "facile", capitolo: "bb", link: link("bb", "726-upper-bound-and-optimality-gap", "726-upper-bound-e-gap-di-ottimalita"),
    genera: ripeti(function (rng, lingua) {
      var LB = ri(rng, 20, 60), nodi = [], ks = [ri(rng, 2, 4)];
      ks.push(ks[0] + ri(rng, 1, 3)); ks.push(ks[1] + ri(rng, 1, 3));
      for (var i = 0; i < 3; i++) { var q = pick(rng, [2, 3, 4, 5, 10]); nodi.push(add(LB + ri(rng, 1, 6), F(ri(rng, 1, q - 1), q))); }
      var U = Math.max.apply(null, nodi.map(flo));
      var zmax = nodi.reduce(function (u, v) { return cmp(u, v) >= 0 ? u : v; });
      var last = nodi[2];
      if (flo(last) === U) return null;
      if (nodi.filter(function (v) { return flo(v) === U; }).length > 1) return null;
      function o(ub, den) { var g = div(sub(ub, LB), den); return { s: "$\\UB = " + tx(ub) + "$, gap $= " + tx(g) + "$", v: [fs(ub), fs(g)] }; }
      var corr = o(U, LB);
      var d = filtra(corr, [o(zmax, LB), o(flo(last), LB), o(U, U)]);
      var lista = nodi.map(function (v, i) { return "$z(\\LP_{" + ks[i] + "}) = " + tx(v) + "$"; }).join(", ");
      var testo = L(lingua,
        "In un branch-and-bound per un problema PLI di massimizzazione con variabili e costi interi l'incumbent ha valore $\\LB = " + LB + "$ e la lista dei nodi aperti contiene tre nodi, i cui rilassamenti lineari hanno valori ottimi " + lista + " (l'ultimo è il nodo appena risolto). Quanto valgono l'upper bound $\\UB$ sul valore ottimo e il gap di ottimalità $\\frac{\\UB - \\LB}{|\\LB|}$?",
        "In a branch-and-bound algorithm for a maximization ILP problem with integer variables and costs the incumbent solution has value $\\LB = " + LB + "$ and the list of open nodes contains three nodes, whose LP relaxations have optimal values " + lista + " (the last one is the node just solved). What are the upper bound $\\UB$ on the optimal value and the optimality gap $\\frac{\\UB - \\LB}{|\\LB|}$?");
      var sp = L(lingua,
        "$\\UB = \\max_{k \\in L} \\lfloor z(\\LP_k) \\rfloor = " + U + "$, non il bound dell'ultimo nodo risolto; il gap è $\\frac{\\UB - \\LB}{|\\LB|} = \\frac{" + (U - LB) + "}{" + LB + "}$.",
        "$\\UB = \\max_{k \\in L} \\lfloor z(\\LP_k) \\rfloor = " + U + "$, not the bound of the last node solved; the gap is $\\frac{\\UB - \\LB}{|\\LB|} = \\frac{" + (U - LB) + "}{" + LB + "}$.");
      return chiudi(rng, testo, corr, d, sp, { LB: LB, z: nodi.map(fs) });
    })
  });

  // ================================================================ 19. operazione di pivot duale nel figlio (media)
  G.push({
    id: "pli-g-dual-pivot", livello: "media", capitolo: "bb", link: link("bb", "sez-bb-sec-dualsimplex"),
    genera: ripeti(function (rng, lingua) {
      var g = istanzaGomory(rng); if (!g) return null;
      var dz = g.dz, j = isInt(dz.bbar[0]) ? 1 : 0, xj = dz.bbar[j], fl = flo(xj);
      var giu = rng() < 0.5;
      var b5 = giu ? sub(fl, xj) : sub(sub(xj, fl), 1);
      var a5 = dz.abar[j].map(function (v) { return giu ? neg(v) : v; });   // x5 = b5 - sum a5 x
      var cand = [0, 1].filter(function (q) { return cmp(a5[q], 0) < 0; });
      var altri = [0, 1].filter(function (q) { return cmp(a5[q], 0) > 0; });
      if (cand.length !== 1 || altri.length !== 1) return null;
      var p = cand[0], o2 = altri[0];
      var sm = div(dz.cbar[p], a5[p]), so = div(dz.cbar[o2], a5[o2]);
      var zn = add(dz.zbar, mul(sm, b5));
      function o(col, zz) { return { s: L(lingua, "colonna pivot $x_" + (col + 3) + "$, nuovo valore $" + tx(zz) + "$", "pivot column $x_" + (col + 3) + "$, new value $" + tx(zz) + "$"), v: [col + 3, fs(zz)] }; }
      var corr = o(p, zn);
      var d = filtra(corr, [o(o2, add(dz.zbar, mul(so, b5))), o(p, sub(dz.zbar, mul(sm, b5))), o(o2, sub(dz.zbar, mul(so, b5)))]);
      var vinc = giu ? "x_" + (j + 1) + " \\le " + fl : "x_" + (j + 1) + " \\ge " + (fl + 1);
      var testo = L(lingua,
        "Nel problema PLI " + txPLI(g.ist, lingua) + ", con gli scarti " + txScarti(g.ist) + ", il dizionario ottimo della radice è " + txDiz(dz) + ". Si risolve il figlio con il vincolo di branching $" + vinc + "$ (variabile di scarto o di surplus $x_5$, riga aggiunta al dizionario) partendo da questo dizionario, con il simplesso duale (riga pivot con termine noto negativo, colonna pivot dal rapporto minimo). Quali sono la colonna pivot della prima operazione di pivot duale e il nuovo valore dell'obiettivo?",
        "In the ILP problem " + txPLI(g.ist, lingua) + ", with the slack variables " + txScarti(g.ist) + ", the optimal dictionary of the root is " + txDiz(dz) + ". The child with the branching constraint $" + vinc + "$ (slack or surplus variable $x_5$, row added to the dictionary) is solved starting from this dictionary, with the dual simplex algorithm (pivot row with negative right-hand side, pivot column from the minimum ratio). What are the pivot column of the first dual pivoting operation and the new objective value?");
      var sp = L(lingua,
        "La nuova riga è $" + txRiga("x_5", b5, a5, ["x_3", "x_4"]) + "$, con $\\bar b_5 = " + tx(b5) + " < 0$. Solo $x_" + (p + 3) + "$ ha $\\bar a_{5j} < 0$, con rapporto $s_m = " + tx(sm) + "$; il valore diventa $\\bar z + s_m \\bar b_5 = " + tx(zn) + "$, che non supera $\\bar z$.",
        "The new row is $" + txRiga("x_5", b5, a5, ["x_3", "x_4"]) + "$, with $\\bar b_5 = " + tx(b5) + " < 0$. Only $x_" + (p + 3) + "$ has $\\bar a_{5j} < 0$, with ratio $s_m = " + tx(sm) + "$; the value becomes $\\bar z + s_m \\bar b_5 = " + tx(zn) + "$, which does not exceed $\\bar z$.");
      return chiudi(rng, testo, corr, d, sp, { ist: verIst(g.ist), giu: giu });
    })
  });

  // ================================================================ 20-21. branch-and-bound completo (complessa)
  function bb(c, cons, strat, salto) {
    var LB = null, inc = null, Ls = [], cnt = 0, tie = false;
    function risolvi(extra) { cnt++; var r = lp2(c, cons.concat(extra)); if (r.stato === "ott" && !r.unico) tie = true; return r; }
    var r1 = risolvi([]);
    if (intero(r1.x)) return { nodi: 1, x: r1.x, z: r1.z, radiceIntera: true };
    Ls.push({ k: 1, extra: [], r: r1 });
    function figlio(extra) {
      var r = risolvi(extra), k = cnt;
      if (r.stato === "inf") return;
      if (intero(r.x)) {
        if (LB === null || cmp(r.z, LB) > 0) { LB = r.z; inc = r.x; Ls = Ls.filter(function (nd) { return flo(nd.r.z) > flo(LB); }); }
        return;
      }
      if (LB !== null && flo(r.z) <= flo(LB)) return;
      Ls.push({ k: k, extra: extra, r: r });
    }
    var giri = 0;
    while (Ls.length) {
      if (++giri > 60) return null;
      var idx;
      if (strat === "lifo") idx = Ls.length - 1;
      else { idx = 0; for (var i = 1; i < Ls.length; i++) { var c0 = cmp(Ls[i].r.z, Ls[idx].r.z); if (c0 > 0 || (c0 === 0 && Ls[i].k < Ls[idx].k)) idx = i; } }
      var nd = Ls.splice(idx, 1)[0];
      var j = isInt(nd.r.x[0]) ? 1 : 0, fl = flo(nd.r.x[j]);
      var giu = j === 0 ? [1, 0, fl] : [0, 1, fl], su = j === 0 ? [-1, 0, -(fl + 1)] : [0, -1, -(fl + 1)];
      figlio(nd.extra.concat([giu]));
      if (salto && LB !== null && flo(nd.r.z) <= flo(LB)) continue;
      figlio(nd.extra.concat([su]));
    }
    return { nodi: cnt, x: inc, z: LB, tie: tie };
  }
  function generaBB(strat) {
    return ripeti(function (rng, lingua) {
      var ist = istanzaAuto(rng); if (!ist) return null;
      if (intero(ist.lp.x)) return null;
      var cons = vincoliAuto(ist);
      var r = bb(ist.c, cons, strat, true);
      if (!r || r.tie || r.radiceIntera || r.nodi < 4 || r.nodi > 11) return null;
      // ottimo intero unico (verifica per enumerazione)
      var pts = interi(ist.A, ist.b), best = -1, nb = 0;
      pts.forEach(function (p) { var v = ist.c[0] * p[0] + ist.c[1] * p[1]; if (v > best) { best = v; nb = 1; } else if (v === best) nb++; });
      if (nb !== 1 || best !== F(r.z).n) return null;
      var altra = bb(ist.c, cons, strat === "lifo" ? "best" : "lifo", true);
      var senza = bb(ist.c, cons, strat, false);
      if (!altra || !senza || altra.tie || senza.tie) return null;
      var xd = [flo(ist.lp.x[0]), flo(ist.lp.x[1])];
      function o(n, x) { return { s: L(lingua, "$" + n + "$ problemi LP risolti; ottimo $" + txPt(x) + "$, valore $" + valore(ist.c, x).n + "$", "$" + n + "$ LP problems solved; optimum $" + txPt(x) + "$, value $" + valore(ist.c, x).n + "$"), v: [n, x.map(fs)] }; }
      var corr = o(r.nodi, r.x);
      var pool = [];
      if (valore(ist.c, xd).n !== best) pool.push(o(r.nodi, xd));
      pool.push(o(senza.nodi, r.x));
      pool.push(o(altra.nodi, r.x));
      pool.push(o(r.nodi + 1, r.x));
      pool.push(o(r.nodi - 1, r.x));
      var d = filtra(corr, pool);
      var nomeS = strat === "lifo" ? "LIFO" : L(lingua, "best bound (a parità, indice di nodo minimo)", "best bound (ties: smallest node index)");
      var testo = L(lingua,
        "Si risolve il problema PLI " + txPLI(ist, lingua) + " con il branch-and-bound: variabile di branching lessicografica (indice minimo), selezione del nodo " + nomeS + ", prima il figlio con il vincolo verso il basso, potatura di un nodo se $\\lfloor z(\\LP_k) \\rfloor \\le \\LB$ ($\\LB$: valore dell'incumbent, $-\\infty$ all'inizio), regola di salto (dopo il primo figlio, il secondo non si risolve se il bound del padre non supera più $\\LB$). La radice ha $\\tilde{\\vet x}(\\LP_1) = " + txPt(ist.lp.x) + "$, $z(\\LP_1) = " + tx(ist.lp.z) + "$. Quanti problemi LP si risolvono (radice compresa) e quale soluzione si certifica ottima?",
        "The ILP problem " + txPLI(ist, lingua) + " is solved with the branch-and-bound algorithm: lexicographic branching variable (smallest index), " + nomeS + " node selection, down-branching child first, a node pruned if $\\lfloor z(\\LP_k) \\rfloor \\le \\LB$ ($\\LB$: value of the incumbent, $-\\infty$ at the start), skip rule (after the first child, the second is not solved if the bound of the parent no longer exceeds $\\LB$). The root has $\\tilde{\\vet x}(\\LP_1) = " + txPt(ist.lp.x) + "$, $z(\\LP_1) = " + tx(ist.lp.z) + "$. How many LP problems are solved (root included) and which solution is certified optimal?");
      var sp = L(lingua,
        "Eseguendo l'algoritmo si risolvono $" + r.nodi + "$ problemi LP e alla fine la lista è vuota con $\\LB = \\UB = " + best + "$ in $" + txPt(r.x) + "$. I figli saltati non si risolvono e non prendono numero; la soluzione arrotondata della radice non è certificata ottima.",
        "Running the algorithm, $" + r.nodi + "$ LP problems are solved and at the end the list is empty with $\\LB = \\UB = " + best + "$ at $" + txPt(r.x) + "$. Skipped children are not solved and get no index; the rounded root solution is not certified optimal.");
      return chiudi(rng, testo, corr, d, sp, { ist: verIst(ist), strategia: strat });
    });
  }
  G.push({ id: "pli-g-bb-lifo", livello: "complessa", capitolo: "bb", link: link("bb", "box-9-ex-bb-runA"), genera: generaBB("lifo") });
  G.push({ id: "pli-g-bb-best", livello: "complessa", capitolo: "bb", link: link("bb", "box-10-ex-bb-runB"), genera: generaBB("best") });

  // ================================================================ 22. violazione ed efficacia di un taglio
  G.push({
    id: "pli-g-efficacy", livello: "facile", capitolo: "branch-and-cut", link: link("branch-and-cut", "861-cut-selection", "861-selezione-dei-tagli"),
    genera: ripeti(function (rng, lingua) {
      var tr = pick(rng, [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13]]);
      var al = [tr[0], tr[1]], nr = tr[2];
      var x = [add(ri(rng, 1, 5), F(ri(rng, 1, 3), 4)), add(ri(rng, 1, 5), F(1, 2))];
      var lhs = add(mul(al[0], x[0]), mul(al[1], x[1]));
      var beta = flo(lhs) - ri(rng, 0, 2);
      var v = sub(lhs, beta);
      if (cmp(v, 0) <= 0) return null;
      var e = div(v, nr);
      function o(a, b) { return { s: L(lingua, "violazione $" + tx(a) + "$, efficacia $" + tx(b) + "$", "violation $" + tx(a) + "$, efficacy $" + tx(b) + "$"), v: [fs(a), fs(b)] }; }
      var corr = o(v, e);
      var d = filtra(corr, [o(v, div(v, nr * nr)), o(e, v), o(v, mul(v, nr))]);
      var testo = L(lingua,
        "Nel branch-and-cut, nella soluzione ottima $\\tilde{\\vet x}(\\LP_k) = " + txPt(x) + "$ del rilassamento del nodo $k$ si valuta il taglio $" + txIneq(al, "\\le", beta) + "$. Quanto valgono la violazione (membro sinistro nel punto meno termine noto) e l'efficacia (distanza euclidea del punto dall'iperpiano del taglio)?",
        "In branch-and-cut, at the optimal solution $\\tilde{\\vet x}(\\LP_k) = " + txPt(x) + "$ of the relaxation of node $k$ we evaluate the cut $" + txIneq(al, "\\le", beta) + "$. What are its violation (left-hand side at the point minus right-hand side) and its efficacy (Euclidean distance of the point from the hyperplane of the cut)?");
      var sp = L(lingua,
        "Violazione $\\vet\\alpha\\T\\tilde{\\vet x} - \\beta = " + tx(lhs) + " - " + beta + " = " + tx(v) + "$; efficacia $= \\frac{" + tx(v) + "}{\\|\\vet\\alpha\\|}$ con $\\|\\vet\\alpha\\| = \\sqrt{" + al[0] + "^2 + " + al[1] + "^2} = " + nr + "$. L'efficacia non cambia se il taglio si moltiplica per una costante positiva, la violazione sì.",
        "Violation $\\vet\\alpha\\T\\tilde{\\vet x} - \\beta = " + tx(lhs) + " - " + beta + " = " + tx(v) + "$; efficacy $= \\frac{" + tx(v) + "}{\\|\\vet\\alpha\\|}$ with $\\|\\vet\\alpha\\| = \\sqrt{" + al[0] + "^2 + " + al[1] + "^2} = " + nr + "$. The efficacy does not change if the cut is multiplied by a positive constant, the violation does.");
      return chiudi(rng, testo, corr, d, sp, { alpha: al, beta: beta, x: x.map(fs) });
    })
  });

  // ================================================================ 23. taglio locale in un nodo
  G.push({
    id: "pli-g-local-cut", livello: "facile", capitolo: "branch-and-cut", link: link("branch-and-cut", "box-6-ex-bc-local"),
    genera: ripeti(function (rng, lingua) {
      var ist = istanzaAuto(rng); if (!ist) return null;
      var A = ist.A, b = ist.b, k = flo(ist.lp.x[0]) + 1;
      if (b[0] - A[0][0] * k < 0) return null;
      var vr = F(b[0] - A[0][0] * k, A[0][1]), v = flo(vr);
      var pts = interi(A, b), viol = null;
      pts.forEach(function (p) { if (p[1] > v && (!viol || p[1] > viol[1])) viol = p; });
      if (!viol || isInt(vr)) return null;
      var w = flo(F(b[0] - A[0][0] * (k - 1), A[0][1]));
      // nel nodo deve esistere almeno un punto intero (il taglio è saturato localmente)
      if (!pts.some(function (p) { return p[0] >= k && p[1] === v; })) return null;
      function o(r, glob) { return { s: "$x_2 \\le " + tx(r) + "$, " + (glob ? L(lingua, "valido globalmente", "globally valid") : L(lingua, "valido solo localmente", "only locally valid")), v: [fs(r), glob] }; }
      var corr = o(v, false);
      var d = filtra(corr, [o(v, true), o(w, false), o(vr, false)]);
      var testo = L(lingua,
        "Nel problema PLI " + txPLI(ist, lingua) + " il nodo $k$ ha il vincolo di branching $x_1 \\ge " + k + "$. Dal primo vincolo e da $x_1 \\ge " + k + "$ si ricava un taglio su $x_2$, arrotondando il termine noto. Quale taglio si ottiene, ed è globale (valido per tutte le soluzioni intere ammissibili) o locale (valido solo nel sottoalbero del nodo)?",
        "In the ILP problem " + txPLI(ist, lingua) + " node $k$ has the branching constraint $x_1 \\ge " + k + "$. From the first constraint and $x_1 \\ge " + k + "$ we derive a cut on $x_2$, rounding the right-hand side. Which cut is obtained, and is it global (valid for all the feasible integer solutions) or local (valid only in the subtree of the node)?");
      var sp = L(lingua,
        "$" + A[0][1] + "\\,x_2 \\le " + b[0] + " - " + A[0][0] + "\\,x_1 \\le " + (b[0] - A[0][0] * k) + "$, quindi $x_2 \\le \\lfloor " + tx(vr) + " \\rfloor = " + v + "$. La derivazione usa il vincolo di branching: il punto ammissibile $(" + viol[0] + "," + viol[1] + ")$ lo viola, quindi è un taglio locale, da usare solo nel sottoalbero del nodo.",
        "$" + A[0][1] + "\\,x_2 \\le " + b[0] + " - " + A[0][0] + "\\,x_1 \\le " + (b[0] - A[0][0] * k) + "$, so $x_2 \\le \\lfloor " + tx(vr) + " \\rfloor = " + v + "$. The derivation uses the branching constraint: the feasible point $(" + viol[0] + "," + viol[1] + ")$ violates it, so it is a local cut, to be used only in the subtree of the node.");
      return chiudi(rng, testo, corr, d, sp, { ist: verIst(ist), k: k });
    })
  });

  // ================================================================ 24. gap nel log di Gurobi
  G.push({
    id: "pli-g-solver-gap", livello: "facile", capitolo: "mip-solvers", link: link("mip-solvers", "925-tolerances-and-gap", "925-tolleranze-e-gap"),
    genera: ripeti(function (rng, lingua) {
      var maxi = rng() < 0.5, I = ri(rng, 200, 900), dlt = ri(rng, 2, 30);
      var B = maxi ? I + dlt : I - dlt;
      var g = F(100 * dlt, I), g2 = F(100 * dlt, B);
      var tol = pick(rng, [0.5, 1, 2, 5]);
      function vicino(fr) { var t = fr.n / fr.d * 100; var f = t - Math.floor(t); return Math.abs(f - 0.5) < 0.05; }
      if (vicino(g) || vicino(g2)) return null;
      var gv = g.n / g.d, g2v = g2.n / g2.d;
      if (Math.abs(gv - tol) < 0.05 || Math.abs(g2v - tol) < 0.05) return null;
      var p1 = gv.toFixed(2), p2 = g2v.toFixed(2);
      if (p1 === p2) return null;
      function pv(p) { return lingua === "it" ? p.replace(".", "{,}") : p; }
      function o(p, stop) { return { s: "Gap $= " + pv(p) + "\\%$, " + (stop ? L(lingua, "il solver si ferma", "the solver stops") : L(lingua, "il solver continua", "the solver continues")), v: [p, stop] }; }
      var stop = gv <= tol;
      var corr = o(p1, stop);
      var d = [o(p2, stop), o(p1, !stop), o(p2, !stop)];
      var testo = L(lingua,
        "In un problema di " + (maxi ? "massimizzazione" : "minimizzazione") + " una riga del log di Gurobi riporta $\\texttt{Incumbent} = " + I + "$ e $\\texttt{BestBd} = " + B + "$, con il parametro $\\texttt{MIPGap} = " + pv(String(tol)) + "\\%$. Quanto vale il gap relativo di Gurobi, $|\\texttt{BestBd} - \\texttt{Incumbent}| / |\\texttt{Incumbent}|$, e il solver si ferma?",
        "In a " + (maxi ? "maximization" : "minimization") + " problem a line of the Gurobi log reports $\\texttt{Incumbent} = " + I + "$ and $\\texttt{BestBd} = " + B + "$, with the parameter $\\texttt{MIPGap} = " + pv(String(tol)) + "\\%$. What is Gurobi's relative gap, $|\\texttt{BestBd} - \\texttt{Incumbent}| / |\\texttt{Incumbent}|$, and does the solver stop?");
      var sp = L(lingua,
        "Il gap è $\\frac{|\\texttt{BestBd} - \\texttt{Incumbent}|}{|\\texttt{Incumbent}|} = \\frac{" + dlt + "}{" + I + "} \\approx " + pv(p1) + "\\%$ (al denominatore l'incumbent, anche in minimizzazione, dove l'incumbent è l'upper bound). Il solver si ferma quando il gap non supera $\\texttt{MIPGap}$.",
        "The gap is $\\frac{|\\texttt{BestBd} - \\texttt{Incumbent}|}{|\\texttt{Incumbent}|} = \\frac{" + dlt + "}{" + I + "} \\approx " + pv(p1) + "\\%$ (the incumbent is in the denominator, also in minimization, where the incumbent is the upper bound). The solver stops when the gap does not exceed $\\texttt{MIPGap}$.");
      return chiudi(rng, testo, corr, d, sp, { I: I, B: B, tol: tol });
    })
  });

  // ================================================================ 25. arrotondamento
  G.push({
    id: "pli-g-rounding", livello: "facile", capitolo: "mip-heuristics", link: link("mip-heuristics", "box-5-def-rounding"),
    genera: ripeti(function (rng, lingua) {
      var ist = istanzaAuto(rng); if (!ist) return null;
      var x = ist.lp.x;
      var f0 = frac(x[0]), f1 = frac(x[1]);
      var h = F(1, 2);
      if (!((cmp(f0, h) < 0 && cmp(f1, h) > 0) || (cmp(f0, h) > 0 && cmp(f1, h) < 0))) return null;
      if (F(f0).n === 0 || F(f1).n === 0) return null;
      var p = [rnd(x[0]), rnd(x[1])], dn = [flo(x[0]), flo(x[1])], up = [cei(x[0]), cei(x[1])];
      var feas = ammissibile(ist.A, ist.b, p);
      var vi = -1;
      if (!feas) for (var i = 0; i < 2; i++) if (ist.A[i][0] * p[0] + ist.A[i][1] * p[1] > ist.b[i]) { vi = i; break; }
      function ok(pt) { return { s: L(lingua, "restituisce $" + txPt(pt) + "$, di valore $" + valore(ist.c, pt).n + "$", "it returns $" + txPt(pt) + "$, of value $" + valore(ist.c, pt).n + "$"), v: ["ok", pt] }; }
      function ko(pt, i) { return { s: L(lingua, "fallisce: $" + txPt(pt) + "$ viola il vincolo " + (i + 1), "it fails: $" + txPt(pt) + "$ violates constraint " + (i + 1)), v: ["ko", pt, i] }; }
      var corr = feas ? ok(p) : ko(p, vi);
      var d = filtra(corr, [feas ? ko(p, 0) : ok(p), ok(dn), ok(up)]);
      var testo = L(lingua,
        "Nel problema PLI " + txPLI(ist, lingua) + " il rilassamento lineare ha soluzione ottima $\\tilde{\\vet x} = " + txPt(x) + "$. Che cosa fa l'euristica di arrotondamento (all'intero più vicino, $\\lfloor v + \\frac{1}{2} \\rfloor$)?",
        "In the ILP problem " + txPLI(ist, lingua) + " the LP relaxation has the optimal solution $\\tilde{\\vet x} = " + txPt(x) + "$. What does the rounding heuristic (to the nearest integer, $\\lfloor v + \\frac{1}{2} \\rfloor$) do?");
      var sp = L(lingua,
        "L'arrotondamento all'intero più vicino dà $" + txPt(p) + "$" + (feas ? ", che soddisfa i vincoli." : ", che viola il vincolo " + (vi + 1) + ": l'euristica fallisce.") + " Arrotondare per difetto (o per eccesso) tutte le componenti è un'altra regola.",
        "Rounding to the nearest integer gives $" + txPt(p) + "$" + (feas ? ", which satisfies the constraints." : ", which violates constraint " + (vi + 1) + ": the heuristic fails.") + " Rounding all components down (or up) is a different rule.");
      return chiudi(rng, testo, corr, d, sp, { ist: verIst(ist) });
    })
  });

  // ================================================================ 26. diving frazionario (media)
  function diving(ist) {
    var cons = vincoliAuto(ist), passi = 0;
    while (true) {
      var r = lp2(ist.c, cons);
      if (r.stato === "inf") return { esito: "fail", passi: passi };
      if (!r.unico) return null;
      if (intero(r.x)) return { esito: "ok", x: r.x, passi: passi };
      var j = -1, best = null;
      for (var q = 0; q < 2; q++) {
        if (isInt(r.x[q])) continue;
        var dd = sub(r.x[q], rnd(r.x[q])); if (cmp(dd, 0) < 0) dd = neg(dd);
        if (best === null || cmp(dd, best) < 0) { best = dd; j = q; }
      }
      var v = rnd(r.x[j]);
      cons = cons.concat(j === 0 ? [[1, 0, v], [-1, 0, -v]] : [[0, 1, v], [0, -1, -v]]);
      passi++;
      if (passi > 5) return null;
    }
  }
  G.push({
    id: "pli-g-diving", livello: "media", capitolo: "mip-heuristics", link: link("mip-heuristics", "box-8-def-diving"),
    genera: ripeti(function (rng, lingua) {
      var ist = istanzaAuto(rng); if (!ist) return null;
      if (intero(ist.lp.x)) return null;
      var dv = diving(ist); if (!dv) return null;
      var pts = interi(ist.A, ist.b), best = null;
      pts.forEach(function (p) { var v = ist.c[0] * p[0] + ist.c[1] * p[1]; if (!best || v > best[2]) best = [p[0], p[1], v]; });
      var dn = [flo(ist.lp.x[0]), flo(ist.lp.x[1])], rn = [rnd(ist.lp.x[0]), rnd(ist.lp.x[1])];
      function ok(pt) { return { s: L(lingua, "restituisce $" + txPt(pt) + "$, di valore $" + valore(ist.c, pt).n + "$", "it returns $" + txPt(pt) + "$, of value $" + valore(ist.c, pt).n + "$"), v: ["ok", pt.map(fs)] }; }
      var fail = { s: L(lingua, "fallisce: un problema LP diventa inammissibile", "it fails: an LP problem becomes infeasible"), v: ["fail"] };
      var corr = dv.esito === "ok" ? ok(dv.x) : fail;
      var pool = [];
      if (dv.esito === "ok") pool.push(fail);
      pool.push(ok(dn)); pool.push(ok(rn)); pool.push(ok([best[0], best[1]]));
      var d = filtra(corr, pool);
      var testo = L(lingua,
        "Nel problema PLI " + txPLI(ist, lingua) + " il rilassamento lineare ha soluzione ottima $" + txPt(ist.lp.x) + "$. Si applica il diving frazionario: si fissa la variabile frazionaria più vicina a un intero (a parità, indice minimo) al valore arrotondato $\\lfloor \\tilde x_j + \\frac{1}{2} \\rfloor$ e si risolve di nuovo il rilassamento, finché la soluzione è intera o il problema LP è inammissibile. Che cosa restituisce?",
        "In the ILP problem " + txPLI(ist, lingua) + " the LP relaxation has the optimal solution $" + txPt(ist.lp.x) + "$. Fractional diving is applied: the fractional variable closest to an integer (ties: smallest index) is fixed to the rounded value $\\lfloor \\tilde x_j + \\frac{1}{2} \\rfloor$ and the relaxation is solved again, until the solution is integer or the LP problem is infeasible. What does it return?");
      var sp = L(lingua,
        (dv.esito === "ok" ? "Dopo $" + dv.passi + "$ " + (dv.passi === 1 ? "fissaggio" : "fissaggi") + " la soluzione del rilassamento è intera: $" + txPt(dv.x) + "$." : "Dopo $" + dv.passi + "$ " + (dv.passi === 1 ? "fissaggio" : "fissaggi") + " il problema LP è inammissibile: il diving fallisce.") + " A ogni passo il problema LP si risolve di nuovo con i fissaggi già fatti; non è un arrotondamento della sola soluzione della radice, e non garantisce l'ottimo.",
        (dv.esito === "ok" ? "After $" + dv.passi + "$ " + (dv.passi === 1 ? "fixing" : "fixings") + " the solution of the relaxation is integer: $" + txPt(dv.x) + "$." : "After $" + dv.passi + "$ " + (dv.passi === 1 ? "fixing" : "fixings") + " the LP problem is infeasible: the dive fails.") + " At each step the LP problem is solved again with the fixings taken so far; it is not a rounding of the root solution alone, and it does not guarantee the optimum.");
      return chiudi(rng, testo, corr, d, sp, { ist: verIst(ist) });
    })
  });

  // ================================================================ 27. distanza della feasibility pump
  G.push({
    id: "pli-g-fp-distance", livello: "facile", capitolo: "mip-heuristics", link: link("mip-heuristics", "box-12-def-distance"),
    genera: ripeti(function (rng, lingua) {
      var n = 5, xb = [], xt = [];
      var vals = [F(0), F(1), F(1, 4), F(1, 2), F(3, 4), F(1, 5), F(2, 5), F(3, 5), F(4, 5)];
      for (var j = 0; j < n; j++) { xb.push(ri(rng, 0, 1)); xt.push(pick(rng, vals)); }
      if (xb.every(function (v) { return v === 0; }) || xb.every(function (v) { return v === 1; })) return null;
      var D = F(0), Ds = F(0), D0 = F(0), cnt = 0;
      for (j = 0; j < n; j++) {
        if (xb[j] === 0) { D = add(D, xt[j]); D0 = add(D0, xt[j]); Ds = add(Ds, sub(1, xt[j])); }
        else { D = add(D, sub(1, xt[j])); Ds = add(Ds, xt[j]); }
        if (rnd(xt[j]) !== xb[j]) cnt++;
      }
      function o(v) { return { s: "$" + tx(v) + "$", v: fs(v) }; }
      var corr = o(D);
      var d = filtra(corr, [o(Ds), o(D0), o(F(cnt))]);
      var testo = L(lingua,
        "Nella feasibility pump, con variabili binarie, il punto intero è $\\bar{\\vet x} = " + txPt(xb) + "$ e il punto del rilassamento è $\\tilde{\\vet x} = " + txPt(xt) + "$. Quanto vale la distanza della feasibility pump $\\Delta(\\tilde{\\vet x}, \\bar{\\vet x})$, cioè la distanza in norma $1$ fra i due punti?",
        "In the feasibility pump, with binary variables, the integer point is $\\bar{\\vet x} = " + txPt(xb) + "$ and the point of the relaxation is $\\tilde{\\vet x} = " + txPt(xt) + "$. What is the feasibility pump distance $\\Delta(\\tilde{\\vet x}, \\bar{\\vet x})$, that is the $1$-norm distance between the two points?");
      var sp = L(lingua,
        "$\\Delta = \\sum_{j : \\bar x_j = 0} \\tilde x_j + \\sum_{j : \\bar x_j = 1} (1 - \\tilde x_j) = " + tx(D) + "$: è la somma delle differenze $|\\tilde x_j - \\bar x_j|$, non il numero di componenti diverse dopo l'arrotondamento.",
        "$\\Delta = \\sum_{j : \\bar x_j = 0} \\tilde x_j + \\sum_{j : \\bar x_j = 1} (1 - \\tilde x_j) = " + tx(D) + "$: it is the sum of the differences $|\\tilde x_j - \\bar x_j|$, not the number of components that differ after rounding.");
      return chiudi(rng, testo, corr, d, sp, { xb: xb, xt: xt.map(fs) });
    })
  });

  // ================================================================ 28. RINS: variabili fissate
  G.push({
    id: "pli-g-rins", livello: "facile", capitolo: "mip-heuristics", link: link("mip-heuristics", "box-16-def-rins"),
    genera: ripeti(function (rng, lingua) {
      var n = 6, xt = [], xb = [];
      for (var j = 0; j < n; j++) {
        var b = ri(rng, 0, 4); xb.push(b);
        var t = rng();
        if (t < 0.35) xt.push(F(b));
        else if (t < 0.6) xt.push(F(Math.max(0, b + pick(rng, [-1, 1]))));
        else xt.push(add(Math.max(0, b + pick(rng, [-1, 0])), pick(rng, [F(1, 4), F(1, 2), F(3, 4), F(1, 3), F(2, 3)])));
      }
      function insieme(cond) { var s = []; for (var k = 0; k < n; k++) if (cond(k)) s.push(k); return s; }
      var fix = insieme(function (k) { return isInt(xt[k]) && F(xt[k]).n === xb[k]; });
      var allInt = insieme(function (k) { return isInt(xt[k]); });
      var rnds = insieme(function (k) { return rnd(xt[k]) === xb[k]; });
      var flos = insieme(function (k) { return flo(xt[k]) === xb[k]; });
      var free = insieme(function (k) { return fix.indexOf(k) < 0; });
      if (fix.length < 1 || fix.length > 4) return null;
      function o(s) { return { s: "$" + (s.length ? txSet(s) : "\\emptyset") + "$", v: s }; }
      var corr = o(fix);
      var d = filtra(corr, [o(allInt), o(rnds), o(flos), o(free)]);
      var testo = L(lingua,
        "Nell'euristica RINS, che risolve un sotto-MIP con alcune variabili fissate, l'incumbent è $\\bar{\\vet x} = " + txPt(xb) + "$ e la soluzione del rilassamento lineare è $\\tilde{\\vet x} = " + txPt(xt) + "$ (tutte le variabili sono intere). Quali variabili sono fissate nel sotto-MIP?",
        "In the RINS heuristic, which solves a sub-MIP with some variables fixed, the incumbent is $\\bar{\\vet x} = " + txPt(xb) + "$ and the solution of the LP relaxation is $\\tilde{\\vet x} = " + txPt(xt) + "$ (all variables are integer). Which variables are fixed in the sub-MIP?");
      var sp = L(lingua,
        "Si fissano le variabili su cui le due soluzioni coincidono, $\\tilde x_j = \\bar x_j$: sono $" + (fix.length ? txSet(fix) : "\\emptyset") + "$. Una componente intera di $\\tilde{\\vet x}$ diversa da $\\bar x_j$ resta libera, e arrotondare $\\tilde x_j$ non conta come accordo.",
        "The variables on which the two solutions agree, $\\tilde x_j = \\bar x_j$, are fixed: they are $" + (fix.length ? txSet(fix) : "\\emptyset") + "$. An integer component of $\\tilde{\\vet x}$ different from $\\bar x_j$ stays free, and rounding $\\tilde x_j$ does not count as agreement.");
      return chiudi(rng, testo, corr, d, sp, { xb: xb, xt: xt.map(fs) });
    })
  });

  // ================================================================ 29. dimensione dell'intorno del local branching
  function binom(n, k) { var r = 1; for (var i = 1; i <= k; i++) r = r * (n - i + 1) / i; return Math.round(r); }
  G.push({
    id: "pli-g-lb-size", livello: "facile", capitolo: "mip-heuristics", link: link("mip-heuristics", "sez-sec-lb"),
    genera: ripeti(function (rng, lingua) {
      var n = ri(rng, 6, 14), k = ri(rng, 2, 3);
      var s = 0; for (var i = 0; i <= k; i++) s += binom(n, i);
      function o(v) { return { s: "$" + v + "$", v: v }; }
      var corr = o(s);
      var d = filtra(corr, [o(binom(n, k)), o(s - 1), o(Math.pow(2, k) * n), o(s + binom(n, k + 1))]);
      var testo = L(lingua,
        "Un MIP ha $" + n + "$ variabili binarie (insieme $\\mathscr{D}$). Il local branching attorno all'incumbent $\\bar{\\vet x}$ usa l'intorno $\\Delta(\\vet x, \\bar{\\vet x}) \\le " + k + "$, dove $\\Delta$ conta le variabili binarie in cui $\\vet x$ differisce da $\\bar{\\vet x}$. Quanti punti binari contiene l'intorno (incumbent compreso)?",
        "A MIP has $" + n + "$ binary variables (set $\\mathscr{D}$). Local branching around the incumbent $\\bar{\\vet x}$ uses the neighbourhood $\\Delta(\\vet x, \\bar{\\vet x}) \\le " + k + "$, where $\\Delta$ counts the binary variables in which $\\vet x$ differs from $\\bar{\\vet x}$. How many binary points does the neighbourhood contain (incumbent included)?");
      var sp = L(lingua,
        "I punti a distanza $i$ si ottengono cambiando $i$ variabili: $\\sum_{i=0}^{" + k + "} \\binom{" + n + "}{i} = " + s + "$. Contare solo $\\binom{" + n + "}{" + k + "}$ dimentica i punti più vicini, compreso $\\bar{\\vet x}$ ($i = 0$).",
        "The points at distance $i$ are obtained by changing $i$ variables: $\\sum_{i=0}^{" + k + "} \\binom{" + n + "}{i} = " + s + "$. Counting only $\\binom{" + n + "}{" + k + "}$ forgets the closer points, including $\\bar{\\vet x}$ ($i = 0$).");
      return chiudi(rng, testo, corr, d, sp, { n: n, k: k });
    })
  });

  // ================================================================ 30. ottimo intero e numero di soluzioni ottime (media)
  G.push({
    id: "pli-g-ilp-opt", livello: "media", capitolo: "ilp", link: link("ilp", "13-complete-enumeration", "13-enumerazione-completa"),
    genera: ripeti(function (rng, lingua) {
      var c = pick(rng, [[1, 1], [1, 2], [2, 1], [2, 3], [3, 2], [1, 3], [3, 1]]);
      var A = [[ri(rng, 2, 7), ri(rng, 1, 5)], [ri(rng, 1, 5), ri(rng, 2, 7)]];
      var b = [ri(rng, 8, 26), ri(rng, 8, 26)];
      var ist = { c: c, A: A, b: b };
      var pts = interi(A, b);
      if (pts.length < 6 || pts.length > 30) return null;
      var best = -1, m = 0;
      pts.forEach(function (p) { var v = c[0] * p[0] + c[1] * p[1]; if (v > best) { best = v; m = 1; } else if (v === best) m++; });
      var r = lp2(c, vincoliAuto(ist));
      if (r.stato !== "ott" || isInt(r.z) || flo(r.z) === best) return null;   // l'arrotondamento del bound LP non basta
      var xd = [flo(r.x[0]), flo(r.x[1])], vd = c[0] * xd[0] + c[1] * xd[1];
      function o(z, k) { return { s: L(lingua, "$z(\\ILP) = " + z + "$, con $" + k + "$ " + (k === 1 ? "soluzione ottima" : "soluzioni ottime"), "$z(\\ILP) = " + z + "$, with $" + k + "$ optimal " + (k === 1 ? "solution" : "solutions")), v: [z, k] }; }
      var corr = o(best, m);
      var d = filtra(corr, [o(flo(r.z), m), o(best, m + 1), vd !== best ? o(vd, 1) : null, o(best, m > 1 ? m - 1 : m + 2), o(flo(r.z), 1)]);
      var testo = L(lingua,
        "Si consideri il problema PLI " + txPLI(ist, lingua) + " e sia $z(\\ILP)$ il suo valore ottimo. Quanto vale $z(\\ILP)$, e quante sono le soluzioni ottime?",
        "Consider the ILP problem " + txPLI(ist, lingua) + " and let $z(\\ILP)$ be its optimal value. What is $z(\\ILP)$, and how many optimal solutions are there?");
      var ott = pts.filter(function (p) { return c[0] * p[0] + c[1] * p[1] === best; }).map(function (p) { return "(" + p[0] + "," + p[1] + ")"; }).join(", ");
      var sp = L(lingua,
        "Enumerando i $" + pts.length + "$ punti interi ammissibili, il valore massimo è $" + best + "$, raggiunto in $" + ott + "$. Il rilassamento lineare vale $" + tx(r.z) + "$: la sua parte intera $" + flo(r.z) + "$ è solo un upper bound.",
        "Enumerating the $" + pts.length + "$ feasible integer points, the maximum value is $" + best + "$, attained at $" + ott + "$. The LP relaxation has value $" + tx(r.z) + "$: its integer part $" + flo(r.z) + "$ is only an upper bound.");
      return chiudi(rng, testo, corr, d, sp, { ist: { c: c, A: A, b: b } });
    })
  });

  // ================================================================ 31. selezione del taglio per efficacia (media)
  G.push({
    id: "pli-g-cut-select", livello: "media", capitolo: "branch-and-cut", link: link("branch-and-cut", "861-cut-selection", "861-selezione-dei-tagli"),
    genera: ripeti(function (rng, lingua) {
      var dir = mescola(rng, [[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [1, 0, 1], [0, 1, 1], [8, 15, 17], [15, 8, 17]]).slice(0, 4);
      var x = [add(ri(rng, 1, 5), F(ri(rng, 1, 3), 4)), add(ri(rng, 1, 5), F(1, 2))];
      var cuts = dir.map(function (t) {
        var lhs = add(mul(t[0], x[0]), mul(t[1], x[1]));
        var beta = flo(lhs) - ri(rng, 0, 3);
        var v = sub(lhs, beta);
        return { al: [t[0], t[1]], nr: t[2], beta: beta, viol: v, eff: div(v, t[2]) };
      });
      if (cuts.some(function (k) { return cmp(k.viol, 0) <= 0 || k.beta < 1; })) return null;   // tagli con termine noto positivo
      var ie = 0, iv = 0;
      for (var i = 1; i < 4; i++) { if (cmp(cuts[i].eff, cuts[ie].eff) > 0) ie = i; if (cmp(cuts[i].viol, cuts[iv].viol) > 0) iv = i; }
      for (i = 0; i < 4; i++) {
        if (i !== ie && eq(cuts[i].eff, cuts[ie].eff)) return null;
        if (i !== iv && eq(cuts[i].viol, cuts[iv].viol)) return null;
      }
      if (ie === iv) return null;                        // la violazione massima deve portare fuori strada
      function o(k) { return { s: "$" + txIneq(k.al, "\\le", k.beta) + "$", v: [k.al[0], k.al[1], k.beta] }; }
      var corr = o(cuts[ie]);
      var d = cuts.filter(function (k, j) { return j !== ie; }).map(o);
      var testo = L(lingua,
        "Nel branch-and-cut il punto $\\tilde{\\vet x} = " + txPt(x) + "$ viola tutti e quattro i tagli proposti nelle risposte. Si sceglie il taglio con l'efficacia massima, cioè con la massima distanza euclidea di $\\tilde{\\vet x}$ dall'iperpiano del taglio. Quale taglio si sceglie?",
        "In branch-and-cut the point $\\tilde{\\vet x} = " + txPt(x) + "$ violates all four cuts proposed in the answers. The cut with maximum efficacy is chosen, that is the one with the largest Euclidean distance of $\\tilde{\\vet x}$ from the hyperplane of the cut. Which cut is chosen?");
      var el = cuts.map(function (k) { return "$" + txIneq(k.al, "\\le", k.beta) + "$: $" + tx(k.viol) + "/" + k.nr + " = " + tx(k.eff) + "$"; }).join("; ");
      var sp = L(lingua,
        "L'efficacia è la violazione divisa per $\\|\\vet\\alpha\\|$; per i quattro tagli vale " + el + ". Il taglio con la violazione più grande non è il più efficace: la violazione dipende dalla scala dei coefficienti.",
        "The efficacy is the violation divided by $\\|\\vet\\alpha\\|$; for the four cuts it is " + el + ". The cut with the largest violation is not the most effective: the violation depends on the scale of the coefficients.");
      return chiudi(rng, testo, corr, d, sp, { x: x.map(fs), tagli: cuts.map(function (k) { return [k.al[0], k.al[1], k.beta]; }) });
    })
  });

  // ================================================================ 32. upper bound sulle variabili e rilassamento (media)
  G.push({
    id: "pli-g-vub-lp", livello: "media", capitolo: "lp-relaxation", link: link("lp-relaxation", "box-16-ex-vub-help"),
    genera: ripeti(function (rng, lingua) {
      var c = [ri(rng, 1, 6), ri(rng, -3, 5)];
      if (c[1] === 0 || gcd(c[0], c[1]) !== 1) return null;
      var A = [[ri(rng, 4, 12), ri(rng, 2, 7)], [ri(rng, 2, 7), ri(rng, 4, 14)]];
      var b = [ri(rng, 15, 50), ri(rng, 15, 50)];
      var u = [Math.min(Math.floor(b[0] / A[0][0]), Math.floor(b[1] / A[1][0])),
               Math.min(Math.floor(b[0] / A[0][1]), Math.floor(b[1] / A[1][1]))];
      var cons = [[A[0][0], A[0][1], b[0]], [A[1][0], A[1][1], b[1]]].concat(nonneg());
      var r0 = lp2(c, cons), r1 = lp2(c, cons.concat([[1, 0, u[0]], [0, 1, u[1]]]));
      if (r0.stato !== "ott" || r1.stato !== "ott" || !r0.unico) return null;
      if (cmp(r0.x[0], u[0]) <= 0 && cmp(r0.x[1], u[1]) <= 0) return null;   // gli upper bound devono tagliare l'ottimo LP
      var ist = { c: c, A: A, b: b };
      var z0 = r0.z, z1 = r1.z, u0 = flo(z0), u1 = flo(z1);
      function o(z, k) { return { s: "$z(\\LP') = " + tx(z) + "$, " + L(lingua, "bound", "bound") + " $" + k + "$", v: [fs(z), k] }; }
      var corr = o(z1, u1);
      var d = filtra(corr, [o(z0, u0), o(z1, cei(z1)), o(z1, u0), o(z1, u1 - 1), o(z1, u1 + 1)]);
      var testo = L(lingua,
        "Nel problema PLI " + txPLI(ist, lingua) + " il rilassamento lineare ha l'ottimo $" + txPt(r0.x) + "$ di valore $z(\\LP) = " + tx(z0) + "$. Si aggiungono gli upper bound sulle variabili ricavati dai vincoli, $x_j \\le \\min_i \\lfloor b_i / a_{ij} \\rfloor$. Quali sono il valore ottimo $z(\\LP')$ del nuovo rilassamento e il bound superiore $\\lfloor z(\\LP') \\rfloor$ su $z(\\ILP)$?",
        "In the ILP problem " + txPLI(ist, lingua) + " the LP relaxation has the optimum $" + txPt(r0.x) + "$ of value $z(\\LP) = " + tx(z0) + "$. The upper bounds on the variables derived from the constraints, $x_j \\le \\min_i \\lfloor b_i / a_{ij} \\rfloor$, are added. What are the optimal value $z(\\LP')$ of the new relaxation and the upper bound $\\lfloor z(\\LP') \\rfloor$ on $z(\\ILP)$?");
      var sp = L(lingua,
        "I coefficienti dei vincoli sono positivi, quindi $x_1 \\le " + u[0] + "$ e $x_2 \\le " + u[1] + "$. L'ottimo $" + txPt(r0.x) + "$ ne viola almeno uno: il nuovo ottimo è $" + txPt(r1.x) + "$, di valore $" + tx(z1) + "$, e con dati interi il bound è $\\lfloor " + tx(z1) + " \\rfloor = " + u1 + "$.",
        "The coefficients of the constraints are positive, so $x_1 \\le " + u[0] + "$ and $x_2 \\le " + u[1] + "$. The optimum $" + txPt(r0.x) + "$ violates at least one of them: the new optimum is $" + txPt(r1.x) + "$, of value $" + tx(z1) + "$, and with integer data the bound is $\\lfloor " + tx(z1) + " \\rfloor = " + u1 + "$.");
      return chiudi(rng, testo, corr, d, sp, { ist: ist });
    })
  });

  // ================================================================ 33. lato dell'inviluppo convesso (complessa)
  G.push({
    id: "pli-g-hull-facet", livello: "complessa", capitolo: "ideal-formulations", link: link("ideal-formulations", "box-2-ex-hull-car"),
    genera: ripeti(function (rng, lingua) {
      var A = [[ri(rng, 2, 7), ri(rng, 1, 4)], [ri(rng, 1, 4), ri(rng, 2, 7)]];
      var b = [ri(rng, 8, 24), ri(rng, 8, 24)];
      var pts = interi(A, b);
      if (pts.length < 7 || pts.length > 18) return null;
      var h = inviluppo(pts);
      if (h.length < 4) return null;
      function mx(al) { var m = null; pts.forEach(function (p) { var v = al[0] * p[0] + al[1] * p[1]; if (m === null || v > m) m = v; }); return m; }
      function nEq(al, be) { return pts.filter(function (p) { return al[0] * p[0] + al[1] * p[1] === be; }).length; }
      var lati = [];
      for (var i = 0; i < h.length; i++) {
        var p = h[i], q = h[(i + 1) % h.length];
        var al = [q[1] - p[1], p[0] - q[0]], g = gcd(al[0], al[1]);
        al = [al[0] / g, al[1] / g];
        var be = al[0] * p[0] + al[1] * p[1];
        if (mx(al) > be) { al = [-al[0], -al[1]]; be = -be; }
        if (mx(al) !== be) continue;
        if (al[0] < 0 || al[1] < 0) continue;                  // niente lati sugli assi
        var orig = false;
        for (var k = 0; k < 2; k++) if (A[k][0] * be === b[k] * al[0] && A[k][1] * be === b[k] * al[1]) orig = true;
        if (orig) continue;
        lati.push({ al: al, be: be, p: p, q: q });
      }
      if (!lati.length) return null;
      var e = pick(rng, lati);
      var vert = null;                                       // disuguaglianza valida e saturata in un solo punto
      var cand = [[e.al[0] + 1, e.al[1]], [e.al[0], e.al[1] + 1], [e.al[0] + 2, e.al[1] + 1], [e.al[0] + 1, e.al[1] + 2]];
      for (k = 0; k < cand.length && !vert; k++) {
        var a2 = cand[k];
        if (gcd(a2[0], a2[1]) !== 1) continue;
        var b2 = mx(a2);
        if (nEq(a2, b2) === 1) vert = { al: a2, be: b2 };
      }
      if (!vert) return null;
      function o(al, be) { return { s: "$" + txIneq(al, "\\le", be) + "$", v: [al[0], al[1], be] }; }
      var corr = o(e.al, e.be);
      var d = [o(e.al, e.be + 1), o(e.al, e.be - 1), o(vert.al, vert.be)];
      var vinc = A.map(function (rr, j) { return "$" + txIneq(rr, "\\le", b[j]) + "$"; }).join(", ");
      var testo = L(lingua,
        "Un problema PLI ha i vincoli " + vinc + " e $x_1, x_2 \\in \\Z_{\\ge 0}$; sia $F$ l'insieme delle sue soluzioni intere ammissibili. Quale disuguaglianza definisce un lato (faccetta) di $\\mathrm{conv}(F)$, cioè è soddisfatta da tutti i punti di $F$ e all'uguaglianza da almeno due punti distinti di $F$?",
        "An ILP problem has the constraints " + vinc + " and $x_1, x_2 \\in \\Z_{\\ge 0}$; let $F$ be the set of its feasible integer solutions. Which inequality defines an edge (facet) of $\\mathrm{conv}(F)$, that is it is satisfied by all the points of $F$ and with equality by at least two distinct points of $F$?");
      var hv = h.map(function (r) { return "(" + r[0] + "," + r[1] + ")"; }).join(", ");
      var sp = L(lingua,
        "I vertici di $\\mathrm{conv}(F)$ sono $" + hv + "$. La retta per $(" + e.p.join(",") + ")$ e $(" + e.q.join(",") + ")$ è $" + txIneq(e.al, "=", e.be) + "$, e nessun punto di $F$ sta oltre. Con termine noto $" + (e.be + 1) + "$ la disuguaglianza è valida ma non saturata, con $" + (e.be - 1) + "$ taglia due vertici; $" + txIneq(vert.al, "\\le", vert.be) + "$ è saturata in un solo punto.",
        "The vertices of $\\mathrm{conv}(F)$ are $" + hv + "$. The line through $(" + e.p.join(",") + ")$ and $(" + e.q.join(",") + ")$ is $" + txIneq(e.al, "=", e.be) + "$, and no point of $F$ lies beyond it. With right-hand side $" + (e.be + 1) + "$ the inequality is valid but not tight, with $" + (e.be - 1) + "$ it cuts off two vertices; $" + txIneq(vert.al, "\\le", vert.be) + "$ is tight at a single point.");
      return chiudi(rng, testo, corr, d, sp, { A: A, b: b });
    })
  });

  // ================================================================ 34. disuguaglianza saturata e nuovo bound (complessa)
  G.push({
    id: "pli-g-vi-bound", livello: "complessa", capitolo: "valid-inequalities", link: link("valid-inequalities", "box-6-ex-x1x2"),
    genera: ripeti(function (rng, lingua) {
      var ist = istanzaAuto(rng); if (!ist) return null;
      if (isInt(ist.lp.z)) return null;
      var pts = interi(ist.A, ist.b);
      if (pts.length > 30) return null;
      var al = pick(rng, [[1, 1], [1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2]]);
      var best = -1; pts.forEach(function (p) { best = Math.max(best, al[0] * p[0] + al[1] * p[1]); });
      var lpv = add(mul(al[0], ist.lp.x[0]), mul(al[1], ist.lp.x[1]));
      if (cmp(lpv, best + 1) < 0) return null;
      var cons = vincoliAuto(ist);
      function zc(be) { var r = lp2(ist.c, cons.concat([[al[0], al[1], be]])); return r.stato === "ott" ? r : null; }
      var r1 = zc(best), rc = zc(best + 1), rm = zc(best - 1);
      if (!r1 || !rc || !rm) return null;
      var u0 = flo(ist.lp.z), u1 = flo(r1.z);
      function o(be, k) { return { s: "$" + txIneq(al, "\\le", be) + "$, " + L(lingua, "bound", "bound") + " $" + k + "$", v: [be, k] }; }
      var corr = o(best, u1);
      var d = filtra(corr, [o(best + 1, flo(rc.z)), o(best, u0), o(best - 1, flo(rm.z)), o(best, cei(r1.z)), o(best, u1 - 1)]);
      var testo = L(lingua,
        "Nel problema PLI " + txPLI(ist, lingua) + " il rilassamento lineare ha l'ottimo $" + txPt(ist.lp.x) + "$ di valore $" + tx(ist.lp.z) + "$. Si aggiunge la disuguaglianza valida e saturata con coefficienti $\\alpha = (" + al.join(", ") + ")$ (termine noto minimo tra quelli soddisfatti da tutti i punti interi ammissibili). Quali sono la disuguaglianza e il nuovo bound superiore $\\lfloor z(\\LP) \\rfloor$?",
        "In the ILP problem " + txPLI(ist, lingua) + " the LP relaxation has the optimum $" + txPt(ist.lp.x) + "$ of value $" + tx(ist.lp.z) + "$. The valid and tight inequality with coefficients $\\alpha = (" + al.join(", ") + ")$ is added (smallest right-hand side satisfied by all the feasible integer points). What are the inequality and the new upper bound $\\lfloor z(\\LP) \\rfloor$?");
      var sp = L(lingua,
        "Il massimo di $" + txLin(al, X) + "$ sui punti interi ammissibili è $" + best + "$, mentre l'ottimo LP dà $" + tx(lpv) + "$: la disuguaglianza lo taglia. Il nuovo rilassamento ha l'ottimo $" + txPt(r1.x) + "$ di valore $" + tx(r1.z) + "$, quindi il bound è $" + u1 + "$ (prima era $" + u0 + "$).",
        "The maximum of $" + txLin(al, X) + "$ over the feasible integer points is $" + best + "$, while the LP optimum gives $" + tx(lpv) + "$: the inequality cuts it off. The new relaxation has the optimum $" + txPt(r1.x) + "$ of value $" + tx(r1.z) + "$, so the bound is $" + u1 + "$ (before it was $" + u0 + "$).");
      return chiudi(rng, testo, corr, d, sp, { ist: verIst(ist), alpha: al });
    })
  });

  // ================================================================ 35. euristica greedy di separazione dei cover (complessa)
  function greedyCover(z, x, perRapporto, rhsPiuUno, fermaSubito) {
    var n = z.a.length, sa = z.a.reduce(function (u, v) { return u + v; }, 0);
    var r = sa - z.b - (rhsPiuUno ? 1 : 0);
    var idx = []; for (var j = 0; j < n; j++) idx.push(j);
    function key(j) { var qj = sub(1, x[j]); return perRapporto ? div(qj, z.a[j]) : qj; }
    idx.sort(function (i, k) { var c = cmp(key(k), key(i)); return c !== 0 ? c : i - k; });
    var y = []; for (j = 0; j < n; j++) y.push(0);
    var stop = false;
    idx.forEach(function (j) {
      if (stop || cmp(sub(1, x[j]), 0) <= 0) return;
      if (z.a[j] <= r) { y[j] = 1; r -= z.a[j]; } else if (fermaSubito) stop = true;
    });
    var C = []; for (j = 0; j < n; j++) if (!y[j]) C.push(j);
    var cost = F(0); C.forEach(function (j) { cost = add(cost, sub(1, x[j])); });
    return { C: C, cost: cost };
  }
  G.push({
    id: "pli-g-cover-greedy", livello: "complessa", capitolo: "cover", link: link("cover", "551-a-greedy-separation-heuristic", "551-uneuristica-greedy-di-separazione"),
    genera: ripeti(function (rng, lingua) {
      var n = 5, z = zaino(rng, n); if (!z) return null;
      var vals = [F(1), F(1), F(0), F(1, 2), F(2, 3), F(3, 4), F(1, 3), F(1, 4), F(3, 5), F(4, 5)];
      var x = []; for (var j = 0; j < n; j++) x.push(pick(rng, vals));
      if (!ammissibile([z.a], [z.b], x) || intero(x)) return null;
      var g = greedyCover(z, x, true, true);
      if (!eCover(z, g.C) || g.C.length < 2 || g.C.length === n) return null;
      var gq = greedyCover(z, x, false, true), gb = greedyCover(z, x, true, false), gs = greedyCover(z, x, true, true, true);
      var comp = []; for (j = 0; j < n; j++) if (g.C.indexOf(j) < 0) comp.push(j);
      var cc = F(0); comp.forEach(function (j) { cc = add(cc, sub(1, x[j])); });
      function o(C, v) { return { s: "$C = " + txIdx(C) + "$, " + L(lingua, "costo", "cost") + " $" + tx(v) + "$", v: [C, fs(v)] }; }
      var corr = o(g.C, g.cost);
      var d = filtra(corr, [o(gq.C, gq.cost), o(gb.C, gb.cost), o(gs.C, gs.cost), o(comp, cc)]);
      var r0 = z.a.reduce(function (u, v) { return u + v; }, 0) - z.b - 1;
      var testo = L(lingua,
        "Per il vincolo " + txZaino(z) + " un cover è un insieme $C$ di indici con $\\sum_{j \\in C} a_j > " + z.b + "$. Si separa $\\tilde{\\vet x} = " + txPt(x) + "$ con l'euristica greedy: $r := \\sum_j a_j - (b + 1)$; si scorrono gli indici per rapporto $(1 - \\tilde x_j)/a_j$ non crescente (parità: indice minore) e si porta $j$ fuori dal cover ($r := r - a_j$) se $1 - \\tilde x_j > 0$ e $a_j \\le r$. Quale cover $C$ (gli indici rimasti) si ottiene, e qual è il suo costo $\\sum_{j \\in C}(1 - \\tilde x_j)$?",
        "For the constraint " + txZaino(z) + " a cover is a set $C$ of indices with $\\sum_{j \\in C} a_j > " + z.b + "$. The point $\\tilde{\\vet x} = " + txPt(x) + "$ is separated with the greedy heuristic: $r := \\sum_j a_j - (b + 1)$; the indices are scanned by non-increasing ratio $(1 - \\tilde x_j)/a_j$ (ties: smaller index) and $j$ is taken out of the cover ($r := r - a_j$) if $1 - \\tilde x_j > 0$ and $a_j \\le r$. Which cover $C$ (the remaining indices) is obtained, and what is its cost $\\sum_{j \\in C}(1 - \\tilde x_j)$?");
      var esito = cmp(g.cost, 1) < 0
        ? L(lingua, "minore di $1$: la disuguaglianza di cover è violata di $" + tx(sub(1, g.cost)) + "$.", "less than $1$: the cover inequality is violated by $" + tx(sub(1, g.cost)) + "$.")
        : L(lingua, "non minore di $1$: la disuguaglianza non è violata, ma l'euristica non prova che nessun cover sia violato.", "not less than $1$: the inequality is not violated, but the heuristic does not prove that no cover is violated.");
      var sp = L(lingua,
        "Si parte da $r = " + r0 + "$. Gli indici portati fuori dal cover sono $" + txIdx(comp) + "$; restano $C = " + txIdx(g.C) + "$, con costo $" + tx(g.cost) + "$, ",
        "We start from $r = " + r0 + "$. The indices taken out of the cover are $" + txIdx(comp) + "$; $C = " + txIdx(g.C) + "$ remains, with cost $" + tx(g.cost) + "$, ") + esito;
      return chiudi(rng, testo, corr, d, sp, { a: z.a, b: z.b, x: x.map(fs) });
    })
  });

  // ================================================================ 36. coefficient tightening nel presolve (media)
  G.push({
    id: "pli-g-presolve", livello: "media", capitolo: "mip-solvers", link: link("mip-solvers", "box-3-ex-solver-presolve"),
    genera: ripeti(function (rng, lingua) {
      var n = ri(rng, 3, 4), a = []; for (var j = 0; j < n; j++) a.push(ri(rng, 2, 9));
      var s = a.reduce(function (u, v) { return u + v; }, 0), mxa = Math.max.apply(null, a);
      var b = ri(rng, mxa, s - 1);
      if (b < mxa || b >= s) return null;
      var k = ri(rng, 0, n - 1), M = 0;
      for (var m = 0; m < (1 << n); m++) {
        if (m & (1 << k)) continue;
        var t = 0; for (j = 0; j < n; j++) if (m & (1 << j)) t += a[j];
        if (t <= b - a[k] && t > M) M = t;
      }
      var ak = b - M;
      if (ak <= a[k]) return null;
      function o(v) { return { s: "$" + v + "$", v: v }; }
      var corr = o(ak);
      var d = filtra(corr, [o(ak + 1), o(a[k]), o(ak - 1), o(b), o(b + 1)]);
      var z = { a: a, b: b };
      var testo = L(lingua,
        "Nel presolve di un solver MIP si considera il vincolo " + txZaino(z) + ". Qual è il valore più grande a cui si può portare il coefficiente di $" + X[k] + "$ (gli altri invariati) senza cambiare l'insieme dei punti binari ammissibili?",
        "In the presolve of a MIP solver the constraint " + txZaino(z) + " is considered. What is the largest value to which the coefficient of $" + X[k] + "$ can be raised (the others unchanged) without changing the set of feasible binary points?");
      var sp = L(lingua,
        "Con $" + X[k] + " = 1$ le altre variabili hanno membro sinistro al più $" + M + "$ (il massimo tra le combinazioni che non superano $" + b + " - " + a[k] + "$). Il coefficiente si può alzare a $" + b + " - " + M + " = " + ak + "$: gli stessi punti restano ammissibili, e il rilassamento lineare diventa più forte. Con $" + (ak + 1) + "$ si perde un punto.",
        "With $" + X[k] + " = 1$ the other variables have left-hand side at most $" + M + "$ (the maximum among the combinations not exceeding $" + b + " - " + a[k] + "$). The coefficient can be raised to $" + b + " - " + M + " = " + ak + "$: the same points stay feasible, and the LP relaxation becomes stronger. With $" + (ak + 1) + "$ a point is lost.");
      return chiudi(rng, testo, corr, d, sp, { a: a, b: b, k: k });
    })
  });

  // ================================================================ 37. relax-and-fix in due blocchi (complessa)
  function relaxFix(ist, ordine) {                       // ordine[0]: variabile del primo blocco
    var p = ordine[0], q = ordine[1], A = ist.A, b = ist.b, c = ist.c;
    var best = null, nb = 0, xp = 0;
    var U = Math.min(Math.floor(b[0] / A[0][p]), Math.floor(b[1] / A[1][p]));
    for (var v = 0; v <= U; v++) {
      var xq = null;
      for (var i = 0; i < 2; i++) { var t = F(b[i] - A[i][p] * v, A[i][q]); if (xq === null || cmp(t, xq) < 0) xq = t; }
      var val = add(c[p] * v, mul(c[q], xq));
      if (best === null || cmp(val, best) > 0) { best = val; xp = v; nb = 1; } else if (eq(val, best)) nb++;
    }
    var xqi = null;
    for (i = 0; i < 2; i++) { var t2 = Math.floor((b[i] - A[i][p] * xp) / A[i][q]); if (xqi === null || t2 < xqi) xqi = t2; }
    var x = [0, 0]; x[p] = xp; x[q] = xqi;
    return { x: x, z: c[0] * x[0] + c[1] * x[1], unico: nb === 1 };
  }
  G.push({
    id: "pli-g-relax-fix", livello: "complessa", capitolo: "mip-heuristics", link: link("mip-heuristics", "box-23-def-rf"),
    genera: ripeti(function (rng, lingua) {
      var ist = istanzaAuto(rng); if (!ist) return null;
      var rf = relaxFix(ist, [0, 1]), rr = relaxFix(ist, [1, 0]);
      if (!rf.unico || !rr.unico) return null;
      var pts = interi(ist.A, ist.b), zo = -1, xo = null;
      pts.forEach(function (p) { var v = ist.c[0] * p[0] + ist.c[1] * p[1]; if (v > zo) { zo = v; xo = p; } });
      var xf = [flo(ist.lp.x[0]), flo(ist.lp.x[1])];
      function o(x) { var v = valore(ist.c, x); return { s: "$" + txPt(x) + "$, " + L(lingua, "valore", "value") + " $" + tx(v) + "$", v: [fs(x[0]), fs(x[1]), fs(v)] }; }
      var corr = o(rf.x);
      var d = filtra(corr, [o(rr.x), o(xf), o(xo), o([rf.x[0], rf.x[1] + 1])]);
      var testo = L(lingua,
        "Si applica il relax-and-fix al problema PLI " + txPLI(ist, lingua) + " con i blocchi $B_1 = \\{x_1\\}$ e $B_2 = \\{x_2\\}$. Passo 1: si risolve il problema con $x_1$ intera e $x_2 \\ge 0$ continua. Passo 2: si fissa $x_1$ al valore trovato e si risolve con $x_2$ intera. Quale soluzione si ottiene?",
        "Relax-and-fix is applied to the ILP problem " + txPLI(ist, lingua) + " with the blocks $B_1 = \\{x_1\\}$ and $B_2 = \\{x_2\\}$. Step 1: the problem is solved with $x_1$ integer and $x_2 \\ge 0$ continuous. Step 2: $x_1$ is fixed to the value found and the problem is solved with $x_2$ integer. Which solution is obtained?");
      var sp = L(lingua,
        "Al passo 1, per ogni valore intero di $x_1$, $x_2$ prende il valore massimo consentito dai vincoli: il migliore è $x_1 = " + rf.x[0] + "$. Al passo 2 $x_2 = " + rf.x[1] + "$, il più grande intero ammissibile. Il valore è $" + rf.z + "$; l'ottimo del problema è $" + zo + "$" + (rf.z < zo ? ": i blocchi rilassati sono ottimisti, e la decisione del passo 1 non viene rivista." : "."),
        "At step 1, for every integer value of $x_1$, $x_2$ takes the largest value allowed by the constraints: the best is $x_1 = " + rf.x[0] + "$. At step 2 $x_2 = " + rf.x[1] + "$, the largest feasible integer. The value is $" + rf.z + "$; the optimum of the problem is $" + zo + "$" + (rf.z < zo ? ": the relaxed blocks are optimistic, and the decision of step 1 is not revised." : "."));
      return chiudi(rng, testo, corr, d, sp, { ist: verIst(ist) });
    })
  });

  // ================================================================ copertura dettagliata (7 novembre 2026)
  // 18 generatori nuovi, ognuno con il gemello in verifica/gemelli_copertura.py

  // ---------------------------------------------------------------- C1. forma canonica di massimizzazione
  G.push({
    id: "pli-g-canon", livello: "facile", capitolo: "ilp", link: link("ilp", "box-1-defILPCanonical"),
    genera: ripeti(function (rng, lingua) {
      var c = [ri(rng, 1, 7), ri(rng, 1, 7)], a1 = [ri(rng, 1, 6), ri(rng, 1, 6)], b1 = ri(rng, 4, 20);
      var a2 = [ri(rng, 1, 6), ri(rng, 1, 6)], b2 = ri(rng, 10, 40);
      function op(o, r1, rhs1) {
        return { s: "$\\max\\ " + txLin(o, X) + "$, $" + txIneq(r1, "\\le", rhs1) + "$, $" + txIneq(a2, "\\le", b2) + "$",
                 v: [o, r1.concat([rhs1]), a2.concat([b2])] };
      }
      var nc = [-c[0], -c[1]], na = [-a1[0], -a1[1]];
      var corr = op(nc, na, -b1);
      var d = [op(c, na, -b1), op(nc, a1, b1), op(nc, na, b1)];
      var testo = L(lingua,
        "Il problema PLI $\\min\\ " + txLin(c, X) + "$ soggetto a $" + txIneq(a1, "\\ge", b1) + "$, $" + txIneq(a2, "\\le", b2) + "$, $x_1, x_2 \\in \\Z_{\\ge 0}$ va scritto in forma canonica di massimizzazione (funzione obiettivo da massimizzare, soli vincoli $\\le$, $\\vet x \\in \\Z^2_{\\ge 0}$). Quale scrittura è corretta?",
        "The ILP problem $\\min\\ " + txLin(c, X) + "$ subject to $" + txIneq(a1, "\\ge", b1) + "$, $" + txIneq(a2, "\\le", b2) + "$, $x_1, x_2 \\in \\Z_{\\ge 0}$ must be written in canonical maximization form (objective to maximize, only $\\le$ constraints, $\\vet x \\in \\Z^2_{\\ge 0}$). Which writing is correct?");
      var sp = L(lingua,
        "$\\min f = -\\max(-f)$: si cambia segno ai costi. Il vincolo $\\ge$ si moltiplica per $-1$ in entrambi i membri, così diventa $\\le$; il vincolo $\\le$ resta com'è.",
        "$\\min f = -\\max(-f)$: change the sign of the costs. The $\\ge$ constraint is multiplied by $-1$ on both sides, so it becomes $\\le$; the $\\le$ constraint stays as it is.");
      return chiudi(rng, testo, corr, d, sp, { c: c, a1: a1, b1: b1, a2: a2, b2: b2 });
    })
  });

  // ---------------------------------------------------------------- C2. formulazione ideale di a(x1 + x2) <= b
  function istRetta(rng) {
    var a = ri(rng, 2, 5), m = ri(rng, 2, 6), b = a * m + ri(rng, 1, a - 1);
    return { a: a, b: b, m: m };
  }
  G.push({
    id: "pli-g-hull-line", livello: "facile", capitolo: "ideal-formulations", link: link("ideal-formulations", "box-4-def-ideal"),
    genera: ripeti(function (rng, lingua) {
      var r = istRetta(rng), a = r.a, b = r.b, m = r.m;
      function op(tipo, rhs) {
        var s = tipo === "o" ? "$" + a + "x_1 + " + a + "x_2 \\le " + b + "$" : "$x_1 + x_2 \\le " + tx(rhs) + "$";
        return { s: s, v: [tipo, fs(rhs)] };
      }
      var corr = op("s", m), d = [op("s", m + 1), op("o", b), op("s", F(b, a))];
      var testo = L(lingua,
        "Sia $F$ l'insieme dei punti interi di $P = \\{\\vet x \\in \\R^2 : " + a + "x_1 + " + a + "x_2 \\le " + b + ",\\ \\vet x \\ge \\vet 0\\}$. Una formulazione è ideale se il suo poliedro è l'inviluppo convesso $\\mathrm{conv}(F)$. Quale vincolo, insieme a $\\vet x \\ge \\vet 0$, dà la formulazione ideale?",
        "Let $F$ be the set of integer points of $P = \\{\\vet x \\in \\R^2 : " + a + "x_1 + " + a + "x_2 \\le " + b + ",\\ \\vet x \\ge \\vet 0\\}$. A formulation is ideal if its polyhedron is the convex hull $\\mathrm{conv}(F)$. Which constraint, together with $\\vet x \\ge \\vet 0$, gives the ideal formulation?");
      var sp = L(lingua,
        "I punti interi soddisfano $x_1 + x_2 \\le \\lfloor " + b + "/" + a + " \\rfloor = " + m + "$; il triangolo di vertici $(0,0)$, $(" + m + ",0)$, $(0," + m + ")$ ha vertici interi, quindi è $\\mathrm{conv}(F)$. Il vincolo originale ha vertici frazionari.",
        "The integer points satisfy $x_1 + x_2 \\le \\lfloor " + b + "/" + a + " \\rfloor = " + m + "$; the triangle with vertices $(0,0)$, $(" + m + ",0)$, $(0," + m + ")$ has integer vertices, so it is $\\mathrm{conv}(F)$. The original constraint has fractional vertices.");
      return chiudi(rng, testo, corr, d, sp, { a: a, b: b });
    })
  });

  // ---------------------------------------------------------------- C3. bound di due formulazioni
  G.push({
    id: "pli-g-stronger-bound", livello: "facile", capitolo: "ideal-formulations", link: link("ideal-formulations", "box-8-def-stronger"),
    genera: ripeti(function (rng, lingua) {
      var r = istRetta(rng), a = r.a, b = r.b, m = r.m;
      var c = [ri(rng, 1, 6), ri(rng, 1, 6)];
      if (c[0] === c[1]) return null;
      var cM = Math.max(c[0], c[1]), cm = Math.min(c[0], c[1]);
      var z1 = mul(cM, F(b, a)), z2 = F(cM * m);
      function op(p, q) { return { s: "$z(\\LP_1) = " + tx(p) + "$, $z(\\LP_2) = " + tx(q) + "$", v: [fs(p), fs(q)] }; }
      var corr = op(z1, z2);
      var d = filtra(corr, [op(z2, z1), op(mul(cm, F(b, a)), F(cm * m)), op(z1, F(cM * (m + 1))), op(z1, z1)]);
      var testo = L(lingua,
        "Per il problema PLI $\\max\\ " + txLin(c, X) + "$, $x_1, x_2 \\in \\Z_{\\ge 0}$, si confrontano due formulazioni con gli stessi punti interi: $P_1$: $" + a + "x_1 + " + a + "x_2 \\le " + b + "$ e $P_2$: $x_1 + x_2 \\le " + m + "$ (entrambe con $\\vet x \\ge \\vet 0$). Quanto valgono i valori ottimi $z(\\LP_1)$ e $z(\\LP_2)$ dei rilassamenti lineari?",
        "For the ILP problem $\\max\\ " + txLin(c, X) + "$, $x_1, x_2 \\in \\Z_{\\ge 0}$, two formulations with the same integer points are compared: $P_1$: $" + a + "x_1 + " + a + "x_2 \\le " + b + "$ and $P_2$: $x_1 + x_2 \\le " + m + "$ (both with $\\vet x \\ge \\vet 0$). What are the optimal values $z(\\LP_1)$ and $z(\\LP_2)$ of the LP relaxations?");
      var sp = L(lingua,
        "L'ottimo sta nel vertice sull'asse della variabile con costo maggiore ($" + cM + "$): in $P_1$ vale $" + cM + " \\cdot \\frac{" + b + "}{" + a + "}$, in $P_2$ vale $" + cM + " \\cdot " + m + "$. $P_2 \\subseteq P_1$ è più forte e dà il bound migliore.",
        "The optimum is at the vertex on the axis of the variable with the larger cost ($" + cM + "$): over $P_1$ it is $" + cM + " \\cdot \\frac{" + b + "}{" + a + "}$, over $P_2$ it is $" + cM + " \\cdot " + m + "$. $P_2 \\subseteq P_1$ is stronger and gives the better bound.");
      return chiudi(rng, testo, corr, d, sp, { a: a, b: b, m: m, c: c });
    })
  });

  // ---------------------------------------------------------------- C4. verifica di una disuguaglianza di cover
  G.push({
    id: "pli-g-cover-check", livello: "facile", capitolo: "cover", link: link("cover", "box-3-def-inequality"),
    genera: ripeti(function (rng, lingua) {
      var n = 4, a = [], j;
      for (j = 0; j < n; j++) a.push(ri(rng, 3, 9));
      var S = a.reduce(function (s, t) { return s + t; }, 0);
      var b = ri(rng, Math.ceil(S / 2), S - 3);
      if (Math.max.apply(null, a) > b) return null;
      var k = pick(rng, [2, 3]), C = mescola(rng, [0, 1, 2, 3]).slice(0, k).sort();
      var sC = C.reduce(function (s, t) { return s + a[t]; }, 0);
      if (sC <= b) return null;
      var den = pick(rng, [2, 3, 4]), x = [];
      for (j = 0; j < n; j++) x.push(C.indexOf(j) >= 0 && rng() < 0.6 ? F(1) : F(ri(rng, 0, den), den));
      if (!ammissibile([a], [b], x)) return null;
      var lhs = F(0), wl = F(0);
      C.forEach(function (t) { lhs = add(lhs, x[t]); wl = add(wl, mul(a[t], x[t])); });
      if (eq(lhs, wl)) return null;
      var viol = cmp(lhs, k - 1) > 0 ? 1 : 0;
      var txC = "\\sum_{j \\in C} x_j";
      function op(rhs, val, vv) {
        var s = "$" + txC + " \\le " + rhs + "$; " + L(lingua, "in $\\tilde{\\vet x}$ il membro sinistro vale $", "at $\\tilde{\\vet x}$ the left-hand side is $") + tx(val) + "$: " +
          (vv ? L(lingua, "violata", "violated") : L(lingua, "soddisfatta", "satisfied"));
        return { s: s, v: [rhs, fs(val), vv] };
      }
      var corr = op(k - 1, lhs, viol);
      var d = [op(k, lhs, cmp(lhs, k) > 0 ? 1 : 0), op(k - 1, lhs, 1 - viol), op(k - 1, wl, cmp(wl, k - 1) > 0 ? 1 : 0)];
      var testo = L(lingua,
        "Si consideri il vincolo binario $" + txIneq(a, "\\le", b) + "$, $x_j \\in \\{0,1\\}$. Un cover è un insieme di indici $C$ con $\\sum_{j \\in C} a_j > " + b + "$. Per $C = " + txIdx(C) + "$ e il punto frazionario $\\tilde{\\vet x} = " + txPt(x) + "$, quale affermazione sulla disuguaglianza di cover di $C$ è corretta?",
        "Consider the binary constraint $" + txIneq(a, "\\le", b) + "$, $x_j \\in \\{0,1\\}$. A cover is a set of indices $C$ with $\\sum_{j \\in C} a_j > " + b + "$. For $C = " + txIdx(C) + "$ and the fractional point $\\tilde{\\vet x} = " + txPt(x) + "$, which statement about the cover inequality of $C$ is correct?");
      var sp = L(lingua,
        "$\\sum_{j \\in C} a_j = " + sC + " > " + b + "$: $C$ è un cover e la sua disuguaglianza è $" + txC + " \\le |C| - 1 = " + (k - 1) + "$. In $\\tilde{\\vet x}$ la somma delle componenti di $C$ (senza pesi $a_j$) vale $" + tx(lhs) + "$.",
        "$\\sum_{j \\in C} a_j = " + sC + " > " + b + "$: $C$ is a cover and its inequality is $" + txC + " \\le |C| - 1 = " + (k - 1) + "$. At $\\tilde{\\vet x}$ the sum of the components in $C$ (without weights $a_j$) is $" + tx(lhs) + "$.");
      return chiudi(rng, testo, corr, d, sp, { a: a, b: b, C: C, x: x.map(fs) });
    })
  });

  // ---------------------------------------------------------------- C5. riga del taglio con termine noto più grande
  G.push({
    id: "pli-g-gomory-select", livello: "facile", capitolo: "gomory", link: link("gomory", "box-9-def-cpa"),
    genera: ripeti(function (rng, lingua) {
      var vals = [], j;
      for (j = 0; j < 4; j++) {
        var q = pick(rng, [2, 3, 4, 5, 6]);
        vals.push(rng() < 0.15 ? F(ri(rng, 1, 9)) : add(ri(rng, 0, 9), F(ri(rng, 1, q - 1), q)));
      }
      vals[3] = add(vals[3], ri(rng, 10, 30));          // valore della funzione obiettivo
      var fr = vals.map(frac);
      if (fr.every(function (f) { return f.n === 0; })) return null;
      // regola: frazione massima; parità: indice minimo della variabile in base, riga obiettivo per ultima
      var best = -1;
      for (j = 0; j < 4; j++) if (fr[j].n !== 0 && (best < 0 || cmp(fr[j], fr[best]) > 0)) best = j;
      var nomi = [L(lingua, "la riga di $x_1$", "the row of $x_1$"), L(lingua, "la riga di $x_2$", "the row of $x_2$"),
                  L(lingua, "la riga di $x_3$", "the row of $x_3$"), L(lingua, "la riga della funzione obiettivo", "the objective row")];
      var ops = [0, 1, 2, 3].map(function (t) { return { s: nomi[t], v: t }; });
      var corr = ops[best], d = ops.filter(function (o, t) { return t !== best; });
      var testo = L(lingua,
        "Nell'algoritmo dei piani di taglio per un problema PLI canonico di massimo con dati interi, il dizionario ottimo corrente ha in base $x_1$, $x_2$, $x_3$ con valori $\\bar b_1 = " + tx(vals[0]) + "$, $\\bar b_2 = " + tx(vals[1]) + "$, $\\bar b_3 = " + tx(vals[2]) + "$, e valore $\\bar z = " + tx(vals[3]) + "$. Con la strategia del termine noto più grande (termine noto del taglio $= $ parte frazionaria; parità: indice minimo, riga obiettivo per ultima), da quale riga si genera il taglio di Gomory?",
        "In the cutting plane algorithm for a canonical maximization ILP problem with integer data, the current optimal dictionary has basic $x_1$, $x_2$, $x_3$ with values $\\bar b_1 = " + tx(vals[0]) + "$, $\\bar b_2 = " + tx(vals[1]) + "$, $\\bar b_3 = " + tx(vals[2]) + "$, and value $\\bar z = " + tx(vals[3]) + "$. With the largest right-hand side strategy (right-hand side of the cut $= $ fractional part; ties: smallest index, objective row last), from which row is the Gomory cut generated?");
      var sp = L(lingua,
        "Parti frazionarie: $" + fr.map(tx).join("$, $") + "$ (righe di $x_1$, $x_2$, $x_3$ e obiettivo); le righe con valore intero non generano tagli. Si sceglie la parte frazionaria massima.",
        "Fractional parts: $" + fr.map(tx).join("$, $") + "$ (rows of $x_1$, $x_2$, $x_3$ and objective); rows with integer value generate no cut. The largest fractional part is chosen.");
      return chiudi(rng, testo, corr, d, sp, { vals: vals.map(fs) });
    })
  });

  // ---------------------------------------------------------------- C6. rafforzamento dei bound nel presolve
  G.push({
    id: "pli-g-presolve-bound", livello: "facile", capitolo: "mip-solvers", link: link("mip-solvers", "box-2-def-presolve"),
    genera: ripeti(function (rng, lingua) {
      var a = [ri(rng, 2, 6), ri(rng, 3, 7), ri(rng, 2, 6)], l1 = ri(rng, 1, 3), l3 = ri(rng, 1, 3);
      var b = ri(rng, 20, 45), res = b - a[0] * l1 - a[2] * l3;
      if (res <= a[1] || res % a[1] === 0) return null;
      var U = Math.floor(res / a[1]), U0 = Math.floor(b / a[1]);
      if (U0 === U) return null;
      function op(v) { return { s: "$x_2 \\le " + tx(v) + "$", v: fs(v) }; }
      var corr = op(U), d = filtra(corr, [op(U0), op(F(res, a[1])), op(U + 1)]);
      var testo = L(lingua,
        "Nel presolve di un solver MIP, il vincolo $" + txIneq(a, "\\le", b, X) + "$ ha variabili intere con $x_1 \\ge " + l1 + "$, $x_2 \\ge 0$, $x_3 \\ge " + l3 + "$. Quale upper bound su $x_2$ ricava il rafforzamento dei bound?",
        "In the presolve of a MIP solver, the constraint $" + txIneq(a, "\\le", b, X) + "$ has integer variables with $x_1 \\ge " + l1 + "$, $x_2 \\ge 0$, $x_3 \\ge " + l3 + "$. Which upper bound on $x_2$ does bound tightening derive?");
      var sp = L(lingua,
        "Con $x_1$ e $x_3$ ai loro lower bound: $" + a[1] + "x_2 \\le " + b + " - " + a[0] + " \\cdot " + l1 + " - " + a[2] + " \\cdot " + l3 + " = " + res + "$, e $x_2$ intera dà $x_2 \\le \\lfloor " + res + "/" + a[1] + " \\rfloor = " + U + "$.",
        "With $x_1$ and $x_3$ at their lower bounds: $" + a[1] + "x_2 \\le " + b + " - " + a[0] + " \\cdot " + l1 + " - " + a[2] + " \\cdot " + l3 + " = " + res + "$, and integer $x_2$ gives $x_2 \\le \\lfloor " + res + "/" + a[1] + " \\rfloor = " + U + "$.");
      return chiudi(rng, testo, corr, d, sp, { a: a, b: b, l1: l1, l3: l3 });
    })
  });

  // ---------------------------------------------------------------- C7. lettura dei bound nel log (massimo o minimo)
  G.push({
    id: "pli-g-solver-minmax", livello: "facile", capitolo: "mip-solvers", link: link("mip-solvers", "box-1-def-solver"),
    genera: ripeti(function (rng, lingua) {
      var max = rng() < 0.5, I = ri(rng, 40, 400), d0 = ri(rng, 1, 25);
      var B = max ? I + d0 : I - d0;
      var lo = Math.min(I, B), hi = Math.max(I, B);
      var ops = [
        { s: L(lingua, "Incumbent ($" + I + "$) è un lower bound e BestBd ($" + B + "$) un upper bound su $z^*$", "Incumbent ($" + I + "$) is a lower bound and BestBd ($" + B + "$) an upper bound on $z^*$"), v: "IL" },
        { s: L(lingua, "Incumbent ($" + I + "$) è un upper bound e BestBd ($" + B + "$) un lower bound su $z^*$", "Incumbent ($" + I + "$) is an upper bound and BestBd ($" + B + "$) a lower bound on $z^*$"), v: "IU" },
        { s: L(lingua, "Il valore ottimo è $z^* = " + I + "$, il valore dell'incumbent", "The optimal value is $z^* = " + I + "$, the incumbent value"), v: "EI" },
        { s: L(lingua, "Il valore ottimo è $z^* = " + B + "$, il best bound", "The optimal value is $z^* = " + B + "$, the best bound"), v: "EB" }];
      var k = max ? 0 : 1;
      var testo = L(lingua,
        "Il log di Gurobi per un problema di " + (max ? "massimo" : "minimo") + " con valore ottimo $z^*$ (sconosciuto) si interrompe con Incumbent $= " + I + "$ e BestBd $= " + B + "$. Che cosa si può affermare?",
        "The Gurobi log for a " + (max ? "maximization" : "minimization") + " problem with (unknown) optimal value $z^*$ stops with Incumbent $= " + I + "$ and BestBd $= " + B + "$. What can be stated?");
      var sp = L(lingua,
        "Incumbent è il valore di una soluzione ammissibile (lato primale), BestBd il bound del branch-and-cut (lato duale). In un problema di " + (max ? "massimo l'incumbent è un lower bound" : "minimo l'incumbent è un upper bound") + "; con gap non nullo non si conosce $z^*$, solo $" + lo + " \\le z^* \\le " + hi + "$.",
        "Incumbent is the value of a feasible solution (primal side), BestBd the bound of branch-and-cut (dual side). In a " + (max ? "maximization problem the incumbent is a lower bound" : "minimization problem the incumbent is an upper bound") + "; with a nonzero gap $z^*$ is unknown, only $" + lo + " \\le z^* \\le " + hi + "$.");
      return chiudi(rng, testo, ops[k], ops.filter(function (o, t) { return t !== k; }), sp, { max: max ? 1 : 0, I: I, B: B });
    })
  });

  // ---------------------------------------------------------------- C8. intorno di local branching
  G.push({
    id: "pli-g-lb-neigh", livello: "facile", capitolo: "mip-heuristics", link: link("mip-heuristics", "box-18-def-lb"),
    genera: ripeti(function (rng, lingua) {
      var n = 6, k = pick(rng, [1, 2]), xb = [], j;
      for (j = 0; j < n; j++) xb.push(rng() < 0.5 ? 1 : 0);
      function vicino(dist) {
        var p = xb.slice(), idx = mescola(rng, [0, 1, 2, 3, 4, 5]).slice(0, dist);
        idx.forEach(function (t) { p[t] = 1 - p[t]; });
        return p;
      }
      var dc = ri(rng, 1, k), pts = [vicino(dc), vicino(k + 1), vicino(k + 2), vicino(Math.min(n, k + ri(rng, 1, 3)))];
      function op(p) { return { s: "$(" + p.join(", ") + ")$", v: p }; }
      var corr = op(pts[0]), d = filtra(corr, pts.slice(1).map(op));
      var testo = L(lingua,
        "In un MIP con $6$ variabili binarie, il local branching attorno all'incumbent $\\bar{\\vet x} = (" + xb.join(", ") + ")$ aggiunge il vincolo $\\Delta(\\vet x, \\bar{\\vet x}) = \\sum_{j: \\bar x_j = 1}(1 - x_j) + \\sum_{j: \\bar x_j = 0} x_j \\le " + k + "$. Quale dei seguenti punti binari appartiene all'intorno?",
        "In a MIP with $6$ binary variables, local branching around the incumbent $\\bar{\\vet x} = (" + xb.join(", ") + ")$ adds the constraint $\\Delta(\\vet x, \\bar{\\vet x}) = \\sum_{j: \\bar x_j = 1}(1 - x_j) + \\sum_{j: \\bar x_j = 0} x_j \\le " + k + "$. Which of the following binary points belongs to the neighbourhood?");
      var sp = L(lingua,
        "Sui punti binari $\\Delta$ conta le componenti diverse da $\\bar{\\vet x}$: il punto corretto ne cambia $" + dc + " \\le " + k + "$, gli altri almeno $" + (k + 1) + "$.",
        "On binary points $\\Delta$ counts the components that differ from $\\bar{\\vet x}$: the correct point changes $" + dc + " \\le " + k + "$, the others at least $" + (k + 1) + "$.");
      return chiudi(rng, testo, corr, d, sp, { xb: xb, k: k });
    })
  });

  // ---------------------------------------------------------------- C9. scelta della proximity search
  G.push({
    id: "pli-g-ps-pick", livello: "facile", capitolo: "mip-heuristics", link: link("mip-heuristics", "box-20-def-ps"),
    genera: ripeti(function (rng, lingua) {
      var f0 = ri(rng, 30, 80), sol = [], j;
      for (j = 0; j < 5; j++) sol.push({ f: f0 + ri(rng, -6, 3), d: ri(rng, 1, 9) });
      var amm = sol.map(function (s) { return s.f <= f0 - 1; });
      var cand = [0, 1, 2, 3, 4].filter(function (t) { return amm[t]; });
      if (cand.length < 2) return null;
      var dmin = Math.min.apply(null, cand.map(function (t) { return sol[t].d; }));
      var best = cand.filter(function (t) { return sol[t].d === dmin; });
      if (best.length !== 1) return null;
      best = best[0];
      var dAll = Math.min.apply(null, sol.map(function (s) { return s.d; }));
      var nearAll = [0, 1, 2, 3, 4].filter(function (t) { return sol[t].d === dAll; });
      var fmin = Math.min.apply(null, sol.map(function (s) { return s.f; }));
      var bestF = [0, 1, 2, 3, 4].filter(function (t) { return sol[t].f === fmin; });
      if (nearAll.length !== 1 || amm[nearAll[0]] || bestF.length !== 1 || bestF[0] === best) return null;
      var altri = [0, 1, 2, 3, 4].filter(function (t) { return t !== best && t !== nearAll[0] && t !== bestF[0]; });
      var nom = function (t) { return { s: "$S_" + (t + 1) + "$", v: t }; };
      var corr = nom(best), d = [nom(nearAll[0]), nom(bestF[0]), nom(altri[0])];
      var tab = sol.map(function (s, t) { return "$S_" + (t + 1) + "$: $f = " + s.f + "$, $\\Delta = " + s.d + "$"; }).join("; ");
      var testo = L(lingua,
        "Nella proximity search per un MIP $\\min f(\\vet x)$ con $f$ intera, l'incumbent ha $f(\\bar{\\vet x}) = " + f0 + "$ e si usa $\\theta = 1$. Il sotto-MIP minimizza la distanza $\\Delta(\\vet x, \\bar{\\vet x})$ con il vincolo $f(\\vet x) \\le f(\\bar{\\vet x}) - \\theta$. Le soluzioni ammissibili del MIP sono soltanto: " + tab + ". Quale restituisce il sotto-MIP?",
        "In proximity search for a MIP $\\min f(\\vet x)$ with integer $f$, the incumbent has $f(\\bar{\\vet x}) = " + f0 + "$ and $\\theta = 1$ is used. The sub-MIP minimizes the distance $\\Delta(\\vet x, \\bar{\\vet x})$ with the constraint $f(\\vet x) \\le f(\\bar{\\vet x}) - \\theta$. The feasible solutions of the MIP are only: " + tab + ". Which one does the sub-MIP return?");
      var sp = L(lingua,
        "Sono ammesse solo le soluzioni con $f \\le " + (f0 - 1) + "$; fra queste si prende quella a distanza minima, $S_" + (best + 1) + "$. La più vicina in assoluto viola il cutoff; la migliore per $f$ non è la più vicina.",
        "Only solutions with $f \\le " + (f0 - 1) + "$ are allowed; among them the closest one is taken, $S_" + (best + 1) + "$. The closest overall violates the cutoff; the best for $f$ is not the closest.");
      return chiudi(rng, testo, corr, d, sp, { f0: f0, sol: sol.map(function (s) { return [s.f, s.d]; }) });
    })
  });

  // ---------------------------------------------------------------- M1. z(LP) e z(ILP)
  G.push({
    id: "pli-g-lp-ilp", livello: "media", capitolo: "lp-relaxation", link: link("lp-relaxation", "box-8-prop-lp-bound"),
    genera: ripeti(function (rng, lingua) {
      var ist = istanzaAuto(rng);
      if (!ist) return null;
      var zl = ist.lp.z, pts = interi(ist.A, ist.b), zi = null;
      pts.forEach(function (p) { var v = ist.c[0] * p[0] + ist.c[1] * p[1]; if (zi === null || v > zi) zi = v; });
      var xd = ist.lp.x.map(flo), zd = ist.c[0] * xd[0] + ist.c[1] * xd[1];
      if (zd === zi || isInt(zl)) return null;
      function op(p, q) { return { s: "$z(\\LP) = " + tx(p) + "$, $z(\\ILP) = " + tx(q) + "$", v: [fs(p), fs(q)] }; }
      var corr = op(zl, zi);
      var d = filtra(corr, [op(zl, zd), op(flo(zl), zi), op(zl, flo(zl)), op(F(zi), zl)]);
      var testo = L(lingua,
        "Si consideri il problema PLI " + txPLI(ist, lingua) + ". Quanto valgono il valore ottimo $z(\\LP)$ del rilassamento lineare e il valore ottimo $z(\\ILP)$ del problema PLI?",
        "Consider the ILP problem " + txPLI(ist, lingua) + ". What are the optimal value $z(\\LP)$ of the LP relaxation and the optimal value $z(\\ILP)$ of the ILP problem?");
      var sp = L(lingua,
        "L'ottimo del rilassamento è il vertice $" + txPt(ist.lp.x) + "$ dei due vincoli, con valore $" + tx(zl) + "$; enumerando i punti interi ammissibili il massimo è $" + zi + "$. Vale $z(\\ILP) \\le \\lfloor z(\\LP) \\rfloor$; l'arrotondamento per difetto $" + txPt(xd) + "$ vale solo $" + zd + "$.",
        "The optimum of the relaxation is the vertex $" + txPt(ist.lp.x) + "$ of the two constraints, with value $" + tx(zl) + "$; enumerating the feasible integer points the maximum is $" + zi + "$. We have $z(\\ILP) \\le \\lfloor z(\\LP) \\rfloor$; rounding down to $" + txPt(xd) + "$ gives only $" + zd + "$.");
      return chiudi(rng, testo, corr, d, sp, { ist: verIst(ist) });
    })
  });

  // ---------------------------------------------------------------- M2. numero di cover minimali
  G.push({
    id: "pli-g-cover-count", livello: "media", capitolo: "cover", link: link("cover", "box-5-def-minimal"),
    genera: ripeti(function (rng, lingua) {
      var n = pick(rng, [4, 5]), a = [], j;
      for (j = 0; j < n; j++) a.push(ri(rng, 2, 9));
      var S = a.reduce(function (s, t) { return s + t; }, 0), b = ri(rng, Math.ceil(S / 3), S - 2);
      if (Math.max.apply(null, a) > b) return null;
      var nc = 0, nm = 0, n2 = 0;
      for (var m = 1; m < (1 << n); m++) {
        var w = 0, C = [];
        for (j = 0; j < n; j++) if (m & (1 << j)) { w += a[j]; C.push(j); }
        if (w <= b) continue;
        nc++;
        if (C.length === 2) n2++;
        if (C.every(function (t) { return w - a[t] <= b; })) nm++;
      }
      if (nm < 2) return null;
      function op(v) { return { s: "$" + v + "$", v: v }; }
      var corr = op(nm), d = filtra(corr, [op(nc), op(nm + 1), op(n2), op(nm - 1)]);
      var testo = L(lingua,
        "Si consideri il vincolo binario $" + txIneq(a, "\\le", b) + "$, $x_j \\in \\{0,1\\}$. Un cover è un insieme di indici $C$ con $\\sum_{j \\in C} a_j > " + b + "$, ed è minimale se nessun suo sottoinsieme proprio è un cover. Quanti cover minimali ha il vincolo?",
        "Consider the binary constraint $" + txIneq(a, "\\le", b) + "$, $x_j \\in \\{0,1\\}$. A cover is a set of indices $C$ with $\\sum_{j \\in C} a_j > " + b + "$, and it is minimal if no proper subset of it is a cover. How many minimal covers does the constraint have?");
      var sp = L(lingua,
        "Il vincolo ha $" + nc + "$ cover; sono minimali quelli per cui togliendo un qualunque indice il peso scende a $\\le " + b + "$ (con coefficienti positivi basta togliere un indice alla volta): $" + nm + "$.",
        "The constraint has $" + nc + "$ covers; minimal are those for which removing any index brings the weight to $\\le " + b + "$ (with positive coefficients removing one index at a time suffices): $" + nm + "$.");
      return chiudi(rng, testo, corr, d, sp, { a: a, b: b });
    })
  });

  // ---------------------------------------------------------------- M3. formulazione ideale? (vertici)
  G.push({
    id: "pli-g-ideal-vert", livello: "media", capitolo: "ideal-formulations", link: link("ideal-formulations", "box-4-def-ideal"),
    genera: ripeti(function (rng, lingua) {
      var A = [[ri(rng, 1, 5), ri(rng, 1, 5)], [ri(rng, 1, 5), ri(rng, 1, 5)]], b = [ri(rng, 4, 16), ri(rng, 4, 16)];
      var r = lp2([1, 1], [[A[0][0], A[0][1], b[0]], [A[1][0], A[1][1], b[1]]].concat(nonneg()));
      if (r.stato !== "ott") return null;
      var fv = r.vertici.filter(function (v) { return !intero(v); });
      if (fv.length !== 1 || r.vertici.length < 4) return null;
      var vi = r.vertici.filter(function (v) { return intero(v); });
      // un punto frazionario di P che non è un vertice: punto medio fra il vertice frazionario e l'origine
      var mid = [div(fv[0][0], 2), div(fv[0][1], 2)];
      if (intero(mid)) return null;
      var ops = [
        { s: L(lingua, "No: $" + txPt(fv[0]) + "$ è un vertice frazionario di $P$", "No: $" + txPt(fv[0]) + "$ is a fractional vertex of $P$"), v: ["no", fv[0].map(fs)] },
        { s: L(lingua, "Sì: tutti i vertici di $P$ sono interi", "Yes: all vertices of $P$ are integer"), v: ["si"] },
        { s: L(lingua, "No: $" + txPt(mid) + "$ è un vertice frazionario di $P$", "No: $" + txPt(mid) + "$ is a fractional vertex of $P$"), v: ["no", mid.map(fs)] },
        { s: L(lingua, "Sì: $P \\cap \\Z^2 = F$ basta perché $P$ sia ideale", "Yes: $P \\cap \\Z^2 = F$ is enough for $P$ to be ideal"), v: ["si2"] }];
      var testo = L(lingua,
        "Sia $P = \\{\\vet x \\in \\R^2 : " + txIneq(A[0], "\\le", b[0]) + ",\\ " + txIneq(A[1], "\\le", b[1]) + ",\\ \\vet x \\ge \\vet 0\\}$ la formulazione di un problema PLI con regione ammissibile $F = P \\cap \\Z^2$. $P$ è ideale ($P = \\mathrm{conv}(F)$)?",
        "Let $P = \\{\\vet x \\in \\R^2 : " + txIneq(A[0], "\\le", b[0]) + ",\\ " + txIneq(A[1], "\\le", b[1]) + ",\\ \\vet x \\ge \\vet 0\\}$ be the formulation of an ILP problem with feasible region $F = P \\cap \\Z^2$. Is $P$ ideal ($P = \\mathrm{conv}(F)$)?");
      var sp = L(lingua,
        "I vertici di $P$ sono $" + r.vertici.map(txPt).join("$, $") + "$. Un vertice frazionario non è in $\\mathrm{conv}(F)$, i cui vertici sono interi: $P$ non è ideale. $" + txPt(mid) + "$ sta in $P$ ma non è un vertice.",
        "The vertices of $P$ are $" + r.vertici.map(txPt).join("$, $") + "$. A fractional vertex is not in $\\mathrm{conv}(F)$, whose vertices are integer: $P$ is not ideal. $" + txPt(mid) + "$ lies in $P$ but is not a vertex.");
      return chiudi(rng, testo, ops[0], ops.slice(1), sp, { A: A, b: b });
    })
  });

  // ---------------------------------------------------------------- M4. RINS su uno zaino binario
  G.push({
    id: "pli-g-rins-sub", livello: "media", capitolo: "mip-heuristics", link: link("mip-heuristics", "box-16-def-rins"),
    genera: ripeti(function (rng, lingua) {
      var n = 5, p = [], w = [], j;
      for (j = 0; j < n; j++) { p.push(ri(rng, 3, 15)); w.push(ri(rng, 2, 9)); }
      var W = ri(rng, 10, 22);
      // rilassamento lineare (greedy frazionario), rapporti tutti distinti
      var ord = [0, 1, 2, 3, 4].sort(function (u, v) { return p[v] * w[u] - p[u] * w[v]; });
      for (j = 0; j + 1 < n; j++) if (p[ord[j]] * w[ord[j + 1]] === p[ord[j + 1]] * w[ord[j]]) return null;
      var xt = [F(0), F(0), F(0), F(0), F(0)], cap = W;
      for (j = 0; j < n; j++) {
        var t = ord[j];
        if (w[t] <= cap) { xt[t] = F(1); cap -= w[t]; } else { xt[t] = F(cap, w[t]); cap = 0; }
      }
      if (xt.every(isInt)) return null;
      // incumbent: ammissibile, diverso dall'ottimo
      var xb = [];
      for (j = 0; j < n; j++) xb.push(rng() < 0.5 ? 1 : 0);
      var wb = 0, vb = 0;
      for (j = 0; j < n; j++) { wb += w[j] * xb[j]; vb += p[j] * xb[j]; }
      if (wb > W) return null;
      var fix = [];
      for (j = 0; j < n; j++) fix.push(isInt(xt[j]) && xt[j].n === xb[j]);
      var nfree = fix.filter(function (f) { return !f; }).length;
      if (nfree < 2 || nfree > 4) return null;
      var bestSub = null, bestAll = 0;
      for (var m = 0; m < 32; m++) {
        var ww = 0, vv = 0, okf = true;
        for (j = 0; j < n; j++) {
          var xj = (m >> j) & 1;
          ww += w[j] * xj; vv += p[j] * xj;
          if (fix[j] && xj !== xb[j]) okf = false;
        }
        if (ww > W) continue;
        if (vv > bestAll) bestAll = vv;
        if (okf && vv >= vb + 1 && (bestSub === null || vv > bestSub)) bestSub = vv;
      }
      var ris = bestSub === null ? vb : bestSub;
      var zl = valore(p, xt);
      function op(v) { return { s: "$" + tx(v) + "$", v: fs(v) }; }
      var corr = op(ris), d = filtra(corr, [op(bestAll), op(vb), op(flo(zl)), op(ris + 1)]);
      var testo = L(lingua,
        "Si applica RINS al problema dello zaino binario $\\max\\ " + txLin(p, X) + "$, $" + txIneq(w, "\\le", W) + "$, $\\vet x \\in \\{0,1\\}^5$, con incumbent $\\bar{\\vet x} = (" + xb.join(", ") + ")$ e soluzione del rilassamento lineare $\\tilde{\\vet x} = " + txPt(xt) + "$. RINS fissa le variabili su cui $\\bar{\\vet x}$ e $\\tilde{\\vet x}$ coincidono e risolve il sotto-MIP sulle altre con il cutoff $\\text{valore} \\ge " + vb + " + 1$. Qual è il valore della soluzione che RINS restituisce (l'incumbent, se il sotto-MIP è inammissibile)?",
        "RINS is applied to the binary knapsack problem $\\max\\ " + txLin(p, X) + "$, $" + txIneq(w, "\\le", W) + "$, $\\vet x \\in \\{0,1\\}^5$, with incumbent $\\bar{\\vet x} = (" + xb.join(", ") + ")$ and LP relaxation solution $\\tilde{\\vet x} = " + txPt(xt) + "$. RINS fixes the variables on which $\\bar{\\vet x}$ and $\\tilde{\\vet x}$ coincide and solves the sub-MIP on the others with the cutoff $\\text{value} \\ge " + vb + " + 1$. What is the value of the solution RINS returns (the incumbent, if the sub-MIP is infeasible)?");
      var libere = [];
      for (j = 0; j < n; j++) if (!fix[j]) libere.push("x_" + (j + 1));
      var sp = L(lingua,
        "Restano libere $" + libere.join(", ") + "$; enumerandole (con le altre fissate) il miglior valore ammissibile " + (bestSub === null ? "non supera $" + vb + "$: il sotto-MIP è inammissibile e resta l'incumbent" : "con cutoff è $" + bestSub + "$") + ". L'ottimo globale vale $" + bestAll + "$: il fissaggio può escluderlo.",
        "The free variables are $" + libere.join(", ") + "$; enumerating them (the others fixed) the best feasible value " + (bestSub === null ? "does not exceed $" + vb + "$: the sub-MIP is infeasible and the incumbent stays" : "with cutoff is $" + bestSub + "$") + ". The global optimum is $" + bestAll + "$: fixing may exclude it.");
      return chiudi(rng, testo, corr, d, sp, { p: p, w: w, W: W, xb: xb, xt: xt.map(fs) });
    })
  });

  // ---------------------------------------------------------------- M5. taglio locale in un nodo
  G.push({
    id: "pli-g-local-valid", livello: "media", capitolo: "branch-and-cut", link: link("branch-and-cut", "box-2-def-global-local"),
    genera: ripeti(function (rng, lingua) {
      var a = [ri(rng, 3, 9), ri(rng, 2, 7)], b = ri(rng, 20, 50);
      var u1 = Math.floor(b / a[0]);
      if (u1 < 3) return null;
      var k = ri(rng, 1, u1 - 1), Lc = Math.floor((b - a[0] * k) / a[1]), G0 = Math.floor(b / a[1]);
      if (Lc < 1 || G0 <= Lc + 1) return null;
      function op(v) { return { s: "$x_2 \\le " + v + "$", v: v }; }
      var corr = op(Lc), d = [op(G0), op(Lc - 1), op(Lc + 1)];
      var testo = L(lingua,
        "In un algoritmo branch-and-cut per il problema PLI $\\max\\ x_1 + x_2$, $" + txIneq(a, "\\le", b) + "$, $x_1, x_2 \\in \\Z_{\\ge 0}$, il nodo $k$ ha il vincolo di branching $x_1 \\ge " + k + "$. Quale disuguaglianza è valida per tutte le soluzioni intere del nodo, è saturata da una di esse, e non è valida per l'intero problema (taglio locale)?",
        "In a branch-and-cut algorithm for the ILP problem $\\max\\ x_1 + x_2$, $" + txIneq(a, "\\le", b) + "$, $x_1, x_2 \\in \\Z_{\\ge 0}$, node $k$ has the branching constraint $x_1 \\ge " + k + "$. Which inequality is valid for all integer solutions of the node, is tight at one of them, and is not valid for the whole problem (local cut)?");
      var sp = L(lingua,
        "Con $x_1 \\ge " + k + "$: $" + a[1] + "x_2 \\le " + b + " - " + a[0] + " \\cdot " + k + "$, quindi $x_2 \\le " + Lc + "$, saturata in $(" + k + ", " + Lc + ")$. Fuori dal nodo $(0, " + G0 + ")$ è ammissibile e la viola. $x_2 \\le " + G0 + "$ è globale; $x_2 \\le " + (Lc - 1) + "$ taglia $(" + k + ", " + Lc + ")$; $x_2 \\le " + (Lc + 1) + "$ non è saturata.",
        "With $x_1 \\ge " + k + "$: $" + a[1] + "x_2 \\le " + b + " - " + a[0] + " \\cdot " + k + "$, so $x_2 \\le " + Lc + "$, tight at $(" + k + ", " + Lc + ")$. Outside the node $(0, " + G0 + ")$ is feasible and violates it. $x_2 \\le " + G0 + "$ is global; $x_2 \\le " + (Lc - 1) + "$ cuts off $(" + k + ", " + Lc + ")$; $x_2 \\le " + (Lc + 1) + "$ is not tight.");
      return chiudi(rng, testo, corr, d, sp, { a: a, b: b, k: k });
    })
  });

  // ---------------------------------------------------------------- M6. presolve a catena
  G.push({
    id: "pli-g-presolve-chain", livello: "media", capitolo: "mip-solvers", link: link("mip-solvers", "box-2-def-presolve"),
    genera: ripeti(function (rng, lingua) {
      var a11 = ri(rng, 2, 6), a12 = ri(rng, 1, 5), l2 = ri(rng, 1, 3), b1 = ri(rng, 12, 40);
      var dd = ri(rng, 1, 4), a22 = ri(rng, 2, 7), b2 = ri(rng, 2, 15), u1 = ri(rng, 15, 25);
      var r1 = b1 - a12 * l2;
      if (r1 < a11 || r1 % a11 === 0) return null;
      var U1 = Math.floor(r1 / a11);
      if (U1 >= u1) return null;
      var r2 = b2 + dd * U1, U2 = Math.floor(r2 / a22), U2s = Math.floor((b2 + dd * u1) / a22), U1n = Math.floor(b1 / a11);
      if (r2 % a22 === 0 || U2 === U2s || U2 < l2) return null;   // istanza ammissibile: serve x2 >= l2
      function op(p, q) { return { s: "$x_1 \\le " + p + "$, $x_2 \\le " + q + "$", v: [p, q] }; }
      var corr = op(U1, U2);
      var d = filtra(corr, [op(U1, U2s), op(U1n, Math.floor((b2 + dd * U1n) / a22)), op(U1, U2 + 1), op(U1 + 1, Math.floor((b2 + dd * (U1 + 1)) / a22))]);
      var testo = L(lingua,
        "Nel presolve di un solver MIP le variabili intere $x_1 \\in [0, " + u1 + "]$, $x_2 \\in [" + l2 + ", +\\infty)$ compaiono nei vincoli $" + a11 + "x_1 + " + a12 + "x_2 \\le " + b1 + "$ e $-" + (dd === 1 ? "" : dd) + "x_1 + " + a22 + "x_2 \\le " + b2 + "$. Il rafforzamento dei bound ricava prima un upper bound su $x_1$ dal primo vincolo, poi lo usa nel secondo per $x_2$. Quali bound si ottengono?",
        "In the presolve of a MIP solver the integer variables $x_1 \\in [0, " + u1 + "]$, $x_2 \\in [" + l2 + ", +\\infty)$ appear in the constraints $" + a11 + "x_1 + " + a12 + "x_2 \\le " + b1 + "$ and $-" + (dd === 1 ? "" : dd) + "x_1 + " + a22 + "x_2 \\le " + b2 + "$. Bound tightening first derives an upper bound on $x_1$ from the first constraint, then uses it in the second for $x_2$. Which bounds are obtained?");
      var sp = L(lingua,
        "Primo vincolo con $x_2 \\ge " + l2 + "$: $" + a11 + "x_1 \\le " + r1 + "$, quindi $x_1 \\le " + U1 + "$. Secondo vincolo: $" + a22 + "x_2 \\le " + b2 + " + " + dd + "x_1 \\le " + r2 + "$, quindi $x_2 \\le " + U2 + "$. Usare il vecchio bound $x_1 \\le " + u1 + "$ dà $x_2 \\le " + U2s + "$.",
        "First constraint with $x_2 \\ge " + l2 + "$: $" + a11 + "x_1 \\le " + r1 + "$, so $x_1 \\le " + U1 + "$. Second constraint: $" + a22 + "x_2 \\le " + b2 + " + " + dd + "x_1 \\le " + r2 + "$, so $x_2 \\le " + U2 + "$. Using the old bound $x_1 \\le " + u1 + "$ gives $x_2 \\le " + U2s + "$.");
      return chiudi(rng, testo, corr, d, sp, { a11: a11, a12: a12, l2: l2, b1: b1, dd: dd, a22: a22, b2: b2, u1: u1 });
    })
  });

  // ---------------------------------------------------------------- X1. PLI con tre variabili per enumerazione
  G.push({
    id: "pli-g-enum3", livello: "complessa", capitolo: "ilp", link: link("ilp", "box-5-defOptILP"),
    genera: ripeti(function (rng, lingua) {
      var c = [ri(rng, 3, 12), ri(rng, 3, 12), ri(rng, 3, 12)], a = [ri(rng, 2, 7), ri(rng, 2, 7), ri(rng, 2, 7)];
      var u = [ri(rng, 1, 3), ri(rng, 1, 3), ri(rng, 1, 3)], b = ri(rng, 9, 20);
      var best = null, bv = -1, nb = 0, x1, x2, x3, bestNoU = null, bvNoU = -1;
      for (x1 = 0; x1 <= 10; x1++) for (x2 = 0; x2 <= 10; x2++) for (x3 = 0; x3 <= 10; x3++) {
        if (a[0] * x1 + a[1] * x2 + a[2] * x3 > b) continue;
        var v = c[0] * x1 + c[1] * x2 + c[2] * x3;
        if (x1 <= u[0] && x2 <= u[1] && x3 <= u[2]) {
          if (v > bv) { bv = v; best = [x1, x2, x3]; nb = 1; } else if (v === bv) nb++;
        }
        if (v > bvNoU) { bvNoU = v; bestNoU = [x1, x2, x3]; }
      }
      if (nb !== 1 || bvNoU <= bv) return null;
      // greedy per rapporto c/a rispettando i limiti
      var ord = [0, 1, 2].sort(function (p, q) { return c[q] * a[p] - c[p] * a[q]; }), cap = b, g = [0, 0, 0];
      ord.forEach(function (j) { g[j] = Math.min(u[j], Math.floor(cap / a[j])); cap -= a[j] * g[j]; });
      var gv = c[0] * g[0] + c[1] * g[1] + c[2] * g[2];
      if (gv === bv) return null;
      // terzo distrattore: migliore punto ammissibile con una variabile a zero diversa
      var alt = null, av = -1;
      for (x1 = 0; x1 <= u[0]; x1++) for (x2 = 0; x2 <= u[1]; x2++) for (x3 = 0; x3 <= u[2]; x3++) {
        var vv = c[0] * x1 + c[1] * x2 + c[2] * x3;
        if (a[0] * x1 + a[1] * x2 + a[2] * x3 <= b && vv < bv && vv > av && !(x1 === g[0] && x2 === g[1] && x3 === g[2])) { av = vv; alt = [x1, x2, x3]; }
      }
      if (!alt) return null;
      function op(x, v) { return { s: "$\\tilde{\\vet x} = (" + x.join(", ") + ")$, $z = " + v + "$", v: [x, v] }; }
      var corr = op(best, bv), d = filtra(corr, [op(bestNoU, bvNoU), op(g, gv), op(alt, av)]);
      var testo = L(lingua,
        "Si consideri il problema PLI $\\max\\ " + txLin(c, X) + "$ soggetto a $" + txIneq(a, "\\le", b) + "$, $x_1 \\le " + u[0] + "$, $x_2 \\le " + u[1] + "$, $x_3 \\le " + u[2] + "$, $\\vet x \\in \\Z^3_{\\ge 0}$. Quali sono la soluzione ottima (unica) e il valore ottimo?",
        "Consider the ILP problem $\\max\\ " + txLin(c, X) + "$ subject to $" + txIneq(a, "\\le", b) + "$, $x_1 \\le " + u[0] + "$, $x_2 \\le " + u[1] + "$, $x_3 \\le " + u[2] + "$, $\\vet x \\in \\Z^3_{\\ge 0}$. What are the (unique) optimal solution and the optimal value?");
      var sp = L(lingua,
        "La regione ammissibile è finita: enumerando i punti con $x_j \\le u_j$ e $" + txIneq(a, "\\le", b) + "$ il massimo è $" + bv + "$ in $(" + best.join(", ") + ")$. Il greedy per rapporto $c_j/a_j$ dà $(" + g.join(", ") + ")$ di valore $" + gv + "$; $(" + bestNoU.join(", ") + ")$ viola un limite superiore.",
        "The feasible region is finite: enumerating the points with $x_j \\le u_j$ and $" + txIneq(a, "\\le", b) + "$ the maximum is $" + bv + "$ at $(" + best.join(", ") + ")$. The greedy by ratio $c_j/a_j$ gives $(" + g.join(", ") + ")$ of value $" + gv + "$; $(" + bestNoU.join(", ") + ")$ violates an upper bound.");
      return chiudi(rng, testo, corr, d, sp, { c: c, a: a, b: b, u: u });
    })
  });

  // ---------------------------------------------------------------- X2. bound duale ottimo
  G.push({
    id: "pli-g-dual-ub", livello: "complessa", capitolo: "lp-relaxation", link: link("lp-relaxation", "box-18-prop-dual-bound"),
    genera: ripeti(function (rng, lingua) {
      var ist = istanzaAuto(rng);
      if (!ist) return null;
      var A = ist.A, b = ist.b, c = ist.c;
      // duale: min b1 p1 + b2 p2, A^T p >= c, p >= 0  ->  max -b p, -A^T p <= -c
      var r = lp2([-b[0], -b[1]], [[-A[0][0], -A[1][0], -c[0]], [-A[0][1], -A[1][1], -c[1]]].concat(nonneg()));
      if (r.stato !== "ott" || !r.unico) return null;
      var pi = r.x, ub = neg(r.z);
      if (isInt(ub)) return null;
      // errore tipico: moltiplicatori calcolati con A invece di A^T
      var rw = lp2([-b[0], -b[1]], [[-A[0][0], -A[0][1], -c[0]], [-A[1][0], -A[1][1], -c[1]]].concat(nonneg()));
      if (rw.stato !== "ott" || !rw.unico) return null;
      function op(p, u) { return { s: "$\\tilde{\\vet \\pi} = " + txPt(p) + "$, $\\UB = " + tx(u) + "$", v: [p.map(fs), fs(u)] }; }
      var corr = op(pi, flo(ub));
      var d = filtra(corr, [op(pi, ub), op(rw.x, flo(neg(rw.z))), op(pi, cei(ub)), op(rw.x, neg(rw.z))]);
      var testo = L(lingua,
        "Per il problema PLI " + txPLI(ist, lingua) + " si combinano i due vincoli con moltiplicatori $\\pi_1, \\pi_2 \\ge 0$ tali che i coefficienti combinati siano almeno i costi ($\\mat A\\T \\vet \\pi \\ge \\vet c$). Qual è la soluzione ottima $\\tilde{\\vet \\pi}$ del problema duale del rilassamento lineare, e quale upper bound $\\UB$ su $z(\\ILP)$ si ricava (con l'arrotondamento lecito)?",
        "For the ILP problem " + txPLI(ist, lingua) + " the two constraints are combined with multipliers $\\pi_1, \\pi_2 \\ge 0$ such that the combined coefficients are at least the costs ($\\mat A\\T \\vet \\pi \\ge \\vet c$). What is the optimal solution $\\tilde{\\vet \\pi}$ of the dual of the LP relaxation, and which upper bound $\\UB$ on $z(\\ILP)$ follows (with the legitimate rounding)?");
      var sp = L(lingua,
        "Il duale è $\\min\\ " + b[0] + "\\pi_1 + " + b[1] + "\\pi_2$ con $" + A[0][0] + "\\pi_1 + " + A[1][0] + "\\pi_2 \\ge " + c[0] + "$, $" + A[0][1] + "\\pi_1 + " + A[1][1] + "\\pi_2 \\ge " + c[1] + "$, $\\vet \\pi \\ge \\vet 0$: ottimo $" + txPt(pi) + "$ di valore $" + tx(ub) + " = z(\\LP)$. Variabili e costi interi: $\\UB = " + flo(ub) + "$.",
        "The dual is $\\min\\ " + b[0] + "\\pi_1 + " + b[1] + "\\pi_2$ with $" + A[0][0] + "\\pi_1 + " + A[1][0] + "\\pi_2 \\ge " + c[0] + "$, $" + A[0][1] + "\\pi_1 + " + A[1][1] + "\\pi_2 \\ge " + c[1] + "$, $\\vet \\pi \\ge \\vet 0$: optimum $" + txPt(pi) + "$ of value $" + tx(ub) + " = z(\\LP)$. Integer variables and costs: $\\UB = " + flo(ub) + "$.");
      return chiudi(rng, testo, corr, d, sp, { ist: verIst(ist) });
    })
  });

  // ---------------------------------------------------------------- X3. arresto con MIPGap su un log
  G.push({
    id: "pli-g-log-stop", livello: "complessa", capitolo: "mip-solvers", link: link("mip-solvers", "934-the-gap-as-a-stopping-criterion", "934-il-gap-come-criterio-di-arresto"),
    genera: ripeti(function (rng, lingua) {
      var g = pick(rng, [1, 2, 5]), I = ri(rng, 150, 400), B = I + ri(rng, 30, 60), righe = [], j;
      for (j = 0; j < 5; j++) {
        righe.push([I, B]);
        if (rng() < 0.6) I += ri(rng, 1, 8);
        B -= ri(rng, 1, 12);
        if (B < I) B = I;
      }
      var gaps = righe.map(function (r) { return F(r[1] - r[0], r[0]); });
      var stop = -1;
      for (j = 0; j < 5; j++) if (stop < 0 && cmp(gaps[j], F(g, 100)) <= 0) stop = j;
      if (stop < 1) return null;
      for (j = 0; j < 5; j++) if (eq(gaps[j], F(g, 100))) return null;
      // errore tipico: gap rispetto al best bound invece che all'incumbent
      var stopB = -1;
      for (j = 0; j < 5; j++) if (stopB < 0 && cmp(F(righe[j][1] - righe[j][0], righe[j][1]), F(g, 100)) <= 0) stopB = j;
      var lab = function (t) { return t < 0 ? L(lingua, "nessuna: il solver non si ferma", "none: the solver does not stop") : L(lingua, "la riga " + (t + 1), "row " + (t + 1)); };
      var cand = [stop, stopB, stop + 1 <= 4 ? stop + 1 : -1, stop - 1, -1, 4, 0];
      var corr = { s: lab(stop), v: stop }, d = [], visti = {};
      visti[stop] = 1;
      cand.forEach(function (t) { if (!visti[t] && d.length < 3) { visti[t] = 1; d.push({ s: lab(t), v: t }); } });
      var tab = righe.map(function (r, t) { return L(lingua, "riga ", "row ") + (t + 1) + ": Incumbent $" + r[0] + "$, BestBd $" + r[1] + "$"; }).join("; ");
      var testo = L(lingua,
        "Un solver MIP risolve un problema di massimo con dati interi e MIPGap $= " + g + "\\%$; il gap è $\\frac{\\text{BestBd} - \\text{Incumbent}}{|\\text{Incumbent}|}$ e il solver si ferma alla prima riga del log in cui il gap è al più MIPGap. Le righe del log sono: " + tab + ". A quale riga si ferma?",
        "A MIP solver solves a maximization problem with integer data and MIPGap $= " + g + "\\%$; the gap is $\\frac{\\text{BestBd} - \\text{Incumbent}}{|\\text{Incumbent}|}$ and the solver stops at the first log row where the gap is at most MIPGap. The log rows are: " + tab + ". At which row does it stop?");
      var sp = L(lingua,
        "Gap delle righe: $" + gaps.map(function (q) { return tx(q); }).join("$, $") + "$, da confrontare con $\\frac{" + g + "}{100}$. Il denominatore è l'incumbent, non il best bound. La soluzione restituita è ottima solo a meno della tolleranza.",
        "Gaps of the rows: $" + gaps.map(function (q) { return tx(q); }).join("$, $") + "$, to be compared with $\\frac{" + g + "}{100}$. The denominator is the incumbent, not the best bound. The returned solution is optimal only up to the tolerance.");
      return chiudi(rng, testo, corr, d, sp, { g: g, righe: righe });
    })
  });

  window.QUIZ_GEN = window.QUIZ_GEN || {};
  var dest = (window.QUIZ_GEN[MOD] = window.QUIZ_GEN[MOD] || []);
  G.forEach(function (g) { dest.push(g); });
})();
