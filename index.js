const { resolveSoa } = require('dns');
const fs = require('fs');
const http = require('http');
const url = require('url');


// ---------------------------------------------------------------------------------------------------------
//  ========================= Testing File with file system ================================================
// ---------------------------------------------------------------------------------------------------------


// const textIn = fs.readFileSync('./starter/txt/input.txt', 'utf-8');

// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}. \n Created on ${Date.now()}`

// fs.writeFileSync('./starter/txt/output.txt', textOut);

// console.log('File Written');

//  =====================better method Asynchronous way of reading and writing node files============================

// fs.readFile('./starter/txt/start.txt','utf-8', (err,data1) => {
//     fs.readFile(`./starter/txt/${data1}.txt`,'utf-8', (err,data2) => {
//         // console.log(data2)
//         fs.readFile('./starter/txt/append.txt','utf-8', (err,data3) => {
//             // console.log(data3)
//             fs.writeFile('./starter/txt/mich.txt',`${data2} \n ${data3}`,  (err) =>{
//                 console.log("it is done")
//             })
//         })

//    })

// })

// const michText = "just testing out these call back functions";

// fs.writeFile('./starter/txt/mich.txt', michText, (err,data)=>{
    
//     console.log(data)
// })


// ------------------------------------------------------------------------------------------------------
// ====================== WORKING WITH THE HTTP SERVER ==================================================
// ------------------------------------------------------------------------------------------------------

// ========================== CREATING THE SERVER ===========================

const replace = (arg1,arg2) => {
     arg1 = arg2;
}

const replaceTemplate = (temp, product) => {
    let output = temp.toString().replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.toString().replace(/{%IMAGE%}/g, product.image);
    output = output.toString().replace(/{%PRICE%}/g, product.price);
    output = output.toString().replace(/{%FROM%}/g, product.from);
    output = output.toString().replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.toString().replace(/{%QUANTITY%}/g, product.quantity);
    output = output.toString().replace(/{%DESCRIPTION%}/g, product.description);
    output = output.toString().replace(/{%ID%}/g, product.id);
    
    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;

}

const tempOverview = fs.readFileSync('./starter/templates/template-overview.html');
const tempCard = fs.readFileSync('./starter/templates/template-card.html');
const tempProduct = fs.readFileSync('./starter/templates/product.html');


const data = fs.readFileSync('./starter/dev-data/data.json');
const dataObj = JSON.parse(data)


const server = http.createServer((req,res)=>{
    
    const { query, pathname } = url.parse(req.url, true);

    // OVERVIEW PAGE
    if (pathname === "/" || pathname === "/overview") {
        res.writeHead(200, {'content-type':'text/html'})

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el) ).join('');
        const output = tempOverview.toString().replace('{%PRODUCT_CARDS%}', cardsHtml)

        // console.log(cardsHtml)
        res.end(output);

    // PRODUCT PAGE
    } else if(pathname == "/product") {

        res.writeHead(200, { 'content-type': 'text/html' });
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
    
        res.end(output);

    // API PAGE
    } else if(pathname == "/api"){
        res.writeHead(200, { 'content-type' : 'application/json'})
        res.end(data);

    // NOT FOUND PAGE
    } else {
        res.writeHead(404, {
            'content-type' : 'text/html',
            'mich-header' : 'hello-me'
        })
        res.end('<h1> Page not found </h1>')
    }

})






// ========================= RUNNING THE SERVER ===============================
server.listen(8000, '127.0.0.1',()=>{
 console.log('Listening to requests on port 8000');
})