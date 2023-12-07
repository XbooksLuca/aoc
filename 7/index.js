const fs = require('fs')
const buffer = fs.readFileSync('7/data.txt')
const data = buffer.toString()


const values = {
    'A': 14,
    'K': 13,
    'Q': 12,
    'J': 0,
    'T': 10,
    '9': 9,
    '8': 8,
    '7': 7,
    '6': 6,
    '5': 5,
    '4': 4,
    '3': 3,
    '2': 2,
    '1': 1,
}

const specials = {
    FULL_HOUSE: 'FULL_HOUSE',
    FIVE_OF_A_KIND: 'FIVE_OF_A_KIND',
    FOUR_OF_A_KIND: 'FOUR_OF_A_KIND',
    THREE_OF_A_KIND: 'THREE_OF_A_KIND',
    TWO_PAIR: 'TWO_PAIR',
    PAIR: 'PAIR',
    NONE: 'NONE',
}
const specialPower = {
    [specials.FIVE_OF_A_KIND]: 10,
    [specials.FOUR_OF_A_KIND]: 9,
    [specials.FULL_HOUSE]: 8,
    [specials.THREE_OF_A_KIND]: 7,
    [specials.TWO_PAIR]: 6,
    [specials.PAIR]: 5,
    [specials.NONE]: 0,
}

const isSpecial = (hand) => {
    const cards = hand.split('');
    const byType = cards.reduce((acc, card) => {
        if (!acc[card]) {
            acc[card] = 0;
        }
        acc[card]++;
        return acc;
    }, {});
    const jokers = byType['J'] ?? 0;
    const differentCards = Object.keys(byType).length;
    const counts = Object.values(byType);
    if (jokers === 0) {
        if (differentCards === 5) {
            return specials.NONE;
        }
        if (differentCards === 4) {
            return specials.PAIR;
        }
        if (differentCards === 3) {
            if (counts.includes(3)) {
                return specials.THREE_OF_A_KIND;
            }
            return specials.TWO_PAIR;
        }
        if (differentCards === 2) {
            if (counts.includes(4)) {
                return specials.FOUR_OF_A_KIND;
            }
            return specials.FULL_HOUSE;
        }
        return specials.FIVE_OF_A_KIND;
    }
    if (differentCards === 5) {
        return specials.PAIR;
    }
    if (differentCards === 4) {
        return specials.THREE_OF_A_KIND;
    }
    if (differentCards === 3) {
        if (counts.includes(3) && jokers === 1) {
            return specials.FOUR_OF_A_KIND;
        }
        if (counts.includes(2) && jokers === 2) {
            return specials.FOUR_OF_A_KIND;
        }
        if(jokers === 3) {
            return specials.FOUR_OF_A_KIND;
        }
        return specials.FULL_HOUSE;
    }
    if (differentCards === 2) {
        return specials.FIVE_OF_A_KIND;
    }
    return specials.FIVE_OF_A_KIND;
}


const lines = data.split('\n')
const hands = lines.map(line => {
    const [cards, bid] = line.split(' ');
    const special = isSpecial(cards);
    const points = specialPower[special];
    const split = cards.split('');
    const powers = split.map(card => values[card]);
    return {
        cards,
        bid,
        special,
        points,
        split,
        powers,
    }
})

const sortByPointsAndPower = hands.sort((a, b) => {
    if (a.points === b.points) {
        const length = a.powers.length;
        for (let i = 0; i < length; i++) {
            if (a.powers[i] !== b.powers[i]) {
                return b.powers[i] - a.powers[i];
            }
        }
    }
    return b.points - a.points;
})
const length = sortByPointsAndPower.length;
const final = sortByPointsAndPower.map((item, i) => {
    const rank = length - i;
    const winning = item.bid * rank;
    return {
        ...item,
        rank,
        winning,
    }
})
console.log("answer2", final.reduce((acc, item) => acc + item.winning, 0));


