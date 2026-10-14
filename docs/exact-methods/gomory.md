---
title: "Algoritmo dei piani di taglio con tagli frazionari di Gomory"
---

# Algoritmo dei piani di taglio con tagli frazionari di Gomory

<div class="info-capitolo" markdown>

**Parte 3 · Metodi esatti · Capitolo 6** · [:material-file-pdf-box: Appunti delle lezioni, volume 2 (PDF)](../pdf/lecture-notes-2-exact-methods.pdf) · [:material-pencil: Esercizi: Piani di taglio](../exercises/gomory.md) · [:material-gesture-tap: App: Tagli di Gomory sul piano](../lab/gomory-cuts.md)

</div>

!!! nota "Prerequisiti"
    - Dal modulo <em>Programmazione Lineare</em>, [Capitolo 10 «Algoritmo del Simplesso Duale»](https://fabiofurini.github.io/programmazione-lineare/dualita/10-simplesso-duale/): dizionari del simplesso, basi duali ammissibili e operazioni di pivoting duali. Un breve riepilogo è fornito in questo capitolo.

    - Da questo modulo, i capitoli «Programmazione lineare intera» e «Vincoli primali e duali»: problemi ILP, il rilassamento LP e il limite superiore dato dal rilassamento LP.

    - Da questo modulo, il capitolo «Disuguaglianze valide»: disuguaglianze valide e tagli che rimuovono punti frazionari.

!!! chiave "Obiettivi"
    Alla fine di questo capitolo sarai in grado di:

    - generare un taglio frazionario di Gomory da una riga di un dizionario del simplesso, e dimostrare che è valido e che esclude la soluzione di base corrente;

    - inserire un taglio nel dizionario e riottimizzare con l'algoritmo del simplesso duale;

    - eseguire manualmente un algoritmo del piano di taglio, con la strategia di selezione del lato destro più grande e le sue regole di risoluzione dei pareggi;

    - calcola il limite superiore a ogni iterazione e spiega perché l'algoritmo potrebbe aver bisogno di molti tagli;

    - spiega perché questi tagli sono validi solo per problemi ILP con dati interi.

## 6.1 Tagli frazionari di Gomory

<a id="box-1-def-cutting-plane"></a>

!!! definizione "Definizione 6.1: piano di taglio"
    Dato un problema ILP e una soluzione ottimale frazionaria $\tilde{\vet x}(\LP)$ del suo rilassamento LP, un <strong>piano di taglio</strong> (o <strong>taglio</strong>) è una disuguaglianza valida per il problema ILP che elimina $\tilde{\vet x}(\LP)$.

!!! chiave ""
    I tagli frazionari di Gomory sono disuguaglianze valide che eliminano soluzioni di base frazionarie del rilassamento LP di un problema ILP senza escludere alcuna soluzione intera ammissibile.

- <strong>Consideriamo i problemi di ILP nella forma canonica di massimizzazione con dati di input interi</strong>. Per questi problemi, le variabili di scarto introdotte nelil rilassamento LP in forma standard assumono anche valori interi in ogni soluzione intera ammissibile del problema di ILP.

- I tagli frazionari di Gomory sono validi <u>solo</u> se tutte le variabili, comprese le variabili di scarto, sono intere. Per i problemi MIP con variabili continue possono escludere soluzioni ammissibili, ed è necessaria una famiglia diversa di tagli.

- Ricordiamo che un dizionario del simplesso del rilassamento LP in forma standard si presenta come segue

    $$
    \begin{cases}
    \displaystyle
    x_i=\bar b_i-\sum_{j\in\pazocal N}\bar a_{ij}x_j,
    \qquad \forall i\in\pazocal B,\\[4ex]
    \displaystyle
    z=\bar z+\sum_{j\in\pazocal N}\bar c_jx_j.
    \end{cases}
    $$

    dove $\pazocal{B}$ è l'insieme degli indici delle variabili di base e $\pazocal{N}$ è l'insieme degli indici delle variabili non di base. Se $\bar{b}_i \ge 0$ per ogni $i \in \pazocal{B}$, allora il dizionario è associato alla seguente soluzione di base ammissibile:

    $$
    x_i = \bar{b}_i, \quad \forall i \in \pazocal{B},
    \qquad
    x_j = 0, \quad \forall j \in \pazocal{N}.
    $$

    Se, inoltre, almeno un $\bar{b}_i$ è frazionario, allora questa soluzione ammissibile di base è frazionaria.

- I tagli frazionari di Gomory si ottengono dalle righe di un dizionario del simplesso associate a una soluzione di base frazionaria ammissibile della rilassata LP in forma standard di un problema ILP.

    <a id="box-2-defXX"></a>

    !!! definizione "Definizione 6.2: taglio frazionario di Gomory"
        Data una riga $i \in \pazocal{B}$ di un dizionario del simplesso associato a una soluzione di base ammissibile tale che $\bar{b}_i$ sia frazionaria, l'inequazione lineare

        \begin{equation*}
        \sum_{j \in \pazocal{N}}
        \left(
        \bar{a}_{ij}
        -
        \left\lfloor \bar{a}_{ij}\right\rfloor
        \right)x_j
        \ge
        \bar{b}_i - \left\lfloor \bar{b}_i \right\rfloor
        \label{GFC} \tag{6.1}
        \end{equation*}

        è chiamato il <strong>taglio frazionario di Gomory</strong> generato dalla riga $i$.

- Dimostreremo che qualsiasi taglio frazionario di Gomory non elimina alcuna soluzione intera fattibile del problema ILP e che elimina la soluzione di base fattibile frazionaria.

<a id="box-3-gfc-canonical-form"></a>

!!! esempio "Esempio 6.1: ILP in forma canonica, rilassamento LP in forma standard e dizionari"
    Considera il seguente problema ILP nella forma canonica di massimizzazione con $2$ variabili intere e $2$ vincoli lineari (chiamato <span style="color:#1971c2">Esempio 1</span>):

    $$
    \begin{array}{rrrrrrrrrrrrrr}
    {\max} & 2 \, {x_1} & {+} & 4 \, {x_2} \\[2ex]
    & {-} \, {x_1} & {+} & \, {x_2} & {\le} & {2} \\[2ex]
    & {8} \, {x_1} & {+} & {2} \, {x_2} & {\le} & {19} \\[2ex]
    & {x_1,} &  & {x_2} & { \in} & {\Z_{\ge 0} }
    \end{array}
    $$

    Il rilassamento LP in forma standard con variabili non negative $4$ (2 variabili di scarto) e vincoli lineari $2$ è la seguente:

    $$
    \begin{array}{rrrrrrrrrr}
    {\max} & 2 \, {x_1} & {+} & 4 \, {x_2} &  &  &  &  &  &  \\[2ex]
    & {-} \, {x_1} & {+} & \, {x_2} & {+} & {x_3} &  &  & {=} & {2} \\[2ex]
    & {8} \, {x_1} & {+} & {2} \, {x_2} &  &  & {+} & {x_4} & {=} & {19} \\[2ex]
    & {x_1,} &  & {x_2,} &  & {x_3,} &  & {x_4} & {\ge} & {0 }
    \end{array}
    $$

    Come esempio, consideriamo il seguente dizionario del simplesso associato a una soluzione frazionaria di base ammissibile del rilassamento LP in forma standard del problema ILP:

    \begin{equation*}
    \begin{cases}
    \begin{array}{rrrrrrrrrrrrr}
    {x_1=\frac{3}{2}} & {+} & {\frac{1}{5}} \, {x_3} & {-} & {\frac{1}{10}}\, {x_4} \\[2ex]
    {x_2=\frac{7}{2}} & {-} & {\frac{4}{5}}\, {x_3} & {-} & {\frac{1}{10}}\, {x_4} \\[2ex]
    {z= 17} & {-} & {\frac{14}{5}} \, {x_3} & {-} & {\frac{3}{5}} \, {x_4}
    \end{array}
    \end{casi}
    \quad
    dove
    \quad
    \bar{\mat A}=
    \begin{pmatrix}
    -\frac{1}{5} & \frac{1}{10} \\[2ex]
    \frac{4}{5} & \frac{1}{10} \\
    \end{pmatrix}
    \quad
    \bar{\vet b}=
    \begin{pmatrix}
    \frac{3}{2} \\[2ex]
    \frac{7}{2} \\
    \end{pmatrix}
    \fine{equazione*}

    e $\pazocal{B}=\{1,2\}$ e $\pazocal{N}=\{3,4\}$. La soluzione di base frazionaria associata è:

    $$
    \bar x_1=\dfrac{3}{2},~~
    \bar x_2=\dfrac{7}{2},~~~~
    \bar x_3=0,~~
    \bar x_4=0
    ~~~\text{of value   } \bar z = 17
    $$

<a id="box-4-texexpbox1"></a>

!!! esempio "Esempio 6.2: Tagli frazionari di Gomory"
    Consideriamo di nuovo il problema ILP di <span style="color:#1971c2">Esempio 1</span> nella forma canonica di massimizzazione con variabili intere $2$ e vincoli lineari $2$:

    $$
    \begin{array}{rrrrrrrrrrrrr}
    {\max} & 2 \, {x_1} & {+} & 4 \, {x_2} \\[2ex]
    & {-} \, {x_1} & {+} & \, {x_2} & {\le} & {2} \\[2ex]
    & {8} \, {x_1} & {+} & {2} \, {x_2} & {\le} & {19} \\[2ex]
    & {x_1,} &  & {x_2} & { \in} & {\Z_{\ge 0} }
    \end{array}
    $$

    e la sua rilassamento LP in forma canonica con $2$ variabili non negative e $2$ vincoli lineari:

    $$
    \begin{array}{rrrrrrrrrrrrr}
    {\max} & 2 \, {x_1} & {+} & 4 \, {x_2} \\[2ex]
    & {-} \, {x_1} & {+} & \, {x_2} & {\le} & {2} \\[2ex]
    & {8} \, {x_1} & {+} & {2} \, {x_2} & {\le} & {19} \\[2ex]
    & {x_1,} &  & {x_2} & { \ge} & {0}
    \end{array}
    $$

    ![Figura 1](../img/06-gomory/fig01.svg){ .fig .ovale loading=lazy style="width:44%" }

    Una soluzione ottimale $\tilde{\vet x}(\ILP)$ del problema ILP è

    $$
    \tilde{x}_1=1,~~\tilde{x}_2=3
    $$

    Il valore ottimale è $z(\ILP) = 14$. Una soluzione ottimale $\tilde{\vet x}(\LP)$ del rilassamento LP è

    $$
    \tilde{x}_1=\frac{3}{2},~~\tilde{x}_2=\frac{7}{2}
    $$

    Il valore ottimale è $z(\LP) = 17$.

    Consideriamo il seguente dizionario del simplesso associato a una soluzione frazionaria di base ammissibile del rilassamento LP in forma standard del problema ILP di <span style="color:#1971c2">Esempio 1</span>:

    \begin{equation*}
    \begin{cases}
    \begin{array}{rrrrrrrrrrrrr}
    {x_1=\frac{3}{2}} & {+} & {\frac{1}{5}} \, {x_3} & {-} & {\frac{1}{10}}\, {x_4} \\[2ex]
    {x_2=\frac{7}{2}} & {-} & {\frac{4}{5}}\, {x_3} & {-} & {\frac{1}{10}}\, {x_4} \\[2ex]
    {z= 17} & {-} & {\frac{14}{5}} \, {x_3} & {-} & {\frac{3}{5}} \, {x_4}
    \end{array}
    \end{casi}
    \quad
    dove
    \quad
    \bar{\mat A}=
    \begin{pmatrix}
    -\frac{1}{5} & \frac{1}{10} \\[2ex]
    \frac{4}{5} & \frac{1}{10} \\
    \end{pmatrix}
    \quad
    \bar{\vet b}=
    \begin{pmatrix}
    \frac{3}{2} \\[2ex]
    \frac{7}{2} \\
    \end{pmatrix}
    \fine{equazione*}

    - Il taglio frazionario di Gomory generato dalla prima riga è:

        \begin{align*}
        \underbrace{\left(-\frac{1}{5} - \left\lfloor -\frac{1}{5} \right\rfloor \right)}_{-\frac{1}{5}-(-1)=\frac{4}{5}} \; x_3 + \underbrace{\left(\frac{1}{10} - \left\lfloor \frac{1}{10} \right\rfloor \right)}_{\frac{1}{10}-0=\frac{1}{10}} \; x_4
        \ge \underbrace{\left(\frac{3}{2} - \left\lfloor \frac{3}{2} \right\rfloor \right)}_{\frac{3}{2} -1=\frac{1}{2}}
        \end{align*}

        \begin{align*}
        \frac{4}{5}\;x_3 + \frac{1}{10}\;x_4 \ge \frac{1}{2}
        \quad \Rightarrow \quad
        8\;x_3 + x_4 \ge 5
        \end{align*}

        Dalla forma standard del rilassamento LP, abbiamo:

        $$
        x_3= 2 + x_1 -x_2 \text{    and    }
        x_4= 19 - 8 \;x_1 - 2\;x_2
        $$

        Sostituendo nel taglio frazionario di Gomory, possiamo esprimerlo in termini delle variabili originali del problema ILP:

        $$
        8\; (2 + x_1 -x_2) + (19 - 8 \:x_1 - 2\:x_2) \ge 5
        \quad \Rightarrow \quad
        x_2 \le 3
        $$

    - Il taglio frazionario di Gomory generato dalla seconda riga è:

        \begin{align*}
        \underbrace{\left(\frac{4}{5} - \left\lfloor \frac{4}{5} \right\rfloor \right)}_{\frac{4}{5}-0=\frac{4}{5}} \; x_3 + \underbrace{\left(\frac{1}{10} - \left\lfloor \frac{1}{10} \right\rfloor \right)}_{\frac{1}{10}-0=\frac{1}{10}} \; x_4
        \ge \underbrace{\left(\frac{7}{2} - \left\lfloor \frac{7}{2} \right\rfloor \right)}_{\frac{7}{2} -3=\frac{1}{2}}
        \end{align*}

        \begin{align*}
        \frac{4}{5}\;x_3 + \frac{1}{10}\;x_4 \ge \frac{1}{2}
        \quad \Rightarrow \quad
        8\;x_3 + x_4 \ge 5
        \end{align*}

        Questo taglio frazionario di Gomory è lo stesso di quello generato dalla prima riga.

    Effetto del taglio frazionario di Gomory sulla regione ammissibile del rilassamento LP in forma canonica.

    ![Figura 2](../img/06-gomory/fig02.svg){ .fig .ovale loading=lazy style="width:59%" }

!!! chiave ""
    Un taglio frazionario di Gomory può anche essere generato dalla riga della funzione obiettivo del dizionario del simplesso.

- Considera la riga della funzione obiettivo di un dizionario del simplesso:

    $$
    z=\bar z+\sum_{j \in \pazocal{N}}\bar c_j x_j
    $$

    Questa riga può essere riscritta nella stessa forma delle altre righe del dizionario:

    $$
    z=\bar z-\sum_{j \in \pazocal{N}}(-\bar c_j)x_j
    $$

    Il taglio frazionario di Gomory generato dalla riga della funzione obiettivo è

    \begin{equation*}
    \sum_{j \in \pazocal{N}}
    \left(
    -\bar c_j
    -
    \left\lfloor -\bar c_j \right\rfloor
    \right)x_j
    \ge
    \bar z - \left\lfloor \bar z \right\rfloor
    \label{GFC_OBJ} \tag{6.2}
    \end{equation*}

<a id="box-5-texexpbox1"></a>

!!! esempio "Esempio 6.3: Tagli frazionari di Gomory"
    Consideriamo il seguente dizionario del simplesso associato a una soluzione frazionaria di base ammissibile del rilassamento LP in forma standard del problema ILP di <span style="color:#1971c2">Esempio 1</span>:

    \begin{equation*}
    \begin{cases}
    \begin{array}{rrrrrrrrrrrrr}
    {x_1=\dfrac{19}{8}} & {-} & {\dfrac{1}{4}} \, {x_2} & {-} & {\dfrac{1}{8}}\, {x_4} \\[2ex]
    {x_3=\dfrac{35}{8}} & {-} & {\dfrac{5}{4}}\, {x_2} & {-} & {\dfrac{1}{8}}\, {x_4} \\[2ex]
    {z =\dfrac{19}{4}} & {+} & {\dfrac{7}{2}} \, {x_2} & {-} & {\dfrac{1}{4}} \, {x_4}
    \end{array}
    \end{casi}
    \quad
    dove
    \quad
    \bar{\mat A}=
    \begin{pmatrix}
    \frac{1}{4} & \frac{1}{8} \\[2ex]
    \frac{5}{4} & \frac{1}{8} \\
    \end{pmatrix}
    \quad
    \bar{\vet b}=
    \begin{pmatrix}
    \frac{19}{8} \\[2ex]
    \frac{35}{8} \\
    \end{pmatrix}
    \end{equation*}

    - Questo dizionario non è ottimale ($\bar c_2 = \frac{7}{2} > 0$): un taglio frazionario di Gomory può essere generato da qualsiasi dizionario con una soluzione di base frazionaria, ottimale o meno. Nella figura la soluzione di base $(\frac{19}{8},0)$ è un vertice della regione ammissibile, non l'ottimo del rilassamento LP.

    - Il taglio frazionario di Gomory generato dalla prima riga è:

        \begin{align*}
        \underbrace{\left(\frac{1}{4} - \left\lfloor \frac{1}{4} \right\rfloor \right)}_{\frac{1}{4}-0=\frac{1}{4}} \; x_2 + \underbrace{\left(\frac{1}{8} - \left\lfloor \frac{1}{8} \right\rfloor \right)}_{\frac{1}{8}-0=\frac{1}{8}} \; x_4
        \ge \underbrace{\left(\frac{19}{8} - \left\lfloor \frac{19}{8} \right\rfloor \right)}_{\frac{19}{8} -2=\frac{3}{8}}
        \end{align*}

        \begin{align*}
        \frac{1}{4}\;x_2 + \frac{1}{8}\;x_4 \ge \frac{3}{8}
        \quad \Rightarrow \quad
        2\;x_2 + x_4 \ge 3
        \end{align*}

        Dalla forma standard del rilassamento LP, abbiamo:

        $$
        x_4= 19 - 8 \;x_1 - 2\;x_2
        $$

        Sostituendo nel taglio frazionario di Gomory, possiamo esprimerlo in termini delle variabili originali del problema ILP:

        $$
        2\;x_2 + (19 - 8 \:x_1 - 2\:x_2) \ge 3
        \quad \Rightarrow \quad
        x_1 \le 2
        $$

    - Il taglio frazionario di Gomory generato dalla seconda riga è:

        \begin{align*}
        \underbrace{\left(\frac{5}{4} - \left\lfloor \frac{5}{4} \right\rfloor \right)}_{\frac{5}{4}-1=\frac{1}{4}} \; x_2 + \underbrace{\left(\frac{1}{8} - \left\lfloor \frac{1}{8} \right\rfloor \right)}_{\frac{1}{8}-0=\frac{1}{8}} \; x_4
        \ge \underbrace{\left(\frac{35}{8} - \left\lfloor \frac{35}{8} \right\rfloor \right)}_{\frac{35}{8} -4=\frac{3}{8}}
        \end{align*}

        \begin{align*}
        \frac{1}{4}\;x_2 + \frac{1}{8}\;x_4 \ge \frac{3}{8}
        \quad \Rightarrow \quad
        2\;x_2 + x_4 \ge 3
        \end{align*}

        Questo taglio frazionario di Gomory è lo stesso di quello generato dalla prima riga.

    - Il taglio frazionario di Gomory generato dalla riga della funzione obiettivo è:

        \begin{align*}
        \underbrace{\left(-\frac{7}{2} - \left\lfloor -\frac{7}{2} \right\rfloor \right)}_{-\frac{7}{2}-(-4)=\frac{1}{2}} \; x_2 + \underbrace{\left(\frac{1}{4} - \left\lfloor \frac{1}{4} \right\rfloor \right)}_{\frac{1}{4}-0=\frac{1}{4}} \; x_4
        \ge \underbrace{\left(\frac{19}{4} - \left\lfloor \frac{19}{4} \right\rfloor \right)}_{\frac{19}{4} -4=\frac{3}{4}}
        \end{align*}

        \begin{align*}
        \frac{1}{2}\;x_2 + \frac{1}{4}\;x_4 \ge \frac{3}{4}
        \quad \Rightarrow \quad
        2\;x_2 + x_4 \ge 3
        \end{align*}

        Questo taglio frazionario di Gomory è lo stesso di quello generato dalla prima riga.

    Effetto del taglio frazionario di Gomory sulla regione ammissibile del rilassamento LP in forma canonica.

    ![Figura 3](../img/06-gomory/fig03.svg){ .fig .ovale loading=lazy style="width:59%" }

### 6.1.1 Validità dei tagli frazionari di Gomory

<a id="box-6-theoWD"></a>

!!! teorema "Osservazione 6.3"
    Qualsiasi taglio frazionario di Gomory elimina la soluzione di base fattibile frazionaria associata al dizionario del simplesso da cui è generato.

!!! nota ""
    ??? dimostrazione "Proof"

        Nella soluzione di base fattibile associata al dizionario, tutte le variabili non di base sono uguali a zero:

        $$
        x_j = 0, \quad \forall j \in \pazocal{N}.
        $$

        Considera ora la riga $i \in \pazocal{B}$ dalla quale viene generato il taglio frazionario di Gomory. Per definizione, $\bar{b}_i$ è frazionario. Il corrispondente taglio frazionario di Gomory è

        $$
        \sum_{j \in \pazocal{N}}
        \left(
        \bar{a}_{ij}
        -
        \left\lfloor \bar{a}_{ij} \right\rfloor
        \right)x_j
        \ge
        \bar{b}_i - \left\lfloor \bar{b}_i \right\rfloor .
        $$

        Alla soluzione di base ammissibile, il lato sinistro è uguale a zero, poiché $x_j=0$ per tutti $j \in \pazocal{N}$. D'altra parte,

        $$
        \bar{b}_i - \left\lfloor \bar{b}_i \right\rfloor > 0,
        $$

        perché $\bar{b}_i$ è frazionario. Pertanto, alla soluzione ammissibile di base corrente, il taglio diventa

        $$
        0
        \not\ge
        \bar{b}_i - \left\lfloor \bar{b}_i \right\rfloor .
        $$

        Pertanto, il taglio frazionario di Gomory elimina la soluzione di base ammissibile associata al dizionario da cui è generato. <span class="qed">□</span>

<a id="box-7-gfc-validity"></a>

!!! teorema "Osservazione 6.4"
    Ogni soluzione intera ammissibile del problema ILP soddisfa ogni taglio frazionario di Gomory generato dalle righe di un dizionario del simplesso.

!!! nota ""
    ??? dimostrazione "Proof"

        Consideriamo un taglio frazionario di Gomory generato dalla seguente riga $i \in \pazocal{B}$ di un dizionario del simplesso:

        \begin{equation*}
        \tag{A}
        x_i
        =
        \bar{b}_i
        -
        \sum_{j \in \pazocal{N}}
        \bar{a}_{ij}x_j .
        \end{equation*}

        Dimostriamo che ogni soluzione intera ammissibile del problema ILP che soddisfa questa riga soddisfa anche il corrispondente taglio frazionario di Gomory.

        Dal momento che $x_j \ge 0$ per tutti $j \in \pazocal{N}$ e $\left\lfloor \bar{a}_{ij} \right\rfloor \le \bar{a}_{ij},$ da (A) otteniamo

        $$
        x_i
        \le
        \bar{b}_i
        -
        \sum_{j \in \pazocal{N}}
        \left\lfloor \bar{a}_{ij} \right\rfloor x_j .
        $$

        Equivalentemente,

        $$
        x_i
        +
        \sum_{j \in \pazocal{N}}
        \left\lfloor \bar{a}_{ij} \right\rfloor x_j
        \le
        \bar{b}_i .
        $$

        Il lato sinistro è un intero, perché la soluzione è un intero, le variabili presenti nella riga hanno valori interi e i coefficienti $\left\lfloor \bar{a}_{ij} \right\rfloor$ sono interi. Pertanto,

        $$
        x_i
        +
        \sum_{j \in \pazocal{N}}
        \left\lfloor \bar{a}_{ij} \right\rfloor x_j
        \le
        \left\lfloor \bar{b}_i \right\rfloor .
        $$

        Usando (A), sostituiamo

        $$
        x_i
        =
        \bar{b}_i
        -
        \sum_{j \in \pazocal{N}}
        \bar{a}_{ij}x_j
        $$

        nella disuguaglianza precedente e ottenere

        $$
        \bar{b}_i
        -
        \sum_{j \in \pazocal{N}}
        \bar{a}_{ij}x_j
        +
        \sum_{j \in \pazocal{N}}
        \left\lfloor \bar{a}_{ij} \right\rfloor x_j
        \le
        \left\lfloor \bar{b}_i \right\rfloor .
        $$

        Riorganizzando i termini si ottiene

        $$
        \sum_{j \in \pazocal{N}}
        \left(
        \bar{a}_{ij}
        -
        \left\lfloor \bar{a}_{ij} \right\rfloor
        \right)x_j
        \ge
        \bar{b}_i - \left\lfloor \bar{b}_i \right\rfloor .
        $$

        Questa è esattamente la taglio frazionario di Gomory generato dalla riga $i$. Pertanto, la soluzione ammissibile intera soddisfa questo taglio.

        Poiché sia la soluzione intera ammissibile sia il taglio frazionario di Gomory sono stati scelti arbitrariamente, ogni soluzione intera ammissibile del problema ILP soddisfa ogni taglio frazionario di Gomory generato dalle righe del dizionario. <span class="qed">□</span>

- Lo stesso ragionamento si applica al taglio frazionario di Gomory generato dalla riga della funzione obiettivo. Infatti, la riga della funzione obiettivo può essere scritta come

    $$
    z
    =
    \bar z
    +
    \sum_{j \in \pazocal{N}}\bar c_j x_j
    =
    \bar z
    -
    \sum_{j \in \pazocal{N}}(-\bar c_j)x_j .
    $$

    Se $\bar z$ è frazionario, il corrispondente taglio frazionario di Gomory è

    $$
    \sum_{j \in \pazocal{N}}
    \left(
    -\bar c_j
    -
    \left\lfloor -\bar c_j \right\rfloor
    \right)x_j
    \ge
    \bar z - \left\lfloor \bar z \right\rfloor .
    $$

- Questa disuguaglianza esclude la soluzione ammissibile di base corrente: in quella soluzione, tutte le variabili non di base sono uguali a zero e quindi il lato sinistro è zero, mentre

    $$
    \bar z - \left\lfloor \bar z \right\rfloor > 0.
    $$

- Il taglio è valido per ogni soluzione intera fattibile del problema ILP. Infatti, se la funzione obiettivo originale ha coefficienti interi, allora $z$ assume valori interi in ogni soluzione intera fattibile. Inoltre,

    $$
    z
    +
    \sum_{j \in \pazocal{N}}
    \left\lfloor -\bar c_j \right\rfloor x_j
    \le
    \bar z .
    $$

    Poiché il lato sinistro è un numero intero, segue che

    $$
    z
    +
    \sum_{j \in \pazocal{N}}
    \left\lfloor -\bar c_j \right\rfloor x_j
    \le
    \left\lfloor \bar z \right\rfloor .
    $$

    Sostituendo

    $$
    z
    =
    \bar z
    +
    \sum_{j \in \pazocal{N}}\bar c_j x_j
    $$

    e riordinando i termini si ottiene esattamente

    $$
    \sum_{j \in \pazocal{N}}
    \left(
    -\bar c_j
    -
    \left\lfloor -\bar c_j \right\rfloor
    \right)x_j
    \ge
    \bar z - \left\lfloor \bar z \right\rfloor .
    $$

### 6.1.2 Inclusione dei tagli frazionari di Gomory nel dizionario del simplesso

- Un taglio frazionario di Gomory si ottiene da una riga dell'attuale dizionario del simplesso. In generale, sia i suoi coefficienti che il termine noto sono frazionari.

- Per inserire il taglio nel dizionario del simplesso procediamo in tre passaggi:

    1. sostituendo le definizioni delle variabili di scarto, riscriviamo il taglio nelle variabili originali come una disuguaglianza $\sum_{j=1}^{n} a_j x_j \le b$ con $a_j$ e $b$ interi;

    2. lo rendiamo <strong>primitivo</strong>: lo dividiamo per il massimo comune divisore $g$ di $a_1, \dots, a_n$ e arrotondiamo per difetto il lato destro,

        $$
        \sum_{j=1}^{n} \frac{a_j}{g} \, x_j \le \left\lfloor \frac{b}{g} \right\rfloor ;
        $$

    3. solo allora aggiungiamo la variabile di scarto non negativa $s = \lfloor b/g \rfloor - \sum_{j=1}^{n} (a_j/g) \, x_j$, e sostituiamo le righe correnti del dizionario per ottenere la riga di $s$.

- L'arrotondamento è valido: il lato sinistro è un intero per ogni intero $\vet x$. La variabile di scarto $s$ è intera in ogni soluzione ammissibile intera del problema ILP.

!!! chiave ""
    Per prima cosa il taglio viene reso primitivo, poi viene aggiunta la sua variabile slack. Una variabile in eccesso aggiunta direttamente al taglio frazionario corrisponde all'inequazione prima dell'arrotondamento, che è più debole quando $g$ non divide $b$.

<a id="box-8-gfc-projection-original-space"></a>

!!! esempio "Esempio 6.4: Taglio frazionario di Gomory"
    Considera il problema ILP di <span style="color:#1971c2">Esempio 1</span>.

    - Il primo taglio frazionario di Gomory nello spazio delle variabili originali è la seguente disuguaglianza, già primitiva ($g = 1$):

        \begin{align*}
        x_2 \le 3.
        \end{align*}

        Aggiungere una variabile di slack non negativa dà

        \begin{align*}
        x_2+x_5=3,
        \qquad x_5\ge 0.
        \end{align*}

        Dal dizionario del simplesso attuale abbiamo

        \begin{align*}
        x_2
        =
        \frac{7}{2}
        -
        \frac{4}{5}\;x_3
        -
        \frac{1}{10}\;x_4.
        \end{align*}

        Sostituendo e risolvendo per la nuova variabile $x_5$, la riga corrispondente del dizionario è

        \begin{align*}
        x_5
        =
        -\frac{1}{2}
        +
        \frac{4}{5}\;x_3
        +
        \frac{1}{10}\;x_4.
        \end{align*}

    - Il secondo taglio frazionario di Gomory nello spazio delle variabili originali è la seguente disuguaglianza, già primitiva ($g = 1$):

        \begin{align*}
        x_1 \le 2.
        \end{align*}

        Aggiungere una variabile di slack non negativa dà

        \begin{align*}
        x_1+x_5=2,
        \qquad x_5\ge 0.
        \end{align*}

        Dal dizionario del simplesso attuale abbiamo

        \begin{align*}
        x_1
        =
        \frac{19}{8}
        -
        \frac{1}{4}\;x_2
        -
        \frac{1}{8}\;x_4.
        \end{align*}

        Sostituendo e risolvendo per la nuova variabile $x_5$, la riga corrispondente del dizionario è

        \begin{align*}
        x_5
        =
        -\frac{3}{8}
        +
        \frac{1}{4}\;x_2
        +
        \frac{1}{8}\;x_4.
        \end{align*}

- Nel Esempio 1 i coefficienti non hanno divisori comuni e nulla è arrotondato. Nell'esempio dell'auto delle ultime sezioni, il secondo taglio nelle variabili originali è $6\,x_1 + 14\,x_2 \le 55$: con $g = 2$ l'ineguaglianza primitiva è $3\,x_1 + 7\,x_2 \le \lfloor 55/2 \rfloor = 27$, e la sua variabile di scarto è $27 - 3\,x_1 - 7\,x_2$.

## 6.2 Un algoritmo a piani di taglio basato sui tagli frazionari di Gomory

<a id="box-9-def-cpa"></a>

!!! definizione "Definizione 6.5: algoritmo del piano di taglio basato sui tagli frazionari di Gomory"
    Un <strong>algoritmo dei piani di taglio basato sui tagli frazionari di Gomory</strong> è un metodo esatto per risolvere problemi ILP basato sulla soluzione ripetuta deli rilassamenti LP. Partendo dal rilassamento LP del problema ILP, l'algoritmo aggiunge progressivamente i tagli frazionari di Gomory con l'obiettivo di rimuovere soluzioni ottimali LP frazionarie mantenendo tutte le soluzioni intere fattibili:

    $$
    \rightsquigarrow~\textbf{cut generation operations}
    $$

    Dopo ogni passaggio di generazione dei tagli, la nuova rilassamento LP più restrittiva viene risolta di nuovo:

    $$
    \rightsquigarrow~\textbf{LP re-optimization operations}
    $$

- L'algoritmo itera tra la generazione di tagli e la riorganizzazione dell'LP fino a quando non viene trovata una soluzione intera ottimale, se esiste.

- Consideriamo i problemi ILP in <strong>forma canonica di massimizzazione con dati di input interi</strong>.

### 6.2.1 Operazioni di generazione dei tagli

- Le <strong>operazioni di generazione dei tagli</strong> generano una sequenza di rilassamenti LP sempre più stringenti:

    $$
    \LP_1,\ \LP_2,\ \LP_3,\dots
    $$

    Ogni problema di programmazione lineare si ottiene dal precedente aggiungendo uno o più <strong><em>tagli frazionari di Gomory</em></strong>.

- Quando $k=1$ abbiamo il primo problema LP, denominato $\LP_1$, che è il rilassamento LP del problema ILP originale. Per $k\ge 2$, il problema $\LP_k$ viene ottenuto da $\LP_{k-1}$ aggiungendo i tagli frazionari di Gomory generati all'iterazione $k-1$.

!!! chiave ""
    Per ogni iterazione $k$, se il problema $\LP_k$ ha una soluzione ottimale, il suo valore ottimale è indicato da $z(\LP_k)$, e una soluzione ottimale è indicata da $\tilde{\vet x}(\LP_k).$

- Ad ogni iterazione, l'attuale rilassamento LP contiene tutte le soluzioni intere ammissibili del problema ILP originale. Di conseguenza, abbiamo il seguente limite superiore $\UB$ sul valore ottimale del problema ILP:

    $$
    z(\ILP) ~~\le~~  \underbrace{\left \lfloor z(\LP_k) \right \rfloor}_{\UB}
    $$

    Quando viene aggiunto un taglio frazionario di Gomory, la regione ammissibile del rilassamento LP diventa più piccola o rimane invariata.

- L'algoritmo può rimuovere punti che sono ammissibili per il rilassamento LP, ma non rimuove alcuna soluzione intera fattibile del problema ILP originale. In questo senso, ogni nuovo taglio restringe il rilassamento LP corrente senza escludere alcuna soluzione intera fattibile del problema ILP originale.

### 6.2.2 Pseudocodice ad alto livello

!!! algoritmo "Algoritmo"
    - <strong>Input:</strong> Un problema ILP in forma canonica di massimizzazione con dati di input interi.

    - <strong>Output:</strong> Una soluzione ottimale al problema ILP (se esiste) o un certificato di irrisolvibilità/illimitatezza.

    - **Passo 0:** <strong>Inizializzazione</strong>

        Rilassa i vincoli di integrità e risolvi il problema $\LP_1$. Imposta il contatore delle iterazioni $k \leftarrow 1$.

        - **1.** se $\tilde{\vet x}(\LP_1)$ è <strong>intero</strong>, allora è una soluzione ottimale e $z(\LP_1)$ è il valore ottimale del problema ILP. <code>STOP</code>.

        - **2.** se il problema $\LP_1$ è <strong>infattibile</strong>, allora il problema ILP è infattibile. <code>STOP</code>.

        - **3.** se il problema $\LP_1$ è <strong>illimitato</strong>, allora il problema ILP è o irrealizzabile o illimitato. <code>FERMA</code>.

    - **Passo 1:** <strong>Generazione dei tagli</strong>

        1. Seleziona una o più righe $i \in \pazocal{B}$ del dizionario del simplesso ottimale del problema $\LP_k$ con frazionale $\bar{b}_i$ e genera il relativo <strong>taglio frazionario di Gomory:</strong>

            $$
            \sum_{j \in \pazocal{N}}
            \left(
            \bar{a}_{ij}
            -
            \left\lfloor \bar{a}_{ij} \right\rfloor
            \right)x_j
            \ge
            \bar{b}_i
            -
            \left\lfloor \bar{b}_i \right\rfloor .
            $$

        2. Riscrivi ogni taglio nelle variabili originali in forma primitiva, aggiungi la sua variabile di scarto e aggiungilo al problema $\LP_k$: questo dà la nuova rilassamento LP $\LP_{k+1}$. Aggiorna il contatore delle iterazioni $k \leftarrow k+1.$

    - **Fase 2:** <strong>Verifica dell'ottimalità</strong>

        1. Risolvi il problema $\LP_k$.

        2. Se il problema $\LP_k$ è <strong>inatteso</strong>, allora il problema ILP è inatteso. <code>STOP</code>.

        3. Sia $\tilde{\vet x}(\LP_k)$ una soluzione ottimale del problema $\LP_k$, e sia $z(\LP_k)$ il suo valore ottimale. Se $\tilde{\vet x}(\LP_k)$ è <strong>intero</strong>, allora è una soluzione ottimale del problema ILP e $z(\LP_k)$ è il valore ottimale del problema ILP. <code>STOP</code>. Altrimenti, vai al Passo 1.

- Durante la fase di generazione dei tagli, è possibile generare più di un taglio frazionario di Gomory: selezionando più di una riga del dizionario del simplesso ottimale con $\bar{b}_i$ frazionario, o la riga della funzione obiettivo.

- Il pseudocodice non dice come i problemi di programmazione lineare vengano riottimizzati dopo l'inserimento dei tagli: la sezione successiva spiega l'uso dell'algoritmo del simplesso duale.

### 6.2.3 Rottimizzazione con l'algoritmo del simplesso duale

- Un nuovo taglio differisce dal precedente problema $\LP_k$ per <u>un</u> vincolo, quindi non risolviamo il nuovo problema da zero: iniziamo dal <strong>dizionario ottimale</strong> del problema $\LP_k$ e lo riottimizziamo con il <strong>algoritmo del simplesso duale</strong>.

- Il taglio fornisce una nuova riga con la variabile di scarto $x_s$ della disuguaglianza primitiva nella base. Il suo valore nella soluzione base corrente è negativo, poiché il taglio rimuove questa soluzione. I costi ridotti non cambiano.

!!! chiave ""
    Dopo l'inserimento di un taglio, il dizionario è <strong>dualmente ammissibile</strong> ma non primalmente fattibile: questo è esattamente il punto di partenza dell'algoritmo del simplesso duale.

!!! nota ""
    <strong>Operazione a doppio pivot</strong> su un dizionario $x_i = \bar b_i - \sum_{j \in \pazocal{N}} \bar a_{ij} \, x_j$, per $i \in \pazocal{B}$, e $z = \bar z + \sum_{j \in \pazocal{N}} \bar c_j \, x_j$, con $\bar c_j \le 0$ per tutti $j \in \pazocal{N}$:

    - **a.** la <strong>riga pivot</strong> è la variabile di base con valore negativo avente l'indice più piccolo:

        $$
        r = \min \left\{~ i \in \pazocal{B} : \bar b_i < 0 ~\right\};
        $$

    - **b.** se $\bar a_{rj} \ge 0$ per tutti $j \in \pazocal{N}$, il problema LP è <strong>inammissibile</strong>;

    - **c.** altrimenti la <strong>colonna pivot</strong> $x_p$ raggiunge il rapporto minimo (pareggi: indice più piccolo)

        $$
        \frac{\bar c_p}{\bar a_{rp}} = s_m = \min \left\{~ \frac{\bar c_j}{\bar a_{rj}} : j \in
        \pazocal{N},~ \bar a_{rj} < 0 ~\right\};
        $$

    - **d.** dopo l'operazione di pivoting il valore dell'obiettivo è $\bar z + s_m \, \bar b_r \le \bar z$.

    L'algoritmo si ferma quando tutte le variabili di base sono non negative: il dizionario è allora ottimale.

- Se il nuovo problema $\LP_{k+1}$ è irrisolvibile, l'algoritmo del simplesso duale lo rileva nel passo b, e il problema ILP è irrisolvibile. Di solito uno o due operazioni di pivotamento sono sufficienti.

<a id="box-10-texexpbox2"></a>

!!! esempio "Esempio 6.5: algoritmo del piano di taglio"
    Descriviamo ora l'esecuzione dell'algoritmo del piano di taglio per il problema ILP di <span style="color:#1971c2">Esempio 1</span> utilizzando:

    1. un taglio frazionario di Gomory a ogni iterazione;

    2. il lato destro più grande come strategia di selezione del taglio, con le regole di spareggio della sezione sulla selezione del taglio (indice più piccolo della variabile di base, riga della funzione obiettivo per ultima);

    3. Ogni problema $\LP_k$ viene r-ottimizzato con l'algoritmo del simplesso duale.

    <span style="color:#e03131"><strong>Inizializzazione</strong></span>

    Per il problema $\LP_1$ in forma canonica, abbiamo:

    $$
    \begin{array}{rrrrrrrrrrrrr}
    {\max} & 2 \, {x_1} & {+} & 4 \, {x_2} \\[2ex]
    & {-} \, {x_1} & {+} & \, {x_2} & {\le} & {2} \\[2ex]
    & {8} \, {x_1} & {+} & {2} \, {x_2} & {\le} & {19} \\[2ex]
    & {x_1,} &  & {x_2} & { \ge} & {0}
    \end{array}
    $$

    Una soluzione ottimale $\tilde{\vet x}(\LP_1)$ è:

    $$
    \tilde{x}_1=\frac{3}{2},~~\tilde{x}_2=\frac{7}{2}
    $$

    Il valore ottimale è:

    $$
    z(~\LP_1~)  = 17
    $$

    ![Figura 4](../img/06-gomory/fig04.svg){ .fig .ovale loading=lazy style="width:56%" }

    La soluzione ottimale $\tilde{\vet x}(\LP_1)$ è <strong>frazionaria</strong> e il problema $\LP_1$ è <strong>fattibile</strong>.

    Abbiamo il limite superiore sul valore ottimale del problema ILP:

    $$
    z(\ILP) ~~\le~~  17
    $$

    <span style="color:#e03131"><strong>Iterazione 1</strong></span>

    - **a)** <strong>Fase di generazione dei cut</strong>

        Consideriamo il seguente dizionario del simplesso associato a una soluzione di base fattibile frazionaria del problema $\LP_1$ in forma standard:

        \begin{equation*}
        \begin{cases}
        \begin{array}{rrrrrrrrrrrrr}
        {x_1=\dfrac{3}{2}} & {+} & {\dfrac{1}{5}} \, {x_3} & {-} & {\dfrac{1}{10}}\, {x_4} \\[2ex]
        {x_2=\dfrac{7}{2}} & {-} & {\dfrac{4}{5}}\, {x_3} & {-} & {\dfrac{1}{10}}\, {x_4} \\[2ex]
        {z= 17} & {-} & {\dfrac{14}{5}} \, {x_3} & {-} & {\dfrac{3}{5}} \, {x_4}
        \end{array}
        \end{casi}
        \quad
        dove
        \quad
        \bar{\mat A}=
        \begin{pmatrix}
        -\frac{1}{5} & \frac{1}{10} \\[1.5ex]
        \frac{4}{5} & \frac{1}{10}
        \end{pmatrix}
        \quad
        \bar{\vet b}=
        \begin{pmatrix}
        \frac{3}{2} \\[1.5ex]
        \frac{7}{2}
        \end{pmatrix}
        \fine{equazione*}

        - Il taglio frazionario di Gomory generato dalla prima riga è:

            \begin{align*}
            \underbrace{\left(-\frac{1}{5} - \left\lfloor -\frac{1}{5} \right\rfloor \right)}_{-\frac{1}{5}-(-1)=\frac{4}{5}} \; x_3
            + \underbrace{\left(\frac{1}{10} - \left\lfloor \frac{1}{10} \right\rfloor \right)}_{\frac{1}{10}-0=\frac{1}{10}} \; x_4
            \ge
            \underbrace{\left(\frac{3}{2} - \left\lfloor \frac{3}{2} \right\rfloor \right)}_{\frac{3}{2}-1=\frac{1}{2}}
            \end{align*}

            $$
            \frac{4}{5}\;x_3 + \frac{1}{10}\;x_4 \ge \frac{1}{2}
            \quad \Rightarrow \quad
            8\;x_3 + x_4 \ge 5
            $$

            Dalla forma standard del problema $\LP_1$, abbiamo:

            $$
            x_3= 2 + x_1 -x_2 \text{    and    }
            x_4= 19 - 8 \;x_1 - 2\;x_2
            $$

            Sostituendo nel taglio frazionario di Gomory, possiamo esprimerlo in termini delle variabili originali del problema ILP:

            $$
            8\; (2 + x_1 -x_2) + (19 - 8 \:x_1 - 2\:x_2) \ge 5
            \quad \Rightarrow \quad
            x_2 \le 3
            $$

    Effetto del taglio frazionario di Gomory generato dalla prima riga sulla regione ammissibile del problema $\LP_1$ in forma canonica:

    ![Figura 5](../img/06-gomory/fig05.svg){ .fig .ovale loading=lazy style="width:56%" }

    - Il taglio frazionario di Gomory generato dalla seconda riga è:

        \begin{align*}
        \underbrace{\left(\frac{4}{5} - \left\lfloor \frac{4}{5} \right\rfloor \right)}_{\frac{4}{5}-0=\frac{4}{5}} \; x_3
        + \underbrace{\left(\frac{1}{10} - \left\lfloor \frac{1}{10} \right\rfloor \right)}_{\frac{1}{10}-0=\frac{1}{10}} \; x_4
        \ge
        \underbrace{\left(\frac{7}{2} - \left\lfloor \frac{7}{2} \right\rfloor \right)}_{\frac{7}{2}-3=\frac{1}{2}}
        \end{align*}

        \begin{align*}
        \frac{4}{5}\;x_3 + \frac{1}{10}\;x_4 \ge \frac{1}{2}
        \quad \Rightarrow \quad
        8\;x_3 + x_4 \ge 5
        \end{align*}

        Questo taglio frazionario di Gomory è lo stesso di quello generato dalla prima riga.

    I due tagli sono uguali e hanno il lato destro più grande, $\frac{1}{2}$. Selezioniamo quello generato dalla riga di $x_1$ (indice più piccolo) e creiamo il problema $\LP_2$ aggiungendolo al problema $\LP_1$.

    - **b)** <strong>Fase di riottimizzazione LP</strong>

        Per il problema $\LP_2$ in forma canonica, abbiamo:

        $$
        \begin{array}{rrrrrrrrrrrrr}
        {\max} & {2}\, {x_1} & {+} & {4}\, {x_2} \\[2ex]
        & {-}\, {x_1} & {+} & {x_2} & {\le} & {2} \\[2ex]
        & {8}\, {x_1} & {+} & {2}\, {x_2} & {\le} & {19} \\[2ex]
        &  &  & {x_2} & {\le} & {3} \\[2ex]
        & {x_1,} &  & {x_2} & {\ge} & {0}
        \end{array}
        $$

        - Nelle variabili originali il taglio è $x_2 \le 3$, già primitivo (i suoi coefficienti non hanno un divisore comune).

        - La variabile di scarto $x_5 = 3 - x_2 \ge 0$ della disuguaglianza primitiva viene aggiunta. Sostituendo le righe correnti del dizionario, la nuova riga è

            $$
            x_5 = -\dfrac{1}{2} + \dfrac{4}{5} \, x_3 + \dfrac{1}{10} \, x_4.
            $$

        - Il dizionario sottostante è <strong>dualmente ammissibile</strong> (i costi ridotti non cambiano) ma non ammissibile primalmente, poiché $\bar b_{5} = -\dfrac{1}{2} < 0$:

        \begin{equation*}
        \begin{cases}
        \begin{array}{rrrrrrr}
        {x_1} & {=} & {\dfrac{3}{2}} & {+} & {\dfrac{1}{5}}\, {x_3} & {-} & {\dfrac{1}{10}}\, {x_4} \\[2ex]
        {x_2} & {=} & {\dfrac{7}{2}} & {-} & {\dfrac{4}{5}}\, {x_3} & {-} & {\dfrac{1}{10}}\, {x_4} \\[2ex]
        {x_5} & {=} & {-\dfrac{1}{2}} & {+} & {\dfrac{4}{5}}\, {x_3} & {+} & {\dfrac{1}{10}}\, {x_4} \\[2ex]
        {z} & {=} & {17} & {-} & {\dfrac{14}{5}}\, {x_3} & {-} & {\dfrac{3}{5}}\, {x_4}
        \end{array}
        \end{casi}
        \fine{equazione*}

        - <strong>Operazione di doppia pivot.</strong> La riga pivot è $x_5$, l'unica variabile di base con un valore negativo. I rapporti $\bar c_j / \bar a_{5j}$ delle variabili non di base con $\bar a_{5j} < 0$ sono

            $$
            \frac{\bar c_{3}}{\bar a_{5,3}} = \frac{-\tfrac{14}{5}}{-\tfrac{4}{5}} = \dfrac{7}{2},\qquad \frac{\bar c_{4}}{\bar a_{5,4}} = \frac{-\tfrac{3}{5}}{-\tfrac{1}{10}} = 6.
            $$

        - La colonna pivot è $x_3$, con $s_m = \dfrac{7}{2}$, e il valore obiettivo diventa $\bar z + s_m \, \bar b_{5} = 17 + \dfrac{7}{2} \cdot \left(-\dfrac{1}{2}\right) = \dfrac{61}{4}$. Il nuovo dizionario è ammissibile sia primalmente sia dualmente, quindi ottimale:

        \begin{equation*}
        \begin{cases}
        \begin{array}{rrrrrrr}
        {x_1} & {=} & {\dfrac{13}{8}} & {-} & {\dfrac{1}{8}}\, {x_4} & {+} & {\dfrac{1}{4}}\, {x_5} \\[2ex]
        {x_2} & {=} & {3} &  &  & {-} & {x_5} \\[2ex]
        {x_3} & {=} & {\dfrac{5}{8}} & {-} & {\dfrac{1}{8}}\, {x_4} & {+} & {\dfrac{5}{4}}\, {x_5} \\[2ex]
        {z} & {=} & {\dfrac{61}{4}} & {-} & {\dfrac{1}{4}}\, {x_4} & {-} & {\dfrac{7}{2}}\, {x_5}
        \end{array}
        \end{casi}
        \fine{equazione*}

        Una soluzione ottimale $\tilde{\vet x}(\LP_2)$ è:

        $$
        \tilde{x}_1=\frac{13}{8},~~\tilde{x}_2=3
        $$

        Il valore ottimale è:

        $$
        z(~\LP_2~)=\frac{61}{4}
        $$

        ![Figura 6](../img/06-gomory/fig06.svg){ .fig .ovale loading=lazy style="width:56%" }

        Abbiamo il limite superiore sul valore ottimale del problema ILP:

        $$
        z(\ILP) ~~\le~~   \underbrace{\left \lfloor  \frac{61}{4} \right \rfloor}_{=15}
        $$

    <span style="color:#e03131"><strong>Iterazione 2</strong></span>

    - **a)** <strong>Fase di generazione dei tagli</strong>

        Abbiamo il seguente dizionario del simplesso associato a una soluzione di base ammissibile frazionaria del problema $\LP_2$ in forma standard:

        \begin{equation*}
        \begin{cases}
        \begin{array}{rrrrrrrrrrrrr}
        {x_1} & {=} & {\dfrac{13}{8}} & {-} & {\dfrac{1}{8}} \, {x_4} & {+} & {\dfrac{1}{4}}\, {x_5} \\[1.5ex]
        {x_2} & {=} & {3} &  &  & {-} & {x_5} \\[1.5ex]
        {x_3} & {=} & {\dfrac{5}{8}} & {-} & {\dfrac{1}{8}}\, {x_4} & {+} & {\dfrac{5}{4}}\, {x_5} \\[1.5ex]
        {z} & {=} & { \dfrac{61}{4}} & {-} & {\dfrac{1}{4}} \, {x_4} & {-} & {\dfrac{7}{2}} \, {x_5}
        \end{array}
        \end{casi}
        \quad
        dove
        \quad
        \bar{\mat A}=
        \begin{pmatrix}
        \frac{1}{8} & -\frac{1}{4} \\[1.5ex]
        0 & 1 \\[1.5ex]
        \frac{1}{8} & -\frac{5}{4}
        \end{pmatrix}
        \quad
        \bar{\vet b}=
        \begin{pmatrix}
        \frac{13}{8} \\[1.5ex]
        3 \\[1.5ex]
        \frac{5}{8}
        \end{pmatrix}
        \fine{equazione*}

    - Il taglio frazionario di Gomory generato dalla prima riga è:

        \begin{align*}
        \underbrace{\left(\frac{1}{8} - \left\lfloor \frac{1}{8} \right\rfloor \right)}_{\frac{1}{8}-0=\frac{1}{8}} \; x_4
        + \underbrace{\left(-\frac{1}{4} - \left\lfloor -\frac{1}{4} \right\rfloor \right)}_{-\frac{1}{4}-(-1)=\frac{3}{4}} \; x_5
        \ge
        \underbrace{\left(\frac{13}{8} - \left\lfloor \frac{13}{8} \right\rfloor \right)}_{\frac{13}{8}-1=\frac{5}{8}}
        \end{align*}

        \begin{align*}
        \frac{1}{8}\;x_4 + \frac{3}{4}\;x_5 \ge \frac{5}{8}
        \quad \Rightarrow \quad
        x_4 + 6\;x_5 \ge 5
        \end{align*}

        Dalla forma standard del problema $\LP_2$, abbiamo:

        $$
        x_4=19-8x_1-2x_2
        \qquad \text{e} \qquad
        x_5=3-x_2 .
        $$

        Sostituendo nel taglio frazionario di Gomory, possiamo esprimerlo in termini delle variabili originali del problema ILP:

        $$
        (19-8x_1-2x_2)+6(3-x_2)\ge 5
        \quad \Rightarrow \quad
        x_1+x_2\le 4 .
        $$

    Effetto del taglio frazionario di Gomory generato dalla prima riga sulla regione ammissibile del problema $\LP_2$ in forma canonica:

    ![Figura 7](../img/06-gomory/fig07.svg){ .fig .ovale loading=lazy style="width:56%" }

    - Il taglio frazionario di Gomory generato dalla terza riga è:

        \begin{align*}
        \underbrace{\left(\frac{1}{8} - \left\lfloor \frac{1}{8} \right\rfloor \right)}_{\frac{1}{8}-0=\frac{1}{8}} \; x_4
        + \underbrace{\left(-\frac{5}{4} - \left\lfloor -\frac{5}{4} \right\rfloor \right)}_{-\frac{5}{4}-(-2)=\frac{3}{4}} \; x_5
        \ge
        \underbrace{\left(\frac{5}{8} - \left\lfloor \frac{5}{8} \right\rfloor \right)}_{\frac{5}{8}-0=\frac{5}{8}}
        \end{align*}

        \begin{align*}
        \frac{1}{8}\;x_4 + \frac{3}{4}\;x_5 \ge \frac{5}{8}
        \quad \Rightarrow \quad
        x_4 + 6\;x_5 \ge 5
        \end{align*}

        Questo taglio frazionario di Gomory è lo stesso di quello generato dalla prima riga.

    - Il taglio frazionario di Gomory generato dalla riga della funzione obiettivo è:

        \begin{align*}
        \underbrace{\left(\frac{1}{4} - \left\lfloor \frac{1}{4} \right\rfloor \right)}_{\frac{1}{4}-0=\frac{1}{4}} \; x_4
        + \underbrace{\left(\frac{7}{2} - \left\lfloor \frac{7}{2} \right\rfloor \right)}_{\frac{7}{2}-3=\frac{1}{2}} \; x_5
        \ge
        \underbrace{\left(\frac{61}{4} - \left\lfloor \frac{61}{4} \right\rfloor \right)}_{\frac{61}{4}-15=\frac{1}{4}}
        \end{align*}

        \begin{align*}
        \frac{1}{4}\;x_4 + \frac{1}{2}\;x_5 \ge \frac{1}{4}
        \quad \Rightarrow \quad
        x_4 + 2\;x_5 \ge 1
        \end{align*}

        Dalla forma standard del problema $\LP_2$, abbiamo:

        $$
        x_4=19-8x_1-2x_2
        \qquad \text{e} \qquad
        x_5=3-x_2 .
        $$

        Sostituendo nel taglio frazionario di Gomory, possiamo esprimerlo in termini delle variabili originali del problema ILP:

        $$
        (19-8x_1-2x_2)+2(3-x_2)\ge 1
        \quad \Rightarrow \quad
        2x_1+x_2\le 6 .
        $$

    Effetto del taglio frazionario di Gomory generato dalla riga della funzione obiettivo sulla regione ammissibile del problema $\LP_2$ in forma canonica:

    ![Figura 8](../img/06-gomory/fig08.svg){ .fig .ovale loading=lazy style="width:56%" }

    I tagli delle righe di $x_1$ e $x_3$ sono uguali e hanno il lato destro più grande, $\frac{5}{8}$ (la riga della funzione obiettivo dà $\frac{1}{4}$). Selezioniamo quella generata dalla riga di $x_1$ (indice più piccolo) e creiamo il problema $\LP_3$ aggiungendolo al problema $\LP_2$.

    - **b)** <strong>Fase di riottimizzazione LP</strong>

        Per il problema $\LP_3$ in forma canonica, abbiamo:

        $$
        \begin{array}{rrrrrrrrrrrrr}
        {\max} & {2}\, {x_1} & {+} & {4}\, {x_2} \\[1.5ex]
        & {-}\, {x_1} & {+} & {x_2} & {\le} & {2} \\[1.5ex]
        & {8}\, {x_1} & {+} & {2}\, {x_2} & {\le} & {19} \\[1.5ex]
        &  &  & {x_2} & {\le} & {3} \\[1.5ex]
        & {x_1} & {+} & {x_2} & {\le} & {4} \\[1.5ex]
        & {x_1,} &  & {x_2} & {\ge} & {0}
        \end{array}
        $$

        - Nelle variabili originali il taglio è $x_1 + x_2 \le 4$, già primitivo (i suoi coefficienti non hanno un divisore comune).

        - La variabile di scarto $x_6 = 4 - \left(x_1 + x_2\right) \ge 0$ della disuguaglianza primitiva viene aggiunta. Sostituendo le righe correnti del dizionario, la nuova riga è

            $$
            x_6 = -\dfrac{5}{8} + \dfrac{1}{8} \, x_4 + \dfrac{3}{4} \, x_5.
            $$

        - Il dizionario sottostante è <strong>dualmente ammissibile</strong> (i costi ridotti non cambiano) ma non ammissibile primalmente, poiché $\bar b_{6} = -\dfrac{5}{8} < 0$:

        \begin{equation*}
        \begin{cases}
        \begin{array}{rrrrrrr}
        {x_1} & {=} & {\dfrac{13}{8}} & {-} & {\dfrac{1}{8}}\, {x_4} & {+} & {\dfrac{1}{4}}\, {x_5} \\[2ex]
        {x_2} & {=} & {3} &  &  & {-} & {x_5} \\[2ex]
        {x_3} & {=} & {\dfrac{5}{8}} & {-} & {\dfrac{1}{8}}\, {x_4} & {+} & {\dfrac{5}{4}}\, {x_5} \\[2ex]
        {x_6} & {=} & {-\dfrac{5}{8}} & {+} & {\dfrac{1}{8}}\, {x_4} & {+} & {\dfrac{3}{4}}\, {x_5} \\[2ex]
        {z} & {=} & {\dfrac{61}{4}} & {-} & {\dfrac{1}{4}}\, {x_4} & {-} & {\dfrac{7}{2}}\, {x_5}
        \end{array}
        \end{casi}
        \fine{equazione*}

        - <strong>Operazione di doppia pivoting.</strong> La riga pivot è $x_6$, l'unica variabile di base con un valore negativo. I rapporti $\bar c_j / \bar a_{6j}$ delle variabili non di base con $\bar a_{6j} < 0$ sono

            $$
            \frac{\bar c_{4}}{\bar a_{6,4}} = \frac{-\tfrac{1}{4}}{-\tfrac{1}{8}} = 2,\qquad \frac{\bar c_{5}}{\bar a_{6,5}} = \frac{-\tfrac{7}{2}}{-\tfrac{3}{4}} = \dfrac{14}{3}.
            $$

        - La colonna pivot è $x_4$, con $s_m = 2$, e il valore obiettivo diventa $\bar z + s_m \, \bar b_{6} = \dfrac{61}{4} + 2 \cdot \left(-\dfrac{5}{8}\right) = 14$. Il nuovo dizionario è ammissibile sia primalmente sia dualmente, quindi ottimale:

        \begin{equation*}
        \begin{cases}
        \begin{array}{rrrrrrr}
        {x_1} & {=} & {1} & {+} & {x_5} & {-} & {x_6} \\[2ex]
        {x_2} & {=} & {3} & {-} & {x_5} &  &  \\[2ex]
        {x_3} & {=} & {0} & {+} & {2}\, {x_5} & {-} & {x_6} \\[2ex]
        {x_4} & {=} & {5} & {-} & {6}\, {x_5} & {+} & {8}\, {x_6} \\[2ex]
        {z} & {=} & {14} & {-} & {2}\, {x_5} & {-} & {2}\, {x_6}
        \end{array}
        \end{casi}
        \fine{equazione*}

        Una soluzione ottimale $\tilde{\vet x}(\LP_3)$ è:

        $$
        \tilde{x}_1=1,~~\tilde{x}_2=3
        $$

        Il valore ottimale è:

        $$
        z(~\LP_3~)=14
        $$

        ![Figura 9](../img/06-gomory/fig09.svg){ .fig .ovale loading=lazy style="width:56%" }

    La soluzione ottimale $\tilde{\vet x}(\LP_3)$ è <strong>intera</strong>. Di conseguenza, una soluzione ottimale $\tilde{\vet x}(\ILP)$ è:

    $$
    \tilde{x}_1=1,~~\tilde{x}_2=3
    $$

    Il valore ottimale $z(\ILP)$ è $14$.

