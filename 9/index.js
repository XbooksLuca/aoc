const fs = require('fs')
const buffer = fs.readFileSync('9/data.txt')
const data = buffer.toString()

const lines = data.split('\n').map(l => l.split(' ').map(n => parseInt(n, 10)));

const parseLine = (numbers, generations = []) => {
    generations.push(numbers)
    if(numbers.every(n => n === 0)) {
        const last_count = generations.reduce((acc, g) => acc + g[g.length - 1], 0);
        return {
            generations,
            last_count,}
    }
    const nextNumbers = numbers.reduce((acc, n, i) => {
        if(i === numbers.length - 1) {
            return acc;
        }
        acc.push(numbers[i + 1] - n);
        return acc;
    }, [])
    return parseLine(nextNumbers, generations);
}
const parsed = lines.map(l => parseLine(l));
console.log("answer1", parsed.reduce((acc, p) => acc + p.last_count, 0));
const parsed2 = lines.map(l => parseLine(l.reverse()));
console.log("answer2", parsed2.reduce((acc, p) => acc + p.last_count, 0));


