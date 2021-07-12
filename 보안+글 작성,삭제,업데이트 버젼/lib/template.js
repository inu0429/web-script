// refactoring : 동작은 같은 코드를 실행하지만 좀 더 간결하고 내부를 개선해서 새로 만든 코드(보통 모든 코드를 짜고 다시 코드를 정리할 때 사용한다.)

const template ={
    HTML: function(title,list,body,control){
      return `<!doctype html>
      <html>
      <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
      </head>
      <body>
        <h1><a href="/">WEB</a></h1>
        ${list}
        ${control}
        ${body}
      </body>
      </html>
      `;
    },

    list: function(files){
      let list = '<ul>';
      for(let i=0;i<files.length;i++){
        list= list+`<li><a href= "/?id=${files[i]}">${files[i]}</a></li>`;
      }
      list = list+'</ul>';
    
      return list;
    }
  }

  module.exports = template;