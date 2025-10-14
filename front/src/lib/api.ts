const AUTH_API = process.env.NEXT_PUBLIC_AUTH_API_URL;
const USER_API = process.env.NEXT_PUBLIC_USER_API_URL;
const GAMIFICATION_API = process.env.NEXT_PUBLIC_GAMIFICATION_API_URL;
const POSTS_API = process.env.NEXT_PUBLIC_POSTS_API_URL;

// --- Funciones para el Servicio de Autenticación ---

export async function registerUser(email: string, password: string, name: string, lastName?: string) {
  const response = await fetch(`${AUTH_API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      email, 
      password, 
      name, 
      last_name: lastName || '',
      provider: 'local'
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Error al registrar usuario');
  }
  return response.json();
}

export async function loginUser(email, password) {
  const response = await fetch(`${AUTH_API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Error al iniciar sesión');
  }
  return response.json(); // Devuelve { access_token, token_type }
}

// --- Funciones para el Servicio de Usuarios ---

// Función genérica para hacer fetch con token
async function fetchWithToken(url, options = {}) {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No se encontró token de acceso. Por favor, inicie sesión.');
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    // Token inválido o expirado
    localStorage.removeItem('accessToken');
    window.location.href = '/login'; // Redirigir al login
    throw new Error('Sesión expirada.');
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Ocurrió un error en la solicitud.');
  }

  return response.json();
}


export async function getCurrentUser() {
  return fetchWithToken(`${USER_API}/me`);
}

export async function updateUserProfile(profileData) {
    return fetchWithToken(`${USER_API}/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
    });
}

export async function uploadProfilePicture(formData) {
    // Para FormData no se establece Content-Type, el navegador lo hace solo
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${USER_API}/upload-profile-picture`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
    });
     if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error al subir la imagen.');
    }
    return response.json();
}


// --- Funciones para el Servicio de Gamificación ---

export async function getAchievementsProgress(userId) {
  return fetchWithToken(`${GAMIFICATION_API}/users/${userId}/achievements-progress`);
}

// --- Funciones para el Servicio de Posts ---

export async function getPosts(page = 1, limit = 10) {
  return fetchWithToken(`${POSTS_API}/posts?page=${page}&limit=${limit}`);
}

export async function getPost(postId) {
  return fetchWithToken(`${POSTS_API}/posts/${postId}`);
}

export async function createPost(content) {
  return fetchWithToken(`${POSTS_API}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
}

export async function uploadPostImage(postId, formData) {
  const token = localStorage.getItem('accessToken');
  const response = await fetch(`${POSTS_API}/posts/${postId}/upload`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error al subir la imagen.');
  }
  return response.json();
}

export async function updatePost(postId, content) {
  return fetchWithToken(`${POSTS_API}/posts/${postId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
}

export async function deletePost(postId) {
  return fetchWithToken(`${POSTS_API}/posts/${postId}`, {
    method: 'DELETE',
  });
}

export async function getComments(postId) {
  return fetchWithToken(`${POSTS_API}/posts/${postId}/comments`);
}

export async function createComment(postId, content) {
  return fetchWithToken(`${POSTS_API}/posts/${postId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
}

export async function deleteComment(commentId) {
  return fetchWithToken(`${POSTS_API}/comments/${commentId}`, {
    method: 'DELETE',
  });
}

export async function toggleLike(postId) {
  return fetchWithToken(`${POSTS_API}/posts/${postId}/like`, {
    method: 'POST',
  });
}

export async function getLikes(postId) {
  return fetchWithToken(`${POSTS_API}/posts/${postId}/likes`);
}
