const AUTH_API = process.env.NEXT_PUBLIC_AUTH_API_URL;
const USER_API = process.env.NEXT_PUBLIC_USER_API_URL;
const GAMIFICATION_API = process.env.NEXT_PUBLIC_GAMIFICATION_API_URL;
const POSTS_API = process.env.NEXT_PUBLIC_POSTS_API_URL;

// --- Funciones para el Servicio de Autenticación ---

export async function loginUser(email: string, password: string) {
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

export async function registerUser(userData: { name: string, last_name?: string, email: string, password?: string, provider?: string }) {
  const response = await fetch(`${AUTH_API}/register`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
  });

  if (!response.ok) {
      const errorData = await response.json();
      // El backend puede devolver errores en un array o como un objeto
      if (Array.isArray(errorData.detail)) {
          throw new Error(errorData.detail.map((e: any) => e.msg).join(', '));
      }
      throw new Error(errorData.detail || 'Error al registrar el usuario');
  }
  return response.json(); // Devuelve { status, message, user_id }
}

export async function socialLogin(userData: { name: string, email: string, provider: string, provider_id: string}) {
  const response = await fetch(`${AUTH_API}/social-login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Error en el inicio de sesión social');
  }

  return response.json(); // Devuelve { access_token, token_type }
}


// --- Funciones para el Servicio de Usuarios ---

// Función genérica para hacer fetch con token
async function fetchWithToken(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No se encontró token de acceso. Por favor, inicie sesión.');
  }

  const headers: HeadersInit = {
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


export async function getCurrentUser(): Promise<{ is_profile_complete: boolean; [key: string]: any }> {
  return fetchWithToken(`${USER_API}/me`);
}

export async function updateUserProfile(profileData: {
  name?: string;
  last_name?: string;
  age?: number;
  weight?: number;
  height?: number;
  gender?: string;
  fitness_level?: string;
  favorite_sports?: string;
}) {
    return fetchWithToken(`${USER_API}/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
    });
}

export async function uploadProfilePicture(formData: FormData) {
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

export async function getAchievementsProgress(userId: number) {
  return fetchWithToken(`${GAMIFICATION_API}/users/${userId}/achievements-progress`);
}

// --- Functions for the Posts Service ---

export async function getPosts(page = 1, limit = 10) {
  return fetchWithToken(`${POSTS_API}/posts?page=${page}&limit=${limit}`);
}

export async function getPost(postId: number) {
  return fetchWithToken(`${POSTS_API}/posts/${postId}`);
}

export async function createPost(content: string) {
  return fetchWithToken(`${POSTS_API}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
}

export async function uploadPostImage(postId: number, formData: FormData) {
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

export async function updatePost(postId: number, content: string) {
  return fetchWithToken(`${POSTS_API}/posts/${postId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
}

export async function deletePost(postId: number) {
  return fetchWithToken(`${POSTS_API}/posts/${postId}`, {
    method: 'DELETE',
  });
}

export async function getComments(postId: number) {
  return fetchWithToken(`${POSTS_API}/posts/${postId}/comments`);
}

export async function createComment(postId: number, content: string) {
  return fetchWithToken(`${POSTS_API}/posts/${postId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
}

export async function deleteComment(commentId: number) {
  return fetchWithToken(`${POSTS_API}/comments/${commentId}`, {
    method: 'DELETE',
  });
}

export async function toggleLike(postId: number) {
  return fetchWithToken(`${POSTS_API}/posts/${postId}/like`, {
    method: 'POST',
  });
}

export async function getLikes(postId: number) {
  return fetchWithToken(`${POSTS_API}/posts/${postId}/likes`);
}
