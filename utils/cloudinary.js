import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';          

cloudinary.config({ 
  cloud_name: 'dlmeuxeum', 
  api_key: '288633415826959', 
  api_secret: 'NeNK_L_VF0s9pVE3_Vpz3VBz9nY' 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" });

        console.log(response.url);
        return response;
    } catch (error) {
        console.log('Error in file upload:', error);
        fs.unlinkSync(localFilePath);
        throw error; // Re-throw the error after handling
    }
};

export default  uploadOnCloudinary;