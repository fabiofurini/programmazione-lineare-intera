---
title: "Esercizi · Solver MIP"
---

# Esercizi · Solver MIP

<div class="info-capitolo" markdown>

**Esercizi · Capitolo 9** · ogni soluzione si apre con un clic · [:material-book-open-variant: Capitolo 9: Risolutori MIP](../solvers/mip-solvers.md) · [:material-file-pdf-box: Esercizi, volume 3 (PDF)](../pdf/exercises-3-mip-solvers.pdf)

</div>

<a id="esercizio-9-1"></a>

!!! esercizio "Esercizio 9.1: Presolve: restringimento dei vincoli"
    !!! nota ""
        Considera il seguente problema ILP con $n=3$ variabili intere, ciascuna con i limiti $0 \le x_j \le 10$:

        $$
        \begin{array}{rrrrrrrrr}
        {\max} & {3}\, {x_1} & {+} & {2}\, {x_2} & {+} & {5}\, {x_3} \\[1.5ex]
        & {4}\, {x_1} & {+} & {3}\, {x_2} & {+} & {5}\, {x_3} & {\le} & {20} \\[1.5ex]
        & {-}{x_1} & {+} & {x_2} &  &  & {\le} & {-1} \\[1.5ex]
        &  &  & {-}{x_2} & {-} & {x_3} & {\le} & {-2} \\[1.5ex]
        & {x_1,} &  & {x_2,} &  & {x_3} & {\in} & {\Z_{\ge 0}}
        \end{array}
        $$

        I vincoli $x_1 - x_2 \ge 1$ e $x_2 + x_3 \ge 2$ sono scritti in forma canonica come il secondo e il terzo vincolo.

    **Domande**

    1. Applica il restringimento dei vincoli: per ogni vincolo $\sum_j a_{ij}\,x_j \le b_i$ e per ogni variabile $x_k$, usa $a_{ik}\,x_k \le b_i - \sum_{j \ne k} \min\{a_{ij}\,x_j\}$ (minimo sui limiti attuali), arrotonda agli interi e ripeti fino a quando non ci sono cambiamenti dei limiti.

    2. Controlla i nuovi limiti mediante enumerazione. Sono i più piccoli possibili?

    3. Confronta il valore ottimale del rilassamento LP prima e dopo il restringimento dei vincoli.

??? soluzione "Soluzione"

    1. Il minimo di $a_{ij}\,x_j$ è $a_{ij}$ volte il limite inferiore se $a_{ij} > 0$, e volte il limite superiore se $a_{ij} < 0$. All'interno di ogni turno i limiti vengono aggiornati non appena vengono trovati.

        - <strong>Round 1.</strong>

            - Vincolo 1: $4x_1 \le 20 - (0) \Rightarrow x_1 \le 5$, quindi $x_1 \le 5$ (era $10$).

            - Vincolo 1: $3x_2 \le 20 - (0) \Rightarrow x_2 \le \tfrac{20}{3}$, quindi $x_2 \le 6$ (era $10$).

            - Vincolo 1: $5x_3 \le 20 - (0) \Rightarrow x_3 \le 4$, quindi $x_3 \le 4$ (era $10$).

            - Vincolo 2: $-x_1 \le -1 - (0) \Rightarrow x_1 \ge 1$, quindi $x_1 \ge 1$ (era $0$).

            - Vincolo 2: $x_2 \le -1 - (-5) \Rightarrow x_2 \le 4$, quindi $x_2 \le 4$ (era $6$).

        - <strong>Round 2.</strong>

            - Vincolo 1: $5x_3 \le 20 - (4) \Rightarrow x_3 \le \tfrac{16}{5}$, quindi $x_3 \le 3$ (era $4$).

        - <strong>Round 3.</strong> Nessun cambiamento dei limiti: <code>STOP</code>.

        I limiti più stretti sono

        $$
        1 \le x_1 \le 5,\qquad 0 \le x_2 \le 4,\qquad 0 \le x_3 \le 3.
        $$

    2. Il problema ILP ha $6$ soluzioni ammissibili, e tutte soddisfano i nuovi vincoli: nessuna soluzione ammissibile è persa. Il valore più piccolo e quello più grande di ogni variabile sulle soluzioni ammissibili sono

        $$
        1 \le x_1 \le 3,\qquad 0 \le x_2 \le 2,\qquad 0 \le x_3 \le 3.
        $$

        I limiti propagati sono validi ma non tutti sono i più piccoli possibili: per esempio $x_1 = 5$ richiede $x_2 = x_3 = 0$ secondo il primo vincolo, il che viola $x_2 + x_3 \ge 2$. Il rafforzamento dei limiti esamina un vincolo alla volta.

    3. Il rilassamento LP con i vincoli originali ha valore ottimale $19$, e con i vincoli resi più stretti $\tfrac{75}{4}$. I dati sono interi, quindi il limite superiore passa da $19$ a $18$.

        !!! chiave ""
            L'irrigidimento dei vincoli fornisce $1 \le x_1 \le 5, 0 \le x_2 \le 4, 0 \le x_3 \le 3$ senza perdere alcuna soluzione ammissibile; il limite superiore passa da $19$ a $18$, uguale a $z(\ILP)$.

