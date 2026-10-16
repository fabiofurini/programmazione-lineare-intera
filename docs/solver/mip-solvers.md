---
title: "I solver MIP: che cosa fanno"
---

# I solver MIP: che cosa fanno

<div class="info-capitolo" markdown>

**Parte 4 · I solver MIP · Capitolo 9** · [:material-file-pdf-box: Dispensa, volume 3 (PDF)](../pdf/dispensa-3-solver-mip.pdf) · [:material-presentation: Slide](../pdf/slide-09-mip-solvers.pdf) · [:material-pencil: Esercizi: Solver MIP](../esercizi/mip-solvers.md)

</div>

!!! nota "Prerequisiti"

    - Da questo modulo, i capitoli «Branch-and-bound basato sulla programmazione lineare» e «Algoritmi branch-and-cut»: le operazioni di branching, bounding e pruning, i tagli e la soluzione incumbent.

    - Da questo modulo, il capitolo «Bound primali e duali»: i lower bound e gli upper bound e il gap di ottimalità.

    - Per imparare a usare Gurobi nella pratica, vedi il modulo «Modellazione MIP» ([<u>fabiofurini.github.io/modellazione-mip</u>](https://fabiofurini.github.io/modellazione-mip/)), [capitolo 3 «Dal modello a Python/Gurobi»](https://fabiofurini.github.io/modellazione-mip/modellazione-3/).

!!! chiave "Obiettivi"

    Alla fine di questo capitolo sarai in grado di:

    - nominare i componenti di un solver MIP e dire su quale lato dei bound agisce ciascuno di essi;

    - spiegare presolve, tagli, euristiche primali, regole di branching, tolleranze e gap;

    - leggere il log di Gurobi e seguire i due bound, la soluzione incumbent e l'albero;

    - spiegare perché un solver può fermarsi con una soluzione che non è ottima.

## 9.1 Dall'algoritmo branch-and-cut a un solver MIP

<a id="box-1-def-solver"></a>

!!! definizione "Definizione 9.1: Solver MIP"

    Un <strong>solver MIP</strong> (Gurobi, CPLEX, Xpress, HiGHS, SCIP) è un programma che calcola soluzioni ottime di problemi MIP. Il suo nucleo è l'algoritmo branch-and-cut del capitolo precedente.

- Intorno al nucleo, il solver aggiunge diversi componenti. Ciascuno di essi agisce su un lato dei bound su $z(\ILP)$, qui per un problema di massimizzazione:

    $$
    \underbrace{\LB}_{\text{lato primale}} ~~\le~~ z(\ILP) ~~\le~~ \underbrace{\UB}_{\text{lato duale}}
    $$

- I componenti sono gli stessi in tutti i solver. I dettagli (quali tagli, quali euristiche, quali regole) cambiano da solver a solver e da versione a versione, e sono documentati solo in parte.

!!! chiave ""

    Un solver MIP esegue il presolve, poi il nodo radice (rilassamento lineare, tagli, euristiche primali), poi l'albero di branch-and-cut, e si ferma quando il gap tra i bound scende sotto una tolleranza o quando si raggiunge un limite di tempo, di nodi o di soluzioni.

![Figura 1](../img/09-mip-solvers/fig01.svg){ .fig loading=lazy  }

### 9.1.1 Dizionario tra gli appunti e il solver

<div class="tabella" markdown="0"><table>
<tr>
<th>Negli appunti (B&amp;B, B&amp;C)</th>
<th>Nel log di Gurobi</th>
</tr>
<tr>
<td>lower bound <span class="arithmatex">\(\LB\)</span> (max), soluzione incumbent <span class="arithmatex">\(\bar{\vet x}\)</span></td>
<td><code>Incumbent</code></td>
</tr>
<tr>
<td>upper bound <span class="arithmatex">\(\UB\)</span> (max)</td>
<td><code>BestBd</code> (best bound)</td>
</tr>
<tr>
<td>gap di ottimalità</td>
<td><code>Gap</code></td>
</tr>
<tr>
<td>lista <span class="arithmatex">\(L\)</span> dei problemi LP da elaborare</td>
<td><code>Unexpl</code> (nodi non esplorati)</td>
</tr>
<tr>
<td>problemi LP già elaborati</td>
<td><code>Expl</code> (nodi esplorati)</td>
</tr>
<tr>
<td><span class="arithmatex">\(z(\LP_k)\)</span> del nodo di branching corrente</td>
<td><code>Obj</code></td>
</tr>
<tr>
<td>livello del nodo nell'albero</td>
<td><code>Depth</code></td>
</tr>
<tr>
<td>variabili intere frazionarie in <span class="arithmatex">\(\tilde{\vet x}(\LP_k)\)</span></td>
<td><code>IntInf</code></td>
</tr>
</table></div>

- In un problema di <u>minimizzazione</u> i ruoli si scambiano: <code>Incumbent</code> è un upper bound e <code>BestBd</code> è un lower bound.

## 9.2 I componenti di un solver MIP

### 9.2.1 Presolve

<a id="box-2-def-presolve"></a>

!!! definizione "Definizione 9.2: presolve"

    Il <strong>presolve</strong> trasforma un problema MIP in uno equivalente: stesso valore ottimo, e una soluzione ottima del problema originale si ricava da una soluzione ottima del nuovo problema.

- Il nuovo problema è più piccolo e, spesso, ha un rilassamento lineare più forte. Le operazioni tipiche sono tre:

    1. eliminare i <strong>vincoli ridondanti</strong> e <strong>fissare le variabili</strong> il cui valore è implicato dagli altri vincoli;

    2. <strong>rafforzamento dei bound</strong> (bound tightening): ricavare upper bound più piccoli e lower bound più grandi sulle variabili;

    3. <strong>rafforzamento dei coefficienti</strong> (coefficient tightening): modificare i coefficienti di un vincolo in modo che le soluzioni intere restino le stesse, mentre il rilassamento lineare diventa più piccolo.

<a id="box-3-ex-solver-presolve"></a>

!!! esempio "Esempio 9.1: rafforzamento dei coefficienti"

    Consideriamo il problema con tre variabili binarie

    $$
    \max~ x_1 + x_2 + x_3 \qquad \text{soggetto a} \qquad 6\,x_1 + 6\,x_2 + 3\,x_3 \le 10, \qquad
    x_1, x_2, x_3 \in \{0,1\}.
    $$

    - Il vincolo è soddisfatto dagli stessi sei punti binari del vincolo

        $$
        7\,x_1 + 7\,x_2 + 3\,x_3 \le 10 .
        $$

        Infatti $x_1 = x_2 = 1$ viola entrambi ($12 > 10$ e $14 > 10$), mentre ogni altro punto li soddisfa entrambi (i primi membri più grandi sono $9$ e $10$).

    - Il rilassamento lineare del primo vincolo ha valore ottimo $z(\LP) = \frac{13}{6}$, raggiunto per esempio in $\tilde{\vet x} = (1,\frac{1}{6},1)$: è frazionaria, e $x_1 + x_2 = \frac{7}{6}$.

    - Il rilassamento lineare del secondo vincolo ha valore ottimo $2 = z(\ILP)$: l'upper bound scende da $\frac{13}{6}$ a $2$ senza cambiare le soluzioni intere né la dimensione del modello.

- Lo stesso ragionamento si può applicare in ogni nodo di branching (<strong>presolve del nodo</strong>, o <strong>propagazione dei domini</strong>): un vincolo di branching $x_j \le 0$ può implicare che altre variabili si possano fissare.

### 9.2.2 Piani di taglio

- Al nodo radice il solver esegue diversi <strong>round di tagli</strong>. Alla fine, il log riporta quanti tagli di ciascuna famiglia sono stati aggiunti.

- Le famiglie che compaiono nei nostri log sono <code>Gomory</code> (tagli di Gomory), <code>MIR</code> (tagli di mixed-integer rounding, che generalizzano i tagli di Gomory ai problemi MIP), <code>StrongCG</code> (tagli di Chvátal–Gomory) e <code>Lift-and-project</code>.

- I tagli si generano anche nell'albero, meno spesso che alla radice (branch-and-cut).

### 9.2.3 Euristiche primali { #sez-sec-solver-heuristics }

- Le <strong>euristiche primali</strong> cercano buone soluzioni intere ammissibili: forniscono la soluzione incumbent e il lower bound $\LB$ (massimizzazione). Esempi sono l'arrotondamento della soluzione del rilassamento lineare, il <strong>diving</strong> e la ricerca locale intorno alla soluzione incumbent (capitolo «Euristiche MIP»).

- Nel log, una riga che inizia con <code>H</code> riporta una nuova soluzione incumbent trovata da un'euristica. Una riga che inizia con <code>\*</code> ne riporta una trovata come soluzione ottima intera del problema LP di un nodo (potatura per integralità).

- La riga <code>Found heuristic solution</code> riporta una soluzione trovata prima del problema LP della radice.

### 9.2.4 Selezione della variabile e del nodo di branching

- Le strategie di selezione della variabile di branching del capitolo sul B&amp;B (massima inammissibilità, strong branching, pseudocosti) sono tutte disponibili in un solver. Lo strong branching dà alberi piccoli ma è costoso; i pseudocosti costano poco ma all'inizio sono poco affidabili.

- I solver le combinano nel <strong>reliability branching</strong>: strong branching su una variabile finché i suoi pseudocosti non sono stati osservati un numero sufficiente di volte.

- In Gurobi il parametro <code>VarBranch</code> sceglie la strategia: $-1$ automatica (predefinita), $0$ pseudo costo ridotto, $1$ pseudo prezzo ombra, $2$ massima inammissibilità, $3$ strong branching.

- La selezione del nodo combina <strong>best bound</strong> (si sceglie il nodo con il valore $z(\LP_k)$ più grande, il che fa scendere $\UB$) e <strong>ricerca in profondità</strong> (che trova presto soluzioni intere).

### 9.2.5 Tolleranze e gap

- Un solver MIP lavora in <strong>aritmetica a virgola mobile</strong>: un valore è intero, un vincolo è soddisfatto, un costo ridotto è non positivo, a meno di una <strong>tolleranza</strong>. I valori predefiniti in Gurobi 13 sono:

<div class="tabella" markdown="0"><table>
<tr>
<th>Parametro</th>
<th>Predefinito</th>
<th>Significato</th>
</tr>
<tr>
<td><code>IntFeasTol</code></td>
<td><span class="arithmatex">\(10^{-5}\)</span></td>
<td>una variabile è intera se dista meno di <span class="arithmatex">\(10^{-5}\)</span> da un intero</td>
</tr>
<tr>
<td><code>FeasibilityTol</code></td>
<td><span class="arithmatex">\(10^{-6}\)</span></td>
<td>violazione massima di un vincolo</td>
</tr>
<tr>
<td><code>OptimalityTol</code></td>
<td><span class="arithmatex">\(10^{-6}\)</span></td>
<td>tolleranza sui costi ridotti (ottimalità LP)</td>
</tr>
<tr>
<td><code>MIPGap</code></td>
<td><span class="arithmatex">\(10^{-4}\)</span></td>
<td>gap relativo a cui il solver si ferma</td>
</tr>
<tr>
<td><code>MIPGapAbs</code></td>
<td><span class="arithmatex">\(10^{-10}\)</span></td>
<td>gap assoluto a cui il solver si ferma</td>
</tr>
</table></div>

!!! chiave ""

    “<code>Optimal solution found (tolerance 1.00e-04)</code>” significa che la soluzione incumbent è ottima <strong>a meno di un gap relativo di $10^{-4}$</strong>. Con un <code>MIPGap</code> più grande il solver si ferma con una soluzione che può <strong>non</strong> essere ottima, e scrive la stessa frase.

## 9.3 Come si legge il log di Gurobi

- Tutti i log sono prodotti da Gurobi 13.0.3 (<code>gurobipy</code>) con <code>Threads</code> $=1$ e <code>Seed</code> $=0$, così che l'esecuzione sia deterministica. Con altre versioni o altri computer il numero di nodi e di iterazioni può cambiare.

- I numeri a sinistra sono numeri di riga aggiunti per i commenti; le righe <code>Set parameter ...</code> sono omesse.

### 9.3.1 Un problema del catalogo risolto alla radice

- Partiamo dal problema $P41$ del catalogo dei problemi MIP: tre variabili intere non negative e quattro vincoli,

    $$
    \begin{array}{rrcrcrcl}
    \max & 2x_1 & + & x_2 & + & 3x_3 & & \\[1ex]
    \text{soggetto a} & x_1 & + & x_2 & + & x_3 & \le & 4 \\
    & & & x_2 & & & \le & 2 \\
    & & & & & x_3 & \le & 3 \\
    & 3x_1 & & & + & x_3 & \le & 6 \\[1ex]
    & x_1, & & x_2, & & x_3 & \in & \Z_{\ge 0}
    \end{array}
    $$

??? codice "Log di Gurobi: problema $P41$, parametri predefiniti"

    ```python
    01| Gurobi Optimizer version 13.0.3 build v13.0.3rc0 (linux64 - "Ubuntu 26.04 LTS")
    02| 
    03| CPU model: Intel(R) Core(TM) i5-14500T, instruction set [SSE2|AVX|AVX2]
    04| Thread count: 20 physical cores, 20 logical processors, using up to 1 threads
    05| 
    06| Non-default parameters:
    07| LogToConsole  0
    08| Threads  1
    09| 
    10| Optimize a model with 4 rows, 3 columns and 7 nonzeros (Max)
    11| Model fingerprint: 0xedc792ce
    12| Model has 3 linear objective coefficients
    13| Variable types: 0 continuous, 3 integer (0 binary)
    14| Coefficient statistics:
    15|   Matrix range     [1e+00, 3e+00]
    16|   Objective range  [1e+00, 3e+00]
    17|   Bounds range     [0e+00, 0e+00]
    18|   RHS range        [2e+00, 6e+00]
    19| 
    20| Found heuristic solution: objective 6.0000000
    21| Presolve removed 2 rows and 0 columns
    22| Presolve time: 0.00s
    23| Presolved: 2 rows, 3 columns, 5 nonzeros
    24| Variable types: 0 continuous, 3 integer (0 binary)
    25| 
    26| Root relaxation: objective 1.100000e+01, 1 iterations, 0.00 seconds (0.00 work units)
    27| 
    28|     Nodes    |    Current Node    |     Objective Bounds      |     Work
    29|  Expl Unexpl |  Obj  Depth IntInf | Incumbent    BestBd   Gap | It/Node Time
    30| 
    31| *    0     0               0      11.0000000   11.00000  0.00%     -    0s
    32| 
    33| Explored 1 nodes (1 simplex iterations) in 0.00 seconds (0.00 work units)
    34| Thread count was 1 (of 20 available processors)
    35| 
    36| Solution count 2: 11 6
    37| 
    38| Optimal solution found (tolerance 1.00e-04)
    39| Best objective 1.100000000000e+01, best bound 1.100000000000e+01, gap 0.0000%
    ```

- **01–08** Versione di Gurobi, computer, thread usati ($1$, poiché <code>Threads</code> $=1$); parametri con valori non predefiniti (<code>Seed</code> $=0$ non compare, perché $0$ è il suo valore predefinito).

- **10–13** Dimensione del modello: $4$ righe, $3$ colonne, $7$ elementi non nulli, <code>(Max)</code>; i tipi delle variabili ($3$ intere, nessuna binaria).

- **14–18** <strong>Statistiche dei coefficienti</strong>: il più piccolo e il più grande valore assoluto dei coefficienti. Intervalli che coprono molti ordini di grandezza segnalano difficoltà numeriche; qui i coefficienti sono compresi tra $1$ e $6$, e le variabili non hanno limiti espliciti (<code>Bounds range</code> $[0,0]$).

- **20** Un'euristica trova una soluzione di valore $6$ prima del presolve, quindi $\LB = 6$.

- **21–23** Il presolve elimina $2$ righe: al modello restano $2$ righe e $3$ colonne.

- **26** <strong>Rilassamento alla radice</strong>: il valore è $11$ e basta $1$ iterazione del simplesso.

- **31** La soluzione del problema LP della radice è intera, quindi il nodo è risolto subito (una riga che inizia con <code>\*</code>, vedi la Sezione [9.2.3](#sez-sec-solver-heuristics)); $\LB = \UB = 11$, e la soluzione è ottima.

### 9.3.2 Un MIP generico

- D'ora in poi usiamo un <strong>MIP generico con $30$ variabili intere</strong>, che chiamiamo $G_1$. È un problema PLI puro nella forma

    $$
    \max~ \vet c\T\vet x \quad \text{soggetto a} \quad A\,\vet x \le \vet b,
    $$

    con $x_j \in \{0,1,2,3\}$ per $j = 1,\dots,30$ e $10$ vincoli. Tutti i dati sono interi e pseudo-casuali (Python <code>random.Random(1)</code>): $a_{ij}$ uniforme in $\{1,\dots,20\}$, $c_j$ uniforme in $\{5,\dots,25\}$, e $b_i = \sum_j a_{ij}$.

- Lo script <code>script/genera\_log.py</code> di questo capitolo costruisce l'istanza e produce tutti i log.

??? codice "Log di Gurobi: MIP generico $G_1$, parametri predefiniti"

    ```python
    01| Gurobi Optimizer version 13.0.3 build v13.0.3rc0 (linux64 - "Ubuntu 26.04 LTS")
    02| 
    03| CPU model: Intel(R) Core(TM) i5-14500T, instruction set [SSE2|AVX|AVX2]
    04| Thread count: 20 physical cores, 20 logical processors, using up to 1 threads
    05| 
    06| Non-default parameters:
    07| LogToConsole  0
    08| Threads  1
    09| 
    10| Optimize a model with 10 rows, 30 columns and 300 nonzeros (Max)
    11| Model fingerprint: 0xb023d504
    12| Model has 30 linear objective coefficients
    13| Variable types: 0 continuous, 30 integer (0 binary)
    14| Coefficient statistics:
    15|   Matrix range     [1e+00, 2e+01]
    16|   Objective range  [5e+00, 2e+01]
    17|   Bounds range     [3e+00, 3e+00]
    18|   RHS range        [3e+02, 4e+02]
    19| 
    20| Found heuristic solution: objective 429.0000000
    21| Presolve time: 0.00s
    22| Presolved: 10 rows, 30 columns, 300 nonzeros
    23| Variable types: 0 continuous, 30 integer (0 binary)
    24| 
    25| Root relaxation: objective 5.991749e+02, 13 iterations, 0.00 seconds (0.00 work units)
    26| 
    27|     Nodes    |    Current Node    |     Objective Bounds      |     Work
    28|  Expl Unexpl |  Obj  Depth IntInf | Incumbent    BestBd   Gap | It/Node Time
    29| 
    30|      0     0  599.17487    0    6  429.00000  599.17487  39.7%     -    0s
    31| H    0     0                     563.0000000  599.17487  6.43%     -    0s
    32| H    0     0                     576.0000000  599.17487  4.02%     -    0s
    33| H    0     0                     584.0000000  599.17487  2.60%     -    0s
    34| H    0     0                     587.0000000  599.17487  2.07%     -    0s
    35| H    0     0                     588.0000000  599.17487  1.90%     -    0s
    36|      0     0  597.88443    0    5  588.00000  597.88443  1.68%     -    0s
    37| H    0     0                     589.0000000  597.88443  1.51%     -    0s
    38| H    0     0                     592.0000000  597.88443  0.99%     -    0s
    39|      0     0  597.70993    0    5  592.00000  597.70993  0.96%     -    0s
    40|      0     0  597.67133    0    5  592.00000  597.67133  0.96%     -    0s
    41|      0     0  597.65097    0    4  592.00000  597.65097  0.95%     -    0s
    42|      0     0  597.64318    0    5  592.00000  597.64318  0.95%     -    0s
    43|      0     0  597.64271    0    5  592.00000  597.64271  0.95%     -    0s
    44|      0     0  597.56576    0    5  592.00000  597.56576  0.94%     -    0s
    45| H    0     0                     593.0000000  597.56576  0.77%     -    0s
    46|      0     0  597.55314    0    6  593.00000  597.55314  0.77%     -    0s
    47|      0     0  597.52752    0    6  593.00000  597.52752  0.76%     -    0s
    48|      0     0  597.51828    0    6  593.00000  597.51828  0.76%     -    0s
    49|      0     0  597.47194    0    7  593.00000  597.47194  0.75%     -    0s
    50|      0     0  597.21692    0    6  593.00000  597.21692  0.71%     -    0s
    51|      0     0  597.20185    0    6  593.00000  597.20185  0.71%     -    0s
    52|      0     0  597.19580    0    6  593.00000  597.19580  0.71%     -    0s
    53|      0     0  597.07620    0    6  593.00000  597.07620  0.69%     -    0s
    54|      0     0  597.07620    0    6  593.00000  597.07620  0.69%     -    0s
    55|      0     0  597.07620    0    6  593.00000  597.07620  0.69%     -    0s
    56|      0     0  597.07620    0    6  593.00000  597.07620  0.69%     -    0s
    57|      0     0  597.07620    0    6  593.00000  597.07620  0.69%     -    0s
    58|      0     0  597.07620    0    7  593.00000  597.07620  0.69%     -    0s
    59|      0     0  597.07620    0    7  593.00000  597.07620  0.69%     -    0s
    60|      0     0  597.07620    0    6  593.00000  597.07620  0.69%     -    0s
    61|      0     0  597.07620    0    7  593.00000  597.07620  0.69%     -    0s
    62|      0     0  597.07620    0    8  593.00000  597.07620  0.69%     -    0s
    63|      0     0  597.07074    0    7  593.00000  597.07074  0.69%     -    0s
    64|      0     0  597.02014    0    9  593.00000  597.02014  0.68%     -    0s
    65|      0     0  597.01888    0    9  593.00000  597.01888  0.68%     -    0s
    66|      0     0  597.01587    0    9  593.00000  597.01587  0.68%     -    0s
    67|      0     0  596.92506    0    8  593.00000  596.92506  0.66%     -    0s
    68|      0     0  596.85717    0    8  593.00000  596.85717  0.65%     -    0s
    69|      0     0  596.85610    0    8  593.00000  596.85610  0.65%     -    0s
    70|      0     0  596.85474    0    8  593.00000  596.85474  0.65%     -    0s
    71|      0     0  596.85333    0    8  593.00000  596.85333  0.65%     -    0s
    72|      0     0  596.76534    0    8  593.00000  596.76534  0.63%     -    0s
    73|      0     0  596.76242    0    8  593.00000  596.76242  0.63%     -    0s
    74|      0     0  596.75427    0    9  593.00000  596.75427  0.63%     -    0s
    75|      0     0  596.74106    0    8  593.00000  596.74106  0.63%     -    0s
    76|      0     0  596.73942    0    9  593.00000  596.73942  0.63%     -    0s
    77|      0     0  596.73942    0    9  593.00000  596.73942  0.63%     -    0s
    78|      0     2  596.64707    0    9  593.00000  596.64707  0.62%     -    0s
    79| 
    80| Cutting planes:
    81|   Gomory: 1
    82|   Lift-and-project: 1
    83|   MIR: 5
    84|   StrongCG: 3
    85| 
    86| Explored 47 nodes (259 simplex iterations) in 0.06 seconds (0.04 work units)
    87| Thread count was 1 (of 20 available processors)
    88| 
    89| Solution count 9: 593 592 589 ... 429
    90| 
    91| Optimal solution found (tolerance 1.00e-04)
    92| Best objective 5.930000000000e+02, best bound 5.930000000000e+02, gap 0.0000%
    ```

- **10–13** $10$ righe, $30$ colonne, $300$ elementi non nulli; <code>(Max)</code>: massimizzazione; le variabili sono intere ma non binarie.

- **20** Un'euristica trova una soluzione di valore $429$: $\LB = 429$.

- **21–23** Il presolve non cambia la dimensione del modello.

- **25** <strong>Rilassamento alla radice</strong>: il valore è $599.17487$ (upper bound), dopo $13$ iterazioni del simplesso.

- **27–28** Intestazione del <strong>log dei nodi</strong>: <code>Expl</code> e <code>Unexpl</code> sono i nodi esplorati e non esplorati; <code>Obj</code>, <code>Depth</code>, <code>IntInf</code> descrivono il nodo corrente; <code>Incumbent</code>, <code>BestBd</code>, <code>Gap</code> sono i due bound e il gap.

- **30** Nodo radice: $6$ variabili intere sono frazionarie, e il gap è $39.7\%$.

- **31–35** Righe che iniziano con <code>H</code>: le euristiche primali trovano soluzioni incumbent migliori, da $563$ a $588$, mentre il best bound resta $599.17487$.

- **36–77** Il <strong>ciclo dei tagli</strong>: ogni riga con $0$ nodi esplorati è un nuovo round di tagli, e il best bound scende da $599.17487$ a $596.73942$. Si trovano altre soluzioni incumbent, fino a $593$ (riga $45$).

- **78** Sulla radice si esegue il branching: $2$ nodi attendono nella lista, il gap è $0.62\%$.

- **81–84** Tagli aggiunti: $1$ di Gomory, $1$ lift-and-project, $5$ MIR, $3$ StrongCG.

- **86–92** $47$ nodi esplorati, $259$ iterazioni del simplesso; $9$ soluzioni trovate, la migliore è $593$, ottima.

!!! chiave ""

    Qui la maggior parte del lavoro si fa alla radice: le euristiche alzano il lower bound da $429$ a $593$ e i tagli abbassano l'upper bound da $599.17$ a $596.65$. L'albero serve poi a <strong>dimostrare</strong> che $593$ è ottimo.

### 9.3.3 La stessa istanza senza presolve, tagli ed euristiche

- Con <code>Presolve</code> $=0$, <code>Cuts</code> $=0$ e <code>Heuristics</code> $=0$ il solver è vicino all'algoritmo B&amp;B basato su LP degli appunti, e vediamo l'albero.

??? codice "Log di Gurobi: $G_1$, <code>Presolve=0</code>, <code>Cuts=0</code>, <code>Heuristics=0</code>"

    ```python
    01| Gurobi Optimizer version 13.0.3 build v13.0.3rc0 (linux64 - "Ubuntu 26.04 LTS")
    02| 
    03| CPU model: Intel(R) Core(TM) i5-14500T, instruction set [SSE2|AVX|AVX2]
    04| Thread count: 20 physical cores, 20 logical processors, using up to 1 threads
    05| 
    06| Non-default parameters:
    07| Heuristics  0
    08| Cuts  0
    09| LogToConsole  0
    10| Presolve  0
    11| Threads  1
    12| 
    13| Optimize a model with 10 rows, 30 columns and 300 nonzeros (Max)
    14| Model fingerprint: 0xb023d504
    15| Model has 30 linear objective coefficients
    16| Variable types: 0 continuous, 30 integer (0 binary)
    17| Coefficient statistics:
    18|   Matrix range     [1e+00, 2e+01]
    19|   Objective range  [5e+00, 2e+01]
    20|   Bounds range     [3e+00, 3e+00]
    21|   RHS range        [3e+02, 4e+02]
    22| 
    23| Variable types: 0 continuous, 30 integer (0 binary)
    24| 
    25| Root relaxation: objective 5.991749e+02, 13 iterations, 0.00 seconds (0.00 work units)
    26| 
    27|     Nodes    |    Current Node    |     Objective Bounds      |     Work
    28|  Expl Unexpl |  Obj  Depth IntInf | Incumbent    BestBd   Gap | It/Node Time
    29| 
    30|      0     0  599.17487    0    6          -  599.17487      -     -    0s
    31|      0     0  598.42295    0    6          -  598.42295      -     -    0s
    32|      0     2  598.42295    0    6          -  598.42295      -     -    0s
    33| *   33    22              31     584.0000000  597.70712  2.35%   1.6    0s
    34| *   73    18              12     593.0000000  597.40703  0.74%   1.7    0s
    35| 
    36| Explored 119 nodes (228 simplex iterations) in 0.00 seconds (0.00 work units)
    37| Thread count was 1 (of 20 available processors)
    38| 
    39| Solution count 2: 593 584
    40| 
    41| Optimal solution found (tolerance 1.00e-04)
    42| Best objective 5.930000000000e+02, best bound 5.930000000000e+02, gap 0.0000%
    ```

- **22–23** Nessuna riga di euristica e nessuna riga di presolve: non c'è ancora una soluzione incumbent.

- **30–32** Il bound della radice è $599.17487$ e scende a $598.42295$ prima del branching sulla radice; la colonna <code>Incumbent</code> contiene un trattino (<code>-</code>) perché non si conosce alcuna soluzione.

- **33–34** Due soluzioni incumbent sono trovate come soluzioni ottime intere dei problemi LP dei nodi (<code>\*</code>), ai nodi $33$ e $73$: valori $584$ e $593$.

- **36** Per dimostrare che $593$ è ottimo il solver esplora $119$ nodi ($228$ iterazioni), contro i $47$ nodi con i parametri predefiniti.

### 9.3.4 Il gap come criterio di arresto

- Ripetiamo l'esecuzione precedente con <code>MIPGap</code> $= 0.01$:

??? codice "Log di Gurobi: $G_1$, <code>Presolve=0</code>, <code>Cuts=0</code>, <code>Heuristics=0</code>, <code>MIPGap=0.01</code>"

    ```python
    01| Gurobi Optimizer version 13.0.3 build v13.0.3rc0 (linux64 - "Ubuntu 26.04 LTS")
    02| 
    03| CPU model: Intel(R) Core(TM) i5-14500T, instruction set [SSE2|AVX|AVX2]
    04| Thread count: 20 physical cores, 20 logical processors, using up to 1 threads
    05| 
    06| Non-default parameters:
    07| MIPGap  0.01
    08| Heuristics  0
    09| Cuts  0
    10| LogToConsole  0
    11| Presolve  0
    12| Threads  1
    13| 
    14| Optimize a model with 10 rows, 30 columns and 300 nonzeros (Max)
    15| Model fingerprint: 0xb023d504
    16| Model has 30 linear objective coefficients
    17| Variable types: 0 continuous, 30 integer (0 binary)
    18| Coefficient statistics:
    19|   Matrix range     [1e+00, 2e+01]
    20|   Objective range  [5e+00, 2e+01]
    21|   Bounds range     [3e+00, 3e+00]
    22|   RHS range        [3e+02, 4e+02]
    23| 
    24| Variable types: 0 continuous, 30 integer (0 binary)
    25| 
    26| Root relaxation: objective 5.991749e+02, 13 iterations, 0.00 seconds (0.00 work units)
    27| 
    28|     Nodes    |    Current Node    |     Objective Bounds      |     Work
    29|  Expl Unexpl |  Obj  Depth IntInf | Incumbent    BestBd   Gap | It/Node Time
    30| 
    31|      0     0  599.17487    0    6          -  599.17487      -     -    0s
    32|      0     0  598.42295    0    6          -  598.42295      -     -    0s
    33|      0     2  598.42295    0    6          -  598.42295      -     -    0s
    34| *   33    22              31     584.0000000  597.70712  2.35%   1.6    0s
    35| *   73    18              12     593.0000000  597.40703  0.74%   1.7    0s
    36| 
    37| Explored 74 nodes (138 simplex iterations) in 0.00 seconds (0.00 work units)
    38| Thread count was 1 (of 20 available processors)
    39| 
    40| Solution count 2: 593 584
    41| 
    42| Optimal solution found (tolerance 1.00e-02)
    43| Best objective 5.930000000000e+02, best bound 5.970000000000e+02, gap 0.6745%
    ```

- **34–35** Le stesse due soluzioni incumbent di prima, $584$ e $593$.

- **37** Il solver si ferma dopo $74$ nodi invece di $119$: con $\LB = 593$ il best bound è $597$ (il valore $597.40703$ dell'ultima riga dei nodi è arrotondato per difetto dal solver, poiché tutti i dati sono interi) e il gap è $\frac{597 - 593}{593} \approx 0.67\% < 1\%$.

- **42–43** Il solver scrive “<code>Optimal solution found (tolerance 1.00e-02)</code>” per il valore $593$.

- Il bound $597$ certifica solo che $593$ dista al più lo $0.67\%$ dall'ottimo. Qui la soluzione è in effetti ottima, ma il solver non può saperlo senza esplorare i $45$ nodi rimanenti.

### 9.3.5 Selezione della variabile di branching

- Con presolve, tagli ed euristiche disattivati, cambiamo solo <code>VarBranch</code>, su $G_1$ e su un secondo MIP generico $G_2$ (stessa costruzione, con $30$ variabili intere in $\{0,\dots,5\}$ e $8$ vincoli, $b_i = \lfloor 5 \sum_j a_{ij}/3 \rfloor$). La tabella riporta i nodi esplorati (tra parentesi le iterazioni del simplesso).

<div class="tabella" markdown="0"><table>
<tr>
<th><code>VarBranch</code></th>
<th><span class="arithmatex">\(G_1\)</span></th>
<th><span class="arithmatex">\(G_2\)</span></th>
</tr>
<tr>
<td><span class="arithmatex">\(-1\)</span> automatica</td>
<td><span class="arithmatex">\(119\)</span> (<span class="arithmatex">\(228\)</span>)</td>
<td><span class="arithmatex">\(566\)</span> (<span class="arithmatex">\(1144\)</span>)</td>
</tr>
<tr>
<td><span class="arithmatex">\(0\)</span> pseudo costo ridotto</td>
<td><span class="arithmatex">\(119\)</span> (<span class="arithmatex">\(228\)</span>)</td>
<td><span class="arithmatex">\(566\)</span> (<span class="arithmatex">\(1144\)</span>)</td>
</tr>
<tr>
<td><span class="arithmatex">\(1\)</span> pseudo prezzo ombra</td>
<td><span class="arithmatex">\(176\)</span> (<span class="arithmatex">\(313\)</span>)</td>
<td><span class="arithmatex">\(645\)</span> (<span class="arithmatex">\(1270\)</span>)</td>
</tr>
<tr>
<td><span class="arithmatex">\(2\)</span> massima inammissibilità</td>
<td><span class="arithmatex">\(223\)</span> (<span class="arithmatex">\(392\)</span>)</td>
<td><span class="arithmatex">\(527\)</span> (<span class="arithmatex">\(1097\)</span>)</td>
</tr>
<tr>
<td><span class="arithmatex">\(3\)</span> strong branching</td>
<td><span class="arithmatex">\(99\)</span> (<span class="arithmatex">\(184\)</span>)</td>
<td><span class="arithmatex">\(497\)</span> (<span class="arithmatex">\(934\)</span>)</td>
</tr>
</table></div>

- Su queste due istanze le differenze sono moderate: lo strong branching dà gli alberi più piccoli, e la regola della massima inammissibilità dà il più grande su $G_1$ e il secondo più piccolo su $G_2$.

- L'ordine delle regole cambia con l'istanza, quindi il comportamento di una regola è difficile da prevedere; la scelta automatica non è mai lontana dalla migliore.

- Lo strong branching richiede meno nodi, ma ogni nodo costa di più: il solo numero di nodi non misura il tempo di calcolo.

!!! chiave ""

    Leggere un log significa seguire i due bound: la colonna <code>Incumbent</code> è il lato primale (euristiche e nodi interi), la colonna <code>BestBd</code> il lato duale (rilassamento, presolve, tagli, branching).

## 9.4 Errori tipici

!!! attenzione "Attenzione"

    - <strong>Leggere “Optimal solution found” come una prova di ottimalità.</strong> La frase riporta la tolleranza in uso: con <code>MIPGap</code> $= 0.01$ la soluzione può distare l'$1\%$ dall'ottimo.

    - <strong>Scambiare i bound in un problema di minimizzazione.</strong> In un problema di minimizzazione <code>Incumbent</code> è l'upper bound e <code>BestBd</code> il lower bound.

    - <strong>Credere che l'albero spieghi tutto.</strong> Con i parametri predefiniti, la maggior parte del lavoro del solver avviene fuori dall'albero: nei nostri log il solo nodo radice risolve $P41$ e, su $G_1$, le euristiche e i tagli della radice danno la soluzione ottima e la maggior parte del bound.

    - <strong>Confrontare il numero di nodi tra esecuzioni diverse.</strong> I numeri dipendono dalla versione del solver, dal computer e dal seme; con altri parametri la stessa istanza può richiedere $47$ o $223$ nodi.

    - <strong>Aspettarsi che il solver segua le regole degli appunti.</strong> Le scelte del solver (tagli, euristiche, selezione dei nodi) non sono documentate nel dettaglio, e cambiano con la versione.

## 9.5 In sintesi

!!! chiave "In sintesi"

    - Un solver MIP è un algoritmo branch-and-cut circondato da presolve, tagli, euristiche primali, regole di branching e di selezione dei nodi.

    - Presolve e tagli alzano il lower bound (minimizzazione), le euristiche trovano la soluzione incumbent, il branching chiude il gap.

    - Il log mostra i bound: <code>Incumbent</code> è il lato primale, <code>BestBd</code> il lato duale, <code>Gap</code> la loro distanza relativa.

    - Il solver si ferma quando il gap scende sotto <code>MIPGap</code>: la soluzione è ottima solo a meno di quella tolleranza.

    - Disattivare i componenti mostra quanto lavoro fa risparmiare ciascuno di essi su una data istanza.

    <strong>Cruscotto del MIP generico $G_1$.</strong> Lower bound e upper bound su $z(\ILP) = 593$ nel log con i parametri predefiniti di questo capitolo:

    <div class="tabella" markdown="0"><table>
    <tr>
    <th>Fase</th>
    <th>Lower bound</th>
    <th>Upper bound</th>
    </tr>
    <tr>
    <td>Soluzione euristica prima della radice</td>
    <td><span class="arithmatex">\(429\)</span></td>
    <td>—</td>
    </tr>
    <tr>
    <td>Rilassamento lineare alla radice</td>
    <td><span class="arithmatex">\(429\)</span></td>
    <td><span class="arithmatex">\(599\)</span></td>
    </tr>
    <tr>
    <td>Nodo radice, euristiche e tagli</td>
    <td><span class="arithmatex">\(593\)</span></td>
    <td><span class="arithmatex">\(596\)</span></td>
    </tr>
    <tr>
    <td>Fine dell'albero</td>
    <td><span class="arithmatex">\(593\)</span></td>
    <td><span class="arithmatex">\(593\)</span></td>
    </tr>
    </table></div>

---

**Esercizi su questo capitolo:** [:material-pencil: Solver MIP](../esercizi/mip-solvers.md)