### 6.2.4 Strategie di selezione dei tagli

- Durante la fase di generazione dei tagli, possono essere generati diversi tagli frazionari di Gomory e aggiunti al rilassamento LP. La <strong>strategia di selezione dei tagli</strong> decide quali.

!!! chiave ""
    La <strong>strategia di selezione del taglio sul lato destro più grande</strong> seleziona il taglio frazionario di Gomory il cui lato destro frazionario è massimo tra tutti i tagli candidati.

- I tagli candidati sono generati dalle righe $i \in \pazocal{B}$ del dizionario con frazionale $\bar{b}_i$; il lato destro del taglio della riga $i$ è

    $$
    \bar{b}_i - \left\lfloor \bar{b}_i \right\rfloor .
    $$

- Se il valore dell'obiettivo $\bar{z}$ è frazionario, anche la riga della funzione obiettivo è un candidato, con lato destro $\bar{z} - \left\lfloor \bar{z} \right\rfloor$.

- <strong>Parità.</strong> I tagli con lo stesso lato destro possono essere diversi, quindi la scelta deve essere fissata per rendere l'esecuzione riproducibile: selezioniamo la riga della variabile base con il <u>indice più piccolo</u> e la riga della funzione obiettivo è considerata <u>per ultima</u>.

### 6.2.5 Inizializzazione euristica

