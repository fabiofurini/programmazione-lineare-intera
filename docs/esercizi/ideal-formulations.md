---
title: "Esercizi · Formulazioni ideali"
---

# Esercizi · Formulazioni ideali

<div class="info-capitolo" markdown>

**Esercizi · Capitolo 3** · ogni soluzione si apre con un clic · [:material-book-open-variant: Capitolo 3: Formulazioni ideali](../formulazioni/ideal-formulations.md) · [:material-file-pdf-box: Eserciziario, volume 1 (PDF)](../pdf/esercizi-1-modelli-bound-formulazioni.pdf)

</div>

<a id="esercizio-3-1"></a>

!!! esercizio "Esercizio 3.1: Inviluppo convesso e formulazione ideale (P8)"

    !!! nota ""

        Si consideri il seguente problema PLI in forma canonica di massimizzazione con $n=2$ variabili intere e $m=2$ vincoli:

        $$
        \begin{array}{rrrrrrr}
        {\max} & {x_1} & {+} & {2}\, {x_2} \\[1.5ex]
        & {-}{x_1} & {+} & {2}\, {x_2} & {\le} & {2} \\[1.5ex]
        & {x_1} & {+} & {x_2} & {\le} & {3} \\[1.5ex]
        & {x_1,} &  & {x_2} & {\in} & {\Z_{\ge 0}}
        \end{array}
        $$

    **Domande**

    1. Elencare le soluzioni ammissibili e calcolare l'inviluppo convesso $\mathrm{conv}(F)$ della regione ammissibile. Classificare le soluzioni ammissibili in vertici, punti del bordo e punti interni dell'inviluppo.

    2. Descrivere $\mathrm{conv}(F)$ con disuguaglianze lineari e scrivere la formulazione ideale corrispondente.

    3. Risolvere il rilassamento lineare della formulazione data e il problema LP sulla formulazione ideale, e confrontare i due upper bound.

??? soluzione "Soluzione"

    1. Per $x_2 = 0$ i vincoli danno $x_1 \le 3$, per $x_2 = 1$ danno $x_1 \le 2$, e per $x_2 = 2$ richiedono $x_1 \ge 2$ e $x_1 \le 1$. La regione ammissibile ha i $7$ punti

        $$
        (0,0), \quad (1,0), \quad (2,0), \quad (3,0), \quad (0,1), \quad (1,1), \quad (2,1).
        $$

        Graficamente:

        ![Figura 1](../img/es-03-ideal-formulations/fig01.svg){ .fig .ovale loading=lazy  }

        <em>Il poliedro della formulazione (rosso) e l'inviluppo convesso dei punti interi (verde): i vertici dell'inviluppo sono i quadrati neri, gli altri punti interi i punti neri.</em>

        L'inviluppo convesso $\mathrm{conv}(F)$ è il quadrilatero con

        - i $4$ <strong>vertici</strong> $(0,0)$, $(3,0)$, $(0,1)$, $(2,1)$;

        - $3$ punti sul bordo, $(1,0)$, $(2,0)$, $(1,1)$;

        - nessun punto all'interno.

    2. I lati dell'inviluppo stanno sulle rette

        $$
        x_1 + x_2 = 3,\qquad x_2 = 1,
        $$

        insieme agli assi $x_1 = 0$ e $x_2 = 0$. La formulazione ideale è quindi

        $$
        \begin{array}{rrrrrrr}
        {\max} & {x_1} & {+} & {2}\, {x_2} \\[1.5ex]
        & {x_1} & {+} & {x_2} & {\le} & {3} \\[1.5ex]
        &  &  & {x_2} & {\le} & {1} \\[1.5ex]
        & {x_1,} &  & {x_2} & {\ge} & {0}
        \end{array}
        $$

        I suoi punti interi sono gli stessi $7$ punti di $F$, e il suo poliedro ha solo vertici interi.

    3. Per la formulazione data il vertice ottimo è l'intersezione delle rette dei vincoli 1 e 2:

        $$
        \begin{cases}
        -x_1 + 2\,x_2 = 2 \\
        x_1 + x_2 = 3
        \end{cases}
        \qquad\Longrightarrow\qquad x_1 = \dfrac{4}{3}, \quad x_2 = \dfrac{5}{3}
        $$

        con $z(\LP) = \dfrac{14}{3}$ e il bound $\lfloor z(\LP) \rfloor = 4$. Sulla formulazione ideale il vertice ottimo è il punto intero $(2,1)$, di valore $4$.

        !!! chiave ""

            Il problema LP sulla formulazione ideale dà $z = 4 = z(\ILP)$ nel vertice intero $(2,1)$; la formulazione data dà solo il bound $z(\LP) = \dfrac{14}{3}$, arrotondato per difetto a $4$.

