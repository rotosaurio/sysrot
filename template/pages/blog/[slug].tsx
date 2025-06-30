import { GetStaticPaths, GetStaticProps } from "next";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { getAllPosts, getPostBySlug, Post } from "@/lib/mdx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "@/components/providers/intl-provider";

interface BlogPostProps {
  post: Post;
  mdxSource: any;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPosts();
  
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));
  
  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<BlogPostProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return {
      notFound: true,
    };
  }
  
  // Serializar el contenido MDX sin plugins problemáticos
  const mdxSource = await serialize(post.content, {
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
    },
  });
  
  return {
    props: {
      post,
      mdxSource,
    },
    revalidate: 60 * 60, // Revalidar cada hora
  };
};

export default function BlogPostPage({ post, mdxSource }: BlogPostProps) {
  const router = useRouter();
  const { t } = useTranslation();
  
  if (router.isFallback) {
    return <div className="container mx-auto p-4">{t('blog.loading')}</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link 
        href="/blog" 
        className="text-blue-600 dark:text-blue-400 hover:underline mb-8 inline-block"
      >
        {t('blog.backToBlog')}
      </Link>
      
      <article className="prose prose-lg dark:prose-invert max-w-none">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            {post.author && (
              <>
                <span className="mx-2">·</span>
                <span>{post.author}</span>
              </>
            )}
          </div>
          
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
        </header>
        
        {post.image && (
          <div className="mb-8">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        )}
        
        <div className="mdx-content prose prose-gray dark:prose-invert">
          <MDXRemote {...mdxSource} />
        </div>
      </article>
    </div>
  );
} 