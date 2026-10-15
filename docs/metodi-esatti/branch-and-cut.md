---
title: "Il branch-and-cut"
---

# Il branch-and-cut

<div class="info-capitolo" markdown>

**Parte 3 · Metodi esatti · Capitolo 8** · [:material-file-pdf-box: Dispensa, volume 2 (PDF)](../pdf/dispensa-2-metodi-esatti.pdf) · [:material-pencil: Esercizi: Branch-and-cut](../esercizi/branch-and-cut.md)

</div>

!!! nota "Prerequisiti"

    - Da questo modulo, i capitoli «Disuguaglianze valide» e «Disuguaglianze di copertura»: le disuguaglianze valide e la separazione di una disuguaglianza violata di una famiglia.

    - Da questo modulo, il capitolo «Algoritmo dei piani di taglio»: i tagli frazionari di Gomory e la riottimizzazione del problema LP con l'algoritmo del simplesso duale dopo l'inserimento di un taglio.

    - Da questo modulo, il capitolo «Branch-and-bound basato sul rilassamento lineare»: la lista dei problemi LP, i criteri di potatura e le strategie di selezione della variabile e del nodo di branching.

!!! chiave "Obiettivi"

    Alla fine di questo capitolo sarai in grado di:

    - spiegare come i piani di taglio e le operazioni di branching si completano a vicenda;

    - distinguere le disuguaglianze valide globali e locali, e dire dove si può usare un taglio;

    - descrivere gli algoritmi cut-and-branch e branch-and-cut, e il ruolo del pool di tagli;

    - eseguire a mano un algoritmo cut-and-branch con tagli di Gomory su un piccolo problema PLI e confrontare la dimensione dell'albero con e senza tagli;

    - generare un taglio locale in un nodo di branching e riottimizzare con l'algoritmo del simplesso duale.

## 8.1 Algoritmi branch-and-cut

<a id="box-1-def-bc"></a>

!!! definizione "Definizione 8.1: algoritmo branch-and-cut"

    Dato un problema PLI in forma canonica di massimo con dati interi, un <strong>algoritmo branch-and-cut</strong> è un algoritmo branch-and-bound in cui i problemi LP dei nodi di branching sono rafforzati con piani di taglio prima del branching.

- Un <strong>algoritmo dei piani di taglio</strong> avvicina il rilassamento lineare all'inviluppo convesso delle soluzioni intere, ma i tagli frazionari di Gomory perdono efficacia dopo le prime iterazioni (<strong>tailing off</strong>).

- Un <strong>algoritmo branch-and-bound</strong> suddivide la regione ammissibile in problemi LP più piccoli, ma partendo da un rilassamento lineare debole ha bisogno di un albero grande.

!!! chiave ""

    I tagli abbassano i bound dei nodi, così più nodi vengono potati per bound; il branching garantisce la terminazione quando i tagli non sono più efficaci.

- Tutti i solver MIP moderni si basano su algoritmi branch-and-cut (si veda il capitolo «Solver MIP: cosa fanno»).

## 8.2 Disuguaglianze valide globali e locali

- In un algoritmo branch-and-bound, il problema $\LP_k$ di un nodo di branching $k$ è il rilassamento lineare con i vincoli di branching del cammino dalla radice al nodo $k$.

- Indichiamo con $F$ l'insieme delle soluzioni intere ammissibili del problema PLI, e con $F_k \subseteq F$ l'insieme di quelle che soddisfano i vincoli di branching del nodo $k$. Nel nodo radice $F_1 = F$.

<a id="box-2-def-global-local"></a>

!!! definizione "Definizione 8.2: disuguaglianze valide globali e locali"

    Una disuguaglianza lineare $\vet\alpha\T\vet x \le \beta$ si chiama:

    1. <strong>disuguaglianza globalmente valida</strong> (o <strong>taglio globale</strong>) se è soddisfatta da tutte le soluzioni in $F$;

    2. <strong>disuguaglianza localmente valida</strong> per il nodo di branching $k$ (o <strong>taglio locale</strong>) se è soddisfatta da tutte le soluzioni in $F_k$.

- Poiché $F_k \subseteq F$, ogni taglio globale è anche un taglio locale di ogni nodo. Il viceversa è falso: un taglio locale può eliminare soluzioni intere ammissibili che appartengono ad altri rami dell'albero.

