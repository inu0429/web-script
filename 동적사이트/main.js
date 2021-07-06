const http = require('http');
const fs = require('fs');
const url = require('url');

const app = http.createServer((req,res)=>{
    let _url = req.url;
    let queryData = url.parse(_url,true).query;
    var title = queryData.id;
    console.log(queryData.id)
    if(req.url === '/'){
        title = 'welcome';
    }
    if(req.url === '/favicon.ico'){
        return res.writeHead(404);
    }
    res.writeHead(200);
    fs.readFile(`data/${queryData.id}`,'utf8',(err,data)=>{
    let template = `<!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <ul>
        <li><a href="/?id=HTML">HTML</a></li>
        <li><a href="/?id=CSS">CSS</a></li>
        <li><a href="/?id=JavaScript">JavaScript</a></li>
      </ul>
      <h2>${title}</h2>
      <p>${data}</p>
    </body>
    </html>
    `
    res.end(template); //사용자에게 데이터를 전송하는 부분 node 기능.
    })
});
console.log('서버 실행');

app.listen(3000);



