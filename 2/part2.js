const fs = require('fs')
const buffer = fs.readFileSync('2/data.txt')
const data = buffer.toString()

const games = data.split("\n");

const parsed = games.map((game) => {
    const [rawId, rest] = game.split(": ");
    const id = rawId.replace("Game ", "");
    const draws = rest.split("; ")
    const parsedDraws = draws.map((draw) => {
        return draw.split(", ").map(single => {
            const [amount, color] = single.split(" ");
            return {color, amount: parseInt(amount)}
        });
    })
    const results =  parsedDraws.flat().reduce((acc, curr) => {
        acc[curr.color] ??= 0;
        acc[curr.color] = acc[curr.color] > curr.amount ? acc[curr.color] : curr.amount;
        return acc;
    }, {});
    return {id, results};
})

const answer = parsed.map((game) => {
    return game.results.green * game.results.red * game.results.blue;
}).reduce((acc, curr) => {
    return acc + curr;
});

console.log("answer", answer)

