if(process.env.NODE_ENV === 'production'){//NODE_ENV는 환경변수다. 두 가지 모드를 판별
    module.exports = require('./prod'); //prod.js에서 가져오겠다.
}else{
    module.exports = require('./dev');
}