import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import { Multer } from "multer";

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "mascotas" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result!.secure_url);
        },
      );
      const stream = Readable.from(file.buffer);
      stream.pipe(uploadStream);
    });
  }
}
