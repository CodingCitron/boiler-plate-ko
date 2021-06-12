//백엔드의 시작점 

const express = require('express') //익스 프레스 모듈을 가져온다. 
const app = express()
const port = 5000

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://xectler:as907312!@cluster0.iwk4g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('HelloWorld')) // /루트 디렉토리에 헬로 월드가 출력되게 한다. 

app.listen(port, () => console.log(`Example app listening on port ${port}!`)) // 5000번 포트에서 이 앱을 실행한다.