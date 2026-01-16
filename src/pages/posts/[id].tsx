import React from 'react'
import styles from '@/styles/Home.module.css';
import { getAllPosts, getPostById } from '@/utils/api';
import { PostType } from '@/utils/Types';

type Props = {
  post: PostType;
};


export async function getStaticProps({ params }: { params: { id: string } }) {
  const post: PostType = await getPostById(params.id);

  return {
    props: {
      post,
    },
  };
}

export async function getStaticPaths() {
  const posts: PostType[] = await getAllPosts();
  const paths = posts.map((post: PostType) => ({
    params: { id: post.id },
  }));
  return {
    paths,
    fallback: false,
  }
    
}

const Post = ({ post }: Props) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{post.title}</h1>
      <p className={styles.content}>{post.content}</p>
      <p className={styles.meta}>Author: {post.author}</p>
      <p className={styles.meta}>CreatedAt: {post.createdAt}</p>
    </div>
  );
};

export default Post;
