import * as React from 'react';
import { useState } from 'react';

export default function DatabaseExample(): React.ReactElement {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({
    mongodb: 'No probado',
    supabase: 'No probado',
    firebase: 'No probado'
  });

  // Ejemplo de conexión MongoDB
  const testMongoDB = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/database/mongodb-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'connect' })
      });
      
      const result = await response.json();
      setConnectionStatus(prev => ({
        ...prev,
        mongodb: response.ok ? 'Conectado' : 'Error'
      }));
    } catch (error) {
      setConnectionStatus(prev => ({
        ...prev,
        mongodb: 'Error'
      }));
    }
    setLoading(false);
  };

  // Ejemplo de conexión Supabase
  const testSupabase = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/database/supabase-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'connect' })
      });
      
      const result = await response.json();
      setConnectionStatus(prev => ({
        ...prev,
        supabase: response.ok ? 'Conectado' : 'Error'
      }));
    } catch (error) {
      setConnectionStatus(prev => ({
        ...prev,
        supabase: 'Error'
      }));
    }
    setLoading(false);
  };

  // Ejemplo de conexión Firebase
  const testFirebase = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/database/firebase-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'connect' })
      });
      
      const result = await response.json();
      setConnectionStatus(prev => ({
        ...prev,
        firebase: response.ok ? 'Conectado' : 'Error'
      }));
    } catch (error) {
      setConnectionStatus(prev => ({
        ...prev,
        firebase: 'Error'
      }));
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Ejemplos de Base de Datos</h1>
        <p className="text-muted-foreground text-lg">
          Ejemplos de conexión y uso de diferentes bases de datos soportadas por el template.
        </p>
      </div>

      {/* Sección 1: Estado de conexiones */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">1. Estado de Conexiones</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* MongoDB */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">MongoDB</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                connectionStatus.mongodb === 'Conectado' 
                  ? 'bg-green-100 text-green-800' 
                  : connectionStatus.mongodb === 'Error'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {connectionStatus.mongodb}
              </span>
            </div>
            <p className="text-muted-foreground mb-4">
              Base de datos NoSQL con Mongoose ODM
            </p>
            <button
              onClick={testMongoDB}
              disabled={loading}
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-colors"
            >
              Probar Conexión
            </button>
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded text-sm">
              <code>MONGODB_URI=mongodb://localhost:27017/mydb</code>
            </div>
          </div>

          {/* Supabase */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Supabase</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                connectionStatus.supabase === 'Conectado' 
                  ? 'bg-green-100 text-green-800' 
                  : connectionStatus.supabase === 'Error'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {connectionStatus.supabase}
              </span>
            </div>
            <p className="text-muted-foreground mb-4">
              PostgreSQL con tipos TypeScript automáticos
            </p>
            <button
              onClick={testSupabase}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
            >
              Probar Conexión
            </button>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
              <code>NEXT_PUBLIC_SUPABASE_URL=https://...</code>
            </div>
          </div>

          {/* Firebase */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Firebase</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                connectionStatus.firebase === 'Conectado' 
                  ? 'bg-green-100 text-green-800' 
                  : connectionStatus.firebase === 'Error'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {connectionStatus.firebase}
              </span>
            </div>
            <p className="text-muted-foreground mb-4">
              Firestore con autenticación y real-time
            </p>
            <button
              onClick={testFirebase}
              disabled={loading}
              className="w-full px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white rounded-lg font-medium transition-colors"
            >
              Probar Conexión
            </button>
            <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded text-sm">
              <code>NEXT_PUBLIC_FIREBASE_API_KEY=...</code>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 2: Ejemplos de código */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">2. Ejemplos de Código</h2>
        
        <div className="space-y-8">
          {/* MongoDB Example */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">MongoDB con Mongoose</h3>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre>{`// lib/db.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error conectando MongoDB:', error);
  }
};

// models/User.js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);

// pages/api/users.js
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';

export default async function handler(req, res) {
  await connectDB();
  
  if (req.method === 'GET') {
    const users = await User.find();
    res.json(users);
  } else if (req.method === 'POST') {
    const user = await User.create(req.body);
    res.json(user);
  }
}`}</pre>
            </div>
          </div>

          {/* Supabase Example */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Supabase</h3>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre>{`// lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// components/UserList.tsx
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    
    if (data) setUsers(data);
  };

  const addUser = async (userData) => {
    const { data, error } = await supabase
      .from('users')
      .insert([userData]);
    
    if (data) fetchUsers();
  };

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}`}</pre>
            </div>
          </div>

          {/* Firebase Example */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Firebase Firestore</h3>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre>{`// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// components/FirebaseUsers.tsx
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function FirebaseUsers() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const usersData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setUsers(usersData);
  };

  const addUser = async (userData) => {
    await addDoc(collection(db, 'users'), {
      ...userData,
      createdAt: new Date()
    });
    fetchUsers();
  };

  // Real-time listener
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    });

    return () => unsubscribe();
  }, []);
}`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* Sección 3: Comparación */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">3. Comparación de Características</h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4">Característica</th>
                <th className="text-left py-3 px-4">MongoDB</th>
                <th className="text-left py-3 px-4">Supabase</th>
                <th className="text-left py-3 px-4">Firebase</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-3 px-4 font-medium">Tipo</td>
                <td className="py-3 px-4">NoSQL Document</td>
                <td className="py-3 px-4">PostgreSQL</td>
                <td className="py-3 px-4">NoSQL Document</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-3 px-4 font-medium">Real-time</td>
                <td className="py-3 px-4">❌ No nativo</td>
                <td className="py-3 px-4">✅ Sí</td>
                <td className="py-3 px-4">✅ Sí</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-3 px-4 font-medium">Autenticación</td>
                <td className="py-3 px-4">❌ Externa</td>
                <td className="py-3 px-4">✅ Incluida</td>
                <td className="py-3 px-4">✅ Incluida</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-3 px-4 font-medium">Tipos TypeScript</td>
                <td className="py-3 px-4">⚠️ Manual</td>
                <td className="py-3 px-4">✅ Automático</td>
                <td className="py-3 px-4">⚠️ Manual</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-3 px-4 font-medium">Escalabilidad</td>
                <td className="py-3 px-4">✅ Excelente</td>
                <td className="py-3 px-4">✅ Muy buena</td>
                <td className="py-3 px-4">✅ Excelente</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">Costo</td>
                <td className="py-3 px-4">💰 Variable</td>
                <td className="py-3 px-4">💰 Freemium</td>
                <td className="py-3 px-4">💰 Freemium</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Información adicional */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
        <h3 className="font-semibold mb-4">Configuración en .env.local:</h3>
        <div className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium mb-2">MongoDB:</h4>
            <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded">
              MONGODB_URI=mongodb://localhost:27017/mydb
              # o MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/mydb
            </code>
          </div>
          <div>
            <h4 className="font-medium mb-2">Supabase:</h4>
            <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded">
              NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co<br/>
              NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key<br/>
              SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
            </code>
          </div>
          <div>
            <h4 className="font-medium mb-2">Firebase:</h4>
            <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded">
              NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key<br/>
              NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=yourproject.firebaseapp.com<br/>
              NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
            </code>
          </div>
        </div>
      </div>
    </div>
  );
} 