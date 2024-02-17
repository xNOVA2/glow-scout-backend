import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';          
cloudinary.config({ 
  cloud_name: 'dlmeuxeum', 
  api_key: '288633415826959', 
  api_secret: 'NeNK_L_VF0s9pVE3_Vpz3VBz9nY' 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        // if the local file does not exist
        if(!localFilePath) return null

        // file exist now upload on cloundary

    const response =  cloudinary.uploader.upload(localFilePath,{resource_type: "auto"})

        console.log(response.url);
        return response  
    } catch (error) {
        fs.unlinkSync(localFilePath);
    }
}

const localFilePath = '/path/to/local/file.jpg';
uploadOnCloudinary(localFilePath)
    .then((result) => {
        console.log('File uploaded successfully:', result);
    })
    .catch((error) => {
        console.log('Error in file upload:', error);
    });
cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
  { public_id: "olympic_flag" }, 
  function(error, result) {console.log(result); });