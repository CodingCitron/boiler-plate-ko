const { User } = require('../models/User')

let auth = (req, res, next) => {
  //인증 처리
  //1. 클라이언트 쿠키에서 token을 가져온다.
  let token = req.cookies.x_auth;

  //2. 토큰을 복호화한 후 유저를 찾는다.
  User.findByToken(token, (err, user) => {
    console.log(user)
      if(err) throw err 
      if(!user) return res.json({isAuth: false, error: true}) // 유저가 없으면

      //유저가 있으면
      req.token = token
      req.user = user
      next()//넥스트가 있어야 미드웨어에서 다음 콜백으로 넘어감 없으면 여기서 머뭄
  })
  //3. 유저가 있으면 인증 Okay
  //4. 유저가 없으면 인증 No
}

module.exports = { auth } //다른데에서도 사용 가능하게 만듬