---
title: "Esercizi · Limiti primali e duali"
---

# Esercizi · Limiti primali e duali

<div class="info-capitolo" markdown>

**Esercizi · Capitolo 2** · ogni soluzione si apre con un clic · [:material-book-open-variant: Capitolo 2: Limiti primal e dual](../models-and-bounds/lp-relaxation.md) · [:material-file-pdf-box: Esercizi, volume 1 (PDF)](../pdf/exercises-1-models-bounds-formulations.pdf)

</div>

<a id="esercizio-2-1"></a>

!!! esercizio "Esercizio 2.1: Limiti primari e duali (P5)"
    !!! nota ""
        Considera il seguente problema ILP in forma canonica di massimizzazione con $n=2$ variabili intere e $m=2$ vincoli:

        $$
        \begin{array}{rrrrrrr}
        {\max} & {2}\, {x_1} & {+} & {3}\, {x_2} \\[1.5ex]
        & {6}\, {x_1} & {+} & {21}\, {x_2} & {\le} & {77} \\[1.5ex]
        & {8}\, {x_1} & {+} & {3}\, {x_2} & {\le} & {36} \\[1.5ex]
        & {x_1,} &  & {x_2} & {\in} & {\Z_{\ge 0}}
        \end{array}
        $$

    **Domande**

    1. Applica l'euristica a una variabile e l'euristica in due fasi, in entrambi gli ordini delle variabili, e fornisci il miglior limite primale $\LB$.

    2. Risolvi il rilassamento LP graficamente e fornisci il limite duale $\UB$ che esso fornisce.

    3. Calcola il divario di ottimalità. La migliore soluzione euristica è certificata come ottimale?