!!! chiave ""
    Prima di eseguire un algoritmo di cutting-plane, può essere eseguito un <strong>algoritmo euristico</strong> con l'obiettivo di trovare una soluzione ammissibile di alta qualità al problema ILP. Questa soluzione euristica fornisce un limite inferiore iniziale $\LB$ sul valore ottimale del problema ILP.

- Ad ogni iterazione, il valore ottimale del rilassamento LP corrente fornisce un <strong>limite superiore</strong>

    $$
    \UB = \left \lfloor z(\LP_k) \right \rfloor
    $$

    sul valore ottimale del problema ILP. Man mano che vengono aggiunti tagli validi, questo limite superiore viene progressivamente migliorato.

- La disponibilità di una soluzione intera fattibile permette di monitorare il divario tra i limiti superiore e inferiore:

    $$
    \frac{\UB - \LB}{|\LB|}
    $$

    L'algoritmo del piano di taglio può essere interrotto quando questo divario è zero, allora la soluzione euristica è dimostrata essere ottimale.

### 6.2.6 Osservazioni aggiuntive

- La terminazione finita di un algoritmo di piano di taglio con tagli frazionari di Gomory è garantita solo con regole precise (un algoritmo duale semplice lessicografico e una scelta adeguata delle righe). Con regole arbitrarie l'algoritmo può richiedere un numero molto elevato di iterazioni.

