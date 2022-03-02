const cards = new Array(54);

for (let i=0; i<cards.length;i++){ 
    cards[i]=i;
}

const rank = (i) => i % 13;
const val = (i) => rank(i) +1;
const suit = (i) => i/13 | 0;

const rankVis = 'A 2 3 4 5 6 7 8 9 10 J Q K'.split(' ');
const suitsVis = '♠︎ ♥︎ ♣︎ ♦︎'.split(' ');
const color = suit % 2 ? 'red':'black';

const getProperties = (i) =>{
    const joker = i>51;
    const rank =joker ? -1 : i % 13;
    const val = rank +1;
    const suit=joker ?-1 : i/13 |0;

    return {rank, val, suit, joker};
};

const shuffle = (cards) => {
    for (let i=0; i<cards.length;i++){
        const random = Math.random () * i | 0;
        const temp = cards[i];

        cards[i]=cards[random];
        cards[random]=temp;
    }
    return cards;
};




//console.log(shuffle(cards));
console.log(cards.map(getProperties));