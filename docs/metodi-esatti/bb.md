---
title: "Il branch-and-bound basato sulla programmazione lineare"
---

# Il branch-and-bound basato sulla programmazione lineare

<div class="info-capitolo" markdown>

**Parte 3 · Metodi esatti · Capitolo 7** · [:material-file-pdf-box: Dispensa, volume 2 (PDF)](../pdf/dispensa-2-metodi-esatti.pdf) · [:material-presentation: Slide 1/2](../pdf/slide-07-bb-1.pdf) · [:material-presentation: Slide 2/2](../pdf/slide-07-bb-2.pdf) · [:material-pencil: Esercizi: Branch-and-bound](../esercizi/bb.md) · [:material-gesture-tap: App: Branch-and-bound passo per passo](../laboratorio/branch-and-bound-passi.md)

</div>

!!! nota "Prerequisiti"

    - Dal modulo <em>Programmazione lineare</em>, [Capitolo 10 «Algoritmo del simplesso duale»](https://fabiofurini.github.io/programmazione-lineare/dualita/10-simplesso-duale/): dizionari del simplesso, basi duali ammissibili e operazioni di pivot duali. Un breve riepilogo è dato in questo capitolo.

    - Da questo modulo, il capitolo «Programmazione lineare intera»: problemi PLI, soluzioni ammissibili e ottime, e l'esempio dell'auto.

    - Da questo modulo, il capitolo «Bound primali e duali»: il rilassamento lineare, i lower bound dalle soluzioni ammissibili, gli upper bound dal rilassamento lineare e il gap di ottimalità.

!!! chiave "Obiettivi"

    Alla fine di questo capitolo sarai in grado di:

    - spiegare come le operazioni di branching dividono un problema PLI in problemi LP più piccoli, e perché nessuna soluzione ammissibile viene persa;

    - applicare i tre criteri di potatura, e decidere quando il bound di un nodo si può arrotondare per difetto;

    - eseguire a mano un algoritmo branch-and-bound basato sul rilassamento lineare, riottimizzando ogni nodo con l'algoritmo del simplesso duale;

    - calcolare il lower bound, l'upper bound e il gap di ottimalità a ogni iterazione;

    - confrontare diverse strategie di selezione della variabile di branching e del nodo di branching sulla stessa istanza.

- Questo capitolo definisce l'algoritmo branch-and-bound basato sul rilassamento lineare per i problemi PLI in forma canonica di massimo con dati interi, con le sue operazioni di branching e di bounding.

- L'istanza guida è l'esempio dell'auto, $\max \{ 3\,x_1 + 2\,x_2 : 10\,x_1 + 4\,x_2 \le 45,~ 4\,x_1 + 14\,x_2 \le 49,~ x_1, x_2 \in \Z_{\ge 0} \}$, il cui rilassamento lineare ha la soluzione ottima frazionaria $(\frac{7}{2},\frac{5}{2})$, con $z(\LP) = \frac{31}{2}$.

## 7.1 L'idea in parole e in una figura

- L'<strong>algoritmo branch-and-bound basato sul rilassamento lineare</strong> (in breve, <strong>algoritmo B&amp;B</strong>) è un metodo esatto per i problemi PLI. Si dice <strong>basato sul rilassamento lineare</strong> perché risolve rilassamenti lineari per guidare la ricerca di una soluzione ottima.

- Nella soluzione ottima del rilassamento lineare dell'esempio dell'auto la variabile $x_1$ assume un valore frazionario compreso tra $3$ e $4$. Ogni soluzione ammissibile del problema PLI soddisfa $x_1 \le 3$ oppure $x_1 \ge 4$, quindi possiamo dividere il problema in due problemi LP più piccoli, uno per ciascun lato, ed eliminare la striscia intermedia, che non contiene punti interi:

    $$
    \rightsquigarrow~\textbf{operazioni di branching}.
    $$

- Ogni nuovo problema LP viene risolto. Il suo valore ottimo limita dall'alto il valore di ogni soluzione nella sua regione, quindi ci dice se la regione va esplorata ancora o si può scartare:

    $$
    \rightsquigarrow~\textbf{operazioni di bounding}.
    $$

![Figura 1](../img/07-bb/fig01.svg){ .fig .ovale loading=lazy  }

<em>Branching su $x_1$ alla radice dell'esempio dell'auto: le due regioni rosse sono le regioni ammissibili dei figli ($x_1 \le 3$ e $x_1 \ge 4$); la striscia grigia $3 < x_1 < 4$ viene tagliata via, e non contiene punti interi.</em>

!!! chiave ""

    Un algoritmo branch-and-bound esplora implicitamente tutte le soluzioni ammissibili: divide la regione ammissibile in regioni più piccole (branching) e scarta ogni regione che non può contenere una soluzione migliore della migliore trovata finora (bounding).

## 7.2 Definizioni e notazione

### 7.2.1 Problemi PLI in forma canonica di massimo

- Dati $n$ valori $c_j \in \Z$, $m \cdot n$ valori $a_{ij} \in \Z$ e $m$ valori $b_i \in \Z$, un problema di <strong>programmazione lineare intera</strong> (PLI) in forma canonica di massimo, con $n$ <u>variabili intere</u> e dati interi, si scrive:

!!! chiave ""

    <a id="eq-bb-MIP"></a>

    \begin{align*}
    \max ~~ \sum_{j=1}^{n} c_j \, x_j & & \label{bb:MIP-obj} \tag{7.1a}\\[1ex]
    \text{soggetto a} \quad \sum_{j=1}^{n} a_{ij} \, x_j &\le b_i, & \forall i \in \{1, 2, \dots, m\},
    \label{bb:MIP-cons} \tag{7.1b}\\[1ex]
    x_j &\in \Z_{\ge 0}, & \forall j \in \{1, 2, \dots, n\}. \label{bb:MIP-int} \tag{7.1c}
    \end{align*}

- L'esempio dell'auto è un problema PLI con $n = 2$ e $m = 2$.

- Indichiamo con $z(\ILP)$ il valore ottimo del problema [(7.1)](#eq-bb-MIP), e con $\tilde{\vet x}(\ILP)$ una soluzione ottima.

- Il <strong>rilassamento lineare</strong> del problema [(7.1)](#eq-bb-MIP), detto problema $\LP_1$, si ottiene sostituendo i vincoli di integralità $\eqref{bb:MIP-int}$ con i vincoli di non negatività $x_j \ge 0$, per ogni $j \in \{1, 2, \dots, n\}$.

### 7.2.2 Albero branch-and-bound, soluzione incumbent e lower bound

!!! chiave ""

    Le <strong>operazioni di branching</strong> generano un <strong>albero branch-and-bound</strong> che contiene problemi LP. Ogni problema LP si ottiene dal rilassamento lineare aggiungendo opportuni <strong>vincoli di branching</strong>.

- La struttura ricorsiva di un algoritmo B&amp;B induce l'albero. Ogni <strong>nodo di branching</strong> dell'albero corrisponde a un problema LP; la radice è il problema $\LP_1$.

<a id="box-1-def-bb-node"></a>

!!! definizione "Definizione 7.1: indice del nodo di branching"

    Per ogni nodo di branching $k$, il problema LP associato si indica con $\LP_k$. Se $\LP_k$ ha una soluzione ottima, questa si indica con $\tilde{\vet x}(\LP_k)$ e il suo valore ottimo con $z(\LP_k)$. L'intero $k$ si chiama <strong>indice del nodo di branching</strong>: identifica il nodo in modo univoco, e i nodi sono numerati nell'ordine in cui vengono risolti i loro problemi LP.

- Un algoritmo B&amp;B conserva la migliore soluzione ammissibile del problema [(7.1)](#eq-bb-MIP) trovata durante la ricerca. Questa soluzione si chiama <strong>soluzione incumbent</strong> e si indica con $\bar{\vet x}$; il suo valore è un <strong>lower bound</strong> $\LB$ su $z(\ILP)$. Prima di trovare una soluzione ammissibile poniamo $\LB = -\infty$.

- Il lower bound e la soluzione incumbent vengono aggiornati ogni volta che si trova una soluzione ammissibile migliore. Alla terminazione abbiamo un <strong>certificato algoritmico</strong> che

    \begin{equation*}
    z(\ILP) = \LB \qquad \text{e} \qquad \tilde{\vet x}(\ILP) = \bar{\vet x}. \tag{7.2}
    \end{equation*}

### 7.2.3 Operazioni di branching

- L'operazione di branching più comune è il <strong>branching binario</strong>: agisce su una sola <strong>variabile di branching</strong> e produce due nodi di branching figli, uno con un <strong>upper bound</strong> aggiuntivo e uno con un <strong>lower bound</strong> aggiuntivo sulla variabile di branching.

- Più precisamente, sia $\tilde{\vet x}(\LP_k)$ una soluzione ottima del problema $\LP_k$, e sia $x_j$, con $j \in \{1, 2, \dots, p\}$, una <u>variabile intera</u> che assume un valore frazionario $\tilde x_j$ (le variabili intere sono $x_1, \dots, x_p$; in un problema PLI $p = n$). Il branching binario su $x_j$ genera due problemi LP figli:

    1. il problema $\LP_k$ con il <strong>vincolo di branching verso il basso</strong> aggiuntivo

        \begin{equation*}
        \label{bb:down}
        x_j \le \left\lfloor \tilde x_j \right\rfloor ; \tag{7.3}
        \end{equation*}

    2. il problema $\LP_k$ con il <strong>vincolo di branching verso l'alto</strong> aggiuntivo

        \begin{equation*}
        \label{bb:up}
        x_j \ge \left\lfloor \tilde x_j \right\rfloor + 1 . \tag{7.4}
        \end{equation*}

- I due nodi figli si chiamano <strong>nodo di branching verso il basso</strong> e <strong>nodo di branching verso l'alto</strong>. In entrambi $\tilde{\vet x}(\LP_k)$ non è più ammissibile.

!!! chiave ""

    Ogni soluzione ammissibile del problema PLI contenuta nella regione di $\LP_k$ soddisfa $\eqref{bb:down}$ oppure $\eqref{bb:up}$, quindi è contenuta nella regione di uno dei due figli. <strong>Questo garantisce la correttezza dell'algoritmo B&amp;B</strong>.

### 7.2.4 Operazioni di bounding e bound di un nodo

- Il valore $z(\LP_k)$ è un upper bound sul valore di ogni soluzione ammissibile del problema PLI nella regione di $\LP_k$. Quando tutti i valori sono interi, questo bound si può arrotondare per difetto.

<a id="box-2-obs-bb-floor"></a>

!!! teorema "Osservazione 7.2: arrotondamento del bound di un nodo"

    Poiché tutte le variabili e tutti i costi sono interi, ogni soluzione ammissibile nella regione di $\LP_k$ ha valore al più $\lfloor z(\LP_k) \rfloor$.

??? dimostrazione "Dimostrazione"

    Poiché $c_j \in \Z$ per ogni $j$, il valore $\sum_{j=1}^{n} c_j \, \bar x_j$ di una soluzione ammissibile $\bar{\vet x}$ è una somma di prodotti di interi, quindi un intero. Poiché è al più $z(\LP_k)$, è al più il massimo intero non superiore a $z(\LP_k)$, cioè $\lfloor z(\LP_k) \rfloor$. <span class="qed">□</span>

- Di conseguenza, chiamiamo <strong>bound del nodo</strong> $k$ il valore

    \begin{equation*}
    \label{bb:ubk}
    \mathrm{UB}(\LP_k) =
    \begin{cases}
    \left\lfloor z(\LP_k) \right\rfloor & \text{se } p = n \text{ e } c_j \in \Z \text{ per ogni }
    j \in \{1, 2, \dots, n\},\\[1ex]
    z(\LP_k) & \text{altrimenti.}
    \end{cases} \tag{7.5}
    \end{equation*}

- Dato un nodo di branching $k$, su di esso non si esegue alcuna operazione di branching se vale uno dei seguenti <strong>criteri di potatura</strong>. In questi casi si dice che il nodo è <strong>potato</strong>.

    1. <strong>Potatura per inammissibilità</strong>: il problema $\LP_k$ è inammissibile, quindi la sua regione non contiene soluzioni ammissibili del problema PLI.

    2. <strong>Potatura per integralità</strong>: le variabili intere hanno valori interi in $\tilde{\vet x}(\LP_k)$, quindi $\tilde{\vet x}(\LP_k)$ è ammissibile per il problema PLI, ed è ottima nella regione di $\LP_k$. Se $z(\LP_k) > \LB$, il lower bound e la soluzione incumbent vengono aggiornati.

    3. <strong>Potatura per bound</strong>: il bound del nodo non supera il lower bound, $\mathrm{UB}(\LP_k) \le \LB$, quindi la regione di $\LP_k$ non contiene soluzioni migliori di quella incumbent.

!!! chiave ""

    I criteri si verificano in quest'ordine: inammissibilità, integralità, bound. Quando valgono sia l'integralità sia il bound, il nodo è potato per integralità.

### 7.2.5 La lista dei problemi LP

- Un nodo di branching che non viene potato è inserito in una <strong>lista</strong> $L$ di problemi LP in attesa di un'operazione di branching.

- L'ordine in cui i problemi LP vengono estratti dalla lista determina la <strong>strategia di selezione del nodo di branching</strong>; la scelta della variabile di branching determina la <strong>strategia di selezione della variabile di branching</strong>. Entrambe sono discusse dopo l'algoritmo.

### 7.2.6 Upper bound e gap di ottimalità

- Se la lista $L$ non è vuota, ogni soluzione ammissibile migliore di quella incumbent si trova nella regione di qualche nodo della lista. Di conseguenza, l'algoritmo B&amp;B ha l' <strong>upper bound</strong>

    \begin{equation*}
    \label{bb:UB}
    z(\ILP) ~~\le~~ \UB = \max_{k \in L} \left\{ \mathrm{UB}(\LP_k) \right\}. \tag{7.6}
    \end{equation*}

    Quando la lista è vuota, la soluzione incumbent è ottima e $\UB = \LB$.

- L'upper bound si calcola dopo la soluzione della radice e si aggiorna alla fine di ogni iterazione. All'algoritmo non serve, ma misura i progressi attraverso il <strong>gap di ottimalità</strong>:

    \begin{equation*}
    \label{bb:gap}
    \textrm{gap di ottimalità} = \frac{\UB - \LB}{|\LB|}, \qquad \text{per } \LB \ne 0 . \tag{7.7}
    \end{equation*}

### 7.2.7 Inizializzazione euristica

!!! chiave ""

    Prima dell'algoritmo B&amp;B si può eseguire un <strong>algoritmo euristico</strong> per trovare una buona soluzione ammissibile. Il lower bound $\LB$ e la soluzione incumbent $\bar{\vet x}$ vengono allora inizializzati con questa soluzione.

- Un buon lower bound iniziale permette all'algoritmo di potare prima i nodi per bound, e può ridurre di molto la dimensione dell'albero branch-and-bound.

- Se il lower bound iniziale soddisfa già $\mathrm{UB}(\LP_1) \le \LB$, la radice è potata per bound: la soluzione euristica è ottima e non serve alcun branching.

## 7.3 L'algoritmo

### 7.3.1 Pseudocodice

!!! algoritmo "Algoritmo"

    - <strong>Input:</strong> Un problema PLI in forma canonica di massimo con dati interi.

    - <strong>Output:</strong> Una soluzione ottima del problema PLI (se esiste) oppure un certificato di inammissibilità/illimitatezza.

    - **Passo 0:** <strong>Inizializzazione</strong>

        1. Rilassare i vincoli di integralità e risolvere il problema $\LP_1$.

            - **1.** se ${\tilde{\vet x}}(\LP_1)$ è <strong>intera</strong>, allora è una soluzione ottima e $z(\LP_1)$ è il valore ottimo del problema PLI.  <code>STOP</code>.

            - **2.** se il problema $\LP_1$ è <strong>inammissibile</strong>, allora il problema PLI è inammissibile.  <code>STOP</code>.

            - **3.** se il problema $\LP_1$ è <strong>illimitato</strong>, allora il problema PLI è inammissibile oppure illimitato.  <code>STOP</code>.

        2. Inserire il problema $\LP_1$ in una <strong>lista dei problemi LP per il branching</strong> (indicata con $L$).  Porre il <strong>lower bound</strong> $\LB \leftarrow -\infty$ (oppure il valore di una soluzione euristica), e porre un contatore dei nodi di branching $c \leftarrow 1$.

    - **Passo 1:** <strong>Test di ottimalità</strong>

        1. se la lista $L$ è vuota e $\LB \neq -\infty$, allora $\LB$ è il valore ottimo e la <strong>soluzione incumbent</strong> ${\bar{\vet x}}(\ILP)$ è una soluzione ottima del problema PLI.  <code>STOP</code>.

        2. se la lista $L$ è vuota e $\LB = -\infty$, allora il problema PLI è inammissibile.  <code>STOP</code>.

    - **Passo 2:** <strong>Strategia di selezione del nodo di branching</strong>

        Selezionare e rimuovere un problema $\LP_k$ dalla lista $L$.

    - **Passo 3:** <strong>Strategia di selezione della variabile di branching</strong>

        Selezionare una variabile $x_j$ con valore frazionario $\tilde{x}_j$ in ${\tilde{\vet x}}(\LP_k)$ e generare due nuovi problemi LP:

        1. il problema $\LP_{c+1}$ $\rightsquigarrow$ il problema $\LP_k$ con il <strong>vincolo di branching verso il basso</strong> aggiuntivo: $x_j \le \lfloor \tilde{x}_j \rfloor$

        2. il problema $\LP_{c+2}$ $\rightsquigarrow$ il problema $\LP_k$ con il <strong>vincolo di branching verso l'alto</strong> aggiuntivo: $x_j \ge \lfloor \tilde{x}_j \rfloor + 1$

        Eseguire la <strong>Sottoprocedura di soluzione del nodo di branching</strong> per il problema $\LP_{c+1}$ e per il problema $\LP_{c+2}$; la seconda si salta se, dopo la prima, $\left\lfloor z(\LP_k) \right\rfloor \le \LB$. Incrementare il contatore dei nodi di branching $c \leftarrow c + 2$ e andare al Passo 1.

- Questo è lo pseudocodice della <strong>Sottoprocedura di soluzione del nodo di branching</strong>.

!!! algoritmo "Algoritmo"

    - <strong>Input:</strong> Un problema $\LP_k$ associato a un nodo di branching.

    - **Passo 1:** <strong>Operazioni di bounding</strong>

        Risolvere il problema $\LP_k$.

        1. se il problema $\LP_k$ è inammissibile, allora <code>STOP</code>.

        2. se ${\tilde{\vet x}}(\LP_k)$ è intera, allora, se $z(\LP_k) > \LB$, aggiornare il <strong>lower bound</strong> e la <strong>soluzione incumbent</strong>:

            $$
            \LB \leftarrow z(\LP_k)
            \quad \text{e} \quad
            {\bar{\vet x}}(\ILP) \leftarrow {\tilde{\vet x}}(\LP_k)
            $$

            Rimuovere dalla lista $L$ tutti i problemi LP con $\left\lfloor z(\LP) \right\rfloor \le \LB$ e <code>STOP</code> (anche quando $z(\LP_k) \le \LB$).

        3. se $\left\lfloor z(\LP_k) \right\rfloor \le \LB$, allora <code>STOP</code>.

    - **Passo 2:** <strong>Inserimento nella lista</strong>

        Inserire il problema $\LP_k$ nella lista $L$ e  <code>STOP</code>.

- Il problema LP con il vincolo di branching verso il basso si chiama <strong><em>nodo di branching verso il basso</em></strong>. Il problema LP con il vincolo di branching verso l'alto si chiama <strong><em>nodo di branching verso l'alto</em></strong>. L'ordine in cui vengono risolti determina l'ordine in cui i problemi LP entrano nella lista $L$.

- Lo pseudocodice non dice come si risolvono i problemi LP: si può usare qualunque metodo per i problemi LP.

- Se si usa l'<strong>algoritmo del simplesso duale</strong>, ogni figlio si risolve a partire dal dizionario ottimo del padre: dopo l'aggiunta del vincolo di branching questo dizionario è ancora duale ammissibile, quindi in generale bastano poche operazioni di pivot (Sezione [7.4](#sez-bb-sec-dualsimplex)).

### 7.3.2 La regola di salto e la numerazione dei nodi

- Il bound di un figlio non supera mai il bound del padre, perché il figlio ha un vincolo in più. Di conseguenza, se dopo la soluzione del primo figlio abbiamo $\mathrm{UB}(\LP_k) \le \LB$, il secondo figlio non può contenere una soluzione migliore, e <strong>non viene risolto</strong>. Questa è la <strong>regola di salto</strong>.

- Un figlio saltato non riceve un indice di nodo: i nodi sono numerati nell'ordine in cui vengono risolti i loro problemi LP, quindi gli indici dei nodi risolti sono sempre $1, 2, \dots, c$.

- L'ordine in cui vengono risolti i due figli determina anche l'ordine in cui entrano nella lista $L$. In queste note si risolve per primo il nodo di branching verso il basso, salvo indicazione contraria.

### 7.3.3 Numero di nodi di branching

- Un albero branch-and-bound binario <strong>completo</strong> con $n \ge 1$ livelli ha $2^{n-1}$ nodi di branching foglia, e lungo ogni cammino dalla radice a una foglia vengono imposti esattamente $n-1$ vincoli di branching.

<a id="box-3-obs-bb-nodes"></a>

!!! teorema "Osservazione 7.3"

    Il numero totale di nodi di branching in un albero branch-and-bound binario completo con $n \ge 1$ livelli è:

    \begin{equation*}
    \label{bb:NODES}
    \sum_{j=0}^{n-1} 2^{j} = 2^{n}-1 . \tag{7.8}
    \end{equation*}

??? dimostrazione "Dimostrazione"

    Per induzione su $n$.

    - <strong>Caso base.</strong> Per $n = 1$ l'enunciato diventa $\sum_{j=0}^{0} 2^{j} = 2^1 - 1$, cioè $1 = 1$, che è vero.

    - <strong>Passo induttivo.</strong> Supponiamo che l'enunciato valga per $n$; lo dimostriamo per $n+1$. Abbiamo:

        \begin{align*}
        \sum_{j=0}^{n} 2^j &= \sum_{j=0}^{n-1} 2^{j} + 2^n = 2^n - 1 + 2^n \quad
        \text{(per l'ipotesi induttiva)} \\[1ex]
        &= 2^{n+1} - 1,
        \end{align*}

        che è l'enunciato per $n+1$.

    <p class="qed-riga"><span class="qed">□</span></p>

- Il numero totale di nodi è la somma dei primi $n$ termini di una progressione geometrica di ragione $r = 2$:

    \begin{equation*}
    \label{bb:GEOM}
    \sum_{j=0}^{n-1} r^{j} =
    \begin{cases}
    \dfrac{r^{n}-1}{r-1} & \text{se } r \neq 1,\\[2ex]
    n & \text{altrimenti.}
    \end{cases} \tag{7.9}
    \end{equation*}

- Con $p$ variabili binarie l'albero completo ha $p + 1$ livelli e $2^{p+1} - 1$ nodi: sono i criteri di potatura a rendere l'algoritmo utilizzabile in pratica.

## 7.4 Breve riepilogo dell'algoritmo del simplesso duale { #sez-bb-sec-dualsimplex }

- Un figlio differisce dal padre per <u>un</u> vincolo. Risolverlo da zero sprecherebbe il lavoro fatto per il padre: l'algoritmo B&amp;B parte invece dal <strong>dizionario ottimo del padre</strong> e lo riottimizza con l'<strong>algoritmo del simplesso duale</strong>.

- Sia $x_j$ la variabile di branching. È in base nel dizionario ottimo di $\LP_k$, perché il suo valore è frazionario, e la sua riga è

    $$
    x_j = \bar b_j - \sum_{q \in \pazocal{N}} \bar a_{jq} \, x_q, \qquad \text{con } \bar b_j =
    \tilde x_j .
    $$

- Alla profondità $d$ dell'albero, il vincolo di branching riceve la variabile di scarto (o di surplus) $x_s$, con $s = n + m + d$.

<a id="box-4-obs-bb-row"></a>

!!! teorema "Osservazione 7.4: la riga del vincolo di branching"

    Sostituendo la riga di $x_j$, i vincoli di branching diventano nuove righe in base del dizionario:

    \begin{align*}
    x_j \le \lfloor \tilde x_j \rfloor
    &\quad\Longrightarrow\quad
    x_s = \lfloor \tilde x_j \rfloor - x_j
    = \big( \lfloor \tilde x_j \rfloor - \tilde x_j \big) + \sum_{q \in \pazocal{N}} \bar a_{jq} \,
    x_q ,\\[1ex]
    x_j \ge \lfloor \tilde x_j \rfloor + 1
    &\quad\Longrightarrow\quad
    x_s = x_j - \lfloor \tilde x_j \rfloor - 1
    = \big( \tilde x_j - \lfloor \tilde x_j \rfloor - 1 \big) - \sum_{q \in \pazocal{N}} \bar a_{jq} \,
    x_q .
    \end{align*}

    In entrambi i casi il valore di $x_s$ è negativo, mentre i costi ridotti non cambiano: il nuovo dizionario è <strong>duale ammissibile</strong> ma non primale ammissibile.

- Questo è esattamente il punto di partenza dell'algoritmo del simplesso duale. In queste note usiamo le stesse regole di pivot del modulo <em>Programmazione lineare</em>.

!!! nota ""

    <strong>Operazione di pivot duale</strong> su un dizionario $x_i = \bar b_i - \sum_{j \in \pazocal{N}} \bar a_{ij} \, x_j$, per $i \in \pazocal{B}$, e $z = \bar z + \sum_{j \in \pazocal{N}} \bar c_j \, x_j$, con $\bar c_j \le 0$ per ogni $j \in \pazocal{N}$:

    - **a.** la <strong>riga pivot</strong> è la variabile in base con valore negativo di indice minimo:

        $$
        r = \min \left\{~ i \in \pazocal{B} : \bar b_i < 0 ~\right\};
        $$

    - **b.** se $\bar a_{rj} \ge 0$ per ogni $j \in \pazocal{N}$, il problema LP è <strong>inammissibile</strong>;

    - **c.** altrimenti la <strong>colonna pivot</strong> $x_p$ realizza il rapporto minimo (pareggi: indice minimo)

        $$
        \frac{\bar c_p}{\bar a_{rp}} = s_m = \min \left\{~ \frac{\bar c_j}{\bar a_{rj}} : j \in
        \pazocal{N},~ \bar a_{rj} < 0 ~\right\};
        $$

    - **d.** dopo l'operazione di pivot il valore obiettivo è $\bar z + s_m \, \bar b_r \le \bar z$.

    L'algoritmo si ferma quando tutte le variabili in base sono non negative: il dizionario è allora ottimo.

- In un nodo figlio bastano spesso una o due operazioni di pivot duali, mentre l'algoritmo del simplesso a partire dalla base delle variabili di scarto richiederebbe diverse operazioni di pivot per ogni nodo.

## 7.5 Strategie di selezione della variabile di branching

- La scelta della variabile di branching ha un grande impatto sulla dimensione dell'albero branch-and-bound.

!!! chiave ""

    Idealmente, la variabile di branching dà la massima diminuzione dei bound dei figli e porta rapidamente a soluzioni ammissibili. Tuttavia conta anche il tempo speso per sceglierla: una regola costosa può rallentare l'intero algoritmo.

- In tutte le strategie che seguono, i pareggi si risolvono con l'<strong>indice minimo</strong>.

### 7.5.1 Lessicografica

!!! chiave ""

    La strategia <strong>lessicografica</strong> seleziona, tra le variabili intere con valore frazionario, quella di indice minimo (o massimo).

- Non richiede calcoli, ma non tiene conto né della diminuzione dei bound né della ricerca di soluzioni ammissibili. È la regola usata negli esercizi, perché rende l'esecuzione facile da riprodurre.

### 7.5.2 Minima e massima inammissibilità

!!! chiave ""

    La strategia di <strong>minima</strong> (rispettivamente, <strong>massima</strong>) <strong>inammissibilità</strong> seleziona la variabile il cui valore frazionario è il più vicino (rispettivamente, il più lontano) a un valore intero.

- Dato un nodo di branching $k$, per ogni variabile intera $x_j$ con valore frazionario $\tilde x_j$ in $\tilde{\vet x}(\LP_k)$, il <strong>valore frazionario</strong> della variabile è

    \begin{equation*}
    f_j = \min \left\{ \tilde x_j - \lfloor \tilde x_j \rfloor,~ \lceil \tilde x_j \rceil - \tilde x_j
    \right\} . \tag{7.10}
    \end{equation*}

- La minima inammissibilità cerca di ridurre il numero di variabili frazionarie nei figli, per raggiungere più in fretta soluzioni ammissibili.

- La massima inammissibilità elimina per prime le variabili che contribuiscono di più all'inammissibilità di $\tilde{\vet x}(\LP_k)$. Nessuna delle due regole guarda i bound dei figli.

<a id="box-5-ex-bb-frac"></a>

!!! esempio "Esempio 7.1: valori frazionari"

    Al nodo radice dell'esempio dell'auto abbiamo $\tilde x_1 = \dfrac{7}{2},~~\tilde x_2 = \dfrac{5}{2}$, e i valori frazionari sono:

    $$
    f_1 = \min\left\{ \dfrac{7}{2} - 3,~ 4 - \dfrac{7}{2} \right\} = \dfrac{1}{2} \qquad f_2 = \min\left\{ \dfrac{5}{2} - 2,~ 3 - \dfrac{5}{2} \right\} = \dfrac{1}{2}
    $$

    I due valori sono uguali: sia la minima sia la massima inammissibilità hanno un pareggio, che si risolve con l'indice minimo, quindi entrambe le strategie selezionano $x_1$.

### 7.5.3 Strong branching

!!! chiave ""

    La strategia di <strong>strong branching</strong> seleziona la variabile che dà la massima diminuzione dei bound dei figli.

- Dato un nodo di branching $k$, per ogni variabile intera $x_j$ con valore frazionario risolviamo i due figli e calcoliamo le diminuzioni del valore ottimo

    $$
    \delta_k^d(x_j) = z(\LP_k) - z(\text{figlio verso il basso}),
    \qquad
    \delta_k^u(x_j) = z(\LP_k) - z(\textrm{figlio verso l'alto}),
    $$

    dove la diminuzione vale $+\infty$ per un figlio inammissibile.

- La variabile di branching è $x_s$, con

    \begin{equation*}
    s = \argmax \left\{ \min \left\{ \delta_k^d(x_j), \delta_k^u(x_j) \right\} :
    j \in \{1, 2, \dots, p\},~ \tilde x_j \text{ frazionario} \right\} . \tag{7.11}
    \end{equation*}

    Entrambi i figli della variabile selezionata hanno una grande diminuzione, quindi entrambi hanno più probabilità di essere potati per bound.

- Lo strong branching è costoso, perché risolve due problemi LP per ogni variabile candidata. Per questo di solito si applica solo ai livelli più alti dell'albero.

<a id="box-6-ex-bb-strong"></a>

!!! esempio "Esempio 7.2: strong branching"

    Al nodo radice dell'esempio dell'auto abbiamo $\tilde x_1 = \dfrac{7}{2},~~\tilde x_2 = \dfrac{5}{2}$ e $z(\LP_1) = \dfrac{31}{2}$. Per ogni variabile frazionaria risolviamo i due problemi LP figli (con l'algoritmo del simplesso duale, a partire dal dizionario ottimo di $\LP_1$):

    <div class="tabella" markdown="0"><table>
    <tr>
    <th>Variabile</th>
    <th>Verso il basso</th>
    <th><span class="arithmatex">\(z\)</span></th>
    <th><span class="arithmatex">\(\delta^d_1(x_j)\)</span></th>
    <th>Verso l'alto</th>
    <th><span class="arithmatex">\(z\)</span></th>
    <th><span class="arithmatex">\(\delta^u_1(x_j)\)</span></th>
    <th><span class="arithmatex">\(\min\{\delta^d_1, \delta^u_1\}\)</span></th>
    </tr>
    <tr>
    <td><span class="arithmatex">\(x_1\)</span></td>
    <td><span class="arithmatex">\(x_1 \le 3\)</span></td>
    <td><span class="arithmatex">\(\dfrac{100}{7}\)</span></td>
    <td><span class="arithmatex">\(\dfrac{17}{14}\)</span></td>
    <td><span class="arithmatex">\(x_1 \ge 4\)</span></td>
    <td><span class="arithmatex">\(\dfrac{29}{2}\)</span></td>
    <td><span class="arithmatex">\(1\)</span></td>
    <td><span class="arithmatex">\(1\)</span></td>
    </tr>
    <tr>
    <td><span class="arithmatex">\(x_2\)</span></td>
    <td><span class="arithmatex">\(x_2 \le 2\)</span></td>
    <td><span class="arithmatex">\(\dfrac{151}{10}\)</span></td>
    <td><span class="arithmatex">\(\dfrac{2}{5}\)</span></td>
    <td><span class="arithmatex">\(x_2 \ge 3\)</span></td>
    <td><span class="arithmatex">\(\dfrac{45}{4}\)</span></td>
    <td><span class="arithmatex">\(\dfrac{17}{4}\)</span></td>
    <td><span class="arithmatex">\(\dfrac{2}{5}\)</span></td>
    </tr>
    </table></div>

    La massima diminuzione minima è $1$: lo strong branching seleziona $x_1$, la stessa variabile scelta dalla regola dell'indice minimo.

### 7.5.4 Altre strategie

- I solver stimano le diminuzioni $\delta^d_k$ e $\delta^u_k$ dalla storia della ricerca, senza risolvere i figli, per mezzo degli <strong>pseudocosti</strong>; le stesse stime danno una regola di selezione del nodo di branching detta <strong>best estimate</strong>. Queste strategie sono una possibile estensione di questo capitolo.

## 7.6 Strategie di selezione del nodo di branching

- L'ordine in cui si elaborano i nodi della lista $L$ è la <strong>strategia di selezione del nodo di branching</strong>: decide dove prosegue la ricerca.

### 7.6.1 Best bound

!!! chiave ""

    La strategia <strong>best bound</strong> seleziona il nodo della lista $L$ con il massimo valore ottimo $z(\LP_k)$. I pareggi si risolvono con l'indice di nodo minimo.

- Il nodo selezionato dà l'upper bound $\eqref{bb:UB}$: elaborarlo è l'unico modo per far scendere $\UB$. La regola tende a esplorare pochi nodi, ma la lista può diventare lunga.

### 7.6.2 LIFO e FIFO

!!! chiave ""

    La strategia <strong>Last-In-First-Out</strong> (LIFO) elabora i nodi nell'ordine inverso di inserimento nella lista $L$. È equivalente a una <strong>ricerca in profondità</strong> (DFS).

- La lista è realizzata come una <strong>pila</strong>. La ricerca scende in profondità nell'albero, dove le foglie contengono spesso soluzioni ammissibili: lo scopo è aggiornare rapidamente il lower bound e la soluzione incumbent. La lista resta corta.

!!! chiave ""

    La strategia <strong>First-In-First-Out</strong> (FIFO) elabora i nodi nell'ordine di inserimento nella lista $L$. È equivalente a una <strong>ricerca in ampiezza</strong> (BFS).

- La lista è realizzata come una <strong>coda</strong>. L'albero viene esplorato livello per livello: questo migliora l'upper bound, ma di solito non trova rapidamente buoni lower bound.

<a id="box-7-ex-bb-lifo"></a>

!!! esempio "Esempio 7.3: strategia LIFO"

    Ordine in cui un albero branch-and-bound binario completo di $4$ livelli viene esplorato con la strategia LIFO (nessun nodo viene potato).

    1. Se si risolve per primo il nodo di branching verso il basso, abbiamo:

        ![Figura 2](../img/07-bb/fig02.svg){ .fig loading=lazy  }

    2. Se si risolve per primo il nodo di branching verso l'alto, abbiamo:

        ![Figura 3](../img/07-bb/fig03.svg){ .fig loading=lazy  }

<a id="box-8-ex-bb-fifo"></a>

!!! esempio "Esempio 7.4: strategia FIFO"

    Ordine in cui un albero branch-and-bound binario completo di $4$ livelli viene esplorato con la strategia FIFO (nessun nodo viene potato).

    1. Se si risolve per primo il nodo di branching verso il basso, abbiamo:

        ![Figura 4](../img/07-bb/fig04.svg){ .fig loading=lazy  }

    2. Se si risolve per primo il nodo di branching verso l'alto, abbiamo:

        ![Figura 5](../img/07-bb/fig05.svg){ .fig loading=lazy  }

## 7.7 Esempi svolti sull'esempio dell'auto

- Risolviamo ora l'esempio dell'auto con due esecuzioni dell'algoritmo B&amp;B, che differiscono solo per le strategie di selezione. Poiché tutte le variabili e tutti i costi sono interi, il bound di un nodo è $\mathrm{UB}(\LP_k) = \lfloor z(\LP_k) \rfloor$.

- Nella prima esecuzione ogni nodo è riottimizzato con l'algoritmo del simplesso duale, e riportiamo tutti i dizionari. Per ogni nodo una figura mostra la sua regione ammissibile.

- Prima di leggere la soluzione, prova a prevedere quale variabile viene selezionata alla radice, e quale nodo viene estratto alla seconda iterazione.

<a id="box-9-ex-bb-runA"></a>

!!! esempio "Esempio 7.5: esecuzione A: indice minimo e LIFO"

    Eseguiamo l'algoritmo B&amp;B sull'esempio dell'auto con:

    1. la regola dell'indice minimo (lessicografica) come strategia di selezione della variabile di branching;

    2. la regola LIFO come strategia di selezione del nodo di branching;

    3. si risolve prima il nodo di branching verso il basso, poi il nodo di branching verso l'alto;

    4. il secondo figlio non viene risolto quando si applica la regola di salto;

    5. il lower bound è inizializzato a $\LB = -\infty$ (non si esegue alcun algoritmo euristico).

    - <span style="color:#e03131"><strong>Inizializzazione</strong></span>

        Il problema $\LP_1$ è il rilassamento lineare dell'esempio dell'auto. L'algoritmo del simplesso con la regola di Bland, a partire dalla base delle variabili di scarto, esegue 2 operazioni di pivot ($x_1$ entra in base e $x_3$ esce; $x_2$ entra in base e $x_4$ esce) e termina con il dizionario ottimo:

        \begin{equation*}
        \begin{cases}
        \begin{array}{rrrrrrr}
        {x_1} & {=} & {\dfrac{7}{2}} & {-} & {\dfrac{7}{62}}\, {x_3} & {+} & {\dfrac{1}{31}}\, {x_4} \\[2ex]
        {x_2} & {=} & {\dfrac{5}{2}} & {+} & {\dfrac{1}{31}}\, {x_3} & {-} & {\dfrac{5}{62}}\, {x_4} \\[2ex]
        {z} & {=} & {\dfrac{31}{2}} & {-} & {\dfrac{17}{62}}\, {x_3} & {-} & {\dfrac{2}{31}}\, {x_4}
        \end{array}
        \end{cases}
        \end{equation*}

        Una soluzione ottima $\tilde{\vet x}(\LP_1)$ è:

        $$
        \tilde x_1 = \dfrac{7}{2},~~\tilde x_2 = \dfrac{5}{2}, \qquad z(\LP_1) = \dfrac{31}{2}.
        $$

        ![Figura 6](../img/07-bb/fig06.svg){ .fig .ovale loading=lazy  }

        <em>Nodo $1$: la regione ammissibile di $\LP_1$, i punti interi, la soluzione ottima di $\LP_1$ (in blu) e la retta dell'obiettivo che passa per essa (tratteggiata).</em>

        La soluzione è frazionaria e $\left\lfloor z(\LP_{1}) \right\rfloor = \left\lfloor \dfrac{31}{2} \right\rfloor = 15 > \LB = -\infty$: il problema $\LP_1$ è inserito nella lista $L$.

        La lista è $L = \{\LP_{1}\}$ e l'upper bound è il massimo dei bound dei nodi della lista:

        $$
        \underbrace{-\infty}_{\LB} ~~\le~~ z(\ILP) ~~\le~~ \underbrace{15}_{\UB} \qquad \left( \UB = \max_{k \in L} {\mathrm{UB}(\LP_k)} = 15 \right).
        $$

    - <span style="color:#e03131"><strong>Iterazione 1</strong></span>

        La lista è $L = \{\LP_{1}\}$: il problema $\LP_{1}$ viene estratto e rimosso da $L$.

        In $\tilde{\vet x}(\LP_{1})$ abbiamo $\tilde x_1 = \tfrac{7}{2}$ e $\tilde x_2 = \tfrac{5}{2}$, entrambe frazionarie; per la regola dell'indice minimo la variabile di branching è $x_1$. I vincoli di branching sono:

        $$
        x_1 \le \underbrace{\left\lfloor \dfrac{7}{2} \right\rfloor}_{= 3} \qquad \text{e} \qquad x_1 \ge \underbrace{\left\lfloor \dfrac{7}{2} \right\rfloor + 1}_{= 4}.
        $$

        1. <strong>Nodo $2$: il figlio verso il basso ($x_1 \le 3$).</strong>

            Il vincolo di branching $x_1 \le 3$ si scrive $x_1 + x_5 = 3$, con la variabile di scarto $x_5 \ge 0$. Usando la riga di $x_1$ nel dizionario ottimo di $\LP_{1}$, abbiamo:

            $$
            x_5 = 3 - x_1 = 3 - \left( \dfrac{7}{2} - \dfrac{7}{62} \, x_3 + \dfrac{1}{31} \, x_4 \right) = -\dfrac{1}{2} + \dfrac{7}{62} \, x_3 - \dfrac{1}{31} \, x_4.
            $$

            Aggiungiamo questa riga al dizionario ottimo di $\LP_{1}$. I costi ridotti non cambiano, quindi il nuovo dizionario è <strong>duale ammissibile</strong>; non è primale ammissibile, perché $\bar b_{5} = -\tfrac{1}{2} < 0$:

            \begin{equation*}
            \begin{cases}
            \begin{array}{rrrrrrr}
            {x_1} & {=} & {\dfrac{7}{2}} & {-} & {\dfrac{7}{62}}\, {x_3} & {+} & {\dfrac{1}{31}}\, {x_4} \\[2ex]
            {x_2} & {=} & {\dfrac{5}{2}} & {+} & {\dfrac{1}{31}}\, {x_3} & {-} & {\dfrac{5}{62}}\, {x_4} \\[2ex]
            {x_5} & {=} & {-\dfrac{1}{2}} & {+} & {\dfrac{7}{62}}\, {x_3} & {-} & {\dfrac{1}{31}}\, {x_4} \\[2ex]
            {z} & {=} & {\dfrac{31}{2}} & {-} & {\dfrac{17}{62}}\, {x_3} & {-} & {\dfrac{2}{31}}\, {x_4}
            \end{array}
            \end{cases}
            \end{equation*}

            <strong>Operazione di pivot duale.</strong> La riga pivot è $x_5$, l'unica variabile in base con valore negativo ($\bar b_{5} = -\tfrac{1}{2}$).

            Le candidate per la colonna pivot sono le variabili fuori base con $\bar a_{5,j} < 0$:

            $$
            \frac{\bar c_{3}}{\bar a_{5,3}} = \frac{-\tfrac{17}{62}}{-\tfrac{7}{62}} = \dfrac{17}{7}
            $$

            La colonna pivot è $x_3$, con $s_m = \tfrac{17}{7}$, e il valore obiettivo diventa

            $$
            \bar z + s_m \, \bar b_{5} = \dfrac{31}{2} + \dfrac{17}{7} \cdot \left( -\dfrac{1}{2} \right) = \dfrac{100}{7}.
            $$

            Dopo l'operazione di pivot otteniamo il seguente dizionario, che è primale e duale ammissibile, quindi <strong>ottimo</strong>:

            \begin{equation*}
            \begin{cases}
            \begin{array}{rrrrrrr}
            {x_1} & {=} & {3} &  &  & {-} & {x_5} \\[2ex]
            {x_2} & {=} & {\dfrac{37}{14}} & {-} & {\dfrac{1}{14}}\, {x_4} & {+} & {\dfrac{2}{7}}\, {x_5} \\[2ex]
            {x_3} & {=} & {\dfrac{31}{7}} & {+} & {\dfrac{2}{7}}\, {x_4} & {+} & {\dfrac{62}{7}}\, {x_5} \\[2ex]
            {z} & {=} & {\dfrac{100}{7}} & {-} & {\dfrac{1}{7}}\, {x_4} & {-} & {\dfrac{17}{7}}\, {x_5}
            \end{array}
            \end{cases}
            \end{equation*}

            Una soluzione ottima $\tilde{\vet x}(\LP_{2})$ è:

            $$
            \tilde x_1 = 3,~~\tilde x_2 = \dfrac{37}{14}, \qquad z(\LP_{2}) = \dfrac{100}{7}.
            $$

            ![Figura 7](../img/07-bb/fig07.svg){ .fig .ovale loading=lazy  }

            <em>Nodo $2$: la regione ammissibile di $\LP_{2}$ (in rosso) dentro la regione del padre $\LP_{1}$ (in grigio), e la soluzione ottima di $\LP_{2}$ (in blu) con la retta dell'obiettivo che passa per essa (tratteggiata).</em>

            La soluzione è <strong>frazionaria</strong> e

            $$
            \left\lfloor z(\LP_{2}) \right\rfloor = \left\lfloor \dfrac{100}{7} \right\rfloor = 14 > \LB = -\infty,
            $$

            quindi il problema $\LP_{2}$ è <strong>inserito nella lista</strong> $L$.

        2. <strong>Nodo $3$: il figlio verso l'alto ($x_1 \ge 4$).</strong>

            Il vincolo di branching $x_1 \ge 4$ si scrive $x_1 - x_5 = 4$, con la variabile di surplus $x_5 \ge 0$. Usando la riga di $x_1$ nel dizionario ottimo di $\LP_{1}$, abbiamo:

            $$
            x_5 = x_1 - 4 = \left( \dfrac{7}{2} - \dfrac{7}{62} \, x_3 + \dfrac{1}{31} \, x_4 \right) - 4 = -\dfrac{1}{2} - \dfrac{7}{62} \, x_3 + \dfrac{1}{31} \, x_4.
            $$

            Aggiungiamo questa riga al dizionario ottimo di $\LP_{1}$. I costi ridotti non cambiano, quindi il nuovo dizionario è <strong>duale ammissibile</strong>; non è primale ammissibile, perché $\bar b_{5} = -\tfrac{1}{2} < 0$:

            \begin{equation*}
            \begin{cases}
            \begin{array}{rrrrrrr}
            {x_1} & {=} & {\dfrac{7}{2}} & {-} & {\dfrac{7}{62}}\, {x_3} & {+} & {\dfrac{1}{31}}\, {x_4} \\[2ex]
            {x_2} & {=} & {\dfrac{5}{2}} & {+} & {\dfrac{1}{31}}\, {x_3} & {-} & {\dfrac{5}{62}}\, {x_4} \\[2ex]
            {x_5} & {=} & {-\dfrac{1}{2}} & {-} & {\dfrac{7}{62}}\, {x_3} & {+} & {\dfrac{1}{31}}\, {x_4} \\[2ex]
            {z} & {=} & {\dfrac{31}{2}} & {-} & {\dfrac{17}{62}}\, {x_3} & {-} & {\dfrac{2}{31}}\, {x_4}
            \end{array}
            \end{cases}
            \end{equation*}

            <strong>Operazione di pivot duale.</strong> La riga pivot è $x_5$, l'unica variabile in base con valore negativo ($\bar b_{5} = -\tfrac{1}{2}$).

            Le candidate per la colonna pivot sono le variabili fuori base con $\bar a_{5,j} < 0$:

            $$
            \frac{\bar c_{4}}{\bar a_{5,4}} = \frac{-\tfrac{2}{31}}{-\tfrac{1}{31}} = 2
            $$

            La colonna pivot è $x_4$, con $s_m = 2$, e il valore obiettivo diventa

            $$
            \bar z + s_m \, \bar b_{5} = \dfrac{31}{2} + 2 \cdot \left( -\dfrac{1}{2} \right) = \dfrac{29}{2}.
            $$

            Dopo l'operazione di pivot otteniamo il seguente dizionario, che è primale e duale ammissibile, quindi <strong>ottimo</strong>:

            \begin{equation*}
            \begin{cases}
            \begin{array}{rrrrrrr}
            {x_1} & {=} & {4} &  &  & {+} & {x_5} \\[2ex]
            {x_2} & {=} & {\dfrac{5}{4}} & {-} & {\dfrac{1}{4}}\, {x_3} & {-} & {\dfrac{5}{2}}\, {x_5} \\[2ex]
            {x_4} & {=} & {\dfrac{31}{2}} & {+} & {\dfrac{7}{2}}\, {x_3} & {+} & {31}\, {x_5} \\[2ex]
            {z} & {=} & {\dfrac{29}{2}} & {-} & {\dfrac{1}{2}}\, {x_3} & {-} & {2}\, {x_5}
            \end{array}
            \end{cases}
            \end{equation*}

            Una soluzione ottima $\tilde{\vet x}(\LP_{3})$ è:

            $$
            \tilde x_1 = 4,~~\tilde x_2 = \dfrac{5}{4}, \qquad z(\LP_{3}) = \dfrac{29}{2}.
            $$

            ![Figura 8](../img/07-bb/fig08.svg){ .fig .ovale loading=lazy  }

            <em>Nodo $3$: la regione ammissibile di $\LP_{3}$ (in rosso) dentro la regione del padre $\LP_{1}$ (in grigio), e la soluzione ottima di $\LP_{3}$ (in blu) con la retta dell'obiettivo che passa per essa (tratteggiata).</em>

            La soluzione è <strong>frazionaria</strong> e

            $$
            \left\lfloor z(\LP_{3}) \right\rfloor = \left\lfloor \dfrac{29}{2} \right\rfloor = 14 > \LB = -\infty,
            $$

            quindi il problema $\LP_{3}$ è <strong>inserito nella lista</strong> $L$.

        La lista è $L = \{\LP_{2},~\LP_{3}\}$ e l'upper bound è il massimo dei bound dei nodi della lista:

        $$
        \underbrace{-\infty}_{\LB} ~~\le~~ z(\ILP) ~~\le~~ \underbrace{14}_{\UB} \qquad \left( \UB = \max_{k \in L} {\mathrm{UB}(\LP_k)} = 14 \right).
        $$

        Questa è la parte dell'albero branch-and-bound costruita nella prima iterazione, con i problemi LP dei nodi di branching:

        ![Figura 9](../img/07-bb/fig09.svg){ .fig loading=lazy  }

    - <span style="color:#e03131"><strong>Iterazione 2</strong></span>

        La lista è $L = \{\LP_{2},~\LP_{3}\}$; seguendo la regola LIFO, $\LP_{3}$ (l'ultimo problema inserito) viene estratto e rimosso da $L$.

        In $\tilde{\vet x}(\LP_{3})$ l'unica variabile intera con valore frazionario è $x_2$, che è la variabile di branching. I vincoli di branching sono:

        $$
        x_2 \le \underbrace{\left\lfloor \dfrac{5}{4} \right\rfloor}_{= 1} \qquad \text{e} \qquad x_2 \ge \underbrace{\left\lfloor \dfrac{5}{4} \right\rfloor + 1}_{= 2}.
        $$

        1. <strong>Nodo $4$: il figlio verso il basso ($x_2 \le 1$).</strong>

            Il vincolo di branching $x_2 \le 1$ si scrive $x_2 + x_6 = 1$, con la variabile di scarto $x_6 \ge 0$. Usando la riga di $x_2$ nel dizionario ottimo di $\LP_{3}$, abbiamo:

            $$
            x_6 = 1 - x_2 = 1 - \left( \dfrac{5}{4} - \dfrac{1}{4} \, x_3 - \dfrac{5}{2} \, x_5 \right) = -\dfrac{1}{4} + \dfrac{1}{4} \, x_3 + \dfrac{5}{2} \, x_5.
            $$

            Aggiungiamo questa riga al dizionario ottimo di $\LP_{3}$. I costi ridotti non cambiano, quindi il nuovo dizionario è <strong>duale ammissibile</strong>; non è primale ammissibile, perché $\bar b_{6} = -\tfrac{1}{4} < 0$:

            \begin{equation*}
            \begin{cases}
            \begin{array}{rrrrrrr}
            {x_1} & {=} & {4} &  &  & {+} & {x_5} \\[2ex]
            {x_2} & {=} & {\dfrac{5}{4}} & {-} & {\dfrac{1}{4}}\, {x_3} & {-} & {\dfrac{5}{2}}\, {x_5} \\[2ex]
            {x_4} & {=} & {\dfrac{31}{2}} & {+} & {\dfrac{7}{2}}\, {x_3} & {+} & {31}\, {x_5} \\[2ex]
            {x_6} & {=} & {-\dfrac{1}{4}} & {+} & {\dfrac{1}{4}}\, {x_3} & {+} & {\dfrac{5}{2}}\, {x_5} \\[2ex]
            {z} & {=} & {\dfrac{29}{2}} & {-} & {\dfrac{1}{2}}\, {x_3} & {-} & {2}\, {x_5}
            \end{array}
            \end{cases}
            \end{equation*}

            <strong>Operazione di pivot duale.</strong> La riga pivot è $x_6$, l'unica variabile in base con valore negativo ($\bar b_{6} = -\tfrac{1}{4}$).

            Le candidate per la colonna pivot sono le variabili fuori base con $\bar a_{6,j} < 0$:

            $$
            \frac{\bar c_{3}}{\bar a_{6,3}} = \frac{-\tfrac{1}{2}}{-\tfrac{1}{4}} = 2,~~\frac{\bar c_{5}}{\bar a_{6,5}} = \frac{-2}{-\tfrac{5}{2}} = \dfrac{4}{5}
            $$

            $$
            s_m = \min\left\{ 2, \dfrac{4}{5} \right\} = \dfrac{4}{5}.
            $$

            La colonna pivot è $x_5$, con $s_m = \tfrac{4}{5}$, e il valore obiettivo diventa

            $$
            \bar z + s_m \, \bar b_{6} = \dfrac{29}{2} + \dfrac{4}{5} \cdot \left( -\dfrac{1}{4} \right) = \dfrac{143}{10}.
            $$

            Dopo l'operazione di pivot otteniamo il seguente dizionario, che è primale e duale ammissibile, quindi <strong>ottimo</strong>:

            \begin{equation*}
            \begin{cases}
            \begin{array}{rrrrrrr}
            {x_1} & {=} & {\dfrac{41}{10}} & {-} & {\dfrac{1}{10}}\, {x_3} & {+} & {\dfrac{2}{5}}\, {x_6} \\[2ex]
            {x_2} & {=} & {1} &  &  & {-} & {x_6} \\[2ex]
            {x_4} & {=} & {\dfrac{93}{5}} & {+} & {\dfrac{2}{5}}\, {x_3} & {+} & {\dfrac{62}{5}}\, {x_6} \\[2ex]
            {x_5} & {=} & {\dfrac{1}{10}} & {-} & {\dfrac{1}{10}}\, {x_3} & {+} & {\dfrac{2}{5}}\, {x_6} \\[2ex]
            {z} & {=} & {\dfrac{143}{10}} & {-} & {\dfrac{3}{10}}\, {x_3} & {-} & {\dfrac{4}{5}}\, {x_6}
            \end{array}
            \end{cases}
            \end{equation*}

            Una soluzione ottima $\tilde{\vet x}(\LP_{4})$ è:

            $$
            \tilde x_1 = \dfrac{41}{10},~~\tilde x_2 = 1, \qquad z(\LP_{4}) = \dfrac{143}{10}.
            $$

            ![Figura 10](../img/07-bb/fig10.svg){ .fig .ovale loading=lazy  }

            <em>Nodo $4$: la regione ammissibile di $\LP_{4}$ (in rosso) dentro la regione del padre $\LP_{3}$ (in grigio), e la soluzione ottima di $\LP_{4}$ (in blu) con la retta dell'obiettivo che passa per essa (tratteggiata).</em>

            La soluzione è <strong>frazionaria</strong> e

            $$
            \left\lfloor z(\LP_{4}) \right\rfloor = \left\lfloor \dfrac{143}{10} \right\rfloor = 14 > \LB = -\infty,
            $$

            quindi il problema $\LP_{4}$ è <strong>inserito nella lista</strong> $L$.

        2. <strong>Nodo $5$: il figlio verso l'alto ($x_2 \ge 2$).</strong>

            Il vincolo di branching $x_2 \ge 2$ si scrive $x_2 - x_6 = 2$, con la variabile di surplus $x_6 \ge 0$. Usando la riga di $x_2$ nel dizionario ottimo di $\LP_{3}$, abbiamo:

            $$
            x_6 = x_2 - 2 = \left( \dfrac{5}{4} - \dfrac{1}{4} \, x_3 - \dfrac{5}{2} \, x_5 \right) - 2 = -\dfrac{3}{4} - \dfrac{1}{4} \, x_3 - \dfrac{5}{2} \, x_5.
            $$

            Aggiungiamo questa riga al dizionario ottimo di $\LP_{3}$. I costi ridotti non cambiano, quindi il nuovo dizionario è <strong>duale ammissibile</strong>; non è primale ammissibile, perché $\bar b_{6} = -\tfrac{3}{4} < 0$:

            \begin{equation*}
            \begin{cases}
            \begin{array}{rrrrrrr}
            {x_1} & {=} & {4} &  &  & {+} & {x_5} \\[2ex]
            {x_2} & {=} & {\dfrac{5}{4}} & {-} & {\dfrac{1}{4}}\, {x_3} & {-} & {\dfrac{5}{2}}\, {x_5} \\[2ex]
            {x_4} & {=} & {\dfrac{31}{2}} & {+} & {\dfrac{7}{2}}\, {x_3} & {+} & {31}\, {x_5} \\[2ex]
            {x_6} & {=} & {-\dfrac{3}{4}} & {-} & {\dfrac{1}{4}}\, {x_3} & {-} & {\dfrac{5}{2}}\, {x_5} \\[2ex]
            {z} & {=} & {\dfrac{29}{2}} & {-} & {\dfrac{1}{2}}\, {x_3} & {-} & {2}\, {x_5}
            \end{array}
            \end{cases}
            \end{equation*}

            <strong>Operazione di pivot duale.</strong> La riga pivot è $x_6$, l'unica variabile in base con valore negativo ($\bar b_{6} = -\tfrac{3}{4}$).

            Tutti i coefficienti della riga pivot sono non negativi ($\bar a_{6,3} = \tfrac{1}{4}$, $\bar a_{6,5} = \tfrac{5}{2}$), cioè la riga è

            $$
            x_6 = -\dfrac{3}{4} - \dfrac{1}{4} \, x_3 - \dfrac{5}{2} \, x_5 \le -\dfrac{3}{4} < 0
            $$

            per ogni valore non negativo delle variabili fuori base. Per l'algoritmo del simplesso duale, il problema $\LP_{5}$ è <strong>inammissibile</strong>.

            ![Figura 11](../img/07-bb/fig11.svg){ .fig .ovale loading=lazy  }

            <em>Nodo $5$: il vincolo $x_2 \ge 2$ non lascia alcun punto della regione del padre $\LP_{3}$ (in grigio): $\LP_{5}$ è inammissibile.</em>

            Di conseguenza, il Nodo $5$ è <u>potato per inammissibilità</u>.

        La lista è $L = \{\LP_{2},~\LP_{4}\}$ e l'upper bound è il massimo dei bound dei nodi della lista:

        $$
        \underbrace{-\infty}_{\LB} ~~\le~~ z(\ILP) ~~\le~~ \underbrace{14}_{\UB} \qquad \left( \UB = \max_{k \in L} {\mathrm{UB}(\LP_k)} = 14 \right).
        $$

        Questa è la parte dell'albero branch-and-bound costruita nella seconda iterazione, con i problemi LP dei nodi di branching:

        ![Figura 12](../img/07-bb/fig12.svg){ .fig loading=lazy  }

    - <span style="color:#e03131"><strong>Iterazione 3</strong></span>

        La lista è $L = \{\LP_{2},~\LP_{4}\}$; seguendo la regola LIFO, $\LP_{4}$ (l'ultimo problema inserito) viene estratto e rimosso da $L$.

        In $\tilde{\vet x}(\LP_{4})$ l'unica variabile intera con valore frazionario è $x_1$, che è la variabile di branching. I vincoli di branching sono:

        $$
        x_1 \le \underbrace{\left\lfloor \dfrac{41}{10} \right\rfloor}_{= 4} \qquad \text{e} \qquad x_1 \ge \underbrace{\left\lfloor \dfrac{41}{10} \right\rfloor + 1}_{= 5}.
        $$

        1. <strong>Nodo $6$: il figlio verso il basso ($x_1 \le 4$).</strong>

            Il vincolo di branching $x_1 \le 4$ si scrive $x_1 + x_7 = 4$, con la variabile di scarto $x_7 \ge 0$. Usando la riga di $x_1$ nel dizionario ottimo di $\LP_{4}$, abbiamo:

            $$
            x_7 = 4 - x_1 = 4 - \left( \dfrac{41}{10} - \dfrac{1}{10} \, x_3 + \dfrac{2}{5} \, x_6 \right) = -\dfrac{1}{10} + \dfrac{1}{10} \, x_3 - \dfrac{2}{5} \, x_6.
            $$

            Aggiungiamo questa riga al dizionario ottimo di $\LP_{4}$. I costi ridotti non cambiano, quindi il nuovo dizionario è <strong>duale ammissibile</strong>; non è primale ammissibile, perché $\bar b_{7} = -\tfrac{1}{10} < 0$:

            \begin{equation*}
            \begin{cases}
            \begin{array}{rrrrrrr}
            {x_1} & {=} & {\dfrac{41}{10}} & {-} & {\dfrac{1}{10}}\, {x_3} & {+} & {\dfrac{2}{5}}\, {x_6} \\[2ex]
            {x_2} & {=} & {1} &  &  & {-} & {x_6} \\[2ex]
            {x_4} & {=} & {\dfrac{93}{5}} & {+} & {\dfrac{2}{5}}\, {x_3} & {+} & {\dfrac{62}{5}}\, {x_6} \\[2ex]
            {x_5} & {=} & {\dfrac{1}{10}} & {-} & {\dfrac{1}{10}}\, {x_3} & {+} & {\dfrac{2}{5}}\, {x_6} \\[2ex]
            {x_7} & {=} & {-\dfrac{1}{10}} & {+} & {\dfrac{1}{10}}\, {x_3} & {-} & {\dfrac{2}{5}}\, {x_6} \\[2ex]
            {z} & {=} & {\dfrac{143}{10}} & {-} & {\dfrac{3}{10}}\, {x_3} & {-} & {\dfrac{4}{5}}\, {x_6}
            \end{array}
            \end{cases}
            \end{equation*}

            <strong>Operazione di pivot duale.</strong> La riga pivot è $x_7$, l'unica variabile in base con valore negativo ($\bar b_{7} = -\tfrac{1}{10}$).

            Le candidate per la colonna pivot sono le variabili fuori base con $\bar a_{7,j} < 0$:

            $$
            \frac{\bar c_{3}}{\bar a_{7,3}} = \frac{-\tfrac{3}{10}}{-\tfrac{1}{10}} = 3
            $$

            La colonna pivot è $x_3$, con $s_m = 3$, e il valore obiettivo diventa

            $$
            \bar z + s_m \, \bar b_{7} = \dfrac{143}{10} + 3 \cdot \left( -\dfrac{1}{10} \right) = 14.
            $$

            Dopo l'operazione di pivot otteniamo il seguente dizionario, che è primale e duale ammissibile, quindi <strong>ottimo</strong>:

            \begin{equation*}
            \begin{cases}
            \begin{array}{rrrrrrr}
            {x_1} & {=} & {4} &  &  & {-} & {x_7} \\[2ex]
            {x_2} & {=} & {1} & {-} & {x_6} &  &  \\[2ex]
            {x_3} & {=} & {1} & {+} & {4}\, {x_6} & {+} & {10}\, {x_7} \\[2ex]
            {x_4} & {=} & {19} & {+} & {14}\, {x_6} & {+} & {4}\, {x_7} \\[2ex]
            {x_5} & {=} & {0} &  &  & {-} & {x_7} \\[2ex]
            {z} & {=} & {14} & {-} & {2}\, {x_6} & {-} & {3}\, {x_7}
            \end{array}
            \end{cases}
            \end{equation*}

            Una soluzione ottima $\tilde{\vet x}(\LP_{6})$ è:

            $$
            \tilde x_1 = 4,~~\tilde x_2 = 1, \qquad z(\LP_{6}) = 14.
            $$

            ![Figura 13](../img/07-bb/fig13.svg){ .fig .ovale loading=lazy  }

            <em>Nodo $6$: la regione ammissibile di $\LP_{6}$ (in rosso) dentro la regione del padre $\LP_{4}$ (in grigio), e la soluzione ottima di $\LP_{6}$ (in blu) con la retta dell'obiettivo che passa per essa (tratteggiata).</em>

            La soluzione $\tilde{\vet x}(\LP_{6})$ è <strong>intera</strong>.

            Poiché $z(\LP_{6}) = 14 > \LB = -\infty$, il lower bound e la soluzione incumbent vengono aggiornati:

            $$
            \LB \leftarrow 14, \qquad \bar{\vet x} \leftarrow (4, 1).
            $$

            Il Nodo $6$ è <u>potato per integralità</u>.

            Inoltre, $\LP_{2}$ viene rimosso dalla lista $L$ (<u>potato per bound</u>), perché ora

            $$
            \left\lfloor z(\LP_{2}) \right\rfloor = \left\lfloor \dfrac{100}{7} \right\rfloor = 14 \le \LB = 14.
            $$

        2. <strong>Regola di salto.</strong> Dopo il Nodo $6$ il lower bound soddisfa

            $$
            \left\lfloor z(\LP_{4}) \right\rfloor = \left\lfloor \dfrac{143}{10} \right\rfloor = 14 \le \LB = 14,
            $$

            quindi nessuna soluzione nella regione di $\LP_{4}$ può migliorare la soluzione incumbent: il figlio verso l'alto ($x_1 \ge 5$) <strong>non viene risolto</strong> e non riceve un indice di nodo.

        La lista è vuota, quindi l'upper bound è uguale al lower bound:

        $$
        \underbrace{14}_{\LB} ~~\le~~ z(\ILP) ~~\le~~ \underbrace{14}_{\UB} \qquad \left( \UB = \LB = 14 \right).
        $$

        Questa è la parte dell'albero branch-and-bound costruita nella terza iterazione, con i problemi LP dei nodi di branching:

        ![Figura 14](../img/07-bb/fig14.svg){ .fig loading=lazy  }

    - <span style="color:#e03131"><strong>Terminazione</strong></span>

        La lista $L$ è vuota: $\LB = \UB = 14$ e la soluzione incumbent è ottima:

        $$
        \tilde x_1 = 4,~~\tilde x_2 = 1, \qquad z(\ILP) = 14.
        $$

    Questo è l'albero branch-and-bound finale. Per ogni nodo di branching mostra il bound del nodo, il lower bound $\LB$ al momento in cui il nodo è stato risolto (o rimosso dalla lista) e il criterio di potatura.

    ![Figura 15](../img/07-bb/fig15.svg){ .fig loading=lazy  }

    La stessa esecuzione in una tabella:

    <div class="tabella" markdown="0"><table>
    <tr>
    <th>Nodo</th>
    <th>Padre</th>
    <th>It.</th>
    <th>Branching</th>
    <th><span class="arithmatex">\(\tilde{\vet x}(\LP_k)\)</span></th>
    <th><span class="arithmatex">\(z(\LP_k)\)</span></th>
    <th><span class="arithmatex">\(\LB\)</span></th>
    <th>Esito</th>
    </tr>
    <tr>
    <td>1</td>
    <td>–</td>
    <td>0</td>
    <td>–</td>
    <td><span class="arithmatex">\((\tfrac{7}{2}, \tfrac{5}{2})\)</span></td>
    <td><span class="arithmatex">\(\tfrac{31}{2}\)</span></td>
    <td><span class="arithmatex">\(-\infty\)</span></td>
    <td>branching su <span class="arithmatex">\(x_1\)</span></td>
    </tr>
    <tr>
    <td>2</td>
    <td>1</td>
    <td>1</td>
    <td><span class="arithmatex">\(x_1 \le 3\)</span></td>
    <td><span class="arithmatex">\((3, \tfrac{37}{14})\)</span></td>
    <td><span class="arithmatex">\(\tfrac{100}{7}\)</span></td>
    <td><span class="arithmatex">\(14\)</span></td>
    <td>potato per bound (rimosso da <span class="arithmatex">\(L\)</span>)</td>
    </tr>
    <tr>
    <td>3</td>
    <td>1</td>
    <td>1</td>
    <td><span class="arithmatex">\(x_1 \ge 4\)</span></td>
    <td><span class="arithmatex">\((4, \tfrac{5}{4})\)</span></td>
    <td><span class="arithmatex">\(\tfrac{29}{2}\)</span></td>
    <td><span class="arithmatex">\(-\infty\)</span></td>
    <td>branching su <span class="arithmatex">\(x_2\)</span></td>
    </tr>
    <tr>
    <td>4</td>
    <td>3</td>
    <td>2</td>
    <td><span class="arithmatex">\(x_2 \le 1\)</span></td>
    <td><span class="arithmatex">\((\tfrac{41}{10}, 1)\)</span></td>
    <td><span class="arithmatex">\(\tfrac{143}{10}\)</span></td>
    <td><span class="arithmatex">\(-\infty\)</span></td>
    <td>branching su <span class="arithmatex">\(x_1\)</span></td>
    </tr>
    <tr>
    <td>5</td>
    <td>3</td>
    <td>2</td>
    <td><span class="arithmatex">\(x_2 \ge 2\)</span></td>
    <td>–</td>
    <td>–</td>
    <td><span class="arithmatex">\(-\infty\)</span></td>
    <td>potato per inammissibilità</td>
    </tr>
    <tr>
    <td>6</td>
    <td>4</td>
    <td>3</td>
    <td><span class="arithmatex">\(x_1 \le 4\)</span></td>
    <td><span class="arithmatex">\((4, 1)\)</span></td>
    <td><span class="arithmatex">\(14\)</span></td>
    <td><span class="arithmatex">\(14\)</span></td>
    <td>potato per integralità</td>
    </tr>
    </table></div>

    ![Figura 16](../img/07-bb/fig16.svg){ .fig .ovale loading=lazy  }

    <em>L'esecuzione A nel piano: i vincoli di branching (in nero, tratteggiati) dentro le regioni dei nodi padre, e le soluzioni ottime dei nodi risolti (in viola), a partire da $\LP_1$ (in blu).</em>

<a id="box-10-ex-bb-runB"></a>

!!! esempio "Esempio 7.6: esecuzione B: indice massimo e best bound"

    Eseguiamo di nuovo l'algoritmo B&amp;B sull'esempio dell'auto, ora con:

    1. la regola dell'indice massimo (lessicografica) come strategia di selezione della variabile di branching;

    2. la regola best bound come strategia di selezione del nodo di branching (pareggi: indice di nodo minimo);

    3. si risolve prima il nodo di branching verso il basso, poi il nodo di branching verso l'alto;

    4. il secondo figlio non viene risolto quando si applica la regola di salto;

    5. il lower bound è inizializzato a $\LB = -\infty$ (non si esegue alcun algoritmo euristico).

    Ogni figlio è riottimizzato con l'algoritmo del simplesso duale a partire dal dizionario ottimo del padre, esattamente come nell'<span style="color:#1971c2">[Esempio 7.5](#box-9-ex-bb-runA)</span>; qui riportiamo solo i risultati.

    - <span style="color:#e03131"><strong>Inizializzazione</strong></span>

        Come prima, $\tilde{\vet x}(\LP_1) = (\tfrac{7}{2}, \tfrac{5}{2})$ con $z(\LP_1) = \tfrac{31}{2}$, e $\LP_1$ è inserito nella lista $L$.

        La lista è $L = \{\LP_{1}\}$ e l'upper bound è il massimo dei bound dei nodi della lista:

        $$
        \underbrace{-\infty}_{\LB} ~~\le~~ z(\ILP) ~~\le~~ \underbrace{15}_{\UB} \qquad \left( \UB = \max_{k \in L} {\mathrm{UB}(\LP_k)} = 15 \right).
        $$

    - <span style="color:#e03131"><strong>Iterazione 1</strong></span>

        La lista è $L = \{\LP_{1}\}$: il problema $\LP_{1}$ viene estratto e rimosso da $L$.

        In $\tilde{\vet x}(\LP_{1})$ abbiamo $\tilde x_1 = \tfrac{7}{2}$ e $\tilde x_2 = \tfrac{5}{2}$, entrambe frazionarie; per la regola dell'indice massimo la variabile di branching è $x_2$. I vincoli di branching sono:

        $$
        x_2 \le \underbrace{\left\lfloor \dfrac{5}{2} \right\rfloor}_{= 2} \qquad \text{e} \qquad x_2 \ge \underbrace{\left\lfloor \dfrac{5}{2} \right\rfloor + 1}_{= 3}.
        $$

        - Nodo $2$ ($x_2 \le 2$): $\tilde{\vet x}(\LP_{2}) = (\tfrac{37}{10}, 2)$ con $z(\LP_{2}) = \tfrac{151}{10}$. La soluzione è <strong>frazionaria</strong> e

            $$
            \left\lfloor z(\LP_{2}) \right\rfloor = \left\lfloor \dfrac{151}{10} \right\rfloor = 15 > \LB = -\infty,
            $$

            quindi il problema $\LP_{2}$ è <strong>inserito nella lista</strong> $L$.

        - Nodo $3$ ($x_2 \ge 3$): $\tilde{\vet x}(\LP_{3}) = (\tfrac{7}{4}, 3)$ con $z(\LP_{3}) = \tfrac{45}{4}$. La soluzione è <strong>frazionaria</strong> e

            $$
            \left\lfloor z(\LP_{3}) \right\rfloor = \left\lfloor \dfrac{45}{4} \right\rfloor = 11 > \LB = -\infty,
            $$

            quindi il problema $\LP_{3}$ è <strong>inserito nella lista</strong> $L$.

        La lista è $L = \{\LP_{2},~\LP_{3}\}$ e l'upper bound è il massimo dei bound dei nodi della lista:

        $$
        \underbrace{-\infty}_{\LB} ~~\le~~ z(\ILP) ~~\le~~ \underbrace{15}_{\UB} \qquad \left( \UB = \max_{k \in L} {\mathrm{UB}(\LP_k)} = 15 \right).
        $$

    - <span style="color:#e03131"><strong>Iterazione 2</strong></span>

        La lista è $L = \{\LP_{2},~\LP_{3}\}$; seguendo la regola best bound, $\LP_{2}$ viene estratto e rimosso da $L$, perché ha il massimo valore ottimo:

        $$
        z(\LP_{2}) = \dfrac{151}{10},~~z(\LP_{3}) = \dfrac{45}{4}.
        $$

        In $\tilde{\vet x}(\LP_{2})$ l'unica variabile intera con valore frazionario è $x_1$, che è la variabile di branching. I vincoli di branching sono:

        $$
        x_1 \le \underbrace{\left\lfloor \dfrac{37}{10} \right\rfloor}_{= 3} \qquad \text{e} \qquad x_1 \ge \underbrace{\left\lfloor \dfrac{37}{10} \right\rfloor + 1}_{= 4}.
        $$

        - Nodo $4$ ($x_1 \le 3$): $\tilde{\vet x}(\LP_{4}) = (3, 2)$ con $z(\LP_{4}) = 13$. La soluzione $\tilde{\vet x}(\LP_{4})$ è <strong>intera</strong>. Poiché $z(\LP_{4}) = 13 > \LB = -\infty$, il lower bound e la soluzione incumbent vengono aggiornati:

            $$
            \LB \leftarrow 13, \qquad \bar{\vet x} \leftarrow (3, 2).
            $$

            Il Nodo $4$ è <u>potato per integralità</u>. Inoltre, $\LP_{3}$ viene rimosso dalla lista $L$ (<u>potato per bound</u>), perché ora

            $$
            \left\lfloor z(\LP_{3}) \right\rfloor = \left\lfloor \dfrac{45}{4} \right\rfloor = 11 \le \LB = 13.
            $$

        - Nodo $5$ ($x_1 \ge 4$): $\tilde{\vet x}(\LP_{5}) = (4, \tfrac{5}{4})$ con $z(\LP_{5}) = \tfrac{29}{2}$. La soluzione è <strong>frazionaria</strong> e

            $$
            \left\lfloor z(\LP_{5}) \right\rfloor = \left\lfloor \dfrac{29}{2} \right\rfloor = 14 > \LB = 13,
            $$

            quindi il problema $\LP_{5}$ è <strong>inserito nella lista</strong> $L$.

        La lista è $L = \{\LP_{5}\}$ e l'upper bound è il massimo dei bound dei nodi della lista:

        $$
        \underbrace{13}_{\LB} ~~\le~~ z(\ILP) ~~\le~~ \underbrace{14}_{\UB} \qquad \left( \UB = \max_{k \in L} {\mathrm{UB}(\LP_k)} = 14 \right).
        $$

    - <span style="color:#e03131"><strong>Iterazione 3</strong></span>

        La lista è $L = \{\LP_{5}\}$: il problema $\LP_{5}$ viene estratto e rimosso da $L$.

        In $\tilde{\vet x}(\LP_{5})$ l'unica variabile intera con valore frazionario è $x_2$, che è la variabile di branching. I vincoli di branching sono:

        $$
        x_2 \le \underbrace{\left\lfloor \dfrac{5}{4} \right\rfloor}_{= 1} \qquad \text{e} \qquad x_2 \ge \underbrace{\left\lfloor \dfrac{5}{4} \right\rfloor + 1}_{= 2}.
        $$

        - Nodo $6$ ($x_2 \le 1$): $\tilde{\vet x}(\LP_{6}) = (\tfrac{41}{10}, 1)$ con $z(\LP_{6}) = \tfrac{143}{10}$. La soluzione è <strong>frazionaria</strong> e

            $$
            \left\lfloor z(\LP_{6}) \right\rfloor = \left\lfloor \dfrac{143}{10} \right\rfloor = 14 > \LB = 13,
            $$

            quindi il problema $\LP_{6}$ è <strong>inserito nella lista</strong> $L$.

        - Nodo $7$ ($x_2 \ge 2$): il problema $\LP_{7}$ è inammissibile: <u>potato per inammissibilità</u>.

        La lista è $L = \{\LP_{6}\}$ e l'upper bound è il massimo dei bound dei nodi della lista:

        $$
        \underbrace{13}_{\LB} ~~\le~~ z(\ILP) ~~\le~~ \underbrace{14}_{\UB} \qquad \left( \UB = \max_{k \in L} {\mathrm{UB}(\LP_k)} = 14 \right).
        $$

    - <span style="color:#e03131"><strong>Iterazione 4</strong></span>

        La lista è $L = \{\LP_{6}\}$: il problema $\LP_{6}$ viene estratto e rimosso da $L$.

        In $\tilde{\vet x}(\LP_{6})$ l'unica variabile intera con valore frazionario è $x_1$, che è la variabile di branching. I vincoli di branching sono:

        $$
        x_1 \le \underbrace{\left\lfloor \dfrac{41}{10} \right\rfloor}_{= 4} \qquad \text{e} \qquad x_1 \ge \underbrace{\left\lfloor \dfrac{41}{10} \right\rfloor + 1}_{= 5}.
        $$

        - Nodo $8$ ($x_1 \le 4$): $\tilde{\vet x}(\LP_{8}) = (4, 1)$ con $z(\LP_{8}) = 14$. La soluzione $\tilde{\vet x}(\LP_{8})$ è <strong>intera</strong>. Poiché $z(\LP_{8}) = 14 > \LB = 13$, il lower bound e la soluzione incumbent vengono aggiornati:

            $$
            \LB \leftarrow 14, \qquad \bar{\vet x} \leftarrow (4, 1).
            $$

            Il Nodo $8$ è <u>potato per integralità</u>.

        - <strong>Regola di salto.</strong> Dopo il Nodo $8$ il lower bound soddisfa

            $$
            \left\lfloor z(\LP_{6}) \right\rfloor = \left\lfloor \dfrac{143}{10} \right\rfloor = 14 \le \LB = 14,
            $$

            quindi nessuna soluzione nella regione di $\LP_{6}$ può migliorare la soluzione incumbent: il figlio verso l'alto ($x_1 \ge 5$) <strong>non viene risolto</strong> e non riceve un indice di nodo.

        La lista è vuota, quindi l'upper bound è uguale al lower bound:

        $$
        \underbrace{14}_{\LB} ~~\le~~ z(\ILP) ~~\le~~ \underbrace{14}_{\UB} \qquad \left( \UB = \LB = 14 \right).
        $$

    - <span style="color:#e03131"><strong>Terminazione</strong></span>

        La lista $L$ è vuota: $\LB = \UB = 14$ e la soluzione incumbent è ottima:

        $$
        \tilde x_1 = 4,~~\tilde x_2 = 1, \qquad z(\ILP) = 14.
        $$

    Questo è l'albero branch-and-bound finale:

    ![Figura 17](../img/07-bb/fig17.svg){ .fig loading=lazy  }

    <div class="tabella" markdown="0"><table>
    <tr>
    <th>Nodo</th>
    <th>Padre</th>
    <th>It.</th>
    <th>Branching</th>
    <th><span class="arithmatex">\(\tilde{\vet x}(\LP_k)\)</span></th>
    <th><span class="arithmatex">\(z(\LP_k)\)</span></th>
    <th><span class="arithmatex">\(\LB\)</span></th>
    <th>Esito</th>
    </tr>
    <tr>
    <td>1</td>
    <td>–</td>
    <td>0</td>
    <td>–</td>
    <td><span class="arithmatex">\((\tfrac{7}{2}, \tfrac{5}{2})\)</span></td>
    <td><span class="arithmatex">\(\tfrac{31}{2}\)</span></td>
    <td><span class="arithmatex">\(-\infty\)</span></td>
    <td>branching su <span class="arithmatex">\(x_2\)</span></td>
    </tr>
    <tr>
    <td>2</td>
    <td>1</td>
    <td>1</td>
    <td><span class="arithmatex">\(x_2 \le 2\)</span></td>
    <td><span class="arithmatex">\((\tfrac{37}{10}, 2)\)</span></td>
    <td><span class="arithmatex">\(\tfrac{151}{10}\)</span></td>
    <td><span class="arithmatex">\(-\infty\)</span></td>
    <td>branching su <span class="arithmatex">\(x_1\)</span></td>
    </tr>
    <tr>
    <td>3</td>
    <td>1</td>
    <td>1</td>
    <td><span class="arithmatex">\(x_2 \ge 3\)</span></td>
    <td><span class="arithmatex">\((\tfrac{7}{4}, 3)\)</span></td>
    <td><span class="arithmatex">\(\tfrac{45}{4}\)</span></td>
    <td><span class="arithmatex">\(13\)</span></td>
    <td>potato per bound (rimosso da <span class="arithmatex">\(L\)</span>)</td>
    </tr>
    <tr>
    <td>4</td>
    <td>2</td>
    <td>2</td>
    <td><span class="arithmatex">\(x_1 \le 3\)</span></td>
    <td><span class="arithmatex">\((3, 2)\)</span></td>
    <td><span class="arithmatex">\(13\)</span></td>
    <td><span class="arithmatex">\(13\)</span></td>
    <td>potato per integralità</td>
    </tr>
    <tr>
    <td>5</td>
    <td>2</td>
    <td>2</td>
    <td><span class="arithmatex">\(x_1 \ge 4\)</span></td>
    <td><span class="arithmatex">\((4, \tfrac{5}{4})\)</span></td>
    <td><span class="arithmatex">\(\tfrac{29}{2}\)</span></td>
    <td><span class="arithmatex">\(13\)</span></td>
    <td>branching su <span class="arithmatex">\(x_2\)</span></td>
    </tr>
    <tr>
    <td>6</td>
    <td>5</td>
    <td>3</td>
    <td><span class="arithmatex">\(x_2 \le 1\)</span></td>
    <td><span class="arithmatex">\((\tfrac{41}{10}, 1)\)</span></td>
    <td><span class="arithmatex">\(\tfrac{143}{10}\)</span></td>
    <td><span class="arithmatex">\(13\)</span></td>
    <td>branching su <span class="arithmatex">\(x_1\)</span></td>
    </tr>
    <tr>
    <td>7</td>
    <td>5</td>
    <td>3</td>
    <td><span class="arithmatex">\(x_2 \ge 2\)</span></td>
    <td>–</td>
    <td>–</td>
    <td><span class="arithmatex">\(13\)</span></td>
    <td>potato per inammissibilità</td>
    </tr>
    <tr>
    <td>8</td>
    <td>6</td>
    <td>4</td>
    <td><span class="arithmatex">\(x_1 \le 4\)</span></td>
    <td><span class="arithmatex">\((4, 1)\)</span></td>
    <td><span class="arithmatex">\(14\)</span></td>
    <td><span class="arithmatex">\(14\)</span></td>
    <td>potato per integralità</td>
    </tr>
    </table></div>

    ![Figura 18](../img/07-bb/fig18.svg){ .fig .ovale loading=lazy  }

    <em>L'esecuzione B nel piano: vincoli di branching e soluzioni ottime dei nodi risolti.</em>

    - L'esecuzione A risolve $6$ problemi LP, l'esecuzione B ne risolve $8$. Entrambe certificano la stessa soluzione ottima $\tilde x_1 = 4, \tilde x_2 = 1$ di valore $14$, che è unica.

    - L'esecuzione B trova prima una soluzione incumbent di valore $13$, ma fare branching prima su $x_2$ porta, su questa istanza, a un albero più grande.

<a id="box-11-ex-bb-heur"></a>

!!! esempio "Esempio 7.7: inizializzazione euristica"

    Eseguiamo l'algoritmo B&amp;B dell'<span style="color:#1971c2">[Esempio 7.5](#box-9-ex-bb-runA)</span> (indice minimo, LIFO), partendo da una soluzione euristica dell'esempio dell'auto.

    - L'euristica a una variabile del capitolo «Bound primali e duali» fissa $x_1$ al valore più grande possibile e $x_2 = 0$: dà $\bar{\vet x} = (4, 0)$ di valore $12$. Avviando l'esecuzione A con $\LB = 12$, l'algoritmo risolve $6$ problemi LP, tanti quanti senza l'euristica: questo lower bound è troppo debole per potare prima qualche nodo.

    - L'euristica che fissa prima $x_1$ e poi $x_2$ al valore più grande possibile dà $\bar{\vet x} = (4, 1)$ di valore $14$. Partendo da $\LB = 14$, la radice non è potata, perché $\lfloor z(\LP_1) \rfloor = 15 > 14$, ma entrambi i figli sono potati per bound e l'algoritmo si ferma dopo $3$ problemi LP:

    <div class="tabella" markdown="0"><table>
    <tr>
    <th>Nodo</th>
    <th>Padre</th>
    <th>It.</th>
    <th>Branching</th>
    <th><span class="arithmatex">\(\tilde{\vet x}(\LP_k)\)</span></th>
    <th><span class="arithmatex">\(z(\LP_k)\)</span></th>
    <th><span class="arithmatex">\(\LB\)</span></th>
    <th>Esito</th>
    </tr>
    <tr>
    <td>1</td>
    <td>–</td>
    <td>0</td>
    <td>–</td>
    <td><span class="arithmatex">\((\tfrac{7}{2}, \tfrac{5}{2})\)</span></td>
    <td><span class="arithmatex">\(\tfrac{31}{2}\)</span></td>
    <td><span class="arithmatex">\(14\)</span></td>
    <td>branching su <span class="arithmatex">\(x_1\)</span></td>
    </tr>
    <tr>
    <td>2</td>
    <td>1</td>
    <td>1</td>
    <td><span class="arithmatex">\(x_1 \le 3\)</span></td>
    <td><span class="arithmatex">\((3, \tfrac{37}{14})\)</span></td>
    <td><span class="arithmatex">\(\tfrac{100}{7}\)</span></td>
    <td><span class="arithmatex">\(14\)</span></td>
    <td>potato per bound</td>
    </tr>
    <tr>
    <td>3</td>
    <td>1</td>
    <td>1</td>
    <td><span class="arithmatex">\(x_1 \ge 4\)</span></td>
    <td><span class="arithmatex">\((4, \tfrac{5}{4})\)</span></td>
    <td><span class="arithmatex">\(\tfrac{29}{2}\)</span></td>
    <td><span class="arithmatex">\(14\)</span></td>
    <td>potato per bound</td>
    </tr>
    </table></div>

    La soluzione incumbent data dall'euristica è ottima, e l'algoritmo branch-and-bound ne <strong>certifica</strong> l'ottimalità.

## 7.8 Errori tipici

!!! attenzione "Attenzione"

    - <strong>Arrotondare la soluzione LP.</strong> Arrotondare una soluzione ottima del rilassamento lineare dà al più una soluzione ammissibile, in generale non ottima. Nell'esempio dell'auto, arrotondando per difetto $\tilde{\vet x}(\LP) = (\tfrac{7}{2}, \tfrac{5}{2})$ si ottiene $(3, 2)$ di valore $13$, mentre $z(\ILP) = 14$ in $(4, 1)$.

    - <strong>Fare branching sulla variabile sbagliata.</strong> La variabile di branching deve essere una variabile intera con valore frazionario: una variabile con valore intero non esclude $\tilde{\vet x}(\LP_k)$.

    - <strong>Prendere l'upper bound dall'ultimo nodo.</strong> L'upper bound è il massimo dei bound dei nodi della lista $L$, non il bound dell'ultimo nodo risolto.

    - <strong>Potare per bound solo con la disuguaglianza stretta.</strong> Un nodo con $\mathrm{UB}(\LP_k) = \LB$ è potato: la sua regione può contenere soluzioni buone quanto quella incumbent, ma non migliori.

    - <strong>Numerare i figli saltati.</strong> Un figlio che non viene risolto non riceve un indice di nodo.

    - <strong>Risolvere ogni nodo da zero.</strong> La risposta è corretta, ma molto più lenta: ogni figlio parte dal dizionario ottimo del padre, che è duale ammissibile.

## 7.9 Estensioni

- I problemi LP dei nodi si possono risolvere anche con l'<strong>algoritmo del simplesso con variabili limitate</strong>, che tratta i vincoli di branching come limiti sulle variabili invece che come nuovi vincoli.

- In un problema <strong>misto</strong>, dove solo alcune variabili sono intere, si fa branching solo sulle variabili intere e il bound di un nodo è $z(\LP_k)$, senza arrotondamento.

## 7.10 In sintesi

!!! chiave "In sintesi"

    - Un algoritmo B&amp;B divide la regione ammissibile con vincoli di branching su variabili intere con valori frazionari, e non perde mai una soluzione ammissibile.

    - Ogni nodo è potato per inammissibilità, per integralità o per bound, oppure attende nella lista; il bound di un nodo è $\lfloor z(\LP_k) \rfloor$ solo se tutte le variabili e tutti i costi sono interi.

    - Il lower bound viene dalla soluzione incumbent, l'upper bound dai nodi della lista; quando la lista è vuota coincidono, e la soluzione incumbent è certificata ottima.

    - Ogni figlio è riottimizzato con l'algoritmo del simplesso duale a partire dal dizionario del padre.

    - Le strategie di selezione e una buona soluzione euristica cambiano la dimensione dell'albero, non il valore ottimo.

    <strong>Cruscotto dell'esempio dell'auto.</strong> I lower bound e gli upper bound su $z(\ILP)$ trovati finora in questo modulo:

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
    <tr>
    <td>Algoritmo dei piani di taglio</td>
    <td><span class="arithmatex">\(14\)</span></td>
    <td><span class="arithmatex">\(14\)</span></td>
    <td><span class="arithmatex">\(5\)</span> tagli frazionari di Gomory</td>
    </tr>
    <tr>
    <td>Questo capitolo, esecuzione A</td>
    <td><span class="arithmatex">\(14\)</span></td>
    <td><span class="arithmatex">\(14\)</span></td>
    <td><span class="arithmatex">\(6\)</span> problemi LP risolti</td>
    </tr>
    <tr>
    <td>Questo capitolo, esecuzione B</td>
    <td><span class="arithmatex">\(14\)</span></td>
    <td><span class="arithmatex">\(14\)</span></td>
    <td><span class="arithmatex">\(8\)</span> problemi LP risolti</td>
    </tr>
    <tr>
    <td>Questo capitolo, con <span class="arithmatex">\(\LB = 14\)</span></td>
    <td><span class="arithmatex">\(14\)</span></td>
    <td><span class="arithmatex">\(14\)</span></td>
    <td><span class="arithmatex">\(3\)</span> problemi LP risolti</td>
    </tr>
    </table></div>

    Nell'esempio dell'auto l'algoritmo chiude il gap tra $\LB = 13$ (soluzione LP arrotondata) e $\UB = 15$ (rilassamento lineare) risolvendo $6$ problemi LP.

---

**Esercizi su questo capitolo:** [:material-pencil: Branch-and-bound](../esercizi/bb.md)

<!-- laboratorio-interattivo: sezione generata da interattivi.py -->

## Laboratorio interattivo { #laboratorio-interattivo }

Le idee del capitolo, da toccare con mano: muovi i cursori e trascina i punti.
Ogni app si apre anche a tutta pagina nel [laboratorio interattivo](../laboratorio/index.md): [Branch-and-bound passo per passo](../laboratorio/branch-and-bound-passi.md).

<div class="gi" data-grafico="pli-bb"></div>