??? soluzione "Soluzione"

    1. L'<strong>euristica a una variabile</strong> imposta una singola variabile al suo valore massimo, con le altre variabili uguali a $0$. L'<strong>euristica a due fasi</strong> imposta prima una variabile al suo valore massimo e poi l'altra al suo valore massimo con i <strong>termini noti residui</strong>.

        - Solo $x_1$ ($x_2 = 0$): $\bar x_1 = \min\{\lfloor \tfrac{77}{6} \rfloor, \lfloor \tfrac{9}{2} \rfloor\} = 4$, quindi $\bar{\vet x} = (4,0)$ e $\LB = 2 \cdot 4 + 3 \cdot 0 = 8$.

        - Solo $x_2$ ($x_1 = 0$): $\bar x_2 = \min\{\lfloor \tfrac{11}{3} \rfloor, \lfloor 12 \rfloor\} = 3$, quindi $\bar{\vet x} = (0,3)$ e $\LB = 2 \cdot 0 + 3 \cdot 3 = 9$.

        - $x_1$ primo: $\bar x_1 = \min\{\lfloor \tfrac{77}{6} \rfloor, \lfloor \tfrac{9}{2} \rfloor\} = 4$, lasciando i membri a destra residui $53$ e $4$. Poi $\bar x_2 = \min\{\lfloor \tfrac{53}{21} \rfloor, \lfloor \tfrac{4}{3} \rfloor\} = 1$, così $\bar{\vet x} = (4,1)$ e $\LB = 11$.

        - $x_2$ primo: $\bar x_2 = \min\{\lfloor \tfrac{11}{3} \rfloor, \lfloor 12 \rfloor\} = 3$, lasciando i membri a destra residui $14$ e $27$. Poi $\bar x_1 = \min\{\lfloor \tfrac{7}{3} \rfloor, \lfloor \tfrac{27}{8} \rfloor\} = 2$, così $\bar{\vet x} = (2,3)$ e $\LB = 13$.

        <div class="tabella" markdown="0"><table>
        <tr>
        <th> euristica </th>
        <th>Ordine</th>
        <th><span class="arithmatex">\(\bar x_1\)</span></th>
        <th><span class="arithmatex">\(\bar x_2\)</span></th>
        <th><span class="arithmatex">\(\LB\)</span></th>
        </tr>
        <tr>
        <td>a una variabile</td>
        <td><span class="arithmatex">\(x_1\)</span></td>
        <td><span class="arithmatex">\(4\)</span></td>
        <td><span class="arithmatex">\(0\)</span></td>
        <td><span class="arithmatex">\(8\)</span></td>
        </tr>
        <tr>
        <td>a una variabile</td>
        <td><span class="arithmatex">\(x_2\)</span></td>
        <td><span class="arithmatex">\(0\)</span></td>
        <td><span class="arithmatex">\(3\)</span></td>
        <td><span class="arithmatex">\(9\)</span></td>
        </tr>
        <tr>
        <td>a due fasi</td>
        <td><span class="arithmatex">\(x_1\)</span> prima</td>
        <td><span class="arithmatex">\(4\)</span></td>
        <td><span class="arithmatex">\(1\)</span></td>
        <td><span class="arithmatex">\(11\)</span></td>
        </tr>
        <tr>
        <td>a due fasi</td>
        <td><span class="arithmatex">\(x_2\)</span> prima</td>
        <td><span class="arithmatex">\(2\)</span></td>
        <td><span class="arithmatex">\(3\)</span></td>
        <td><span class="arithmatex">\(13\)</span></td>
        </tr>
        </table></div>

        Il miglior limite primale è $\LB = 13$, dato da $\bar{\vet x} = (2,3)$.

    2. Graficamente, abbiamo:

        ![Figura 1](../img/ex-02-lp-relaxation/fig01.svg){ .fig .ovale loading=lazy  }

        <em>Regione ammissibile del rilassamento LP (rossa), punti interi (neri) e soluzione ottimale del rilassamento LP (blu), con la linea obiettivo che la attraversa (tratteggiata).</em>

        Il vertice ottimale è l'intersezione delle linee dei vincoli 1 e 2:

        $$
        \begin{cases}
        6\,x_1 + 21\,x_2 = 77 \\
        8\,x_1 + 3\,x_2 = 36
        \end{cases}
        \qquad\Longrightarrow\qquad x_1 = \dfrac{7}{2}, \quad x_2 = \dfrac{8}{3}
        $$

        Il valore ottimale è $z(\LP) = 2 \cdot \tfrac{7}{2} + 3 \cdot \tfrac{8}{3} = 15$. I dati sono interi, quindi il limite duale è

        $$
        z(\ILP) \le z(\LP) = 15
        $$

    3. Con $\LB = 13$ e $\UB = 15$ il divario di optimalità è

        $$
        \frac{\UB - \LB}{|\LB|} = \frac{15 - 13}{13} = \dfrac{2}{13} \approx 15.4\%
        $$

        Il divario non è zero: i limiti forniscono solo $13 \le z(\ILP) \le 15$, e $\bar{\vet x} = (2,3)$ non è <strong>certificato</strong> ottimale.

        !!! chiave ""
            $\LB = 13$ dall'euristica a due fasi, $\UB = 15$ dal rilassamento LP, divario di ottimalità $\dfrac{2}{13}$. L'enumerazione completa mostra che $z(\ILP) = 13$: la soluzione euristica $(2,3)$ è ottimale, ma i due limiti non lo dimostrano.

<a id="esercizio-2-2"></a>

!!! esercizio "Esercizio 2.2: Arrotondamento e certificati (P4)"
    !!! nota ""
        Considera il seguente problema ILP in forma canonica di massimizzazione con $n=2$ variabili intere e $m=2$ vincoli:

        $$
        \begin{array}{rrrrrrr}
        {\max} & {5}\, {x_1} & {+} & {3}\, {x_2} \\[1.5ex]
        & {2}\, {x_1} & {+} & {x_2} & {\le} & {14} \\[1.5ex]
        & {x_1} & {+} & {8}\, {x_2} & {\le} & {32} \\[1.5ex]
        & {x_1,} &  & {x_2} & {\in} & {\Z_{\ge 0}}
        \end{array}
        $$

    **Domande**

    1. Risolvi il rilassamento LP graficamente e fornisci il limite duale $\UB$.

    2. Arrotonda la soluzione ottimale del rilassamento LP nei quattro modi possibili (ogni componente in basso o in alto). Quali punti arrotondati sono fattibili? Fornisci il miglior limite primale $\LB$ ottenuto arrotondando.

    3. Calcola il divario di ottimalità.

    4. Dimostra che il punto $(6,2)$ è fattibile e certifica che è una soluzione ottimale.