<a id="esercizio-9-2"></a>

!!! esercizio "Esercizio 9.2: Presolve: restringimento dei coefficienti"
    !!! nota ""
        Considera il vincolo con le variabili binarie $4$

        $$
        6\,x_1 + 5\,x_2 + 4\,x_3 + 3\,x_4 \le 10, \qquad x_1, \dots, x_4 \in \{0,1\},
        $$

        e la funzione obiettivo $\max~ x_1 + x_2 + x_3 + x_4$.

    **Domande**

    1. Applica il rafforzamento dei coefficienti ai coefficienti $a_1, \dots, a_4$, uno alla volta: il coefficiente $a_j$ può essere aumentato a $b - M_j$, dove $M_j$ è il valore più grande di $\sum_{k \ne j} a_k\,x_k$ sui punti binari con $x_j = 1$ che soddisfano il vincolo (attuale).

    2. Verifica che i due vincoli abbiano le stesse soluzioni binarie.

    3. Confronta i valori ottimali deli rilassamenti LP ($0 \le x_j \le 1$) dei due vincoli con il valore ottimale del problema binario.

??? soluzione "Soluzione"

    1. Aumentare $a_j$ a $b - M_j$ mantiene ogni soluzione binaria con $x_j = 1$ (il suo lato sinistro è al massimo $b - M_j + M_j = b$) e non cambia i punti con $x_j = 0$.

        - $a_1$: con $x_1 = 1$ il punto migliore è $(1,0,1,0)$, quindi $M_1 = 4$ e $b - M_1 = 6$: $a_1 = 6$ non cambia.

        - $a_2$: con $x_2 = 1$ il punto migliore è $(0,1,1,0)$, quindi $M_2 = 4$ e $a_2$ vengono aumentati da $5$ a $10 - 4 = 6$.

        - $a_3$: con $x_3 = 1$ il punto migliore è $(1,0,1,0)$, quindi $M_3 = 6$ e $b - M_3 = 4$: $a_3 = 4$ non cambia.

        - $a_4$: con $x_4 = 1$ il punto migliore è $(1,0,0,1)$, quindi $M_4 = 6$ e $a_4$ vengono aumentati da $3$ a $10 - 6 = 4$.

        Il vincolo rafforzato è

        $$
        6\,x_1 + 6\,x_2 + 4\,x_3 + 4\,x_4 \le 10.
        $$

    2. Entrambi i vincoli sono soddisfatti dagli stessi $10$ punti binari (dei $2^4 = 16$ possibili), ossia $(0,0,0,0)$, $(0,0,0,1)$, $(0,0,1,0)$, $(0,0,1,1)$, $(0,1,0,0)$, $(0,1,0,1)$, $(0,1,1,0)$, $(1,0,0,0)$, $(1,0,0,1)$, $(1,0,1,0)$.

    3. Il rilassamento LP del vincolo originale ha come soluzione ottimale $(0,\tfrac{3}{5},1,1)$ con valore $\dfrac{13}{5}$; il rilassamento LP del vincolo rafforzato ha come soluzione ottimale $(\tfrac{1}{3},0,1,1)$ con valore $\dfrac{7}{3}$. Il problema binario ha valore ottimale $2$.

        !!! chiave ""
            Il restringimento dei coefficienti trasforma $6\,x_1 + 5\,x_2 + 4\,x_3 + 3\,x_4 \le 10$ in $6\,x_1 + 6\,x_2 + 4\,x_3 + 4\,x_4 \le 10$: stesse soluzioni binarie, stessa dimensione, e il limite LP migliora da $\dfrac{13}{5}$ a $\dfrac{7}{3}$ (il valore ottimale è $2$).

