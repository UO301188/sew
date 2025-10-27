class Memoria{
    constructor(){}
    
    flipCard(card) {
        card.dataset.state = "flip"; // añade o modifica el atributo data-state
    }
}