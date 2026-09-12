const PROFILE_KEY = "personax-profile-preferences";
const profileListeners = new Set<() => void>();

export function subscribeToProfile(listener: () => void) {
  profileListeners.add(listener);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === PROFILE_KEY) listener();
  };
  window.addEventListener("storage", handleStorage);
  return () => {
    profileListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function getProfilePreferencesSnapshot() {
  return typeof window === "undefined" ? "" : window.localStorage.getItem(PROFILE_KEY) ?? "";
}

type ProfilePreferences = {
  avatarDataUrl?: string;
  favoritePersonaSlug?: string;
};

type ProfilePreferencesStore = Record<string, ProfilePreferences>;

function getStore(): ProfilePreferencesStore {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as ProfilePreferencesStore) : {};
  } catch {
    return {};
  }
}

function saveStore(store: ProfilePreferencesStore) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(store));
    profileListeners.forEach((listener) => listener());
  }
}

export function getProfilePreferences(userId: string): ProfilePreferences {
  return getStore()[userId] ?? {};
}

export function saveProfilePreferences(userId: string, preferences: ProfilePreferences) {
  const store = getStore();
  store[userId] = { ...store[userId], ...preferences };
  saveStore(store);
}

export function removeProfileAvatar(userId: string) {
  const store = getStore();
  const current = store[userId];

  if (!current) {
    return;
  }

  delete current.avatarDataUrl;
  store[userId] = current;
  saveStore(store);
}