- I tagli frazionari di Gomory sono solitamente molto efficaci nelle prime iterazioni, ma la loro efficacia diminuisce man mano che l'algoritmo procede (<strong>tailing off</strong>); la sezione successiva mostra un esempio.

- Per questo motivo, i tagli frazionari di Gomory sono spesso utilizzati per rafforzare i rilassamenti LP risolte nei nodi di un albero di branch-and-bound: il metodo risultante è un <strong>algoritmo branch-and-cut</strong>.

## 6.3 L'esempio dell'auto

- L'esempio dell'auto è risolto dall'algoritmo del piano di taglio con le stesse regole del Esempio 1: un taglio per iterazione, il termine noto più grande, in caso di parità si considera l'indice più piccolo della variabile di base e per ultimo la riga della funzione obiettivo.

- La tabella riporta, per ogni taglio, l'ineguaglianza nelle variabili originali prima dell'arrotondamento (quando $g > 1$) e in forma primitiva, la soluzione e il valore del prossimo problema LP, e il limite superiore $\UB = \lfloor z(\LP_{k+1}) \rfloor$.

<div class="tabella" markdown="0"><table>
<tr>
<th>Taglia</th>
<th>Prima dell'arrotondamento</th>
<th>Taglio primitivo</th>
<th><span class="arithmatex">\(\tilde{\vet x}(\LP_{k+1})\)</span></th>
<th><span class="arithmatex">\(z(\LP_{k+1})\)</span></th>
<th><span class="arithmatex">\(\UB\)</span></th>
</tr>
<tr>
<td>1</td>
<td>—</td>
<td><span class="arithmatex">\(5\,x_1 + 14\,x_2 \le 52\)</span></td>
<td><span class="arithmatex">\((\tfrac{211}{60}, \tfrac{59}{24})\)</span></td>
<td><span class="arithmatex">\(\tfrac{232}{15}\)</span></td>
<td><span class="arithmatex">\(15\)</span></td>
</tr>
<tr>
<td>2</td>
<td><span class="arithmatex">\(6\,x_1 + 14\,x_2 \le 55\)</span></td>
<td><span class="arithmatex">\(3\,x_1 + 7\,x_2 \le 27\)</span></td>
<td><span class="arithmatex">\((\tfrac{207}{58}, \tfrac{135}{58})\)</span></td>
<td><span class="arithmatex">\(\tfrac{891}{58}\)</span></td>
<td><span class="arithmatex">\(15\)</span></td>
</tr>
<tr>
<td>3</td>
<td>—</td>
<td><span class="arithmatex">\(4\,x_1 + 7\,x_2 \le 30\)</span></td>
<td><span class="arithmatex">\((\tfrac{65}{18}, \tfrac{20}{9})\)</span></td>
<td><span class="arithmatex">\(\tfrac{275}{18}\)</span></td>
<td><span class="arithmatex">\(15\)</span></td>
</tr>
<tr>
<td>4</td>
<td><span class="arithmatex">\(7\,x_1 + 7\,x_2 \le 40\)</span></td>
<td><span class="arithmatex">\(x_1 + x_2 \le 5\)</span></td>
<td><span class="arithmatex">\((\tfrac{25}{6}, \tfrac{5}{6})\)</span></td>
<td><span class="arithmatex">\(\tfrac{85}{6}\)</span></td>
<td><span class="arithmatex">\(14\)</span></td>
</tr>
<tr>
<td>5</td>
<td>—</td>
<td><span class="arithmatex">\(9\,x_1 + 4\,x_2 \le 40\)</span></td>
<td><span class="arithmatex">\((4, 1)\)</span></td>
<td><span class="arithmatex">\(14\)</span></td>
<td><span class="arithmatex">\(14\)</span></td>
</tr>
</table></div>

