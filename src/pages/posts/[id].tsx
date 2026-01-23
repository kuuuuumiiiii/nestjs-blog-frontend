import React from 'react';
import styles from '@/styles/Home.module.css';
import { PostType } from '@/utils/Types';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import { deletePost } from '@/utils/api';
import { useRouter } from 'next/router';
import { useState } from 'react';

type Props = {
  post: PostType;
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const id = String(context.params?.id ?? '');
  const res = await fetch(`http://localhost:5050/posts/${id}`);

  if (res.status === 404) {
    return { notFound: true };
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch post ${id}: ${res.status}`);
  }

  const post: PostType = await res.json();
  return { props: { post } };
};

const Post = ({ post }: Props) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function onDelete() {
    const ok = confirm('この投稿を削除します。よろしいですか？');
    if (!ok) return;

    setIsDeleting(true);
    try {
      await deletePost(post.id);
      await router.push('/');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.actions}>
        <Link className={styles.buttonLink} href="/">
          ← 戻る
        </Link>
      </div>
      <h1 className={styles.title}>{post.title}</h1>
      <p className={styles.content}>{post.content}</p>
      <p className={styles.meta}>Author: {post.author}</p>
      <p className={styles.meta}>CreatedAt: {post.createdAt}</p>

      <div className={styles.postActionsRight}>
        <Link className={styles.buttonLink} href={`/posts/edit/${post.id}`}>
          Edit
        </Link>
        <button
          className={styles.dangerButton}
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default Post;
