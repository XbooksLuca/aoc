const fs = require('fs')
const buffer = fs.readFileSync('6/data.txt')
const data = buffer.toString()


const datasets = [
    {
        time: 56,
        record: 499,
    },
    {
        time: 97,
        record: 2210,
    },
    {
        time: 77,
        record: 1097,
    },
    {
        time: 93,
        record: 1440,
    },
]


const findAllPossbleResults = (item) => {
    const { time, record } = item
    const results = []
    for (let i = 0; i <= time; i++) {
        const speed = i;
        const result = speed * (time - i);
         results.push({
             speed,
             result
         })
    }
    return {
        ...item,
        results,
    }
}

const parsed = datasets.map(findAllPossbleResults);


const answer1 = parsed.map((item) => {
    return item.results.filter(x => x.result > item.record).length
}).reduce((a, b) => a * b, 1);
console.log("answer 1:", answer1);


const dataset2 = {
    time: 56977793,
    record: 499221010971440,
}
console.log("answer 2:", findAllPossbleResults(dataset2).results.filter(x => x.result > dataset2.record).length);