import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Definir la ruta donde se almacenarán los posts del blog
const rootDirectory = path.join(process.cwd(), 'posts');

// Tipo para los metadatos del post
export interface PostMetadata {
  title: string;
  description: string;
  date: string;
  slug: string;
  tags?: string[];
  author?: string;
  image?: string;
  readingTime?: string;
  featured?: boolean;
}

// Tipo para el post completo
export interface Post extends PostMetadata {
  content: string;
}

// Función para obtener todos los posts
export async function getAllPosts(): Promise<PostMetadata[]> {
  // Verificar si el directorio existe
  if (!fs.existsSync(rootDirectory)) {
    return [];
  }

  const files = fs.readdirSync(rootDirectory);
  const markdownFiles = files.filter((file) => file.endsWith('.mdx'));

  const posts: PostMetadata[] = [];

  for (const file of markdownFiles) {
    const filePath = path.join(rootDirectory, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Extraer metadatos del frontmatter usando gray-matter
    const { data } = matter(fileContent);

    // Crear slug a partir del nombre del archivo
    const slug = file.replace(/\.mdx$/, '');
    
    posts.push({
      title: data.title || 'Sin título',
      description: data.description || '',
      date: data.date || new Date().toISOString(),
      author: data.author,
      tags: data.tags || [],
      image: data.image,
      readingTime: data.readingTime,
      featured: data.featured || false,
      slug,
    });
  }

  // Ordenar por fecha descendente
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

// Función para obtener un post por su slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const filePath = path.join(rootDirectory, `${slug}.mdx`);
  
  // Verificar si el archivo existe
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  // Extraer metadatos y contenido usando gray-matter
  const { data, content } = matter(fileContent);
  
  return {
    title: data.title || 'Sin título',
    description: data.description || '',
    date: data.date || new Date().toISOString(),
    author: data.author,
    tags: data.tags || [],
    image: data.image,
    readingTime: data.readingTime,
    featured: data.featured || false,
    slug,
    content,
  };
} 