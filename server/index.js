//백엔드의 시작점 
const express = require('express') //익스 프레스 모듈을 가져온다. 
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const config = require('./config/key')
const { auth } = require('./middleware/auth')
const { User } = require('./models/User')

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}))

//application/json  - json 타입 분석
app.use(bodyParser.json())
// bodyParser 가 client로부터 오는 정보를 서버에서 분석해서 가져올 수 있게 해준다.

app.use(cookieParser())

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('HelloWorld')) // /루트 디렉토리에 헬로 월드가 출력되게 한다. 

app.post('/api/users/register', (req, res) => {
  //회원 가입 시 필요한 정보를 client에서 가져오면 
  //그것들을 데이터 베이스에 넣어준다.
/*
  바디 파서가 이런 식으로 만들어줌
  {
    id: 'hello',
    password: 
  }
*/
//register route
  const user = new User(req.body)
  user.save((err, userInfo) => {
    if(err) return res.json({success : false, err})
    return res.status(200).json({
      success: true
    })
  })
})

//login route
app.post('/api/users/login', (req, res) => {
  //요청된 이메일을 데이터베이스에서 있는 지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {//몽고디비에서 제공하는 메서드
    if(!user){
      return res.json({
        loginSuccess: false,
        message: '제공된 이메일에 해당하는 유저가 없습니다.'
      })
    }

  //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 비교
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch)
        return res.json({
          loginSuccess: false, 
          message: '비밀번호가 틀렸습니다.' 
        })

      //비밀번호 까지 맞다면 토큰을 생성한다. npm install jsonwebtoken --save
      //npmjs.com/package/jsonwebtoken
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err)
        
        // 토큰을 저장한다. 어디에? 쿠키, 로컬 스토리지, 세션 스토리지 
        // 어디가 안전한지는 논란이 있다. 
        // 쿠키 사용 시 npm install cookie-parser --save
        res.cookie('x_auth', user.token)
        .status(200) // 성공
        .json({ 
          loginSuccess: true, 
          userId: user._id
        })
      })
    })
  })
})

app.get('/api/users/auth', auth, (req, res) => { //auth 미드웨어 (req, res) 콜백하기전 작동
  //여기 까지 미들웨어를 통과해 왔다는  Authentication이 true 라는 말
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true, // 달라질 수 있는 부분 0이면 일반 유저 0이 아니면 관리자
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

//logout route
app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({_id: req.user._id}, {token:''}, (err, user) =>{
    if(err) return res.json({success: false, err})
    return res.status(200).send({
      success: true
    })
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`)) // 5000번 포트에서 이 앱을 실행한다.