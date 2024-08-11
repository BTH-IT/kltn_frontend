'use server';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY!,
  },
});

export async function uploadFileToS3(file: Buffer, fileName: string, fileType: string) {
  // Extract the extension from the file type
  const extension = fileType.split('/')[1];
  const key = `${fileName.substring(0, fileName.lastIndexOf('.'))}-${Date.now()}.${extension}`;

  const uploadParams = {
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
    Key: key,
    Body: file,
  };

  const command = new PutObjectCommand(uploadParams);

  await s3Client.send(command);

  return key;
}
