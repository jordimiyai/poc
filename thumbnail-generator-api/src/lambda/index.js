exports.handler = async (event, context, callback) => {
    const S3 = require("aws-sdk/clients/s3");
    const region = process.env.AWS_BUCKET_REGION;
    const accessKey = process.env.AWS_ACCESS;
    const secretKey = process.env.AWS_SECRET;
    
   const s3 = new S3({
     region: region,
     accessKeyId: accessKey,
     secretAccessKey:secretKey,
   });
   
     const downloadParams = {
       Bucket: event.bucket,
       Key: event.key,
     };
     console.log(downloadParams);
       const image = s3.getObject(downloadParams).createReadStream();
       callback(null, image)
     
   };
   
// Example get:
// https://sjvxqr727b.execute-api.us-east-1.amazonaws.com/default/eimi-tn?bucket=jordimiyai-thumbnail&key=florabeja_400x300.jpg