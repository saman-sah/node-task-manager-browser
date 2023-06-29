import express from 'express'
import GetController from '../controllers/get-controllers.js';

const router= express.Router();

router.get("/", GetController.homeController)

export default router;
