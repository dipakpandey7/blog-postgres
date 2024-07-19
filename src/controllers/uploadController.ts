import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    res.status(200).json({
      message: 'Image uploaded successfully',
      url: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


export const deleteImage = async(req:Request , res: Response)=>{
    try {
        const {public_id} = req.params;
        if(!public_id){
            return res.status(400).json({message:"something went wrong without id i can't give me Access delete post "})
        }
    
        await cloudinary.uploader.destroy(public_id);
        res.status(200).json({message :"Image delete successfully"});
    } catch (error) {
         res.status(500).json({message:"Server error" , error});
    }
}

