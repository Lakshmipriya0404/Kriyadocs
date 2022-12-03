import request from 'request-promise';
import { load } from 'cheerio';
import { writeFile } from 'fs';


let pages = [];
const jobs =['dataengineer', 'machinelearningengineer', 'datascientist', 'fullstackdeveloper', 'frontendengineer', 'python', 'nodejs', 'dataanalyst', 'cybersecurity', 'cloudcomputing'];
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
        let page = `https://www.shine.com/job-search/${job}-jobs?q=${job}`;
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
};

/**** Loops through urls collected and gets the job description ****/

async function CollectData() {
    let jobDescriptionData = [];
    for(let page of pages) {
        const response = await request({
            uri:page,
            header: headers,
            gzip: true,
        });
        let  $ = load(response);
        let jobTitle = $('h1[class="font-size-24"]').text().trim();
        let jobDescription = $('div[class="jobDetail_jsrpRightDetail__wUyf7 white-box-border"]').text().trim();
        jobDescriptionData.push({
            jobTitle,
            jobDescription,
        });
    }    
    const jdata = JSON.stringify(jobDescriptionData);
    writeFile('./jdata.json', jdata, err =>{
        if (err) throw err;
        console.log('added !');
    })        
};

/**** Function calls ****/

async function main() {
    await CollectUrl();
    await CollectData();   
}
main();