- L'algoritmo ha bisogno di $5$ tagli. Il limite superiore rimane a $15$ per i primi $3$ tagli, e la soluzione intera viene trovata solo all'ultimo taglio.

- Nei tagli 2 e 4 i coefficienti hanno un divisore comune: il taglio primitivo è più forte dell'ineguaglianza prima dell'arrotondamento.

- La soluzione ottimale è $\tilde{\vet x} = (4, 1)$, con valore $z(\ILP) = 14$.

## 6.4 Errori tipici

!!! attenzione "Avviso"
    - <strong>Utilizzo del taglio per problemi con variabili continue.</strong> Il taglio frazionario è valido solo se tutte le variabili e i dati sono interi: con una variabile continua potrebbe eliminare soluzioni ammissibili.

    - <strong>Prendere il pavimento di un coefficiente o di un termine noto.</strong> Il taglio utilizza le parti frazionarie: $\bar a_{ij} - \lfloor \bar a_{ij} \rfloor$ è sempre in $[0,1)$, anche per un $\bar a_{ij}$ negativo.

    - <strong>Dimenticare la riga della funzione obiettivo.</strong> È un taglio candidato se $\bar z$ è frazionario; con la strategia del lato destro più grande può essere quella selezionata.

    - <strong>Aggiunta della variabile di scarto prima di creare la primitva del taglio.</strong> Il taglio nelle variabili originali deve prima essere diviso per il massimo comun divisore dei suoi coefficienti, con il lato destro arrotondato per difetto; solo allora viene aggiunta la sua variabile di scarto. Altrimenti il taglio risulta più debole.

    - <strong>Scegliere tra membri destri uguali senza una regola.</strong> Scelte diverse producono esecuzioni diverse; usare l'indice più piccolo della variabile di base e l'ultima riga della funzione obiettivo.

    - <strong>Risoluzione di ogni problema $\LP_k$ da zero.</strong> La risposta è la stessa, ma molto più lenta: il dizionario con la nuova riga è duale ammissibile, e l'algoritmo del simplesso duale parte da esso.

    - <strong>Fermarsi quando il limite superiore smette di migliorare.</strong> L'algoritmo si ferma solo quando la soluzione del problema $\LP_k$ è intera.

