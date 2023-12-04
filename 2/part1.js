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

const green_target = 13;
const red_target = 12;
const blue_target = 14;

const games_possible = parsed.filter((game) => {
    return game.results.green <= green_target && game.results.red <= red_target && game.results.blue <= blue_target;
});

const answer = games_possible.reduce((acc, curr) => {
    return acc + parseInt(curr.id);
}, 0);

console.log("answer", answer)

