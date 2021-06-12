const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10
// salt를 이용해서 비밀번호를 암호화 해야한다.
// salt 생성
// saltRounds 란 salt가 몇 글자인지 나타낸다. saltRounds = 10이면 10자리 salt를 이용해서 비밀번호를 암호화 한다.
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
    },
    email: {
        type: String,
        trim: true, //x e ctler@naver.com 이런 값이 들어왔을 때 trim은 공백을 없애 준다.
        unique: 1 //중복된 값은 사용하지 못한다. 
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: { //롤은 어떤 유저가 관리자가 될 수도 있고 일반 유저가 될 수 있게 만듬
        type: Number,
        default: 0 // default는 내가 임의로 값을 준게 아니면 0 값을 주겠다 의미
    },
    image: String,
    token: {
        type: String,
    },
    tokenExp: {
        type: Number
    }
})
//mongoose에서 가져온 메서드 유저 정보를 저장하기 전에 함수 실행
userSchema.pre('save', function( next ){
    var user = this //위 userSchema를 가리키는 것

    //사이트를 이용하다 보면 사용자 정보를 바꿀때가 있다.
    //바꿀 때마다 암호화 됨 그래서 아래 조건을 둔다. 패스워드가 변경될 때만
    if(user.isModified('password')){
        //비밀 번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt){ //genSalt salt를 가져온다.
            if(err) return next(err) //에러

            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err) //에러
                user.password = hash //성공 시 비밀번호를 hash로 바꿈
                next()
                //user.password : 사용자가 입력한 비밀번호
                //hash 암호화된 비밀번호
            })
        })
    }else{ // 비밀번호를 바꾸는 게 아닐 때는 next()
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, callback){
    //plainPassword 1234567 암호화된 비밀번호 ~~
    //1234567도 암호화해서 비교해야 한다. 암호화된 비밀번호를 복호화 할 수는 없다.

    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return callback(err)
            callback(null, isMatch)
    })
}

userSchema.methods.generateToken = function(callback){
    // jsonwebtoken을 이용해서 token 생성하기
    var user = this
    var token = jwt.sign(user._id.toHexString(), 'secretToken') //이름은 아무렇게나 정해도 됨

    user.token = token
    user.save(function(err, user){
        if(err) return callback(err)
        callback(null, user)
    })
}

const User = mongoose.model('User', userSchema)
module.exports = { User } //export는 이 스키마를 다른 곳에서도 사용하기 위해서  