---
title: "Euristiche MIP"
---

# Euristiche MIP

<div class="info-capitolo" markdown>

**Parte 5 · Euristiche MIP · Capitolo 10** · [:material-file-pdf-box: Dispensa, volume 4 (PDF)](../pdf/dispensa-4-euristiche-mip.pdf) · [:material-pencil: Esercizi: Euristiche MIP](../esercizi/mip-heuristics.md)

</div>

<span class="arithmatex">\(\newcommand{\rnd}[1]{\left[\,#1\,\right]}\)</span>

!!! nota "Prerequisiti"

    - Da questo modulo, i capitoli «Bound primali e bound duali» e «Algoritmi branch-and-bound basati su LP»: il rilassamento lineare, i lower bound e gli upper bound, il gap di ottimalità e le operazioni di branching.

    - Da questo modulo, il capitolo «Risolutori MIP: che cosa fanno»: la soluzione incumbent, i sotto-problemi risolti da un solver e le euristiche al suo interno.

    - Dal modulo <em>Programmazione lineare</em>: l'[algoritmo del simplesso duale (Capitolo 10)](https://fabiofurini.github.io/linear-programming/duality/10-dual-simplex/), che riottimizza un LP dopo la modifica di un limite su una variabile.

!!! chiave "Obiettivi"

    Alla fine di questo capitolo sarai in grado di:

    - spiegare come un algoritmo euristico usa il rilassamento lineare e un solver MIP;

    - eseguire a mano l'arrotondamento, il diving, la feasibility pump, RINS, il local branching e la proximity search su un piccolo MIP;

    - eseguire relax-and-fix e fix-and-optimize su un MIP le cui variabili sono suddivise in blocchi;

    - decidere quale metodo usare quando manca una soluzione ammissibile, o quando una soluzione incumbent va migliorata;

    - calcolare il gap di una soluzione euristica quando è disponibile un bound duale.

## 10.1 Euristiche basate sulla PLI { #sez-sec-intro }

<a id="box-1-def-mip"></a>

!!! definizione "Definizione 10.1: MIP in forma generale"

    Un <strong>MIP</strong> con $N$ variabili $\vet x=(x_1,x_2,\dots,x_N)$ si scrive

    <a id="eq-eq-mip"></a>

    \begin{align*}
    && \min ~~ f(\vet x) \label{eq:mip-obj} \tag{10.1a}\\[1ex]
    && \text{soggetto a} \quad A\,\vet x &\le b, & \label{eq:mip-cons} \tag{10.1b}\\[1ex]
    && l_j \le x_j &\le u_j, & \forall j \in \{1,2,\dots,N\}, \label{eq:mip-bounds} \tag{10.1c}\\[1ex]
    && x_j &\in \Z, & \forall j \in \mathscr{D}, \label{eq:mip-int} \tag{10.1d}
    \end{align*}

    dove $f$ è una funzione lineare e $\mathscr{D}\subseteq\{1,2,\dots,N\}$ è l'insieme degli indici delle <strong>variabili intere</strong>. La regione ammissibile del <strong>rilassamento lineare</strong> è

    $$
    \mathcal{L} = \big\{\vet x\in\R^N : A\,\vet x\le b,~ l\le \vet x\le u\big\},
    $$

    e $z(\LP)=\min\{f(\vet x): \vet x\in\mathcal{L}\}$ è il valore del rilassamento lineare.

- Un problema di massimizzazione, come l'esempio dell'auto, si tratta nello stesso modo, scambiando $\min$ e $\max$, $\le$ e $\ge$ nei confronti fra valori della funzione obiettivo.

<a id="box-2-def-mipheur"></a>

!!! definizione "Definizione 10.2: euristica basata sulla PLI"

    Un <strong>algoritmo euristico</strong> restituisce una soluzione ammissibile di un problema MIP [(10.1)](#eq-eq-mip) senza alcuna garanzia di ottimalità. È <strong>basato sulla PLI</strong> (una <strong>matheuristica</strong>) se usa il rilassamento lineare e un solver MIP per cercare la soluzione.

- Un'euristica fornisce un bound primale (un upper bound per un problema di minimizzazione, un lower bound per un problema di massimizzazione), mai un bound duale. L'algoritmo branch-and-bound di questo modulo trova la soluzione incumbent solo per caso, come foglia dell'albero.

- La soluzione ottima del <strong>rilassamento lineare</strong> indica <em>dove cercare</em>: è la soluzione di un problema più semplice, spesso vicina alle buone soluzioni del problema originale.

- Il <strong>solver MIP</strong> esplora <em>in modo esatto</em> un insieme di soluzioni troppo grande per essere enumerato, purché l'insieme sia descritto da vincoli lineari.

<a id="box-3-def-incumbent"></a>

!!! definizione "Definizione 10.3: incumbent, arrotondamento e completamento"

    - Una soluzione ammissibile $\bar{\vet x}$ del MIP [(10.1)](#eq-eq-mip), la migliore nota, è la soluzione <strong>incumbent</strong>, e $f(\bar{\vet x})$ è il suo valore.

    - L'<strong>arrotondamento</strong> di un numero reale $v$ all'intero più vicino è $\rnd{v} = \big\lfloor v + \frac12 \big\rfloor$, così che un valore $\frac12$ viene arrotondato per eccesso.

    - Un punto $\bar{\vet x}$ con $\bar x_j \in \Z$ per ogni $j \in \mathscr{D}$ viene <strong>completato</strong> fissando le variabili intere ai valori $\bar x_j$ e risolvendo l'LP sulle variabili continue.

- In tutto il capitolo, $\tilde{\vet x}$ indica una soluzione ottima di un rilassamento lineare, e $\bar{\vet x}$ un punto le cui componenti $\bar x_j$, $j\in\mathscr{D}$, sono intere.

- Se l'LP del completamento ha una soluzione ottima, $\bar{\vet x}$ diventa una soluzione ammissibile del MIP; se è inammissibile, lo è anche $\bar{\vet x}$. Quando tutte le variabili sono intere, il completamento si limita a verificare i vincoli.

- I metodi si basano su cinque idee, una o due per sezione.

<div class="tabella" markdown="0"><table>
<tr>
<th>idea</th>
<th>metodi</th>
</tr>
<tr>
<td>arrotondare il rilassamento</td>
<td>arrotondamento; diving (fissare una variabile, risolvere di nuovo, ripetere)</td>
</tr>
<tr>
<td>inseguire l'ammissibilità</td>
<td>la feasibility pump</td>
</tr>
<tr>
<td>fissare dove rilassamento e incumbent concordano</td>
<td>RINS</td>
</tr>
<tr>
<td>limitare la distanza dall'incumbent</td>
<td>local branching; proximity search</td>
</tr>
<tr>
<td>scomporre in blocchi di variabili</td>
<td>relax-and-fix; fix-and-optimize</td>
</tr>
</table></div>

- Gli esempi sono risolti con il solver MIP Gurobi, usato da Python tramite <code>gurobipy</code>; il modulo <em>Modellazione MIP</em> ([<u>fabiofurini.github.io/modellazione-mip</u>](https://fabiofurini.github.io/mip-modelling/), [capitolo 3 «Dal modello a Python/Gurobi»](https://fabiofurini.github.io/mip-modelling/modelling-3/)) spiega come usarlo. Quando un LP ha più soluzioni ottime, il testo riporta quella restituita dal solver; tutti i codici sono nell'ultima sezione.

## 10.2 Gli esempi del capitolo { #sez-sec-models }

- I metodi sono illustrati sull'<strong>esempio dell'auto</strong> di questo modulo e su quattro piccoli problemi del <strong>catalogo dei problemi MIP</strong>. Sono tutti problemi PLI in forma canonica di massimizzazione, con dati interi e $x_j\in\Z_{\ge 0}$ per ogni $j$, così che $\mathscr{D}=\{1,2,\dots,N\}$.

- L'<strong>esempio dell'auto</strong> si scrive

    $$
    \max~ 3\,x_1+2\,x_2 \quad\text{s.a.}\quad 10\,x_1+4\,x_2\le 45,\quad 4\,x_1+14\,x_2\le 49,\quad x_1,x_2\in\Z_{\ge 0}
    $$

<div class="tabella" markdown="0"><table>
<tr>
<th>problema</th>
<th>obiettivo <span class="arithmatex">\(\max\)</span></th>
<th>vincoli</th>
</tr>
<tr>
<td><span class="arithmatex">\(P7\)</span></td>
<td><span class="arithmatex">\(3x_1+x_2\)</span></td>
<td><span class="arithmatex">\(x_1+4x_2\le 12\)</span>,  <span class="arithmatex">\(2x_1+x_2\le 5\)</span></td>
</tr>
<tr>
<td><span class="arithmatex">\(P42\)</span></td>
<td><span class="arithmatex">\(3x_1+2x_2+4x_3\)</span></td>
<td><span class="arithmatex">\(x_1+x_2+2x_3\le 4\)</span>,  <span class="arithmatex">\(2x_1+3x_3\le 5\)</span>,  <span class="arithmatex">\(2x_1+x_2+3x_3\le 7\)</span></td>
</tr>
<tr>
<td><span class="arithmatex">\(P46\)</span></td>
<td><span class="arithmatex">\(5x_1+6x_2+10x_3\)</span></td>
<td><span class="arithmatex">\(9x_1+2x_2+2x_3\le 11\)</span>,  <span class="arithmatex">\(2x_1+6x_2+6x_3\le 16\)</span>,  <span class="arithmatex">\(4x_1+2x_2+7x_3\le 10\)</span></td>
</tr>
<tr>
<td><span class="arithmatex">\(P72\)</span></td>
<td><span class="arithmatex">\(7x_1+6x_2+5x_3-2x_4+3x_5\)</span></td>
<td><span class="arithmatex">\(x_1+3x_2+5x_3-2x_4+2x_5\le 4\)</span>,  <span class="arithmatex">\(4x_1+2x_2-2x_3+x_4+x_5\le 3\)</span>,</td>
</tr>
<tr>
<td></td>
<td></td>
<td><span class="arithmatex">\(2x_1+4x_2+4x_3-2x_4+5x_5\le 5\)</span>,  <span class="arithmatex">\(3x_1+x_2+2x_3-x_4-2x_5\le 1\)</span></td>
</tr>
</table></div>

- La tabella seguente riporta il valore $z(\LP)$ del rilassamento lineare, l'upper bound $\lfloor z(\LP)\rfloor$ (la funzione obiettivo assume valori interi) e il valore ottimo $z(\ILP)$, tutti calcolati con l'algoritmo del simplesso in aritmetica esatta e verificati con Gurobi.

<div class="tabella" markdown="0"><table>
<tr>
<th>problema</th>
<th>variabili</th>
<th>vincoli</th>
<th><span class="arithmatex">\(z(\LP)\)</span></th>
<th><span class="arithmatex">\(\lfloor z(\LP)\rfloor\)</span></th>
<th><span class="arithmatex">\(z(\ILP)\)</span></th>
</tr>
<tr>
<td>auto</td>
<td><span class="arithmatex">\(2\)</span></td>
<td><span class="arithmatex">\(2\)</span></td>
<td><span class="arithmatex">\(\frac{31}{2}\)</span></td>
<td><span class="arithmatex">\(15\)</span></td>
<td><span class="arithmatex">\(14\)</span></td>
</tr>
<tr>
<td><span class="arithmatex">\(P7\)</span></td>
<td><span class="arithmatex">\(2\)</span></td>
<td><span class="arithmatex">\(2\)</span></td>
<td><span class="arithmatex">\(\frac{15}{2}\)</span></td>
<td><span class="arithmatex">\(7\)</span></td>
<td><span class="arithmatex">\(7\)</span></td>
</tr>
<tr>
<td><span class="arithmatex">\(P42\)</span></td>
<td><span class="arithmatex">\(3\)</span></td>
<td><span class="arithmatex">\(3\)</span></td>
<td><span class="arithmatex">\(\frac{21}{2}\)</span></td>
<td><span class="arithmatex">\(10\)</span></td>
<td><span class="arithmatex">\(10\)</span></td>
</tr>
<tr>
<td><span class="arithmatex">\(P46\)</span></td>
<td><span class="arithmatex">\(3\)</span></td>
<td><span class="arithmatex">\(3\)</span></td>
<td><span class="arithmatex">\(\frac{499}{25}\)</span></td>
<td><span class="arithmatex">\(19\)</span></td>
<td><span class="arithmatex">\(16\)</span></td>
</tr>
<tr>
<td><span class="arithmatex">\(P72\)</span></td>
<td><span class="arithmatex">\(5\)</span></td>
<td><span class="arithmatex">\(4\)</span></td>
<td><span class="arithmatex">\(\frac{507}{59}\)</span></td>
<td><span class="arithmatex">\(8\)</span></td>
<td><span class="arithmatex">\(7\)</span></td>
</tr>
</table></div>

<a id="box-4-ex-lpsol"></a>

!!! esempio "Esempio 10.1: Le soluzioni LP degli esempi"

    <div class="tabella" markdown="0"><table>
    <tr>
    <th>problema</th>
    <th>soluzione ottima <span class="arithmatex">\(\tilde{\vet x}\)</span> del rilassamento lineare</th>
    </tr>
    <tr>
    <td>auto</td>
    <td><span class="arithmatex">\(\big(\frac72,\frac52\big)\)</span></td>
    </tr>
    <tr>
    <td><span class="arithmatex">\(P7\)</span></td>
    <td><span class="arithmatex">\(\big(\frac52,0\big)\)</span></td>
    </tr>
    <tr>
    <td><span class="arithmatex">\(P42\)</span></td>
    <td><span class="arithmatex">\(\big(\frac52,\frac32,0\big)\)</span></td>
    </tr>
    <tr>
    <td><span class="arithmatex">\(P46\)</span></td>
    <td><span class="arithmatex">\(\big(\frac{17}{25},\frac{49}{25},\frac{12}{25}\big)\)</span></td>
    </tr>
    <tr>
    <td><span class="arithmatex">\(P72\)</span></td>
    <td><span class="arithmatex">\(\big(\frac{39}{59},0,\frac{91}{59},\frac{166}{59},\frac{37}{59}\big)\)</span></td>
    </tr>
    </table></div>

    Le prime tre soluzioni hanno al più due componenti frazionarie, con parte frazionaria $\frac12$; le ultime due sono gli esempi in cui i metodi hanno più occasioni di fallire.

## 10.3 Arrotondamento { #sez-sec-rounding }

<a id="box-5-def-rounding"></a>

!!! definizione "Definizione 10.4: arrotondamento"

    L'<em>arrotondamento</em> (rounding) è la più semplice euristica basata sulla PLI. Risolve il rilassamento lineare, arrotonda ogni variabile intera della soluzione LP all'intero più vicino e completa le variabili continue. Restituisce una soluzione ammissibile, oppure fallisce se il punto arrotondato viola un vincolo.

- Lo pseudocodice dell'arrotondamento è il seguente:

!!! algoritmo "Algoritmo: Arrotondamento"

    <strong>Input:</strong> MIP [(10.1)](#eq-eq-mip) con variabili intere $\mathscr{D}$  
    <strong>Output:</strong> Soluzione ammissibile $\bar{\vet x}$, oppure FALLIMENTO  
    <strong>function</strong> Rounding(MIP)  
    &emsp;&emsp;$\tilde{\vet x} :=$ soluzione ottima del rilassamento lineare&emsp;*// $\min\{f(\vet x): \vet x\in\mathcal{L}\}$*  
    &emsp;&emsp;<strong>for</strong> $j\in\mathscr{D}$ <strong>do</strong>  
    &emsp;&emsp;&emsp;&emsp;$\bar x_j \leftarrow \rnd{\tilde x_j}$&emsp;*// arrotonda all'intero più vicino*  
    &emsp;&emsp;fissa $x_j:=\bar x_j$ per ogni $j\in\mathscr{D}$ e risolvi l'LP sulle variabili continue  
    &emsp;&emsp;<strong>if</strong> l'LP è ammissibile <strong>then</strong>  
    &emsp;&emsp;&emsp;&emsp;<strong>return</strong> $\bar{\vet x}$ completato con la parte continua della soluzione LP  
    &emsp;&emsp;<strong>else</strong>  
    &emsp;&emsp;&emsp;&emsp;<strong>return</strong> FALLIMENTO&emsp;*// il punto arrotondato viola un vincolo*

- <strong>Perché può funzionare.</strong> Quando la formulazione è forte, la soluzione LP è vicina a una soluzione intera ottima, e molte delle sue variabili intere sono già intere: l'arrotondamento ne cambia solo poche, ciascuna di meno di $\frac12$.

- <strong>Perché può fallire.</strong> L'arrotondamento tratta le variabili una alla volta, mentre i vincoli le legano fra loro. Un vincolo con tutti i coefficienti non negativi e termine noto $b_i\ge0$ resta soddisfatto se le variabili vengono arrotondate <em>per difetto</em>, e uno della forma $\ge$ se vengono arrotondate <em>per eccesso</em>.

- Un vincolo di <strong>uguaglianza</strong> è quasi sempre violato da arrotondamenti indipendenti: due valori frazionari con somma $1$ diventano, per esempio, $1$ e $1$.

<a id="box-6-obs-rounddown"></a>

!!! teorema "Osservazione 10.5"

    Siano tutti i coefficienti di $A$ non negativi, $b\ge 0$ e $l=0$. Se $\tilde{\vet x}\in\mathcal{L}$, allora il punto $\lfloor \tilde{\vet x}\rfloor$, ottenuto arrotondando per difetto ogni variabile intera, appartiene a $\mathcal{L}$.

??? dimostrazione "Dimostrazione"

    Per ogni $j$, $0\le\lfloor \tilde x_j\rfloor\le \tilde x_j\le u_j$, quindi i limiti sono rispettati. Per ogni riga $i$, poiché $a_{ij}\ge0$, $\sum_j a_{ij}\lfloor \tilde x_j\rfloor\le\sum_j a_{ij}\tilde x_j\le b_i$. <span class="qed">□</span>

- L'esempio dell'auto soddisfa le ipotesi dell'osservazione: l'arrotondamento per difetto è sempre ammissibile e, in generale, non ottimo.

<a id="box-7-ex-rounding"></a>

!!! esempio "Esempio 10.2: Arrotondamento sull'esempio dell'auto e su $P42$"

    <strong>Esempio dell'auto.</strong> La soluzione LP $\tilde{\vet x}=\big(\frac72,\frac52\big)$ viene arrotondata a $\bar{\vet x}=(4,3)$, che viola il primo vincolo:

    $$
    10\cdot 4+4\cdot 3=52>45 .
    $$

    <strong>L'arrotondamento fallisce.</strong> L'arrotondamento per difetto dà invece $(3,2)$: $38\le45$, $40\le49$, di valore $13$, mentre $z(\ILP)=14$.

    <strong>$P42$.</strong> La soluzione LP $\big(\frac52,\frac32,0\big)$ viene arrotondata a $(3,2,0)$, che viola il secondo vincolo: $2\cdot3=6>5$. <strong>L'arrotondamento fallisce.</strong> L'arrotondamento per difetto dà $(2,1,0)$, di valore $8$, mentre $z(\ILP)=10$.

    <strong>$P72$.</strong> La soluzione LP viene arrotondata a $(1,0,2,3,1)$, che viola il primo vincolo: $1+10-6+2=7>4$. <strong>L'arrotondamento fallisce.</strong>

- Gli esempi riassumono il metodo: l'arrotondamento all'intero più vicino fallisce quando più variabili sono frazionarie contemporaneamente e i vincoli sono stringenti; l'arrotondamento per difetto è sicuro, ma lascia per strada una parte del valore dell'LP.

## 10.4 Diving { #sez-sec-diving }

- L'arrotondamento prende tutte le sue decisioni in una volta, sulla base di un'unica soluzione LP. Il <strong>diving</strong> le prende una alla volta, e dopo ogni decisione interroga di nuovo l'LP: la soluzione LP viene ricalcolata con le decisioni prese fino a quel momento, e si adatta a esse.

<a id="box-8-def-diving"></a>

!!! definizione "Definizione 10.6: diving"

    Il <em>diving</em> risolve ripetutamente il rilassamento lineare, sceglie una variabile intera con valore frazionario, la fissa a un valore intero e risolve di nuovo l'LP. Si ferma con una soluzione ammissibile quando la soluzione LP è intera su tutte le variabili intere, e fallisce quando l'LP diventa inammissibile. Una <em>regola</em> decide quale variabile fissare e a quale valore.

- Lo pseudocodice del diving è il seguente:

!!! algoritmo "Algoritmo: Diving"

    <strong>Input:</strong> MIP [(10.1)](#eq-eq-mip); una regola; per il diving guidato, una soluzione incumbent $\bar{\vet x}$  
    <strong>Output:</strong> Soluzione ammissibile, oppure FALLIMENTO  
    <strong>function</strong> Diving(MIP, regola)  
    &emsp;&emsp;<strong>while</strong> vero <strong>do</strong>  
    &emsp;&emsp;&emsp;&emsp;risolvi il rilassamento lineare con i limiti correnti $l,u$  
    &emsp;&emsp;&emsp;&emsp;<strong>if</strong> l'LP è inammissibile <strong>then</strong>  
    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<strong>return</strong> FALLIMENTO&emsp;*// il diving finisce in un LP inammissibile*  
    &emsp;&emsp;&emsp;&emsp;$\tilde{\vet x} :=$ soluzione ottima dell'LP  
    &emsp;&emsp;&emsp;&emsp;$F := \{j\in\mathscr{D} : \tilde x_j\notin\Z\}$&emsp;*// variabili intere frazionarie*  
    &emsp;&emsp;&emsp;&emsp;<strong>if</strong> $F=\emptyset$ <strong>then</strong>  
    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<strong>return</strong> $\tilde{\vet x}$&emsp;*// intera su $\mathscr{D}$: ammissibile*  
    &emsp;&emsp;&emsp;&emsp;scegli $j\in F$ e un valore $v\in\Z$ secondo la regola  
    &emsp;&emsp;&emsp;&emsp;$l_j\leftarrow v$;   $u_j\leftarrow v$&emsp;*// fissa $x_j:=v$*

- <strong>Diving frazionario.</strong> Si sceglie la variabile <em>meno</em> frazionaria, cioè la $j\in F$ che minimizza $\big|\tilde x_j-\rnd{\tilde x_j}\big|$, e la si fissa a $v=\rnd{\tilde x_j}$. L'LP è quasi sicuro del valore di questa variabile, quindi fissarla cambia la soluzione LP il meno possibile. Nei codici di questo capitolo, i pareggi si risolvono a favore della variabile di indice più piccolo.

- <strong>Diving guidato</strong> [\[3\]](#ref-DRL05). Data una soluzione incumbent $\bar{\vet x}$, si sceglie la $j\in F$ che minimizza $|\tilde x_j-\bar x_j|$ e la si fissa a $v=\bar x_j$. L'incumbent guida il diving verso una regione di buone soluzioni, e l'LP decide in quale ordine adottarne i valori.

- Esistono molte altre regole: il <em>coefficient diving</em> fissa la variabile che compare nel minor numero di vincoli che il suo arrotondamento può violare; il <em>pseudo-cost diving</em> usa la storia dell'albero di branch-and-bound; il <em>vector-length diving</em> è pensato per i vincoli di set covering. I solver moderni ne eseguono diversi.

- <strong>Diving e branch-and-bound.</strong> Fissare $x_j:=\rnd{\tilde x_j}$ è una decisione di branching. Un diving è un unico cammino dalla radice dell'albero di branch-and-bound a una foglia, che prende sempre uno dei due figli, senza mai tornare indietro: una ricerca in profondità senza backtracking.

- <strong>Costo.</strong> Ogni passo risolve un LP che differisce dal precedente per un solo limite su una variabile, quindi l'algoritmo del simplesso duale lo riottimizza partendo dalla base precedente in poche iterazioni. Un diving con $|\mathscr{D}|$ variabili intere richiede al più $|\mathscr{D}|$ LP, di solito molti meno, perché una soluzione LP ha già molte componenti intere.

- <strong>Fallimento.</strong> L'LP diventa inammissibile quando le fissazioni fatte fino a quel momento sono incompatibili. Le implementazioni allora annullano l'ultima fissazione e provano l'altro valore (un solo backtracking), oppure rinunciano.

<a id="box-9-ex-divecar"></a>

!!! esempio "Esempio 10.3: Diving frazionario sull'esempio dell'auto"

    <strong>Passo 1.</strong> La soluzione LP è $\tilde{\vet x}=\big(\frac72,\frac52\big)$, di valore $\frac{31}{2}$. Entrambe le variabili sono a distanza $\frac12$ dall'intero più vicino; il pareggio si risolve con l'indice: $x_1:=\rnd{\frac72}=4$.

    <strong>Passo 2.</strong> Con $x_1=4$ i vincoli diventano $4x_2\le5$ e $14x_2\le33$, quindi la soluzione LP è $\tilde{\vet x}=\big(4,\frac54\big)$, di valore $12+\frac52=\frac{29}{2}$. Si fissa $x_2:=\rnd{\frac54}=1$.

    <strong>Passo 3.</strong> La soluzione LP $(4,1)$, di valore $14$, è intera: il diving restituisce $(4,1)$, che è la soluzione <strong>ottima</strong> del problema PLI.

    ![Figura 1](../img/10-mip-heuristics/fig01.svg){ .fig loading=lazy  }

<a id="box-10-ex-guided"></a>

!!! esempio "Esempio 10.4: Diving guidato sull'esempio dell'auto e su $P7$"

    <strong>Esempio dell'auto.</strong> La soluzione incumbent è $\bar{\vet x}=(3,2)$, di valore $13$ (arrotondamento per difetto). Nella soluzione LP $\big(\frac72,\frac52\big)$ entrambe le variabili sono a distanza $\frac12$ da $\bar{\vet x}$; si fissa $x_1:=3$. La nuova soluzione LP è $\big(3,\frac{37}{14}\big)$, di valore $\frac{100}{7}$; si fissa $x_2:=\bar x_2=2$. La soluzione LP $(3,2)$ è intera, di valore $13$: il diving <strong>restituisce l'incumbent</strong>, senza migliorarlo.

    <strong>$P7$.</strong> La soluzione incumbent è $\bar{\vet x}=(2,0)$, di valore $6$ (arrotondamento per difetto di $\big(\frac52,0\big)$). L'unica variabile frazionaria è $x_1$: si fissa $x_1:=2$. La soluzione LP $(2,1)$, di valore $7$, è intera: il diving guidato trova la soluzione <strong>ottima</strong> dopo una sola fissazione, anche se l'incumbent ha $\bar x_2=0$, perché l'LP ricostruisce le variabili che non sono fissate.

- L'incumbent decide solo i <em>valori</em> delle variabili fissate: sull'esempio dell'auto entrambi i valori fissati coincidono con quelli dell'incumbent scadente, su $P7$ il valore fissato è quello giusto.

<a id="box-11-ex-divefail"></a>

!!! esempio "Esempio 10.5: Un diving che fallisce su $P42$ e su $P72$"

    <strong>$P42$.</strong> La soluzione LP è $\big(\frac52,\frac32,0\big)$; $x_1$ e $x_2$ sono a distanza $\frac12$, e il pareggio si risolve con l'indice: $x_1:=\rnd{\frac52}=3$. Il secondo vincolo dà $2\cdot3+3x_3\le5$, violato per ogni $x_3\ge0$: l'LP è inammissibile, <strong>il diving fallisce al primo passo</strong>.

    <strong>$P72$.</strong> Le componenti frazionarie della soluzione LP sono $\frac{39}{59},\frac{91}{59},\frac{166}{59},\frac{37}{59}$ (per $x_1,x_3,x_4,x_5$), e la meno frazionaria è $x_4$, a distanza $\frac{11}{59}$ da $3$: $x_4:=3$. Il nuovo LP ha valore $\frac{728}{85}$ e soluzione $\big(\frac{56}{85},0,\frac{138}{85},3,\frac{52}{85}\big)$; la variabile meno frazionaria è $x_1$, arrotondata a $1$. Fissare $x_1:=1$ e $x_4:=3$ rende l'LP <strong>inammissibile</strong>.

- In entrambi i casi le prime fissazioni seguono l'LP, che non vede che i vincoli, tutti insieme, non lasciano spazio. Un diving che fallisce non dà nessuna soluzione: è questa la ragione della feasibility pump della prossima sezione.

## 10.5 La feasibility pump { #sez-sec-fp }

- L'arrotondamento e il diving falliscono su $P42$ e su $P72$, e su molti MIP falliscono la maggior parte delle volte: per un MIP generale, anche solo <em>decidere se esiste una soluzione ammissibile</em> è NP-completo. La <strong>feasibility pump</strong> di Fischetti, Glover e Lodi [\[4\]](#ref-FGL05) rinuncia alla funzione obiettivo e si concentra su un unico scopo: trovare una soluzione ammissibile.

- L'idea è lavorare con due punti contemporaneamente. Un punto di $\mathcal{L}$ soddisfa tutti i vincoli lineari, ma può essere frazionario; un punto intero è intero, ma può violare i vincoli. Una soluzione ammissibile è un punto che ha entrambe le proprietà. La pompa fa inseguire i due punti finché non coincidono, e per farlo deve misurare quanto sono lontani l'uno dall'altro.

<a id="box-12-def-distance"></a>

!!! definizione "Definizione 10.7: Distanza da un punto intero"

    Sia $\bar{\vet x}$ un punto con $\bar x_j\in\Z$ per ogni $j\in\mathscr{D}$. La <strong>distanza</strong> di un punto $\vet x\in\R^N$ da $\bar{\vet x}$ è

    $$
    \Delta(\vet x,\bar{\vet x}) = \sum_{j\in\mathscr{D}} |x_j-\bar x_j| ,
    $$

    la distanza $L_1$ calcolata solo sulle variabili intere.

- Quando tutte le variabili intere sono <strong>binarie</strong>, $|x_j-\bar x_j|$ vale $x_j$ se $\bar x_j=0$ e $1-x_j$ se $\bar x_j=1$, per ogni $x_j\in[0,1]$. La distanza è allora una funzione <em>lineare</em> di $\vet x$:

!!! chiave ""

    $$
    \Delta(\vet x,\bar{\vet x}) \;=\; \sum_{j\in\mathscr{D}:\ \bar x_j=0} x_j \;+\; \sum_{j\in\mathscr{D}:\ \bar x_j=1} (1-x_j)
    \qquad \text{per variabili binarie}
    $$

- Per una variabile intera generale vale lo stesso se $\bar x_j=l_j$ (il termine è $x_j-l_j$) o $\bar x_j=u_j$ (il termine è $u_j-x_j$). Altrimenti $|x_j-\bar x_j|$ si sostituisce con una variabile ausiliaria $d_j$ con i due vincoli $d_j\ge x_j-\bar x_j$ e $d_j\ge \bar x_j-x_j$; all'ottimo, $d_j=|x_j-\bar x_j|$. In tutti i casi, il punto di $\mathcal{L}$ più vicino a $\bar{\vet x}$ si calcola risolvendo <strong>un LP</strong>.

<a id="box-13-def-fp"></a>

!!! definizione "Definizione 10.8: feasibility pump"

    La <em>feasibility pump</em> costruisce due successioni di punti: punti $\tilde{\vet x}^{0},\tilde{\vet x}^{1},\tilde{\vet x}^{2},\dots$ di $\mathcal{L}$, che soddisfano i vincoli lineari, e punti interi $\bar{\vet x}^0,\bar{\vet x}^1,\bar{\vet x}^2,\dots$, che soddisfano i vincoli di integralità. Parte dalla soluzione LP $\tilde{\vet x}^{0}$; ogni punto intero è l'<em>arrotondamento</em> dell'ultimo punto di $\mathcal{L}$, e ogni punto di $\mathcal{L}$ è la <em>proiezione</em> dell'ultimo punto intero, cioè il punto di $\mathcal{L}$ a distanza minima da esso. Si ferma quando la distanza è $0$: i due punti coincidono e sono una soluzione ammissibile. Quando l'arrotondamento restituisce un punto intero già visitato, la pompa lo <em>perturba</em>.

- Lo pseudocodice della feasibility pump è il seguente:

!!! algoritmo "Algoritmo: Feasibility pump"

    <strong>Input:</strong> MIP [(10.1)](#eq-eq-mip); numero massimo di iterazioni $maxIter$; seme dei numeri casuali  
    <strong>Output:</strong> Soluzione ammissibile, oppure FALLIMENTO  
    <strong>function</strong> FeasibilityPump(MIP, $maxIter$, $seed$)  
    &emsp;&emsp;$\tilde{\vet x} :=$ soluzione ottima del rilassamento lineare  
    &emsp;&emsp;<strong>if</strong> $\tilde x_j\in\Z$ per ogni $j\in\mathscr{D}$ <strong>then</strong>  
    &emsp;&emsp;&emsp;&emsp;<strong>return</strong> $\tilde{\vet x}$  
    &emsp;&emsp;$\bar{\vet x} \leftarrow \rnd{\tilde{\vet x}}$&emsp;*// arrotonda le componenti intere*  
    &emsp;&emsp;<strong>for</strong> $it := 1$ <strong>to</strong> $maxIter$ <strong>do</strong>  
    &emsp;&emsp;&emsp;&emsp;$\tilde{\vet x} \leftarrow \arg\min\{\Delta(\vet x,\bar{\vet x}) : \vet x\in\mathcal{L}\}$&emsp;*// proiezione: un LP*  
    &emsp;&emsp;&emsp;&emsp;<strong>if</strong> $\Delta(\tilde{\vet x},\bar{\vet x})=0$ <strong>then</strong>  
    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<strong>return</strong> $\tilde{\vet x}$&emsp;*// $\tilde{\vet x}$ è intero su $\mathscr{D}$: ammissibile*  
    &emsp;&emsp;&emsp;&emsp;$\hat{\vet x} \leftarrow \rnd{\tilde{\vet x}}$  
    &emsp;&emsp;&emsp;&emsp;<strong>if</strong> $\hat x_j=\bar x_j$ per ogni $j\in\mathscr{D}$ <strong>then</strong>&emsp;*// ciclo corto*  
    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;$j \leftarrow \arg\max_{k\in\mathscr{D}} |\tilde x_k-\bar x_k|$  
    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;sposta $\hat x_j$ di un'unità verso $\tilde x_j$&emsp;*// flip*  
    &emsp;&emsp;&emsp;&emsp;<strong>if</strong> $\hat{\vet x}$ coincide con uno degli ultimi $3$ punti $\bar{\vet x}$ <strong>then</strong>&emsp;*// ciclo lungo*  
    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<strong>for</strong> $j\in\mathscr{D}$ <strong>do</strong>  
    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;$\rho_j \leftarrow$ numero casuale uniforme in $[-0.3,\,0.7]$  
    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<strong>if</strong> $|\tilde x_j-\hat x_j|+\max\{\rho_j,0\}>\frac12$ <strong>then</strong>  
    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;$\hat x_j\leftarrow 1-\hat x_j$&emsp;*// restart*  
    &emsp;&emsp;&emsp;&emsp;$\bar{\vet x}\leftarrow\hat{\vet x}$  
    &emsp;&emsp;<strong>return</strong> FALLIMENTO

- <strong>Perché la pompa funziona.</strong> Ogni proiezione avvicina il punto di $\mathcal{L}$ all'ultimo punto intero, e ogni arrotondamento porta il punto intero su quello più vicino. La distanza fra le due successioni tende a diminuire, e i punti vengono <em>pompati</em> verso una regione in cui $\mathcal{L}$ contiene punti interi. Ogni iterazione costa un LP e un arrotondamento.

- <strong>Cicli corti.</strong> Se l'arrotondamento della proiezione restituisce lo stesso punto intero, la pompa ripeterebbe all'infinito gli stessi due punti. Cambia allora le componenti di $\bar{\vet x}$ su cui $\tilde{\vet x}$ è più incerto, quelle con il $|\tilde x_j-\bar x_j|$ più grande.

- La pompa originale fa il flip di un numero casuale di componenti compreso fra $10$ e $30$. Sulle piccole istanze di queste note basta un flip: il codice cambia la sola componente con il $|\tilde x_j-\bar x_j|$ più grande (la prima, in caso di pareggio).

- <strong>Cicli lunghi.</strong> La pompa può anche ciclare fra più punti interi. Quando il nuovo punto intero coincide con uno degli ultimi, la pompa originale esegue un <strong>restart</strong>: una componente binaria viene invertita quando $|\tilde x_j-\hat x_j|+\max\{\rho_j,0\}>\frac12$, con $\rho_j$ casuale uniforme in $[-0.3,0.7]$, così che le componenti in cui $\tilde x_j$ è lontano da $\hat x_j$ vengano invertite con alta probabilità.

- <strong>Numeri casuali.</strong> Nei codici di questo capitolo, i numeri casuali sono prodotti dal generatore <em>minimal standard</em> di Park e Miller, con aritmetica intera a $64$ bit:

    $$
    seed \leftarrow (16807\cdot seed) \bmod (2^{31}-1), \qquad u = \frac{seed}{2^{31}-1}\in(0,1),
    $$

    e nella pompa $\rho_j=u-0.3$. Fissare il seme iniziale rende ogni esecuzione riproducibile.

- <strong>La funzione obiettivo.</strong> Dopo il primo LP, la funzione obiettivo originale $f$ viene ignorata: la pompa trova una soluzione ammissibile, ma non necessariamente buona. La <em>objective feasibility pump</em> di Achterberg e Berthold [\[1\]](#ref-AB07) minimizza una combinazione $(1-\alpha)\,\Delta(\vet x,\bar{\vet x})+\alpha\, f(\vet x)$ con un peso $\alpha$ che diminuisce a ogni iterazione: le soluzioni trovate sono molto migliori, al prezzo di qualche iterazione in più.

- <strong>Variabili intere generali.</strong> La pompa è nata per variabili binarie, dove il flip cambia $\bar x_j$ in $1-\bar x_j$; per variabili intere generali sposta $\bar x_j$ di un'unità verso $\tilde x_j$, e la distanza usa le variabili ausiliarie $d_j$ [\[2\]](#ref-BFL07).

<a id="box-14-ex-fp2"></a>

!!! esempio "Esempio 10.6: La feasibility pump in due variabili"

    Consideriamo il programma intero

    \begin{align*}
    && \max ~~ x_1 + 4\,x_2 & & \\[0.5ex]
    && \text{soggetto a} \quad 4\,x_1 + 3\,x_2 &\ge 7 & \\[0.5ex]
    && 4\,x_1 + 5\,x_2 &\le 11 & \\[0.5ex]
    && x_1 &\in \{0,1,\dots,5\} & \\[0.5ex]
    && x_2 &\in \{0,1,\dots,5\} &
    \end{align*}

    La regione $\mathcal{L}$ è il triangolo di vertici $\big(\frac14,2\big)$, $\big(\frac74,0\big)$, $\big(\frac{11}{4},0\big)$, che contiene solo due punti interi, $(1,1)$ e $(2,0)$. La figura mostra le due successioni di punti: quadrati per i punti di $\mathcal{L}$, cerchi per i punti interi, e i rombi $\{\vet x:\Delta(\vet x,\bar{\vet x})\le r\}$ delle due proiezioni.

    ![Figura 2](../img/10-mip-heuristics/fig02.svg){ .fig loading=lazy  }

    Le iterazioni sono le seguenti.

    <div class="tabella" markdown="0"><table>
    <tr>
    <th><span class="arithmatex">\(k\)</span></th>
    <th>punto intero</th>
    <th>proiezione <span class="arithmatex">\(\tilde{\vet x}^{k}\)</span></th>
    <th><span class="arithmatex">\(\Delta\big(\tilde{\vet x}^{k},\bar{\vet x}^{k-1}\big)\)</span></th>
    <th>punto intero successivo</th>
    </tr>
    <tr>
    <td><span class="arithmatex">\(0\)</span></td>
    <td>—</td>
    <td>ottimo LP <span class="arithmatex">\(\big(\frac14,2\big)\)</span></td>
    <td>—</td>
    <td>arrotondamento: <span class="arithmatex">\(\bar{\vet x}^0=(0,2)\)</span></td>
    </tr>
    <tr>
    <td><span class="arithmatex">\(1\)</span></td>
    <td><span class="arithmatex">\(\bar{\vet x}^0=(0,2)\)</span></td>
    <td><span class="arithmatex">\(\big(\frac14,2\big)\)</span></td>
    <td><span class="arithmatex">\(\frac14\)</span></td>
    <td><span class="arithmatex">\(\rnd{\tilde{\vet x}^{1}}=\bar{\vet x}^0\)</span>: flip di <span class="arithmatex">\(x_1\)</span>, <span class="arithmatex">\(\bar{\vet x}^1=(1,2)\)</span></td>
    </tr>
    <tr>
    <td><span class="arithmatex">\(2\)</span></td>
    <td><span class="arithmatex">\(\bar{\vet x}^1=(1,2)\)</span></td>
    <td><span class="arithmatex">\(\big(1,\frac75\big)\)</span></td>
    <td><span class="arithmatex">\(\frac35\)</span></td>
    <td>arrotondamento: <span class="arithmatex">\(\bar{\vet x}^2=(1,1)\)</span></td>
    </tr>
    <tr>
    <td><span class="arithmatex">\(3\)</span></td>
    <td><span class="arithmatex">\(\bar{\vet x}^2=(1,1)\)</span></td>
    <td><span class="arithmatex">\((1,1)\)</span></td>
    <td><span class="arithmatex">\(0\)</span></td>
    <td>stop: ammissibile</td>
    </tr>
    </table></div>

    <strong>Iterazione 0.</strong> L'ottimo LP è il vertice $\big(\frac14,2\big)$, di valore $\frac{33}{4}$. Il suo arrotondamento $(0,2)$ viola il primo vincolo: $4\cdot0+3\cdot2=6<7$.

    <strong>Iterazione 1.</strong> Con $\bar{\vet x}^0=(0,2)$, $x_1$ è al suo limite inferiore e $\Delta(\vet x,\bar{\vet x}^0)=x_1+|x_2-2|$. La distanza L$_1$ di un punto da un segmento che non è né orizzontale, né verticale, né di pendenza $\pm1$ è minima in un estremo o dove il segmento incontra la retta orizzontale o quella verticale passante per il punto; i candidati sono quindi i tre vertici e queste intersezioni. La retta orizzontale $x_2=2$ tocca $\mathcal{L}$ solo nel vertice $\big(\frac14,2\big)$, e la retta verticale $x_1=0$ non lo incontra; il punto più vicino è $\tilde{\vet x}^{1}=\big(\frac14,2\big)$, a distanza $\frac14$. Il suo arrotondamento è di nuovo $(0,2)=\bar{\vet x}^0$: un ciclo corto. La componente con il $|\tilde x^{1}_j-\bar x^0_j|$ più grande è $x_1$ ($\frac14$ contro $0$), che si sposta di un'unità verso $\frac14$: $\bar{\vet x}^1=(1,2)$.

    <strong>Iterazione 2.</strong> Il punto $(1,2)$ viola il secondo vincolo ($14>11$). La retta verticale $x_1=1$ attraversa $\mathcal{L}$ fra $(1,1)$ e $\big(1,\frac75\big)$, a distanze $1$ e $\frac35$ da $(1,2)$; la retta orizzontale $x_2=2$ dà $\big(\frac14,2\big)$, a distanza $\frac34$; gli altri due vertici sono più lontani. Quindi $\tilde{\vet x}^{2}=\big(1,\frac75\big)$, e il suo arrotondamento $(1,1)$ è un punto nuovo.

    <strong>Iterazione 3.</strong> Il punto $(1,1)$ appartiene a $\mathcal{L}$ ($4+3=7\ge7$ e $4+5=9\le 11$): la sua distanza da $\mathcal{L}$ è $0$, e la pompa restituisce $(1,1)$, di valore $5$. È ottima, perché l'altro punto intero $(2,0)$ ha valore $2$.

<a id="box-15-ex-fpcar"></a>

!!! esempio "Esempio 10.7: La feasibility pump sull'esempio dell'auto e su $P72$"

    <strong>Esempio dell'auto.</strong> L'arrotondamento della soluzione LP dà $\bar{\vet x}^0=(4,3)$, che è inammissibile.

    <div class="tabella" markdown="0"><table>
    <tr>
    <th><span class="arithmatex">\(k\)</span></th>
    <th>proiezione <span class="arithmatex">\(\tilde{\vet x}^{k}\)</span></th>
    <th><span class="arithmatex">\(\Delta\big(\tilde{\vet x}^{k},\bar{\vet x}^{k-1}\big)\)</span></th>
    <th>punto intero successivo</th>
    </tr>
    <tr>
    <td><span class="arithmatex">\(1\)</span></td>
    <td><span class="arithmatex">\(\big(\frac72,\frac52\big)\)</span></td>
    <td><span class="arithmatex">\(1\)</span></td>
    <td><span class="arithmatex">\(\rnd{\tilde{\vet x}^1}=\bar{\vet x}^0\)</span>: flip di <span class="arithmatex">\(x_1\)</span>, <span class="arithmatex">\(\bar{\vet x}^1=(3,3)\)</span></td>
    </tr>
    <tr>
    <td><span class="arithmatex">\(2\)</span></td>
    <td><span class="arithmatex">\(\big(3,\frac{37}{14}\big)\)</span></td>
    <td><span class="arithmatex">\(\frac{5}{14}\)</span></td>
    <td><span class="arithmatex">\(\rnd{\tilde{\vet x}^2}=\bar{\vet x}^1\)</span>: flip di <span class="arithmatex">\(x_2\)</span>, <span class="arithmatex">\(\bar{\vet x}^2=(3,2)\)</span></td>
    </tr>
    <tr>
    <td><span class="arithmatex">\(3\)</span></td>
    <td><span class="arithmatex">\((3,2)\)</span></td>
    <td><span class="arithmatex">\(0\)</span></td>
    <td>stop: ammissibile</td>
    </tr>
    </table></div>

    All'iterazione $1$ le due componenti di $\tilde{\vet x}^1$ sono alla stessa distanza $\frac12$ da $\bar{\vet x}^0$, e il flip prende la prima. La pompa ha bisogno di <strong>due flip</strong> e restituisce $(3,2)$, di valore $13$: è ammissibile, ma non ottima ($z(\ILP)=14$), perché dopo il primo LP la funzione obiettivo viene ignorata.

    <strong>$P72$.</strong> L'arrotondamento e il diving falliscono (Esempi [10.2](#box-7-ex-rounding), [Esempio 10.5](#box-11-ex-divefail)). La pompa arrotonda la soluzione LP a $\bar{\vet x}^0=(1,0,2,3,1)$, che viola il primo vincolo, e ha bisogno di tre proiezioni e di un flip (di $x_3$, da $2$ a $1$) per arrivare alla soluzione ammissibile

    $$
    \bar{\vet x}=(0,0,1,3,1), \qquad f(\bar{\vet x})=2 ,
    $$

    molto lontana da $z(\ILP)=7$ e dall'upper bound $8$.

- La pompa è un metodo per trovare una <em>prima</em> soluzione ammissibile, e lo fa bene. La qualità della soluzione è compito dei metodi di miglioramento delle prossime sezioni, che partono da una soluzione incumbent.

## 10.6 Migliorare l'incumbent con un sotto-MIP { #sez-sec-submip }

- I metodi delle sezioni precedenti costruiscono una soluzione a partire dal rilassamento lineare. I tre metodi di questa sezione partono da una soluzione <strong>incumbent</strong> $\bar{\vet x}$, calcolata con una qualunque euristica — arrotondamento, diving, feasibility pump — e cercano di migliorarla.

- Seguono tutti lo stesso schema: aggiungono al MIP alcuni vincoli che lo restringono a un insieme di soluzioni <em>legate a</em> $\bar{\vet x}$, e risolvono il problema ristretto, detto <strong>sotto-MIP</strong>, con il solver MIP.

- Il sotto-MIP è un intorno di $\bar{\vet x}$, ma molto ampio, esplorato in modo esatto dal solver e non per enumerazione. È l'idea della <strong>large neighbourhood search</strong> (ricerca in un intorno ampio), con il solver come metodo di riparazione.

- Interessano solo le soluzioni <em>migliori</em> dell'incumbent. Con un passo di miglioramento $\theta>0$, il sotto-MIP contiene il <strong>vincolo di cutoff</strong>

!!! chiave ""

    $$
    f(\vet x)\;\le\; f(\bar{\vet x})-\theta \qquad\text{(minimizzazione)},\qquad\qquad
    f(\vet x)\;\ge\; f(\bar{\vet x})+\theta \qquad\text{(massimizzazione)}.
    $$

- Quando $f$ assume valori interi su tutte le soluzioni ammissibili, come in tutti gli esempi di questo capitolo, $\theta=1$ esclude esattamente le soluzioni che non sono migliori di $\bar{\vet x}$. Se il sotto-MIP con il cutoff è inammissibile, l'intorno non contiene soluzioni migliori: il solver ha <em>dimostrato</em> che $\bar{\vet x}$ è un ottimo locale per quell'intorno.

- I metodi differiscono per <em>quali</em> vincoli definiscono l'intorno: RINS fissa variabili (<strong>fissaggio rigido</strong>, hard fixing), il local branching e la proximity search limitano il numero di variabili che cambiano (<strong>fissaggio morbido</strong>, soft fixing).

### 10.6.1 RINS { #sez-sec-rins }

<a id="box-16-def-rins"></a>

!!! definizione "Definizione 10.9: RINS"

    <em>RINS</em> (Relaxation Induced Neighbourhood Search, ricerca nell'intorno indotto dal rilassamento) [\[3\]](#ref-DRL05) confronta l'incumbent $\bar{\vet x}$ con la soluzione $\tilde{\vet x}$ del rilassamento lineare. Le variabili intere su cui le due soluzioni <em>concordano</em> vengono fissate al loro valore comune; il sotto-MIP sulle variabili rimanenti, con il vincolo di cutoff, viene risolto dal solver MIP.

- Lo pseudocodice di RINS è il seguente:

!!! algoritmo "Algoritmo: RINS"

    <strong>Input:</strong> MIP [(10.1)](#eq-eq-mip); incumbent $\bar{\vet x}$; passo di miglioramento $\theta$  
    <strong>Output:</strong> Una soluzione buona almeno quanto $\bar{\vet x}$  
    <strong>function</strong> RINS(MIP, $\bar{\vet x}$, $\theta$)  
    &emsp;&emsp;$\tilde{\vet x} :=$ soluzione ottima del rilassamento lineare  
    &emsp;&emsp;<strong>for</strong> $j\in\mathscr{D}$ <strong>do</strong>  
    &emsp;&emsp;&emsp;&emsp;<strong>if</strong> $\tilde x_j=\bar x_j$ <strong>then</strong>  
    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;fissa $x_j:=\bar x_j$&emsp;*// LP e incumbent concordano*  
    &emsp;&emsp;aggiungi il vincolo di cutoff $f(\vet x)\le f(\bar{\vet x})-\theta$  
    &emsp;&emsp;risolvi il sotto-MIP con il solver MIP (con un limite sui nodi)  
    &emsp;&emsp;<strong>if</strong> il sotto-MIP ha una soluzione ammissibile $\vet x'$ <strong>then</strong>  
    &emsp;&emsp;&emsp;&emsp;<strong>return</strong> $\vet x'$&emsp;*// migliore di $\bar{\vet x}$*  
    &emsp;&emsp;<strong>else</strong>  
    &emsp;&emsp;&emsp;&emsp;<strong>return</strong> $\bar{\vet x}$&emsp;*// nessuna soluzione migliore nell'intorno*

- <strong>Perché l'accordo.</strong> La soluzione LP è ottimista e forse inammissibile, l'incumbent è ammissibile e forse scadente: due consiglieri con difetti opposti. Dove concordano, il valore è probabilmente giusto anche nelle buone soluzioni; dove non concordano, c'è qualcosa da decidere, e la decisione è lasciata al solver.

- <strong>L'ampiezza dell'intorno non si sceglie.</strong> È il numero di variabili su cui $\tilde{\vet x}$ e $\bar{\vet x}$ non concordano: piccolo se l'incumbent è già vicino alla soluzione LP, grande altrimenti. Per questo il sotto-MIP si risolve con un limite sul numero di nodi.

- <strong>RINS dentro il branch-and-bound.</strong> Danna, Rothberg e Le Pape applicano RINS nei nodi dell'albero di branch-and-bound, con la soluzione LP del nodo: nodi più profondi hanno soluzioni LP diverse, quindi intorni diversi dello stesso incumbent. Ogni solver MIP moderno esegue RINS in questo modo.

- <strong>Fissaggio rigido.</strong> Una variabile fissata non può cambiare nel sotto-MIP. Se una soluzione migliore richiede di cambiare una variabile su cui $\tilde{\vet x}$ e $\bar{\vet x}$ concordano, RINS non può trovarla.

<a id="box-17-ex-rins"></a>

!!! esempio "Esempio 10.8: RINS su $P7$ e su $P42$"

    <strong>$P7$.</strong> L'incumbent è $\bar{\vet x}=(2,0)$, di valore $6$ (arrotondamento per difetto), e la soluzione LP è $\tilde{\vet x}=\big(\frac52,0\big)$. Concordano su $x_2=0$, che viene fissata. Il sotto-MIP

    $$
    \max~ 3\,x_1 \quad\text{soggetto a}\quad x_1\le 12,\quad 2\,x_1\le 5,\quad 3\,x_1\ge 7,\quad x_1\in\Z_{\ge 0}
    $$

    è inammissibile: il secondo vincolo dà $x_1\le2$, il cutoff $x_1\ge3$. RINS restituisce l'incumbent. La soluzione ottima $(2,1)$ ha $x_2=1$, ma $x_2$ è fissata a $0$ perché l'LP e l'incumbent concordano su di essa.

    <strong>$P42$.</strong> L'incumbent è $\bar{\vet x}=(2,1,0)$, di valore $8$ (arrotondamento per difetto), e $\tilde{\vet x}=\big(\frac52,\frac32,0\big)$. Concordano solo su $x_3=0$. Il sotto-MIP su $x_1,x_2$ con il cutoff $3x_1+2x_2\ge 9$ viene risolto da Gurobi, che restituisce $(2,2,0)$, di valore $10$: <strong>RINS trova una soluzione ottima</strong>.

- Su $P7$ la variabile che deve cambiare è proprio quella su cui l'LP e l'incumbent concordano; su $P42$ l'accordo riguarda una variabile che non deve cambiare, e l'intorno contiene l'ottimo.

### 10.6.2 Local branching { #sez-sec-lb }

- RINS decide <em>quali</em> variabili possono cambiare. Il local branching [\[5\]](#ref-FL03) decide solo <em>quante</em> possono cambiare, e lascia al solver la scelta di quali. Per un MIP le cui variabili intere sono binarie (oppure, con le variabili ausiliarie $d_j$ della distanza, intere generali), il <strong>vincolo di local branching</strong> di raggio $k\in\Z_{\ge1}$ è

!!! chiave ""

    $$
    \Delta(\vet x,\bar{\vet x}) \;=\; \sum_{j\in\mathscr{D}:\ \bar x_j=1} (1-x_j) \;+\; \sum_{j\in\mathscr{D}:\ \bar x_j=0} x_j \;\le\; k
    $$

- $\Delta(\vet x,\bar{\vet x})$ è la distanza della [Definizione 10.7](#box-12-def-distance) per variabili binarie: sui punti binari conta le variabili il cui valore differisce da quello dell'incumbent. Il vincolo è lineare, quindi si può aggiungere al MIP come qualunque altro vincolo.

<a id="box-18-def-lb"></a>

!!! definizione "Definizione 10.10: local branching"

    Il <em>local branching</em> risolve, con il solver MIP, il sotto-MIP formato dal MIP, dal vincolo di cutoff e dal vincolo di local branching $\Delta(\vet x,\bar{\vet x})\le k$. Se trova una soluzione migliore, la nuova soluzione diventa l'incumbent e l'intorno viene centrato su di essa. Se dimostra che l'intorno non contiene soluzioni migliori, il raggio $k$ viene aumentato. In entrambi i casi l'intorno esplorato viene escluso dai sotto-MIP successivi con il vincolo <em>inverso</em> $\Delta(\vet x,\bar{\vet x})\ge k+1$.

!!! algoritmo "Algoritmo: Local branching"

    <strong>Input:</strong> MIP [(10.1)](#eq-eq-mip); incumbent $\bar{\vet x}$; raggio $k$; raggio massimo $k_{\max}$; passo $k_{step}$; passo di miglioramento $\theta$  
    <strong>Output:</strong> Una soluzione buona almeno quanto $\bar{\vet x}$  
    <strong>function</strong> LocalBranching(MIP, $\bar{\vet x}$, $k$, $k_{\max}$, $k_{step}$, $\theta$)  
    &emsp;&emsp;$\mathscr{R} := \emptyset$&emsp;*// vincoli inversi aggiunti finora*  
    &emsp;&emsp;<strong>while</strong> $k\le k_{\max}$ <strong>do</strong>  
    &emsp;&emsp;&emsp;&emsp;risolvi il MIP con i vincoli $\mathscr{R}$, $\Delta(\vet x,\bar{\vet x})\le k$ e $f(\vet x)\le f(\bar{\vet x})-\theta$  
    &emsp;&emsp;&emsp;&emsp;$\mathscr{R} \leftarrow \mathscr{R}\cup\big\{\Delta(\vet x,\bar{\vet x})\ge k+1\big\}$&emsp;*// non esplorarlo mai più*  
    &emsp;&emsp;&emsp;&emsp;<strong>if</strong> si trova una soluzione ammissibile $\vet x'$ <strong>then</strong>  
    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;$\bar{\vet x} \leftarrow \vet x'$&emsp;*// ricentra l'intorno*  
    &emsp;&emsp;&emsp;&emsp;<strong>else</strong>  
    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;$k \leftarrow k+k_{step}$&emsp;*// nessuna soluzione migliore entro distanza $k$*  
    &emsp;&emsp;<strong>return</strong> $\bar{\vet x}$

- <strong>Fissaggio morbido.</strong> Con $|\mathscr{D}|$ variabili binarie, l'intorno $\Delta(\vet x,\bar{\vet x})\le k$ contiene $\sum_{i=0}^{k}\binom{|\mathscr{D}|}{i}$ punti binari: per $k$ piccolo è molto più piccolo dell'intero spazio, ma non si vincola a nessuna variabile in particolare. Possono cambiare $k$ variabili qualsiasi.

- <strong>Uno schema di branching.</strong> Il nome viene dall'uso originale del vincolo come <em>regola di branching</em>: si risolve prima il ramo sinistro $\Delta(\vet x,\bar{\vet x})\le k$, e il ramo destro $\Delta(\vet x,\bar{\vet x})\ge k+1$ contiene il resto del problema. Se il ramo sinistro migliora l'incumbent, il ramo destro viene suddiviso di nuovo attorno al nuovo incumbent; l'albero è una lunga catena di rami destri:

![Figura 3](../img/10-mip-heuristics/fig03.svg){ .fig loading=lazy  }

- <strong>Il raggio.</strong> $k$ deve essere abbastanza piccolo perché il sotto-MIP si risolva in fretta, e abbastanza grande perché l'intorno contenga soluzioni migliori. Il metodo originale usa valori piccoli rispetto a $|\mathscr{D}|$, un limite di tempo su ogni sotto-MIP, e una <em>diversificazione</em> — un $k$ più grande, o un salto verso una soluzione diversa — quando non trova miglioramenti.

- <strong>Local branching e ricerca locale.</strong> Con $k=1$ l'intorno contiene i punti ottenuti da $\bar{\vet x}$ cambiando di un'unità una sola variabile intera (una variabile binaria viene invertita); con $k$ più grande contiene i punti che differiscono da $\bar{\vet x}$ in più variabili, o di più unità. È una ricerca locale il cui intorno viene esplorato in modo esatto dal solver.

<a id="box-19-ex-lb"></a>

!!! esempio "Esempio 10.9: Local branching su $P7$ e su $P72$"

    <strong>$P7$.</strong> Si parte da $\bar{\vet x}^1=(2,0)$, di valore $6$, con $k=1$, $k_{\max}=3$, $k_{step}=1$ e $\theta=1$.

    <strong>$k=1$.</strong> Il sotto-MIP con $\Delta(\vet x,\bar{\vet x}^1)\le1$ e il cutoff $3x_1+x_2\ge7$ restituisce $(2,1)$, di valore $7$: il nuovo incumbent $\bar{\vet x}^2$, trovato a distanza $1$ (la variabile $x_2$ cambia di un'unità). Si aggiunge $\Delta(\vet x,\bar{\vet x}^1)\ge2$.

    <strong>$k=1,2,3$, attorno a $\bar{\vet x}^2$.</strong> Nessuna soluzione di valore almeno $8$: $k$ diventa $4>k_{\max}$ e il metodo si ferma con $(2,1)$, l'ottimo. Dove RINS falliva, il local branching lascia al solver la scelta di cambiare $x_2$.

    <strong>$P72$.</strong> Si parte dalla soluzione della feasibility pump, $\bar{\vet x}^1=(0,0,1,3,1)$, di valore $2$, con gli stessi parametri.

    <div class="tabella" markdown="0"><table>
    <tr>
    <th><span class="arithmatex">\(k\)</span></th>
    <th>attorno a</th>
    <th>soluzione restituita</th>
    <th>valore</th>
    </tr>
    <tr>
    <td><span class="arithmatex">\(1\)</span></td>
    <td><span class="arithmatex">\(\bar{\vet x}^1\)</span></td>
    <td><span class="arithmatex">\(\bar{\vet x}^2=(0,0,1,2,1)\)</span>, a distanza <span class="arithmatex">\(1\)</span></td>
    <td><span class="arithmatex">\(4\)</span></td>
    </tr>
    <tr>
    <td><span class="arithmatex">\(1\)</span></td>
    <td><span class="arithmatex">\(\bar{\vet x}^2\)</span></td>
    <td>nessuna soluzione di valore <span class="arithmatex">\(\ge5\)</span></td>
    <td>—</td>
    </tr>
    <tr>
    <td><span class="arithmatex">\(2\)</span></td>
    <td><span class="arithmatex">\(\bar{\vet x}^2\)</span></td>
    <td><span class="arithmatex">\(\bar{\vet x}^3=(0,1,1,2,0)\)</span>, a distanza <span class="arithmatex">\(2\)</span></td>
    <td><span class="arithmatex">\(7\)</span></td>
    </tr>
    <tr>
    <td><span class="arithmatex">\(2,3\)</span></td>
    <td><span class="arithmatex">\(\bar{\vet x}^3\)</span></td>
    <td>nessuna soluzione di valore <span class="arithmatex">\(\ge8\)</span></td>
    <td>—</td>
    </tr>
    </table></div>

    Con $k_{\max}=3$ il metodo si ferma con valore $7$, l'ottimo, dopo due miglioramenti. Il raggio passa da $1$ a $2$ perché il miglioramento richiede di cambiare insieme $x_2$ e $x_5$, cioè due unità di distanza.

- Il local branching esegue una ricerca locale con un intorno la cui ampiezza è controllata da $k$, esplorato in modo esatto dal solver, e allarga l'intorno quando resta bloccato: è proprio l'idea della variable neighbourhood search, con il solver che esegue l'esplorazione.

### 10.6.3 Proximity search { #sez-sec-ps }

- Il local branching mantiene la funzione obiettivo e vincola la distanza. La <strong>proximity search</strong> di Fischetti e Monaci [\[6\]](#ref-FM14) fa il contrario: mantiene il cutoff come vincolo e <em>minimizza</em> la distanza.

<a id="box-20-def-ps"></a>

!!! definizione "Definizione 10.11: proximity search"

    Il <strong>sotto-MIP di prossimità</strong> attorno all'incumbent $\bar{\vet x}$ si scrive

    \begin{align*}
    && \min ~~ \Delta(\vet x,\bar{\vet x}) & & \\[1ex]
    && \text{soggetto a} \quad A\,\vet x &\le b, & \\[1ex]
    && l_j\le x_j &\le u_j, & \forall j\in\{1,2,\dots,N\}, \\[1ex]
    && f(\vet x) &\le f(\bar{\vet x})-\theta, & \\[1ex]
    && x_j &\in\Z, & \forall j\in\mathscr{D}.
    \end{align*}

    La <em>proximity search</em> lo risolve, sostituisce l'incumbent con la sua soluzione e ripete, finché il sotto-MIP di prossimità non diventa inammissibile.

!!! algoritmo "Algoritmo: Proximity search"

    <strong>Input:</strong> MIP [(10.1)](#eq-eq-mip); incumbent $\bar{\vet x}$; passo di miglioramento $\theta$  
    <strong>Output:</strong> Una soluzione buona almeno quanto $\bar{\vet x}$  
    <strong>function</strong> ProximitySearch(MIP, $\bar{\vet x}$, $\theta$)  
    &emsp;&emsp;<strong>while</strong> vero <strong>do</strong>  
    &emsp;&emsp;&emsp;&emsp;risolvi $\min\{\Delta(\vet x,\bar{\vet x}) : \vet x \text{ ammissibile per il MIP},~ f(\vet x)\le f(\bar{\vet x})-\theta\}$  
    &emsp;&emsp;&emsp;&emsp;<strong>if</strong> il sotto-MIP di prossimità è inammissibile <strong>then</strong>  
    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<strong>return</strong> $\bar{\vet x}$&emsp;*// nessuna soluzione migliore di $f(\bar{\vet x})-\theta$*  
    &emsp;&emsp;&emsp;&emsp;$\vet x' :=$ la sua soluzione ottima  
    &emsp;&emsp;&emsp;&emsp;fissa $x_j:=x'_j$ per $j\in\mathscr{D}$ e riottimizza $f$ sulle variabili continue  
    &emsp;&emsp;&emsp;&emsp;$\bar{\vet x}\leftarrow \vet x'$&emsp;*// la soluzione migliorante più vicina*

- <strong>Perché minimizzare la distanza.</strong> Spesso è proprio la funzione obiettivo originale a rendere difficile un MIP: il suo rilassamento lineare spinge il solver verso punti frazionari lontani dalle soluzioni ammissibili. Nel sotto-MIP di prossimità la funzione obiettivo è la distanza, e la soluzione LP resta vicina a $\bar{\vet x}$, che è quasi ammissibile: le euristiche del solver funzionano bene, e di solito si trova in fretta una soluzione ammissibile.

- In pratica il sotto-MIP di prossimità non si risolve all'ottimo: qualunque soluzione ammissibile è un miglioramento.

- <strong>Nessun raggio da scegliere.</strong> L'ampiezza della mossa la decide il sotto-MIP stesso: il più piccolo cambiamento che migliora la funzione obiettivo di almeno $\theta$.

- <strong>Riottimizzare la parte continua.</strong> La soluzione del sotto-MIP ha la parte intera giusta, ma le sue variabili continue sono state scelte per minimizzare la distanza, non $f$. Fissando le variabili intere e risolvendo l'LP sulle variabili continue si ottiene il vero valore del nuovo incumbent.

- <strong>Il passo $\theta$.</strong> Un $\theta$ grande chiede miglioramenti grandi, quindi mosse ampie e sotto-MIP difficili; un $\theta$ piccolo dà sotto-MIP facili e molte iterazioni. Con $\theta=1$ e valori interi della funzione obiettivo, il metodo dimostra anche l'ottimalità.

<a id="box-21-prop-ps"></a>

!!! teorema "Proposizione 10.12"

    Se $f$ assume valori interi su tutte le soluzioni ammissibili del MIP e il sotto-MIP di prossimità attorno a $\bar{\vet x}$ con $\theta=1$ è inammissibile, allora $f(\bar{\vet x})=z(I)$.

??? dimostrazione "Dimostrazione"

    La regione ammissibile del sotto-MIP di prossimità è l'insieme delle soluzioni ammissibili $\vet x$ del MIP con $f(\vet x)\le f(\bar{\vet x})-1$; non dipende dalla funzione obiettivo $\Delta$. Se è vuota, ogni soluzione ammissibile ha $f(\vet x)>f(\bar{\vet x})-1$, quindi $f(\vet x)\ge f(\bar{\vet x})$ perché entrambi i valori sono interi. Dunque $\bar{\vet x}$ è ottima. <span class="qed">□</span>

<a id="box-22-ex-ps"></a>

!!! esempio "Esempio 10.10: Proximity search su $P7$ e su $P72$"

    <strong>$P7$.</strong> Da $\bar{\vet x}=(2,0)$, di valore $6$: la soluzione più vicina di valore almeno $7$ è $(2,1)$, a distanza $1$. Attorno a essa, nessuna soluzione ha valore almeno $8$ (il bound LP è $\frac{15}{2}$): per la [Proposizione 10.12](#box-21-prop-ps), $(2,1)$ è <strong>ottima</strong>.

    <strong>$P72$.</strong> Dalla soluzione della feasibility pump, di valore $2$:

    <div class="tabella" markdown="0"><table>
    <tr>
    <th>iterazione</th>
    <th>cutoff</th>
    <th><span class="arithmatex">\(\min\Delta\)</span></th>
    <th>soluzione restituita</th>
    <th>valore</th>
    </tr>
    <tr>
    <td><span class="arithmatex">\(1\)</span></td>
    <td><span class="arithmatex">\(f(\vet x)\ge 3\)</span></td>
    <td><span class="arithmatex">\(1\)</span></td>
    <td><span class="arithmatex">\((0,0,1,2,1)\)</span></td>
    <td><span class="arithmatex">\(4\)</span></td>
    </tr>
    <tr>
    <td><span class="arithmatex">\(2\)</span></td>
    <td><span class="arithmatex">\(f(\vet x)\ge 5\)</span></td>
    <td><span class="arithmatex">\(2\)</span></td>
    <td><span class="arithmatex">\((0,1,1,2,0)\)</span></td>
    <td><span class="arithmatex">\(7\)</span></td>
    </tr>
    <tr>
    <td><span class="arithmatex">\(3\)</span></td>
    <td><span class="arithmatex">\(f(\vet x)\ge 8\)</span></td>
    <td>—</td>
    <td>inammissibile</td>
    <td>—</td>
    </tr>
    </table></div>

    Alla terza iterazione il sotto-MIP è inammissibile, e la [Proposizione 10.12](#box-21-prop-ps) dimostra che $7$ è ottimo, mentre l'upper bound $\lfloor z(\LP)\rfloor=8$ della radice non basta a dimostrarlo.

- La dimostrazione di ottimalità viene dal solver, che dimostra l'inammissibilità dell'ultimo sotto-MIP con i propri bound duali: la proximity search, usata con $\theta=1$, è un metodo esatto che migliora l'incumbent strada facendo.

## 10.7 Relax-and-fix e fix-and-optimize { #sez-sec-rf }

- Le variabili di molti MIP si presentano in <strong>blocchi</strong> con un ordine naturale, per esempio perché sono indicizzate da una sequenza, e le decisioni di un blocco interagiscono soprattutto con quelle dei blocchi vicini. I due metodi di questa sezione sfruttano una partizione delle variabili intere in blocchi: risolvono una sequenza di MIP piccoli invece di uno grande.

- Una volta fissate le variabili intere, il resto è un LP: le decisioni difficili sono le variabili intere, e il rilassamento lineare è lo strumento che stima l'effetto delle decisioni non ancora prese.

### 10.7.1 Relax-and-fix

<a id="box-23-def-rf"></a>

!!! definizione "Definizione 10.13: relax-and-fix"

    Il <em>relax-and-fix</em> suddivide le variabili intere in blocchi $B_1,B_2,\dots,B_p$, in un ordine dato. Al passo $r$ risolve il MIP in cui le variabili di $B_r$ sono intere, quelle di $B_1,\dots,B_{r-1}$ sono fissate ai valori decisi nei passi precedenti, e quelle di $B_{r+1},\dots,B_p$ sono <em>rilassate</em> (continue). Poi fissa le variabili di $B_r$ ai loro valori e passa al blocco successivo. La soluzione dell'ultimo passo è ammissibile.

!!! algoritmo "Algoritmo: Relax-and-fix"

    <strong>Input:</strong> MIP [(10.1)](#eq-eq-mip); partizione $B_1,B_2,\dots,B_p$ di $\mathscr{D}$, in un ordine dato  
    <strong>Output:</strong> Soluzione ammissibile, oppure FALLIMENTO  
    <strong>function</strong> RelaxAndFix(MIP, $B_1,\dots,B_p$)  
    &emsp;&emsp;<strong>for</strong> $r := 1$ <strong>to</strong> $p$ <strong>do</strong>  
    &emsp;&emsp;&emsp;&emsp;risolvi il MIP con: $x_j$ fissata per $j\in B_1\cup\dots\cup B_{r-1}$, $x_j$ intera per $j\in B_r$, $x_j$ continua per $j\in B_{r+1}\cup\dots\cup B_p$  
    &emsp;&emsp;&emsp;&emsp;<strong>if</strong> è inammissibile <strong>then</strong>  
    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<strong>return</strong> FALLIMENTO  
    &emsp;&emsp;&emsp;&emsp;$\vet x' :=$ la sua soluzione ottima  
    &emsp;&emsp;&emsp;&emsp;fissa $x_j:=x'_j$ per ogni $j\in B_r$  
    &emsp;&emsp;<strong>return</strong> $\vet x'$&emsp;*// tutte le variabili intere sono intere*

- <strong>Perché.</strong> Le decisioni dei primi blocchi si prendono con cura (intere), mentre le altre sono solo stimate (rilassate). Ogni MIP ha le variabili intere di un solo blocco, quindi è piccolo.

- <strong>Miopia.</strong> I blocchi rilassati sono ottimisti: il rilassamento può comprare una frazione di decisione per una frazione del suo costo. Una decisione che sembra buona perché il resto costa poco può rivelarsi cattiva quando il resto diventa intero. Le decisioni fissate possono perfino rendere inammissibile un passo successivo.

- <strong>Varianti.</strong> Blocchi più grandi danno soluzioni migliori e MIP più difficili; con blocchi <em>sovrapposti</em> si risolve $B_r\cup B_{r+1}$ come intero ma si fissa solo $B_r$, per vedere un po' più lontano.

<a id="box-24-ex-rf"></a>

!!! esempio "Esempio 10.11: Relax-and-fix su $P46$"

    Le variabili intere sono $x_1,x_2,x_3$. Il rilassamento lineare ha valore $\frac{499}{25}$, l'upper bound è $19$ e $z(\ILP)=16$, raggiunto da $(0,1,1)$.

    <strong>Una variabile per blocco, $B_1=\{x_1\}$, $B_2=\{x_2\}$, $B_3=\{x_3\}$.</strong>

    <div class="tabella" markdown="0"><table>
    <tr>
    <th>passo <span class="arithmatex">\(r\)</span></th>
    <th>valore del MIP del passo <span class="arithmatex">\(r\)</span></th>
    <th>soluzione del MIP</th>
    <th>fissaggio</th>
    </tr>
    <tr>
    <td><span class="arithmatex">\(1\)</span></td>
    <td><span class="arithmatex">\(\frac{296}{15}\approx19.73\)</span></td>
    <td><span class="arithmatex">\(\big(0,\frac{26}{15},\frac{14}{15}\big)\)</span></td>
    <td><span class="arithmatex">\(x_1:=0\)</span></td>
    </tr>
    <tr>
    <td><span class="arithmatex">\(2\)</span></td>
    <td><span class="arithmatex">\(\frac{56}{3}\approx18.67\)</span></td>
    <td><span class="arithmatex">\(\big(0,2,\frac23\big)\)</span></td>
    <td><span class="arithmatex">\(x_2:=2\)</span></td>
    </tr>
    <tr>
    <td><span class="arithmatex">\(3\)</span></td>
    <td><span class="arithmatex">\(12\)</span></td>
    <td><span class="arithmatex">\((0,2,0)\)</span></td>
    <td><span class="arithmatex">\(x_3:=0\)</span></td>
    </tr>
    </table></div>

    Il risultato è $(0,2,0)$, di valore $12$, con un gap di $\frac{19-12}{12}\approx58.3\%$. La decisione sbagliata si prende al passo $2$: con $x_3$ rilassata, $x_2=2$ dà $\frac{56}{3}\approx18.67$ e $x_2=1$ dà $\frac{122}{7}\approx17.43$, quindi $x_2:=2$; ma allora il secondo vincolo lascia spazio solo per $x_3\le\frac23$, e $x_3$ diventa $0$ quando è intera.

    <strong>Blocchi più grandi, $B_1=\{x_1\}$, $B_2=\{x_2,x_3\}$.</strong> Il passo $1$ è lo stesso. Al passo $2$ il MIP su $x_2,x_3$ si risolve con entrambe le variabili intere: restituisce $(0,1,1)$, di valore $16$, l'<strong>ottimo</strong>.

- L'ampiezza dei blocchi bilancia la qualità della soluzione e la difficoltà dei MIP: il blocco più grande vede l'interazione fra $x_2$ e $x_3$ che i blocchi di una sola variabile non colgono.

### 10.7.2 Fix-and-optimize

<a id="box-25-def-fo"></a>

!!! definizione "Definizione 10.14: fix-and-optimize"

    Il <em>fix-and-optimize</em> migliora un incumbent $\bar{\vet x}$. Considera una sequenza di <em>finestre</em> $W_1,W_2,\dots,W_q\subseteq\mathscr{D}$, tipicamente periodi consecutivi. Per ogni finestra fissa tutte le variabili intere <em>fuori</em> dalla finestra ai loro valori in $\bar{\vet x}$, e risolve il sotto-MIP sulle variabili della finestra, con il vincolo di cutoff. Una soluzione migliore diventa l'incumbent. Le passate sulle finestre si ripetono finché un'intera passata non porta miglioramenti.

!!! algoritmo "Algoritmo: Fix-and-optimize"

    <strong>Input:</strong> MIP [(10.1)](#eq-eq-mip); incumbent $\bar{\vet x}$; finestre $W_1,\dots,W_q$; passo di miglioramento $\theta$  
    <strong>Output:</strong> Una soluzione buona almeno quanto $\bar{\vet x}$  
    <strong>function</strong> FixAndOptimize(MIP, $\bar{\vet x}$, $W_1,\dots,W_q$, $\theta$)  
    &emsp;&emsp;$improved :=$ vero  
    &emsp;&emsp;<strong>while</strong> $improved$ <strong>do</strong>  
    &emsp;&emsp;&emsp;&emsp;$improved \leftarrow$ falso  
    &emsp;&emsp;&emsp;&emsp;<strong>for</strong> $r := 1$ <strong>to</strong> $q$ <strong>do</strong>  
    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;risolvi il MIP con $x_j:=\bar x_j$ per $j\in\mathscr{D}\setminus W_r$ e $f(\vet x)\le f(\bar{\vet x})-\theta$  
    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<strong>if</strong> si trova una soluzione ammissibile $\vet x'$ <strong>then</strong>  
    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;$\bar{\vet x}\leftarrow \vet x'$;   $improved\leftarrow$ vero  
    &emsp;&emsp;<strong>return</strong> $\bar{\vet x}$

<a id="box-26-ex-fo"></a>

!!! esempio "Esempio 10.12: Fix-and-optimize su $P46$ e su $P72$"

    <strong>$P46$.</strong> Si parte dalla soluzione del relax-and-fix, $\bar{\vet x}=(0,2,0)$, di valore $12$, con le finestre $W_1=\{x_1\}$ e $W_2=\{x_2,x_3\}$ e $\theta=1$.

    <div class="tabella" markdown="0"><table>
    <tr>
    <th>finestra</th>
    <th>incumbent dopo la finestra</th>
    <th></th>
    </tr>
    <tr>
    <td><span class="arithmatex">\(\{x_1\}\)</span></td>
    <td><span class="arithmatex">\(12\)</span></td>
    <td>nessun miglioramento (<span class="arithmatex">\(x_1=1\)</span> viola il primo vincolo)</td>
    </tr>
    <tr>
    <td><span class="arithmatex">\(\{x_2,x_3\}\)</span></td>
    <td><span class="arithmatex">\(16\)</span></td>
    <td><span class="arithmatex">\(\bar{\vet x}=(0,1,1)\)</span></td>
    </tr>
    <tr>
    <td>seconda passata, entrambe le finestre</td>
    <td><span class="arithmatex">\(16\)</span></td>
    <td>nessun miglioramento: stop</td>
    </tr>
    </table></div>

    Con le tre finestre di una variabile ciascuna, $\{x_1\}$, $\{x_2\}$, $\{x_3\}$, nessuna finestra migliora $(0,2,0)$: è un ottimo locale per quelle finestre. La finestra $\{x_2,x_3\}$ rivede la decisione sbagliata del relax-and-fix e raggiunge l'ottimo $16$.

    <strong>$P72$.</strong> Si parte dalla soluzione della feasibility pump, $(0,0,1,3,1)$, di valore $2$, con le finestre $\{x_1,x_2\}$, $\{x_3,x_4\}$, $\{x_5\}$. La prima finestra non porta miglioramenti; la seconda dà $(0,0,2,4,1)$, di valore $5$; la terza e la seconda passata non ne portano. Il metodo si ferma con $5<7=z(\ILP)$: un ottimo locale rispetto a queste finestre, perché la soluzione ottima $(0,1,1,2,0)$ ne differisce in $x_2$, $x_3$, $x_4$ e $x_5$, più variabili di quante ne contenga una qualunque finestra.

- Il fix-and-optimize è una <strong>ricerca locale</strong> le cui mosse cambiano tutte insieme le variabili intere di una finestra, esplorate in modo esatto dal solver: l'equivalente, nella programmazione intera, degli intorni della ricerca locale. Si ferma in un ottimo locale rispetto a tutte le finestre.

- Relax-and-fix e fix-and-optimize sono complementari: il primo costruisce una soluzione blocco per blocco, il secondo ripara le decisioni miopi guardando più blocchi insieme.

## 10.8 Le euristiche dentro il solver { #sez-sec-gurobi }

- Un solver MIP moderno non è solo un algoritmo branch-and-bound: esegue, in automatico, gran parte delle euristiche di questo capitolo (il capitolo «Risolutori MIP: che cosa fanno» mostra log reali). In Gurobi:

    - <em>prima dell'LP della radice</em>, euristiche che non hanno bisogno del rilassamento cercano una prima soluzione;

    - <em>alla radice</em>, dopo l'LP, vengono eseguiti l'arrotondamento, diverse euristiche di diving e la feasibility pump;

    - <em>durante il branch-and-bound</em>, RINS e altre euristiche basate su sotto-MIP vengono eseguite in alcuni nodi, con la soluzione LP del nodo, e i nuovi incumbent sono segnalati nel log da una riga che inizia con <code>H</code> (euristica) invece che con <code>\*</code> (soluzione LP intera di un nodo).

- Lo sforzo dedicato alle euristiche è controllato da parametri. I più importanti sono:

<div class="tabella" markdown="0"><table>
<tr>
<th>parametro</th>
<th>default</th>
<th>significato</th>
</tr>
<tr>
<td><code>Heuristics</code></td>
<td><span class="arithmatex">\(0.05\)</span></td>
<td>frazione del lavoro dedicata alle euristiche (<span class="arithmatex">\(0\)</span> minimo e massimo <span class="arithmatex">\(1\)</span>)</td>
</tr>
<tr>
<td><code>MIPFocus</code></td>
<td><span class="arithmatex">\(0\)</span></td>
<td><span class="arithmatex">\(1\)</span>: puntare a trovare buone soluzioni ammissibili più che a migliorare il bound</td>
</tr>
<tr>
<td><code>RINS</code></td>
<td><span class="arithmatex">\(-1\)</span></td>
<td>frequenza di RINS (ogni <span class="arithmatex">\(n\)</span> nodi; <span class="arithmatex">\(-1\)</span> automatica, <span class="arithmatex">\(0\)</span> disattivata)</td>
</tr>
<tr>
<td><code>PumpPasses</code></td>
<td><span class="arithmatex">\(-1\)</span></td>
<td>passate della feasibility pump alla radice (<span class="arithmatex">\(-1\)</span> automatico)</td>
</tr>
<tr>
<td><code>SubMIPNodes</code></td>
<td><span class="arithmatex">\(500\)</span></td>
<td>limite sui nodi dei sotto-MIP di RINS e di euristiche simili</td>
</tr>
<tr>
<td><code>NoRelHeurWork</code></td>
<td><span class="arithmatex">\(0\)</span></td>
<td>lavoro dedicato all'euristica senza rilassamento prima della radice</td>
</tr>
<tr>
<td><code>ImproveStartGap</code></td>
<td><span class="arithmatex">\(0\)</span></td>
<td>quando il gap raggiunge questo valore, si passa a migliorare solo l'incumbent</td>
</tr>
</table></div>

- Una soluzione euristica calcolata fuori dal solver — con uno qualunque dei metodi di questo capitolo — gli si può passare come <strong>MIP start</strong> (l'attributo <code>Start</code> delle variabili): il solver parte da essa come incumbent, la usa per la potatura e per RINS, e non restituisce mai niente di peggio.

- I numeri dipendono dall'istanza, dalla versione del solver e dalla macchina; una singola istanza non dimostra nulla. La lezione è qualitativa: quando il bound è forte, il tempo di risoluzione è il tempo necessario a trovare una buona soluzione, e a deciderlo sono le euristiche del solver — o un buon MIP start.

## 10.9 Che cosa danno le euristiche basate sulla PLI { #sez-sec-give }

- Un'euristica fornisce solo un lato del gap, e senza un bound duale non si può dire nulla sulla qualità della sua soluzione. Un'euristica basata sulla PLI lavora con un modello MIP, e il modello porta con sé il suo rilassamento lineare; eseguita dentro un solver MIP, ha a disposizione anche il bound duale del branch-and-bound. L'euristica <strong>sa quanto è lontana dall'ottimo</strong> mentre è in esecuzione: il gap di ottimalità

    $$
    \text{gap di ottimalità} = \frac{\UB - \LB}{|\LB|}
    $$

    si calcola in ogni momento, e quando vale $0$ la soluzione è <em>dimostrata</em> ottima.

<div class="tabella" markdown="0"><table>
<tr>
<th>istanza</th>
<th>soluzione</th>
<th><span class="arithmatex">\(\LB\)</span></th>
<th><span class="arithmatex">\(\UB=\lfloor z(\LP)\rfloor\)</span></th>
<th>gap</th>
<th>certificata da</th>
</tr>
<tr>
<td>auto, arrotondamento per difetto</td>
<td><span class="arithmatex">\((3,2)\)</span></td>
<td><span class="arithmatex">\(13\)</span></td>
<td><span class="arithmatex">\(15\)</span></td>
<td><span class="arithmatex">\(15.4\%\)</span></td>
<td>—</td>
</tr>
<tr>
<td>auto, diving</td>
<td><span class="arithmatex">\((4,1)\)</span></td>
<td><span class="arithmatex">\(14\)</span></td>
<td><span class="arithmatex">\(15\)</span></td>
<td><span class="arithmatex">\(7.1\%\)</span></td>
<td>proximity search da <span class="arithmatex">\((3,2)\)</span></td>
</tr>
<tr>
<td><span class="arithmatex">\(P7\)</span>, arrotondamento per difetto</td>
<td><span class="arithmatex">\((2,0)\)</span></td>
<td><span class="arithmatex">\(6\)</span></td>
<td><span class="arithmatex">\(7\)</span></td>
<td><span class="arithmatex">\(16.7\%\)</span></td>
<td>—</td>
</tr>
<tr>
<td><span class="arithmatex">\(P7\)</span>, local branching</td>
<td><span class="arithmatex">\((2,1)\)</span></td>
<td><span class="arithmatex">\(7\)</span></td>
<td><span class="arithmatex">\(7\)</span></td>
<td><span class="arithmatex">\(0\%\)</span></td>
<td>il bound</td>
</tr>
<tr>
<td><span class="arithmatex">\(P42\)</span>, RINS</td>
<td><span class="arithmatex">\((2,2,0)\)</span></td>
<td><span class="arithmatex">\(10\)</span></td>
<td><span class="arithmatex">\(10\)</span></td>
<td><span class="arithmatex">\(0\%\)</span></td>
<td>il bound</td>
</tr>
<tr>
<td><span class="arithmatex">\(P46\)</span>, relax-and-fix</td>
<td><span class="arithmatex">\((0,2,0)\)</span></td>
<td><span class="arithmatex">\(12\)</span></td>
<td><span class="arithmatex">\(19\)</span></td>
<td><span class="arithmatex">\(58.3\%\)</span></td>
<td>—</td>
</tr>
<tr>
<td><span class="arithmatex">\(P46\)</span>, fix-and-optimize</td>
<td><span class="arithmatex">\((0,1,1)\)</span></td>
<td><span class="arithmatex">\(16\)</span></td>
<td><span class="arithmatex">\(19\)</span></td>
<td><span class="arithmatex">\(18.8\%\)</span></td>
<td>proximity search</td>
</tr>
<tr>
<td><span class="arithmatex">\(P72\)</span>, feasibility pump</td>
<td><span class="arithmatex">\((0,0,1,3,1)\)</span></td>
<td><span class="arithmatex">\(2\)</span></td>
<td><span class="arithmatex">\(8\)</span></td>
<td><span class="arithmatex">\(300\%\)</span></td>
<td>—</td>
</tr>
<tr>
<td><span class="arithmatex">\(P72\)</span>, local branching</td>
<td><span class="arithmatex">\((0,1,1,2,0)\)</span></td>
<td><span class="arithmatex">\(7\)</span></td>
<td><span class="arithmatex">\(8\)</span></td>
<td><span class="arithmatex">\(14.3\%\)</span></td>
<td>proximity search</td>
</tr>
</table></div>

- Su $P7$ e $P42$ l'arrotondamento per difetto del valore LP è già il valore ottimo: la difficoltà è trovare una soluzione che raggiunga il bound, non dimostrarlo. Sulle altre istanze il bound $\lfloor z(\LP)\rfloor$ non è stretto, e il certificato viene dalla proximity search ([Proposizione 10.12](#box-21-prop-ps)) o dal branch-and-bound del solver.

!!! chiave ""

    Un'euristica basata sulla PLI non si limita a trovare soluzioni: dentro un solver MIP lavora con un bound duale, quindi il gap della sua soluzione è sempre noto, e un gap uguale a $0$ certifica l'ottimalità.

- I metodi di questo capitolo, in sintesi:

<div class="tabella" markdown="0"><table>
<tr>
<th>metodo</th>
<th>richiede l'LP</th>
<th>richiede l'incumbent</th>
<th>fissaggio</th>
<th>idea</th>
</tr>
<tr>
<td>arrotondamento</td>
<td>sì</td>
<td>no</td>
<td>—</td>
<td>arrotondare la soluzione LP</td>
</tr>
<tr>
<td>diving</td>
<td>sì</td>
<td>guidato: sì</td>
<td>una alla volta</td>
<td>fissare una variabile, risolvere di nuovo l'LP, ripetere</td>
</tr>
<tr>
<td>feasibility pump</td>
<td>sì</td>
<td>no</td>
<td>—</td>
<td>alternare arrotondamento e proiezione finché si incontrano</td>
</tr>
<tr>
<td>RINS</td>
<td>sì</td>
<td>sì</td>
<td>rigido</td>
<td>fissare dove LP e incumbent concordano, risolvere il sotto-MIP</td>
</tr>
<tr>
<td>local branching</td>
<td>no</td>
<td>sì</td>
<td>morbido</td>
<td>sotto-MIP con <span class="arithmatex">\(\Delta(\vet x,\bar{\vet x})\le k\)</span></td>
</tr>
<tr>
<td>proximity search</td>
<td>no</td>
<td>sì</td>
<td>morbido</td>
<td>minimizzare <span class="arithmatex">\(\Delta(\vet x,\bar{\vet x})\)</span> soggetto al cutoff</td>
</tr>
<tr>
<td>relax-and-fix</td>
<td>sì</td>
<td>no</td>
<td>a blocchi</td>
<td>intere ora, rilassate dopo, poi fissate</td>
</tr>
<tr>
<td>fix-and-optimize</td>
<td>no</td>
<td>sì</td>
<td>a finestre</td>
<td>riottimizzare una finestra, il resto fissato</td>
</tr>
</table></div>

## 10.10 Implementazione in <code>Python</code> { #sez-sec-python }

- I codici usano Python 3 e <code>gurobipy</code>. Alle variabili di un modello si accede tramite la loro posizione $j$ in <code>m.getVars()</code>, e la lista <code>I</code> delle posizioni delle variabili intere è l'insieme $\mathscr{D}$; gli indici partono da $0$.

- Il modulo <code>common.py</code> contiene l'ambiente del solver e le operazioni usate da tutti i metodi: il rilassamento lineare, l'arrotondamento $\rnd{\cdot}$, il completamento di un punto, la distanza $\Delta$ e il vincolo di cutoff.

```python
import math
import gurobipy as gp
from gurobipy import GRB

EPS = 1e-6                                   # integrality and comparison tolerance

ENV = gp.Env(empty=True)                     # one silent, single-thread (deterministic) environment
ENV.setParam("OutputFlag", 0)
ENV.setParam("Threads", 1)
ENV.start()

def int_index(m):
    """positions j (in m.getVars()) of the integer and binary variables: the set I"""
    return [j for j, v in enumerate(m.getVars()) if v.VType != GRB.CONTINUOUS]

def nearest(v):
    """[v] = floor(v + 1/2): rounding to the nearest integer, 1/2 rounded up"""
    return math.floor(v + 0.5 + EPS)

def is_integral(v):
    return abs(v - round(v)) <= EPS

def solve_lp(m):
    """optimal solution of the LP relaxation of m (with its current bounds), None if infeasible"""
    m.update()
    r = m.relax()
    r.optimize()
    if r.Status != GRB.OPTIMAL:
        return None
    return [v.X for v in r.getVars()]

def obj_of(m, x):
    """value of the objective function of m at the point x"""
    e = m.getObjective()
    return e.getConstant() + sum(e.getCoeff(k) * x[e.getVar(k).index] for k in range(e.size()))

def round_point(x_star, I):
    """x_tilde = [x*]: round the integer components, copy the continuous ones"""
    x_tilde = list(x_star)
    for j in I:
        x_tilde[j] = nearest(x_star[j])
    return x_tilde

def evaluate(m, x_int):
    """fix the integer variables to x_int and optimize the continuous ones:
       returns (value, x), or None if the point cannot be completed to a feasible solution"""
    f = m.copy()
    V = f.getVars()
    for j in int_index(f):
        V[j].LB = V[j].UB = x_int[j]
    f.optimize()
    if f.Status != GRB.OPTIMAL:
        return None
    return f.ObjVal, [v.X for v in V]

def solve_mip(m):
    """optimal value and solution of the MIP m, None if infeasible"""
    m.optimize()
    if m.SolCount == 0:
        return None
    return m.ObjVal, [v.X for v in m.getVars()]

def distance(m, x_tilde, I):
    """the linear expression Delta(x, x_tilde) = sum_{j in I} |x_j - x_tilde_j| in the variables of m:
       x_j - l_j if x_tilde_j is at its lower bound, u_j - x_j if at its upper bound,
       otherwise an auxiliary variable d_j >= |x_j - x_tilde_j|"""
    V = m.getVars()
    expr = gp.LinExpr()
    for j in I:
        if x_tilde[j] == V[j].LB:
            expr += V[j] - x_tilde[j]
        elif x_tilde[j] == V[j].UB:
            expr += x_tilde[j] - V[j]
        else:
            d = m.addVar(name=f"d[{j}]")
            m.addConstr(d >= V[j] - x_tilde[j])
            m.addConstr(d >= x_tilde[j] - V[j])
            expr += d
    return expr

def delta(x, x_tilde, I):
    """value of Delta(x, x_tilde)"""
    return sum(abs(x[j] - x_tilde[j]) for j in I)

def add_cutoff(m, z, theta):
    """require a solution better than z by at least theta"""
    obj = m.getObjective()
    if m.ModelSense == GRB.MINIMIZE:
        m.addConstr(obj <= z - theta, name="cutoff")
    else:
        m.addConstr(obj >= z + theta, name="cutoff")

def note(trace, *items):
    """record a step of the algorithm (used to print the examples of the notes)"""
    if trace is not None:
        trace.append(items)
```

- Il modello degli esempi (<code>models.py</code>): <code>max c x</code> soggetto a <code>A x &lt;= b</code>, con variabili intere in $\Z_{\ge0}$ e limiti superiori facoltativi.

```python
from common import *

def build_mip(c, A, b, ub=None, name="MIP"):
    """max c x subject to A x <= b, 0 <= x <= ub, x integer"""
    m = gp.Model(name, env=ENV)
    n = len(c)
    x = m.addVars(n, lb=0, ub=GRB.INFINITY if ub is None else ub, vtype=GRB.INTEGER, name="x")
    m.setObjective(gp.quicksum(c[j] * x[j] for j in range(n)), GRB.MAXIMIZE)
    for i in range(len(b)):
        m.addConstr(gp.quicksum(A[i][j] * x[j] for j in range(n)) <= b[i], name=f"c{i}")
    m.update()
    return m
```

- Arrotondamento e diving:

```python
def rounding(m, trace=None):
    I = int_index(m)
    x_star = solve_lp(m)                       # optimal solution of the LP relaxation
    note(trace, "LP", x_star)
    x_tilde = round_point(x_star, I)           # x_tilde_j = [x*_j] for every integer variable
    note(trace, "rounded", x_tilde)
    return evaluate(m, x_tilde)                # (value, x) if feasible, None otherwise
```

```python
def diving(m, rule="fractional", x_inc=None, trace=None):
    d = m.copy()                               # the bounds of the copy are changed, not those of m
    V = d.getVars()
    I = int_index(d)
    while True:
        x_star = solve_lp(d)                   # LP relaxation with the current bounds
        if x_star is None:
            note(trace, "LP infeasible")
            return None                        # the dive fails
        F = [j for j in I if not is_integral(x_star[j])]
        note(trace, "LP", obj_of(d, x_star), x_star)
        if not F:
            return evaluate(m, round_point(x_star, I))
        if rule == "fractional":               # the least fractional variable, to its nearest integer
            j = min(F, key=lambda k: round(abs(x_star[k] - nearest(x_star[k])), 9))
            v = nearest(x_star[j])
        else:                                  # guided: the variable closest to the incumbent, to its value
            j = min(F, key=lambda k: round(abs(x_star[k] - x_inc[k]), 9))
            v = x_inc[j]
        note(trace, "fix", V[j].VarName, v)
        V[j].LB = V[j].UB = v                  # fix x_j := v
```

- La feasibility pump:

```python
def projection(m, x_tilde, I):
    """x* = argmin { Delta(x, x_tilde) : x in P }, P the LP relaxation of m"""
    p = m.relax()
    p.setObjective(distance(p, x_tilde, I), GRB.MINIMIZE)
    p.optimize()
    return [v.X for v in p.getVars()][:m.NumVars]

def feasibility_pump(m, max_iter=100, seed=1, trace=None):
    I = int_index(m)
    x_star = solve_lp(m)                       # x* = optimal solution of the LP relaxation
    note(trace, "LP", x_star)
    if all(is_integral(x_star[j]) for j in I):
        return evaluate(m, x_star)
    x_tilde = round_point(x_star, I)           # x_tilde = [x*]
    note(trace, "round", x_tilde)
    history = [x_tilde]                        # the points x_tilde visited so far
    for it in range(1, max_iter + 1):
        x_star = projection(m, x_tilde, I)     # the point of P closest to x_tilde
        dist = delta(x_star, x_tilde, I)
        note(trace, "project", x_star, dist)
        if dist <= EPS:                        # x* = x_tilde is integer and feasible
            return evaluate(m, x_tilde)
        x_new = round_point(x_star, I)
        if all(x_new[j] == x_tilde[j] for j in I):          # short cycle: [x*] = x_tilde
            j = max(I, key=lambda k: (round(abs(x_star[k] - x_tilde[k]), 9), -k))
            x_new[j] += 1 if x_star[j] > x_tilde[j] else -1  # flip the most uncertain component
            note(trace, "flip", x_new, j)
        else:
            note(trace, "round", x_new)
        if any(all(x_new[j] == y[j] for j in I) for y in history[-3:]):   # long cycle
            for j in I:                        # restart: random flips (binary variables)
                seed = (16807 * seed) % 2147483647
                rho = seed / 2147483647 - 0.3  # rho_j uniform in [-0.3, 0.7]
                if abs(x_star[j] - x_new[j]) + max(rho, 0) > 0.5:
                    x_new[j] = 1 - x_new[j]
            note(trace, "restart", x_new)
        x_tilde = x_new
        history.append(x_tilde)
    return None                                # no feasible solution found
```

- RINS, local branching e proximity search:

```python
def rins(m, x_tilde, theta=1, trace=None):
    I = int_index(m)
    z_tilde = obj_of(m, x_tilde)               # value of the incumbent
    x_star = solve_lp(m)                       # optimal solution of the LP relaxation
    s = m.copy()
    V = s.getVars()
    fixed = []
    for j in I:
        if abs(x_star[j] - x_tilde[j]) <= EPS:     # LP and incumbent agree on x_j
            V[j].LB = V[j].UB = x_tilde[j]
            fixed.append(j)
    note(trace, "LP", x_star, "fixed", [V[j].VarName for j in fixed])
    add_cutoff(s, z_tilde, theta)              # look only for better solutions
    res = solve_mip(s)                         # the sub-MIP on the free variables
    if res is None:
        note(trace, "sub-MIP infeasible")
        return z_tilde, x_tilde
    note(trace, "sub-MIP", res[0])
    return res
```

```python
def local_branching(m, x_tilde, k, k_max, k_step, theta=1, trace=None):
    I = int_index(m)
    w = m.copy()                               # the master MIP, which receives the reverse constraints
    z_tilde = obj_of(m, x_tilde)
    while k <= k_max:
        s = w.copy()
        s.addConstr(distance(s, x_tilde, I) <= k, name="local_branch")    # Delta(x, x_tilde) <= k
        add_cutoff(s, z_tilde, theta)
        res = solve_mip(s)
        w.addConstr(distance(w, x_tilde, I) >= k + 1)                     # never explore it again
        if res is not None:                    # better solution: re-center the neighbourhood
            note(trace, "improved", k, res[0], res[1])
            z_tilde, x_tilde = res
        else:                                  # no better solution within distance k: enlarge it
            note(trace, "no improvement", k)
            k += k_step
    return z_tilde, x_tilde
```

```python
def proximity_search(m, x_tilde, theta=1, trace=None):
    I = int_index(m)
    z_tilde = obj_of(m, x_tilde)
    while True:
        p = m.copy()
        add_cutoff(p, z_tilde, theta)          # better than the incumbent by at least theta
        p.setObjective(distance(p, x_tilde, I), GRB.MINIMIZE)   # as close as possible to it
        res = solve_mip(p)
        if res is None:                        # no solution better than z_tilde - theta exists
            note(trace, "infeasible")
            return z_tilde, x_tilde
        z_new, x_new = evaluate(m, res[1])     # value of the new solution, continuous part re-optimized
        note(trace, "found", res[0], z_new, x_new)
        z_tilde, x_tilde = z_new, x_new
```

- Relax-and-fix e fix-and-optimize:

```python
def relax_and_fix(m, blocks, trace=None):
    r = m.copy()
    V = {v.VarName: v for v in r.getVars()}
    vtype = {name: V[name].VType for B in blocks for name in B}
    for B in blocks:                           # at first, all the blocks are relaxed
        for name in B:
            V[name].VType = GRB.CONTINUOUS
    for B in blocks:
        for name in B:                         # the current block is integer again
            V[name].VType = vtype[name]
        res = solve_mip(r)
        if res is None:
            note(trace, "infeasible")
            return None
        note(trace, "block", B, res[0], {n: V[n].X for BB in blocks for n in BB})
        for name in B:                         # fix the current block to its value
            V[name].LB = V[name].UB = round(V[name].X)
    return res
```

```python
def fix_and_optimize(m, x_tilde, windows, theta=1, trace=None):
    I = int_index(m)
    names = [v.VarName for v in m.getVars()]
    z_tilde = obj_of(m, x_tilde)
    improved = True
    while improved:                            # one pass over all the windows
        improved = False
        for W in windows:
            s = m.copy()
            V = s.getVars()
            for j in I:
                if names[j] not in W:          # outside the window: fixed to the incumbent
                    V[j].LB = V[j].UB = x_tilde[j]
            add_cutoff(s, z_tilde, theta)
            res = solve_mip(s)
            if res is not None:
                z_tilde, x_tilde = res
                improved = True
            note(trace, "window", W, z_tilde)
    return z_tilde, x_tilde
```

- Tutte le funzioni di questa sezione sono nella cartella <code>MIP\_HEUR\_CODE</code>, insieme a <code>instances.py</code>, che contiene le istanze del capitolo e degli esercizi. Il comando <code>python3 run\_tests.py</code> esegue tutti gli esempi del capitolo e tutte le istanze degli esercizi, e confronta ogni valore con il valore atteso, scritto nel file.

## 10.11 Errori tipici { #sez-sec-mistakes }

!!! attenzione "Attenzione"

    - <strong>Arrotondare un problema con vincoli di uguaglianza.</strong> Arrotondamenti indipendenti delle variabili di un vincolo di uguaglianza non lo soddisfano quasi mai: l'arrotondamento fallisce, e serve un diving.

    - <strong>Credere che un diving possa annullare una decisione.</strong> Un diving è un unico cammino dell'albero, senza backtracking: una fissazione sbagliata non viene mai rivista, e una fissazione che rende l'LP inammissibile chiude il diving.

    - <strong>Usare la feasibility pump per ottenere una buona soluzione.</strong> Dopo il primo LP la pompa ignora la funzione obiettivo: su $P72$ restituisce una soluzione di valore $2$, contro il valore ottimo $7$.

    - <strong>Fidarsi del fissaggio rigido.</strong> RINS fissa le variabili su cui l'LP e l'incumbent concordano, quindi non può trovare una soluzione migliore che ne cambi una ($P7$).

    - <strong>Dimenticare il vincolo di cutoff.</strong> Senza $f(\vet x)\le f(\bar{\vet x})-\theta$ il sotto-MIP restituisce di nuovo la soluzione incumbent; con il vincolo, un sotto-MIP inammissibile dimostra un ottimo locale.

    - <strong>Dichiarare l'ottimalità senza le ipotesi.</strong> La [Proposizione 10.12](#box-21-prop-ps) richiede $\theta=1$ e valori interi della funzione obiettivo su tutte le soluzioni ammissibili.

    - <strong>Ignorare la miopia del relax-and-fix.</strong> I blocchi rilassati sono ottimisti: una decisione che sembra economica può costringere più avanti a una decisione cattiva ($P46$).

    - <strong>Generalizzare da una sola istanza o da una sola esecuzione del solver.</strong> Cammini e tempi dipendono dalla versione del solver e dalle regole di spareggio, quindi le lezioni sono qualitative.

## 10.12 In sintesi { #sez-sec-summary }

!!! chiave "In sintesi"

    - Le euristiche basate sulla PLI usano il rilassamento lineare per decidere dove cercare e un solver MIP per esplorare in modo esatto un intorno ampio.

    - L'arrotondamento e il diving costruiscono una soluzione a partire dall'LP; la feasibility pump cerca solo l'ammissibilità; RINS, il local branching e la proximity search migliorano una soluzione incumbent con un sotto-MIP.

    - Il relax-and-fix costruisce una soluzione blocco per blocco, il fix-and-optimize la migliora finestra per finestra.

    - Dentro un solver MIP è disponibile il bound duale: il gap della soluzione euristica è noto, e un gap uguale a $0$ certifica l'ottimalità.

    <strong>Cruscotto dell'esempio dell'auto.</strong> I lower bound e gli upper bound su $z(\ILP)$ trovati finora in questo modulo:

    <div class="tabella" markdown="0"><table>
    <tr>
    <th>Capitolo</th>
    <th>Lower bound</th>
    <th>Upper bound</th>
    <th>Origine</th>
    </tr>
    <tr>
    <td>Programmazione lineare intera</td>
    <td><span class="arithmatex">\(12\)</span>, <span class="arithmatex">\(14\)</span></td>
    <td>–</td>
    <td>soluzioni euristiche <span class="arithmatex">\((4, 0)\)</span> e <span class="arithmatex">\((4, 1)\)</span></td>
    </tr>
    <tr>
    <td>Rilassamento lineare e bound duali</td>
    <td>–</td>
    <td><span class="arithmatex">\(15\)</span></td>
    <td><span class="arithmatex">\(\lfloor z(\LP) \rfloor\)</span>, con <span class="arithmatex">\(z(\LP) = \tfrac{31}{2}\)</span></td>
    </tr>
    <tr>
    <td>Algoritmo dei piani di taglio</td>
    <td><span class="arithmatex">\(14\)</span></td>
    <td><span class="arithmatex">\(14\)</span></td>
    <td><span class="arithmatex">\(5\)</span> tagli frazionari di Gomory</td>
    </tr>
    <tr>
    <td>Branch-and-bound basato su LP</td>
    <td><span class="arithmatex">\(14\)</span></td>
    <td><span class="arithmatex">\(14\)</span></td>
    <td><span class="arithmatex">\(6\)</span> problemi LP risolti</td>
    </tr>
    <tr>
    <td>Questo capitolo, arrotondamento per difetto</td>
    <td><span class="arithmatex">\(13\)</span></td>
    <td><span class="arithmatex">\(15\)</span></td>
    <td><span class="arithmatex">\((3,2)\)</span></td>
    </tr>
    <tr>
    <td>Questo capitolo, diving</td>
    <td><span class="arithmatex">\(14\)</span></td>
    <td><span class="arithmatex">\(15\)</span></td>
    <td><span class="arithmatex">\((4,1)\)</span>, certificata ottima dalla proximity search</td>
    </tr>
    </table></div>

## Riferimenti bibliografici

<a id="ref-AB07"></a>**[1]** T. Achterberg, T. Berthold, Improving the feasibility pump, <em>Discrete Optimization</em> 4 (2007) 77–86.

<a id="ref-BFL07"></a>**[2]** L. Bertacco, M. Fischetti, A. Lodi, A feasibility pump heuristic for general mixed-integer problems, <em>Discrete Optimization</em> 4 (2007) 63–76.

<a id="ref-DRL05"></a>**[3]** E. Danna, E. Rothberg, C. Le Pape, Exploring relaxation induced neighborhoods to improve MIP solutions, <em>Mathematical Programming</em> 102 (2005) 71–90.

<a id="ref-FGL05"></a>**[4]** M. Fischetti, F. Glover, A. Lodi, The feasibility pump, <em>Mathematical Programming</em> 104 (2005) 91–104.

<a id="ref-FL03"></a>**[5]** M. Fischetti, A. Lodi, Local branching, <em>Mathematical Programming</em> 98 (2003) 23–47.

<a id="ref-FM14"></a>**[6]** M. Fischetti, M. Monaci, Proximity search for 0-1 mixed-integer convex programming, <em>Journal of Heuristics</em> 20 (2014) 709–731.

---

**Esercizi su questo capitolo:** [:material-pencil: Euristiche MIP](../esercizi/mip-heuristics.md)
