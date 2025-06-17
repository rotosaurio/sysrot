import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // En un entorno real, aquí usarías la conexión real a MongoDB
    // import { connectDB } from '@/lib/db';
    // await connectDB();
    
    // Simulamos la conexión para el ejemplo
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verificar si las variables de entorno están configuradas
    if (!process.env.MONGODB_URI) {
      return res.status(400).json({ 
        success: false,
        message: 'MONGODB_URI no está configurada en las variables de entorno' 
      });
    }

    res.status(200).json({ 
      success: true,
      message: 'MongoDB conectado correctamente',
      uri: process.env.MONGODB_URI?.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@') || 'No configurado'
    });
  } catch (error) {
    console.error('Error conectando MongoDB:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error conectando a MongoDB' 
    });
  }
} 