<a id="esercizio-9-3"></a>

!!! esercizio "Esercizio 9.3: Lettura di un registro del risolutore"
    ??? codice "Codice"

        Gurobi risolve un problema ILP generico con $n = 10$ variabili intere $x_j \in \{0,\dots,3\}$ e $m = 3$ vincoli, $\max~ \vet c\T\vet x$ soggetti a $\boldsymbol A\,\vet x \le \vet b$, con dati pseudo-casuali interi (Python <code>random.Random(4)</code>): $a_{ij}$ uniforme in $\{1,\dots,20\}$, $c_j$ uniforme in $\{5,\dots,25\}$, e $b_i = \lfloor 3 \sum_j a_{ij} / 3 \rfloor$, con <code>Presolve</code> $=0$, <code>Cuts</code> $=0$ e <code>Heuristics</code> $=0$ (<code>Threads</code> $=1$, <code>Seed</code> $=0$). Il log è:

        ??? codice "Gurobi log: problema ILP generico, presolve, tagli e euristiche disattivati"

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
            13| Optimize a model with 3 rows, 10 columns and 30 nonzeros (Max)
            14| Model fingerprint: 0x92726b84
            15| Model has 10 linear objective coefficients
            16| Variable types: 0 continuous, 10 integer (0 binary)
            17| Coefficient statistics:
            18|   Matrix range     [1e+00, 2e+01]
            19|   Objective range  [7e+00, 2e+01]
            20|   Bounds range     [3e+00, 3e+00]
            21|   RHS range        [8e+01, 1e+02]
            22|
            23| Variable types: 0 continuous, 10 integer (0 binary)
            24|
            25| Root relaxation: objective 2.296103e+02, 4 iterations, 0.00 seconds (0.00 work units)
            26|
            27|     Nodes    |    Current Node    |     Objective Bounds      |     Work
            28|  Expl Unexpl |  Obj  Depth IntInf | Incumbent    BestBd   Gap | It/Node Time
            29|
            30|      0     0  229.61033    0    3          -  229.61033      -     -    0s
            31|      0     0  229.30837    0    3          -  229.30837      -     -    0s
            32|      0     2  229.30837    0    3          -  229.30837      -     -    0s
            33| *   12     6               9     220.0000000  224.56863  2.08%   1.2    0s
            34| *   22     3               6     221.0000000  224.53846  1.60%   1.0    0s
            35| *   23     1               5     223.0000000  224.53846  0.69%   1.0    0s
            36|
            37| Explored 25 nodes (30 simplex iterations) in 0.00 seconds (0.00 work units)
            38| Thread count was 1 (of 20 available processors)
            39|
            40| Solution count 3: 223 221 220
            41|
            42| Optimal solution found (tolerance 1.00e-04)
            43| Best objective 2.230000000000e+02, best bound 2.230000000000e+02, gap 0.0000%
            ```

    **Domande**

    1. Il problema è un problema di massimizzazione o di minimizzazione? Quante variabili e vincoli ha?

    2. Quale riga fornisce il limite del rilassamento LP del nodo radice? Quale valore di $\UB$ fornisce?

    3. Quali righe riportano nuove soluzioni incumbent e come vengono trovate? Fornisci il limite inferiore $\LB$ dopo ciascuna di esse.

    4. Ricalcola il gap della linea 33.

    5. Quanti nodi vengono esplorati? La soluzione finale è certificata come ottimale?

??? soluzione "Soluzione"

    1. Riga 13: <code>(Max)</code>, quindi è un problema di <strong>massimizzazione</strong>, con $3$ righe (vincoli) e $10$ colonne (variabili), tutte intere e non binarie.

    2. Riga 25: il rilassamento radice ha valore ottimale $229.61033$ (esattamente $z(\LP) = \dfrac{48907}{213}$). I dati sono interi, quindi $\UB = \lfloor \dfrac{48907}{213} \rfloor = 229$. La colonna <code>BestBd</code> della riga 30 riporta lo stesso valore; a quel punto non esiste alcun incumbent (il trattino in <code>Incumbent</code>).

    3. - Riga 33 (nodo 12): $\LB = 220$.

        - Riga 34 (nodo 22): $\LB = 221$.

        - Riga 35 (nodo 23): $\LB = 223$.

        Le tre righe iniziano con <code>\*</code>: ogni soluzione vigente è la soluzione ottimale intera del problema LP di un nodo (potatura per interezza); le euristiche sono disattivate, quindi nessuna riga inizia con <code>H</code>.

    4. Nella riga 33 abbiamo <code>Incumbent</code> $= 220$ e <code>BestBd</code> $= 224.569$, quindi

        $$
        \text{gap} = \frac{|224.569 - 220|}{220} \approx 2.08\%,
        $$

        come nella colonna <code>Gap</code> ($2.08\%$).

    5. Linea 37: i nodi $25$ sono esplorati, con $30$ iterazioni del simplesso. Linea 42: la soluzione di valore $223$ è ottimale con la tolleranza predefinita $10^{-4}$; l'ultima linea riporta il miglior limite $223$ e il gap $0$.

        !!! chiave ""
            $\LB$ cresce da $220$ a $223$ con soluzioni nodali intere, mentre $\UB$ diminuisce da $229$ a $223$ tramite ramificazione: dopo $25$ nodi $\LB = \UB = 223$ e la soluzione è <strong>certificata ottimale</strong>.

<a id="esercizio-9-4"></a>

!!! esercizio "Esercizio 9.4: Lettura del registro di un risolutore: un problema di minimizzazione"
    ??? codice "Codice"

        Gurobi risolve un problema ILP generico con $n = 12$ variabili intere $x_j \in \{0,\dots,3\}$ e $m = 4$ vincoli, $\min~ \vet c\T\vet x$ soggetti a $\boldsymbol A\,\vet x \ge \vet b$, con dati pseudo-casuali interi (Python <code>random.Random(3)</code>): $a_{ij}$ uniforme in $\{1,\dots,20\}$, $c_j$ uniforme in $\{5,\dots,25\}$, e $b_i = \lfloor \tfrac{2}{5} \cdot 3 \sum_j a_{ij} / 3 \rfloor$, con i parametri predefiniti (<code>Threads</code> $=1$, <code>Seed</code> $=0$). Il registro è:

        ??? codice "Gurobi log: problema di minimizzazione generico, parametri predefiniti"

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
            10| Optimize a model with 4 rows, 12 columns and 48 nonzeros (Min)
            11| Model fingerprint: 0x33d6ab84
            12| Model has 12 linear objective coefficients
            13| Variable types: 0 continuous, 12 integer (0 binary)
            14| Coefficient statistics:
            15|   Matrix range     [1e+00, 2e+01]
            16|   Objective range  [1e+01, 2e+01]
            17|   Bounds range     [3e+00, 3e+00]
            18|   RHS range        [5e+01, 6e+01]
            19|
            20| Found heuristic solution: objective 161.0000000
            21| Presolve time: 0.00s
            22| Presolved: 4 rows, 12 columns, 48 nonzeros
            23| Variable types: 0 continuous, 12 integer (0 binary)
            24|
            25| Root relaxation: objective 6.192991e+01, 5 iterations, 0.00 seconds (0.00 work units)
            26|
            27|     Nodes    |    Current Node    |     Objective Bounds      |     Work
            28|  Expl Unexpl |  Obj  Depth IntInf | Incumbent    BestBd   Gap | It/Node Time
            29|
            30|      0     0   61.92991    0    3  161.00000   61.92991  61.5%     -    0s
            31| H    0     0                      90.0000000   61.92991  31.2%     -    0s
            32| H    0     0                      83.0000000   61.92991  25.4%     -    0s
            33| H    0     0                      67.0000000   61.92991  7.57%     -    0s
            34|      0     0     cutoff    0        67.00000   67.00000  0.00%     -    0s
            35|
            36| Cutting planes:
            37|   Gomory: 1
            38|
            39| Explored 1 nodes (9 simplex iterations) in 0.00 seconds (0.00 work units)
            40| Thread count was 1 (of 20 available processors)
            41|
            42| Solution count 4: 67 83 90 161
            43|
            44| Optimal solution found (tolerance 1.00e-04)
            45| Best objective 6.700000000000e+01, best bound 6.700000000000e+01, gap 0.0000%
            ```

    **Domande**

    1. In questo problema di minimizzazione, quale colonna fornisce il limite superiore e quale quello inferiore?

    2. Cosa succede nelle righe 20, 22 e 25? Fornisci i limiti dopo la riga 25, usando che i dati sono interi.

    3. Ricalcola il gap della linea 33.

    4. Spiega le righe 34 e 37. Perché il problema è risolto nel nodo radice?