soluzione "Solution"

    1. Graficamente, abbiamo:

        ![Figura 2](../img/ex-02-lp-relaxation/fig02.svg){ .fig .ovale loading=lazy  }

        <em>Regione ammissibile del rilassamento LP (rossa), punti interi (neri) e soluzione ottimale del rilassamento LP (blu), con la linea obiettivo che la attraversa (tratteggiata).</em>

        Il vertice ottimale è l'intersezione delle linee dei vincoli 1 e 2:

        $$
        \begin{cases}
        2\,x_1 + x_2 = 14 \\
        x_1 + 8\,x_2 = 32
        \end{cases}
        \qquad\Longrightarrow\qquad x_1 = \dfrac{16}{3}, \quad x_2 = \dfrac{10}{3}
        $$

        Il valore ottimale è $z(\LP) = 5 \cdot \tfrac{16}{3} + 3 \cdot \tfrac{10}{3} = \dfrac{110}{3}$. I dati sono interi, quindi

        $$
        z(\ILP) \le \left\lfloor z(\LP) \right\rfloor = \left\lfloor \dfrac{110}{3} \right\rfloor = 36
        $$

    2. La soluzione ottimale delil rilassamento LP è $(\dfrac{16}{3},\dfrac{10}{3})$, e il suo arrotondamento al punto intero più vicino è $(5,3)$. I quattro punti arrotondati sono:

        <div class="tabella" markdown="0"><table>
        <tr>
        <th>Punto arrotondato</th>
        <th>fattibile</th>
        <th>vincolo violato</th>
        <th>valore</th>
        </tr>
        <tr>
        <td><span class="arithmatex">\((5,3)\)</span></td>
        <td>sì</td>
        <td>–</td>
        <td><span class="arithmatex">\(34\)</span></td>
        </tr>
        <tr>
        <td><span class="arithmatex">\((5,4)\)</span></td>
        <td>no</td>
        <td><span class="arithmatex">\(1 \cdot 5 + 8 \cdot 4 = 37 > 32\)</span></td>
        <td>–</td>
        </tr>
        <tr>
        <td><span class="arithmatex">\((6,3)\)</span></td>
        <td>no</td>
        <td><span class="arithmatex">\(2 \cdot 6 + 1 \cdot 3 = 15 > 14\)</span></td>
        <td>–</td>
        </tr>
        <tr>
        <td><span class="arithmatex">\((6,4)\)</span></td>
        <td>no</td>
        <td><span class="arithmatex">\(2 \cdot 6 + 1 \cdot 4 = 16 > 14\)</span></td>
        <td>–</td>
        </tr>
        </table></div>

        Solo $(5,3)$ è fattibile, quindi l'arrotondamento dà $\LB = 5 \cdot 5 + 3 \cdot 3 = 34$.

    3. Con $\LB = 34$ e $\UB = 36$ il divario di optimalità è

        $$
        \frac{\UB - \LB}{|\LB|} = \frac{36 - 34}{34} = \dfrac{1}{17} \approx 5.9\%
        $$

    4. Il punto $(6,2)$ soddisfa i vincoli, $2 \cdot 6 + 1 \cdot 2 = 14 \le 14, \quad 1 \cdot 6 + 8 \cdot 2 = 22 \le 32$, e il suo valore è $5 \cdot 6 + 3 \cdot 2 = 36$. Pertanto $\LB = 36 = \UB$: il divario di ottimalità è zero.

        !!! chiave ""
            La soluzione fattibile $(6,2)$ ha valore $36 = \lfloor z(\LP) \rfloor$: è <strong>certificata ottimale</strong>, $z(\ILP) = 36$. Approssimare la soluzione LP fornisce solo $(5,3)$, di valore $34$.

