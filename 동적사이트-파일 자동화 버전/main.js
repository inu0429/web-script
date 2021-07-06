const http = require('http');
const fs = require('fs');
const url = require('url');

const app = http.createServer((req,res)=>{
    let _url = req.url; // _url은 port뒷부분에 해당하는 url값을 가지고 있다.
    let queryData = url.parse(_url,true).query;
    let pathname = url.parse(_url,true).pathname;
    
    if(pathname === '/'){
      if(queryData.id === undefined){
        let title = 'WElCOME';
        let data = '성부의 홈페이지에 오신걸 환영합니다.';
        fs.readdir('./data',(err,files)=>{    //파일리스트들을 가져왔음.
        /*`<ul>
        <li><a href="/?id=HTML">HTML</a></li>
        <li><a href="/?id=CSS">CSS</a></li>
        <li><a href="/?id=JavaScript">JavaScript</a></li>
        </ul>`;*/
        // list 참조 코드
        let list = '<ul>';
        for(let i=0;i<files.length;i++){
          list= list+`<li><a href= "/?id=${files[i]}">${files[i]}</a></li>`;
        }
        list = list+'</ul>';

        let template = `<!doctype html>
        <html>
        <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
          ${list}
          <h2>${title}</h2>
          <p>${data}</p>
        </body>
        </html>
        `;
        res.writeHead(200);
        res.end(template);
        })

      }else{
        fs.readdir('./data',(err,files)=>{    //파일리스트들을 가져왔음.
        /*`<ul>
          <li><a href="/?id=HTML">HTML</a></li>
          <li><a href="/?id=CSS">CSS</a></li>
          <li><a href="/?id=JavaScript">JavaScript</a></li>
          </ul>`;*/
          // list 참조 코드
          let list = '<ul>';
          for(let i=0;i<files.length;i++){
            list= list+`<li><a href= "/?id=${files[i]}">${files[i]}</a></li>`;
          }
          list = list+'</ul>'

        fs.readFile(`data/${queryData.id}`,'utf8',(err,data)=>{
        let title = queryData.id;
        let template = `<!doctype html>
        <html>
        <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
          ${list}
          <h2>${title}</h2>
          <p>${data}</p>
        </body>
        </html>
        `;
        res.writeHead(200); //200은 성공.
        res.end(template); //사용자에게 데이터를 전송하는 부분 node 기능.
        })}
      )};
    }else{
      res.writeHead(404);  //에러는 404를 쓴다. 약속된 규정임.
      res.end("NOT FOUND");
      }
  });

console.log('서버 실행');

app.listen(3000);



