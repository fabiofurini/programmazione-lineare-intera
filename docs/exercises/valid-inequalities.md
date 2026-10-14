---
title: "Esercizi · Disuguaglianze valide"
---

# Esercizi · Disuguaglianze valide

<div class="info-capitolo" markdown>

**Esercizi · Capitolo 4** · ogni soluzione si apre con un clic · [:material-book-open-variant: Capitolo 4: Disuguaglianze valide](../formulations/valid-inequalities.md) · [:material-file-pdf-box: Esercizi, volume 1 (PDF)](../pdf/exercises-1-models-bounds-formulations.pdf)

</div>

<a id="esercizio-4-1"></a>

!!! esercizio "Esercizio 4.1: Un'ineguaglianza valida arrotondando (P2)"
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

        La soluzione ottimale del suo rilassamento LP è $\tilde{\vet x}(\LP) = (\tfrac{5}{2},\tfrac{9}{2})$, con $z(\LP) = 16$.

    **Domande**

    1. Usando i moltiplicatori $(\frac{3}{34}, \frac{2}{17})$, mostra che $x_2 \le 4$ è una disuguaglianza valida.

    2. L'ineguaglianza è stretta? Taglia via la soluzione ottimale del rilassamento LP?

    3. Aggiungi la disuguaglianza alla formulazione e calcola il nuovo limite superiore.

??? soluzione "Soluzione"

    1. Moltiplicando i vincoli per i moltiplicatori non negativi $(\tfrac{3}{34}, \tfrac{2}{17})$ e sommando, $\tfrac{3}{34} \cdot (-4\,x_1 + 10\,x_2 \le 35) + \tfrac{2}{17} \cdot (3\,x_1 + x_2 \le 12)$, otteniamo

        $$
        x_2 \le \dfrac{9}{2}.
        $$

        Poiché $x_j \ge 0$ e i coefficienti $0 \ge 0$, $1 \ge 1$ sono almeno quelli di $x_2$, ogni soluzione ammissibile soddisfa $x_2 \le x_2 \le \tfrac{9}{2}$. Il lato sinistro è un numero intero, quindi

        $$
        x_2 \le \left\lfloor \dfrac{9}{2} \right\rfloor = 4
        $$

        è una <strong>disuguaglianza valida</strong>.

    2. Le soluzioni ammissibili $(2,4)$ soddisfano $x_2 = 4$, quindi l'ineguaglianza è <strong>stretta</strong>. Essa <strong>esclude</strong> $\tilde{\vet x}(\LP) = (\tfrac{5}{2},\tfrac{9}{2})$, poiché $0 \cdot \tfrac{5}{2} + 1 \cdot \tfrac{9}{2} = \tfrac{9}{2} > 4$.

    3. Graficamente, abbiamo:

        ![Figura 1](../img/ex-04-valid-inequalities/fig01.svg){ .fig .ovale loading=lazy  }

        <em>Il rilassamento LP con la disuguaglianza valida $x_2 \le 4$ (verde): la soluzione ottimale $(\frac{5}{2},\frac{9}{2})$ del rilassamento LP originale (cerchio blu) viene esclusa, e la nuova soluzione ottimale è blu, con la sua linea obiettivo (tratteggiata).</em>

        <div class="tabella" markdown="0"><table>
        <tr>
        <th>Formulazione</th>
        <th><span class="arithmatex">\(\tilde{\vet x}(\LP)\)</span></th>
        <th><span class="arithmatex">\(z(\LP)\)</span></th>
        <th>limite superiore</th>
        </tr>
        <tr>
        <td>originale</td>
        <td><span class="arithmatex">\((\tfrac{5}{2},\tfrac{9}{2})\)</span></td>
        <td><span class="arithmatex">\(16\)</span></td>
        <td><span class="arithmatex">\(16\)</span></td>
        </tr>
        <tr>
        <td>con <span class="arithmatex">\(x_2 \le 4\)</span></td>
        <td><span class="arithmatex">\((\tfrac{8}{3},4)\)</span></td>
        <td><span class="arithmatex">\(\tfrac{44}{3}\)</span></td>
        <td><span class="arithmatex">\(14\)</span></td>
        </tr>
        </table></div>

        !!! chiave ""
            $x_2 \le 4$ è valido e stretto, taglia $\tilde{\vet x}(\LP)$, e il limite superiore migliora da $16$ a $14$ (il valore ottimale è $z(\ILP) = 14$).

