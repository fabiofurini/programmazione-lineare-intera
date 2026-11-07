---
title: Programmazione lineare intera
hide:
  - navigation
  - toc
---

<div class="hero" markdown>

# Programmazione lineare intera

<!-- collana-riga -->
<p class="collana-riga" markdown>Un corso della collana <b>Ricerca Operativa e Matematica</b> · [tutti i corsi](#la-collana)</p>
<!-- /collana-riga -->

Materiale didattico ideato e sviluppato da **[Fabio Furini](https://fabiofurini.github.io/)**, professore
associato al [DIAG](https://www.diag.uniroma1.it/), Sapienza Università di Roma.

**Le dispense del corso, online**: programmazione lineare intera e mista, rilassamento lineare e bound, disuguaglianze valide, piani di taglio, branch-and-bound e branch-and-cut, solver MIP ed euristiche, con definizioni, esempi svolti passo per passo ed esercizi con soluzioni.

[Comincia :material-arrow-right:](modelli-e-bound/index.md){ .md-button .md-button--primary }
[:material-pencil: Esercizi](esercizi/index.md){ .md-button }
[:material-gesture-tap: Laboratorio](laboratorio/index.md){ .md-button }
[:material-clipboard-check-outline: Quiz](autovalutazione.md){ .md-button }
[:material-download: Materiale](materiale.md){ .md-button }

</div>

<!-- collana-app -->
## Provalo subito

Il branch-and-bound passo per passo: ogni nodo risolve un rilassamento lineare e divide la regione su una variabile frazionaria.

<div class="gi" data-grafico="pli-bb"></div>

[:material-gesture-tap: Altre app nel laboratorio](laboratorio/index.md){ .md-button }
<!-- /collana-app -->

## Le parti del corso

<div class="grid cards" markdown>

-   :material-sigma: **I · Modelli e bound**

    ---

    Che cos'è un problema di programmazione lineare intera (MIP, ILP, BIP), le sue soluzioni e i suoi esiti; bound primali e duali, gap e rilassamento lineare.

    1\. La programmazione lineare intera · 2\. Bound primali e duali

    [:octicons-arrow-right-24: I capitoli](modelli-e-bound/index.md)

-   :material-vector-polygon: **II · Rafforzare la formulazione**

    ---

    Formulazioni ideali, disuguaglianze valide e disuguaglianze di cover: come rafforzare una formulazione.

    3\. Formulazioni ideali · 4\. Disuguaglianze valide · 5\. Disuguaglianze di cover

    [:octicons-arrow-right-24: I capitoli](formulazioni/index.md)

-   :material-file-tree: **III · Metodi esatti**

    ---

    L'algoritmo dei piani di taglio con i tagli frazionari di Gomory, il branch-and-bound basato sulla programmazione lineare e il branch-and-cut. Esempi svolti passo per passo ed esercizi con la soluzione completa.

    6\. L'algoritmo dei piani di taglio con i tagli frazionari di Gomory · 7\. Il branch-and-bound basato sulla programmazione lineare · 8\. Il branch-and-cut

    [:octicons-arrow-right-24: I capitoli](metodi-esatti/index.md)

-   :material-cog-outline: **IV · I solver MIP**

    ---

    Che cosa fa un solver MIP (presolve, tagli, euristiche primali, strategie dell'albero, tolleranze) e come si legge il suo log, con esempi reali.

    9\. I solver MIP: che cosa fanno

    [:octicons-arrow-right-24: I capitoli](solver/index.md)

-   :material-lightning-bolt: **V · Euristiche MIP**

    ---

    Arrotondamento, diving, feasibility pump, RINS, local branching, relax-and-fix e fix-and-optimize. Esempi ed esercizi con la soluzione completa.

    10\. Euristiche MIP

    [:octicons-arrow-right-24: I capitoli](euristiche-mip/index.md)

-   :material-clipboard-check-outline: **Autovalutazione**

    ---

    *Facsimile d'esame*

    Un facsimile nuovo a ogni avvio: 13 domande, 33 punti, con la soluzione e il link alle dispense.

    [:octicons-arrow-right-24: Mettiti alla prova](autovalutazione.md)

</div>

---

<!-- collana -->
## La collana

Dieci corsi con la stessa impostazione: dispense online e in PDF, esercizi con le soluzioni, laboratorio interattivo e quiz di autovalutazione.

<div class="grid cards" markdown>

-   :material-function-variant: **[Analisi Matematica 1](https://fabiofurini.github.io/analisi-matematica-1/)**

    numeri reali, funzioni, limiti, derivate e serie, con i grafici interattivi

-   :material-matrix: **[Algebra lineare](https://fabiofurini.github.io/algebra-lineare/)**

    vettori, matrici, determinanti, sistemi lineari e autovalori, con il laboratorio di calcolo

-   :material-code-braces: **[Algoritmi](https://fabiofurini.github.io/algoritmi/)**

    rappresentazione dei numeri, pseudocodice, ordinamento e ricerca, analisi e algoritmi ricorsivi

-   :material-vector-triangle: **[Programmazione lineare](https://fabiofurini.github.io/programmazione-lineare/)**

    poliedri, algoritmo del simplesso, dualità e simplesso duale, con il laboratorio interattivo

-   :material-dots-grid: **Programmazione lineare intera** · *questo corso*

    rilassamento continuo, disuguaglianze valide, piani di taglio, branch-and-bound e branch-and-cut

-   :material-vector-curve: **[Ottimizzazione convessa](https://fabiofurini.github.io/ottimizzazione-convessa/)**

    insiemi e funzioni convesse, problemi di ottimizzazione convessa, con grafici interattivi

-   :material-graph-outline: **[Ottimizzazione su reti](https://fabiofurini.github.io/ottimizzazione-su-reti/)**

    grafi, alberi ricoprenti, cammini minimi, flussi su reti, simplesso su reti e gestione dei progetti

-   :material-hexagon-multiple-outline: **[Ottimizzazione combinatoria](https://fabiofurini.github.io/ottimizzazione-combinatoria/)**

    zaino, bin packing, colorazione, TSP, scheduling e lot sizing, risolti in tutti i modi

-   :material-vector-polygon: **[Modellazione MIP](https://fabiofurini.github.io/modellazione-mip/)**

    modelli di programmazione lineare a variabili intere, dalla formulazione alla soluzione con i solver

-   :material-chart-timeline-variant: **[Laboratorio di Ricerca Operativa](https://fabiofurini.github.io/laboratorio-ricerca-operativa/)**

    modellazione e risoluzione di problemi di ottimizzazione con Python e i solver

</div>
<!-- /collana -->

Materiale didattico di **[Fabio Furini](https://fabiofurini.github.io/)** —
[DIAG](https://www.diag.uniroma1.it/), Sapienza Università di Roma.

*Questo sito è disponibile anche in [inglese](https://fabiofurini.github.io/integer-linear-programming/).*
