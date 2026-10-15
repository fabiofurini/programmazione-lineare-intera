---
title: "Bound primali e duali"
---

# Bound primali e duali

<div class="info-capitolo" markdown>

**Parte 1 · Modelli e bound · Capitolo 2** · [:material-file-pdf-box: Dispensa, volume 1 (PDF)](../pdf/dispensa-1-modelli-bound-formulazioni.pdf) · [:material-pencil: Esercizi: Bound primali e duali](../esercizi/lp-relaxation.md) · [:material-gesture-tap: App: Punti interi e rilassamento lineare](../laboratorio/punti-interi.md)

</div>

!!! nota "Prerequisiti"

    - Da questo modulo, il capitolo «Programmazione lineare intera»: problemi PLI, soluzioni ammissibili e ottime, enumerazione completa e l'esempio dell'auto.

    - Dal modulo <em>Programmazione Lineare</em>, [Capitolo 9 «Teoria della dualità»](https://fabiofurini.github.io/linear-programming/duality/09-duality/): il problema duale, la dualità debole e la dualità forte.

    - Dallo stesso modulo, [Capitolo 6 «Algoritmo del simplesso»](https://fabiofurini.github.io/linear-programming/simplex/06-simplex/): un problema LP che ha una soluzione ottima ha un vertice ottimo.

!!! chiave "Obiettivi"

    Alla fine di questo capitolo sarai in grado di:

    - ottenere un bound primale (un lower bound) sul valore ottimo da una soluzione ammissibile, anche con un semplice algoritmo euristico;

    - costruire il rilassamento lineare di un problema PLI e usarne il valore ottimo come bound duale (un upper bound), arrotondato per difetto quando è lecito;

    - calcolare il gap di ottimalità da un bound primale e un bound duale;

    - spiegare perché arrotondare una soluzione ottima del rilassamento lineare dà, nel migliore dei casi, una soluzione ammissibile;

    - ricavare dai vincoli upper bound sulle variabili, e dire quando servono;

    - ottenere un bound duale da moltiplicatori non negativi dei vincoli, e riconoscere nel problema duale il problema dei moltiplicatori migliori.

!!! nota "Dove eravamo"

    Nel capitolo precedente abbiamo visto che l'enumerazione completa non è praticabile e che servono bound sul valore ottimo da entrambi i lati. Ora li otteniamo: <strong>bound primali</strong> dalle soluzioni ammissibili e <strong>bound duali</strong> dai rilassamenti.

## 2.1 Bound primali e bound duali

<a id="box-1-def-bounds"></a>

!!! definizione "Definizione 2.1: bound primale, bound duale e gap di ottimalità"

    Consideriamo un problema PLI in forma canonica di massimizzazione, con regione ammissibile $F$ e valore ottimo $z(\ILP)$.

    - Data una soluzione ammissibile $\bar{\vet x} \in F$, il suo valore $\LB(\bar{\vet x}) = \sum_{j=1}^n c_j \, \bar{x}_j$ è un <strong>bound primale</strong> su $z(\ILP)$.

    - Un valore $\UB$ tale che $\sum_{j=1}^n c_j \, x_j \le \UB$ per ogni $\vet x \in F$ è un <strong>bound duale</strong> su $z(\ILP)$.

    - Dati un bound primale $\LB \ne 0$ e un bound duale $\UB$, il <strong>gap di ottimalità</strong> è

        \begin{equation*}
        \label{gap}
        \textrm{gap di ottimalità} = \frac{\UB - \LB}{|\LB|} . \tag{2.1}
        \end{equation*}

- In un problema di massimizzazione i bound primali sono <strong>lower bound</strong> e i bound duali sono <strong>upper bound</strong>. Un bound primale viene da una sola soluzione ammissibile; un bound duale è un'affermazione su <u>tutte</u> le soluzioni ammissibili insieme.

!!! chiave ""

    Per ogni soluzione ammissibile $\bar{\vet x}$ e ogni bound duale $\UB$:

    $$
    \LB(\bar{\vet x}) ~\le~ z(\ILP) ~\le~ \UB .
    $$

    Una soluzione ammissibile è <strong>certificata ottima</strong> quando il gap di ottimalità è zero.

<a id="box-2-def-relaxation"></a>

!!! definizione "Definizione 2.2: rilassamento"

    Dato un problema PLI $\max \{ \vet c\T \vet x : \vet x \in F \}$, il problema $\max \{ \vet c\T \vet x : \vet x \in R \}$ è un <strong>rilassamento</strong> del problema PLI se $F \subseteq R$. Indichiamo il suo valore ottimo con $z(R)$.

- Massimizzare su una regione più grande non può dare un valore più piccolo: il valore ottimo di un rilassamento è un bound duale, $z(\ILP) \le z(R)$.

## 2.2 Bound primali: soluzioni euristiche { #sez-sec-primal }

<a id="box-3-def-heuristic"></a>

!!! definizione "Definizione 2.3: algoritmo euristico"

    Un <strong>algoritmo euristico</strong> è un metodo che trova rapidamente soluzioni ammissibili, senza garanzia di ottimalità. Il valore di ogni soluzione che trova è un bound primale.

!!! chiave ""

    Una buona soluzione ammissibile è un buon bound primale.

<a id="box-4-ex-primal-car"></a>

!!! esempio "Esempio 2.1: bound primale"

    Per la soluzione ammissibile $(2,2)$ dell'esempio dell'auto otteniamo $\LB = 3 \cdot 2 + 2 \cdot 2 = 10$, quindi $z(\ILP) \ge 10$.

<a id="box-5-def-floor"></a>

!!! definizione "Definizione 2.4: parte intera di un numero"

    Dato $y \in \R$, la <strong>parte intera</strong> di $y$ è $\lfloor y \rfloor = \max \{ q \in \Z : q \le y \}$.

<a id="box-6-ex-heur-car"></a>

!!! esempio "Esempio 2.2: due algoritmi euristici per l'esempio dell'auto"

    - L'<strong>euristica a una variabile</strong> porta una sola variabile al suo valore massimo, con l'altra uguale a $0$, e tiene la migliore delle due soluzioni.

        1. Solo $x_1$ ($x_2 = 0$): $\bar{x}_1 = \min\{\lfloor \frac{45}{10} \rfloor, \lfloor \frac{49}{4} \rfloor\} = \min\{4, 12\} = 4$, quindi $\bar{\vet x} = (4,0)$ e $\LB = 12$.

        2. Solo $x_2$ ($x_1 = 0$): $\bar{x}_2 = \min\{\lfloor \frac{45}{4} \rfloor, \lfloor \frac{49}{14} \rfloor\} = \min\{11, 3\} = 3$, quindi $\bar{\vet x} = (0,3)$ e $\LB = 6$.

    - L'<strong>euristica a due fasi</strong> porta prima una variabile al suo valore massimo, e poi l'altra al suo valore massimo con i <strong>termini noti residui</strong>. Tiene la migliore delle due soluzioni.

        1. Prima $x_1$: $\bar{x}_1 = 4$ usa $40$ e $16$, e lascia $5$ e $33$. Poi $\bar{x}_2 = \min\{\lfloor \frac{5}{4} \rfloor, \lfloor \frac{33}{14} \rfloor\} = \min\{1, 2\} = 1$, quindi $\bar{\vet x} = (4,1)$ e $\LB = 14$.

        2. Prima $x_2$: $\bar{x}_2 = 3$ usa $12$ e $42$, e lascia $33$ e $7$. Poi $\bar{x}_1 = \min\{\lfloor \frac{33}{10} \rfloor, \lfloor \frac{7}{4} \rfloor\} = \min\{3, 1\} = 1$, quindi $\bar{\vet x} = (1,3)$ e $\LB = 9$.

    <div class="tabella" markdown="0"><table>
    <tr>
    <th>Euristica</th>
    <th>Ordine</th>
    <th><span class="arithmatex">\(\bar{x}_1\)</span></th>
    <th><span class="arithmatex">\(\bar{x}_2\)</span></th>
    <th><span class="arithmatex">\(\LB\)</span></th>
    </tr>
    <tr>
    <td>a una variabile</td>
    <td><span class="arithmatex">\(x_1\)</span></td>
    <td><span class="arithmatex">\(4\)</span></td>
    <td><span class="arithmatex">\(0\)</span></td>
    <td><span class="arithmatex">\(12\)</span></td>
    </tr>
    <tr>
    <td>a una variabile</td>
    <td><span class="arithmatex">\(x_2\)</span></td>
    <td><span class="arithmatex">\(0\)</span></td>
    <td><span class="arithmatex">\(3\)</span></td>
    <td><span class="arithmatex">\(6\)</span></td>
    </tr>
    <tr>
    <td>a due fasi</td>
    <td>prima <span class="arithmatex">\(x_1\)</span></td>
    <td><span class="arithmatex">\(4\)</span></td>
    <td><span class="arithmatex">\(1\)</span></td>
    <td><span class="arithmatex">\(14\)</span></td>
    </tr>
    <tr>
    <td>a due fasi</td>
    <td>prima <span class="arithmatex">\(x_2\)</span></td>
    <td><span class="arithmatex">\(1\)</span></td>
    <td><span class="arithmatex">\(3\)</span></td>
    <td><span class="arithmatex">\(9\)</span></td>
    </tr>
    </table></div>

- L'euristica a due fasi dà un bound primale migliore, ma richiede più calcoli. Questo compromesso tra la qualità della soluzione e lo sforzo di calcolo è tipico degli algoritmi euristici.

- Qui il bound primale migliore è $\LB = 14$, in $(4,1)$. Un bound primale da solo non certifica l'ottimalità: serve un bound duale.

## 2.3 Il rilassamento lineare

<a id="box-7-def-lp-relax"></a>

!!! definizione "Definizione 2.5: rilassamento lineare"

    Il <strong>rilassamento lineare</strong> (rilassamento lineare) di un problema PLI in forma canonica di massimizzazione è il problema LP che si ottiene sostituendo i vincoli di integralità $x_j \in \Z_{\ge 0}$ con i vincoli di non negatività $x_j \ge 0$, per ogni $j \in \{1,2,\dots,n\}$:

    <a id="eq-LP"></a>

    \begin{align*}
    &&   \max \;\;{\sum_{j =1}^n c_j \, x_j}                               \label{ObjFunc_LP}  \tag{2.2a}\\[2ex]
    && \text{soggetto a} \quad  {\sum_{j =1}^n a_{ij} \, x_j}  &\leq b_i,   & \forall i \in \{1,2,\dots,m\},                    \label{Cons_LP}  \tag{2.2b}\\[2ex]
    &&x_j                        &\ge  0, & \forall j \in \{1,2,\dots,n\}. \label{non_negativity_LP} \tag{2.2c}
    \end{align*}

- Indichiamo con $z(\LP)$ il valore ottimo del rilassamento lineare, e con $\tilde{\vet x}(\LP)$ una sua soluzione ottima. Scriviamo sempre l'argomento, perché nello stesso esempio $\tilde{\vet x}(\ILP)$ e $\tilde{\vet x}(\LP)$ sono punti diversi.

<a id="box-8-prop-lp-bound"></a>

!!! teorema "Proposizione 2.6: upper bound dal rilassamento lineare"

    Ogni soluzione ammissibile del problema PLI è ammissibile per il suo rilassamento lineare, quindi

    \begin{equation*}
    z(\ILP) \le z(\LP). \label{LP_BOUND} \tag{2.3}
    \end{equation*}

    Inoltre, se una soluzione ottima del rilassamento lineare è intera, allora è una soluzione ottima del problema PLI.

??? dimostrazione "Dimostrazione"

    La regione ammissibile $F$ del problema PLI è contenuta nel poliedro del rilassamento lineare, e la funzione obiettivo è la stessa. Il massimo su un insieme più grande non è minore del massimo su un suo sottoinsieme. Se $\tilde{\vet x}(\LP)$ è intera, appartiene a $F$ e ha valore $z(\LP) \ge z(\ILP)$: è ottima per il problema PLI. <span class="qed">□</span>

- Il valore di una soluzione ammissibile può essere un intero, ed è al più $z(\LP)$: allora è al più il più grande intero che non supera $z(\LP)$.

<a id="box-9-obs-floor"></a>

!!! teorema "Osservazione 2.7: arrotondare l'upper bound"

    Se tutte le variabili sono intere e tutti i costi $c_j$ sono interi, allora

    \begin{equation*}
    z(\ILP) \le \lfloor z(\LP) \rfloor. \label{LP_BOUND_2} \tag{2.4}
    \end{equation*}

    In tutti gli altri casi il bound $\lfloor z(\LP) \rfloor$ <u>non</u> è valido.

- In questo modulo tutti i problemi PLI hanno dati interi, quindi il bound $\eqref{LP_BOUND_2}$ vale sempre. In un problema MIP con una variabile continua il valore di una soluzione ammissibile non è necessariamente intero, e il bound non si può arrotondare.

<a id="box-10-ex-lp-car"></a>

!!! esempio "Esempio 2.3: il rilassamento lineare dell'esempio dell'auto"

    - Il rilassamento lineare dell'esempio dell'auto ha la soluzione ottima

        $$
        \tilde{x}_1 = \frac{7}{2}, \quad \tilde{x}_2 = \frac{5}{2}, \qquad z(\LP) = \frac{31}{2},
        $$

        che è frazionaria: non è ammissibile per il problema PLI.

    - Poiché i costi sono interi, abbiamo l'upper bound $\lfloor z(\LP) \rfloor = 15$. Insieme al bound primale $14$ della soluzione ammissibile $(4,1)$ dell'<span style="color:#1971c2">[Esempio 2.2](#box-6-ex-heur-car)</span>:

        $$
        14 ~\le~ z(\ILP) ~\le~ 15.
        $$

    ![Figura 1](../img/02-lp-relaxation/fig01.svg){ .fig .ovale loading=lazy  }

    <em>Il rilassamento lineare dell'esempio dell'auto: la regione ammissibile (rossa), i suoi $16$ punti interi (neri) e la soluzione ottima $(\frac{7}{2},\frac{5}{2})$ del rilassamento lineare (blu), con la retta obiettivo $3\,x_1 + 2\,x_2 = \frac{31}{2}$ che vi passa (tratteggiata). La linea grigia tratteggiata è la retta obiettivo della soluzione ottima del problema PLI.</em>

    - Il valore ottimo è $14$ o $15$. Con $\UB = 15$ e $\LB = 14$ il gap di ottimalità $\eqref{gap}$ è $\frac{1}{14} \approx 7.1\%$: la soluzione $(4,1)$ non è ancora certificata ottima.

## 2.4 Arrotondare la soluzione del rilassamento lineare

!!! chiave ""

    Di solito si ottengono soluzioni ammissibili del problema PLI arrotondando una soluzione ottima del rilassamento lineare. Ma nessuna tecnica di arrotondamento garantisce di trovare una soluzione ottima del problema PLI.

<a id="box-11-ex-round-car"></a>

!!! esempio "Esempio 2.4: arrotondamento nell'esempio dell'auto"

    - La soluzione ottima del rilassamento lineare è $\tilde{\vet x}(\LP) = (\frac{7}{2},\frac{5}{2})$. Arrotondando all'intero più vicino si ottiene $(4,3)$, che è inammissibile: $10 \cdot 4 + 4 \cdot 3 = 52 > 45$.

    - Arrotondando per difetto entrambe le componenti si ottiene la soluzione ammissibile $\bar{\vet x} = (3,2)$, con $\LB = 3 \cdot 3 + 2 \cdot 2 = 13$. La soluzione ottima del problema PLI è $\tilde{\vet x}(\ILP) = (4,1)$, con $z(\ILP) = 14$: l'arrotondamento non dà l'ottimo, e i bound sono $13 \le z(\ILP) \le 15$.

<a id="box-12-ex-round-good"></a>

!!! esempio "Esempio 2.5: l'arrotondamento funziona, ma il bound non è stretto"

    Consideriamo il seguente problema PLI; il suo rilassamento lineare ha $x_1, x_2 \ge 0$ al posto dei vincoli di integralità:

    $$
    \begin{array}{rrrrrrr}
    {\max} & {2}\, {x_1} & {+} & {4}\, {x_2} \\[1ex]
    \text{soggetto a} & {-}\, {x_1} & {+} & \, {x_2} & {\le} & {2} \\[1ex]
    & {8}\, {x_1} & {+} & {2}\, {x_2} & {\le} & {19} \\[1ex]
    & {x_1,} &  & {x_2} & {\in} & {\Z_{\ge 0}}
    \end{array}
    $$

    - La soluzione ottima del rilassamento lineare è $\tilde{\vet x}(\LP) = (\frac{3}{2},\frac{7}{2})$, con $z(\LP) = 17$ e $\lfloor z(\LP) \rfloor = 17$, quindi $z(\ILP) \le 17$.

    - Arrotondando per difetto entrambe le componenti otteniamo la soluzione ammissibile $\bar{\vet x} = (\lfloor \frac{3}{2} \rfloor, \lfloor \frac{7}{2} \rfloor) = (1,3)$, con $\LB = 2 \cdot 1 + 4 \cdot 3 = 14$.

    - La soluzione ottima del problema PLI è $\tilde{\vet x}(\ILP) = (1,3)$, con $z(\ILP) = 14$: la soluzione arrotondata è ottima. Ma i bound $14 \le z(\ILP) \le 17$ non lo dimostrano.

    ![Figura 2](../img/02-lp-relaxation/fig02.svg){ .fig .ovale loading=lazy  }

    <em>Il secondo esempio: la regione ammissibile del rilassamento lineare (rossa), i punti interi (neri) e la soluzione ottima del rilassamento lineare (blu), con la retta obiettivo $2\,x_1 + 4\,x_2 = 17$ (tratteggiata).</em>

<a id="box-13-ex-round-bad"></a>

!!! esempio "Esempio 2.6: l'arrotondamento fallisce"

    Consideriamo il seguente problema PLI:

    $$
    \begin{array}{rrrrrrr}
    {\max} & {25}\, {x_1} & {+} & {16}\, {x_2} \\[1ex]
    \text{soggetto a} & {50}\, {x_1} & {+} & {31}\, {x_2} & {\le} & {250} \\[1ex]
    & {-3}\, {x_1} & {+} & {2}\, {x_2} & {\le} & {4} \\[1ex]
    & {x_1,} &  & {x_2} & {\in} & {\Z_{\ge 0}}
    \end{array}
    $$

    - La soluzione ottima del rilassamento lineare è $\tilde{\vet x}(\LP) = (\frac{376}{193}, \frac{950}{193}) \approx (1.94, 4.92)$, con $z(\LP) = \frac{24600}{193} \approx 127.46$. Quindi $z(\ILP) \le \lfloor z(\LP) \rfloor = 127$.

    - Arrotondando all'intero più vicino si ottiene $(2,5)$, che è inammissibile: $50 \cdot 2 + 31 \cdot 5 = 255 > 250$. Arrotondando $\tilde{x}_1$ per eccesso e $\tilde{x}_2$ per difetto si ottiene la soluzione ammissibile $\bar{\vet x} = (2,4)$, con $\LB = 25 \cdot 2 + 16 \cdot 4 = 114$.

    - La soluzione ottima del problema PLI è $\tilde{\vet x}(\ILP) = (5,0)$, con $z(\ILP) = 125$. È lontana da $\tilde{\vet x}(\LP)$, e nessun arrotondamento di $\tilde{\vet x}(\LP)$ la trova.

    ![Figura 3](../img/02-lp-relaxation/fig03.svg){ .fig .ovale loading=lazy  }

    <em>Il terzo esempio: i punti interi (neri) sono lontani dalla soluzione ottima $(\frac{376}{193},\frac{950}{193})$ del rilassamento lineare (blu). La soluzione ottima del problema PLI è $(5,0)$ (cerchio blu). La linea tratteggiata è la retta obiettivo $25\,x_1 + 16\,x_2 = \frac{24600}{193}$.</em>

!!! chiave ""

    Le soluzioni ottime del problema PLI possono essere molto lontane dalle soluzioni ottime del rilassamento lineare. Il valore del rilassamento lineare, invece, è spesso un buon bound: qui $125 \le z(\LP) \approx 127.46$.

## 2.5 Upper bound sulle variabili

<a id="box-14-prop-vub"></a>

!!! teorema "Proposizione 2.8: upper bound sulle variabili"

    Sia $\sum_{j=1}^n a_{ij} \, x_j \le b_i$ un vincolo con $a_{ij} \ge 0$ per ogni $j$. Allora ogni soluzione ammissibile del problema PLI soddisfa

    \begin{equation*}
    \label{vub}
    x_j \le \left\lfloor \frac{b_i}{a_{ij}} \right\rfloor, \qquad \forall j \textrm{ tale che } a_{ij} > 0. \tag{2.5}
    \end{equation*}

??? dimostrazione "Dimostrazione"

    Poiché tutte le variabili e tutti i coefficienti sono non negativi, $a_{ij} \, x_j \le \sum_{k=1}^n a_{ik} \, x_k \le b_i$, quindi $x_j \le \frac{b_i}{a_{ij}}$. La variabile è intera, quindi non supera la parte intera di $\frac{b_i}{a_{ij}}$. <span class="qed">□</span>

- Se più vincoli danno un bound su $x_j$, teniamo il più piccolo. I bound tagliano parti del poliedro del rilassamento lineare, e nessun punto intero.

!!! chiave ""

    Gli upper bound sulle variabili migliorano il rilassamento lineare solo se ne tagliano la soluzione ottima.

<a id="box-15-ex-vub-car"></a>

!!! esempio "Esempio 2.7: upper bound sulle variabili dell'esempio dell'auto"

    Entrambi i vincoli dell'esempio dell'auto hanno coefficienti non negativi:

    \begin{align*}
    x_1 &\le \min \left\{ \left\lfloor \tfrac{45}{10} \right\rfloor, \left\lfloor \tfrac{49}{4} \right\rfloor \right\}
    = \min\{4, 12\} = 4,\\
    x_2 &\le \min \left\{ \left\lfloor \tfrac{45}{4} \right\rfloor, \left\lfloor \tfrac{49}{14} \right\rfloor \right\}
    = \min\{11, 3\} = 3.
    \end{align*}

    - Le disuguaglianze $x_1 \le 4$ e $x_2 \le 3$ sono soddisfatte da tutti i punti interi dell'esempio dell'auto, e si possono aggiungere al modello. Tagliano due regioni del poliedro, e nessun punto intero.

    ![Figura 4](../img/02-lp-relaxation/fig04.svg){ .fig .ovale loading=lazy  }

    <em>Gli upper bound sulle variabili $x_1 \le 4$ e $x_2 \le 3$ (verdi) tagliano le due regioni grigie del rilassamento lineare (rosso) e nessun punto intero. La soluzione ottima del rilassamento lineare (blu) non viene tagliata.</em>

    - La soluzione ottima del rilassamento lineare, $(\frac{7}{2},\frac{5}{2})$, soddisfa entrambe le disuguaglianze. Non viene tagliata, quindi il valore ottimo del rilassamento lineare non cambia, e l'upper bound resta $15$.

<a id="box-16-ex-vub-help"></a>

!!! esempio "Esempio 2.8: upper bound che tagliano l'ottimo del rilassamento lineare"

    - Consideriamo la funzione obiettivo $x_1 - x_2$ sui vincoli dell'esempio dell'auto, la cui soluzione ottima del problema PLI è $(4,0)$ con $z(\ILP) = 4$. Prima dei bound, la soluzione ottima del rilassamento lineare è $(\frac{9}{2},0)$ con $z(\LP) = \frac{9}{2}$; dopo $x_1 \le 4$ è $(4,0)$ con $z(\LP) = 4$, che è intera e quindi ottima.

    ![Figura 5](../img/02-lp-relaxation/fig05.svg){ .fig .ovale loading=lazy  }

    <em>L'obiettivo $x_1 - x_2$: l'upper bound sulla variabile $x_1 \le 4$ (verde) taglia il triangolo grigio e la soluzione ottima $(\frac{9}{2},0)$ del rilassamento lineare (cerchio blu). La nuova soluzione ottima $(4,0)$ (blu) è intera. La linea tratteggiata è $x_1 - x_2 = \frac{9}{2}$.</em>

    - Il valore del rilassamento lineare migliora da $\frac{9}{2}$ a $4$. Il bound arrotondato $\lfloor \frac{9}{2} \rfloor = 4$ valeva già $4$: una formulazione migliore non migliora sempre il bound arrotondato.

## 2.6 Bound duali

- Un bound duale si può ottenere anche senza risolvere il rilassamento lineare, combinando i vincoli con <strong>moltiplicatori non negativi</strong> $\pi_i$, uno per ciascun vincolo.

<a id="box-17-def-dlp"></a>

!!! definizione "Definizione 2.9: problema duale del rilassamento lineare"

    Il <strong>problema duale</strong> D(LP) del rilassamento lineare [(2.2)](#eq-LP) è il seguente problema LP, con valore ottimo $z(\mathrm{D(LP)})$:

    <a id="eq-DLP"></a>

    \begin{align*}
    &&   \min \;\;{\sum_{i =1}^m b_i \, \pi_i}                               \label{ObjFunc_D}  \tag{2.6a}\\[2ex]
    && \text{soggetto a} \quad  {\sum_{i =1}^m a_{ij} \, \pi_i}  &\geq c_j,   & \forall j \in \{1,2,\dots,n\},                    \label{Cons_D}  \tag{2.6b}\\[2ex]
    &&\pi_i                        &\ge  0, & \forall i \in \{1,2,\dots,m\}. \label{non_negativity_D} \tag{2.6c}
    \end{align*}

- Moltiplicando il vincolo $i$ per $\pi_i \ge 0$ e sommando, otteniamo una disuguaglianza i cui coefficienti sono almeno pari ai costi, per $\eqref{Cons_D}$. I moltiplicatori devono essere non negativi: un moltiplicatore negativo invertirebbe la disuguaglianza.

<a id="box-18-prop-dual-bound"></a>

!!! teorema "Proposizione 2.10: bound duali"

    Per ogni soluzione ammissibile $\bar{\vet \pi}$ del problema duale [(2.6)](#eq-DLP),

    $$
    z(\ILP) ~\le~ z(\LP) ~\le~ \sum_{i=1}^m b_i \, \bar{\pi}_i .
    $$

    Per la dualità forte, $z(\mathrm{D(LP)}) = z(\LP)$: i moltiplicatori migliori danno esattamente il valore del rilassamento lineare.

??? dimostrazione "Dimostrazione"

    Sia $\vet x$ ammissibile per il rilassamento lineare. Moltiplicando il vincolo $i$ per $\bar{\pi}_i \ge 0$ e sommando, $\sum_{j=1}^n \big( \sum_{i=1}^m a_{ij} \, \bar{\pi}_i \big) x_j \le \sum_{i=1}^m b_i \, \bar{\pi}_i$. Per $\eqref{Cons_D}$ e $x_j \ge 0$, il membro sinistro è almeno $\sum_{j=1}^n c_j \, x_j$. Quindi $\sum_{j=1}^n c_j \, x_j \le \sum_{i=1}^m b_i \, \bar{\pi}_i$ per ogni $\vet x$ ammissibile. <span class="qed">□</span>

!!! chiave ""

    Ogni soluzione ammissibile del problema duale è il certificato di un upper bound, trovato senza risolvere il rilassamento lineare. Il certificato migliore è una soluzione duale ottima, e ha lo stesso valore del rilassamento lineare.

<a id="box-19-ex-mult-car"></a>

!!! esempio "Esempio 2.9: moltiplicatori per l'esempio dell'auto"

    - Una soluzione ammissibile del rilassamento lineare non dà un bound duale: il suo valore non è né un lower bound né un upper bound su $z(\ILP)$.

    <div class="tabella" markdown="0"><table>
    <tr>
    <th><span class="arithmatex">\((x_1, x_2)\)</span></th>
    <th>ammissibile per il rilassamento lineare</th>
    <th>intera</th>
    <th><span class="arithmatex">\(3\,x_1 + 2\,x_2\)</span></th>
    </tr>
    <tr>
    <td><span class="arithmatex">\((4, \frac{5}{4})\)</span></td>
    <td>sì</td>
    <td>no</td>
    <td><span class="arithmatex">\(\frac{29}{2} > 14\)</span></td>
    </tr>
    <tr>
    <td><span class="arithmatex">\((2, \frac{5}{2})\)</span></td>
    <td>sì</td>
    <td>no</td>
    <td><span class="arithmatex">\(11 < 14\)</span></td>
    </tr>
    </table></div>

    - Moltiplicando il primo vincolo dell'esempio dell'auto per $\frac{3}{4}$ otteniamo

        $$
        \frac{15}{2}\,x_1 + 3\,x_2 \le \frac{135}{4}.
        $$

        Poiché $x_1, x_2 \ge 0$ e i coefficienti $\frac{15}{2}$ e $3$ sono almeno pari ai costi $3$ e $2$, abbiamo $3\,x_1 + 2\,x_2 \le \frac{15}{2}\,x_1 + 3\,x_2 \le \frac{135}{4}$: un upper bound pari a $\frac{135}{4}$.

    - Con i moltiplicatori $\pi_1, \pi_2 \ge 0$ dei due vincoli, i coefficienti della somma devono essere almeno pari ai costi:

        \begin{align*}
        (10\,\pi_1 + 4\,\pi_2)\,x_1 + (4\,\pi_1 + 14\,\pi_2)\,x_2 &\le 45\,\pi_1 + 49\,\pi_2,\\
        10\,\pi_1 + 4\,\pi_2 \ge 3, \qquad 4\,\pi_1 + 14\,\pi_2 &\ge 2.
        \end{align*}

    <div class="tabella" markdown="0"><table>
    <tr>
    <th><span class="arithmatex">\((\pi_1, \pi_2)\)</span></th>
    <th>moltiplicatori validi</th>
    <th>upper bound <span class="arithmatex">\(45\,\pi_1 + 49\,\pi_2\)</span></th>
    </tr>
    <tr>
    <td><span class="arithmatex">\((\frac{3}{4}, 0)\)</span></td>
    <td>sì</td>
    <td><span class="arithmatex">\(\frac{135}{4}\)</span></td>
    </tr>
    <tr>
    <td><span class="arithmatex">\((0, \frac{3}{4})\)</span></td>
    <td>sì</td>
    <td><span class="arithmatex">\(\frac{147}{4}\)</span></td>
    </tr>
    <tr>
    <td><span class="arithmatex">\((\frac{1}{5}, \frac{1}{4})\)</span></td>
    <td>sì</td>
    <td><span class="arithmatex">\(\frac{85}{4}\)</span></td>
    </tr>
    <tr>
    <td><span class="arithmatex">\((\frac{1}{2}, 0)\)</span></td>
    <td>sì</td>
    <td><span class="arithmatex">\(\frac{45}{2}\)</span></td>
    </tr>
    <tr>
    <td><span class="arithmatex">\((\frac{1}{5}, 0)\)</span></td>
    <td>no: <span class="arithmatex">\(10 \cdot \frac{1}{5} = 2 < 3\)</span></td>
    <td>–</td>
    </tr>
    </table></div>

    - I moltiplicatori migliori, con il valore più piccolo di $45\,\pi_1 + 49\,\pi_2$, risolvono il problema duale [(2.6)](#eq-DLP) dell'esempio dell'auto:

    $$
    \begin{array}{rrrrrrr}
    {\min} & {45}\, {\pi_1} & {+} & {49}\, {\pi_2} \\[1ex]
    \text{soggetto a} & {10}\, {\pi_1} & {+} & {4}\, {\pi_2} & {\ge} & {3} \\[1ex]
    & {4}\, {\pi_1} & {+} & {14}\, {\pi_2} & {\ge} & {2} \\[1ex]
    & {\pi_1,} &  & {\pi_2} & {\ge} & {0}
    \end{array}
    $$

<a id="box-20-ex-dual-car"></a>

!!! esempio "Esempio 2.10: soluzione duale ottima dell'esempio dell'auto"

    La soluzione ottima del problema duale dell'<span style="color:#1971c2">[Esempio 2.9](#box-19-ex-mult-car)</span> è $\tilde{\vet \pi}(\mathrm{D(LP)}) = (\frac{17}{62},\frac{2}{31})$, e

    $$
    z(\mathrm{D(LP)}) = 45 \cdot \frac{17}{62} + 49 \cdot \frac{2}{31} = \frac{765}{62} +
    \frac{98}{31} = \frac{31}{2} = z(\LP).
    $$

    Gli altri due vertici della regione ammissibile duale danno i bound $\frac{45}{2}$ e $\frac{147}{4}$.

    ![Figura 6](../img/02-lp-relaxation/fig06.svg){ .fig .ovale loading=lazy  }

    <em>La regione ammissibile del problema LP duale (rossa, illimitata) e la sua soluzione ottima $(\frac{17}{62},\frac{2}{31})$ (blu), con la retta obiettivo $45\,\pi_1 + 49\,\pi_2 = \frac{31}{2}$ (tratteggiata). Gli altri vertici (neri) danno i bound $\frac{45}{2}$ e $\frac{147}{4}$.</em>

### 2.6.1 Riepilogo della notazione

- <strong>Problema PLI</strong>: soluzione ottima $\tilde{\vet x}(\ILP)$, valore ottimo $z(\ILP)$.

- <strong>Bound primale</strong>: soluzione ammissibile $\bar{\vet x}$ con $\LB(\bar{\vet x}) = \sum_{j} c_j \, \bar{x}_j \le z(\ILP)$.

- <strong>Rilassamento lineare</strong>: soluzione ottima $\tilde{\vet x}(\LP)$, valore ottimo $z(\LP)$, upper bound $z(\ILP) \le z(\LP)$.

- <strong>Problema duale</strong>: soluzione ottima $\tilde{\vet \pi}(\mathrm{D(LP)})$, valore ottimo $z(\mathrm{D(LP)}) = z(\LP)$, e $z(\ILP) \le \sum_i b_i \, \bar{\pi}_i$ per ogni soluzione duale ammissibile $\bar{\vet \pi}$.

## 2.7 Errori tipici

!!! attenzione "Attenzione"

    - <strong>Prendere una soluzione euristica per ottima.</strong> Una soluzione ammissibile dà solo un bound primale. Senza un bound duale dello stesso valore non c'è alcun certificato di ottimalità.

    - <strong>Arrotondare il bound quando non è lecito.</strong> Il bound $\lfloor z(\LP) \rfloor$ richiede che tutte le variabili e tutti i costi siano interi. In un problema MIP il bound è $z(\LP)$.

    - <strong>Arrotondare la soluzione e chiamarla ottima.</strong> Una soluzione arrotondata è, nel migliore dei casi, ammissibile, e in generale non ottima. Può anche essere inammissibile, come il punto intero più vicino $(2,5)$ dell'<span style="color:#1971c2">[Esempio 2.6](#box-13-ex-round-bad)</span>.

    - <strong>Usare come bound il valore di una soluzione ammissibile del rilassamento lineare.</strong> Solo il valore ottimo del rilassamento lineare, o il valore di una soluzione duale ammissibile, è un upper bound.

    - <strong>Moltiplicatori con segno negativo.</strong> I moltiplicatori dei vincoli $\le$ devono essere non negativi, e i coefficienti combinati devono essere almeno pari ai costi.

    - <strong>Ricavare un bound su una variabile da un vincolo con coefficienti negativi.</strong> La dimostrazione di $\eqref{vub}$ richiede che tutti i coefficienti siano non negativi.

    - <strong>Credere che una formulazione più forte migliori sempre il bound.</strong> I bound $x_1 \le 4$ e $x_2 \le 3$ lasciano invariato il bound $15$ dell'esempio dell'auto.

## 2.8 In sintesi

!!! chiave "In sintesi"

    - Ogni soluzione ammissibile è un bound primale (un lower bound) su $z(\ILP)$, e gli algoritmi euristici trovano rapidamente buone soluzioni ammissibili.

    - Il rilassamento lineare elimina l'integralità, quindi $z(\ILP) \le z(\LP)$; con variabili intere e costi interi questo bound duale (un upper bound) si può arrotondare per difetto a $\lfloor z(\LP) \rfloor$.

    - Bound primale e bound duale definiscono il gap di ottimalità; l'ottimalità è certificata quando il gap è zero.

    - Arrotondare una soluzione ottima del rilassamento lineare dà, nel migliore dei casi, una soluzione ammissibile, mai un certificato.

    - Gli upper bound sulle variabili $x_j \le \lfloor b_i / a_{ij} \rfloor$ vengono da vincoli con coefficienti non negativi, e servono solo se tagliano l'ottimo del rilassamento lineare.

    - I moltiplicatori non negativi dei vincoli danno bound duali; i migliori risolvono il problema duale, il cui valore ottimo è $z(\LP)$.

    <strong>Cruscotto dell'esempio dell'auto.</strong> I bound su $z(\ILP)$ trovati finora in questo modulo (bound primale: lower bound; bound duale: upper bound):

    <div class="tabella" markdown="0"><table>
    <tr>
    <th>Capitolo</th>
    <th>Lower bound</th>
    <th>Upper bound</th>
    <th>Da</th>
    </tr>
    <tr>
    <td>Bound primali e bound duali</td>
    <td><span class="arithmatex">\(14\)</span></td>
    <td><span class="arithmatex">\(15\)</span></td>
    <td>soluzione euristica <span class="arithmatex">\((4, 1)\)</span>, e <span class="arithmatex">\(\lfloor z(\LP) \rfloor\)</span> con <span class="arithmatex">\(z(\LP) = \tfrac{31}{2}\)</span></td>
    </tr>
    </table></div>

---

**Esercizi su questo capitolo:** [:material-pencil: Bound primali e duali](../esercizi/lp-relaxation.md)

<!-- laboratorio-interattivo: sezione generata da interattivi.py -->

## Laboratorio interattivo { #laboratorio-interattivo }

Le idee del capitolo, da toccare con mano: muovi i cursori e trascina i punti.
Ogni app si apre anche a tutta pagina nel [laboratorio interattivo](../laboratorio/index.md): [Punti interi e rilassamento lineare](../laboratorio/punti-interi.md).

<div class="gi" data-grafico="pli-punti-interi"></div>