<a id="esercizio-3-2"></a>

!!! esercizio "Esercizio 3.2: Formulazione ideale (P3)"

    !!! nota ""

        Si consideri il seguente problema PLI in forma canonica di massimizzazione con $n=2$ variabili intere e $m=2$ vincoli:

        $$
        \begin{array}{rrrrrrr}
        {\max} & {2}\, {x_1} & {+} & {4}\, {x_2} \\[1.5ex]
        & {-}{x_1} & {+} & {x_2} & {\le} & {2} \\[1.5ex]
        & {8}\, {x_1} & {+} & {2}\, {x_2} & {\le} & {19} \\[1.5ex]
        & {x_1,} &  & {x_2} & {\in} & {\Z_{\ge 0}}
        \end{array}
        $$

    **Domande**

    1. Calcolare l'inviluppo convesso $\mathrm{conv}(F)$ della regione ammissibile e classificare le soluzioni ammissibili in vertici, punti del bordo e punti interni.

    2. Scrivere una formulazione ideale del problema PLI.

    3. La soluzione ottima del rilassamento lineare della formulazione data è $\tilde{\vet x}(\LP) = (\tfrac{3}{2},\tfrac{7}{2})$. Mostrare che non appartiene a $\mathrm{conv}(F)$, e concludere che la formulazione data non è ideale.

    4. Confrontare gli upper bound delle due formulazioni.

??? soluzione "Soluzione"

    1. La regione ammissibile ha $9$ punti. Graficamente:

        ![Figura 2](../img/es-03-ideal-formulations/fig02.svg){ .fig .ovale loading=lazy  }

        <em>Il poliedro della formulazione data (rosso), l'inviluppo convesso dei punti interi (verde) con i suoi vertici (quadrati neri), e la soluzione ottima del rilassamento lineare (blu), fuori dall'inviluppo.</em>

        L'inviluppo convesso $\mathrm{conv}(F)$ è un poligono con

        - i $5$ <strong>vertici</strong> $(0,0)$, $(2,0)$, $(2,1)$, $(0,2)$, $(1,3)$;

        - $2$ punti sul bordo, $(1,0)$, $(0,1)$;

        - $2$ punti all'interno, $(1,1)$, $(1,2)$.

    2. I lati dell'inviluppo stanno sulle rette $x_1 = 2$, $2\,x_1 + x_2 = 5$, $-x_1 + x_2 = 2$ e sugli assi. La formulazione ideale è

        $$
        \begin{array}{rrrrrrr}
        {\max} & {2}\, {x_1} & {+} & {4}\, {x_2} \\[1.5ex]
        & {x_1} &  &  & {\le} & {2} \\[1.5ex]
        & {2}\, {x_1} & {+} & {x_2} & {\le} & {5} \\[1.5ex]
        & {-}{x_1} & {+} & {x_2} & {\le} & {2} \\[1.5ex]
        & {x_1,} &  & {x_2} & {\ge} & {0}
        \end{array}
        $$

    3. Il punto $(\tfrac{3}{2},\tfrac{7}{2})$ viola la disuguaglianza $2\,x_1 + x_2 \le 5$ dell'inviluppo: $2 \cdot \tfrac{3}{2} + 1 \cdot \tfrac{7}{2} = \tfrac{13}{2} > 5$. Ogni punto di $\mathrm{conv}(F)$ soddisfa questa disuguaglianza, quindi $\tilde{\vet x}(\LP) \notin \mathrm{conv}(F)$ e $\mathrm{conv}(F) \subsetneq P$: la formulazione data <strong>non è ideale</strong>.

    4. La formulazione data dà $z(\LP) = 17$, quindi $z(\ILP) \le 17$. La formulazione ideale ha il vertice ottimo $(1,3)$, di valore $14$.

        !!! chiave ""

            La formulazione ideale dà il valore esatto $z(\ILP) = 14$, raggiunto nel vertice intero $(1,3)$; la formulazione data dà il bound più debole $17$.

<a id="esercizio-3-3"></a>

