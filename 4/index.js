const fs = require('fs')
const buffer = fs.readFileSync('4/data.txt')
const data = buffer.toString()

const cards = data.split("\n");

const parsed = cards.map(card => {
    const [cardIdRaw, rest] = card.split(": ");
    const cardIdSplit = cardIdRaw.split(" ");
    const cardId = cardIdSplit[cardIdSplit.length - 1];
    const [rawWinning, rawNumbers] = rest.split(" | ");
    const winning = rawWinning.split(" ").map(n => parseInt(n)).filter(n => !isNaN(n));
    const numbers = rawNumbers.split(" ").map(n => parseInt(n)).filter(n => !isNaN(n));
    const winners = winning.filter(w => numbers.indexOf(w) !== -1);
    return {
        id: cardId,
        wins: winners.length,
        points: winners.length === 0 ? 0 : 2**(winners.length-1),
        copies: 1,
    }
});
const result1 = parsed.reduce((acc, card) => acc + card.points, 0);
console.log("part1", result1);

parsed.forEach((card, index) => {
    if(card.wins > 0) {
        // We need to duplicate the next X cards
        for (let i = 1; i <= card.wins; i++) {
            parsed[index + i].copies += (card.copies);
        }
    }
});

console.log("part2", parsed.reduce((acc, card) => acc + card.copies, 0));