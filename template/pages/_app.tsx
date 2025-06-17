import { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { Layout } from '@/components/ui/layout';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>SysRot Base - Next.js Template</title>
        <meta name="description" content="Creado con sysrot-base" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className={inter.className}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <Toaster position="bottom-right" />
        </div>
      </ThemeProvider>
    </>
  );
}

export default MyApp; 