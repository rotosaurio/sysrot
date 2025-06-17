import { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import fs from "fs";

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Deshabilitar el parsing de body por defecto
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    // Parsear form data con formidable
    const form = new formidable.IncomingForm();
    
    const parseForm = () => {
      return new Promise<{fields: formidable.Fields, files: formidable.Files}>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve({ fields, files });
        });
      });
    };

    const { files } = await parseForm();
    const uploadedFile = files.file as formidable.File;

    if (!uploadedFile) {
      return res.status(400).json({ error: "No se ha proporcionado ningún archivo" });
    }

    // Leer el archivo
    const fileData = fs.readFileSync(uploadedFile.filepath);
    const fileBase64 = fileData.toString("base64");
    const fileUri = `data:${uploadedFile.mimetype};base64,${fileBase64}`;

    // Subir a Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        fileUri,
        {
          folder: "next-app",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
    });

    return res.status(200).json(uploadResult);
  } catch (error) {
    console.error("Error al subir a Cloudinary:", error);
    return res.status(500).json({ error: "Error al procesar la solicitud" });
  }
} 