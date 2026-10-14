---
title: "Disuguaglianze valide"
---

# Disuguaglianze valide

<div class="info-capitolo" markdown>

**Parte 2 · Rafforzamento della formulazione · Capitolo 4** · [:material-file-pdf-box: Appunti delle lezioni, volume 1 (PDF)](../pdf/lecture-notes-1-models-bounds-formulations.pdf) · [:material-pencil: Esercizi: Diseguaglianze valide](../exercises/valid-inequalities.md) · [:material-gesture-tap: App: Diseguaglianze valide e l'inviluppo convesso](../lab/convex-hull.md)

</div>

!!! nota "Prerequisiti"
    - Da questo modulo, il capitolo «Limiti primari e duali»: il rilassamento LP, il limite arrotondato $\lfloor z(\LP) \rfloor$ e i limiti derivanti dai moltiplicatori non negativi dei vincoli.

    - Da questo modulo, il capitolo «Formulazioni ideali»: formulazioni, l'inviluppo convesso e il confronto delle formulazioni attraverso i loro poliedri.

!!! chiave "Obiettivi"
    Alla fine di questo capitolo sarai in grado di:

    - definire un'ineguaglianza valida e dire quando taglia un punto frazionario;

    - derivare un'ineguaglianza valida dai moltiplicatori non negativi dei vincoli arrotondando per difetto;

    - migliorare un'ineguaglianza valida fino a toccare un punto intero fattibile;

    - misurare l'effetto di una disuguaglianza valida sul valore ottimale del rilassamento LP e sul limite superiore;

    - spiega perché le disuguaglianze valide sono il modo pratico per avvicinarsi a una formulazione ideale.

!!! nota "Dove eravamo"
    Nell'esempio dell'auto, la formulazione ideale fornisce il limite superiore $14$, uguale al limite inferiore, quindi certifica che $(4,1)$ è ottimale. Ma abbiamo trovato le sue quattro disuguaglianze osservando l'inviluppo convesso, cosa che in generale non è possibile. Ora impariamo a <strong>derivare</strong> tali disuguaglianze dai vincoli.

## 4.1 Disuguaglianze valide

<a id="box-1-def-valid"></a>

!!! definizione "Definizione 4.1: di disuguaglianza valida"
    Un'ineguaglianza $\sum_{j=1}^n \alpha_j \, x_j \le \beta$ è una <strong>ineguaglianza valida</strong> per un problema ILP con regione fattibile $F$ se è soddisfatta da tutti i punti di $F$.

<a id="box-2-def-tight"></a>

!!! definizione "Definizione 4.2: punto di interruzione e disuguaglianza valida stretta"
    Sia $\sum_{j=1}^n \alpha_j \, x_j \le \beta$ un'inegualità valida per un problema ILP con regione ammissibile $F$.

    - L'ineguaglianza <strong>esclude</strong> un punto $\vet x^* \in \R^n$ se $\sum_{j=1}^n \alpha_j \, x^*_j > \beta$.

    - L'ineguaglianza è <strong>stretta</strong> se almeno un punto di $F$ la soddisfa con uguaglianza.

- Una disuguaglianza valida non esclude alcun punto di $F$, ma può escludere punti frazionari delil rilassamento LP. Il lato destro di una disuguaglianza stretta non può essere diminuito senza perdere una soluzione ammissibile.

- Aggiungere un'ineguaglianza valida alla formulazione non cambia $F$ e riduce il poliedro $P$. La nuova formulazione è più forte, quindi il suo rilassamento LP fornisce un limite superiore che non è peggiore.

- Un'ineguaglianza valida è soddisfatta da un punto di $F$ se e solo se è soddisfatta dall'inviluppo convesso, quindi è valida per $\mathrm{conv}(F)$. Le disuguaglianze della formulazione ideale sono disuguaglianze valide.

!!! chiave ""
    Un'ineguaglianza valida elimina i punti frazionari e mai una soluzione intera ammissibile. Aggiungere ineguaglianze valide rende la formulazione più forte e migliora il limite superiore.

<a id="box-3-ex-vi-car"></a>

!!! esempio "Esempio 4.1: disuguaglianze valide dell'esempio dell'auto"
    Le disuguaglianze $x_1 \le 4$ e $x_2 \le 3$ dei capitoli precedenti sono disuguaglianze valide dell'esempio dell'auto. Non eliminano la soluzione ottimale $(\frac{7}{2},\frac{5}{2})$ del rilassamento LP, quindi non migliorano il limite superiore $15$.

## 4.2 Derivare disuguaglianze valide mediante arrotondamento

- I vincoli sono combinati con moltiplicatori non negativi, come per i limiti duali; poiché le variabili sono intere, il lato destro della combinazione può essere arrotondato per difetto.

<a id="box-4-prop-rounding"></a>

!!! teorema "Proposizione 4.3: disuguaglianze valide mediante arrotondamento"
    Siano $\pi_1, \pi_2, \dots, \pi_m \ge 0$ moltiplicatori tali che $\sum_{i=1}^m \pi_i \, a_{ij} \ge \alpha_j$, con $\alpha_j \in \Z$, per tutti $j \in \{1,2,\dots,n\}$. Allora l'ineguaglianza

    \begin{equation*}
    \label{rounding}
    \sum_{j=1}^n \alpha_j \, x_j ~\le~ \left\lfloor \sum_{i=1}^m \pi_i \, b_i \right\rfloor \tag{4.1}
    \end{equation*}

    è valido per il problema ILP.

??? dimostrazione "Proof"

    Per ogni soluzione fattibile, $\sum_j \alpha_j \, x_j \le \sum_j \big( \sum_i \pi_i \, a_{ij} \big) x_j \le \sum_i \pi_i \, b_i$, per $x_j \ge 0$ e per i vincoli moltiplicati per $\pi_i \ge 0$. Il lato sinistro è un numero intero, perché $\alpha_j$ e $x_j$ sono interi, quindi è al massimo la parte intera del lato destro. <span class="qed">□</span>

- La proposizione richiede che tutte le variabili siano intere e non negative. Con una variabile continua il lato sinistro non è un intero e il lato destro non può essere arrotondato.

<a id="box-5-ex-half"></a>

!!! esempio "Esempio 4.2: arrotondamento con moltiplicatore $\frac{1}{2}$"
    Nell'esempio dell'auto, moltiplicare il primo vincolo per $\frac{1}{2}$: otteniamo $5\,x_1 + 2\,x_2 \le \frac{45}{2}$. Poiché il lato sinistro è un numero intero, otteniamo la disuguaglianza valida

    $$
    5\,x_1 + 2\,x_2 \le 22.
    $$

    Moltiplicando il secondo vincolo per $\frac{1}{2}$ otteniamo $2\,x_1 + 7\,x_2 \le \frac{49}{2}$, quindi

    $$
    2\,x_1 + 7\,x_2 \le 24.
    $$

    Entrambe le disuguaglianze escludono la soluzione ottimale $(\frac{7}{2},\frac{5}{2})$ delil rilassamento LP: $5 \cdot \frac{7}{2} + 2 \cdot \frac{5}{2} = \frac{45}{2} > 22$ e $2 \cdot \frac{7}{2} + 7 \cdot \frac{5}{2} = \frac{49}{2} > 24$. I nuovi rilassamenti LP danno:

    <div class="tabella" markdown="0"><table>
    <tr>
    <th>Disuguaglianza aggiunta</th>
    <th><span class="arithmatex">\(\tilde{\vet x}(\LP)\)</span></th>
    <th><span class="arithmatex">\(z(\LP)\)</span></th>
    <th><span class="arithmatex">\(\lfloor z(\LP) \rfloor\)</span></th>
    </tr>
    <tr>
    <td>nessuno</td>
    <td><span class="arithmatex">\((\frac{7}{2},\frac{5}{2})\)</span></td>
    <td><span class="arithmatex">\(\frac{31}{2}\)</span></td>
    <td><span class="arithmatex">\(15\)</span></td>
    </tr>
    <tr>
    <td><span class="arithmatex">\(5\,x_1 + 2\,x_2 \le 22\)</span></td>
    <td><span class="arithmatex">\((\frac{105}{31},\frac{157}{62})\)</span></td>
    <td><span class="arithmatex">\(\frac{472}{31}\)</span></td>
    <td><span class="arithmatex">\(15\)</span></td>
    </tr>
    <tr>
    <td><span class="arithmatex">\(2\,x_1 + 7\,x_2 \le 24\)</span></td>
    <td><span class="arithmatex">\((\frac{219}{62},\frac{75}{31})\)</span></td>
    <td><span class="arithmatex">\(\frac{957}{62}\)</span></td>
    <td><span class="arithmatex">\(15\)</span></td>
    </tr>
    </table></div>

    L'ottimo LP si sposta, ma il limite superiore non migliora: $\lfloor \frac{472}{31} \rfloor = \lfloor \frac{957}{62} \rfloor = 15$.

!!! chiave ""
    Un'ineguaglianza valida che esclude la soluzione LP ottimale non migliora sempre il limite superiore. La scelta dei moltiplicatori è importante: cerchiamo diseguaglianze che tocchino i punti interi.

## 4.3 Migliorare un'ineguaglianza valida

- Dato i coefficienti $\alpha_j$, la disuguaglianza valida più forte ha il lato destro più piccolo possibile, che è il massimo di $\sum_j \alpha_j \, x_j$ su $F$. La troviamo abbassando il lato destro $\beta$ di $\eqref{rounding}$ fino a quando un punto intero fattibile lo raggiunge.

!!! algoritmo "Algoritmo"
    - <strong>Input:</strong> Un problema ILP in forma canonica di massimizzazione con $F \ne \emptyset$ e coefficienti interi $\alpha_1, \alpha_2, \dots, \alpha_n$.

    - <strong>Output:</strong> Una disuguaglianza valida stretta $\sum_{j=1}^n \alpha_j \, x_j \le \beta$.

    - **Passo 0:** <strong>Limite grezzo</strong>

        Trova moltiplicatori $\pi_i \ge 0$ con $\sum_{i} \pi_i \, a_{ij} \ge \alpha_j$ per tutti $j$, e imposta $\beta \leftarrow \lfloor \sum_{i} \pi_i \, b_i \rfloor$.

    - **Passo 1:** <strong>Testa il lato destro</strong>

        Se nessun punto intero fattibile soddisfa $\sum_{j} \alpha_j \, x_j = \beta$, impostare $\beta \leftarrow \beta - 1$ e ripetere il Passo 1.

    - **Passo 2:** <strong>Disuguaglianza stretta</strong>

        Un punto intero fattibile soddisfa $\sum_{j} \alpha_j \, x_j = \beta$, quindi $\sum_{j} \alpha_j \, x_j \le \beta$ è valido e vincolante. <code>STOP</code>.

- Nel Passo 0 i moltiplicatori possono essere scelti liberamente: più sono migliori, meno ripetizioni del Passo 1 sono necessarie. Nel Passo 1, per due variabili, sostituiamo una variabile usando l'equazione e limitiamo l'altra con i vincoli: se i limiti si contraddicono, non esiste alcun punto.

<a id="box-6-ex-x1x2"></a>

!!! esempio "Esempio 4.3: l'ineguaglianza $x_1 + x_2 \le 5$"
    Cerchiamo un'ineguaglianza valida con $\alpha = (1,1)$.

    - <strong>Fase 0.</strong> Con i moltiplicatori $(\frac{1}{14},\frac{1}{14})$ la somma dei vincoli, divisa per $14$, è $x_1 + \frac{9}{7}\,x_2 \le \frac{47}{7}$. I coefficienti sono almeno $(1,1)$, quindi $x_1 + x_2 \le \lfloor \frac{47}{7} \rfloor = 6$, e impostiamo $\beta = 6$.

    - <strong>Passo 1, $\beta = 6$.</strong> Lascia che $x_1 + x_2 = 6$, quindi $x_2 = 6 - x_1$. Il primo vincolo diventa $6\,x_1 + 24 \le 45$, cioè $x_1 \le \frac{7}{2}$, quindi $x_1 \le 3$. Il secondo diventa $84 - 10\,x_1 \le 49$, cioè $x_1 \ge \frac{7}{2}$, quindi $x_1 \ge 4$. I limiti si contraddicono a vicenda: nessun punto fattibile ha $x_1 + x_2 = 6$, e impostiamo $\beta = 5$.

    - <strong>Passo 1, $\beta = 5$.</strong> Lasciate che $x_2 = 5 - x_1$. I vincoli diventano $x_1 \le \frac{25}{6}$, quindi $x_1 \le 4$, e $x_1 \ge \frac{21}{10}$, quindi $x_1 \ge 3$. Non c'è contraddizione, e i punti $(3,2)$ e $(4,1)$ sono fattibili con $x_1 + x_2 = 5$.

    - <strong>Passo 2.</strong> L'ineguaglianza $x_1 + x_2 \le 5$ è valida e stringente.

    Taglia $(\frac{7}{2},\frac{5}{2})$ (la somma è $6$). La nuova rilassamento LP ha la soluzione ottimale $(\frac{25}{6},\frac{5}{6})$ con $z(\LP) = \frac{85}{6}$, quindi il limite superiore è $\lfloor \frac{85}{6} \rfloor = 14$.

    ![Figura 1](../img/04-valid-inequalities/fig01.svg){ .fig .ovale loading=lazy  }

    <em>L'ineguaglianza valida $x_1 + x_2 \le 5$ (verde) esclude il triangolo grigio, che non contiene alcun punto intero, e la soluzione ottimale della precedente rilassamento LP. La nuova soluzione ottimale è $(\frac{25}{6},\frac{5}{6})$ (blu), con $z = \frac{85}{6}$ (linea tratteggiata).</em>

<a id="box-7-ex-x12x2"></a>

!!! esempio "Esempio 4.4: l'ineguaglianza $x_1 + 2\,x_2 \le 7$"
    Cerchiamo un'ineguaglianza valida con $\alpha = (1,2)$.

    - <strong>Passo 0.</strong> Con i moltiplicatori $(\frac{3}{62},\frac{4}{31})$ la combinazione dei vincoli è $x_1 + 2\,x_2 \le \frac{17}{2}$, perché $\frac{3 \cdot 10}{62} + \frac{4 \cdot 4}{31} = 1$, $\frac{3 \cdot 4}{62} + \frac{4 \cdot 14}{31} = 2$ e $\frac{3 \cdot 45}{62} + \frac{4 \cdot 49}{31} = \frac{17}{2}$. Pertanto $x_1 + 2\,x_2 \le \lfloor \frac{17}{2} \rfloor = 8$, e impostiamo $\beta = 8$.

    - <strong>Passo 1, $\beta = 8$.</strong> Lascia $x_1 = 8 - 2\,x_2$. Il primo vincolo diventa $80 - 16\,x_2 \le 45$, quindi $x_2 \ge 3$; il secondo diventa $32 + 6\,x_2 \le 49$, quindi $x_2 \le 2$. Si contraddicono a vicenda, e impostiamo $\beta = 7$.

    - <strong>Fase 1, $\beta = 7$.</strong> Lascia che $x_1 = 7 - 2\,x_2$: le vincoli diventino $70 - 16\,x_2 \le 45$, dunque $x_2 \ge 2$, e $28 + 6\,x_2 \le 49$, dunque $x_2 \le 3$. I punti $(3,2)$ e $(1,3)$ sono fattibili con $x_1 + 2\,x_2 = 7$.

    - <strong>Passo 2.</strong> L'ineguaglianza $x_1 + 2\,x_2 \le 7$ è valida e stringente.

    La nuova rilassamento LP ha la soluzione ottimale $(\frac{31}{8},\frac{25}{16})$ con $z(\LP) = \frac{59}{4}$, quindi il limite superiore è $\lfloor \frac{59}{4} \rfloor = 14$.

    ![Figura 2](../img/04-valid-inequalities/fig02.svg){ .fig .ovale loading=lazy  }

    <em>L'ineguaglianza valida $x_1 + 2\,x_2 \le 7$ (verde) taglia il triangolo grigio, che non contiene punti interi. La nuova soluzione ottimale è $(\frac{31}{8},\frac{25}{16})$ (blu), con $z = \frac{59}{4}$ (linea tratteggiata).</em>

!!! chiave ""
    Con la disuguaglianza valida $x_1 + x_2 \le 5$, o con $x_1 + 2\,x_2 \le 7$, il limite superiore scende da $15$ a $14$. Eguaglia il limite inferiore dato da $(4,1)$: <strong>la soluzione $(4,1)$ è certificata ottimale</strong>, e il divario è zero.

- Le due disuguaglianze, insieme a $x_1 \le 4$ e $x_2 \le 3$, sono esattamente le quattro disuguaglianze della formulazione ideale del capitolo precedente. Per l'esempio dell'auto abbiamo raggiunto l'inviluppo convesso con disuguaglianze valide derivate dai vincoli.

## 4.4 Famiglie di disuguaglianze valide e tagli

- Con due variabili, le direzioni $\alpha$ sono scelte nell'immagine. In generale, le disuguaglianze valide provengono da due fonti.

- Famiglie di disuguaglianze per strutture specifiche dei vincoli, come le <strong>disuguaglianze di copertura</strong> di un vincolo con coefficienti positivi di un problema binario (capitolo successivo).

- La conclusione di questo capitolo, applicata sistematicamente alle righe del dizionario ottimale delil rilassamento LP: i <strong>tagli frazionari di Gomory</strong> dell'algoritmo del piano di taglio, e poi l'algoritmo <strong>branch-and-cut</strong>.

## 4.5 Errori tipici

!!! attenzione "Avviso"
    - <strong>Arrotondamento quando una variabile è continua.</strong> L'arrotondamento di $\eqref{rounding}$ necessita di variabili intere e coefficienti interi $\alpha_j$.

    - <strong>Arrotondare per eccesso invece che per difetto.</strong> Il lato destro è arrotondato <u>per difetto</u>. Arrotondare per eccesso produce un'ineguaglianza che non è valida e può eliminare soluzioni intere.

    - <strong>Credere che ogni disuguaglianza valida migliori il vincolo.</strong> Le disuguaglianze $5\,x_1 + 2\,x_2 \le 22$ e $2\,x_1 + 7\,x_2 \le 24$ eliminano l'ottimo LP, ma lasciano il vincolo a $15$.

    - <strong>Usare moltiplicatori che non sono abbastanza grandi.</strong> I coefficienti combinati devono essere almeno $\alpha_j$ per ogni $j$, e i moltiplicatori devono essere non negativi.

    - <strong>Fermarsi a un lato destro grezzo.</strong> L'ineguaglianza $x_1 + x_2 \le 6$ è valida, ma non elimina l'ottimo LP dell'esempio dell'auto (la sua somma è $6$); l'ineguaglianza stretta $x_1 + x_2 \le 5$ lo fa.

## 4.6 In sintesi

!!! chiave "In sintesi"
    - Un'ineguaglianza valida è soddisfatta da tutte le soluzioni intere ammissibili; può eliminare punti frazionari delil rilassamento LP e rende la formulazione più forte.

    - Moltiplicatori non negativi dei vincoli, con il lato destro arrotondato per difetto, forniscono disuguaglianze valide per i problemi ILP.

    - Abbassare il lato destro fino a quando un punto intero tocca la linea produce un'inequazione stretta.

    - Un'ineguaglianza valida aiuta solo se elimina l'ottimo LP e migliora il limite arrotondato.

    - Nell'esempio dell'auto, $x_1 + x_2 \le 5$ o $x_1 + 2\,x_2 \le 7$ riduce il limite superiore da $15$ a $14$ e certifica che $(4,1)$ è ottimale.

    <strong>Cruscotto dell'esempio di auto.</strong> I limiti su $z(\ILP)$ trovati finora in questo modulo:

    <div class="tabella" markdown="0"><table>
    <tr>
    <th>Capitolo</th>
    <th>Limite inferiore</th>
    <th>Limite superiore</th>
    <th>Da</th>
    </tr>
    <tr>
    <td>Limiti primal e duali</td>
    <td><span class="arithmatex">\(14\)</span></td>
    <td><span class="arithmatex">\(15\)</span></td>
    <td>soluzione euristica <span class="arithmatex">\((4, 1)\)</span>, e <span class="arithmatex">\(\lfloor z(\LP) \rfloor\)</span> con <span class="arithmatex">\(z(\LP) = \tfrac{31}{2}\)</span></td>
    </tr>
    <tr>
    <td>Formulazioni ideali</td>
    <td><span class="arithmatex">\(14\)</span></td>
    <td><span class="arithmatex">\(14\)</span></td>
    <td>formulazione ideale, vertice ottimale <span class="arithmatex">\((4,1)\)</span></td>
    </tr>
    <tr>
    <td>Disuguaglianze valide</td>
    <td><span class="arithmatex">\(14\)</span></td>
    <td><span class="arithmatex">\(14\)</span></td>
    <td><span class="arithmatex">\(x_1 + x_2 \le 5\)</span> dà <span class="arithmatex">\(z(\LP) = \tfrac{85}{6}\)</span></td>
    </tr>
    </table></div>

---

**Esercizi su questo capitolo:** [:material-pencil: Ineguaglianze valide](../exercises/valid-inequalities.md)

<!-- laboratorio-interattivo: sezione generata da interattivi.py -->

## Laboratorio interattivo { #interactive-lab }

Le idee del capitolo, pratica: muovi i cursori e trascina i punti.
Ogni app apre anche una pagina completa nel [laboratorio interattivo](../lab/index.md): [Disuguaglianze valide e involucro convesso](../lab/convex-hull.md).

<div class="gi" data-grafico="pli-involucro"></div>
