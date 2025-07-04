import { MongoClient, Db } from 'mongodb';

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

interface MongoConfig {
  uri: string;
  dbName?: string;
  options?: any;
}

class MongoDBClient {
  private client: MongoClient | null = null;
  private clientPromise: Promise<MongoClient> | null = null;
  private config: MongoConfig;

  constructor(config: MongoConfig) {
    this.config = config;
    
    if (!config.uri) {
      throw new Error('MONGODB_URI is required. Please add it to your .env.local file.');
    }

    this.initializeClient();
  }

  private initializeClient(): void {
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferMaxEntries: 0,
      bufferCommands: false,
      ...this.config.options
    };

    if (process.env.NODE_ENV === 'development') {
      // En desarrollo, usamos una variable global para preservar la conexión
      // a través de los hot reloads de Next.js
      if (!global._mongoClientPromise) {
        this.client = new MongoClient(this.config.uri, options);
        global._mongoClientPromise = this.client.connect();
      }
      this.clientPromise = global._mongoClientPromise;
    } else {
      // En producción, crear una nueva instancia
      this.client = new MongoClient(this.config.uri, options);
      this.clientPromise = this.client.connect();
    }
  }

  async getClient(): Promise<MongoClient> {
    if (!this.clientPromise) {
      throw new Error('MongoDB client not initialized');
    }
    return this.clientPromise;
  }

  async getDb(dbName?: string): Promise<Db> {
    const client = await this.getClient();
    const database = dbName || this.config.dbName || 'sysrot_app';
    return client.db(database);
  }

  async ping(): Promise<boolean> {
    try {
      const client = await this.getClient();
      await client.db().admin().ping();
      return true;
    } catch (error) {
      console.error('MongoDB ping failed:', error);
      return false;
    }
  }

  async close(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.clientPromise = null;
    }
  }

  // Utilidades para operaciones comunes
  async findOne(collection: string, filter: any, options?: any): Promise<any> {
    const db = await this.getDb();
    return db.collection(collection).findOne(filter, options);
  }

  async findMany(collection: string, filter: any = {}, options?: any): Promise<any[]> {
    const db = await this.getDb();
    return db.collection(collection).find(filter, options).toArray();
  }

  async insertOne(collection: string, document: any): Promise<any> {
    const db = await this.getDb();
    const result = await db.collection(collection).insertOne({
      ...document,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return result;
  }

  async insertMany(collection: string, documents: any[]): Promise<any> {
    const db = await this.getDb();
    const timestamp = new Date();
    const documentsWithTimestamp = documents.map(doc => ({
      ...doc,
      createdAt: timestamp,
      updatedAt: timestamp
    }));
    return db.collection(collection).insertMany(documentsWithTimestamp);
  }

  async updateOne(collection: string, filter: any, update: any): Promise<any> {
    const db = await this.getDb();
    return db.collection(collection).updateOne(filter, {
      ...update,
      $set: {
        ...(update.$set || {}),
        updatedAt: new Date()
      }
    });
  }

  async updateMany(collection: string, filter: any, update: any): Promise<any> {
    const db = await this.getDb();
    return db.collection(collection).updateMany(filter, {
      ...update,
      $set: {
        ...(update.$set || {}),
        updatedAt: new Date()
      }
    });
  }

  async deleteOne(collection: string, filter: any): Promise<any> {
    const db = await this.getDb();
    return db.collection(collection).deleteOne(filter);
  }

  async deleteMany(collection: string, filter: any): Promise<any> {
    const db = await this.getDb();
    return db.collection(collection).deleteMany(filter);
  }

  async count(collection: string, filter: any = {}): Promise<number> {
    const db = await this.getDb();
    return db.collection(collection).countDocuments(filter);
  }

  async aggregate(collection: string, pipeline: any[]): Promise<any[]> {
    const db = await this.getDb();
    return db.collection(collection).aggregate(pipeline).toArray();
  }
}

// Configuración por defecto
const mongoConfig: MongoConfig = {
  uri: process.env.MONGODB_URI || '',
  dbName: process.env.MONGODB_DB_NAME || 'sysrot_app'
};

// Instancia singleton
let mongoClient: MongoDBClient | null = null;

export function getMongoClient(): MongoDBClient {
  if (!mongoClient) {
    mongoClient = new MongoDBClient(mongoConfig);
  }
  return mongoClient;
}

// Cliente por defecto para export fácil
export const mongodb = getMongoClient();

// Tipos útiles para TypeScript
export interface BaseDocument {
  _id?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User extends BaseDocument {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user' | 'moderator';
  image?: string;
  emailVerified?: Date;
}

export interface Post extends BaseDocument {
  title: string;
  content: string;
  slug: string;
  published: boolean;
  authorId: string;
  tags?: string[];
}

// Funciones de utilidad para operaciones comunes de usuarios
export const userOperations = {
  async findByEmail(email: string): Promise<User | null> {
    return mongodb.findOne('users', { email });
  },

  async findById(id: string): Promise<User | null> {
    return mongodb.findOne('users', { _id: id });
  },

  async create(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Promise<any> {
    return mongodb.insertOne('users', userData);
  },

  async updateById(id: string, updateData: Partial<User>): Promise<any> {
    return mongodb.updateOne('users', { _id: id }, { $set: updateData });
  },

  async deleteById(id: string): Promise<any> {
    return mongodb.deleteOne('users', { _id: id });
  }
};

export default mongodb;