const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const { route } = require('.');
const routes = require('.');
const hbs = require('handlebars');
const path = require('path');
const { format } = require('../datebase');
const moment = require('moment');

const pool = require('../datebase');

const personas = pool.query('SELECT*FROM vista_cliente');
const compile = async function(templeateName,data){
    const filePath = path.join(process.cwd(),'./src/views/links',`${templeateName}.hbs`);
    const html = await fs.readFile(filePath,'utf-8');
    //console.log(html)
    return hbs.compile(html)(data);
}

hbs.registerHelper('dateFormat', function(value, format){
    console.log('formtting',value,format);
    return moment(value).format(format);
    
});

(async function() {
    try {
        
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const content = await compile('add',personas);
        console.log(personas);
 
        await page.setContent(content);
        
        await page.emulateMediaType('screen');
        await page.pdf({
            path: 'test.pdf',
            format: 'A4',
            printBackground: true
        });

        console.log('reportando');
    } catch (error) {
        console.log('error', error);
    }
})();
module.exports = routes;