!!! esercizio "Esercizio 3.3: Confronto tra formulazioni (P23)"

    !!! nota ""

        Si consideri il problema PLI in forma canonica di massimizzazione

        $$
        \begin{array}{rrrrrrr}
        {\max} & {x_1} & {+} & {4}\, {x_2} \\[1.5ex]
        & {3}\, {x_1} & {+} & {8}\, {x_2} & {\le} & {24} \\[1.5ex]
        & {-}{x_1} &  &  & {\le} & {-1} \\[1.5ex]
        &  &  & {-}{x_2} & {\le} & {-1} \\[1.5ex]
        & {x_1,} &  & {x_2} & {\in} & {\Z_{\ge 0}}
        \end{array}
        $$

        e i due poliedri (entrambi con $x_1, x_2 \ge 0$)

        $$
        \begin{aligned}
        P_A &= \{\, 3\,x_1 + 8\,x_2 \le 24,~ x_1 \ge 1,~ x_2 \ge 1 \,\}, \\
        P_B &= \{\, x_1 + 3\,x_2 \le 8,~ x_1 \le 5,~ x_1 \ge 1,~ x_2 \ge 1 \,\}.
        \end{aligned}
        $$

    **Domande**

    1. Mostrare che $P_A$ e $P_B$ sono due formulazioni dello stesso problema PLI.

    2. Calcolare i vertici di $P_A$ e $P_B$, e stabilire quale formulazione è più forte.

    3. Confrontare gli upper bound dati dai rilassamenti lineari delle due formulazioni.

    4. $P_B$ è una formulazione ideale?

??? soluzione "Soluzione"

    1. In entrambi i poliedri $x_1 \ge 1$ e $x_2 \ge 1$. In $P_A$, $x_2 = 1$ dà $3\,x_1 \le 16$, cioè $x_1 \le 5$, e $x_2 = 2$ dà $x_1 \le 2$; $x_2 \ge 3$ è impossibile. In $P_B$, $x_2 = 1$ dà $x_1 \le 5$, e $x_2 = 2$ dà $x_1 \le 2$; $x_2 \ge 3$ è impossibile. Entrambi contengono esattamente i $7$ punti interi

        $$
        (1,1), \quad (2,1), \quad (3,1), \quad (4,1), \quad (5,1), \quad (1,2), \quad (2,2),
        $$

        quindi $P_A \cap \Z^2 = P_B \cap \Z^2 = F$.

    2. I vertici sono

        $$
        P_A:~ (1,1),~ (1,\tfrac{21}{8}),~ (\tfrac{16}{3},1), \qquad P_B:~ (1,1),~ (1,\tfrac{7}{3}),~ (5,1).
        $$

        Ogni vertice di $P_B$ soddisfa i vincoli di $P_A$, quindi $P_B \subseteq P_A$ (entrambi sono convessi). Il vertice $(1,\tfrac{21}{8})$ di $P_A$ viola $x_1 + 3\,x_2 \le 8~~(1 \cdot 1 + 3 \cdot \tfrac{21}{8} = \tfrac{71}{8} > 8)$, quindi $P_B \subsetneq P_A$: <strong>$P_B$ è più forte</strong>.

        Graficamente:

        ![Figura 3](../img/es-03-ideal-formulations/fig03.svg){ .fig .ovale loading=lazy  }

        <em>La formulazione $P_A$ (rosso), la formulazione $P_B$ (blu, tratteggiata) e l'inviluppo convesso dei punti interi (verde), con i suoi vertici (quadrati neri).</em>

    3. I rilassamenti lineari danno $\tilde{\vet x} = (1,\tfrac{21}{8})$ con $z = \dfrac{23}{2}$ su $P_A$, e $\tilde{\vet x} = (1,\tfrac{7}{3})$ con $z = \dfrac{31}{3}$ su $P_B$. I bound arrotondati sono $11$ e $10$. Il punto ammissibile $(2,2)$ ha valore $10$, quindi $P_B$ ne certifica l'ottimalità, mentre $P_A$ lascia un gap.

    4. No: il vertice $(1,\tfrac{7}{3})$ di $P_B$ è frazionario. L'inviluppo convesso ha i vertici $(1,1)$, $(5,1)$, $(2,2)$, $(1,2)$ e i lati su $x_2 \ge 1$, $x_1 + 3\,x_2 \le 8$, $x_2 \le 2$, $x_1 \ge 1$.

        !!! chiave ""

            $P_B \subsetneq P_A$: la formulazione $P_B$ è più forte e il suo bound $\lfloor \dfrac{31}{3} \rfloor = 10$ certifica $z(\ILP) = 10$, ma non è ideale.