<a id="esercizio-2-3"></a>

!!! esercizio "Esercizio 2.3: Arrotondamento fallisce"
    !!! nota ""
        Considera il seguente problema ILP in forma canonica di massimizzazione con $n=2$ variabili intere e $m=2$ vincoli:

        $$
        \begin{array}{rrrrrrr}
        {\max} & {4}\, {x_1} & {+} & {7}\, {x_2} \\[1.5ex]
        & {6}\, {x_1} & {+} & {10}\, {x_2} & {\le} & {30} \\[1.5ex]
        & {-}{6}\, {x_1} & {+} & {3}\, {x_2} & {\le} & {4} \\[1.5ex]
        & {x_1,} &  & {x_2} & {\in} & {\Z_{\ge 0}}
        \end{array}
        $$

    **Domande**

    1. Risolvi il rilassamento LP graficamente e fornisci il limite duale $\UB$.

    2. Arrotonda la soluzione ottimale del rilassamento LP nei quattro modi possibili. L'arrotondamento per difetto è fattibile? L'arrotondamento al punto intero più vicino è fattibile? Fornisci il miglior limite primale ottenuto tramite l'arrotondamento.

    3. Trova una soluzione ottimale del problema ILP graficamente e confrontala con la soluzione del rilassamento LP.

soluzione "Solution"

    1. Graficamente, abbiamo:

        ![Figura 3](../img/ex-02-lp-relaxation/fig03.svg){ .fig .ovale loading=lazy  }

        <em>Regione ammissibile delil rilassamento LP (rosso), i suoi punti interi (nero), la soluzione ottimale delil rilassamento LP (blu) con la linea dell'obiettivo attraverso di essa (tratteggiata), e la soluzione ILP ottimale $(5,0)$ (cerchio blu).</em>

        Il vertice ottimale è l'intersezione delle linee dei vincoli 1 e 2:

        $$
        \begin{cases}
        6\,x_1 + 10\,x_2 = 30 \\
        -6\,x_1 + 3\,x_2 = 4
        \end{cases}
        \qquad\Longrightarrow\qquad x_1 = \dfrac{25}{39}, \quad x_2 = \dfrac{34}{13}
        $$

        con $z(\LP) = 4 \cdot \tfrac{25}{39} + 7 \cdot \tfrac{34}{13} = \dfrac{814}{39} \approx 20.87$. I dati sono interi, quindi

        $$
        z(\ILP) \le \left\lfloor z(\LP) \right\rfloor = \left\lfloor \dfrac{814}{39} \right\rfloor = 20
        $$

    2. I quattro arrotondamenti di $(\dfrac{25}{39},\dfrac{34}{13}) \approx (0.64,2.62)$ sono:

        <div class="tabella" markdown="0"><table>
        <tr>
        <th>Punto arrotondato</th>
        <th>fattibile</th>
        <th>vincolo violato</th>
        <th>valore</th>
        </tr>
        <tr>
        <td><span class="arithmatex">\((0,2)\)</span></td>
        <td>no</td>
        <td><span class="arithmatex">\(-6 \cdot 0 + 3 \cdot 2 = 6 > 4\)</span></td>
        <td>–</td>
        </tr>
        <tr>
        <td><span class="arithmatex">\((0,3)\)</span></td>
        <td>no</td>
        <td><span class="arithmatex">\(-6 \cdot 0 + 3 \cdot 3 = 9 > 4\)</span></td>
        <td>–</td>
        </tr>
        <tr>
        <td><span class="arithmatex">\((1,2)\)</span></td>
        <td>sì</td>
        <td>–</td>
        <td><span class="arithmatex">\(18\)</span></td>
        </tr>
        <tr>
        <td><span class="arithmatex">\((1,3)\)</span></td>
        <td>no</td>
        <td><span class="arithmatex">\(6 \cdot 1 + 10 \cdot 3 = 36 > 30\)</span></td>
        <td>–</td>
        </tr>
        </table></div>

        L'arrotondamento verso il basso $(0,2)$ e l'arrotondamento al punto più vicino $(1,3)$ sono entrambi <strong>inattuabili</strong>. L'unico arrotondamento fattibile è $(1,2)$, con $\LB = 18$.

    3. Il gradiente della funzione obiettivo è $\nabla f = (4,7)$. I punti interi vicini all'ottimo LP si trovano sotto la linea ripida del vincolo 2, e l'ultimo punto di $F$ raggiunto dalla linea di livello è $(5,0)$, sulla linea $4\,x_1 + 7\,x_2 = 20$. Il suo valore $20$ è uguale a $\UB = 20$, quindi è certificato ottimale.

        !!! chiave ""
            La soluzione ILP ottimale $\tilde{\vet x}(\ILP) = (5,0)$, con $z(\ILP) = 20$, è lontana da $\tilde{\vet x}(\LP) \approx (0.64,2.62)$: <strong>nessun arrotondamento</strong> la trova, mentre il limite $\lfloor z(\LP) \rfloor = 20$ è esatto.