- Un taglio locale del nodo $k$ è valido per tutti i nodi del sottoalbero con radice in $k$, e <u>non</u> deve essere usato fuori da questo sottoalbero.

!!! chiave ""

    Un taglio derivato solo dai vincoli originali (e da altri tagli globali) è <strong>globale</strong>. Un taglio la cui derivazione usa un vincolo di branching è, in generale, solo <strong>locale</strong>.

- Un taglio frazionario di Gomory generato nel nodo radice è globale: deriva dai soli vincoli originali, e lo stesso vale per una disuguaglianza di una famiglia (come le disuguaglianze di copertura di un vincolo a coefficienti positivi) separata a partire da essi. Un taglio frazionario di Gomory generato da una riga che contiene la variabile di scarto di un vincolo di branching con coefficiente non nullo si tratta come locale.

## 8.3 Cut-and-branch e branch-and-cut

<a id="box-3-def-cb"></a>

!!! definizione "Definizione 8.3: algoritmo cut-and-branch"

    Un <strong>algoritmo cut-and-branch</strong> esegue un algoritmo dei piani di taglio nel nodo radice per un numero limitato di <strong>round di tagli</strong>, aggiunge al problema PLI i tagli trovati, e poi esegue un algoritmo branch-and-bound sul problema rafforzato. Negli altri nodi non si generano tagli.

- Tutti i tagli della radice sono globali: nel nodo radice non c'è alcun vincolo di branching.

