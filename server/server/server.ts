import * as express from 'express';
import * as path from 'path';
const app=express();
// app.all('*', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
//   res.header("X-Powered-By",' 3.2.1');
//   res.header("Content-Type", "application/json;charset=utf-8");
//   next();
// });
// app.use('/',express.static(path.join(__dirname,'..','dist')));

app.get('/login',(request,response)=>{
  let data={'zhang':124};
  response.json(data);
})

const server=app.listen(8080,'localhost',()=>{
  console.log('localhost:8080');
});


