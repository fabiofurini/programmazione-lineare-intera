---
title: "Formulazioni ideali"
---

# Formulazioni ideali

<div class="info-capitolo" markdown>

**Parte 2 · Rafforzare la formulazione · Capitolo 3** · [:material-file-pdf-box: Dispensa, volume 1 (PDF)](../pdf/dispensa-1-modelli-bound-formulazioni.pdf) · [:material-pencil: Esercizi: Formulazioni ideali](../esercizi/ideal-formulations.md)

</div>

!!! nota "Prerequisiti"

    - Da questo modulo, i capitoli «Programmazione lineare intera» e «Bound primali e bound duali»: la regione ammissibile di un problema PLI, il rilassamento lineare e il suo bound, e l'esempio dell'auto.

    - Dal modulo <em>Programmazione Lineare</em>, [Capitolo 15 «La geometria della Programmazione Lineare»](https://fabiofurini.github.io/linear-programming/advanced-methods/15-geometry/): i vertici di un poliedro, e il fatto che un problema LP con una soluzione ottima ha un vertice ottimo.

    - Dal modulo <em>Ottimizzazione convessa</em>, [Capitolo 1 «Insiemi convessi»](https://fabiofurini.github.io/convex-optimization/preliminaries/01-convex-sets/): combinazioni convesse e inviluppi convessi. In questo capitolo ne diamo un breve richiamo.

!!! chiave "Obiettivi"

    Alla fine di questo capitolo sarai in grado di:

    - calcolare l'inviluppo convesso delle soluzioni ammissibili di un piccolo problema PLI, e classificarne i punti in vertici, punti del bordo e punti interni;

    - definire una formulazione di un problema PLI, e decidere se è ideale;

    - spiegare perché un problema LP su una formulazione ideale risolve il problema PLI;

    - confrontare due formulazioni dello stesso problema attraverso i loro rilassamenti lineari;

    - spiegare perché le formulazioni ideali esistono ma sono difficili da trovare.

!!! nota "Dove eravamo"

    Nell'esempio dell'auto abbiamo il lower bound $14$ e l'upper bound $\lfloor z(\LP) \rfloor = 15$. Il gap di $\frac{1}{14}$ è dovuto al poliedro dei vincoli, che contiene punti frazionari fuori dall'inviluppo convesso dei punti interi. Questo capitolo definisce il poliedro che non lascia alcun gap.

## 3.1 L'inviluppo convesso

<a id="box-1-def-hull"></a>

!!! definizione "Definizione 3.1: inviluppo convesso"

    Dato un insieme $S \subseteq \R^n$, una <strong>combinazione convessa</strong> dei punti $\vet s^1, \vet s^2, \dots, \vet s^k \in S$ è un punto $\sum_{h=1}^k \lambda_h \, \vet s^h$ con $\lambda_h \ge 0$ e $\sum_{h=1}^k \lambda_h = 1$. L'<strong>inviluppo convesso</strong> di $S$, indicato con $\mathrm{conv}(S)$, è l'insieme di tutte le combinazioni convesse di punti di $S$.

- L'inviluppo convesso è il più piccolo insieme convesso che contiene $S$. Se $S$ è un insieme finito di punti, l'inviluppo convesso è un poliedro limitato (un <strong>politopo</strong>), e i suoi <strong>vertici</strong> sono punti di $S$. Gli altri punti di $S$ stanno sul bordo del politopo oppure al suo interno: non servono per descriverlo.

- Per un problema PLI prendiamo $S = F$, l'insieme delle soluzioni ammissibili. I vertici di $\mathrm{conv}(F)$ sono soluzioni intere ammissibili.

<a id="box-2-ex-hull-car"></a>

!!! esempio "Esempio 3.1: inviluppo convesso dell'esempio dell'auto"

    L'inviluppo convesso dei $16$ punti interi dell'esempio dell'auto ha $6$ vertici:

    $$
    (0,0), \quad (4,0), \quad (4,1), \quad (3,2), \quad (1,3), \quad (0,3).
    $$

    Degli altri $10$ punti, cinque stanno sul bordo, cioè $(0,1)$, $(0,2)$, $(1,0)$, $(2,0)$ e $(3,0)$, e cinque all'interno, cioè $(1,1)$, $(2,1)$, $(3,1)$, $(1,2)$ e $(2,2)$.

    ![Figura 1](../img/03-ideal-formulations/fig01.svg){ .fig .ovale loading=lazy  }

    <em>L'inviluppo convesso dei $16$ punti interi dell'esempio dell'auto (verde). I suoi $6$ vertici (quadrati neri) sono punti interi; altri cinque punti stanno sul bordo e cinque all'interno.</em>

## 3.2 Formulazioni e formulazioni ideali

<a id="box-3-def-formulation"></a>

!!! definizione "Definizione 3.2: formulazione"

    Una <strong>formulazione</strong> di un problema PLI con regione ammissibile $F$ è un poliedro $P = \{ \vet x \in \R^n : \sum_{j} a_{ij} \, x_j \le b_i,~ \forall i,~ x_j \ge 0,~ \forall j \}$ tale che $P \cap \Z^n = F$. Il <strong>rilassamento lineare della formulazione</strong> è il problema di massimizzare $\sum_j c_j \, x_j$ su $P$.

- Un problema PLI ha molte formulazioni: hanno in comune i punti interi e differiscono nei punti frazionari. Poiché $P$ è convesso e contiene $F$, ogni formulazione contiene l'inviluppo convesso:

    $$
    \mathrm{conv}(F) ~\subseteq~ P.
    $$

<a id="box-4-def-ideal"></a>

!!! definizione "Definizione 3.3: formulazione ideale"

    Una formulazione $P$ di un problema PLI è <strong>ideale</strong> se $P = \mathrm{conv}(F)$, cioè se la regione ammissibile del suo rilassamento lineare è esattamente l'inviluppo convesso delle soluzioni intere ammissibili.

<a id="box-5-theo-ideal"></a>

!!! teorema "Teorema 3.4: LP su una formulazione ideale"

    Sia $P$ una formulazione ideale di un problema PLI con $F \ne \emptyset$ e $P$ limitato. Allora il rilassamento lineare ha un vertice ottimo, ogni vertice ottimo è una soluzione ottima del problema PLI, e $z(\LP) = z(\ILP)$.

??? dimostrazione "Dimostrazione"

    Il poliedro $P = \mathrm{conv}(F)$ è non vuoto e limitato, quindi il problema LP ha un vertice ottimo di $P$. I vertici di $\mathrm{conv}(F)$ appartengono a $F$, quindi questo vertice è una soluzione ammissibile del problema PLI, di valore $z(\LP)$. Poiché $z(\ILP) \le z(\LP)$, il vertice è ottimo per il problema PLI. <span class="qed">□</span>

- L'algoritmo del simplesso restituisce un vertice ottimo, quindi con una formulazione ideale restituisce una soluzione intera. Se il problema LP ha più soluzioni ottime, un metodo che non restituisce vertici può dare un punto frazionario sulla faccia ottima: per questo il teorema parla di un vertice ottimo.

!!! chiave ""

    Con una formulazione ideale, un problema PLI si risolve come un problema LP: un vertice ottimo del rilassamento lineare è una soluzione ottima del problema PLI.

<a id="box-6-ex-car-not-ideal"></a>

!!! esempio "Esempio 3.2: la formulazione dell'esempio dell'auto non è ideale"

    Il punto $(\frac{7}{2},\frac{5}{2})$ appartiene al poliedro $P$ dell'esempio dell'auto ma non a $\mathrm{conv}(F)$, perché viola $x_1 + x_2 \le 5$, che tutti i vertici dell'inviluppo dell'<span style="color:#1971c2">[Esempio 3.1](#box-2-ex-hull-car)</span> soddisfano: $\mathrm{conv}(F) \subsetneq P$.

    ![Figura 2](../img/03-ideal-formulations/fig02.svg){ .fig .ovale loading=lazy  }

    <em>L'esempio dell'auto: il poliedro del rilassamento lineare (rosso) contiene l'inviluppo convesso dei punti interi (verde), e la soluzione ottima del rilassamento lineare (blu) sta fuori dall'inviluppo.</em>

<a id="box-7-ex-car-ideal"></a>

!!! esempio "Esempio 3.3: una formulazione ideale dell'esempio dell'auto"

    L'inviluppo convesso dell'esempio dell'auto è descritto dalle quattro disuguaglianze seguenti e dai vincoli di non negatività:

    $$
    \begin{array}{rrrrrrr}
    {\max} & {3}\, {x_1} & {+} & {2}\, {x_2} \\[1ex]
    \text{soggetto a} & {x_1} & {+} & {x_2} & {\le} & {5} \\[1ex]
    & {x_1} & {+} & {2}\, {x_2} & {\le} & {7} \\[1ex]
    & {x_1} &  &  & {\le} & {4} \\[1ex]
    &  &  & {x_2} & {\le} & {3} \\[1ex]
    & {x_1,} &  & {x_2} & {\ge} & {0}
    \end{array}
    $$

    Queste disuguaglianze definiscono esattamente i $6$ vertici dell'inviluppo, e gli stessi $16$ punti interi. Il rilassamento lineare di questa <strong>formulazione ideale</strong> ha la soluzione ottima $(4,1)$, che è intera, con $z(\LP) = 14 = z(\ILP)$.

    ![Figura 3](../img/03-ideal-formulations/fig03.svg){ .fig .ovale loading=lazy  }

    <em>La formulazione ideale dell'esempio dell'auto: la sua regione ammissibile (verde) è l'inviluppo convesso dei punti interi. La soluzione ottima del problema LP è il punto intero $(4,1)$ (blu).</em>

## 3.3 Confronto tra formulazioni

<a id="box-8-def-stronger"></a>

!!! definizione "Definizione 3.5: formulazione più forte"

    Date due formulazioni $P_1$ e $P_2$ dello stesso problema PLI, $P_1$ è <strong>più forte</strong> di $P_2$ se $P_1 \subseteq P_2$.

- Una formulazione più forte non dà mai un upper bound peggiore: il massimo su un insieme più piccolo non è più grande, quindi

    $$
    P_1 \subseteq P_2 \quad \Longrightarrow \quad z(\ILP) ~\le~ z(\LP_1) ~\le~ z(\LP_2).
    $$

- La formulazione ideale è la più forte di tutte, perché è contenuta in ogni formulazione. Nell'esempio dell'auto la formulazione originale dà il bound $\lfloor \frac{31}{2} \rfloor = 15$, e quella ideale dell'<span style="color:#1971c2">[Esempio 3.3](#box-7-ex-car-ideal)</span> dà il bound $14$.

!!! chiave ""

    Tra le formulazioni dello stesso problema PLI preferiamo quelle con il poliedro più piccolo: i loro rilassamenti lineari danno gli upper bound migliori, e la formulazione ideale dà il valore ottimo.

## 3.4 Esistenza delle formulazioni ideali

- Una formulazione ideale esiste per ogni problema PLI con regione ammissibile limitata o, più in generale, con dati razionali (teorema di Meyer; in questo modulo i dati sono interi). L'inviluppo convesso dei punti interi è un poliedro, quindi è descritto da un numero finito di disuguaglianze lineari.

- Trovare la formulazione ideale è in generale molto difficile. Può servire un numero esponenziale di disuguaglianze, e trovare quelle necessarie è spesso difficile quanto risolvere il problema PLI stesso.

- In pratica teniamo la formulazione che abbiamo e aggiungiamo, passo dopo passo, disuguaglianze soddisfatte da tutti i punti interi che tagliano punti frazionari: le <strong>disuguaglianze valide</strong> del prossimo capitolo.

## 3.5 Errori tipici

!!! attenzione "Attenzione"

    - <strong>Credere che i punti che non sono vertici stiano strettamente all'interno dell'inviluppo.</strong> Possono stare sul bordo, come $(0,1)$ e $(3,0)$ nell'esempio dell'auto.

    - <strong>Controllare solo la soluzione ottima.</strong> Una formulazione può restituire una soluzione ottima intera senza essere ideale: l'ottimo del rilassamento lineare può essere intero per una funzione obiettivo e frazionario per un'altra.

    - <strong>Credere che ogni formulazione sia ideale.</strong> La formulazione dell'esempio dell'auto ha i punti interi giusti, ma contiene punti frazionari fuori dall'inviluppo.

    - <strong>Aggiungere disuguaglianze che eliminano punti interi.</strong> Una formulazione deve conservare tutti i punti di $F$: il poliedro può restringersi solo fino all'inviluppo convesso, mai oltre.

## 3.6 In sintesi

!!! chiave "In sintesi"

    - L'inviluppo convesso delle soluzioni ammissibili è il più piccolo poliedro che le contiene, e i suoi vertici sono soluzioni intere ammissibili.

    - Una formulazione è ideale se il suo poliedro è l'inviluppo convesso; allora un vertice ottimo del rilassamento lineare è una soluzione ottima del problema PLI.

    - Una formulazione più forte, con un poliedro più piccolo, non dà mai un bound peggiore.

    - L'esempio dell'auto ha una formulazione ideale con $4$ disuguaglianze, che dà $z(\LP) = 14 = z(\ILP)$.

    - Le formulazioni ideali esistono per dati razionali, ma in generale richiedono un numero esponenziale di disuguaglianze e sono difficili da trovare.

    <strong>Cruscotto dell'esempio dell'auto.</strong> I bound su $z(\ILP)$ trovati finora in questo modulo:

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
    <td>Formulazioni ideali</td>
    <td><span class="arithmatex">\(14\)</span></td>
    <td><span class="arithmatex">\(14\)</span></td>
    <td>formulazione ideale, vertice ottimo <span class="arithmatex">\((4,1)\)</span></td>
    </tr>
    </table></div>

---

**Esercizi su questo capitolo:** [:material-pencil: Formulazioni ideali](../esercizi/ideal-formulations.md)