??? soluzione "Soluzione"

    1. In un problema di minimizzazione i ruoli sono invertiti: <code>Incumbent</code> è il valore della migliore soluzione ammissibile, un <strong>limite superiore</strong> $\UB$ sul valore ottimale, e <code>BestBd</code> è un <strong>limite inferiore</strong> $\LB$.

    2. - Riga 20: un’euristica trova una soluzione ammissibile di valore $161$ prima del presolve, quindi $\UB = 161$.

        - Riga 22: il presolve non riduce il modello (righe $4$, colonne $12$).

        - Riga 25: il rilassamento LP del nodo radice ha valore $61.92991$ (esattamente $\dfrac{13253}{214}$). La funzione obiettivo assume valori interi, quindi $\LB = \lceil \dfrac{13253}{214} \rceil = 62$, e $62 \le z(\ILP) \le 161$.

    3. Alla riga 33, <code>Incumbent</code> $= 67$ e <code>BestBd</code> $= 61.9299$:

        $$
        \text{gap} = \frac{|61.9299 - 67|}{67} \approx 7.57\%,
        $$

        come nella colonna <code>Gap</code>. Il gap è diviso per il valore corrente, come nella definizione del gap di ottimalità.

    4. Le righe che iniziano con <code>H</code> sono nuove soluzioni incumbent trovate dagli euristici alla radice, $90$, $83$ e $67$. Nella riga 34 il nodo radice viene chiuso (<code>cutoff</code>): dopo il ciclo dei tagli il miglior limite raggiunge $67$, il valore dell'incumbent. Riga 37: viene aggiunto un taglio di Gomory.

        !!! chiave ""
            Le euristiche abbassano $\UB$ da $161$ a $67$, il rilassamento LP e un taglio di Gomory alzano $\LB$ da $62$ a $67$: $\LB = \UB = 67$ alla radice, e il risolutore esplora un singolo nodo.