<a id="esercizio-4-2"></a>

!!! esercizio "Esercizio 4.2: Valido o non valido (P4)"
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

        La soluzione ottimale del suo rilassamento LP è $\tilde{\vet x}(\LP) = (\tfrac{16}{3},\tfrac{10}{3})$, con $z(\LP) = \dfrac{110}{3}$.

    **Domande**

    1. $x_1 + x_2 \le 7$ è una disuguaglianza valida?

    2. Mostra che $x_1 + x_2 \le 8$ è un'ineguaglianza valida, utilizzando i moltiplicatori $(\frac{7}{15},\frac{1}{15})$. Essa esclude la soluzione ottimale della rilassata LP?

    3. Aggiungi $x_1 + x_2 \le 8$ alla formulazione e risolvi la nuova rilassamento LP. Cosa puoi concludere?

??? soluzione "Soluzione"

    1. No. Il punto $(6,2)$ è ammissibile, $2 \cdot 6 + 1 \cdot 2 = 14 \le 14, \quad 1 \cdot 6 + 8 \cdot 2 = 22 \le 32$, e viola l'ineguaglianza: $6 + 2 = 8 > 7$; lo stesso vale per il punto fattibile $(5,3)$. Un'ineguaglianza valida deve essere soddisfatta da <strong>tutte</strong> le soluzioni ammissibili.

    2. Moltiplicando i vincoli per i moltiplicatori non negativi $(\tfrac{7}{15}, \tfrac{1}{15})$ e sommando, $\tfrac{7}{15} \cdot (2\,x_1 + x_2 \le 14) + \tfrac{1}{15} \cdot (x_1 + 8\,x_2 \le 32)$, otteniamo

        $$
        x_1 + x_2 \le \dfrac{26}{3}.
        $$

        Poiché $x_j \ge 0$ e i coefficienti $1 \ge 1$, $1 \ge 1$ sono almeno quelli di $x_1 + x_2$, ogni soluzione ammissibile soddisfa $x_1 + x_2 \le x_1 + x_2 \le \tfrac{26}{3}$. Il lato sinistro è un numero intero, quindi

        $$
        x_1 + x_2 \le \left\lfloor \dfrac{26}{3} \right\rfloor = 8
        $$

        è una <strong>disuguaglianza valida</strong>. Essa <strong>esclude</strong> $\tilde{\vet x}(\LP) = (\tfrac{16}{3},\tfrac{10}{3})$, poiché $1 \cdot \tfrac{16}{3} + 1 \cdot \tfrac{10}{3} = \tfrac{26}{3} > 8$.

    3. Graficamente, abbiamo:

        ![Figura 2](../img/ex-04-valid-inequalities/fig02.svg){ .fig .ovale loading=lazy  }

        <em>Il rilassamento LP con la disuguaglianza valida $x_1 + x_2 \le 8$ (verde): la vecchia soluzione ottimale (cerchio blu) viene esclusa e la nuova soluzione ottimale $(6,2)$ (blu) è intera.</em>

        <div class="tabella" markdown="0"><table>
        <tr>
        <th>Formulazione</th>
        <th><span class="arithmatex">\(\tilde{\vet x}(\LP)\)</span></th>
        <th><span class="arithmatex">\(z(\LP)\)</span></th>
        <th>limite superiore</th>
        </tr>
        <tr>
        <td>originale</td>
        <td><span class="arithmatex">\((\tfrac{16}{3},\tfrac{10}{3})\)</span></td>
        <td><span class="arithmatex">\(\tfrac{110}{3}\)</span></td>
        <td><span class="arithmatex">\(36\)</span></td>
        </tr>
        <tr>
        <td>con <span class="arithmatex">\(x_1 + x_2 \le 8\)</span></td>
        <td><span class="arithmatex">\((6,2)\)</span></td>
        <td><span class="arithmatex">\(36\)</span></td>
        <td><span class="arithmatex">\(36\)</span></td>
        </tr>
        </table></div>

        !!! chiave ""
            La nuova rilassamento LP ha la soluzione ottimale <strong>intera</strong> $(6,2)$: è una soluzione ottimale ILP, $z(\ILP) = 36$, e l'ineguaglianza $x_1 + x_2 \le 7$, che la elimina, non è valida.

