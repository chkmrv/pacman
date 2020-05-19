
var inputs = readline().split(' ');
const width = parseInt(inputs[0]); // size of the grid
const height = parseInt(inputs[1]); // top left corner is (x=0, y=0)
let map = [];
let myPacListPos = [];
let lastStepPacs = [];
let allPelletsList = [];
let newPlace = {};
let myPacCount = 0;
let speedRun = 100;

for (let i = 0; i < height; i++) {
    map[i] = readline(); // one line of the grid: space " " is floor, pound "#" is wall
}

// SET LIST OF THE PELLETS FROM MAP
for (let y = 0; y < map.length; y++) {
    const row = map[y].split('')
    for (let x = 0; x < row.length; x++) {
        if (row[x] !== '#') {
            allPelletsList.push({xPos: x, yPos: y});
        }
    }
}

function switchTo(enemyType) {
    switch(enemyType) {
        case 'ROCK':
            return 'PAPER';
        case 'SCISSORS':
            return 'ROCK';
        case 'PAPER':
            return 'SCISSORS';
        default: 
            return false;
    }
}

function getDistance(pac, pel) {
    return Math.abs(Math.sqrt((
        Math.pow(pel.xPos - pac.xPos, 2) + Math.pow(pel.yPos - pac.yPos, 2)
    )))
}

function closestDot(pac, pellets) {
    let closestPellets = null;
    let shortDistance = 100;
    let i = 0;
    while (pellets[i] && pellets[i].value === 10 && i < pellets.length) {
        const distance = getDistance(pac, pellets[i]);
        if (shortDistance > distance) {
            shortDistance = distance;
            closestPellets = pellets[i];
        }
        i++;
    }

    if (shortDistance === 100) {
        for (let i = 0; i < pellets.length; i++) {
            const distance = getDistance(pac, pellets[i]);
            if (shortDistance > distance) {
                shortDistance = distance;
                closestPellets = pellets[i];
            }
        }
    }
    
    // console.error('closestPellets', pac,'=', closestPellets);

    return closestPellets;
}

