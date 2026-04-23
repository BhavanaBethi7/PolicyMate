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
    
    // Assign admin role to specific admin email
    const userRole = email === 'admin@policymate.com' ? 'admin' : 'user'
    
    const newuser=await user.create({
        name:name,
        email:email,
        password:hashp,
        role: userRole
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
        return res.json({message:"user doesn't exist", exists: false})
    }
    const check=await bb.compare(password,userexist.password)
    if(!check){
        return res.json({message:"password invalid", exists: true})
    }
    const token=createtoken(userexist)
    res.json({
        message:"Welcome",
        user:userexist,
        token:token,
        exists: true
    })
}

const googleLogin=async(req,res)=>{
    const {tokenId:gtoken}=req.body
    
    if (!gtoken) {
        console.error('Google login error: No token provided')
        return res.status(400).json({
            success: false,
            message:"No token provided",
            error: 'Token is required'
        })
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
        console.error('Google login error: GOOGLE_CLIENT_ID not configured')
        return res.status(500).json({
            success: false,
            message:"Server configuration error",
            error: 'GOOGLE_CLIENT_ID is not configured'
        })
    }
    
    console.log('Google login attempt with token:', gtoken ? 'token provided' : 'no token')
    console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID)
    
    try{
        // Verify the JWT token from Google OAuth
        const ticket = await client.verifyIdToken({
            idToken: gtoken,
            audience: process.env.GOOGLE_CLIENT_ID
        })

        const payload = ticket.getPayload()
        const {name, email} = payload
        
        if (!email) {
            throw new Error('No email found in Google token')
        }

        console.log('Google user verified:', {name, email})
        
        let userexist = await user.findOne({email})
        if(!userexist){
            console.log('Creating new Google user...')
            userexist = await user.create({
                name: name || email,
                email: email,
                password: "",
                isGoogleUser: true
            })
            console.log('New Google user created:', userexist._id)
        } else {
            console.log('Existing Google user found:', userexist._id)
        }
        
        const token = createtoken(userexist)
        res.json({
            success: true,
            message:"Google login successful",
            user: userexist,
            token: token
        })
    }catch(err){
        console.error('Google login error:', {
            name: err.name,
            message: err.message,
            code: err.code
        })
        
        res.status(400).json({
            success: false,
            message:"Google login failed",
            error: err.message,
            details: process.env.NODE_ENV === 'development' ? err.stack : undefined
        })
    }
}

module.exports={register,login,googleLogin}