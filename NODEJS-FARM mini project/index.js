// ----------LESSON-6 NODE-JS - Mini-Project1

// API - a service from which we can request some data 

const http = require('http');
const url = require('url');
const fs = require('fs');
const replaceTemplate = require ('./modules/replaceTemplate.js');
// if the function is at the top level code the blocking function won't slow down the program
// We have to know which function executed once and at the beginning 

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);  // top level code - it gets executed only once when we run the program



const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');



const server = http.createServer((req, res) =>{ // call-back functions get executed everytime when we run the program
   
    const { query, pathname } = url.parse(req.url, true) ; // true in order to parse query into object; query string is the last "id=0" part

    // Overview page

    if (pathname === '/' || pathname === '/overview') {
        
        res.writeHead(200, {'Content-type' : 'text/html'});

        const cardsHtml = dataObj.map(elem => replaceTemplate(tempCard, elem)).join(''); // loop through dataObj with map to return something; 
        

        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)

        // res.end(tempOverview);
        res.end(output);

    // Product page
    }else if (pathname === '/product'){
        res.writeHead(200,{'Content-type' : 'text/html'});
        const product = dataObj[query.id]; // dataObj is an array, we are retrieving the element at the position that's coming from the query.id
        // the simplest way of retrieving an element based on a query string
         
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

    // API page
    }else if (pathname === '/api'){

        res.writeHead(200, {'Content-type':'application/json'});
        res.end(data);

    // Not found
    }else{
        res.writeHead(404, {
            'Content-type' : 'text/html',
            'my-own-type' : 'Hello world'
        });
        res.end('<h>Page not FOUND!</h>');
    }
});

server.listen(8000, '127.0.0.1', (err) => {
    console.log('Listening');
});