import request from 'request-promise';
import { load } from 'cheerio';
import { writeFile } from 'fs';

let pages = [];
const jobs =['Data Engineer', 'Machine Learning Engineer', 'Data Scientist', 'Full Stack Developer', 'Frontend', 'Python Developer', 'Node', 'Data Analyst', 'Cyber Security'];
const headers = {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "max-age=0",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
}

/**** Collects all the urls in the 'page' ****/

async function CollectUrl() {    
    for (let job of jobs){
        let page = `https://www.shine.com/job-search/${job.replace(" ","-")}-jobs?q=${job.replace(" ","+")}`;
        const response = await request({
            uri:page,
            header: headers,
            gzip: true,
        });
        let  $ = load(response);
        $('div[class="jobCard_jobCard__jjUmu  white-box-border jobCard"]').each(function () {
            pages.push($(this).find('meta').attr('content'));
        });
    }
}

/**** Loops through urls collected and gets the job skills ****/

async function CollectData() {
    let jobSkillsData = [];
    for(let page of pages) {
        const response = await request({
            uri:page,
            header: headers,
            gzip: true,
        });
        let  $ = load(response);
        let jobTitle = $('h1[class="font-size-24"]').text().trim();
        let jobSkills = "";
        $('ul[class="keyskills_keySkills_items__ej9_3"]').children().each(function(){
            jobSkills = jobSkills.concat($(this).text().concat(","));            
        })
        jobSkillsData.push({
            jobTitle,
            jobSkills,
        });
    }    
    const jdata = JSON.stringify(jobSkillsData);
    writeFile('./jdata.json', jdata, err =>{
        if (err) throw err;
        console.log('added !');
    })        
}

/**** Function calls ****/

async function main() {
    await CollectUrl();
    await CollectData();   
}
main();