<a id="esercizio-9-5"></a>

!!! esercizio "Esercizio 9.5: Il gap come criterio di arresto"
    ??? codice "Codice"

        Gurobi risolve il problema ILP generico dell'esercizio «Reading a solver log» (un problema ILP generico con $n = 10$ variabili intere $x_j \in \{0,\dots,3\}$ e $m = 3$ vincoli, $\max~ \vet c\T\vet x$ soggetto a $\boldsymbol A\,\vet x \le \vet b$, con dati pseudo-casuali interi (Python <code>random.Random(4)</code>): $a_{ij}$ uniformi in $\{1,\dots,20\}$, $c_j$ uniformi in $\{5,\dots,25\}$, e $b_i = \lfloor 3 \sum_j a_{ij} / 3 \rfloor$) con gli stessi parametri e, inoltre, <code>MIPGap</code> $= 0.02$. Il log è:

        ??? codice "Gurobi log: la stessa istanza con <code>MIPGap=0.02</code>"

            ```python
            01| Gurobi Optimizer version 13.0.3 build v13.0.3rc0 (linux64 - "Ubuntu 26.04 LTS")
            02|
            03| CPU model: Intel(R) Core(TM) i5-14500T, instruction set [SSE2|AVX|AVX2]
            04| Thread count: 20 physical cores, 20 logical processors, using up to 1 threads
            05|
            06| Non-default parameters:
            07| MIPGap  0.02
            08| Heuristics  0
            09| Cuts  0
            10| LogToConsole  0
            11| Presolve  0
            12| Threads  1
            13|
            14| Optimize a model with 3 rows, 10 columns and 30 nonzeros (Max)
            15| Model fingerprint: 0x92726b84
            16| Model has 10 linear objective coefficients
            17| Variable types: 0 continuous, 10 integer (0 binary)
            18| Coefficient statistics:
            19|   Matrix range     [1e+00, 2e+01]
            20|   Objective range  [7e+00, 2e+01]
            21|   Bounds range     [3e+00, 3e+00]
            22|   RHS range        [8e+01, 1e+02]
            23|
            24| Variable types: 0 continuous, 10 integer (0 binary)
            25|
            26| Root relaxation: objective 2.296103e+02, 4 iterations, 0.00 seconds (0.00 work units)
            27|
            28|     Nodes    |    Current Node    |     Objective Bounds      |     Work
            29|  Expl Unexpl |  Obj  Depth IntInf | Incumbent    BestBd   Gap | It/Node Time
            30|
            31|      0     0  229.61033    0    3          -  229.61033      -     -    0s
            32|      0     0  229.30837    0    3          -  229.30837      -     -    0s
            33|      0     2  229.30837    0    3          -  229.30837      -     -    0s
            34| *   12     6               9     220.0000000  224.56863  2.08%   1.2    0s
            35|
            36| Explored 13 nodes (18 simplex iterations) in 0.00 seconds (0.00 work units)
            37| Thread count was 1 (of 20 available processors)
            38|
            39| Solution count 1: 220
            40|
            41| Optimal solution found (tolerance 2.00e-02)
            42| Best objective 2.200000000000e+02, best bound 2.240000000000e+02, gap 1.8182%
            ```

    **Domande**

    1. Perché il risolutore si ferma? Ricalcola il gap finale dall'ultima riga.

    2. Cosa garantisce la frase alla riga 41 riguardo alla soluzione del valore $220$?

    3. Con il <code>MIPGap</code> predefinito, il valore ottimale di questa istanza è $223$. Questo è coerente con il log?

