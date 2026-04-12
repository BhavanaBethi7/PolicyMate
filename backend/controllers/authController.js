const bb=require('bcryptjs')
const jwt=require('jsonwebtoken')
const user=require('../models/UserModel')
const {OAuth2Client}=require('google-auth-library')
const client=new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const createtoken=(user)=>{
    return jwt.sign(
        {
            id:user._id, 
            email:user.email,
            name:user.name
        },
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )
}

const register=async(req,res)=>{
    const {name,email,password}=req.body
    const userexist=await user.findOne({email})
    if(userexist){
        return res.json({message:"user already exists"})
    }
    if(password.length<6){
        return res.json({message:"password must be at least 6 characters"})
    }
    const hashp=await bb.hash(password,10)
    const newuser=await user.create({
        name:name,
        email:email,
        password:hashp
    })
    const token=createtoken(newuser)
    res.json({
        message:"registration successful",
        user:newuser,
        token:token
    })

}

const login=async(req,res)=>{
    const {email,password}=req.body;
    const userexist=await user.findOne({email})
    if(!userexist){
        return res.json({message:"user doesn't exist"})
    }
    const check=await bb.compare(password,userexist.password)
    if(!check){
        return res.json({message:"password invalid"})
    }
    const token=createtoken(userexist)
    res.json({
        message:"Welcome",
        user:userexist,
        token:token
    })
}

const googleLogin=async(req,res)=>{
    const {tokenId:gtoken}=req.body
    console.log('Google login attempt with token:', gtoken ? 'token provided' : 'no token')
    console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID)
    
    try{
        const ticket=await client.verifyIdToken(
            {
                idToken:gtoken,
                audience:process.env.GOOGLE_CLIENT_ID
                
            }

        )
        const {name, email}=ticket.getPayload()
        console.log('Google user verified:', {name, email})
        
        let userexist=await user.findOne({email})
        if(!userexist){
            console.log('Creating new Google user...')
            userexist=await user.create(
                {
                    name:name,
                    email:email,
                    password:"",
                    isGoogleUser:true
                }
            )
            console.log('New Google user created:', userexist._id)
        } else {
            console.log('Existing Google user found:', userexist._id)
        }
        
        const token=createtoken(userexist)
        res.json({
            message:"Google login successful",
            user:userexist,
            token:token
        })
    }catch(err){
        console.error('Google login error:', err.message)
        res.status(400).json({
            message:"Google login failed",
            error: err.message
        })
    }
}

module.exports={register,login,googleLogin}