<a id="esercizio-4-3"></a>

!!! esercizio "Esercizio 4.3: Arrotondamento e serraggio (P5)"
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

        La soluzione ottimale del suo rilassamento LP è $\tilde{\vet x}(\LP) = (\tfrac{7}{2},\tfrac{8}{3})$, con $z(\LP) = 15$.

    **Domande**

    1. Moltiplica entrambe le vincoli per $\frac{1}{7}$, sommali e ricava un'ineguaglianza valida $2\,x_1 + 3\,x_2 \le \beta$ arrotondando. Esclude la soluzione ottimale del rilassamento LP?

    2. Rendi l'ineguaglianza stretta con il Passo 1 dell'algoritmo del capitolo: diminuisci $\beta$ fino a quando un punto intero ammissibile si trova sulla linea $2\,x_1 + 3\,x_2 = \beta$.

    3. Aggiungi la disuguaglianza stretta alla formulazione. Qual è il nuovo limite superiore?

??? soluzione "Soluzione"

    1. Moltiplicando i vincoli per i moltiplicatori non negativi $(\tfrac{1}{7}, \tfrac{1}{7})$ e sommando, $\tfrac{1}{7} \cdot (6\,x_1 + 21\,x_2 \le 77) + \tfrac{1}{7} \cdot (8\,x_1 + 3\,x_2 \le 36)$, otteniamo

        $$
        2\,x_1 + \dfrac{24}{7}\,x_2 \le \dfrac{113}{7}.
        $$

        Poiché $x_j \ge 0$ e i coefficienti $2 \ge 2$, $\tfrac{24}{7} \ge 3$ sono almeno quelli di $2\,x_1 + 3\,x_2$, ogni soluzione ammissibile soddisfa $2\,x_1 + 3\,x_2 \le 2\,x_1 + \tfrac{24}{7}\,x_2 \le \tfrac{113}{7}$. Il lato sinistro è un numero intero, quindi

        $$
        2\,x_1 + 3\,x_2 \le \left\lfloor \dfrac{113}{7} \right\rfloor = 16
        $$

        è una <strong>disuguaglianza valida</strong>. Non <strong>esclude</strong> $\tilde{\vet x}(\LP) = (\tfrac{7}{2},\tfrac{8}{3})$, poiché $2 \cdot \tfrac{7}{2} + 3 \cdot \tfrac{8}{3} = 15 \le 16$. La disuguaglianza è valida ma inutile per il vincolo.

    2. Per due variabili, i punti interi della retta $2\,x_1 + 3\,x_2 = \beta$ con $x_1, x_2 \ge 0$ sono finiti, e controlliamo ciascuno di essi rispetto ai vincoli.

        - <strong>$\beta = 16$.</strong> I punti interi di $2\,x_1 + 3\,x_2 = 16$ con $x \ge 0$: $(2,4)$ viola il vincolo 1 ($6 \cdot 2 + 21 \cdot 4 = 96 > 77$); $(5,2)$ viola il vincolo 2 ($8 \cdot 5 + 3 \cdot 2 = 46 > 36$); $(8,0)$ viola il vincolo 2 ($8 \cdot 8 + 3 \cdot 0 = 64 > 36$). Pertanto nessun punto fattibile: impostare $\beta = 15$.

        - <strong>$\beta = 15$.</strong> I punti interi di $2\,x_1 + 3\,x_2 = 15$ con $x \ge 0$: $(0,5)$ viola il vincolo 1 ($6 \cdot 0 + 21 \cdot 5 = 105 > 77$); $(3,3)$ viola il vincolo 1 ($6 \cdot 3 + 21 \cdot 3 = 81 > 77$); $(6,1)$ viola il vincolo 2 ($8 \cdot 6 + 3 \cdot 1 = 51 > 36$). Pertanto nessun punto fattibile: insieme $\beta = 14$.

        - <strong>$\beta = 14$.</strong> I punti interi di $2\,x_1 + 3\,x_2 = 14$ con $x \ge 0$: $(1,4)$ viola il vincolo 1 ($6 \cdot 1 + 21 \cdot 4 = 90 > 77$); $(4,2)$ viola il vincolo 2 ($8 \cdot 4 + 3 \cdot 2 = 38 > 36$); $(7,0)$ viola il vincolo 2 ($8 \cdot 7 + 3 \cdot 0 = 56 > 36$). Pertanto nessun punto fattibile: insieme $\beta = 13$.

        - <strong>$\beta = 13$.</strong> I punti interi di $2\,x_1 + 3\,x_2 = 13$ con $x \ge 0$: $(2,3)$ è ammissibile; $(5,1)$ viola il vincolo 2 ($8 \cdot 5 + 3 \cdot 1 = 43 > 36$). Pertanto esiste un punto fattibile: l'inequazione è stretta. <code>STOP</code>.

        L'ineguaglianza valida stretta è $2\,x_1 + 3\,x_2 \le 13$. Essa <strong>esclude</strong> $\tilde{\vet x}(\LP) = (\tfrac{7}{2},\tfrac{8}{3})$, poiché $2 \cdot \tfrac{7}{2} + 3 \cdot \tfrac{8}{3} = 15 > 13$.

    3. L'inequazione stretta ha gli stessi coefficienti della funzione obiettivo, quindi la nuova rilassamento LP ha valore ottimale $z(\LP) = 13$, raggiunto ad esempio in $(\tfrac{23}{6},\tfrac{16}{9})$.

        <div class="tabella" markdown="0"><table>
        <tr>
        <th>Formulazione</th>
        <th><span class="arithmatex">\(\tilde{\vet x}(\LP)\)</span></th>
        <th><span class="arithmatex">\(z(\LP)\)</span></th>
        <th>limite superiore</th>
        </tr>
        <tr>
        <td>originale</td>
        <td><span class="arithmatex">\((\tfrac{7}{2},\tfrac{8}{3})\)</span></td>
        <td><span class="arithmatex">\(15\)</span></td>
        <td><span class="arithmatex">\(15\)</span></td>
        </tr>
        <tr>
        <td>con <span class="arithmatex">\(2\,x_1 + 3\,x_2 \le 13\)</span></td>
        <td><span class="arithmatex">\((\tfrac{23}{6},\tfrac{16}{9})\)</span></td>
        <td><span class="arithmatex">\(13\)</span></td>
        <td><span class="arithmatex">\(13\)</span></td>
        </tr>
        </table></div>

        !!! chiave ""
            L'arrotondamento dà $2\,x_1 + 3\,x_2 \le 16$, che non taglia l'ottimo LP; la versione stretta $2\,x_1 + 3\,x_2 \le 13$ dà $\UB = 13$, uguale al valore del punto fattibile $(2,3)$: $z(\ILP) = 13$ è certificato.

