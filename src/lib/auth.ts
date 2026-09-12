export type AppLanguage = "en" | "fa" | "ar" | "tr" | "es" | "fr" | "de";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  language: AppLanguage;
  createdAt: string;
};

export type StoredUser = AppUser & {
  passwordHash: string;
};

const USERS_KEY = "personax-users";
const CURRENT_USER_KEY = "personax-current-user";
const authListeners = new Set<() => void>();
let cachedUserRaw: string | null | undefined;
let cachedUser: AppUser | null = null;

export function subscribeToAuth(listener: () => void) {
  authListeners.add(listener);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === CURRENT_USER_KEY) {
      cachedUserRaw = undefined;
      listener();
    }
  };
  window.addEventListener("storage", handleStorage);
  return () => {
    authListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function hashPassword(value: string) {
  return btoa(unescape(encodeURIComponent(value)));
}

export function getStoredUsers(): StoredUser[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser(): AppUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(CURRENT_USER_KEY);
    if (raw === cachedUserRaw) {
      return cachedUser;
    }

    cachedUserRaw = raw;
    cachedUser = raw ? (JSON.parse(raw) as AppUser) : null;
    return cachedUser;
  } catch {
    cachedUserRaw = null;
    cachedUser = null;
    return null;
  }
}

export function setCurrentUser(user: AppUser | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (!user) {
    window.localStorage.removeItem(CURRENT_USER_KEY);
    cachedUserRaw = null;
    cachedUser = null;
    authListeners.forEach((listener) => listener());
    return;
  }

  const raw = JSON.stringify(user);
  window.localStorage.setItem(CURRENT_USER_KEY, raw);
  cachedUserRaw = raw;
  cachedUser = user;
  authListeners.forEach((listener) => listener());
}

export function signupUser(input: { name: string; email: string; password: string }) {
  const trimmedName = input.name.trim();
  const trimmedEmail = input.email.trim().toLowerCase();
  const trimmedPassword = input.password.trim();

  if (!trimmedName || !trimmedEmail || !trimmedPassword) {
    return { ok: false, error: "Please fill in all required fields." } as const;
  }

  if (trimmedPassword.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters long." } as const;
  }

  const users = getStoredUsers();
  const exists = users.some((user) => user.email === trimmedEmail);

  if (exists) {
    return { ok: false, error: "An account with this email already exists." } as const;
  }

  const user: StoredUser = {
    id: crypto.randomUUID(),
    name: trimmedName,
    email: trimmedEmail,
    language: "en",
    createdAt: new Date().toISOString(),
    passwordHash: hashPassword(trimmedPassword),
  };

  saveStoredUsers([...users, user]);

  const publicUser: AppUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    language: user.language,
    createdAt: user.createdAt,
  };

  setCurrentUser(publicUser);

  return { ok: true, user: publicUser } as const;
}

export function loginUser(input: { email: string; password: string }) {
  const trimmedEmail = input.email.trim().toLowerCase();
  const trimmedPassword = input.password.trim();

  if (!trimmedEmail || !trimmedPassword) {
    return { ok: false, error: "Email and password are required." } as const;
  }

  const user = getStoredUsers().find((stored) => stored.email === trimmedEmail);

  if (!user) {
    return { ok: false, error: "No account found for this email." } as const;
  }

  if (hashPassword(trimmedPassword) !== user.passwordHash) {
    return { ok: false, error: "Incorrect password." } as const;
  }

  const publicUser: AppUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    language: user.language,
    createdAt: user.createdAt,
  };

  setCurrentUser(publicUser);

  return { ok: true, user: publicUser } as const;
}

export function logoutUser() {
  setCurrentUser(null);
}
