import puppeteer from "puppeteer";   
import fs from 'fs';

const browser = await puppeteer.launch({headless: false}); 
const page = await browser.newPage(); 
await page.goto('https://phitron.io/'); 
await page.screenshot({path: 'data/phitron.png', fullPage: true});  

//take all the instructor name   
const instructors = []
await page.waitForSelector('h3.name');
const  instructorsName = await page.evaluate(()=>{
    return [...document.querySelectorAll("h3.name")].map((e) => e.textContent);
});  

await page.waitForSelector("img.image");
const instructorImg = await page.evaluate(()=>{ 
    const imges = [] 
    const imgElements = document.querySelectorAll("img.image"); 
    imgElements.forEach(img =>{
        imges.push(img.src);
    })
    return imges;
}); 

//get bio 
await page.waitForSelector(".see-more-btn");  
const seeMoreBtns = await page.$$(".see-more-btn");  

for (const btn of seeMoreBtns) {  
    await btn.click(); 
    await page.waitForSelector('.quote');  
}


const instructorBio = await page.evaluate(() => {
    const bioElements = document.querySelectorAll('.quote');
    const bioTexts = [];
    bioElements.forEach(bio => {
        const textContent = bio.textContent;
        if (textContent) {
            const cleanedTextContent = textContent.replace(/বন্ধ করুন/g, '');
            bioTexts.push(cleanedTextContent.trim()); 
        }
    }); 
    return bioTexts;
});


// make object for all the data
const phitronObj = [] 
for(let i =0; i<instructorsName.length; i++){
    const name = instructorsName[i]; 
    const image = instructorImg[i];  
    const bio   = instructorBio[i]; 
    phitronObj.push(
        {
            name:name, 
            profileImg: image, 
            about: bio
        }
    )

} 

//convert to json 
const jsonObj = JSON.stringify(phitronObj, null,2);   

//save file as .josn 
const filepath = 'data/phritron_instructor.json'; 
fs.writeFileSync(filepath,jsonObj); 
console.log(`save json file successfull to this ${filepath}`); 
browser.close(); 


