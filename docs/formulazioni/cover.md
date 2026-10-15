---
title: "Disuguaglianze di cover"
---

# Disuguaglianze di cover

<div class="info-capitolo" markdown>

**Parte 2 · Rafforzare la formulazione · Capitolo 5** · [:material-file-pdf-box: Dispensa, volume 1 (PDF)](../pdf/dispensa-1-modelli-bound-formulazioni.pdf) · [:material-pencil: Esercizi: Disuguaglianze di cover](../esercizi/cover.md)

</div>

<span class="arithmatex">\(\newcommand{\LPcov}{\mathrm{LP}^{\mathrm{cov}}} \newcommand{\CSP}{\mathrm{ILP}_{\mathrm{CSP}}} \newcommand{\CSPKP}{\mathrm{ILP}^{2}_{\mathrm{CSP}}}\)</span>

!!! nota "Prerequisiti"

    - Da questo modulo, [Capitolo 1 «Programmazione lineare intera»](https://fabiofurini.github.io/integer-linear-programming/models-and-bounds/ilp/) e [Capitolo 2 «Rilassamento lineare»](https://fabiofurini.github.io/integer-linear-programming/models-and-bounds/lp-relaxation/): problemi di PLI, il rilassamento lineare e l'upper bound fornito dal rilassamento lineare.

    - Da questo modulo, [Capitolo 3 «Formulazioni ideali»](https://fabiofurini.github.io/integer-linear-programming/formulations/ideal-formulations/) e [Capitolo 4 «Disuguaglianze valide»](https://fabiofurini.github.io/integer-linear-programming/formulations/valid-inequalities/): l'inviluppo convesso delle soluzioni intere, le disuguaglianze valide e i tagli che rimuovono punti frazionari.

    - Il rilassamento lineare di un problema binario con un vincolo, risolto inserendo le variabili in ordine non crescente del rapporto $c_j/a_j$ tra i coefficienti dell'obiettivo e del vincolo (regola di Dantzig).

!!! chiave "Obiettivi"

    Alla fine di questo capitolo sarai in grado di:

    - scrivere le disuguaglianze di copertura di un vincolo $\le$ con coefficienti positivi di un MIP binario e dimostrare che sono valide;

    - elencare le coperture e le coperture minimali di un'istanza, e descrivere la chiusura delle coperture;

    - separare una disuguaglianza di copertura da un punto frazionario risolvendo un problema di separazione delle coperture, in modo esatto o con l'algoritmo euristico greedy;

    - rafforzare una disuguaglianza di copertura in una disuguaglianza di copertura estesa;

    - calcolare la violazione di una disuguaglianza di copertura e la distanza di un punto da essa.

## 5.1 Un vincolo con coefficienti positivi e il suo rilassamento lineare

<a id="box-1-def-posconstr"></a>

!!! definizione "Definizione 5.1: vincolo con coefficienti positivi di un MIP binario"

    Date le variabili binarie $x_j$, per $j \in \mathscr{I} = \{1,2,\ldots,n\}$, i coefficienti interi $a_j \in \Z_{\ge 1}$ e un termine noto $b \in \Z_{\ge 1}$, consideriamo il vincolo

    <a id="eq-model-main"></a>

    \begin{align*}
    \sum_{j\in\mathscr{I}}a_jx_j&\le b, \label{eq:main} \tag{5.1a}\\
    x_j&\in\{0,1\}, &\forall j\in\mathscr{I}. \label{eq:binary} \tag{5.1b}
    \end{align*}

    Il suo insieme delle soluzioni ammissibili è

    \begin{equation*}
    \label{eq:binary-feasible-set}
    X=\left\{\vet x\in\{0,1\}^n:
    \sum_{j\in\mathscr{I}}a_jx_j\le b\right\}, \tag{5.2}
    \end{equation*}

    e il suo rilassamento lineare è

    \begin{equation*}
    \label{eq:relaxation}
    P=\left\{\vet x\in[0,1]^n:
    \sum_{j\in\mathscr{I}}a_jx_j\le b\right\}. \tag{5.3}
    \end{equation*}

- I vincoli di questo tipo si chiamano <strong>vincoli di zaino</strong> o <strong>vincoli di budget</strong>.

- Supponiamo che

    $$
    a_j \le b ~~~~\text{per ogni}~~~~ j \in \mathscr{I} ~~~~~~~\text{e}~~~~~~~ \sum_{j \in \mathscr{I}} a_j>b.
    $$

    La prima ipotesi garantisce che ogni variabile possa essere posta a $1$, la seconda che non possano essere poste tutte a $1$ insieme.

- $X$ è un insieme finito di punti binari, e una descrizione esatta del suo inviluppo convesso $\operatorname{conv}(X)$ è in generale difficile da ottenere. L'obiettivo è rafforzare $P$ rimuovendo punti frazionari senza rimuovere alcun punto di $X$.

- Un MIP può contenere più vincoli di questo tipo, e altri vincoli ancora. Le disuguaglianze valide per $X$ restano valide quando si impongono altri vincoli.

!!! chiave ""

    Con i coefficienti dell'obiettivo $c_j$, massimizzare $\sum_{j\in\mathscr{I}}c_jx_j$ su $P$ fornisce un upper bound per il problema intero di massimizzazione; le disuguaglianze valide per $X$ possono migliorare questo upper bound.

## 5.2 Coperture e disuguaglianze di copertura

<a id="box-2-def-cover"></a>

!!! definizione "Definizione 5.2: Copertura e insieme di tutte le coperture"

    Una <em>copertura</em> (cover) è un sottoinsieme $C\subseteq\mathscr{I}$ il cui coefficiente totale $\sum_{j\in C}a_j$ supera il termine noto $b$. L'insieme di tutte le coperture è

    \begin{equation*}
    \label{eq:covers}
    \mathcal{C}=\left\{C\subseteq\mathscr{I}:
    \sum_{j\in C}a_j>b\right\}. \tag{5.4}
    \end{equation*}

    Poiché i coefficienti e il termine noto sono interi, la condizione equivale a $\sum_{j\in C}a_j\ge b+1$.

<a id="box-3-def-inequality"></a>

!!! definizione "Definizione 5.3: Disuguaglianza di copertura"

    Data $C\in\mathcal{C}$, la <em>disuguaglianza di copertura</em> associata è

    \begin{equation*}
    \label{eq:cover-cut}
    \sum_{j\in C}x_j\le |C|-1. \tag{5.5}
    \end{equation*}

<a id="box-4-prop-cover-validity"></a>

!!! teorema "Proposizione 5.4"

    Per ogni copertura $C\in\mathcal{C}$, la disuguaglianza di copertura $\eqref{eq:cover-cut}$ è valida per $X$.

??? dimostrazione "Dimostrazione"

    Supponiamo che un punto $\vet x\in X$ violi $\eqref{eq:cover-cut}$. La somma di $|C|$ variabili binarie è allora maggiore di $|C|-1$, quindi $x_j=1$ per ogni $j\in C$. Poiché tutti i coefficienti sono positivi,

    $$
    \sum_{j\in\mathscr{I}}a_jx_j\ge\sum_{j\in C}a_j>b.
    $$

    Questo contraddice il vincolo $\eqref{eq:main}$: al più $|C|-1$ variabili di $C$ possono valere $1$ insieme. <span class="qed">□</span>

### 5.2.1 Coperture minimali

<a id="box-5-def-minimal"></a>

!!! definizione "Definizione 5.5: Copertura minimale"

    Una copertura $C$ è <em>minimale</em> se nessun sottoinsieme proprio di $C$ è una copertura. In modo equivalente,

    \begin{equation*}
    \label{eq:minimal}
    \sum_{j\in C}a_j>b,\qquad
    \sum_{j\in C}a_j-a_i\le b\quad\forall i\in C. \tag{5.6}
    \end{equation*}

- Poiché i coefficienti sono positivi, basta rimuovere una variabile alla volta: se ciascuno di questi $|C|$ sottoinsiemi soddisfa il vincolo, anche ogni sottoinsieme più piccolo lo soddisfa.

<a id="box-6-prop-minimal-covers-suffice"></a>

!!! teorema "Proposizione 5.6"

    Le disuguaglianze delle coperture minimali, insieme agli upper bound $x_j\le1$ per ogni $j\in\mathscr{I}$, implicano ogni disuguaglianza di copertura.

??? dimostrazione "Dimostrazione"

    Partendo da una copertura $C$, rimuoviamo variabili finché l'insieme rimanente è ancora una copertura: otteniamo una copertura minimale $D\subseteq C$. Sommando la disuguaglianza di copertura di $D$ e gli upper bound delle variabili in $C\setminus D$ otteniamo

    $$
    \sum_{j\in C}x_j
    =\sum_{j\in D}x_j+\sum_{j\in C\setminus D}x_j
    \le |D|-1+|C\setminus D|=|C|-1.\qedhere
    $$

    <p class="qed-riga"><span class="qed">□</span></p>

### 5.2.2 La chiusura delle coperture

<a id="box-7-def-closure"></a>

!!! definizione "Definizione 5.7: Chiusura delle coperture"

    La <em>chiusura delle coperture</em> di $P$ è il poliedro

    \begin{equation*}
    \label{eq:closure}
    P^{\mathrm{cov}}=
    \left\{\vet x\in P:
    \sum_{j\in C}x_j\le |C|-1\quad\forall C\in\mathcal{C}\right\}. \tag{5.7}
    \end{equation*}

- Poiché tutte le disuguaglianze di copertura sono valide,

    $$
    \operatorname{conv}(X)\subseteq P^{\mathrm{cov}}\subseteq P,
    $$

    e in generale la prima inclusione è stretta.

- Per la [Proposizione 5.6](#box-6-prop-minimal-covers-suffice), le disuguaglianze delle coperture minimali bastano a descrivere $P^{\mathrm{cov}}$.

- Il numero di coperture può essere esponenziale in $n$. Per esempio, se $a_j=1$ per ogni $j\in\mathscr{I}$ e $b=1$, ogni sottoinsieme con almeno due indici è una copertura, cioè ci sono $2^n-n-1$ coperture. Anche le coperture minimali possono essere in numero esponenziale: per $a_j=1$ per ogni $j\in\mathscr{I}$, $n=2m$ e $b=m$, sono i $\binom{2m}{m+1}$ sottoinsiemi di $m+1$ indici.

- Per questo le disuguaglianze di copertura non si aggiungono tutte insieme: si aggiungono solo quando sono violate, cioè si <em>separano</em> (Sezione [5.4](#sez-sec-separation)).

<a id="box-8-ex-guide"></a>

!!! esempio "Esempio 5.1: Un problema binario con un vincolo di questa forma"

    Consideriamo $\mathscr{I}=\{1,2,3,4\}$, il termine noto $b=9$, e i seguenti coefficienti dell'obiettivo $c_j$ e coefficienti del vincolo $a_j$.

    $$
    \begin{array}{l|rrrr}
    \hline {j} & 1 & 2 & 3 & 4 \\
    \hline {c_j} & 6 & 5 & 8 & 9 \\
    {a_j} & 2 & 3 & 6 & 7 \\
    \hline
    \end{array}
    $$

    Il modello $\LP$ associato è:

    $$
    \begin{array}{rrcrcrcrcl}
    {\max} & {6\,x_1} & {+} & {5\,x_2} & {+} & {8\,x_3} & {+} & {9\,x_4} &  &  \\[1ex]
    \text{soggetto a} & {2\,x_1} & {+} & {3\,x_2} & {+} & {6\,x_3} & {+} & {7\,x_4} & {\le} & {9} \\[1ex]
    & {x_1} &  &  &  &  &  &  & {\le} & {1} \\[0.5ex]
    &  &  & {x_2} &  &  &  &  & {\le} & {1} \\[0.5ex]
    &  &  &  &  & {x_3} &  &  & {\le} & {1} \\[0.5ex]
    &  &  &  &  &  &  & {x_4} & {\le} & {1} \\[0.5ex]
    & {x_1,} &  & {x_2,} &  & {x_3,} &  & {x_4} & {\ge} & {0}
    \end{array}
    $$

    I rapporti $c_j/a_j$ sono $3,5/3,4/3,9/7$, in ordine non crescente. La regola di Dantzig pone a $1$ le variabili in questo ordine, finché il vincolo è soddisfatto, e assegna alla prima variabile che lo violerebbe il massimo valore frazionario consentito: si ottiene così una soluzione ottima di $\LP$. Una soluzione ottima $\tilde{\vet x}(\LP)$ è:

    $$
    \tilde{x}_1=\tilde{x}_2=1,\qquad
    \tilde{x}_3=\frac23,\qquad \tilde{x}_4=0.
    $$

    Il valore ottimo $z(\LP)$ è $6+5+8(2/3)=49/3$.

<a id="box-9-ex-guide-closure"></a>

!!! esempio "Esempio 5.2: La chiusura delle coperture dell'istanza a quattro variabili"

    L'istanza dell'[Esempio 5.1](#box-8-ex-guide) ha le seguenti sette coperture.

    <div class="tabella" markdown="0"><table>
    <tr>
    <th><span class="arithmatex">\(C\)</span></th>
    <th><span class="arithmatex">\(\sum_{j\in C}a_j\)</span></th>
    <th><span class="arithmatex">\(|C|\)</span></th>
    <th>Disuguaglianza di copertura</th>
    <th>Minimale</th>
    </tr>
    <tr>
    <td><span class="arithmatex">\(\{2,4\}\)</span></td>
    <td><span class="arithmatex">\(10\)</span></td>
    <td><span class="arithmatex">\(2\)</span></td>
    <td><span class="arithmatex">\(x_2+x_4\le 1\)</span></td>
    <td>sì</td>
    </tr>
    <tr>
    <td><span class="arithmatex">\(\{3,4\}\)</span></td>
    <td><span class="arithmatex">\(13\)</span></td>
    <td><span class="arithmatex">\(2\)</span></td>
    <td><span class="arithmatex">\(x_3+x_4\le 1\)</span></td>
    <td>sì</td>
    </tr>
    <tr>
    <td><span class="arithmatex">\(\{1,2,3\}\)</span></td>
    <td><span class="arithmatex">\(11\)</span></td>
    <td><span class="arithmatex">\(3\)</span></td>
    <td><span class="arithmatex">\(x_1+x_2+x_3\le 2\)</span></td>
    <td>sì</td>
    </tr>
    <tr>
    <td><span class="arithmatex">\(\{1,2,4\}\)</span></td>
    <td><span class="arithmatex">\(12\)</span></td>
    <td><span class="arithmatex">\(3\)</span></td>
    <td><span class="arithmatex">\(x_1+x_2+x_4\le 2\)</span></td>
    <td>no</td>
    </tr>
    <tr>
    <td><span class="arithmatex">\(\{1,3,4\}\)</span></td>
    <td><span class="arithmatex">\(15\)</span></td>
    <td><span class="arithmatex">\(3\)</span></td>
    <td><span class="arithmatex">\(x_1+x_3+x_4\le 2\)</span></td>
    <td>no</td>
    </tr>
    <tr>
    <td><span class="arithmatex">\(\{2,3,4\}\)</span></td>
    <td><span class="arithmatex">\(16\)</span></td>
    <td><span class="arithmatex">\(3\)</span></td>
    <td><span class="arithmatex">\(x_2+x_3+x_4\le 2\)</span></td>
    <td>no</td>
    </tr>
    <tr>
    <td><span class="arithmatex">\(\{1,2,3,4\}\)</span></td>
    <td><span class="arithmatex">\(18\)</span></td>
    <td><span class="arithmatex">\(4\)</span></td>
    <td><span class="arithmatex">\(x_1+x_2+x_3+x_4\le 3\)</span></td>
    <td>no</td>
    </tr>
    </table></div>

    Solo le prime tre coperture sono minimali; le loro disuguaglianze descrivono già la chiusura delle coperture. Indichiamo con $\LPcov$ l'LP ottenuto aggiungendole a $\LP$. Una soluzione ottima $\tilde{\vet x}(\LPcov)$ è:

    $$
    \tilde{x}_1=1,\qquad \tilde{x}_2=\frac35,\qquad
    \tilde{x}_3=\frac25,\qquad \tilde{x}_4=\frac25.
    $$

    Il valore ottimo è $z(\LPcov)=79/5<z(\LP)=49/3$.

## 5.3 Interpretazione geometrica { #sez-sec-geometry }

- Tutte le coordinate nelle figure sono i valori effettivi delle variabili. Le tacche indicano le coordinate del punto blu e dei vertici principali; alcuni vertici non hanno tacca, per lasciare leggibili gli assi. In 3D, gli spigoli tratteggiati sono nascosti dietro le facce visibili.

- Ogni passo è illustrato sia in due sia in tre dimensioni, con gli stessi colori in tutte le figure: la regione rossa è la regione continua considerata; il verde indica una disuguaglianza di copertura (un lato in 2D, una faccia in 3D); i punti neri sono i punti binari ammissibili; il punto blu è il punto frazionario discusso nel testo.

- Consideriamo prima solo il dominio, $[0,1]^2$ o $[0,1]^3$: nei due esempi che seguono non imponiamo alcun vincolo oltre ai limiti delle variabili.

<a id="box-10-ex-square"></a>

!!! esempio "Esempio 5.3: Una disuguaglianza di copertura nel quadrato unitario"

    In $[0,1]^2$, la disuguaglianza $x_1+x_2\le1$ rimuove solo il punto binario $(1,1)$ e conserva i punti binari $(0,0)$, $(1,0)$ e $(0,1)$.

    ![Figura 1](../img/05-cover/fig01.svg){ .fig .ovale loading=lazy  }

    Quadrato unitario: solo il dominio.

    ![Figura 2](../img/05-cover/fig02.svg){ .fig .ovale loading=lazy  }

    Dominio con $x_1+x_2\le1$.

<a id="box-11-ex-cube"></a>

!!! esempio "Esempio 5.4: Disuguaglianze di copertura nel cubo unitario"

    - In $[0,1]^3$, la disuguaglianza $x_1+x_2\le1$ non dipende da $x_3$; la sua frontiera è parallela all'asse $x_3$. Allo stesso modo, la frontiera di $x_1+x_3\le1$ è parallela all'asse $x_2$.

    - I due semispazi rimuovono porzioni diverse del cubo. La loro intersezione conserva esattamente i punti binari $(0,0,0),(1,0,0),(0,1,0),(0,0,1),(0,1,1)$.

    - La disuguaglianza $x_1+x_2+x_3\le2$ rimuove solo il punto binario $x_1=x_2=x_3=1$.

    ![Figura 3](../img/05-cover/fig03.svg){ .fig .ovale loading=lazy  }

    Dominio con $x_1+x_2\le1$.

    ![Figura 4](../img/05-cover/fig04.svg){ .fig .ovale loading=lazy  }

    Dominio con $x_1+x_3\le1$.

    ![Figura 5](../img/05-cover/fig05.svg){ .fig .ovale loading=lazy  }

    Dominio con entrambe le disuguaglianze.

    ![Figura 6](../img/05-cover/fig06.svg){ .fig .ovale loading=lazy  }

    Dominio con $x_1+x_2+x_3\le2$.

<a id="box-12-ex-2d"></a>

!!! esempio "Esempio 5.5: Una copertura in due dimensioni"

    Per $\mathscr{I}=\{1,2\}$, consideriamo

    $$
    P_2=\{\vet x\in[0,1]^2:10x_1+5x_2\le12\}.
    $$

    La copertura $C=\{1,2\}$ dà $x_1+x_2\le1$. Il punto $\tilde{x}_1=1$, $\tilde{x}_2=2/5$ soddisfa il vincolo all'uguaglianza, ma viola la disuguaglianza di copertura di $2/5$. Il poligono originale ha vertici

    $$
    (0,0),\ (1,0),\ (1,2/5),\ (7/10,1),\ (0,1).
    $$

    Dopo l'aggiunta del taglio, la regione è il triangolo di vertici $(0,0),(1,0),(0,1)$. Quindi tutti e tre i punti binari ammissibili sono conservati, e il vincolo diventa ridondante, poiché $10x_1+5x_2\le10<12$ sul triangolo.

    ![Figura 7](../img/05-cover/fig07.svg){ .fig .ovale loading=lazy  }

    $P_2$ originale e la frontiera $x_1+x_2=1$.

    ![Figura 8](../img/05-cover/fig08.svg){ .fig .ovale loading=lazy  }

    $P_2\cap\{x_1+x_2\le1\}$: il punto blu è rimosso.

<a id="box-13-ex-3d-a"></a>

!!! esempio "Esempio 5.6: Tagli di copertura successivi"

    Per $\mathscr{I}=\{1,2,3\}$, sia

    $$
    P_A=\{\vet x\in[0,1]^3:10x_1+5x_2+6x_3\le12\}.
    $$

    Ci sono esattamente tre coperture:

    $$
    \begin{array}{ccl}
    \{1,2,3\}&:&x_1+x_2+x_3\le2,\\
    \{1,3\}&:&x_1+x_3\le1,\\
    \{1,2\}&:&x_1+x_2\le1.
    \end{array}
    $$

    Solo le ultime due sono minimali. Il punto blu $\tilde{x}_1=1$, $\tilde{x}_2=2/5$, $\tilde{x}_3=0$ appartiene a $P_A$. Soddisfa la prima disuguaglianza ed è sulla frontiera della seconda; la terza è violata di $2/5$, esattamente come nell'[Esempio 5.5](#box-12-ex-2d). A differenza dei riquadri precedenti, che mostravano solo il dominio, ogni riquadro che segue include il vincolo $10x_1+5x_2+6x_3\le12$.

    ![Figura 9](../img/05-cover/fig09.svg){ .fig .ovale loading=lazy  }

    $P_A$ originale.

    ![Figura 10](../img/05-cover/fig10.svg){ .fig .ovale loading=lazy  }

    Aggiungiamo $x_1+x_2+x_3\le2$.

    ![Figura 11](../img/05-cover/fig11.svg){ .fig .ovale loading=lazy  }

    Aggiungiamo anche $x_1+x_3\le1$.

    ![Figura 12](../img/05-cover/fig12.svg){ .fig .ovale loading=lazy  }

    Aggiungiamo anche $x_1+x_2\le1$: la chiusura delle coperture.

    - Per l'obiettivo $\max\,40x_1+15x_2+12x_3$, la soluzione ottima su $P_A$ è $\tilde{\vet x}=(1,2/5,0)$, di valore $46$. Sulla chiusura delle coperture, la soluzione ottima è $(1,0,0)$, di valore $40$, che è ottima anche per il problema binario.

    - In questa istanza la chiusura delle coperture coincide con $\operatorname{conv}(X)$: i suoi vertici, mostrati nell'ultimo riquadro, sono tutti binari. È una proprietà di questa istanza, non di ogni chiusura delle coperture.

<a id="box-14-ex-3d-b"></a>

!!! esempio "Esempio 5.7: Un vincolo diverso"

    Per $\mathscr{I}=\{1,2,3\}$, consideriamo ora l'istanza

    $$
    P_B=\{\vet x\in[0,1]^3:5x_1+4x_2+6x_3\le12\}.
    $$

    Ogni coppia di variabili soddisfa il vincolo, mentre i tre coefficienti hanno somma $15>12$. Quindi l'unica copertura è $\{1,2,3\}$, ed è minimale. La sua disuguaglianza è $x_1+x_2+x_3\le2$. Il punto blu $\tilde{x}_1=\tilde{x}_2=1$, $\tilde{x}_3=1/2$ ha membro sinistro $12$ e viola questo taglio di $1/2$.

    ![Figura 13](../img/05-cover/fig13.svg){ .fig .ovale loading=lazy  }

    $P_B$ originale.

    ![Figura 14](../img/05-cover/fig14.svg){ .fig .ovale loading=lazy  }

    $P_B\cap\{x_1+x_2+x_3\le2\}$.

    - Il piano del vincolo interseca gli spigoli del cubo in $(1,1,1/2)$, $(1,1/4,1)$ e $(2/5,1,1)$.

    - La disuguaglianza di copertura rimuove questi vertici frazionari e conserva tutti e sette i punti binari ammissibili. Come nell'esempio in 2D, dopo il taglio il vincolo è ridondante: la somma dei due coefficienti più grandi è $6+5=11<12$.

    - Il poliedro $P_B\cap\{x_1+x_2+x_3\le2\}$ ha solo vertici binari (ultimo riquadro): qui una sola disuguaglianza di copertura dà $\operatorname{conv}(X)$.

## 5.4 Separazione delle disuguaglianze di copertura { #sez-sec-separation }

!!! chiave ""

    Dato un punto $\tilde{\vet x}\in P$, il <strong>problema di separazione delle coperture</strong> (CSP, cover separation problem) consiste nel trovare una disuguaglianza di copertura violata da $\tilde{\vet x}$, o nel dimostrare che $\tilde{\vet x}$ soddisfa tutte le disuguaglianze di copertura.

    Formalmente, il CSP chiede di trovare una copertura

    $$
    C\in\mathcal{C}:\qquad \sum_{j\in C}\tilde{x}_j>|C|-1,
    $$

    o di dimostrare che

    $$
    \sum_{j\in C}\tilde{x}_j\le|C|-1\qquad\forall\, C\in\mathcal{C}.
    $$

- Di solito $\tilde{\vet x}$ è una soluzione ottima del rilassamento lineare corrente, ma si può separare qualunque punto di $P$.

- Per una copertura $C$, la disuguaglianza di copertura è violata da $\tilde{\vet x}$ se

    \begin{equation*}
    \label{eq:violated}
    \sum_{j\in C}\tilde{x}_j>|C|-1. \tag{5.8}
    \end{equation*}

    Portando $\sum_{j\in C}\tilde{x}_j$ al membro destro e $1$ al membro sinistro, e scrivendo $|C|=\sum_{j\in C}1$, otteniamo le condizioni equivalenti:

    \begin{align*}
    |C|-\sum_{j\in C}\tilde{x}_j&<1, \\
    \sum_{j\in C}1-\sum_{j\in C}\tilde{x}_j&<1, \\
    \sum_{j\in C}(1-\tilde{x}_j)&<1. \label{eq:cost-test} \tag{5.9}
    \end{align*}

- Assegnando a ogni indice $j$ il costo $q_j=1-\tilde{x}_j\ge0$, il CSP consiste nel trovare una copertura di <em>costo minimo</em>: esiste una disuguaglianza di copertura violata se e solo se questo costo minimo è minore di $1$.

### 5.4.1 Una formulazione di PLI per il CSP

- Introduciamo $n$ variabili binarie $z_j$: $z_j=1$ se $j$ appartiene alla copertura e $z_j=0$ altrimenti.

- L'obiettivo minimizza il costo totale della copertura; l'unico vincolo impone che l'insieme scelto sia una copertura.

!!! chiave ""

    <a id="eq-model-csp"></a>

    \begin{align*}
    (\CSP)\qquad
    \min\quad\sum_{j\in\mathscr{I}}(1-\tilde{x}_j)z_j
    \label{eq:csp-obj} \tag{5.10a}\\
    \text{soggetto a}\quad\sum_{j\in\mathscr{I}}a_jz_j&\ge b+1,
    \label{eq:csp-constraint} \tag{5.10b}\\
    z_j&\in\{0,1\},&\forall j\in\mathscr{I}.
    \label{eq:csp-domain} \tag{5.10c}
    \end{align*}

<a id="box-15-prop-csp-separation"></a>

!!! teorema "Proposizione 5.8"

    Esiste una disuguaglianza di copertura violata da $\tilde{\vet x}$ se e solo se $z(\CSP)<1$.

??? dimostrazione "Dimostrazione"

    Ogni assegnamento ammissibile delle variabili binarie $z_j$ rappresenta una copertura $C=\{j:z_j=1\}$, e il suo valore dell'obiettivo è $\sum_{j\in C}(1-\tilde{x}_j)$. Per la $\eqref{eq:cost-test}$, questo valore è minore di $1$ esattamente quando il taglio corrispondente è violato. Prendendo il minimo su tutte le coperture si dimostrano entrambe le implicazioni. Il CSP è ammissibile perché $\mathscr{I}$ stesso è una copertura. <span class="qed">□</span>

!!! chiave ""

    Sia $\tilde{z}_1,\tilde{z}_2,\dots,\tilde{z}_n$ una soluzione ottima di $\CSP$. Se $z(\CSP)<1$, la copertura

    $$
    \tilde{C}=\big\{j\in\mathscr{I}:\ \tilde{z}_j=1\big\}
    $$

    è associata alla disuguaglianza di copertura $\sum_{j\in\tilde{C}}x_j\le|\tilde{C}|-1$ massimamente violata da $\tilde{\vet x}$. Altrimenti, nessuna disuguaglianza di copertura è violata da $\tilde{\vet x}$.

- Per trovare una disuguaglianza di copertura violata non è necessario risolvere $\CSP$ all'ottimo: qualunque soluzione ammissibile $\bar{z}_1,\dots,\bar{z}_n$ di costo minore di $1$ fornisce la copertura $\bar{C}=\{j\in\mathscr{I}:\ \bar{z}_j=1\}$, la cui disuguaglianza di copertura è violata da $\tilde{\vet x}$.

- Al contrario, una soluzione ammissibile di costo almeno $1$ <em>non</em> dimostra che non esistano disuguaglianze di copertura violate: per questo serve il valore ottimo (o un lower bound) di $\CSP$.

- Se $z(\CSP)<1$, la massima violazione di una disuguaglianza di copertura in $\tilde{\vet x}$ è $1-z(\CSP)$.

<a id="box-16-ex-guide-csp"></a>

!!! esempio "Esempio 5.8: Separazione delle disuguaglianze di copertura"

    Riprendiamo l'[Esempio 5.1](#box-8-ex-guide). Le disuguaglianze di copertura si separano in modo iterativo: a ogni iterazione si risolve l'LP corrente, si risolve $\CSP$ per la sua soluzione ottima $\tilde{\vet x}$ e si aggiunge la disuguaglianza di copertura massimamente violata, finché nessuna disuguaglianza di copertura è violata.

    <span style="color:#e03131"><strong>Iterazione 1.</strong></span> Una soluzione ottima di $\LP$ è

    $$
    \tilde{x}_1=1,\qquad \tilde{x}_2=1,\qquad \tilde{x}_3=\frac23,\qquad
    \tilde{x}_4=0,\qquad z(\LP)=\frac{49}{3}.
    $$

    Il $\CSP$ associato è:

    $$
    \begin{array}{rrcrcrcrcl}
    {\min} &  &  &  &  & {\frac{1}{3}\,z_3} & {+} & {z_4} &  &  \\[1ex]
    \text{soggetto a} & {2\,z_1} & {+} & {3\,z_2} & {+} & {6\,z_3} & {+} & {7\,z_4} & {\ge} & {10} \\[1ex]
    & {z_1,} &  & {z_2,} &  & {z_3,} &  & {z_4} & {\in} & {\{0,1\}}
    \end{array}
    $$

    Una soluzione ottima di $\CSP$ è $\tilde{z}_1=\tilde{z}_2=\tilde{z}_3=1$, $\tilde{z}_4=0$, di valore $z(\CSP)=\frac13<1$. Di conseguenza, $\tilde{C}=\{j\in\mathscr{I}:\tilde{z}_j=1\}=\{1,2,3\}$ è la copertura associata alla disuguaglianza di copertura massimamente violata da $\tilde{\vet x}$:

    $$
    x_1+x_2+x_3\le 2,
    \qquad\textrm{poiché}\qquad
    \tilde{x}_1+\tilde{x}_2+\tilde{x}_3=1+1+\frac23=\frac83>2.
    $$

    <span style="color:#e03131"><strong>Iterazione 2.</strong></span> Aggiungendo questa disuguaglianza di copertura a $\LP$, otteniamo il seguente LP, indicato con $\LP_1$:

    $$
    \begin{array}{rrcrcrcrcl}
    {\max} & {6\,x_1} & {+} & {5\,x_2} & {+} & {8\,x_3} & {+} & {9\,x_4} &  &  \\[1ex]
    \text{soggetto a} & {2\,x_1} & {+} & {3\,x_2} & {+} & {6\,x_3} & {+} & {7\,x_4} & {\le} & {9} \\[1ex]
    & {x_1} & {+} & {x_2} & {+} & {x_3} &  &  & {\le} & {2} \\[1ex]
    & {x_1} &  &  &  &  &  &  & {\le} & {1} \\[0.5ex]
    &  &  & {x_2} &  &  &  &  & {\le} & {1} \\[0.5ex]
    &  &  &  &  & {x_3} &  &  & {\le} & {1} \\[0.5ex]
    &  &  &  &  &  &  & {x_4} & {\le} & {1} \\[0.5ex]
    & {x_1,} &  & {x_2,} &  & {x_3,} &  & {x_4} & {\ge} & {0}
    \end{array}
    $$

    Una soluzione ottima di $\LP_1$ è

    $$
    \tilde{x}_1=1,\qquad \tilde{x}_2=1,\qquad \tilde{x}_3=0,\qquad
    \tilde{x}_4=\frac47,\qquad z(\LP_1)=\frac{113}{7}.
    $$

    Il $\CSP$ associato è:

    $$
    \begin{array}{rrcrcrcrcl}
    {\min} &  &  &  &  & {z_3} & {+} & {\frac{3}{7}\,z_4} &  &  \\[1ex]
    \text{soggetto a} & {2\,z_1} & {+} & {3\,z_2} & {+} & {6\,z_3} & {+} & {7\,z_4} & {\ge} & {10} \\[1ex]
    & {z_1,} &  & {z_2,} &  & {z_3,} &  & {z_4} & {\in} & {\{0,1\}}
    \end{array}
    $$

    Una soluzione ottima di $\CSP$ è $\tilde{z}_1=0$, $\tilde{z}_2=1$, $\tilde{z}_3=0$, $\tilde{z}_4=1$, di valore $z(\CSP)=\frac37<1$ (la copertura $\{1,2,4\}$ ha lo stesso costo; scegliamo la copertura minimale). Di conseguenza, $\tilde{C}=\{j\in\mathscr{I}:\tilde{z}_j=1\}=\{2,4\}$ e la disuguaglianza di copertura massimamente violata è

    $$
    x_2+x_4\le 1,
    \qquad\textrm{poiché}\qquad
    \tilde{x}_2+\tilde{x}_4=1+\frac47=\frac{11}{7}>1.
    $$

    <span style="color:#e03131"><strong>Iterazione 3.</strong></span> Aggiungendo questa disuguaglianza di copertura a $\LP_1$, otteniamo il seguente LP, indicato con $\LP_2$:

    $$
    \begin{array}{rrcrcrcrcl}
    {\max} & {6\,x_1} & {+} & {5\,x_2} & {+} & {8\,x_3} & {+} & {9\,x_4} &  &  \\[1ex]
    \text{soggetto a} & {2\,x_1} & {+} & {3\,x_2} & {+} & {6\,x_3} & {+} & {7\,x_4} & {\le} & {9} \\[1ex]
    & {x_1} & {+} & {x_2} & {+} & {x_3} &  &  & {\le} & {2} \\[1ex]
    &  &  & {x_2} &  &  & {+} & {x_4} & {\le} & {1} \\[1ex]
    & {x_1} &  &  &  &  &  &  & {\le} & {1} \\[0.5ex]
    &  &  & {x_2} &  &  &  &  & {\le} & {1} \\[0.5ex]
    &  &  &  &  & {x_3} &  &  & {\le} & {1} \\[0.5ex]
    &  &  &  &  &  &  & {x_4} & {\le} & {1} \\[0.5ex]
    & {x_1,} &  & {x_2,} &  & {x_3,} &  & {x_4} & {\ge} & {0}
    \end{array}
    $$

    Una soluzione ottima di $\LP_2$ è

    $$
    \tilde{x}_1=1,\qquad \tilde{x}_2=\frac35,\qquad \tilde{x}_3=\frac25,\qquad
    \tilde{x}_4=\frac25,\qquad z(\LP_2)=\frac{79}{5}.
    $$

    Il $\CSP$ associato è:

    $$
    \begin{array}{rrcrcrcrcl}
    {\min} &  &  & {\frac{2}{5}\,z_2} & {+} & {\frac{3}{5}\,z_3} & {+} & {\frac{3}{5}\,z_4} &  &  \\[1ex]
    \text{soggetto a} & {2\,z_1} & {+} & {3\,z_2} & {+} & {6\,z_3} & {+} & {7\,z_4} & {\ge} & {10} \\[1ex]
    & {z_1,} &  & {z_2,} &  & {z_3,} &  & {z_4} & {\in} & {\{0,1\}}
    \end{array}
    $$

    Una soluzione ottima di $\CSP$ è $\tilde{z}_1=0$, $\tilde{z}_2=1$, $\tilde{z}_3=0$, $\tilde{z}_4=1$, di valore $z(\CSP)=1$ (le coperture $\{1,2,3\}$ e $\{1,2,4\}$ hanno lo stesso costo): <strong>nessuna</strong> disuguaglianza di copertura è violata da $\tilde{\vet x}$, e la separazione si ferma.

    Il valore finale $z(\LP_2)=\frac{79}{5}$ coincide con il valore $z(\LPcov)$ della chiusura delle coperture ([Esempio 5.2](#box-9-ex-guide-closure)): la separazione raggiunge il bound della chiusura delle coperture aggiungendo solo $2$ delle $7$ disuguaglianze di copertura.

    La soluzione $\tilde{\vet x}$ è ancora <strong>frazionaria</strong>, anche se soddisfa tutte le disuguaglianze di copertura: la chiusura delle coperture non coincide, in generale, con l'inviluppo convesso delle soluzioni intere.

## 5.5 Dal CSP a un problema complementare

- Consideriamo un assegnamento ammissibile delle variabili $z_j$ del CSP. Definiamo le variabili binarie complementari $y_j$ ponendo

    $$
    y_j=1-z_j\qquad\forall j\in\mathscr{I}.
    $$

    Quindi $y_j=1$ se $j$ è fuori dalla copertura, mentre $y_j=0$ se $j$ appartiene alla copertura.

- Il vincolo diventa

    $$
    \sum_{j\in\mathscr{I}}a_j(1-y_j)\ge b+1
    \quad\Longleftrightarrow\quad
    \sum_{j\in\mathscr{I}}a_jy_j\le\sum_{j\in\mathscr{I}}a_j-(b+1).
    $$

    Per l'ipotesi $\sum_{j\in\mathscr{I}}a_j>b$, questo termine noto è non negativo.

- L'obiettivo si può scrivere come

    $$
    \sum_{j\in\mathscr{I}}(1-\tilde{x}_j)(1-y_j)
    =n-\sum_{j\in\mathscr{I}}\tilde{x}_j
    -\sum_{j\in\mathscr{I}}(1-\tilde{x}_j)y_j.
    $$

    Poiché i primi due termini sono costanti, minimizzarlo equivale al problema seguente, detto <em>problema complementare</em>, con coefficienti dell'obiettivo non negativi (eventualmente nulli) $1-\tilde{x}_j$.

!!! chiave ""

    <a id="eq-model-complement"></a>

    \begin{align*}
    (\CSPKP)\qquad
    \max\quad\sum_{j\in\mathscr{I}}(1-\tilde{x}_j)y_j
    \label{eq:complement-obj} \tag{5.11a}\\
    \text{soggetto a}\quad\sum_{j\in\mathscr{I}}a_jy_j&\le\sum_{j\in\mathscr{I}}a_j-(b+1),
    \label{eq:complement-constraint} \tag{5.11b}\\
    y_j&\in\{0,1\},&\forall j\in\mathscr{I}.
    \label{eq:complement-domain} \tag{5.11c}
    \end{align*}

- La complementazione è una corrispondenza biunivoca tra le soluzioni ammissibili, quindi

    \begin{equation*}
    \label{eq:values}
    z(\CSP)
    =n-\sum_{j\in\mathscr{I}}\tilde{x}_j-z(\CSPKP). \tag{5.12}
    \end{equation*}

!!! chiave ""

    Sia $\tilde{y}_1,\tilde{y}_2,\dots,\tilde{y}_n$ una soluzione ottima di $\CSPKP$. Se $n-\sum_{j\in\mathscr{I}}\tilde{x}_j-z(\CSPKP)<1$, la copertura

    $$
    \tilde{C}=\big\{j\in\mathscr{I}:\ \tilde{y}_j=0\big\}
    $$

    è associata alla disuguaglianza di copertura $\sum_{j\in\tilde{C}}x_j\le|\tilde{C}|-1$ massimamente violata da $\tilde{\vet x}$. Altrimenti, nessuna disuguaglianza di copertura è violata da $\tilde{\vet x}$.

- Qualunque soluzione ammissibile $\bar{y}_1,\dots,\bar{y}_n$ di $\CSPKP$ fornisce la copertura $\bar{C}=\{j\in\mathscr{I}:\ \bar{y}_j=0\}$, di costo $n-\sum_{j\in\mathscr{I}}\tilde{x}_j-\sum_{j\in\mathscr{I}}(1-\tilde{x}_j)\bar{y}_j$: se questo costo è minore di $1$, la disuguaglianza di copertura di $\bar{C}$ è violata da $\tilde{\vet x}$.

### 5.5.1 Un'euristica greedy di separazione

La seguente procedura greedy costruisce valori ammissibili $\bar{y}_j$ per il problema complementare.

1. Porre $\bar{y}_j=0$ per ogni $j\in\mathscr{I}$ e il termine noto residuo $r=\sum_{j\in\mathscr{I}}a_j-(b+1)$. Ordinare gli indici per rapporto $q_j/a_j=(1-\tilde{x}_j)/a_j$ non crescente, risolvendo i pareggi per indice crescente.

2. Scorrere gli indici in questo ordine. Se $q_j>0$ e $a_j\le r$, porre $\bar{y}_j=1$ e $r:=r-a_j$; altrimenti saltare l'indice.

3. Ricostruire la copertura $C=\{j:\bar{y}_j=0\}$ e valutarne il costo. Se lo si desidera, ridurla a una copertura minimale rimuovendo indici finché $\sum_{j\in C}a_j$ supera $b$.

- Gli indici con $q_j=0$ ($\tilde{x}_j=1$) non vengono mai selezionati: restano nella copertura, che quindi può non essere minimale.

- Rimuovere un indice da una copertura ne diminuisce il costo di $q_j\ge0$: ridurre una copertura violata a una minimale non può diminuirne la violazione.

- L'algoritmo greedy è un'<em>euristica</em> per il problema complementare: se non trova una disuguaglianza di copertura violata, non possiamo concludere che non ne esistano.

<a id="box-17-ex-guide-comp"></a>

!!! esempio "Esempio 5.9: Problema complementare e scansione greedy"

    Per il punto $\tilde{\vet x}=(1,1,\frac23,0)$ dell'Iterazione 1 dell'[Esempio 5.8](#box-16-ex-guide-csp),

    \begin{align*}
    4-\sum_{j\in\mathscr{I}}\tilde{x}_j&=4-1-1-\frac23=\frac43,\\
    \sum_{j\in\mathscr{I}}a_j-(b+1)&=2+3+6+7-(9+1)=8.
    \end{align*}

    Il problema complementare è

    $$
    \begin{array}{rrcrcrcrcl}
    {\max} &  &  &  &  & {\frac{1}{3}\,y_3} & {+} & {y_4} &  &  \\[1ex]
    \text{soggetto a} & {2\,y_1} & {+} & {3\,y_2} & {+} & {6\,y_3} & {+} & {7\,y_4} & {\le} & {8} \\[1ex]
    & {y_1,} &  & {y_2,} &  & {y_3,} &  & {y_4} & {\in} & {\{0,1\}}
    \end{array}
    $$

    <div class="tabella" markdown="0"><table>
    <tr>
    <th><span class="arithmatex">\(j\)</span></th>
    <th><span class="arithmatex">\(q_j\)</span></th>
    <th><span class="arithmatex">\(a_j\)</span></th>
    <th><span class="arithmatex">\(q_j/a_j\)</span></th>
    <th>Decisione</th>
    <th>Residuo</th>
    </tr>
    <tr>
    <td><span class="arithmatex">\(4\)</span></td>
    <td><span class="arithmatex">\(1\)</span></td>
    <td><span class="arithmatex">\(7\)</span></td>
    <td><span class="arithmatex">\(\frac{1}{7}\)</span></td>
    <td><span class="arithmatex">\(\bar{y}_j=1\)</span></td>
    <td><span class="arithmatex">\(1\)</span></td>
    </tr>
    <tr>
    <td><span class="arithmatex">\(3\)</span></td>
    <td><span class="arithmatex">\(\frac{1}{3}\)</span></td>
    <td><span class="arithmatex">\(6\)</span></td>
    <td><span class="arithmatex">\(\frac{1}{18}\)</span></td>
    <td><span class="arithmatex">\(\bar{y}_j=0\)</span></td>
    <td><span class="arithmatex">\(1\)</span></td>
    </tr>
    <tr>
    <td><span class="arithmatex">\(1\)</span></td>
    <td><span class="arithmatex">\(0\)</span></td>
    <td><span class="arithmatex">\(2\)</span></td>
    <td><span class="arithmatex">\(0\)</span></td>
    <td><span class="arithmatex">\(q_j=0\)</span>, <span class="arithmatex">\(\bar{y}_j=0\)</span></td>
    <td><span class="arithmatex">\(1\)</span></td>
    </tr>
    <tr>
    <td><span class="arithmatex">\(2\)</span></td>
    <td><span class="arithmatex">\(0\)</span></td>
    <td><span class="arithmatex">\(3\)</span></td>
    <td><span class="arithmatex">\(0\)</span></td>
    <td><span class="arithmatex">\(q_j=0\)</span>, <span class="arithmatex">\(\bar{y}_j=0\)</span></td>
    <td><span class="arithmatex">\(1\)</span></td>
    </tr>
    </table></div>

    La scansione dà $\bar{y}_1=\bar{y}_2=\bar{y}_3=0$ e $\bar{y}_4=1$, di valore $1$. Gli indici $3$ e $4$ non possono essere presi insieme; le uniche alternative con coefficiente dell'obiettivo positivo hanno valori $1/3$ e $1$. Quindi questa soluzione greedy è anche ottima, e

    $$
    z(\CSP)
    =4-\sum_{j\in\mathscr{I}}\tilde{x}_j-z(\CSPKP)
    =\frac43-1=\frac13.
    $$

    La copertura è $\tilde{C}=\{j\in\mathscr{I}:\tilde{y}_j=0\}=\{1,2,3\}$, come nell'Iterazione 1 dell'[Esempio 5.8](#box-16-ex-guide-csp).

## 5.6 Disuguaglianze di copertura estese

- Una disuguaglianza di copertura si può rafforzare considerando anche le variabili fuori dalla copertura i cui coefficienti sono grandi almeno quanto ogni coefficiente della copertura. Sia

    $$
    \widehat{a}(C)=\max_{j\in C}a_j
    $$

    il massimo coefficiente delle variabili in $C$.

<a id="box-18-def-extended"></a>

!!! definizione "Definizione 5.9: Disuguaglianza di copertura estesa"

    Per una copertura $C$, sia

    $$
    E(C)=C\cup\{j\in\mathscr{I}\setminus C:a_j\ge\widehat{a}(C)\}.
    $$

    La <em>disuguaglianza di copertura estesa</em> associata è

    \begin{equation*}
    \label{eq:extended}
    \sum_{j\in E(C)}x_j\le |C|-1. \tag{5.13}
    \end{equation*}

    Il termine noto dipende da $|C|$, non da $|E(C)|$.

<a id="box-19-prop-extended-cover-validity"></a>

!!! teorema "Proposizione 5.10"

    Per ogni copertura $C\in\mathcal{C}$, la disuguaglianza di copertura estesa $\eqref{eq:extended}$ è valida per $X$.

??? dimostrazione "Dimostrazione"

    Sia $k=|C|$ e prendiamo un qualunque insieme $S\subseteq E(C)$ con $|S|=k$. Gli insiemi $S\setminus C$ e $C\setminus S$ hanno lo stesso numero di variabili, e ogni coefficiente $a_j$ con $j\in S\setminus C$ è almeno $\widehat{a}(C)$, cioè grande almeno quanto ogni coefficiente con $j\in C\setminus S$. Sostituendo gli indici di $C\setminus S$ con quelli di $S\setminus C$ otteniamo

    $$
    \sum_{j\in S}a_j\ge\sum_{j\in C}a_j>b.
    $$

    Quindi nessun punto $\vet x\in X$ può avere $k$ variabili di $E(C)$ uguali a $1$: al più $k-1$ di esse possono valere $1$ insieme. <span class="qed">□</span>

- Poiché $C\subseteq E(C)$ e il termine noto è lo stesso, la disuguaglianza di copertura estesa domina la disuguaglianza di copertura di $C$.

- Si può vedere come un <em>lifting</em> (sollevamento) dei coefficienti delle variabili in $E(C)\setminus C$ da $0$ a $1$. Non vieta a una variabile con un coefficiente grande di valere $1$ insieme a variabili di $C$: limita a $|C|-1$ il numero di variabili dell'intero insieme $E(C)$ uguali a $1$.

<a id="box-20-ex-guide-extended"></a>

!!! esempio "Esempio 5.10: Rafforzare la copertura dell'istanza a quattro variabili"

    Nell'[Esempio 5.1](#box-8-ex-guide), consideriamo la copertura $C=\{1,2,3\}$. Allora $\widehat{a}(C)=6$, e il coefficiente di $x_4$ è $7\ge6$, quindi

    $$
    E(C)=\{1,2,3,4\},\qquad x_1+x_2+x_3+x_4\le2.
    $$

    L'LP rafforzato, indicato con $\LP_{\mathrm{ext}}$, è

    $$
    \begin{array}{rrcrcrcrcl}
    {\max} & {6\,x_1} & {+} & {5\,x_2} & {+} & {8\,x_3} & {+} & {9\,x_4} &  &  \\[1ex]
    \text{soggetto a} & {2\,x_1} & {+} & {3\,x_2} & {+} & {6\,x_3} & {+} & {7\,x_4} & {\le} & {9} \\[1ex]
    & {x_1} & {+} & {x_2} & {+} & {x_3} & {+} & {x_4} & {\le} & {2} \\[1ex]
    & {x_1} &  &  &  &  &  &  & {\le} & {1} \\[0.5ex]
    &  &  & {x_2} &  &  &  &  & {\le} & {1} \\[0.5ex]
    &  &  &  &  & {x_3} &  &  & {\le} & {1} \\[0.5ex]
    &  &  &  &  &  &  & {x_4} & {\le} & {1} \\[0.5ex]
    & {x_1,} &  & {x_2,} &  & {x_3,} &  & {x_4} & {\ge} & {0}
    \end{array}
    $$

    Una soluzione ottima di $\LP_{\mathrm{ext}}$ è $\tilde{\vet x}=(1,0,0,1)$, di valore $z(\LP_{\mathrm{ext}})=6+9=15$. Poiché è binaria, $\tilde{\vet x}$ è ottima anche per il problema binario. Abbiamo $z(\LP_{\mathrm{ext}})=15<z(\LPcov)=79/5$: in questa istanza, una sola disuguaglianza di copertura estesa è più forte di tutte le disuguaglianze di copertura insieme.

## 5.7 Violazione e distanza da una disuguaglianza di copertura

- Sia $C\subseteq\mathscr{I}$ una copertura. La sua disuguaglianza di copertura è

    $$
    \sum_{j\in C}x_j\le |C|-1,
    $$

    e il suo iperpiano di frontiera è

    $$
    H_C=\left\{\vet x\in\mathbb{R}^n:
    \sum_{j\in C}x_j=|C|-1\right\}.
    $$

- La violazione della disuguaglianza di copertura in un punto $\tilde{\vet x}$ è

    \begin{equation*}
    \label{eq:violation}
    v_C(\tilde{\vet x})
    =\max\left\{0,
    \sum_{j\in C}\tilde{x}_j-(|C|-1)\right\}. \tag{5.14}
    \end{equation*}

    Il punto viola la disuguaglianza di copertura esattamente quando $v_C(\tilde{\vet x})>0$.

- I coefficienti della disuguaglianza di copertura sono $1$ per $j\in C$ e $0$ altrimenti, quindi la loro norma euclidea è $\sqrt{|C|}$. Di conseguenza, la distanza euclidea di $\tilde{\vet x}$ da $H_C$ è

    \begin{equation*}
    \label{eq:distance}
    d(\tilde{\vet x},H_C)
    =\frac{\left|\sum_{j\in C}\tilde{x}_j-(|C|-1)\right|}
    {\sqrt{|C|}}. \tag{5.15}
    \end{equation*}

    Se la disuguaglianza di copertura è violata,

    $$
    d(\tilde{\vet x},H_C)=\frac{v_C(\tilde{\vet x})}{\sqrt{|C|}}.
    $$

- La proiezione ortogonale $\vet x^{\perp}$ di $\tilde{\vet x}$ su $H_C$ ha componenti

    \begin{equation*}
    \label{eq:projection}
    x_j^{\perp}
    =\begin{cases}
    \displaystyle
    \tilde{x}_j-
    \dfrac{\sum_{k\in C}\tilde{x}_k-(|C|-1)}{|C|},
    &j\in C,\\[2ex]
    \tilde{x}_j,&j\in\mathscr{I}\setminus C.
    \end{cases} \tag{5.16}
    \end{equation*}

    Infatti, sostituendo si ottiene $\sum_{j\in C}x_j^{\perp}=|C|-1$.

- Il CSP massimizza la violazione, non la distanza: quando le coperture hanno cardinalità diverse, i due criteri possono ordinarle in modo diverso. Per esempio, nel punto $\tilde{\vet x}=(1/10,1,1)$ di $P_A$ ([Esempio 5.6](#box-13-ex-3d-a)), le coperture $\{1,2\}$, $\{1,3\}$ e $\{1,2,3\}$ hanno tutte violazione $1/10$, ma le loro distanze sono rispettivamente $1/(10\sqrt2)$, $1/(10\sqrt2)$ e $1/(10\sqrt3)$.

<a id="box-21-ex-distance"></a>

!!! esempio "Esempio 5.11: Proiezione ortogonale in due dimensioni"

    Prendiamo il vertice $\tilde{x}_1=7/10$, $\tilde{x}_2=1$ di $P_2$ nell'[Esempio 5.5](#box-12-ex-2d) e la copertura $C=\{1,2\}$. La sua disuguaglianza di copertura è $x_1+x_2\le1$ e $|C|=2$. Allora

    $$
    v_C(\tilde{\vet x})=\frac7{10},\qquad
    x_1^{\perp}=\frac7{20},\qquad
    x_2^{\perp}=\frac{13}{20},
    \qquad d(\tilde{\vet x},H_C)=\frac7{10\sqrt2}.
    $$

    La regione rossa è $P_2$ e il lato verde è la frontiera $H_C$. Il segmento blu tratteggiato è perpendicolare a $H_C$ e il punto arancione è la proiezione ortogonale.

    ![Figura 15](../img/05-cover/fig15.svg){ .fig .ovale loading=lazy  }

<a id="box-22-ex-distance3d"></a>

!!! esempio "Esempio 5.12: Proiezione ortogonale in tre dimensioni"

    Prendiamo il punto $\tilde{x}_1=1$, $\tilde{x}_2=2/5$, $\tilde{x}_3=0$ di $P_A$ nell'[Esempio 5.6](#box-13-ex-3d-a) e la copertura $C=\{1,2\}$. La sua disuguaglianza di copertura è $x_1+x_2\le1$ e $|C|=2$. Allora

    $$
    v_C(\tilde{\vet x})=\frac25,\qquad
    x_1^{\perp}=\frac45,\qquad
    x_2^{\perp}=\frac15,\qquad
    x_3^{\perp}=0,
    \qquad d(\tilde{\vet x},H_C)=\frac{2}{5\sqrt2}.
    $$

    La regione rossa è $P_A$ e il rettangolo verde tratteggiato è $H_C$ ristretto al cubo unitario. Poiché $3\notin C$, la proiezione non modifica $\tilde{x}_3$.

    ![Figura 16](../img/05-cover/fig16.svg){ .fig .ovale loading=lazy  }

## 5.8 Errori tipici

!!! attenzione "Attenzione"

    - <strong>Usare un insieme che non è una copertura.</strong> La disuguaglianza $\sum_{j\in C}x_j\le|C|-1$ è valida solo se il coefficiente totale $\sum_{j\in C}a_j$ supera il termine noto $b$; controllare i coefficienti prima di scriverla.

    - <strong>Usare $|E(C)|-1$ per una copertura estesa.</strong> Il termine noto della disuguaglianza di copertura estesa è $|C|-1$, dove $C$ è la copertura, non $|E(C)|-1$.

    - <strong>Rimuovere da una copertura tutti gli indici con $q_j=0$.</strong> Per ottenere una copertura minimale, si rimuovono gli indici uno alla volta finché l'insieme rimanente è ancora una copertura: rimuoverli tutti può lasciare un insieme che non è una copertura.

    - <strong>Fermare la separazione a un fallimento dell'euristica.</strong> Se l'algoritmo euristico greedy non trova disuguaglianze di copertura violate, non possiamo concludere che non ne esistano: lo dimostra solo il valore ottimo del problema di separazione.

    - <strong>Confondere violazione e distanza.</strong> Il problema di separazione delle coperture massimizza la violazione; coperture con la stessa violazione possono avere distanze diverse dal punto.

    - <strong>Credere che la chiusura delle coperture sia l'inviluppo convesso.</strong> Un punto può soddisfare tutte le disuguaglianze di copertura ed essere comunque frazionario ([Esempio 5.8](#box-16-ex-guide-csp)).

## 5.9 In sintesi

!!! chiave "In sintesi"

    - Una copertura è un insieme di variabili il cui coefficiente totale supera il termine noto; la sua disuguaglianza di copertura consente che al più $|C|-1$ delle sue variabili valgano $1$, ed è valida per $X$.

    - Le coperture minimali bastano: le loro disuguaglianze implicano tutte le altre, ma possono essere in numero esponenziale, quindi si separano solo quando sono violate.

    - Separare una disuguaglianza di copertura significa trovare una copertura di costo minimo $\sum_{j\in C}(1-\tilde{x}_j)$: esiste una disuguaglianza violata se e solo se il costo minimo è minore di $1$; è un problema 0–1 con un solo vincolo $\le$, definito nel capitolo.

    - Una disuguaglianza di copertura estesa domina la disuguaglianza di copertura della stessa copertura.

    - La chiusura delle coperture è più vicina a $\operatorname{conv}(X)$ del rilassamento lineare, ma in generale non coincide con esso.

    <strong>Cruscotto dell'istanza a quattro variabili.</strong> I lower bound e gli upper bound sul valore ottimo del problema binario dell'[Esempio 5.1](#box-8-ex-guide). I coefficienti dell'obiettivo sono interi, quindi l'upper bound è il valore del rilassamento lineare arrotondato per difetto.

    <div class="tabella" markdown="0"><table>
    <tr>
    <th>Fonte</th>
    <th>Lower bound</th>
    <th>Upper bound</th>
    <th>Da</th>
    </tr>
    <tr>
    <td>Rilassamento lineare</td>
    <td><span class="arithmatex">\(11\)</span></td>
    <td><span class="arithmatex">\(16\)</span></td>
    <td>soluzione greedy <span class="arithmatex">\((1,1,0,0)\)</span>, <span class="arithmatex">\(\lfloor z(\LP)\rfloor\)</span> con <span class="arithmatex">\(z(\LP)=\tfrac{49}{3}\)</span></td>
    </tr>
    <tr>
    <td>Chiusura delle coperture</td>
    <td><span class="arithmatex">\(11\)</span></td>
    <td><span class="arithmatex">\(15\)</span></td>
    <td><span class="arithmatex">\(\lfloor z(\LPcov)\rfloor\)</span> con <span class="arithmatex">\(z(\LPcov)=\tfrac{79}{5}\)</span>, <span class="arithmatex">\(2\)</span> coperture separate</td>
    </tr>
    <tr>
    <td>Copertura estesa</td>
    <td><span class="arithmatex">\(15\)</span></td>
    <td><span class="arithmatex">\(15\)</span></td>
    <td><span class="arithmatex">\(z(\LP_{\mathrm{ext}})=15\)</span>, soluzione ottima <span class="arithmatex">\((1,0,0,1)\)</span></td>
    </tr>
    </table></div>

---

**Esercizi su questo capitolo:** [:material-pencil: Disuguaglianze di cover](../esercizi/cover.md)
