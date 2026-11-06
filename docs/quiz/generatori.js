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
        "Nel problema PLI " + txPLI(ist, lingua) + " il rilassamento lineare ha soluzione ottima $\\tilde{\\vet x}(\\LP) = " + txPt(x) + "$ con $z(\\LP) = " + tx(z) + "$. Arrotondando per difetto si ottiene la soluzione ammissibile $" + txPt(xb) + "$. Qual è l'intervallo più stretto per $z(\\ILP)$ che questi dati certificano?",
        "In the ILP problem " + txPLI(ist, lingua) + " the LP relaxation has the optimal solution $\\tilde{\\vet x}(\\LP) = " + txPt(x) + "$ with $z(\\LP) = " + tx(z) + "$. Rounding down gives the feasible solution $" + txPt(xb) + "$. What is the tightest interval for $z(\\ILP)$ certified by these data?");
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
        "In un problema PLI con variabili e costi interi (massimizzazione) si conoscono una soluzione ammissibile di valore $\\LB = " + LB + "$ e il valore del rilassamento lineare $z(\\LP) = " + tx(z) + "$. Quanto vale il gap di ottimalità $\\frac{\\UB - \\LB}{|\\LB|}$ con il miglior upper bound che si ricava da questi dati?",
        "In an ILP problem with integer variables and costs (maximization) we know a feasible solution of value $\\LB = " + LB + "$ and the value of the LP relaxation $z(\\LP) = " + tx(z) + "$. What is the optimality gap $\\frac{\\UB - \\LB}{|\\LB|}$ with the best upper bound given by these data?");
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
        "Un problema PLI con $x_1, x_2 \\in \\Z_{\\ge 0}$ ha i vincoli " + vinc + ". Qual è il miglior upper bound su $" + xn + "$ dato dalla Proposizione 2.8 (upper bound sulle variabili)?",
        "An ILP problem with $x_1, x_2 \\in \\Z_{\\ge 0}$ has the constraints " + vinc + ". What is the best upper bound on $" + xn + "$ given by Proposition 2.8 (upper bounds on the variables)?");
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
        "Nel problema PLI " + txPLI(ist, lingua) + " si moltiplicano i due vincoli per $\\pi_1$ e $\\pi_2$ e si sommano. Quale scelta dà un bound duale valido su $z(\\ILP)$, e quanto vale?",
        "In the ILP problem " + txPLI(ist, lingua) + " the two constraints are multiplied by $\\pi_1$ and $\\pi_2$ and summed. Which choice gives a valid dual bound on $z(\\ILP)$, and what is its value?");
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
        "Nel problema PLI " + txPLI(ist, lingua) + " si applica l'euristica a due passi fissando prima $" + X[first] + "$ al suo valore massimo e poi $" + X[second] + "$ al valore massimo con i termini noti residui. Quale soluzione si ottiene?",
        "In the ILP problem " + txPLI(ist, lingua) + " the two-step heuristic sets first $" + X[first] + "$ to its maximum value and then $" + X[second] + "$ to its maximum value with the residual right-hand sides. Which solution is obtained?");
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
        "Un problema PLI con $x_1, x_2 \\in \\Z_{\\ge 0}$ ha i vincoli $" + txIneq(A[0], "\\le", b[0]) + "$ e $" + txIneq(A[1], "\\le", b[1]) + "$. Con i moltiplicatori $\\pi_1 = " + tx(p[0]) + "$, $\\pi_2 = " + tx(p[1]) + "$ e i coefficienti $\\alpha_j = \\lfloor \\pi_1 a_{1j} + \\pi_2 a_{2j} \\rfloor$, quale disuguaglianza valida dà la Proposizione 4.3?",
        "An ILP problem with $x_1, x_2 \\in \\Z_{\\ge 0}$ has the constraints $" + txIneq(A[0], "\\le", b[0]) + "$ and $" + txIneq(A[1], "\\le", b[1]) + "$. With the multipliers $\\pi_1 = " + tx(p[0]) + "$, $\\pi_2 = " + tx(p[1]) + "$ and the coefficients $\\alpha_j = \\lfloor \\pi_1 a_{1j} + \\pi_2 a_{2j} \\rfloor$, which valid inequality does Proposition 4.3 give?");
      var sp = L(lingua,
        "La combinazione è $" + txIneq(comb, "\\le", rhs) + "$; con $\\alpha = (" + al.join(", ") + ")$ il membro sinistro è intero, quindi il termine noto si arrotonda per difetto a $" + flo(rhs) + "$. Arrotondare per eccesso il termine noto o i coefficienti non dà la disuguaglianza della proposizione.",
        "The combination is $" + txIneq(comb, "\\le", rhs) + "$; with $\\alpha = (" + al.join(", ") + ")$ the left-hand side is integer, so the right-hand side is rounded down to $" + flo(rhs) + "$. Rounding up the right-hand side or the coefficients does not give the inequality of the proposition.");
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
        "Nel problema PLI " + txPLI(ist, lingua) + " si cerca una disuguaglianza con coefficienti $\\alpha = (" + al.join(", ") + ")$. Quale delle seguenti è valida e saturata?",
        "In the ILP problem " + txPLI(ist, lingua) + " we look for an inequality with coefficients $\\alpha = (" + al.join(", ") + ")$. Which of the following is valid and tight?");
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
        "Un problema PLI ha i vincoli " + vinc + " e $x_1, x_2 \\in \\Z_{\\ge 0}$. Quanti vertici ha l'inviluppo convesso $\\mathrm{conv}(F)$ delle sue soluzioni ammissibili?",
        "An ILP problem has the constraints " + vinc + " and $x_1, x_2 \\in \\Z_{\\ge 0}$. How many vertices does the convex hull $\\mathrm{conv}(F)$ of its feasible solutions have?");
      var sp = L(lingua,
        "Si elencano i $" + pts.length + "$ punti di $F$ e si prende il poligono convesso più piccolo che li contiene: i suoi vertici sono $" + h.map(function (q) { return "(" + q[0] + "," + q[1] + ")"; }).join(", ") + "$. I punti sui lati che non sono vertici non contano, e i vertici del poliedro $P$ ($" + vp + "$) non sono tutti interi.",
        "List the $" + pts.length + "$ points of $F$ and take the smallest convex polygon containing them: its vertices are $" + h.map(function (q) { return "(" + q[0] + "," + q[1] + ")"; }).join(", ") + "$. Points on the edges that are not vertices do not count, and the vertices of the polyhedron $P$ ($" + vp + "$) are not all integer.");
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
        "Per il vincolo " + txZaino(z) + ", quale delle seguenti è la disuguaglianza di cover di un cover minimale?",
        "For the constraint " + txZaino(z) + ", which of the following is the cover inequality of a minimal cover?");
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
        "Per il vincolo " + txZaino(z) + " si separa il punto $\\tilde{\\vet x} = " + txPt(x) + "$. Quale disuguaglianza di cover è violata al massimo da $\\tilde{\\vet x}$, e di quanto?",
        "For the constraint " + txZaino(z) + " we separate the point $\\tilde{\\vet x} = " + txPt(x) + "$. Which cover inequality is maximally violated by $\\tilde{\\vet x}$, and by how much?");
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
        "Per il vincolo " + txZaino(z) + " si considera il cover $C = " + txIdx(C) + "$. Qual è la disuguaglianza di cover estesa di $C$?",
        "For the constraint " + txZaino(z) + " consider the cover $C = " + txIdx(C) + "$. What is the extended cover inequality of $C$?");
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
        "La riga " + riga + " appartiene a un dizionario ammissibile del rilassamento lineare (in forma standard) di un problema PLI con dati interi; $" + nn.join("$ e $") + "$ sono fuori base. Qual è il taglio frazionario di Gomory generato da questa riga?",
        "The row " + riga + " belongs to a feasible dictionary of the LP relaxation (in standard form) of an ILP problem with integer data; $" + nn.join("$ and $") + "$ are non-basic. What is the Gomory fractional cut generated by this row?");
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
        minInf: L(lingua, "minima inammissibilità", "minimum infeasibility"),
        maxInf: L(lingua, "massima inammissibilità", "maximum infeasibility")
      }[k0];
      function o(j, lo, hi) { return { s: "$x_" + (j + 1) + " \\le " + lo + "$ " + L(lingua, "e", "and") + " $x_" + (j + 1) + " \\ge " + hi + "$", v: [j, lo, hi] }; }
      var fl = flo(x[jc]);
      var corr = o(jc, fl, fl + 1);
      var d = filtra(corr, [o(jo, flo(x[jo]), flo(x[jo]) + 1), o(ji, flo(x[ji]), flo(x[ji]) + 1), o(jc, fl + 1, fl + 2)]);
      var testo = L(lingua,
        "Nel nodo $k$ di un branch-and-bound per un problema PLI si ha $\\tilde{\\vet x}(\\LP_k) = " + txPt(x) + "$. Con la strategia " + nome + " per la variabile di branching, quali sono i vincoli dei due figli?",
        "At node $k$ of a branch-and-bound algorithm for an ILP problem we have $\\tilde{\\vet x}(\\LP_k) = " + txPt(x) + "$. With the " + nome + " branching-variable selection strategy, what are the constraints of the two children?");
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
        lista: { s: L(lingua, "inserito nella lista $L$", "inserted into the list $L$"), v: "lista" },
        intUp: { s: L(lingua, "potato per integralità, con $\\LB \\leftarrow " + tx(z) + "$", "pruned by integrality, with $\\LB \\leftarrow " + tx(z) + "$"), v: "intUp" },
        intNo: { s: L(lingua, "potato per integralità, $\\LB$ invariato", "pruned by integrality, $\\LB$ unchanged"), v: "intNo" }
      };
      var giusto = ["bound", "lista", "intUp", "intNo"][caso];
      var corr = esiti[giusto];
      var d = ["bound", "lista", "intUp", "intNo"].filter(function (k) { return k !== giusto; }).map(function (k) { return esiti[k]; });
      var st = intz ? L(lingua, "intera", "integer") : L(lingua, "frazionaria", "fractional");
      var testo = L(lingua,
        "In un branch-and-bound per un problema PLI con variabili e costi interi il lower bound è $\\LB = " + LB + "$. Si risolve il nodo $k$: $z(\\LP_k) = " + tx(z) + "$ e la soluzione $\\tilde{\\vet x}(\\LP_k)$ è " + st + ". Che cosa succede al nodo?",
        "In a branch-and-bound algorithm for an ILP problem with integer variables and costs the lower bound is $\\LB = " + LB + "$. Node $k$ is solved: $z(\\LP_k) = " + tx(z) + "$ and the solution $\\tilde{\\vet x}(\\LP_k)$ is " + st + ". What happens to the node?");
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
        "In un branch-and-bound per un problema PLI con variabili e costi interi l'incumbent ha valore $\\LB = " + LB + "$ e la lista contiene tre nodi con " + lista + " (l'ultimo è il nodo appena risolto). Quanto valgono l'upper bound e il gap di ottimalità?",
        "In a branch-and-bound algorithm for an ILP problem with integer variables and costs the incumbent solution has value $\\LB = " + LB + "$ and the list contains three nodes with " + lista + " (the last one is the node just solved). What are the upper bound and the optimality gap?");
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
        "Nel problema PLI " + txPLI(g.ist, lingua) + ", con gli scarti " + txScarti(g.ist) + ", il dizionario ottimo della radice è " + txDiz(dz) + ". Si risolve il figlio con il vincolo di branching $" + vinc + "$ (variabile di scarto o di surplus $x_5$) partendo da questo dizionario. Quali sono la colonna pivot della prima operazione di pivot duale e il nuovo valore dell'obiettivo?",
        "In the ILP problem " + txPLI(g.ist, lingua) + ", with the slack variables " + txScarti(g.ist) + ", the optimal dictionary of the root is " + txDiz(dz) + ". The child with the branching constraint $" + vinc + "$ (slack or surplus variable $x_5$) is solved starting from this dictionary. What are the pivot column of the first dual pivoting operation and the new objective value?");
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
        "Si risolve il problema PLI " + txPLI(ist, lingua) + " con il branch-and-bound: variabile di branching lessicografica (indice minimo), selezione del nodo " + nomeS + ", prima il figlio con il vincolo verso il basso, regola di salto, $\\LB = -\\infty$ all'inizio. La radice ha $\\tilde{\\vet x}(\\LP_1) = " + txPt(ist.lp.x) + "$, $z(\\LP_1) = " + tx(ist.lp.z) + "$. Quanti problemi LP si risolvono (radice compresa) e quale soluzione si certifica ottima?",
        "The ILP problem " + txPLI(ist, lingua) + " is solved with the branch-and-bound algorithm: lexicographic branching variable (smallest index), " + nomeS + " node selection, down-branching child first, skip rule, $\\LB = -\\infty$ at the start. The root has $\\tilde{\\vet x}(\\LP_1) = " + txPt(ist.lp.x) + "$, $z(\\LP_1) = " + tx(ist.lp.z) + "$. How many LP problems are solved (root included) and which solution is certified optimal?");
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
        "Nel punto $\\tilde{\\vet x}(\\LP_k) = " + txPt(x) + "$ si valuta il taglio $" + txIneq(al, "\\le", beta) + "$. Quanto valgono la violazione e l'efficacia (distanza euclidea del punto dall'iperpiano del taglio)?",
        "At the point $\\tilde{\\vet x}(\\LP_k) = " + txPt(x) + "$ we evaluate the cut $" + txIneq(al, "\\le", beta) + "$. What are its violation and its efficacy (Euclidean distance of the point from the hyperplane of the cut)?");
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
        "Nel problema PLI " + txPLI(ist, lingua) + " il nodo $k$ ha il vincolo di branching $x_1 \\ge " + k + "$. Dal primo vincolo e da $x_1 \\ge " + k + "$ si ricava un taglio su $x_2$, arrotondando il termine noto. Quale taglio si ottiene, e di che tipo è?",
        "In the ILP problem " + txPLI(ist, lingua) + " node $k$ has the branching constraint $x_1 \\ge " + k + "$. From the first constraint and $x_1 \\ge " + k + "$ we derive a cut on $x_2$, rounding the right-hand side. Which cut is obtained, and of which type is it?");
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
        "In un problema di " + (maxi ? "massimizzazione" : "minimizzazione") + " una riga del log di Gurobi riporta $\\texttt{Incumbent} = " + I + "$ e $\\texttt{BestBd} = " + B + "$, con il parametro $\\texttt{MIPGap} = " + pv(String(tol)) + "\\%$. Quanto vale il gap, e il solver si ferma?",
        "In a " + (maxi ? "maximization" : "minimization") + " problem a line of the Gurobi log reports $\\texttt{Incumbent} = " + I + "$ and $\\texttt{BestBd} = " + B + "$, with the parameter $\\texttt{MIPGap} = " + pv(String(tol)) + "\\%$. What is the gap, and does the solver stop?");
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
        "Nella feasibility pump, con variabili binarie, il punto intero è $\\bar{\\vet x} = " + txPt(xb) + "$ e il punto del rilassamento è $\\tilde{\\vet x} = " + txPt(xt) + "$. Quanto vale la distanza $\\Delta(\\tilde{\\vet x}, \\bar{\\vet x})$?",
        "In the feasibility pump, with binary variables, the integer point is $\\bar{\\vet x} = " + txPt(xb) + "$ and the point of the relaxation is $\\tilde{\\vet x} = " + txPt(xt) + "$. What is the distance $\\Delta(\\tilde{\\vet x}, \\bar{\\vet x})$?");
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
        "In RINS l'incumbent è $\\bar{\\vet x} = " + txPt(xb) + "$ e la soluzione del rilassamento lineare è $\\tilde{\\vet x} = " + txPt(xt) + "$ (tutte le variabili sono intere). Quali variabili sono fissate nel sotto-MIP?",
        "In RINS the incumbent is $\\bar{\\vet x} = " + txPt(xb) + "$ and the solution of the LP relaxation is $\\tilde{\\vet x} = " + txPt(xt) + "$ (all variables are integer). Which variables are fixed in the sub-MIP?");
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
        "Un MIP ha $|\\mathscr{D}| = " + n + "$ variabili binarie. Quanti punti binari contiene l'intorno del local branching $\\Delta(\\vet x, \\bar{\\vet x}) \\le " + k + "$ attorno all'incumbent $\\bar{\\vet x}$ (incumbent compreso)?",
        "A MIP has $|\\mathscr{D}| = " + n + "$ binary variables. How many binary points does the local branching neighbourhood $\\Delta(\\vet x, \\bar{\\vet x}) \\le " + k + "$ around the incumbent $\\bar{\\vet x}$ contain (incumbent included)?");
      var sp = L(lingua,
        "I punti a distanza $i$ si ottengono cambiando $i$ variabili: $\\sum_{i=0}^{" + k + "} \\binom{" + n + "}{i} = " + s + "$. Contare solo $\\binom{" + n + "}{" + k + "}$ dimentica i punti più vicini, compreso $\\bar{\\vet x}$ ($i = 0$).",
        "The points at distance $i$ are obtained by changing $i$ variables: $\\sum_{i=0}^{" + k + "} \\binom{" + n + "}{i} = " + s + "$. Counting only $\\binom{" + n + "}{" + k + "}$ forgets the closer points, including $\\bar{\\vet x}$ ($i = 0$).");
      return chiudi(rng, testo, corr, d, sp, { n: n, k: k });
    })
  });

  window.QUIZ_GEN = window.QUIZ_GEN || {};
  var dest = (window.QUIZ_GEN[MOD] = window.QUIZ_GEN[MOD] || []);
  G.forEach(function (g) { dest.push(g); });
})();
