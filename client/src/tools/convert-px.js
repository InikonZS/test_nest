const fs = require('fs/promises');
const path = require('path');

const run = async (file)=>{
    let fileData = (await fs.readFile(file)).toString();

    for(let k=0; k<10000; k++){
        const ind = fileData.search(/[\:\()]?\s*\d+px[\s\,]*/);
        if (ind == -1){
            break;
        }
        let endInd = ind;
        let sub = '';
        for(let i = ind+1; i< ind+100; i++){
            if (fileData[i] !=='x'){
                if (!Number.isNaN(Number(fileData[i]))){
                    sub+=fileData[i];
                }
            } else {
                endInd = i;
                break;
            }
        }
        fileData = fileData.slice(0, ind+1) + `calc(var(--base) * ${sub.trim()})` + fileData.slice(endInd+1);
        
    }
    console.log(fileData);
    fs.writeFile(file, fileData);
}

const runDir = async(dir)=>{
    const files = await fs.readdir(dir);
    console.log(files);
    for (let _file of files){
        const file = path.join(dir, _file);
        const stat = await fs.lstat(file);
        if (stat.isFile() && file.endsWith('.css')){
            await run(file);
        } else if(stat.isDirectory()) {
            await runDir(file);
        }
    }
    console.log('end');
}


runDir(path.join(__dirname, '../wf'));
