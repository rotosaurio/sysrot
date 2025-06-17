import Link from "next/link";
import { GetStaticProps } from "next";
import { getAllPosts } from "@/lib/mdx";
import { PostMetadata } from "@/lib/mdx";

interface BlogPageProps {
  posts: PostMetadata[];
}

export const getStaticProps: GetStaticProps<BlogPageProps> = async () => {
  const posts = await getAllPosts();
  
  return {
    props: {
      posts,
    },
    revalidate: 60 * 60, // Revalidar cada hora
  };
};

export default function BlogPage({ posts }: BlogPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Blog</h1>
      
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} legacyBehavior>
              <a className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                {post.image && (
                  <div className="relative w-full h-48">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {new Date(post.date).toLocaleDateString()} 
                    {post.author && ` · ${post.author}`}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {post.description}
                  </p>
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </a>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">
            No hay artículos disponibles
          </h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Vuelve pronto para ver nuevo contenido
          </p>
        </div>
      )}
    </div>
  );
} 