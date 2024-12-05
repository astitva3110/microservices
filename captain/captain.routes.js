const express=require('express');
const { model } = require('mongoose');
const router=express.Router();
const userController=require('./controllers/captain.controller')
const authMiddleware=require('./middleware/auth')



router.post('/register',userController.postRegister);
router.post('/login',userController.postLogin);
router.get('/logout', userController.logout);
router.get('/profile', authMiddleware.userAuth, userController.profile);


module.exports=router;