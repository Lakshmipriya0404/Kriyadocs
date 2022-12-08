import data from './jdata.json' assert {type: 'json'};
import { writeFile } from 'fs';

const jobs = ['data engineer', 'machine learning engineer', 'data scientist', 'full stack developer', 'frontend', 'python developer', 'node', 'data analyst', 'cyber security'];
const op = [];

/**** Stores the skills and its count in a array ****/

function collectSkills() {
    let iterator = 0;
    for(let job of jobs){
        var str ="";
        for(let i = iterator; i < iterator+19; i++){
            str = str.concat(data[i].jobSkills);
        }
        const jobset = str.split(",");
        const map = jobset.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
        map.forEach((value, key)=>{
            if(value>2){
                op.push({
                    job,
                    skill: key,
                    skillCount: value,
                });
            }
        })
        iterator +=19; //collected 19 data sets for each job(reduces number of iterations)
    }
}

/**** Function to sort array of objects ****/

function compare( a, b ) {
    if ( a.skillCount > b.skillCount ){
        return -1;
    }
    if ( a.skillCount < b.skillCount ){
        return 1;
    }
    return 0;
}

/**** Sorting the data based on skill count and Storing it into a json file ****/

function storeToFile(){
    const final = [];
    const result = op.sort( compare );
    jobs.map((job)=>{
        let count = 0;
        for(let i=0; i<result.length; i++){
            if(job === result[i].job){
                count += 1;
                let skill = result[i].skill;
                let skillcount = result[i].skillCount;            
                final.push({
                    job,
                    skill,
                    skillcount,
                });    
                if(count > 9) break;
            }
        }
    });
    const output = JSON.stringify(final);
    writeFile('./final.json', output,err =>{
    if (err) throw err;
    console.log('added !');
});
}

/**** Function calls ****/

function main() {
    collectSkills();
    storeToFile();
}
main();