## 6.5 In sintesi

!!! chiave "In sintesi"
    - Un taglio frazionario di Gomory viene generato da una riga del dizionario con frazionale $\bar b_i$; taglia la soluzione di base corrente e nessuna soluzione intera fattibile del problema ILP.

    - Il taglio è valido solo per problemi ILP con dati interi, dove le variabili di scarto e di eccedenza sono intere.

    - Dopo ogni taglio, il problema LP viene riottimizzato con l'algoritmo del simplesso duale, partendo dal dizionario del problema precedente.

    - Il limite superiore è $\lfloor z(\LP_k) \rfloor$; l'algoritmo termina quando la soluzione LP è intera.

    - Ogni taglio viene riscritto nelle variabili originali, reso primitivo (diviso per il massimo comune divisore dei suoi coefficienti, termine noto arrotondato per difetto) e solo allora viene aggiunta la sua variabile di slack.

    - Le incisioni funzionano bene all'inizio e poi perdono efficacia: sull'esempio dell'auto $5$ sono necessarie incisioni.

    <strong>Cruscotto dell'esempio di auto.</strong> I limiti inferiori e superiori su $z(\ILP)$ trovati finora in questo modulo:

    <div class="tabella" markdown="0"><table>
    <tr>
    <th>Capitolo</th>
    <th>Limite inferiore</th>
    <th>Limite superiore</th>
    <th>Da</th>
    </tr>
    <tr>
    <td>Bound primali e bound duali</td>
    <td><span class="arithmatex">\(14\)</span></td>
    <td><span class="arithmatex">\(15\)</span></td>
    <td>soluzione euristica <span class="arithmatex">\((4, 1)\)</span>, e <span class="arithmatex">\(\lfloor z(\LP) \rfloor\)</span> con <span class="arithmatex">\(z(\LP) = \tfrac{31}{2}\)</span></td>
    </tr>
    <tr>
    <td>Questo capitolo</td>
    <td><span class="arithmatex">\(14\)</span></td>
    <td><span class="arithmatex">\(14\)</span></td>
    <td><span class="arithmatex">\(5\)</span> tagli frazionari di Gomory</td>
    </tr>
    </table></div>

---

**Esercizi su questo capitolo:** [:material-pencil: Piani di taglio](../exercises/gomory.md)

<!-- laboratorio-interattivo: sezione generata da interattivi.py -->

## Laboratorio interattivo { #interactive-lab }

Le idee del capitolo, pratica: muovi i cursori e trascina i punti.
Ogni app apre anche una pagina completa nel [laboratorio interattivo](../lab/index.md): [Tagli di Gomory sul piano](../lab/gomory-cuts.md).

<div class="gi" data-grafico="pli-gomory"></div>