- In un <strong>algoritmo branch-and-cut</strong> i tagli si generano anche negli altri nodi (in tutti, o in alcuni, per esempio ogni dieci livelli dell'albero). I tagli possono essere globali o locali.

- In ogni nodo la generazione dei tagli si ferma quando la soluzione del problema $\LP_k$ è intera o il nodo può essere potato; quando non si trova alcun taglio violato; quando si raggiunge un numero massimo di round; o quando la diminuzione di $z(\LP_k)$ negli ultimi round è piccola (tailing off).

### 8.3.1 Il pool di tagli

- I tagli si memorizzano in una struttura dati chiamata <strong>pool di tagli</strong> (cut pool). Prima di chiamare le procedure (più costose) di generazione dei tagli, l'algoritmo controlla se un taglio del pool è violato da $\tilde{\vet x}(\LP_k)$.

- I tagli globali si memorizzano in un <strong>pool globale</strong>, utilizzabile in ogni nodo. I tagli locali si memorizzano con il loro nodo e sono ereditati solo dai suoi discendenti.

- Ogni taglio aggiunge un vincolo ai problemi LP. I tagli che restano inattivi per molte iterazioni si tolgono dal problema LP e si conservano solo nel pool.

### 8.3.2 Pseudocodice ad alto livello

- L'algoritmo branch-and-cut ha lo pseudocodice dell'algoritmo branch-and-bound (stesse operazioni di branching, stessi criteri di potatura, stessa lista $L$): cambia solo la <strong>sottoprocedura di soluzione del nodo di branching</strong>.

!!! algoritmo "Algoritmo"

    - <strong>Input:</strong> Un problema $\LP_k$ associato a un nodo di branching, il pool di tagli e un numero massimo $R$ di round di tagli.

    - **Passo 1:** <strong>Operazioni di bounding</strong>

        Risolvere il problema $\LP_k$.

        1. se il problema $\LP_k$ è inammissibile, allora <code>STOP</code>.

        2. se $\left\lfloor z(\LP_k) \right\rfloor \le \LB$, allora <code>STOP</code>.

        3. se ${\tilde{\vet x}}(\LP_k)$ è intera, allora aggiornare il <strong>lower bound</strong> e la <strong>soluzione incumbent</strong>, togliere dalla lista $L$ tutti i problemi LP con $\left\lfloor z(\LP) \right\rfloor \le \LB$ e <code>STOP</code>.

    - **Passo 2:** <strong>Generazione dei tagli</strong>

        Se sono stati eseguiti $R$ round di tagli nel nodo $k$, andare al Passo 3. Altrimenti:

        1. cercare nel pool di tagli i tagli violati da ${\tilde{\vet x}}(\LP_k)$; se non se ne trova nessuno, generare nuovi tagli violati e memorizzarli nel pool (i tagli globali nel pool globale, quelli locali con il nodo $k$);

        2. se non esiste alcun taglio violato, andare al Passo 3. Altrimenti aggiungere i tagli al problema $\LP_k$, riottimizzarlo e andare al Passo 1.

    - **Passo 3:** <strong>Inserimento nella lista</strong>

        Inserire il problema $\LP_k$ (con i suoi tagli) nella lista $L$ e <code>STOP</code>.

- Con $R = 0$ in ogni nodo tranne la radice otteniamo un algoritmo cut-and-branch; con $R = 0$ in ogni nodo otteniamo l'algoritmo branch-and-bound.

- Lo pseudocodice non dice come si generano i tagli né come si riottimizza il problema LP. Dopo l'inserimento di un taglio il dizionario è duale ammissibile, quindi l'<strong>algoritmo del simplesso duale</strong> parte dal dizionario ottimo del problema precedente, come dopo un vincolo di branching.

## 8.4 Esempio svolto: cut-and-branch con tagli di Gomory { #sez-sec-bc-example }

- Usiamo il problema $P10$ del catalogo dei problemi MIP: massimizzare $5x_1+2x_2$ soggetto a $-x_1+3x_2\le 12$, $x_1+2x_2\le 12$, $3x_1-2x_2\le 8$, $x_1,x_2\in\Z_{\ge 0}$. La sua unica soluzione ottima è $\tilde{\vet x}(\ILP) = (4,4)$, con $z(\ILP) = 28$.

- I tagli sono i tagli frazionari di Gomory del capitolo sull'algoritmo dei piani di taglio, con la stessa regola: la riga con il termine noto frazionario più grande e, in caso di pareggio, l'indice minimo.

- Poiché i dati sono interi, il bound di un nodo è $\lfloor z(\LP_k) \rfloor$. Tutte le esecuzioni usano le stesse regole: la regola dell'indice minimo come strategia di selezione della variabile di branching, la regola LIFO come strategia di selezione del nodo di branching, il nodo di branching verso il basso risolto per primo, e $\LB = -\infty$ all'inizio.

<a id="box-4-ex-bc-run-pure"></a>

!!! esempio "Esempio 8.1: branch-and-bound senza tagli"

    Il problema $\LP_1$ è il rilassamento lineare di $P10$. Una soluzione ottima è $\tilde{\vet x}(\LP_1) = (5,\tfrac{7}{2})$, con $z(\LP_1) = 32$ e $\UB = 32$. L'algoritmo branch-and-bound risolve $5$ problemi LP:

    ![Figura 1](../img/08-branch-and-cut/fig01.svg){ .fig loading=lazy  }

    <div class="tabella" markdown="0"><table>
    <tr>
    <th>Nodo</th>
    <th>Padre</th>
    <th>Branching</th>
    <th><span class="arithmatex">\(\tilde{\vet x}(\LP_k)\)</span></th>
    <th><span class="arithmatex">\(z(\LP_k)\)</span></th>
    <th><span class="arithmatex">\(\LB\)</span></th>
    <th>Esito</th>
    </tr>
    <tr>
    <td>1</td>
    <td>–</td>
    <td>–</td>
    <td><span class="arithmatex">\((5, \tfrac{7}{2})\)</span></td>
    <td><span class="arithmatex">\(32\)</span></td>
    <td><span class="arithmatex">\(-\infty\)</span></td>
    <td>branching su <span class="arithmatex">\(x_2\)</span></td>
    </tr>
    <tr>
    <td>2</td>
    <td>1</td>
    <td><span class="arithmatex">\(x_2 \le 3\)</span></td>
    <td><span class="arithmatex">\((\tfrac{14}{3}, 3)\)</span></td>
    <td><span class="arithmatex">\(\tfrac{88}{3}\)</span></td>
    <td><span class="arithmatex">\(-\infty\)</span></td>
    <td>branching su <span class="arithmatex">\(x_1\)</span></td>
    </tr>
    <tr>
    <td>3</td>
    <td>1</td>
    <td><span class="arithmatex">\(x_2 \ge 4\)</span></td>
    <td><span class="arithmatex">\((4, 4)\)</span></td>
    <td><span class="arithmatex">\(28\)</span></td>
    <td><span class="arithmatex">\(28\)</span></td>
    <td>potato per integralità</td>
    </tr>
    <tr>
    <td>4</td>
    <td>2</td>
    <td><span class="arithmatex">\(x_1 \le 4\)</span></td>
    <td><span class="arithmatex">\((4, 3)\)</span></td>
    <td><span class="arithmatex">\(26\)</span></td>
    <td><span class="arithmatex">\(28\)</span></td>
    <td>potato per integralità</td>
    </tr>
    <tr>
    <td>5</td>
    <td>2</td>
    <td><span class="arithmatex">\(x_1 \ge 5\)</span></td>
    <td>–</td>
    <td>–</td>
    <td><span class="arithmatex">\(28\)</span></td>
    <td>potato per inammissibilità</td>
    </tr>
    </table></div>

<a id="box-5-ex-bc-run-cb"></a>

!!! esempio "Esempio 8.2: cut-and-branch con un taglio di Gomory"

    - <span style="color:#e03131"><strong>Radice: generazione dei tagli.</strong></span> Le due righe del dizionario ottimo di $\LP_1$ con termine noto frazionario, le righe di $x_2$ e di $x_3$, hanno lo stesso termine noto $\frac{1}{2}$; usiamo la riga di $x_2$, che ha l'indice minore. Con le variabili di scarto $x_4 = 12 - x_1 - 2x_2$ e $x_5 = 8 - 3x_1 + 2x_2$ il taglio è

        $$
        \tfrac{3}{8}\,x_4 + \tfrac{7}{8}\,x_5 \ge \tfrac{1}{2}
        \qquad\Longleftrightarrow\qquad
        3\,x_1 - x_2 \le 11 .
        $$

        È un taglio globale, ed esclude $\tilde{\vet x}(\LP_1)$: $3 \cdot 5 - \frac{7}{2} = \frac{23}{2} > 11$.

    - <span style="color:#e03131"><strong>Radice: riottimizzazione.</strong></span> Aggiungiamo il taglio al problema $\LP_1$ e lo riottimizziamo con l'algoritmo del simplesso duale. Una soluzione ottima è

        $$
        \tilde{\vet x}(\LP_1) = (\tfrac{34}{7},\tfrac{25}{7}), \qquad z(\LP_1) = \tfrac{220}{7}, \qquad \UB = 31 .
        $$

    - <span style="color:#e03131"><strong>Branch-and-bound.</strong></span> L'algoritmo branch-and-bound parte ora da questo problema $\LP_1$. Ogni nodo eredita il taglio. Risolve $3$ problemi LP invece di $5$:

    ![Figura 2](../img/08-branch-and-cut/fig02.svg){ .fig loading=lazy  }

    <div class="tabella" markdown="0"><table>
    <tr>
    <th>Nodo</th>
    <th>Padre</th>
    <th>Branching</th>
    <th><span class="arithmatex">\(\tilde{\vet x}(\LP_k)\)</span></th>
    <th><span class="arithmatex">\(z(\LP_k)\)</span></th>
    <th><span class="arithmatex">\(\LB\)</span></th>
    <th>Esito</th>
    </tr>
    <tr>
    <td>1</td>
    <td>–</td>
    <td>–</td>
    <td><span class="arithmatex">\((\tfrac{34}{7}, \tfrac{25}{7})\)</span></td>
    <td><span class="arithmatex">\(\tfrac{220}{7}\)</span></td>
    <td><span class="arithmatex">\(-\infty\)</span></td>
    <td>branching su <span class="arithmatex">\(x_1\)</span></td>
    </tr>
    <tr>
    <td>2</td>
    <td>1</td>
    <td><span class="arithmatex">\(x_1 \le 4\)</span></td>
    <td><span class="arithmatex">\((4, 4)\)</span></td>
    <td><span class="arithmatex">\(28\)</span></td>
    <td><span class="arithmatex">\(28\)</span></td>
    <td>potato per integralità</td>
    </tr>
    <tr>
    <td>3</td>
    <td>1</td>
    <td><span class="arithmatex">\(x_1 \ge 5\)</span></td>
    <td>–</td>
    <td>–</td>
    <td><span class="arithmatex">\(28\)</span></td>
    <td>potato per inammissibilità</td>
    </tr>
    </table></div>

- Un solo taglio di Gomory riduce il numero di problemi LP da $5$ a $3$. Il taglio non trova la soluzione ottima: sposta la soluzione ottima del problema LP della radice, così che l'algoritmo fa branching su $x_1$ e il nodo $x_1 \le 4$ dà subito la soluzione ottima.

- Un secondo round di tagli, nello stesso algoritmo cut-and-branch, dà una soluzione intera nella radice. La riga di $x_1$ ha il termine noto più grande, $\frac{6}{7}$; con la variabile di scarto $x_6 = 11 - 3x_1 + x_2$ del primo taglio il nuovo taglio è

    $$
    \tfrac{1}{7}\,x_4 + \tfrac{2}{7}\,x_6 \ge \tfrac{6}{7}
    \qquad\Longleftrightarrow\qquad
    x_1 \le 4 .
    $$

- La soluzione ottima del nuovo problema $\LP_1$ è $(4,4)$, con $z(\LP_1) = 28$. Il nodo è potato per interezza, e l'algoritmo si ferma con $\LB = \UB = 28$ dopo aver risolto un solo problema LP.

<div class="tabella" markdown="0"><table>
<tr>
<th>Tagli aggiunti nella radice</th>
<th><span class="arithmatex">\(z(\LP_1)\)</span></th>
<th><span class="arithmatex">\(\UB\)</span> nella radice</th>
<th>Problemi LP risolti</th>
</tr>
<tr>
<td>nessuno (branch-and-bound)</td>
<td><span class="arithmatex">\(32\)</span></td>
<td><span class="arithmatex">\(32\)</span></td>
<td><span class="arithmatex">\(5\)</span></td>
</tr>
<tr>
<td><span class="arithmatex">\(3 \, x_1 - x_2 \le 11\)</span></td>
<td><span class="arithmatex">\(\tfrac{220}{7}\)</span></td>
<td><span class="arithmatex">\(31\)</span></td>
<td><span class="arithmatex">\(3\)</span></td>
</tr>
<tr>
<td><span class="arithmatex">\(3 \, x_1 - x_2 \le 11\)</span> e <span class="arithmatex">\(x_1 \le 4\)</span></td>
<td><span class="arithmatex">\(28\)</span></td>
<td><span class="arithmatex">\(28\)</span></td>
<td><span class="arithmatex">\(1\)</span></td>
</tr>
</table></div>

- Più i tagli sono forti, più l'albero è piccolo, fino a ridursi al solo nodo radice.

- Non è la regola. La tabella seguente riporta lo stesso algoritmo sul problema $P2$ del catalogo (massimizzare $x_1+3x_2$ soggetto a $-4x_1+10x_2\le 35$, $3x_1+x_2\le 12$, $x_1,x_2\in\Z_{\ge 0}$, con $z(\ILP) = 14$) per un numero crescente di round di tagli di Gomory.

<div class="tabella" markdown="0"><table>
<tr>
<th>Round</th>
<th>Ultimo taglio aggiunto</th>
<th><span class="arithmatex">\(z(\LP_1)\)</span></th>
<th><span class="arithmatex">\(\UB\)</span> nella radice</th>
<th>Problemi LP risolti</th>
</tr>
<tr>
<td><span class="arithmatex">\(0\)</span></td>
<td>–</td>
<td><span class="arithmatex">\(16\)</span></td>
<td><span class="arithmatex">\(16\)</span></td>
<td><span class="arithmatex">\(4\)</span></td>
</tr>
<tr>
<td><span class="arithmatex">\(1\)</span></td>
<td><span class="arithmatex">\(-3 \, x_1 + 10 \, x_2 \le 37\)</span></td>
<td><span class="arithmatex">\(\tfrac{524}{33}\)</span></td>
<td><span class="arithmatex">\(15\)</span></td>
<td><span class="arithmatex">\(4\)</span></td>
</tr>
<tr>
<td><span class="arithmatex">\(2\)</span></td>
<td><span class="arithmatex">\(x_1 + 3 \, x_2 \le 15\)</span></td>
<td><span class="arithmatex">\(15\)</span></td>
<td><span class="arithmatex">\(15\)</span></td>
<td><span class="arithmatex">\(4\)</span></td>
</tr>
<tr>
<td><span class="arithmatex">\(3\)</span></td>
<td><span class="arithmatex">\(-x_1 + 5 \, x_2 \le 19\)</span></td>
<td><span class="arithmatex">\(15\)</span></td>
<td><span class="arithmatex">\(15\)</span></td>
<td><span class="arithmatex">\(4\)</span></td>
</tr>
<tr>
<td><span class="arithmatex">\(4\)</span></td>
<td><span class="arithmatex">\(x_2 \le 4\)</span></td>
<td><span class="arithmatex">\(\tfrac{44}{3}\)</span></td>
<td><span class="arithmatex">\(14\)</span></td>
<td><span class="arithmatex">\(2\)</span></td>
</tr>
<tr>
<td><span class="arithmatex">\(5\)</span></td>
<td><span class="arithmatex">\(x_1 + x_2 \le 6\)</span></td>
<td><span class="arithmatex">\(14\)</span></td>
<td><span class="arithmatex">\(14\)</span></td>
<td><span class="arithmatex">\(1\)</span></td>
</tr>
</table></div>

- I primi tre tagli abbassano $z(\LP_1)$ da $16$ a $15$, ma l'albero ha sempre $4$ nodi; servono $5$ round per arrivare al solo nodo radice. L'upper bound migliora lentamente, come nel <strong>tailing off</strong> dell'algoritmo dei piani di taglio.

- Un algoritmo cut-and-branch deve decidere quando smettere di tagliare e cominciare il branching: il costo di ogni round si paga in ogni nodo dell'albero.

## 8.5 Tagli locali: un esempio

- Usiamo l'esempio delle automobili ($x_1$ auto sportive e $x_2$ auto familiari): massimizzare $3x_1+2x_2$ soggetto a $10x_1+4x_2\le 45$, $4x_1+14x_2\le 49$, $x_1,x_2\in\Z_{\ge 0}$. Nell'algoritmo branch-and-bound senza tagli, il nodo $3$ è il figlio verso l'alto della radice, con il vincolo di branching $x_1 \ge 4$ e la variabile di scarto $x_5 = x_1 - 4$.

- Il dizionario ottimo del problema $\LP_3$, con $\tilde{\vet x}(\LP_3) = (4,\tfrac{5}{4})$ e $z(\LP_3) = \tfrac{29}{2}$, è:

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

<a id="box-6-ex-bc-local"></a>

!!! esempio "Esempio 8.3: un taglio locale nel nodo 3"

    - <strong>Un taglio locale semplice.</strong> Da $10\,x_1 + 4\,x_2 \le 45$ e dal vincolo di branching $x_1 \ge 4$ abbiamo

        $$
        4\,x_2 \le 45 - 10\,x_1 \le 45 - 10 \cdot 4 = 5
        \quad\Longrightarrow\quad
        x_2 \le \tfrac{5}{4}
        \quad\Longrightarrow\quad
        x_2 \le 1 .
        $$

    - La disuguaglianza $x_2 \le 1$ è valida per tutte le soluzioni in $F_3$, ma <strong>non è globalmente valida</strong>: la soluzione intera ammissibile $(3,2)$, di valore $13$, la viola. È un taglio locale del nodo $3$.

    - La aggiungiamo al problema $\LP_3$, con la variabile di scarto $x_6 = 1 - x_2$, e riottimizziamo.

    - Il taglio si inserisce con la variabile di scarto $x_6 \ge 0$. La nuova riga è

        $$
        x_6 = -\dfrac{1}{4} + \dfrac{1}{4} \, x_3 + \dfrac{5}{2} \, x_5.
        $$

    - Il dizionario seguente è <strong>duale ammissibile</strong> ma non primale ammissibile, perché $\bar b_{6} = -\dfrac{1}{4} < 0$:

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

    - <strong>Operazione di pivot duale.</strong> La riga pivot è quella di $x_6$, l'unica variabile in base con valore negativo. I rapporti delle variabili fuori base con $\bar a_{6j} < 0$ sono

        $$
        \frac{\bar c_{3}}{\bar a_{6,3}} = \frac{-\tfrac{1}{2}}{-\tfrac{1}{4}} = 2,\qquad \frac{\bar c_{5}}{\bar a_{6,5}} = \frac{-2}{-\tfrac{5}{2}} = \dfrac{4}{5}.
        $$

    - La colonna pivot è quella di $x_5$, con $s_m = \dfrac{4}{5}$, e il valore obiettivo diventa $\bar z + s_m \, \bar b_{6} = \dfrac{29}{2} + \dfrac{4}{5} \cdot \left(-\dfrac{1}{4}\right) = \dfrac{143}{10}$. Il nuovo dizionario è primale e duale ammissibile, quindi ottimo:

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

    - La soluzione $\tilde{\vet x}(\LP_3) = (\tfrac{41}{10},1)$, di valore $\tfrac{143}{10}$, è la stessa che dà il figlio verso il basso del nodo $3$: qui il taglio locale fa da vincolo di branching, senza creare un nuovo nodo.

<a id="box-7-ex-bc-local-gomory"></a>

!!! esempio "Esempio 8.4: un taglio frazionario di Gomory nel nodo 3"

    - La riga di $x_2$ del dizionario del nodo $3$ dà il taglio frazionario di Gomory

    $$
    \dfrac{1}{4} \, x_3 + \dfrac{1}{2} \, x_5 \ge \dfrac{1}{4}
    $$

    - Contiene la variabile di scarto $x_5$ del vincolo di branching $x_1 \ge 4$, quindi la sua derivazione usa questo vincolo e l'algoritmo lo tratta come un <strong>taglio locale</strong>.

    - Nello spazio delle variabili originali ($x_3 = 45 - 10\,x_1 - 4\,x_2$, $x_5 = x_1 - 4$, moltiplicando per $4$) si scrive $2\,x_1 + x_2 \le 9$. Enumerando le $16$ soluzioni intere ammissibili si vede che questa disuguaglianza è valida per tutte.

    - L'algoritmo non può fare questo controllo in un nodo, quindi tiene il taglio come locale.

## 8.6 Aspetti pratici

### 8.6.1 Selezione dei tagli

- A ogni round possono essere disponibili molti tagli violati; aggiungerli tutti rende i problemi LP grandi e lenti da riottimizzare. Un algoritmo branch-and-cut ne seleziona un sottoinsieme.

- L'<strong>efficacia</strong> di un taglio $\vet\alpha\T\vet x \le \beta$ nella soluzione frazionaria $\tilde{\vet x}(\LP_k)$ è la distanza euclidea di $\tilde{\vet x}(\LP_k)$ dall'iperpiano $\vet\alpha\T\vet x = \beta$:

    $$
    \text{efficacia} = \frac{\vet\alpha\T\,\tilde{\vet x}(\LP_k) - \beta}{\|\vet\alpha\|_2}.
    $$

- A differenza della violazione $\vet\alpha\T\tilde{\vet x}(\LP_k) - \beta$, l'efficacia non cambia se il taglio si moltiplica per una costante positiva. Le regole di selezione combinano l'efficacia con una misura del <strong>parallelismo</strong> dei tagli.

- Per esempio, in $\tilde{\vet x}(\LP_1) = (5,\tfrac{7}{2})$ di $P10$ il taglio $3x_1 - x_2 \le 11$ ha violazione $\frac{1}{2}$ ed efficacia $\frac{1}{2\sqrt{10}} \approx 0.158$, mentre lo stesso taglio moltiplicato per $2$, $6x_1 - 2x_2 \le 22$, ha violazione $1$ e la stessa efficacia $\frac{1}{\sqrt{40}} \approx 0.158$.

### 8.6.2 Quali tagli

- Si può usare qualunque famiglia di disuguaglianze valide con una procedura di separazione: i tagli frazionari di Gomory (per problemi PLI con dati interi), le disuguaglianze di copertura per i vincoli $\sum_j a_j x_j \le b$ a coefficienti positivi di un problema MIP con variabili binarie, e famiglie che sfruttano la struttura di un modello specifico.

- I tagli frazionari di Gomory vengono dalle righe del dizionario ottimo, quindi sono sempre disponibili. In aritmetica floating point i loro coefficienti risentono degli errori di arrotondamento, e i solver scartano i tagli con coefficienti molto grandi o molto piccoli.

### 8.6.3 Upper bound e gap

- Come nell'algoritmo branch-and-bound, se la lista $L$ non è vuota abbiamo

    $$
    z(\ILP) ~~\le~~ \UB ~=~ \max_{k \in L} \left\{~ \mathrm{UB}(\LP_k) ~\right\},
    $$

    dove ora $z(\LP_k)$ è il valore ottimo del problema $\LP_k$ <u>dopo</u> i tagli.

- I tagli abbassano i valori $z(\LP_k)$ e, di conseguenza, l'upper bound $\UB$ e il gap di ottimalità $\frac{\UB - \LB}{|\LB|}$.

## 8.7 Errori tipici

!!! attenzione "Attenzione"

    - <strong>Usare un taglio locale fuori dal suo sottoalbero.</strong> Un taglio derivato con un vincolo di branching del nodo $k$ è valido solo nel sottoalbero del nodo $k$: in un altro ramo può eliminare una soluzione ottima.

    - <strong>Trattare un taglio come globale senza una dimostrazione.</strong> Un taglio frazionario di Gomory generato in un nodo può essere globale per caso ([Esempio 8.4](#box-7-ex-bc-local-gomory)); l'algoritmo lo tiene locale, a meno che la sua derivazione non usi vincoli di branching.

    - <strong>Aggiungere tutti i tagli violati.</strong> Troppi tagli rallentano i problemi LP; meglio pochi tagli efficaci per round, togliendo quelli inattivi.

    - <strong>Credere che ogni taglio riduca l'albero.</strong> Su $P2$ i primi tre tagli di Gomory lasciano l'albero a $4$ nodi (tabella della Sezione [8.4](#sez-sec-bc-example)); conta la qualità dei tagli.

    - <strong>Scegliere come più forte il taglio di efficacia massima.</strong> L'efficacia si misura solo nel punto corrente: un taglio dominato può avere in quel punto un'efficacia maggiore.

    - <strong>Dimenticare che i tagli abbassano il bound, non il valore ottimo.</strong> Il valore ottimo $z(\ILP)$ non cambia mai: cambiano solo $z(\LP_k)$ e l'upper bound.

## 8.8 In sintesi

!!! chiave "In sintesi"

    - Un algoritmo branch-and-cut rafforza con tagli il problema LP di ogni nodo prima del branching.

    - Un taglio globale è valido per tutte le soluzioni intere; un taglio locale solo per quelle di un sottoalbero, e si memorizza con il suo nodo.

    - Un algoritmo cut-and-branch genera tagli solo nella radice; i tagli sono quindi globali.

    - Dopo un taglio, il problema LP si riottimizza con l'algoritmo del simplesso duale a partire dal dizionario precedente.

    - I tagli riducono la dimensione dell'albero, ma solo se sono efficaci: su $P10$ un taglio di Gomory riduce l'albero da $5$ a $3$ problemi LP, e due tagli a $1$.

    <strong>Cruscotto di $P10$.</strong> I lower e upper bound su $z(\ILP) = 28$ trovati in questo capitolo:

    <div class="tabella" markdown="0"><table>
    <tr>
    <th>Fase</th>
    <th>Lower bound</th>
    <th>Upper bound</th>
    <th>Da</th>
    </tr>
    <tr>
    <td>Rilassamento lineare di <span class="arithmatex">\(P10\)</span></td>
    <td>—</td>
    <td><span class="arithmatex">\(32\)</span></td>
    <td><span class="arithmatex">\(z(\LP) = 32\)</span>, <span class="arithmatex">\(\tilde{\vet x}(\LP) = (5,\tfrac{7}{2})\)</span></td>
    </tr>
    <tr>
    <td>Branch-and-bound</td>
    <td><span class="arithmatex">\(28\)</span></td>
    <td><span class="arithmatex">\(28\)</span></td>
    <td><span class="arithmatex">\(5\)</span> problemi LP risolti</td>
    </tr>
    <tr>
    <td>Dopo il primo taglio di Gomory</td>
    <td>—</td>
    <td><span class="arithmatex">\(31\)</span></td>
    <td><span class="arithmatex">\(z(\LP_1) = \tfrac{220}{7}\)</span></td>
    </tr>
    <tr>
    <td>Cut-and-branch con un solo taglio</td>
    <td><span class="arithmatex">\(28\)</span></td>
    <td><span class="arithmatex">\(28\)</span></td>
    <td><span class="arithmatex">\(3\)</span> problemi LP risolti</td>
    </tr>
    <tr>
    <td>Dopo il secondo taglio di Gomory</td>
    <td><span class="arithmatex">\(28\)</span></td>
    <td><span class="arithmatex">\(28\)</span></td>
    <td><span class="arithmatex">\(\tilde{\vet x}(\LP_1) = (4,4)\)</span> è intera, <span class="arithmatex">\(1\)</span> problema LP risolto</td>
    </tr>
    </table></div>

Come i solver MIP combinano queste idee è l'argomento del capitolo «Solver MIP».

---

**Esercizi su questo capitolo:** [:material-pencil: Branch-and-cut](../esercizi/branch-and-cut.md)