<a id="esercizio-4-4"></a>

!!! esercizio "Esercizio 4.4: Raggiungere l'inviluppo convesso arrotondando (P1)"
    !!! nota ""
        Considera il seguente problema ILP in forma canonica di massimizzazione con $n=2$ variabili intere e $m=1$ vincolo:

        $$
        \begin{array}{rrrrrrr}
        {\max} & {x_1} & {+} & {8}\, {x_2} \\[1.5ex]
        & {3}\, {x_1} & {+} & {6}\, {x_2} & {\le} & {16} \\[1.5ex]
        & {x_1,} &  & {x_2} & {\in} & {\Z_{\ge 0}}
        \end{array}
        $$

        La soluzione ottimale del suo rilassamento LP è $\tilde{\vet x}(\LP) = (0,\tfrac{8}{3})$, con $z(\LP) = \dfrac{64}{3}$.

    **Domande**

    1. Deriva un'ineguaglianza valida $x_2 \le \beta_1$ con il moltiplicatore $\frac{1}{6}$, e un'ineguaglianza valida $x_1 + 2\,x_2 \le \beta_2$ con il moltiplicatore $\frac{1}{3}$.

    2. Calcola il limite superiore fornito dal rilassamento LP dopo aver aggiunto ciascuna disuguaglianza da sola e dopo aver aggiunto entrambe.

    3. Dimostra che la formulazione con entrambe le disuguaglianze è ideale.

