const fs = require('fs')
const buffer = fs.readFileSync('3/data.txt')
const data = buffer.toString()

const lines = data.split("\n");

const Types = {
    NOTHING: "NOTHING",
    SYMBOL: "SYMBOL",
    NUMBER: "NUMBER",
    GEAR: "GEAR",
}

const getType = (lines, line, index) => {
    const value = lines[line][index];
    if (value === ".") {
        return {
            id: `${line}-${index}`,
            type: Types.NOTHING,
        };
    }
    if (value === "*") {
        return {
            id: `${line}-${index}`,
            type: Types.GEAR,
        };
    }
    const isNumber = value.match(/\d/g);
    if (isNumber) {
        return {
            id: `${line}-${index}`,
            type: Types.NUMBER,
        };
    }
    return {
        id: `${line}-${index}`,
        type: Types.SYMBOL,
    };
}

let founds = []
for (const [lineIndex, line] of lines.entries()) {
    founds.push([]);
    const items = line.split("");
    for (let i = 0; i < items.length - 1; i++) {
        const item = items[i];
        const itemIndex = i;
        const type = getType(lines, lineIndex, itemIndex);
        if (type.type === Types.NOTHING) {
            continue;
        }
        if (type.type === Types.SYMBOL) {
            continue;
        }
        const before = Math.max(0, itemIndex - 1);
        const after = Math.min(items.length - 1, itemIndex + 1);
        const top = Math.max(0, lineIndex - 1);
        const bottom = Math.min(lines.length - 1, lineIndex + 1);
        const checks = [
            getType(lines, lineIndex, before),
            getType(lines, lineIndex, after),
            getType(lines, top, itemIndex),
            getType(lines, bottom, itemIndex),
            getType(lines, top, after),
            getType(lines, top, before),
            getType(lines, bottom, after),
            getType(lines, bottom, before),
        ]

        const isNearASymbol = checks.some((check) => check.type === Types.SYMBOL || check.type === Types.GEAR);
        const isNearAGear = checks.find((check) => check.type === Types.GEAR);
        if (isNearASymbol) {
            // We check if before and after are numbers
            let beforeString = "";
            let beforeIndex = before;
            let beforeCheck = true;
            while (beforeCheck) {
                if(beforeIndex < 0) {
                    beforeCheck = false;
                    break;
                }
                if (getType(lines, lineIndex, beforeIndex).type === Types.NUMBER) {
                    beforeString = `${lines[lineIndex][beforeIndex]}${beforeString}`;
                    beforeIndex--;
                } else {
                    beforeCheck = false;
                }
            }


            let afterString = "";
            let afterIndex = after;
            let afterCheck = true;
            while (afterCheck) {
                if(afterIndex === lines[lineIndex].length) {
                    afterCheck = false;
                    break;
                }
                if (getType(lines, lineIndex, afterIndex).type === Types.NUMBER) {
                    afterString += lines[lineIndex][afterIndex];
                    afterIndex++;
                    i++;
                } else {
                    afterCheck = false;
                }
            }

            founds[lineIndex].push({
                index: itemIndex,
                number: beforeString+item+afterString,
                gear_id: isNearAGear?.id,
            })
        }
    }
}


const result = founds.map((line, lineIndex) => {
    return line.reduce((acc, item) => {
        return acc + parseInt(item.number);
    }, 0);
}).reduce((acc, item) => {
    return acc + item;
}, 0);

console.log("result part 1", result)

const data2 = founds.flat().filter((x) => !!x.gear_id ).reduce((acc, item) => {
    acc[item.gear_id] ??= [];
    acc[item.gear_id].push(item.number);
    return acc;
}, {});

const result2 = Object.values(data2).filter(x => x.length === 2).map(x => parseInt(x[0]) * parseInt(x[1])).reduce((acc, item) => {
    return acc + item;
}, 0);
console.log("result part 2", result2)
