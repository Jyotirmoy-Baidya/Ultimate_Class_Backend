const Users=require("../Models/user")
const { ErrorHandler } = require('../utils/errorHandler')
const createUser=async(req,res,next)=>{
    
    try{
        const findUser=Users.findOne({email:body.email});
        //for login
        if(findUser){
            res.status(200).json({
                success:true,
            })
        }else{
            const user=await Users.create(req.body)
            res.status(200).json({
                success:true,
                data:user
            })
    }
    }catch(err){
        next(new ErrorHandler(err.message,404))
    }
    
}



module.exports={createUser}