<a id="esercizio-3-4"></a>

!!! esercizio "Esercizio 3.4: Riconoscere una formulazione ideale"

    !!! nota ""

        Si considerino i tre poliedri (tutti con $x_1, x_2 \ge 0$)

        $$
        \begin{aligned}
        P_C &= \{\, x_1 + x_2 \le 3,~ x_1 \le 2 \,\}, \\
        P_D &= \{\, x_1 + 4\,x_2 \le 12,~ 2\,x_1 + x_2 \le 5 \,\}, \\
        P_E &= \{\, x_1 + x_2 \le 3,~ 2\,x_1 + x_2 \le 5 \,\}.
        \end{aligned}
        $$

    **Domande**

    1. Mostrare che $P_C$, $P_D$ e $P_E$ contengono gli stessi punti interi, e quindi sono formulazioni dello stesso problema PLI.

    2. Calcolare i vertici dei tre poliedri. Quale formulazione è ideale? Ordinare le formulazioni dalla più forte alla più debole.

    3. Con la funzione obiettivo $x_1 + 5\,x_2$, il problema LP su $P_D$ ha una soluzione ottima intera. Questo dimostra che $P_D$ è ideale? Usare la funzione obiettivo $x_1 + x_2$ per rispondere.

??? soluzione "Soluzione"

    1. Un punto intero di uno qualsiasi dei tre poliedri ha $x_1 \le 2$ ($x_1 \le 2$ in $P_C$, $2\,x_1 \le 5$ in $P_D$ e $P_E$). Per $x_1 = 0, 1, 2$ il massimo valore intero di $x_2$ è

        $$
        \begin{aligned}
        P_C&:~ 3 - x_1 = 3,~ 2,~ 1, \\
        P_D&:~ \min\{\lfloor (12 - x_1)/4 \rfloor,~ 5 - 2\,x_1\} = 3,~ 2,~ 1, \\
        P_E&:~ \min\{3 - x_1,~ 5 - 2\,x_1\} = 3,~ 2,~ 1.
        \end{aligned}
        $$

        Le tre formulazioni hanno gli stessi $9$ punti interi

        $$
        (0,0), \quad (0,1), \quad (0,2), \quad (0,3), \quad (1,0), \quad (1,1), \quad (1,2), \quad (2,0), \quad (2,1).
        $$

    2. I vertici sono

        $$
        \begin{aligned}
        P_C&:~ (0,0),~ (0,3),~ (2,0),~ (2,1) \\
        P_D&:~ (0,0),~ (0,3),~ (\tfrac{8}{7},\tfrac{19}{7}),~ (\tfrac{5}{2},0) \\
        P_E&:~ (0,0),~ (0,3),~ (2,1),~ (\tfrac{5}{2},0)
        \end{aligned}
        $$

        Solo $P_C$ ha tutti i vertici interi: $P_C = \mathrm{conv}(F)$ è la formulazione <strong>ideale</strong>. Ogni vertice di $P_C$ appartiene a $P_E$ e ogni vertice di $P_E$ appartiene a $P_D$, quindi

        $$
        \mathrm{conv}(F) = P_C ~\subsetneq~ P_E ~\subsetneq~ P_D,
        $$

        e l'ordine dalla formulazione più forte alla più debole è $P_C$, $P_E$, $P_D$. Graficamente:

        ![Figura 4](../img/es-03-ideal-formulations/fig04.svg){ .fig .ovale loading=lazy  }

        <em>Le formulazioni $P_D$ (rosso), $P_E$ (blu, tratteggiata) e $P_C$ (verde), i $9$ punti interi (neri), e la soluzione ottima $(\frac{8}{7},\frac{19}{7})$ del problema LP su $P_D$ con l'obiettivo $x_1 + x_2$ (blu), con la sua retta obiettivo (tratteggiata).</em>

    3. Con $x_1 + 5\,x_2$ il vertice ottimo di $P_D$ è $(0,3)$, di valore $15$: è intero. Con $x_1 + x_2$, invece, il vertice ottimo di $P_D$ è $(\tfrac{8}{7},\tfrac{19}{7})$, di valore $\dfrac{27}{7}$, mentre il miglior punto intero ha valore $3$.

        !!! chiave ""

            Un ottimo LP intero per una funzione obiettivo <strong>non</strong> dimostra che una formulazione è ideale: $P_D$ ha il vertice frazionario $(\frac{8}{7},\frac{19}{7})$, ottimo per $x_1 + x_2$. Solo $P_C$ dà un vertice ottimo intero per ogni funzione obiettivo.