??? soluzione "Soluzione"

    1. - Moltiplicando i vincoli per i moltiplicatori non negativi $(\tfrac{1}{6})$ e sommando, $\tfrac{1}{6} \cdot (3\,x_1 + 6\,x_2 \le 16)$, otteniamo

            $$
            \dfrac{1}{2}\,x_1 + x_2 \le \dfrac{8}{3}.
            $$

            Poiché $x_j \ge 0$ e i coefficienti $\tfrac{1}{2} \ge 0$, $1 \ge 1$ sono almeno quelli di $x_2$, ogni soluzione ammissibile soddisfa $x_2 \le \tfrac{1}{2}\,x_1 + x_2 \le \tfrac{8}{3}$. Il lato sinistro è un numero intero, quindi

            $$
            x_2 \le \left\lfloor \dfrac{8}{3} \right\rfloor = 2
            $$

            è una <strong>disuguaglianza valida</strong>.

        - Moltiplicando i vincoli per i moltiplicatori non negativi $(\tfrac{1}{3})$ e sommando, $\tfrac{1}{3} \cdot (3\,x_1 + 6\,x_2 \le 16)$, otteniamo

            $$
            x_1 + 2\,x_2 \le \dfrac{16}{3}.
            $$

            Poiché $x_j \ge 0$ e i coefficienti $1 \ge 1$, $2 \ge 2$ sono almeno quelli di $x_1 + 2\,x_2$, ogni soluzione ammissibile soddisfa $x_1 + 2\,x_2 \le x_1 + 2\,x_2 \le \tfrac{16}{3}$. Il lato sinistro è un numero intero, quindi

            $$
            x_1 + 2\,x_2 \le \left\lfloor \dfrac{16}{3} \right\rfloor = 5
            $$

            è una <strong>disuguaglianza valida</strong>.

    2. Graficamente, abbiamo:

        ![Figura 3](../img/ex-04-valid-inequalities/fig03.svg){ .fig .ovale loading=lazy  }

        <em>Il rilassamento LP (rosso chiaro) con le disuguaglianze valide $x_2 \le 2$ e $x_1 + 2\,x_2 \le 5$ (verde): il nuovo politopo (rosso) ha il vertice ottimale intero $(1,2)$ (blu); la vecchia soluzione ottimale è il cerchio blu.</em>

        <div class="tabella" markdown="0"><table>
        <tr>
        <th>Formulazione</th>
        <th><span class="arithmatex">\(\tilde{\vet x}(\LP)\)</span></th>
        <th><span class="arithmatex">\(z(\LP)\)</span></th>
        <th>limite superiore</th>
        </tr>
        <tr>
        <td>originale</td>
        <td><span class="arithmatex">\((0,\tfrac{8}{3})\)</span></td>
        <td><span class="arithmatex">\(\tfrac{64}{3}\)</span></td>
        <td><span class="arithmatex">\(21\)</span></td>
        </tr>
        <tr>
        <td>con <span class="arithmatex">\(x_2 \le 2\)</span></td>
        <td><span class="arithmatex">\((\tfrac{4}{3},2)\)</span></td>
        <td><span class="arithmatex">\(\tfrac{52}{3}\)</span></td>
        <td><span class="arithmatex">\(17\)</span></td>
        </tr>
        <tr>
        <td>con <span class="arithmatex">\(x_1 + 2\,x_2 \le 5\)</span></td>
        <td><span class="arithmatex">\((0,\tfrac{5}{2})\)</span></td>
        <td><span class="arithmatex">\(20\)</span></td>
        <td><span class="arithmatex">\(20\)</span></td>
        </tr>
        <tr>
        <td>con entrambi</td>
        <td><span class="arithmatex">\((1,2)\)</span></td>
        <td><span class="arithmatex">\(17\)</span></td>
        <td><span class="arithmatex">\(17\)</span></td>
        </tr>
        </table></div>

        Ciascuna disuguaglianza da sola esclude $\tilde{\vet x}(\LP)$ ma lascia un ottimo frazionario; insieme danno l'ottimo intero $(1,2)$.

    3. Il poliedro con entrambe le disuguaglianze ha i vertici $(0,0)$, $(0,2)$, $(1,2)$, $(5,0)$, tutti interi: è l'inviluppo convesso delle soluzioni ammissibili, quindi la formulazione è <strong>ideale</strong>.

        !!! chiave ""
            Con $x_2 \le 2$ e $x_1 + 2\,x_2 \le 5$, entrambi ottenuti arrotondando, il rilassamento LP fornisce $z(\LP) = 17 = z(\ILP)$ al vertice intero $(1,2)$.

