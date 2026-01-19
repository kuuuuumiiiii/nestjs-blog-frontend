export async function getAllPosts() {
  const response = await fetch('http://localhost:5050/posts', {
    method: 'GET',
  });
  const data = await response.json();
  return data;
}

export async function getPostById(id: string) {
  const response = await fetch(`http://localhost:5050/posts/${id}`, {
    method: 'GET',
  });
  const data = await response.json();
  return data;
}

export async function createPost(input: {
  title: string;
  content: string;
  author: string;
}) {
  const response = await fetch('http://localhost:5050/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Failed to create post: ${response.status} ${text}`);
  }

  return await response.json();
}

export async function updatePost(
  id: string,
  input: {
    title?: string;
    content?: string;
    author?: string;
  }
) {
  const response = await fetch(`http://localhost:5050/posts/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Failed to update post: ${response.status} ${text}`);
  }

  return await response.json();
}

export async function deletePost(id: string) {
  const response = await fetch(`http://localhost:5050/posts/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Failed to delete post: ${response.status} ${text}`);
  }
}
