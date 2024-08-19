const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
  function generateToken(payload){
    const token = jwt.sign(payload,process.env.JWT_SECRET)
    console.log(token);
    return token;
}


async function hassPassword(password){
    const hashedPassword = await bcrypt.hash(password,10);
    return hashedPassword;
}

async function comparePassword(password,hassPassword){
    const isCorrect = await bcrypt.compare(password,hassPassword)
    return isCorrect;
}
module.exports ={hassPassword,comparePassword,generateToken};