<a id="esercizio-2-4"></a>

!!! esercizio "Esercizio 2.4: Limiti duali (P2)"
    !!! nota ""
        Considera il seguente problema ILP in forma canonica di massimizzazione con $n=2$ variabili intere e $m=2$ vincoli:

        $$
        \begin{array}{rrrrrrr}
        {\max} & {x_1} & {+} & {3}\, {x_2} \\[1.5ex]
        & {-}{4}\, {x_1} & {+} & {10}\, {x_2} & {\le} & {35} \\[1.5ex]
        & {3}\, {x_1} & {+} & {x_2} & {\le} & {12} \\[1.5ex]
        & {x_1,} &  & {x_2} & {\in} & {\Z_{\ge 0}}
        \end{array}
        $$

        La soluzione ottimale della sua rilassamento LP è $\tilde{\vet x}(\LP) = (\dfrac{5}{2},\dfrac{9}{2})$, con $z(\LP) = 16$.

    **Domande**

    1. Moltiplica i vincoli per i moltiplicatori $(\pi_1,\pi_2)$ della tabella sottostante. Quali moltiplicatori sono validi e quale limite superiore su $z(\ILP)$ fornisce ciascuna scelta valida?

        $$
        (0,3),\qquad (\tfrac{1}{2},1),\qquad (\tfrac{3}{10},0),\qquad (\tfrac{1}{4},\tfrac{2}{3})
        $$

    2. Scrivi il problema duale D(LP) del rilassamento LP e verifica che $\tilde{\vet\pi} = (\tfrac{4}{17},\tfrac{11}{17})$ sia una soluzione duale ottimale.

    3. Derivare i limiti superiori sulle variabili dalle vincoli. Migliorano il limite delil rilassamento LP?

