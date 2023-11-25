import expres from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { CreateProductController, deleteProductController, getProductController, getSingleProductController, productCountController, productFilterController, productListController, productPhotoController, updateProductController } from "../controllers/ProductController.js";
import formidable from 'express-formidable'
const router=expres.Router();


router.post("/create-product",requireSignIn,isAdmin,formidable(),CreateProductController);


router.get("/get-product",getProductController)

router.get("/get-product/:slug",getSingleProductController)

router.get("/product-photo/:pid",productPhotoController)
router.delete("/delete-product/:pid",deleteProductController)



router.put("/update-product/:pid",requireSignIn,isAdmin,formidable(),updateProductController);

router.post('/product-filters',productFilterController)

router.get('/product-count',productCountController)

router.get('/product-list/:page',productListController)
export default router;