<a id="esercizio-4-5"></a>

!!! esercizio "Esercizio 4.5: Arrotondamento con tre variabili (P42)"
    !!! nota ""
        Considera il seguente problema ILP in forma canonica di massimizzazione con $n=3$ variabili intere e $m=3$ vincoli:

        $$
        \begin{array}{rrrrrrrrr}
        {\max} & {3}\, {x_1} & {+} & {2}\, {x_2} & {+} & {4}\, {x_3} \\[1.5ex]
        & {x_1} & {+} & {x_2} & {+} & {2}\, {x_3} & {\le} & {4} \\[1.5ex]
        & {2}\, {x_1} &  &  & {+} & {3}\, {x_3} & {\le} & {5} \\[1.5ex]
        & {2}\, {x_1} & {+} & {x_2} & {+} & {3}\, {x_3} & {\le} & {7} \\[1.5ex]
        & {x_1,} &  & {x_2,} &  & {x_3} & {\in} & {\Z_{\ge 0}}
        \end{array}
        $$

        La soluzione ottimale del suo rilassamento LP è $\tilde{\vet x}(\LP) = (\tfrac{5}{2},\tfrac{3}{2},0)$, con $z(\LP) = \dfrac{21}{2}$.

    **Domande**

    1. Moltiplica il secondo vincolo per $\frac{1}{2}$, arrotonda verso il basso i suoi coefficienti e il suo termine noto, e mostra che il risultato è un'ineguaglianza valida.

    2. Taglia la soluzione ottimale del rilassamento LP?

    3. Aggiungi la disuguaglianza alla formulazione. La nuova rilassamento LP ha la soluzione ottimale $(2,2,0)$: cosa puoi concludere?

soluzione "Solution"

    1. Il secondo vincolo moltiplicato per $\frac{1}{2}$ è $x_1 + \dfrac{3}{2}\,x_3 \le \dfrac{5}{2}$. Arrotondando per difetto i coefficienti si ottiene $x_1 + x_3$, i cui coefficienti non sono maggiori. Moltiplicando i vincoli per i moltiplicatori non negativi $(0, \tfrac{1}{2}, 0)$ e sommando, $\tfrac{1}{2} \cdot (2\,x_1 + 3\,x_3 \le 5)$, otteniamo

        $$
        x_1 + \dfrac{3}{2}\,x_3 \le \dfrac{5}{2}.
        $$

        Dato che $x_j \ge 0$ e i coefficienti $1 \ge 1$, $0 \ge 0$, $\tfrac{3}{2} \ge 1$ sono almeno quelli di $x_1 + x_3$, ogni soluzione ammissibile soddisfa $x_1 + x_3 \le x_1 + \tfrac{3}{2}\,x_3 \le \tfrac{5}{2}$. Il lato sinistro è un intero, quindi

        $$
        x_1 + x_3 \le \left\lfloor \dfrac{5}{2} \right\rfloor = 2
        $$

        è una <strong>disuguaglianza valida</strong>.

    2. Interrompe <strong>$\tilde{\vet x}(\LP) = (\tfrac{5}{2},\tfrac{3}{2},0)$</strong>, poiché $1 \cdot \tfrac{5}{2} + 0 \cdot \tfrac{3}{2} + 1 \cdot 0 = \tfrac{5}{2} > 2$.

    3. La nuova rilassamento LP ha la soluzione ottimale <strong>intera</strong> $(2,2,0)$, con valore $10$. Secondo la proposizione sul rilassamento LP, è una soluzione ILP ottimale.

        !!! chiave ""
            L'ineguaglianza valida $x_1 + x_3 \le 2$ abbassa il limite superiore da $\lfloor \dfrac{21}{2} \rfloor = 10$ a $10$ e fornisce la soluzione ottimale $(2,2,0)$, $z(\ILP) = 10$.