??? soluzione "Soluzione"

    1. Con i moltiplicatori $\pi_1, \pi_2 \ge 0$ la somma dei vincoli è

        $$
        (-4\,\pi_1 + 3\,\pi_2)\,x_1 + (10\,\pi_1 + \pi_2)\,x_2 \le 35\,\pi_1 + 12\,\pi_2,
        $$

        e fornisce un limite superiore quando i coefficienti sono almeno i costi: $-4\,\pi_1 + 3\,\pi_2 \ge 1$ e $10\,\pi_1 + \pi_2 \ge 3$.

        <div class="tabella" markdown="0"><table>
        <tr>
        <th><span class="arithmatex">\((\pi_1,\pi_2)\)</span></th>
        <th>coefficienti di <span class="arithmatex">\(x_1\)</span>, <span class="arithmatex">\(x_2\)</span></th>
        <th>moltiplicatori validi</th>
        <th>limite superiore <span class="arithmatex">\(35\,\pi_1 + 12\,\pi_2\)</span></th>
        </tr>
        <tr>
        <td><span class="arithmatex">\((0,3)\)</span></td>
        <td><span class="arithmatex">\(9\)</span>, <span class="arithmatex">\(3\)</span></td>
        <td>sì</td>
        <td><span class="arithmatex">\(36\)</span></td>
        </tr>
        <tr>
        <td><span class="arithmatex">\((\tfrac{1}{2},1)\)</span></td>
        <td><span class="arithmatex">\(1\)</span>, <span class="arithmatex">\(6\)</span></td>
        <td>sì</td>
        <td><span class="arithmatex">\(\tfrac{59}{2}\)</span></td>
        </tr>
        <tr>
        <td><span class="arithmatex">\((\tfrac{3}{10},0)\)</span></td>
        <td><span class="arithmatex">\(-\tfrac{6}{5}\)</span>, <span class="arithmatex">\(3\)</span></td>
        <td>no: <span class="arithmatex">\(-\tfrac{6}{5} < 1\)</span></td>
        <td>–</td>
        </tr>
        <tr>
        <td><span class="arithmatex">\((\tfrac{1}{4},\tfrac{2}{3})\)</span></td>
        <td><span class="arithmatex">\(1\)</span>, <span class="arithmatex">\(\tfrac{19}{6}\)</span></td>
        <td>sì</td>
        <td><span class="arithmatex">\(\tfrac{67}{4}\)</span></td>
        </tr>
        </table></div>

        Il migliore di questi limiti è $\tfrac{67}{4}$, fornito da $(\tfrac{1}{4},\tfrac{2}{3})$. I moltiplicatori $(\frac{3}{10},0)$ non sono validi: il primo vincolo ha un coefficiente negativo di $x_1$.

    2. Il problema duale D(LP) è

        $$
        \begin{array}{rrrrrrr}
        {\min} & {35}\, {\pi_1} & {+} & {12}\, {\pi_2} \\[1.5ex]
        & {-}{4}\, {\pi_1} & {+} & {3}\, {\pi_2} & {\ge} & {1} \\[1.5ex]
        & {10}\, {\pi_1} & {+} & {\pi_2} & {\ge} & {3} \\[1.5ex]
        & {\pi_1,} &  & {\pi_2} & {\in} & {\R_{\ge 0}}
        \end{array}
        $$

        Il punto $(\tfrac{4}{17},\tfrac{11}{17})$ è fattibile, poiché $-4 \cdot \tfrac{4}{17} + 3 \cdot \tfrac{11}{17} = 1 \ge 1$ e $10 \cdot \tfrac{4}{17} + 1 \cdot \tfrac{11}{17} = 3 \ge 3$, e il suo valore è $35 \cdot \tfrac{4}{17} + 12 \cdot \tfrac{11}{17} = 16 = z(\LP)$. Per la dualità debole nessuna soluzione duale fattibile ha un valore più piccolo, quindi è ottimale.

    3. Solo il vincolo 2, $3\,x_1 + x_2 \le 12$, ha coefficienti non negativi; il vincolo 1 ha un coefficiente negativo e non fornisce alcun limite. Dal vincolo 2:

        $$
        x_1 \le \lfloor 12/3 \rfloor = 4, \qquad x_2 \le \lfloor 12/1 \rfloor = 12.
        $$

        La soluzione LP ottimale $(\tfrac{5}{2},\tfrac{9}{2})$ soddisfa entrambi i vincoli, quindi non viene esclusa e $z(\LP) = 16$ non cambia.

        !!! chiave ""
            I migliori moltiplicatori $\tilde{\vet\pi} = (\tfrac{4}{17},\tfrac{11}{17})$ danno il vincolo $16 = z(\LP)$, che i limiti superiori delle variabili non migliorano: $z(\ILP) \le 16$ (in effetti $z(\ILP) = 14$).

<a id="esercizio-2-5"></a>

