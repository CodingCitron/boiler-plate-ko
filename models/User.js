const mongoose = require('mongoose');

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

const User = mongoose.model('User', userSchema)

module.exports = { User }; //export는 이 스키마를 다른 곳에서도 사용하기 위해서  