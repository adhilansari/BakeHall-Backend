import { Router } from "express";
import { sample_users } from "../data";
import jwt from 'jsonwebtoken';
import asyncHandler from "express-async-handler";
import { User, UserModel } from "../models/user.model";
import bcrypt from 'bcryptjs'
const router = Router()


router.get("/seed", asyncHandler(
    async (req, res) => {
        const usersCount = await UserModel.countDocuments();
        if (usersCount > 0) {
            res.send("seed is already done!");
            return;
        }
        await UserModel.create(sample_users);
        res.send("seed id done!")
    }
));


router.post("/login", asyncHandler(
    async (req, res) => {
      const {email, password} = req.body;
      const user = await UserModel.findOne({email});
    
       if(user && (await bcrypt.compare(password,user.password))) {
        res.send(generateTokenResponse(user));
       }
       else{
         res.status(400).send("Username or password is invalid!");
       }
    
    }
  ))

router.post('/register', asyncHandler(
    async (req:any, res:any) => {
        const { name, email, password, address } = req.body
        const user = await UserModel.findOne({ email });
        if (user) return res.status(400).send('User is already exist, please login!')
            
        const encryptedPassword = await bcrypt.hash(password, 10);

        const newUser: User = {
            id: '',
            name,
            email,
            password: encryptedPassword,
            address,
            isAdmin: false
        };

        const dbUser = await UserModel.create(newUser)
        res.send(generateTokenResponse(dbUser))

    }
));


const generateTokenResponse = (user: User) => {
    const token = jwt.sign({
        id: user.id,email: user.email, isAdmin: user.isAdmin,
    }, process.env.JWT_SECRET!, {
        expiresIn: "15d"
    });

    user.token = token
    return user;
}



export default router;