// game loop
while (true) {
    var inputs = readline().split(' ');
    const myScore = parseInt(inputs[0]);
    const opponentScore = parseInt(inputs[1]);
    const visiblePacCount = parseInt(readline()); // all your pacs and enemy pacs in sight
    let enemyPacListPos = [];
    let myPacArrayBool = [];  
    let pelletsListBig = [];  
    let pelletsList = [];  
    let visionList = [];  

    // PACMANS
    for (let i = 0; i < visiblePacCount; i++) {
        var inputs = readline().split(' ');
        const pacId = parseInt(inputs[0]); // pac number (unique within a team)
        const mine = inputs[1] !== '0'; // true if this pac is yours

        if (mine) {
            myPacArrayBool.push(mine);
            const xPac = parseInt(inputs[2]); // position in the grid
            const yPac = parseInt(inputs[3]); // position in the grid
            const typeId = inputs[4];
            const speedTurnsLeft = parseInt(inputs[5]); // unused in wood leagues
            const abilityCooldown = parseInt(inputs[6]); // unused in wood leagues
            myPacListPos[pacId] = {xPos: xPac, yPos: yPac, type: typeId, speed: abilityCooldown};
        } else {
            const xPac = parseInt(inputs[2]); // position in the grid
            const yPac = parseInt(inputs[3]); // position in the grid
            const typeId = inputs[4]; // unused in wood leagues
            
            enemyPacListPos.push({xPos: xPac, yPos: yPac, type: typeId});

            // console.error('XY', xPac, yPac)
            // console.error('typeId', typeId)
        }
    }
    if (myPacCount < myPacArrayBool.length) myPacCount = myPacArrayBool.length;

    // VISION LIST
    // 
    // check all pacmans myPacListPos.xPos yPos 
    // 1) visionList = parce map until wall # to get all list from one pacand think they
    // 2) filter from vision if there not all the same, and some of the pellete empty
    // 3) delete empty pelets from the PelletsList
    console.error('myPacListPos', myPacListPos)
    for (let i = 0; i < myPacListPos.length; i++) {
        const pacX = myPacListPos[i].xPos;
        const pacY = myPacListPos[i].yPos;
        
        const row = map[pacY].split('')
        let col = []
        for (let i = 0; i < map.length; i++) {
            col.push(map[i].split('')[pacX])
        }

        for (let r = pacX + 1; r < row.length && row[r] !== '#'; r++) visionList.push({xPos: r, yPos: pacY})
        for (let r = pacX - 1; r > 0 && row[r] !== '#'; r--) visionList.push({xPos: r, yPos: pacY})
        for (let c = pacY + 1; c < col.length && col[c] !== '#'; c++) visionList.push({xPos: pacX, yPos: c})
        for (let c = pacY - 1; c > 0 && col[c] !== '#'; c--) visionList.push({xPos: pacX, yPos: c})
    }
    console.error('visionList ALL', visionList.length)
    // PELLETS  
    const visiblePelletCount = parseInt(readline()); // all pellets in sight
    for (let i = 0; i < visiblePelletCount; i++) {
        var inputs = readline().split(' ');
        const x = parseInt(inputs[0]);
        const y = parseInt(inputs[1]);
        const value = parseInt(inputs[2]); // amount of points this pellet is worth
        // improve here to dont have random
        if (value === 10) pelletsListBig.push({xPos: x, yPos: y, value: value});

        visionList = visionList.filter((pellet) => (pellet.xPos !== x || pellet.yPos !== y))
    }
    // console.error('visionList to delete', visionList) // have to be removed
    // console.error('visionList length to remove from allPelletsList', visionList.length)
    // console.error('allPelletsList.length', allPelletsList.length);
    // ADD BIG PELLETS TO PELLETS LIST AND
    // CLEAN PELLETS LIST FROM EMPTY PELLETS
    for (let i = 0; i < visionList.length; i++) {
        allPelletsList = allPelletsList.filter((pellet) => (
            pellet.xPos !== visionList[i].xPos || pellet.yPos !== visionList[i].yPos
        ))
    }
    console.error('allPelletsList after remove = ',visionList.length, '=', allPelletsList.length);
    pelletsList = pelletsListBig.concat(allPelletsList);

    console.error('pelletsList NEW0', pelletsList[0]);
    console.error('pelletsList NEW1', pelletsList[1]);
    console.error('pelletsList NEW2', pelletsList[2]);
    console.error('pelletsList.length more to 4 max', pelletsList.length);
    // MOVE
    let result = ''
    for (let r = 0; r < myPacCount; r++) {
        let newPellets = null;
        let last = lastStepPacs[r];
        let current = myPacListPos[r];
        let switchPac = null
        // find closest
        // console.error('r', r);
        // console.error('enemyPacListPos', enemyPacListPos);
        // console.error('current', current);
        allPelletsList = allPelletsList.filter((pellet) => (
            pellet.xPos !== current.xPos || pellet.yPos !== current.yPos
        ))
        pelletsList = pelletsListBig.concat(allPelletsList);
        
        if (pelletsList.length > 0) {
            newPellets = closestDot(current, pelletsList);
        }

        if (enemyPacListPos.length > 0) {
            for (let i = 0; i < enemyPacListPos.length - 1; i++) {
                if ((enemyPacListPos[i].yPos === current.yPos && Math.abs(enemyPacListPos[i].xPos - current.xPos < 3)) || 
                    (enemyPacListPos[i].xPos === current.xPos && Math.abs(enemyPacListPos[i].yPos - current.yPos < 3))) {
                    switchPac = switchTo(enemyPacListPos[i].type) // switch
                }
                // pelletsList = allPelletsList.filter((pellet) => (
                //     pellet.xPos !== enemyPacListPos[i].xPos || pellet.yPos !== enemyPacListPos[i].yPos
                // ))
                allPelletsList = allPelletsList.filter((pellet) => (
                    pellet.xPos !== enemyPacListPos[i].xPos || pellet.yPos !== enemyPacListPos[i].yPos
                ))
                pelletsList = pelletsListBig.concat(allPelletsList);
            }
        }
        // if we suck in one point
        if (last) {
            if (last.xPos === current.xPos && last.yPos === current.yPos) {

                // random from pelletsList
                // send to the point
                const randomX = Math.floor(Math.random() * Math.floor(27) + 1);
                const randomY = Math.floor(Math.random() * Math.floor(10) + 1);
                newPellets = {xPos: randomX, yPos: randomY};
                console.error('random newPellets', newPellets);
            }
        }
        if (newPellets) {
            // console.error('HERE2', newPellets, speedRun === 100, current.speed === 0, switchPac !== null);
            // if (speedRun === 100) {
            //     result = result + `SPEED ${r}|`;
            // } else 
            if (current.speed === 0 && switchPac !== null) {
                result = result + `SWITCH ${r} ${switchPac}|`;
            } else {
                result = result + `MOVE ${r} ${newPellets.xPos} ${newPellets.yPos}|`;
            }
        } 
    }
    speedRun = 0
    // set lastStep of the pacmans
    for (let i = 0; i < myPacCount; i++) {
        lastStepPacs[i] = myPacListPos[i];
    }
    console.log(result.substring(0, result.length - 1));
}