!!! esercizio "Esercizio 2.5: Limiti con tre variabili (P46)"
    !!! nota ""
        Considera il seguente problema ILP in forma canonica di massimizzazione con $n=3$ variabili intere e $m=3$ vincoli:

        $$
        \begin{array}{rrrrrrrrr}
        {\max} & {5}\, {x_1} & {+} & {6}\, {x_2} & {+} & {10}\, {x_3} \\[1.5ex]
        & {9}\, {x_1} & {+} & {2}\, {x_2} & {+} & {2}\, {x_3} & {\le} & {11} \\[1.5ex]
        & {2}\, {x_1} & {+} & {6}\, {x_2} & {+} & {6}\, {x_3} & {\le} & {16} \\[1.5ex]
        & {4}\, {x_1} & {+} & {2}\, {x_2} & {+} & {7}\, {x_3} & {\le} & {10} \\[1.5ex]
        & {x_1,} &  & {x_2,} &  & {x_3} & {\in} & {\Z_{\ge 0}}
        \end{array}
        $$

        La soluzione ottimale della sua rilassamento LP è $\tilde{\vet x}(\LP) = (\tfrac{17}{25},\tfrac{49}{25},\tfrac{12}{25})$, con $z(\LP) = \dfrac{499}{25}$.

    **Domande**

    1. Fornire il limite duale $\UB$ fornito dal rilassamento LP.

    2. Arrotonda per difetto la soluzione ottimale della rilassazione LP. Il punto arrotondato è fattibile e quale bound primale fornisce?

    3. Applica l'euristica a due fasi (estesa a tre fasi) con le variabili in ordine di costo decrescente, $x_3$, $x_2$, $x_1$.

    4. Calcola il divario di ottimalità con il miglior limite primale.

??? soluzione "Soluzione"

    1. I dati sono interi, quindi

        $$
        z(\ILP) \le \left\lfloor z(\LP) \right\rfloor = \left\lfloor \dfrac{499}{25} \right\rfloor = 19
        $$

    2. Arrotondare per difetto dà $(0,1,0)$, che è fattibile: $9 \cdot 0 + 2 \cdot 1 + 2 \cdot 0 = 2 \le 11, \quad 2 \cdot 0 + 6 \cdot 1 + 6 \cdot 0 = 6 \le 16, \quad 4 \cdot 0 + 2 \cdot 1 + 7 \cdot 0 = 2 \le 10$. Il suo valore dà $\LB = 5 \cdot 0 + 6 \cdot 1 + 10 \cdot 0 = 6$, lontano dal limite superiore.

    3. Ogni variabile, nell'ordine $x_3$, $x_2$, $x_1$, assume il suo valore massimo con i termini noti residui:

        1. $\bar x_3 = \min\{\lfloor \tfrac{11}{2} \rfloor, \lfloor \tfrac{8}{3} \rfloor, \lfloor \tfrac{10}{7} \rfloor\} = 1$; i lati destro residui diventano $9$, $10$, $3$.

        2. $\bar x_2 = \min\{\lfloor \tfrac{9}{2} \rfloor, \lfloor \tfrac{5}{3} \rfloor, \lfloor \tfrac{3}{2} \rfloor\} = 1$; i lati destro residui diventano $7$, $4$, $1$.

        3. $\bar x_1 = \min\{\lfloor \tfrac{7}{9} \rfloor, \lfloor 2 \rfloor, \lfloor \tfrac{1}{4} \rfloor\} = 0$; i lati destro residui diventano $7$, $4$, $1$.

        La soluzione euristica è $\bar{\vet x} = (0,1,1)$, con $\LB = 5 \cdot 0 + 6 \cdot 1 + 10 \cdot 1 = 16$.

    4. Con $\LB = 16$ e $\UB = 19$ il divario di optimalità è

        $$
        \frac{\UB - \LB}{|\LB|} = \frac{19 - 16}{16} = \dfrac{3}{16} \approx 18.8\%
        $$

        !!! chiave ""
            $16 \le z(\ILP) \le 19$. L'enumerazione completa mostra che la soluzione euristica $(0,1,1)$ è ottimale, $z(\ILP) = 16$, ma il divario $\dfrac{3}{16}$ non lo certifica.
