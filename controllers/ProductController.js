import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from 'fs';
import { resetWatchers } from "nodemon/lib/monitor/watch.js";

export const CreateProductController=async(req,res)=>{


    try{
        const {name,description, slug, category, price,quantity,shipping}=req.fields
        const {photo} =req.files
        switch(true){
            case !name: 
                return res.status(401).json({message:"Name is required"})
                break;
            
           case !category:res.status(401).json({message:"Category is required"})
                 break;
           case !price:res.status(401).json({message:"Price is required"})
                 break;
           case !quantity:res.status(401).json({message:"Quantity is required"})
                         break;
            case photo && photo.size >1000000 :
                return res.status(401).json({message:'Image size should be less than 2mb'});
                 break;
            
        }


        const products=new productModel({...req.fields,slug:slugify(name)})
        if (photo) {
            products.photo.data=fs.readFileSync(photo.path)
            products.photo.contentType=photo.type

          }

          await products.save()
          res.status(201).send({
            success:true,
            message:"Successfully created",
            products
          })
       
        
    }
    catch(error){
        console.log('Error:', error);
        res.status(500).send({
            success:false,
            message:'Server Error',
            error
        });
    }
}

export const getProductController=async(req,res)=>{
    try{
        const products=await productModel.find({}).populate('category').select("-photo").limit(12).sort({createdAt:-1})
        res.status(201).send({
            success:true,
            count:products.length,
            message:"all products"
            ,
            products,
        })
    }
    catch(error){
        console.log('Error:', error);
        res.status(500).send({
            success:false,
        
    })
}
}

export const getSingleProductController=async(req,res)=>{

    try{
        const slug = req.params.slug;
        const product=await productModel.findOne({slug:slug}).select("-photo").populate('category')
        res.status(200).send({
            success:true,
            product,
            message:"get single category"
        })
        

    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error in getting a single product"
     
        })

    }



}

export const productPhotoController=async(req,res)=>{
    try{

        const product=await productModel.findById(req.params.pid).select("photo")
        if(product.photo.data){
            res.set('Content-type',product.photo.contentType)
            return res.status(200).send({
                success:true,
                data:product.photo.data,
                contentType:product.photo.contentType
            
            })
            }
        



    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            error,
    })
    }
}


export const deleteProductController=async(req,res)=>{
    try{
        
        const id=req.params.pid
        
        await productModel.findByIdAndDelete(id).select("-photo");
        res.status(200).send({
            success:true,
            message:'product deleted'
        });

    }
    catch(error){
        console.log(500)
        res.status(500).send({
            success:false,
            error,
            message:"Error in deleting the product"
         
     
        })
    }
}

export const updateProductController=async(req,res)=>{
    try{
        const {name,description, slug, category, price,quantity,shipping}=req.fields
        const {photo} =req.files
        switch(true){
            case !name: 
                return res.status(401).json({message:"Name is required"})
                break;
            
           case !category:res.status(401).json({message:"Category is required"})
                 break;
           case !price:res.status(401).json({message:"Price is required"})
                 break;
           case !quantity:res.status(401).json({message:"Quantity is required"})
                         break;
            case photo && photo.size >1000000 :
                return res.status(401).json({message:'Image size should be less than 2mb'});
                 break;
            
        }


        const products= await productModel.findByIdAndUpdate(req.params.pid,{...req.fields,slug:slugify(name)},{new:true})
        if (photo) {
            products.photo.data=fs.readFileSync(photo.path)
            products.photo.contentType=photo.type

          }

          await products.save()
          res.status(201).send({
            success:true,
            message:"Successfully updated",
            products
          })
       
        
    }
    catch(error){
        console.log('Error:', error);
        res.status(500).send({
            success:false,
            message:'Server Error',
            error
        });
    }
}

export const productFilterController= async(req,res)=>{
    try{
        const {checked,radio}=req.body
        let args={}
        if(checked.length>0){
            args.category=checked
        }
        if(radio.length){
            args.price={$gte:radio[0],$lte:radio[1]}

        }
        const products=await productModel.find(args)
        res.status(200).send({
            success:true,
            message:'succusfull',
            products
        })

    }catch(error){
        console.log(error)
        res.status(400).send({
            success:false,
            message:'Failed to filter products',
            error
        })
    }

}

export const productCountController = async (req, res) => {
    try {
      const total = await productModel.find({}).estimatedDocumentCount();
      res.status(200).send({
        success: true,
        total,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        message: "Error in product count",
        error,
        success: false,
      });
    }
  };

  export const productListController = async (req, res) => {
    try {
      const perPage = 2;
      const page = req.params.page ? req.params.page : 1;
      const products = await productModel
        .find({})
        .select("-photo")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .sort({ createdAt: -1 });
      res.status(200).send({
        success: true,
        products,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "error in per page ctrl",
        error,
      });
    }
  };
