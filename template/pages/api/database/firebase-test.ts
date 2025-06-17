import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // En un entorno real, aquí usarías la conexión real a Firebase
    // import { db } from '@/lib/firebase';
    // import { collection, getDocs } from 'firebase/firestore';
    // const snapshot = await getDocs(collection(db, 'test'));
    
    // Simulamos la conexión para el ejemplo
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verificar si las variables de entorno están configuradas
    const requiredVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
    ];
    
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      return res.status(400).json({ 
        success: false,
        message: `Variables de Firebase faltantes: ${missingVars.join(', ')}` 
      });
    }

    res.status(200).json({ 
      success: true,
      message: 'Firebase conectado correctamente',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
    });
  } catch (error) {
    console.error('Error conectando Firebase:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error conectando a Firebase' 
    });
  }
} 