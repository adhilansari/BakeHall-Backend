
import { Request, Response, Router, json } from "express";
import asyncHandler from 'express-async-handler'
import { Food, FoodModel } from "../models/food.model";
import upload from '../middlewares/multer.mid'
// import { upload } from './../middlewares/multer.mid';

const cloud = require('../configs/cloudinary.config')
// import { cloud } from "../configs/cloudinary.config";
const router =Router();

//get all foods
router.get('/',asyncHandler(
    async (req,res)=>{
        const foods= await FoodModel.find()
        res.send(foods)
    }
));

router.post('/image',upload.single('file'), asyncHandler(
    async (req:Request,res:Response)=>{

        const {file, body} = req;
        console.log(file, body);

        try {
            // console.log(req);
            
        const result = await cloud.uploader.upload(req.file?.path)
        
        // console.log(req.file?.path,'file path');
        
        res.json(result)
       const  images = result.secure_url            
        } catch (error) {
            console.log(error);
            
        }
    }
))

//create food
router.post('/food',upload.single('imgFile'),asyncHandler(
    async (req:Request,res:Response)=>{

        try {
            const { name, cookTime, price, tags,origins } = await req.body
            const result = await cloud.uploader.upload(req.file?.path);
            const images = result.secure_url;   
            const newFood:Food={
                id:'',
                name,
                price,
                tags,
                favorite:false,
                stars:0,
                imageUrl:images,
                origins,
                cookTime
            }
    
            const dbFood= await FoodModel.create(newFood)
            res.send(dbFood)
                
            } catch (error) {
                console.log(error);
            }
    }
));

//delete food
router.delete('/food/:id',
    async (req,res)=>{
        const {id}=req.params
        
        const food = await FoodModel.findByIdAndDelete(id)
        
        if(!food){
			 res.status(404).json({message:`cannot find any Food with ID ${id}`});
		}        
		res.status(200).json(food)
    }
);

// //update food
router.put('/food/:id',
    async (req,res)=>{
        const id=req.params.id  
        const food = await FoodModel.findByIdAndUpdate(id,req.body)
        if(!food){
			 res.status(404).json({message:`cannot find any food with ID ${id}`});
		}
		const updatedFood = await FoodModel.findById(id)
		res.status(200).json(updatedFood)
    }
)

export default router;