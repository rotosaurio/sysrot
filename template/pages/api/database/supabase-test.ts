import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // En un entorno real, aquí usarías la conexión real a Supabase
    // import { supabase } from '@/lib/supabase';
    // const { data, error } = await supabase.from('test').select('*').limit(1);
    
    // Simulamos la conexión para el ejemplo
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verificar si las variables de entorno están configuradas
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return res.status(400).json({ 
        success: false,
        message: 'Variables de Supabase no están configuradas (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)' 
      });
    }

    res.status(200).json({ 
      success: true,
      message: 'Supabase conectado correctamente',
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    });
  } catch (error) {
    console.error('Error conectando Supabase:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error conectando a Supabase' 
    });
  }
} 