??? soluzione "Soluzione"

    1. Linea 42: miglior obiettivo $220$ e miglior limite $224$. Il valore $224.569$ di <code>BestBd</code> nella linea 34 è arrotondato per difetto dal risolutore, poiché tutti i dati sono interi. Il gap finale è

        $$
        \frac{224 - 220}{220} \approx 1.82\% < 2\%,
        $$

        sotto <code>MIPGap</code>: il risolutore si ferma dopo $13$ nodi (linea 36) invece di $25$.

    2. Garantisce solo che $220 \le z(\ILP) \le 224$: la soluzione è entro $2\%$ dell'ottimo, <strong>non</strong> che sia ottimale. Il risolutore scrive «Soluzione ottimale trovata» con la tolleranza in uso, qui $2 \cdot 10^{-2}$.

    3. Sì: $223$ si trova nell'intervallo $[220, 224]$ dato dai due limiti. La soluzione attuale è di $3$ unità, circa $1.35\%$, al di sotto dell'ottimo, e sarebbero necessari i nodi rimanenti per trovarla e dimostrarla.

        !!! chiave ""
            Con <code>MIPGap</code> $=0.02$ il risolutore si ferma con $\LB = 220$ e $\UB = 224$: la soluzione è certificata solo entro $2\%$, e in effetti non è <strong>ottimale</strong> ($z(\ILP) = 223$).
