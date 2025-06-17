import fs from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

// Definir la ruta donde se almacenarán los posts del blog
const rootDirectory = path.join(process.cwd(), 'content/blog');

// Tipo para los metadatos del post
export interface PostMetadata {
  title: string;
  description: string;
  date: string;
  slug: string;
  tags?: string[];
  author?: string;
  image?: string;
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

  const posts = [];

  for (const file of markdownFiles) {
    const filePath = path.join(rootDirectory, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Extraer metadatos del frontmatter
    const { frontmatter } = await compileMDX<PostMetadata>({
      source: fileContent,
      options: { 
        parseFrontmatter: true,
        mdxOptions: {
          rehypePlugins: [rehypeHighlight, rehypeSlug],
          remarkPlugins: [remarkGfm],
        } 
      },
    });

    // Crear slug a partir del nombre del archivo
    const slug = file.replace(/\.mdx$/, '');
    
    posts.push({
      ...frontmatter,
      slug,
    });
  }

  // Ordenar por fecha descendente
  return posts.sort((a, b) => {
    if (new Date(a.date) > new Date(b.date)) return -1;
    if (new Date(a.date) < new Date(b.date)) return 1;
    return 0;
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
  
  // Extraer metadatos y contenido
  const { content, frontmatter } = await compileMDX<PostMetadata>({
    source: fileContent,
    options: { 
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [rehypeHighlight, rehypeSlug],
        remarkPlugins: [remarkGfm],
      } 
    },
  });
  
  return {
    ...frontmatter,
    slug,
    content: fileContent,
  };
} 