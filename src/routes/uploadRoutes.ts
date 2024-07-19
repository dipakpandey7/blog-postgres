import { Router } from 'express';
import upload from '../middlewares/MulterMiddleware';
import { deleteImage, uploadImage } from '../controllers/uploadController';

const router = Router();

router.post('/upload', upload.single('image'), uploadImage);
router.delete('/delete/:public_id',deleteImage );

export default router;
