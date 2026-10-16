# Indice completo

## [Modelli e bound](modelli-e-bound/index.md)

1. [La programmazione lineare intera](modelli-e-bound/ilp.md)
    - 1.1 Forma canonica di massimizzazione
    - 1.2 Esiti possibili
    - 1.3 Enumerazione completa
    - 1.4 Errori tipici
    - 1.5 In sintesi
2. [Bound primali e duali](modelli-e-bound/lp-relaxation.md)
    - 2.1 Bound primali e bound duali
    - 2.2 Bound primali: soluzioni euristiche
    - 2.3 Il rilassamento lineare
    - 2.4 Arrotondare la soluzione del rilassamento lineare
    - 2.5 Upper bound sulle variabili
    - 2.6 Bound duali
    - 2.7 Errori tipici
    - 2.8 In sintesi

## [Rafforzare la formulazione](formulazioni/index.md)

3. [Formulazioni ideali](formulazioni/ideal-formulations.md)
    - 3.1 L'inviluppo convesso
    - 3.2 Formulazioni e formulazioni ideali
    - 3.3 Confronto tra formulazioni
    - 3.4 Esistenza delle formulazioni ideali
    - 3.5 Errori tipici
    - 3.6 In sintesi
4. [Disuguaglianze valide](formulazioni/valid-inequalities.md)
    - 4.1 Disuguaglianze valide
    - 4.2 Ricavare disuguaglianze valide per arrotondamento
    - 4.3 Migliorare una disuguaglianza valida
    - 4.4 Famiglie di disuguaglianze valide e tagli
    - 4.5 Errori tipici
    - 4.6 In sintesi
5. [Disuguaglianze di cover](formulazioni/cover.md)
    - 5.1 Un vincolo con coefficienti positivi e il suo rilassamento lineare
    - 5.2 Cover e disuguaglianze di cover
    - 5.3 Interpretazione geometrica
    - 5.4 Separazione delle disuguaglianze di cover
    - 5.5 Dal CSP a un problema complementare
    - 5.6 Disuguaglianze di cover estese
    - 5.7 Violazione e distanza da una disuguaglianza di cover
    - 5.8 Errori tipici
    - 5.9 In sintesi

## [Metodi esatti](metodi-esatti/index.md)

6. [L'algoritmo dei piani di taglio con i tagli frazionari di Gomory](metodi-esatti/gomory.md)
    - 6.1 Tagli frazionari di Gomory
    - 6.2 Un algoritmo dei piani di taglio basato sui tagli frazionari di Gomory
    - 6.3 L'esempio dell'auto
    - 6.4 Errori tipici
    - 6.5 In sintesi
7. [Il branch-and-bound basato sulla programmazione lineare](metodi-esatti/bb.md)
    - 7.1 L'idea in parole e in una figura
    - 7.2 Definizioni e notazione
    - 7.3 L'algoritmo
    - 7.4 Breve riepilogo dell'algoritmo del simplesso duale
    - 7.5 Strategie di selezione della variabile di branching
    - 7.6 Strategie di selezione del nodo di branching
    - 7.7 Esempi svolti sull'esempio dell'auto
    - 7.8 Errori tipici
    - 7.9 Estensioni
    - 7.10 In sintesi
8. [Il branch-and-cut](metodi-esatti/branch-and-cut.md)
    - 8.1 Algoritmi branch-and-cut
    - 8.2 Disuguaglianze valide globali e locali
    - 8.3 Cut-and-branch e branch-and-cut
    - 8.4 Esempio svolto: cut-and-branch con tagli di Gomory
    - 8.5 Tagli locali: un esempio
    - 8.6 Aspetti pratici
    - 8.7 Errori tipici
    - 8.8 In sintesi

## [I solver MIP](solver/index.md)

9. [I solver MIP: che cosa fanno](solver/mip-solvers.md)
    - 9.1 Dall'algoritmo branch-and-cut a un solver MIP
    - 9.2 I componenti di un solver MIP
    - 9.3 Come si legge il log di Gurobi
    - 9.4 Errori tipici
    - 9.5 In sintesi

## [Euristiche MIP](euristiche-mip/index.md)

10. [Euristiche MIP](euristiche-mip/mip-heuristics.md)
    - 10.1 Euristiche basate sulla PLI
    - 10.2 Gli esempi del capitolo
    - 10.3 Arrotondamento
    - 10.4 Diving
    - 10.5 La feasibility pump
    - 10.6 Migliorare l'incumbent con un sotto-MIP
    - 10.7 Relax-and-fix e fix-and-optimize
    - 10.8 Le euristiche dentro il solver
    - 10.9 Che cosa danno le euristiche basate sulla PLI
    - 10.10 Implementazione in <code>Python</code>
    - 10.11 Errori tipici
    - 10.12 In sintesi
