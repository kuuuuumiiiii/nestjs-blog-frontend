import styles from '@/styles/Home.module.css';
import { deletePost, updatePost } from '@/utils/api';
import type { PostType } from '@/utils/Types';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

type Props = {
  post: PostType;
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const id = String(context.params?.id ?? '');
  const res = await fetch(`http://localhost:5050/posts/${id}`);

  if (res.status === 404) return { notFound: true };
  if (!res.ok) throw new Error(`Failed to fetch post ${id}: ${res.status}`);

  const post: PostType = await res.json();
  return { props: { post } };
};

export default function EditPostPage({ post }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [author, setAuthor] = useState(post.author);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const updated: PostType = await updatePost(post.id, { title, content, author });
      await router.push(`/posts/${updated.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新に失敗しました');
      setIsSubmitting(false);
    }
  }

  async function onDelete() {
    const ok = confirm('この投稿を削除します。よろしいですか？');
    if (!ok) return;

    setError(null);
    setIsSubmitting(true);

    try {
      await deletePost(post.id);
      await router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : '削除に失敗しました');
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.actions}>
        <Link className={styles.buttonLink} href={`/posts/${post.id}`}>
          ← Back
        </Link>
      </div>

      <h1 className={styles.title}>Edit Post</h1>

      <form className={styles.form} onSubmit={onSubmit}>
        <label className={styles.label}>
          Title
          <input
            className={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label className={styles.label}>
          Content
          <textarea
            className={styles.textarea}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={8}
          />
        </label>

        <label className={styles.label}>
          Author
          <input
            className={styles.input}
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </label>

        {error ? <p className={styles.error}>{error}</p> : null}

        <div className={styles.row}>
          <button className={styles.button} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
          <button
            className={styles.dangerButton}
            type="button"
            onClick={onDelete}
            disabled={isSubmitting}
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}


