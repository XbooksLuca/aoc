const fs = require('fs')
const buffer = fs.readFileSync('5/data.txt')
const data = buffer.toString()

const [seedsRaw, ...mapsRaw] = data.split("\n\n");

const seeds = seedsRaw.split(" ").map(n => parseInt(n)).filter(n => !isNaN(n));

const maps = mapsRaw.map(map => {
    const [title, ...ranges] = map.split("\n");
    const mappedRanges = ranges.map(x => {
        const [dest, source, len] = x.split(" ");
        return {
            dest,
            source,
            len,
        }
    });
    return {
        title,
        ranges: mappedRanges,
    }
});

const remapNumber = (map, number) => {
    const inRange = map.ranges.find(range => {
        return number >= parseInt(range.source) && number <= parseInt(range.source) + parseInt(range.len) - 1;
    });
    if(inRange) {
        const offset = parseInt(inRange.dest) - parseInt(inRange.source);
        return number + offset;
    }
    return number;
}

const findLocation = (seed) => {
    const soilLocation = remapNumber(maps[0], seed);
    const fertilizerLocation = remapNumber(maps[1], soilLocation);
    const waterLocation = remapNumber(maps[2], fertilizerLocation);
    const lightLocation = remapNumber(maps[3], waterLocation);
    const temperatureLocation = remapNumber(maps[4], lightLocation);
    const humidityLocation = remapNumber(maps[5], temperatureLocation);
    return remapNumber(maps[6], humidityLocation);
}

const results = seeds.map(seed => {
     return findLocation(seed);
});

console.log("answer1", results.sort((a, b) => a - b)[0]);

const remapNumber2 = (map, number) => {
    const inRange = map.ranges.find(range => {
        return number >= parseInt(range.dest) && number <= parseInt(range.dest) + parseInt(range.len) - 1;
    });
    if(inRange) {
        const offset = parseInt(inRange.source) - parseInt(inRange.dest);
        return number + offset;
    }
    return number;
}
const findSeedForLocation = (location) => {
    const location1 = remapNumber2(maps[6], location);
    const location2 = remapNumber2(maps[5], location1);
    const location3 = remapNumber2(maps[4], location2);
    const location4 = remapNumber2(maps[3], location3);
    const location5 = remapNumber2(maps[2], location4);
    const location6 = remapNumber2(maps[1], location5);
    return remapNumber2(maps[0], location6);
}

let seedsGroups = []
for (let i = 0; i < seeds.length / 2; i++) {
    const from = seeds[i * 2];
    const to = from + seeds[i * 2 + 1] - 1;
    seedsGroups.push({
        from,
        to,
    });
}

let found;

for(let i = 56930000; i < 1_000_000_000; i += 1) {
    const seed = findSeedForLocation(i);
    if(seedsGroups.find(x => x.from <= seed && x.to >= seed)) {
        console.log(`i: ${i}, seed: ${seed}. Found`);
        found = i;
        break;
    }
    console.log(`i: ${i}, seed: ${seed}. Not found`);
}

console.log("answer2", found);

console.log(findLocation(3876934460))