<a id="esercizio-3-5"></a>

!!! esercizio "Esercizio 3.5: Una formulazione ideale in tre dimensioni (P43)"

    !!! nota ""

        Si consideri il seguente problema PLI in forma canonica di massimizzazione con $n=3$ variabili intere e $m=2$ vincoli:

        $$
        \begin{array}{rrrrrrrrr}
        {\max} & {x_1} & {+} & {2}\, {x_2} & {+} & {7}\, {x_3} \\[1.5ex]
        & {x_1} &  &  & {+} & {2}\, {x_3} & {\le} & {2} \\[1.5ex]
        &  &  & {x_2} & {+} & {2}\, {x_3} & {\le} & {2} \\[1.5ex]
        & {x_1,} &  & {x_2,} &  & {x_3} & {\in} & {\Z_{\ge 0}}
        \end{array}
        $$

    **Domande**

    1. Calcolare tutti i vertici del poliedro $P$ del rilassamento lineare.

    2. La formulazione è ideale? Che cosa implica per il rilassamento lineare con una funzione obiettivo qualsiasi?

    3. Risolvere il rilassamento lineare con la funzione obiettivo data e dare $z(\ILP)$.

??? soluzione "Soluzione"

    1. Un vertice di $P \subseteq \R^3$ è un punto ammissibile in cui $3$ vincoli linearmente indipendenti (tra i $2$ vincoli e i $3$ vincoli di non negatività) sono soddisfatti all'uguaglianza. Risolvendo tutti i sistemi $3 \times 3$ e tenendo le soluzioni ammissibili si ottengono i vertici

        $$
        (0,0,0),\quad (0,0,1),\quad (0,2,0),\quad (2,0,0),\quad (2,2,0).
        $$

        Per esempio, $x_1 = 0$, $x_1 + 2\,x_3 = 2$ e $x_2 + 2\,x_3 = 2$ danno $(0,0,1)$. I sistemi impossibili, o la cui soluzione viola un vincolo, non danno alcun vertice.

    2. Tutti i vertici sono interi e appartengono a $F$. Il poliedro $P$ è limitato, quindi è l'inviluppo convesso dei suoi vertici: $P = \mathrm{conv}(\text{vertici}) \subseteq \mathrm{conv}(F) \subseteq P$, quindi $P = \mathrm{conv}(F)$ e la formulazione è <strong>ideale</strong>. Per ogni funzione obiettivo il rilassamento lineare ha un vertice ottimo intero, per esempio:

        <div class="tabella" markdown="0"><table>
        <tr>
        <th>Funzione obiettivo</th>
        <th>vertice ottimo</th>
        <th>valore ottimo</th>
        </tr>
        <tr>
        <td><span class="arithmatex">\(x_1 + 2\,x_2 + 7\,x_3\)</span></td>
        <td><span class="arithmatex">\((0,0,1)\)</span></td>
        <td><span class="arithmatex">\(7\)</span></td>
        </tr>
        <tr>
        <td><span class="arithmatex">\(x_1 + x_2 + 3\,x_3\)</span></td>
        <td><span class="arithmatex">\((2,2,0)\)</span></td>
        <td><span class="arithmatex">\(4\)</span></td>
        </tr>
        <tr>
        <td><span class="arithmatex">\(3\,x_1 + 2\,x_2 + 9\,x_3\)</span></td>
        <td><span class="arithmatex">\((2,2,0)\)</span></td>
        <td><span class="arithmatex">\(10\)</span></td>
        </tr>
        <tr>
        <td><span class="arithmatex">\(x_1 + x_2 + x_3\)</span></td>
        <td><span class="arithmatex">\((2,2,0)\)</span></td>
        <td><span class="arithmatex">\(4\)</span></td>
        </tr>
        </table></div>

        e l'enumerazione completa dà gli stessi valori.

    3. I valori di $x_1 + 2\,x_2 + 7\,x_3$ nei cinque vertici sono $0$, $7$, $4$, $2$, $6$: il vertice ottimo è $(0,0,1)$, di valore $7$.

        !!! chiave ""

            La formulazione è ideale: il vertice ottimo $(0,0,1)$ del rilassamento lineare è intero, e $z(\LP) = z(\ILP) = 7$.
