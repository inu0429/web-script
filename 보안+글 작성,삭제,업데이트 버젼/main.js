const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const path = require('path');

//밑에 template를 모듈방식으로 불러오기 ->코드가 간결해짐.
const template = require('./lib/template.js');


const app = http.createServer((req,res)=>{
    let _url = req.url; // _url은 port뒷부분에 해당하는 url값을 가지고 있다.
    let queryData = url.parse(_url,true).query; //쿼리스트링 정보를 객체로 넘겨줌.
    let pathname = url.parse(_url,true).pathname;
    
    if(pathname === '/'){
      if(queryData.id === undefined){
        let title = 'WElCOME';
        let data = '성부의 홈페이지에 오신걸 환영합니다.';
        fs.readdir('./data',(err,files)=>{    //파일리스트들을 가져왔음. 배열형식
        /*`<ul>
        <li><a href="/?id=HTML">HTML</a></li>
        <li><a href="/?id=CSS">CSS</a></li>
        <li><a href="/?id=JavaScript">JavaScript</a></li>
        </ul>`;*/
        // list 형식 참조 코드

        let list = template.list(files);

        let html = template.HTML(title,list,`<h2>${title}</h2>${data}`,`<a href ="/create">create</a>`);
        res.writeHead(200);
        res.end(html);
        })
        //쿼리스트링형식으로 왔을때.
      }else{
        fs.readdir('./data',(err,files)=>{    //파일리스트들을 가져왔음.
          let list = template.list(files);
          //브라우저에서 쿼리스트링을 조작해서 모든 파일에 접근하는걸 막기위해 오직 data만 접근 가능하도록 쿼리스트링 부분에서 id만 뽑아오는 작업 (filter)
          let filteredId = path.parse(queryData.id).base;
          // creatServer 본문에 넣어버리면 '/'가 왔을 때 즉 undefined일때 처리가 안됌. path는 undefined를  못받아서.
          fs.readFile(`./data/${filteredId}`,'utf8',(err,data)=>{
          let title =queryData.id;
          let html = template.HTML(title,list,`<h2>${title}</h2>${data}`,`<a href ="/create">create</a> 
          <a href = "/update?id=${title}">update</a>
          <form action ="/delete_process" method="post">
            <input type ="hidden" name="id" value ="${title}">
            <input type = "submit" value= "delete">
          </form>`);
          res.writeHead(200); //200은 성공.
          res.end(html); //사용자에게 데이터를 전송하는 부분 node 기능.
        })}
      )};
    }else if(pathname === '/create'){
      console.log(pathname);
        fs.readdir('./data',(err,files)=>{    //파일리스트들을 가져왔음.
          let title = 'WElCOME';
          let list = template.list(files);

          let html = template.HTML(title,list,`
          <form action="/create_process"
          method="post">
              <p><input type = 'text' name="title" placeholder="title"></p>
              <p>
                  <textarea name="description" placeholder = "description"></textarea>
              </p>
              <p>
                  <input type = "submit" value="제출하기">
              </p>
          </form>
          `,``);
          res.writeHead(200);
          res.end(html);
      });
      //post방식으로 들어온 데이타를 어떻게 사용자에게 다시 보내줄 것이냐?
    }else if(pathname === '/create_process'){
      var body = '';
      req.on('data',function(data){           // 'data'나 'end'를 이벤트라고 한다. on()은 이벤트를 처리하는 메소드.
        body+=data;
      });
      req.on('end',function(){
        var post = qs.parse(body); //유저로부터 전송받은 데이터가 body안에 있고 다시 분해해서 post에 객체형식으로 담아준다.
        let title =post.title;
        let description = post.description;
        fs.writeFile(`data/${title}`,description,'utf-8',(err)=>{
          if(err) throw err;
          res.writeHead(302,{Location: `/?id=${title}`});
          res.end("success");
        })
      });
    }else if(pathname === '/update'){
      fs.readdir('./data',(err,files)=>{
        let list = template.list(files);    //파일리스트들을 가져왔음.
        let filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`,'utf8',(err,data)=>{
          let title = queryData.id;
          let html = template.HTML(title,list,
          `
          <form action="/update_process" method="post">
              <input type='hidden' name ='id' value='${title}'>
              <p><input type = 'text' name="title" placeholder="title" value ="${title}"></p>
              <p>
                  <textarea name="description" placeholder = "description">${data}</textarea>
              </p>
              <p>
                  <input type = "submit">
              </p>
          </form>                            
          `,`<a href ="/create">create</a> <a href = "/update?id=${title}">update</a>`);
          res.writeHead(200); //200은 성공.
          res.end(html); //사용자에게 데이터를 전송하는 부분 node 기능.
        })
      }
    )}else if(pathname === '/update_process'){
      var body = '';
      req.on('data',function(data){           // 'data'나 'end'를 이벤트라고 한다. on()은 이벤트를 처리하는 메소드.
        body+=data;
      });
      req.on('end',function(){
        var post = qs.parse(body); //유저로부터 전송받은 데이터가 body안에 있고 다시 분해해서 post에 객체형식으로 담아준다.
        let title =post.title;
        let id =post.id;
        let description = post.description;
        if(!(id === title)){
          fs.rename(`data/${id}`,`data/${title}`,()=>{
            console.log("file rename success");
          })
        }
        fs.writeFile(`data/${id}`,description,'utf-8',(err)=>{
          if(err) throw err;
          res.writeHead(302,{Location: `/?id=${title}`});
          res.end("success");
        })
        
      });
    }else if(pathname === '/delete_process'){
      var body = '';
      req.on('data',function(data){           // 'data'나 'end'를 이벤트라고 한다. on()은 이벤트를 처리하는 메소드.
        body+=data;
      });
      req.on('end',function(){
        var post = qs.parse(body); //유저로부터 전송받은 데이터가 body안에 있고 다시 분해해서 post에 객체형식으로 담아준다.
        let id =post.id;  
        let filteredId= path.parse(id).base;

        fs.unlink(`data/${filteredId}`,(error)=>{
            if(error){
              throw err;
            }
            else{
              res.writeHead(302,{Location: `/`});
              res.end("success");
            }
        })
      });
    }
    else{
      res.writeHead(404);  //에러는 404를 쓴다. 약속된 규정임.
      res.end("NOT FOUND");
      }
  });

console.log('서버 실행');
app.listen(3000);



