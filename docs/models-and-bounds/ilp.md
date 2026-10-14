---
title: "Programmazione lineare intera"
---

# Programmazione lineare intera

<div class="info-capitolo" markdown>

**Parte 1 · Modelli e limiti · Capitolo 1** · [:material-file-pdf-box: Appunti del corso, volume 1 (PDF)](../pdf/lecture-notes-1-models-bounds-formulations.pdf) · [:material-pencil: Esercizi: Programmazione lineare intera](../exercises/ilp.md)

</div>

!!! nota "Prerequisiti"
    - Dal modulo <em>Programmazione Lineare</em>: [Capitolo 2 «Semispazi e poliedri»](https://fabiofurini.github.io/programmazione-lineare/problemi-pl/02-poliedri/) e [Capitolo 4 «Problemi di Programmazione Lineare»](https://fabiofurini.github.io/programmazione-lineare/problemi-pl/04-problemi-pl/) (la forma canonica di massimizzazione, la regione ammissibile, le soluzioni ottimali e il valore ottimale), e [Capitolo 5 «Possibili risultati e formulazioni equivalenti»](https://fabiofurini.github.io/programmazione-lineare/problemi-pl/05-esiti-equivalenze/) (problemi insoddisfacibili, illimitati e ottimali).

!!! chiave "Obiettivi"
    Alla fine di questo capitolo sarai in grado di:

    - scrivi un problema ILP nella forma canonica di massimizzazione e distingui tra problemi ILP, BIP e MIP;

    - disegna la regione ammissibile di un piccolo problema ILP e trova una soluzione ottimale graficamente;

    - spiega perché la regione ammissibile non è convessa e quali sono i tre risultati di un problema ILP;

    - spiega perché la enumerazione completa fallisce e quanto costa;

    - spiega perché sono necessari limiti sul valore ottimale per evitare l'enumerazione.

## 1.1 Forma canonica di massimizzazione

<a id="box-1-defILPCanonical"></a>

!!! definizione "Definizione 1.1: Problemi di Programmazione Lineare Intera nella forma canonica di massimizzazione"
    Dato:

    1. un vettore di funzione obiettivo $\vet c \in \Z^{n}$

    2. una matrice di vincoli $\mat A \in \Z^{m \times n}$

    3. un vettore a destra (RHS) $\vet b \in \Z^{m}$ con righe $m$

        $$
        \underbrace{
        \begin{pmatrix}
        c_{1} \\
        c_{2} \\
        \vdots \\
        c_{n} \\
        \end{pmatrix}
        }_{\vet c} \in \Z^{n}
        \qquad \qquad
        \underbrace{
        \begin{pmatrix}
        a_{11} & a_{12} & \dots & a_{1n}\\
        a_{21} & a_{22} & \dots & a_{2n}\\
        \vdots & \vdots & \ddots & \vdots \\
        a_{m1} & a_{m2} & \dots & a_{mn}\\
        \end{pmatrix}
        }_{\mat A} \in \Z^{m \times n}
        \qquad \qquad
        \underbrace{
        \begin{pmatrix}
        b_{1} \\
        b_{2} \\
        \vdots \\
        b_{m} \\
        \end{pmatrix}
        }_{\vet b} \in \Z^{m}
        $$

    un <strong>problema di Programmazione Lineare Intera</strong> (ILP) in <strong>forma canonica di massimizzazione</strong> con $n$ <u>variabili intere non negative</u>

    $$
    \underbrace{
    \begin{pmatrix}
    x_{1} \\
    x_{2} \\
    \vdots \\
    x_{n} \\
    \end{pmatrix}
    }_{\vet x} \in \Z^{n}_{\ge 0}
    $$

    e $m$ <u>vincoli lineari minore o uguale a</u> è il seguente problema di ottimizzazione:

    <a id="eq-ILP"></a>

    \begin{align*}
    \label{ObjFunc}  &&   \max \;\; \underbrace{\sum_{j =1}^n c_j \, x_j}_{\vet c\T \vet x}  \qquad \qquad \qquad \qquad \qquad \qquad  \tag{1.1a}\\[1ex]
    \label{Cons}     && \text{soggetto a} \quad \underbrace{\sum_{j =1}^n a_{ij} \, x_j  \le b_i, \qquad   \forall i \in \{1,2,\dots,m\}}_{\mat A\,\vet x  \le \vet b},  \tag{1.1b}\\[1ex]
    \label{integrality}&& \underbrace{x_j \in \Z_{\ge 0}, \qquad \forall j \in \{1,2,\dots,n\}}_{\vet x \in \Z^n_{\ge 0}}. \tag{1.1c}
    \end{align*}

- I dati $\vet c$, $\mat A$ e $\vet b$ sono <strong>interi</strong>, come in tutto il modulo.

- Con un leggero abuso di notazione, scriviamo il problema ILP [(1.1)](#eq-ILP) in forma compatta come

    $$
    \max \big\{\, \vet c\T \vet x ~:~ \mat A\,\vet x \le \vet b,~ \vet x \in \Z^n_{\ge 0} \,\big\}.
    $$

- L'insieme $\Z^n$ dei punti di $\R^n$ con componenti intere è chiamato <strong>reticolo intero</strong>.

!!! chiave ""
    Un problema ILP [(1.1)](#eq-ILP) è un problema LP in forma canonica di massimizzazione con il requisito aggiuntivo $\vet x \in \Z^n$: la funzione lineare $\vet c\T \vet x$ è massimizzata sui punti del <strong>reticolo intero</strong> che soddisfano i vincoli.

- Se tutte le variabili sono limitate a $\{0,1\}$, il problema è un <strong>problema di programmazione lineare intera binaria</strong> (BIP). Se solo alcune delle variabili sono intere, il problema è un <strong>problema di programmazione lineare intera mista</strong> (MIP).

- I vincoli $\ge$ e $=$, e i problemi di minimizzazione, sono portati alla forma canonica di massimizzazione come nella programmazione lineare.

<a id="box-2-exILPCanonical"></a>

!!! esempio "Esempio 1.1: Problema ILP in forma canonica di massimizzazione"
    Considerare i seguenti dati di input di un problema ILP con $n=2$ e $m=2$:

    $$
    \vet c=
    \begin{pmatrix}
    3 \\[1ex]
    2\\
    \end{pmatrix}
    \qquad
    \mat A=
    \begin{pmatrix}
    10 & 4 \\[1ex]
    4 & 14 \\
    \end{pmatrix}
    \qquad
    \vet b=
    \begin{pmatrix}
    45 \\[1ex]
    49\\
    \end{pmatrix}
    $$

    Le voci numeriche dei due vettori colonna e della matrice sono

    $$
    c_1=3,~c_2=2,~a_{11}=10,~a_{12}=4,~a_{21}=4,~a_{22}=14,~b_1=45,~b_2=49.
    $$

    Il problema ILP associato nella forma canonica di massimizzazione con $n=2$ variabili intere non negative e $m=2$ vincoli lineari di tipo minore o uguale si esprime come segue:

    $$
    \begin{array}{rrrrrrr}
    {\max} & {3}\, {x_1} & {+} & {2}\, {x_2} \\[1ex]
    \text{soggetto a} & {10}\, {x_1} & {+} & {4}\, {x_2} & {\le} & {45} \\[1ex]
    & {4}\, {x_1} & {+} & {14}\, {x_2} & {\le} & {49} \\[1ex]
    & {x_1,} &  & {x_2} & {\in} & {\Z_{\ge 0}}
    \end{array}
    $$

    Le variabili $x_1$ e $x_2$ possono essere lette come il numero di auto di due tipi da produrre: questo problema ILP è il <strong>esempio delle auto</strong>, l'esempio guida del modulo.

### 1.1.1 Regione ammissibile e funzione obiettivo

<a id="box-3-defFeasRegILP"></a>

!!! definizione "Definizione 1.2: regione ammissibile e funzione obiettivo"
    - La <strong>regione ammissibile</strong> di un problema ILP [(1.1)](#eq-ILP) è l'insieme $F$ definito come segue:

        \begin{equation*}
        \label{FeasibleRegion}
        \begin{split}
        F = \left\{~
        \underbrace{
        \begin{pmatrix}
        x_{1} \\
        x_{2} \\
        \vdots \\
        x_{n} \\
        \end{pmatrix}}_{\vet x}  \in \Z^n : \right.
        ~~ & \underbrace{\sum_{j=1}^n a_{ij} \, x_j \le b_i,~~\forall i \in \{1,2,\dots,m\}}_{\mat A\,\vet x \le \vet b}, \\[1ex]
        &\left. \vphantom{\begin{pmatrix} x_{1} \\ x_{2} \\ \vdots \\ x_{n} \end{pmatrix}}
        \underbrace{x_j \ge 0,~~\forall j \in \{1,2,\dots,n\}}_{\vet x \ge \vet 0}
        ~\right\}.
        \end{split} \tag{1.2}
        \fine{equazione*}

    - La <strong>funzione obiettivo</strong> $\eqref{ObjFunc}$ di un problema ILP [(1.1)](#eq-ILP) da massimizzare è la <strong>funzione lineare</strong> (scalare) $f$ definita come segue:

        \begin{equation*}
        \label{ObjectiveFunction}
        f: \Z^{n} \rightarrow \R,
        \qquad
        f :
        \underbrace{\begin{pmatrix}
        x_1 \\
        x_2 \\
        \vdots \\
        x_n
        \end{pmatrix}}_{\vet x}
        \mapsto
        \underbrace{\sum_{j=1}^n c_j x_j}_{\vet c\T \vet x} \tag{1.3}
        \fine{equazione*}

- Sia $P = \{\, \vet x \in \R^n : \mat A\,\vet x \le \vet b,~ \vet x \ge \vet 0 \,\}$ il poliedro dei vincoli, cioè la regione ammissibile del problema di PL con gli stessi dati. La regione ammissibile del problema di PLI è

    $$
    F = P \cap \Z^n.
    $$

- Il set $F$ è composto da punti isolati del reticolo, quindi non è <strong>convesso</strong>.

<a id="box-4-exFeasRegILP"></a>

!!! esempio "Esempio 1.2: regione realizzabile"
    Considera il problema ILP di <span style="color:#1971c2">[Esempio 1.1](#box-2-exILPCanonical)</span>. La regione ammissibile $F$ è l'insieme dei punti neri $16$ della figura seguente, i punti della griglia $\Z^2$ nel politopo $P$ (rosso).

    ![Figura 1](../img/01-ilp/fig01.svg){ .fig .ovale loading=lazy  }

    <em>L'esempio dell'auto: la regione fattibile del problema ILP è l'insieme dei suoi punti interi $16$ (neri) all'interno del politopoedro (rosso). La soluzione ottimale $(4,1)$ è blu, con la linea obiettivo $3\,x_1 + 2\,x_2 = 14$ (tratteggiata).</em>

    Il punto $\bar{\vet x} = (2,2)$ appartiene a $F$, perché $10 \cdot 2 + 4 \cdot 2 = 28 \le 45$ e $4 \cdot 2 + 14 \cdot 2 = 36 \le 49$. Il punto $(4,2)$ non appartiene a $F$, perché $10 \cdot 4 + 4 \cdot 2 = 48 > 45$. Il punto $(\frac{7}{2},\frac{5}{2})$ appartiene a $P$ ma non a $F$, perché non è intero.

### 1.1.2 Soluzione ottimale e valore ottimale

<a id="box-5-defOptILP"></a>

!!! definizione "Definizione 1.3: soluzione ottimale e valore ottimale"
    - Un punto $\tilde{\vet x}(\ILP) \in F$ è una <strong>soluzione ottimale</strong> del problema ILP [(1.1)](#eq-ILP) se

        $$
        \tilde{\vet x}(\ILP) \in \argmax \big\{\, \vet c\T \vet x ~:~ \vet x \in F \,\big\}.
        $$

    - Il valore

        $$
        z(\ILP) = \underbrace{\max \big\{\, \vet c\T \vet x ~:~ \vet x \in F \,\big\}}_{=\vet c\T \tilde{\vet x}(\ILP)}
        $$

        è il <strong>valore ottimale</strong> del problema ILP [(1.1)](#eq-ILP).

- Un punto $\bar{\vet x} \in F$ è una <strong>soluzione ammissibile</strong> del problema ILP. Una soluzione ottimale è una soluzione ammissibile con il valore più alto della funzione obiettivo.

!!! chiave ""
    L'obiettivo di un problema ILP [(1.1)](#eq-ILP) è <strong>trovare una soluzione ottimale</strong> $\tilde{\vet x}(\ILP)$, ogniqualvolta essa esista, piuttosto che determinare semplicemente il valore ottimale $z(\ILP)$.

### 1.1.3 Metodo di soluzione grafica

!!! chiave ""
    Una soluzione ottimale di un problema ILP [(1.1)](#eq-ILP) con due variabili può essere determinata graficamente spostando la linea di livello della funzione obiettivo nella direzione del suo gradiente, fino a raggiungere l'ultimo punto della griglia nel politopo $P$.

<a id="box-6-exGraphicalILP"></a>

!!! esempio "Esempio 1.3: Metodo di soluzione grafica"
    Considera il problema ILP di <span style="color:#1971c2">[Esempio 1.1](#box-2-exILPCanonical)</span>. Il gradiente della funzione obiettivo è $\nabla f = (3,2)$. Muovendo la linea di livello $3\,x_1 + 2\,x_2 = z$ nella direzione di $\nabla f$, l'ultimo punto di $F$ raggiunto è $(4,1)$, sulla linea tratteggiata $3\,x_1 + 2\,x_2 = 14$ della figura di <span style="color:#1971c2">[Esempio 1.2](#box-4-exFeasRegILP)</span>. Nessun altro punto di $F$ giace su questa linea.

    L'esempio dell'auto ha la <strong>unica</strong> soluzione ottimale $\tilde{\vet x}(\ILP) = (4,1)$, con valore ottimale $z(\ILP) = 14$.

## 1.2 Possibili risultati

- Come nella programmazione lineare, un problema ILP ha esattamente uno dei tre <strong>risultati</strong>: è <strong>inattuabile</strong> ($F = \emptyset$), <strong>illimitato</strong> (la funzione obiettivo non è limitata superiormente su $F$) o ha una <strong>soluzione ottimale</strong>.

- Se il poliedro $P$ è limitato, allora $F$ è un <strong>insieme finito</strong>, e una soluzione ottimale esiste non appena $F \neq \emptyset$.

<a id="box-7-exInfeasILP"></a>

!!! esempio "Esempio 1.4: un problema ILP non fattibile con un problema LP fattibile"
    Il problema ILP

    $$
    \max \big\{\, x_1 ~:~ 2\,x_1 \le 1,~ -2\,x_1 \le -1,~ x_1 \in \Z_{\ge 0} \,\big\}
    $$

    è irrealizzabile, perché i vincoli richiedono $x_1 = \frac{1}{2}$. Il problema LP con gli stessi dati è realizzabile, con l'unica soluzione realizzabile $x_1 = \frac{1}{2}$.

<a id="box-8-exUnbILP"></a>

!!! esempio "Esempio 1.5: un problema ILP illimitato"
    Il problema ILP

    $$
    \max \big\{\, x_1 + x_2 ~:~ x_1 - x_2 \le 1,~ x_1, x_2 \in \Z_{\ge 0} \,\big\}
    $$

    è illimitato: i punti $(k,k)$, $k \in \Z_{\ge 0}$, sono fattibili, con valore $2k$.

## 1.3 Enumerazione completa

- Quando la regione fattibile è un insieme finito, possiamo trovare una soluzione ottimale mediante <strong>enumerazione completa</strong>: calcoliamo la funzione obiettivo per ogni soluzione fattibile e conserviamo la migliore. Per l'esempio dell'auto, ci sono $16$ punti:

$$
\begin{array}{ccc|ccc}
\hline {x_1} & {x_2} & {z} & {x_1} & {x_2} & {z} \\
\hline {0} & {0} & {0} & {3} & {1} & {11} \\
{1} & {0} & {3} & {\mathbf{4}} & {\mathbf{1}} & {\mathbf{14}} \\
{2} & {0} & {6} & {0} & {2} & {4} \\
{3} & {0} & {9} & {1} & {2} & {7} \\
{4} & {0} & {12} & {2} & {2} & {10} \\
{0} & {1} & {2} & {3} & {2} & {13} \\
{1} & {1} & {5} & {0} & {3} & {6} \\
{2} & {1} & {8} & {1} & {3} & {9} \\
\hline
\end{array}
$$

- Il valore migliore è $14$, in $(4,1)$ (in grassetto). Qui il metodo funziona, perché il modello è piccolo.

- Considera ora il caso più semplice, variabili binarie $n$ e nessun altro vincolo. Ogni variabile prende $2$ valori, quindi ci sono $2^n$ soluzioni: i vertici di un ipercubo $n$-dimensionale.

![Figura 2](../img/01-ilp/fig02.svg){ .fig .ovale loading=lazy  }

<em>Le soluzioni delle variabili binarie $n$ senza altri vincoli: i vertici $2^n$ di un ipercubo $n$-dimensionale, per $n=2$ (un quadrato) e $n=3$ (un cubo).</em>

- Il numero $2^n$ esplode. Con $n = 80$ variabili ci sono circa $1.2 \cdot 10^{24}$ soluzioni, comparabili al numero stimato di stelle nell'universo, e con $n = 266$ variabili circa $1.2 \cdot 10^{80}$, comparabili al numero stimato di atomi nell'universo osservabile.

- Supponiamo che un computer esamini $10^{9}$ soluzioni al secondo, e poi un computer $1000$ volte più veloce, $10^{12}$ soluzioni al secondo. Il tempo necessario per enumerare $2^n$ soluzioni è:

<div class="tabella" markdown="0"><table>
<tr>
<th><span class="arithmatex">\(n\)</span></th>
<th><span class="arithmatex">\(2^n\)</span></th>
<th>a <span class="arithmatex">\(10^{9}\)</span> soluzioni/s</th>
<th>a <span class="arithmatex">\(10^{12}\)</span> soluzioni/s</th>
</tr>
<tr>
<td>20</td>
<td><span class="arithmatex">\(\approx 1.05 \cdot 10^{6}\)</span></td>
<td><span class="arithmatex">\(\approx 1.05\,\mathrm{ms}\)</span></td>
<td><span class="arithmatex">\(\approx 1,05\,\mu\mathrm{s}\)</span></td>
</tr>
<tr>
<td>30</td>
<td><span class="arithmatex">\(\approx 1.07 \cdot 10^{9}\)</span></td>
<td><span class="arithmatex">\(\approx 1.07\,\mathrm{s}\)</span></td>
<td><span class="arithmatex">\(\approx 1.07\,\mathrm{ms}\)</span></td>
</tr>
<tr>
<td>40</td>
<td><span class="arithmatex">\(\approx 1.10 \cdot 10^{12}\)</span></td>
<td><span class="arithmatex">\(\approx 18.3\,\mathrm{min}\)</span></td>
<td><span class="arithmatex">\(\approx 1.10\,\mathrm{s}\)</span></td>
</tr>
<tr>
<td>50</td>
<td><span class="arithmatex">\(\approx 1.13 \cdot 10^{15}\)</span></td>
<td><span class="arithmatex">\(\approx 13,0\,\mathrm{giorni}\)</span></td>
<td><span class="arithmatex">\(\approx 18.8\,\mathrm{min}\)</span></td>
</tr>
<tr>
<td>60</td>
<td><span class="arithmatex">\(\approx 1.15 \cdot 10^{18}\)</span></td>
<td><span class="arithmatex">\(\approx 36,5\,\mathrm{anni}\)</span></td>
<td><span class="arithmatex">\(\approx 13,3\,\mathrm{giorni}\)</span></td>
</tr>
<tr>
<td>70</td>
<td><span class="arithmatex">\(\approx 1.18 \cdot 10^{21}\)</span></td>
<td><span class="arithmatex">\(\approx 374\,\mathrm{centuries}\)</span></td>
<td><span class="arithmatex">\(\approx 37.4\,\mathrm{years}\)</span></td>
</tr>
<tr>
<td>80</td>
<td><span class="arithmatex">\(\approx 1.21 \cdot 10^{24}\)</span></td>
<td><span class="arithmatex">\(\approx 3,8 \cdot 10^{5}\,\mathrm{secoli}\)</span></td>
<td><span class="arithmatex">\(\approx 383\,\mathrm{centuries}\)</span></td>
</tr>
</table></div>

!!! chiave ""
    La enumerazione completa è già impraticabile per modelli di dimensioni moderate. Un computer $1000$ volte più veloce guadagna solo circa $10$ variabili, perché $2^{10} = 1024 \approx 1000$.

- La via d'uscita è <strong>evitare di elencare</strong>. Se conosciamo un limite inferiore e un limite superiore sul valore ottimale, possiamo escludere intere regioni di soluzioni fattibili senza visitarle. I due limiti provengono da due fonti diverse, le soluzioni fattibili e le rilassazioni: sono l'argomento del capitolo successivo, «Limiti primali e duali».

## 1.4 Errori tipici

!!! attenzione "Avviso"
    - <strong>Credere che la regione fattibile sia convessa.</strong> È l'insieme dei punti interi di un politopo, non il politopo stesso. Il punto medio di due soluzioni fattibili può essere non fattibile.

    - <strong>Credere che la regione ammissibile sia sempre finita.</strong> Essa è finita solo se il politopo è limitato; altrimenti il problema ILP può essere illimitato.

    - <strong>Credere che un problema di LP fattibile dia un problema di ILP fattibile.</strong> Il problema di LP può avere soluzioni mentre nessun punto intero soddisfa i vincoli.

    - <strong>Considerare una buona soluzione fattibile come ottimale.</strong> Senza un vincolo dall'altra parte (capitolo successivo) non c'è alcuna certificazione di ottimalità.

## 1.5 In sintesi

!!! chiave "In sintesi"
    - Un problema ILP massimizza una funzione lineare sui punti interi di un politopo; la sua regione ammissibile non è convessa e è finita quando il politopo è limitato.

    - I risultati sono non fattibili, illimitati o ottimali, e un problema LP fattibile può avere una versione ILP non fattibile.

    - La enumerazione completa costa $2^n$ valutazioni per $n$ variabili binarie: non è un'opzione al di là di modelli molto piccoli.

    - Per evitare l'enumerazione abbiamo bisogno di limiti su $z(\ILP)$ da entrambi i lati: soluzioni fattibili e rilassamenti, l'argomento del prossimo capitolo.

    <strong>Cruscotto dell'esempio dell'auto.</strong> Ancora nessun limite: il capitolo successivo fornisce i primi limiti inferiori e superiori.

---

**Esercizi su questo capitolo:** [:material-pencil: Programmazione lineare intera](../exercises/ilp.md)
