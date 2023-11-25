import slugify from 'slugify';

 import CategoryModel from "../models/CategoryModel.js";
export const createCategoryController=async (req,res)=>{

try{
    const {name }=req.body;
    if(!name){
        return res.status(401).send({message:"name is required"})
    }
    const existingCategory =await CategoryModel.findOne({name})
    if(existingCategory){
        return res.status(200).send({
            success:true,
            message:"category Already exisits"
        })
    }
    const category =await  new CategoryModel({name,slug:slugify(name)}).save()
    res.status(201).send({
        success:true,
        message:"new category  created",
        category
    })

}catch(error){
    console.log("Error in create category controller", error);  
    res.status(500).send({
        success:flase,
        error,
        message:'error in category'
    })
}

}

export const updateCategoryController= async(req,res)=>{
    try{
        const id = req.params.id;
        const name = req.body.name;
        let category = await CategoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new: true});
        res.status(200).send({
            success:true,
            message:"category updated successfully",
            category
        });
 

    }
    catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error in updating  file "
        })
    }
}

export const categoryController=async (req,res)=>{
try{
    const category=await CategoryModel.find({})
    res.status(200).send(
        {
            success:true,
            category
        }
     
    )


}catch(error){
    consle.log(error)
    res.status(500).send({
        success:false,
        error,
        message:"Error in getting all categories"
   

    })
}
}
    
export const singleCategoryController=async(req,res)=>{
    try{
        const slug = req.params.slug;
        const category=await CategoryModel.findOne({slug:slug})
        res.status(200).send({
            success:true,
            category,
            message:"get single category"
        })
        

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error in getting a single category"
     
        })

    }
}
export const deleteCategoryController=async(req,res)=>{
    try{
        const id=req.params.id
        
        await CategoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success:true,
            message:'category deleted'
        });

    }
    catch(error){
        consle.log(500)
        res.status(500).send({
            success:false,
            error,
            message:"Error in deleting the category"
         
     
        })
    }
}