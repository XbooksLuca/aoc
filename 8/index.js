const fs = require('fs')
const buffer = fs.readFileSync('8/data.txt')
const data = buffer.toString()


const [instructionsRaw, actionsRaw] = data.split('\n\n');
const instructions = instructionsRaw.split('');
const actionsArray = actionsRaw.split('\n').map(action => {
    const [key, valueRaw] = action.split(' = ');
    const [left, right] = valueRaw.split(', ')
    return {
        key,
        L: left.replace("(", ""),
        R: right.replace(")", ""),
    }
})

/*const from = actionsArray[0].key;
const to = actionsArray[actionsArray.length - 1].key;*/

const from = "AAA";
const to = "ZZZ";

const actions = actionsArray.reduce((acc, curr) => {
    acc[curr.key] = curr;
    return acc;
}, {});


const findSteps = (next, isFinished) => {
    let steps = 0;
    while (!isFinished(next)) {
        const action = actions[next];
        const instruction = instructions[steps % instructions.length];
        next = action[instruction];
        steps++;
    }
    return steps;
}

console.log("answer 1: FOUND IN", findSteps("AAA", (a) => a === "ZZZ"), "STEPS");

const fromAll = Object.keys(actions).filter(key => key.endsWith("A"));
const steps2 = fromAll.map(next => findSteps(next, (a) => a.endsWith("Z")));
const gcd = (a, b) => b === 0 ? a : gcd (b, a % b)
const lcm = (a, b) =>  a / gcd (a, b) * b
const lcmAll = (ns) => ns .reduce (lcm, 1)

console.log("answer 2: FOUND IN", lcmAll(steps2), "STEPS");