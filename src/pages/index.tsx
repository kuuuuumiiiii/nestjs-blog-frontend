import { Geist, Geist_Mono } from 'next/font/google';
import styles from '@/styles/Home.module.css';
import { getAllPosts } from '@/utils/api';
import { PostType } from '@/utils/Types';
import Link from 'next/link';
import type { GetServerSideProps } from 'next';

type Props = {
  posts: PostType[];
};

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const posts: PostType[] = await getAllPosts();
  return { props: { posts } };
};

export default function Home({ posts }: Props) {
  return (
    <div
      className={`${geistSans.className} ${geistMono.className} flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black`}
    >
      <div className={styles.container}>
        <h1>Nest.js Blog</h1>
        <div className={styles.actions}>
          <Link className={styles.buttonLink} href="/posts/new">
            New Post
          </Link>
        </div>
        <ul className={styles.postList}>
          {posts.map((post: PostType) => (
            <Link href={`/posts/${post.id}`} key={post.id}>
              <li className={styles.post} key={post.id}>
                <h2 className={styles.title}>{post.title}</h2>
                <p className={styles.author}>by{post.author}</p>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
}
