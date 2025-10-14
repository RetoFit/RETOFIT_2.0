const AUTH_API = process.env.NEXT_PUBLIC_AUTH_API_URL;
const USER_API = process.env.NEXT_PUBLIC_USER_API_URL;
const GAMIFICATION_API = process.env.NEXT_PUBLIC_GAMIFICATION_API_URL;

// --- Funciones para el Servicio de Autenticación ---

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

export async function registerUser(name: string, last_name: string, email: string, password: string) {
  try {
    const response = await fetch(`${AUTH_API}/register`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'CORS-Allow-Origin': '*'  // Agregar esta línea para permitir CORS
      },
      body: JSON.stringify({ name, last_name, email, password}),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error al crear el usuario');
    }

    const data = await response.json();
    return data; // Devuelve los datos del usuario creado
  } catch (error) {
    console.error('Error: ', error);
    throw error;
  }
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