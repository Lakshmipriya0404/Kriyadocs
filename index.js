import { writeFile } from 'fs';
import data from './jdata.json' assert {type: 'json'};

//NLTK's list of english stopwords
const stopwords = ['i','me','my','myself','we','our','ours','ourselves','you','your','yours','yourself','yourselves','he','him','his','himself','she','her','hers','herself','it','its','itself','they','them','their','theirs','themselves','what','which','who','whom','this','that','these','those','am','is','are','was','were','be','been','being','have','has','had','having','do','does','did','doing','a','an','the','and','but','if','or','because','as','until','while','of','at','by','for','with','about','against','between','into','through','during','before','after','above','below','to','from','up','down','in','out','on','off','over','under','again','further','then','once','here','there','when','where','why','how','all','any','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','s','t','can','will','just','don','should','now',];
const noisewords = ['prepare','make','preferred','dell','yrs','apply','details','looking','immediate','candidates','focus','essential','priority','work','users','years','etc','jobtitle','jobdescription','eligible','completed','updated','change','related','like','may','months','fields','job','description'];
//Skill Dictionary
const techskills = [
    'python','sql','statistics','mongodb','javascript','nodejs','cloud ','aws','react','angular',
    'linux','cloud technology','artificial intelligence','machine learning','nextjs','django','git','css','bootstrap','big data',
    'framework','nosql','automation','firewall','analytics','network security'
];
const jobs = ['Data Engineer','Machine Learning','Python','Node','Full Stack','Front End','Data Scientist','Analyst','Cyber Security','Cloud']
const op = [];


/****  loops through jobs and pushes the matchedSkill and it's count to an array ****/

for(let job of jobs){

    //stores sum of all jobDescriptionData of a job    
    const jobset = [];         
    for(let i = 0; i < data.length; i++) {
        if((data[i].jobTitle).includes(job)){
            var jobDescription = data[i].jobDescription;
            jobset.push(jobDescription);
        }
    }

    //Cleaning the data
    var str = jobset.join();
    const punctuation = /[.,\/#!$%\^&+\*;:{}=\-_`~()]/g;
    const numless = /\d+/g;
    const space = /\s{2,}/g;
    const punctuationless = str
    .replace(punctuation, "")
    .replace(numless, "")
    .toLowerCase()
    .replace(new RegExp('\\b('+stopwords.join('|')+')\\b', 'g'), ' ')
    .replace(new RegExp('\\b('+noisewords.join('|')+')\\b', 'g'), ' ')
    .replace(space, " ")
    .replace(/\r?\n|\r/g, " ");

    //Extracting the matchedSkills and its count
    techskills.map((skill)=>{
        const matchedskill = skill;
        if(punctuationless.match(skill)){
            const matchedskillcount = punctuationless.split(skill).length - 1;
            op.push({
                job,
                matchedskill,
                matchedskillcount,
            });
        }
    });
}

/**** Function to sort array of objects ****/

function compare( a, b ) {
    if ( a.matchedskillcount > b.matchedskillcount ){
        return -1;
    }
    if ( a.matchedskillcount < b.matchedskillcount ){
        return 1;
    }
    return 0;
}

/**** Sorting the data based on skill count****/

const final =[];
const result = op.sort( compare );
jobs.map((job)=>{
    let count = 0;
    for(let i=0; i<result.length; i++){
        if(job === result[i].job){
            count += 1;
            let skill = result[i].matchedskill;
            let skillcount = result[i].matchedskillcount;
            final.push({
                job,
                skill,
                skillcount,
            }); 
            if(count > 9) break;
        }
    }
});

//Storing the results in a json file
const output = JSON.stringify(final);
writeFile('./final.json', output,err =>{
    if (err) throw err;
    console.log('added!');
});