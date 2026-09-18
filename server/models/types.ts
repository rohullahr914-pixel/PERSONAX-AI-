export type Visibility = "public" | "private";

export type User = {
  id: string;
  email: string;
  name: string;
  status: "active" | "suspended";
  createdAt: string;
  updatedAt: string;
};

export type UserProfile = {
  id: string;
  userId: string;
  displayName: string;
  bio: string;
  visibility: Visibility;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
};

export type Category = { id: string; name: string; slug: string; description: string; createdAt: string; updatedAt: string };

export type Persona = {
  id: string;
  name: string;
  categoryId: string;
  profession: string;
  description: string;
  expertise: string[];
  isPublic: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Conversation = { id: string; userId: string; personaId?: string; title: string; status: "active" | "archived"; createdAt: string; updatedAt: string };
export type Message = { id: string; conversationId: string; personaId?: string; role: "user" | "assistant" | "system"; content: string; createdAt: string };
export type Memory = { id: string; userId: string; type: "preference" | "fact" | "goal"; summary: string; source: string; createdAt: string; updatedAt: string };
export type Favorite = { id: string; userId: string; personaId: string; createdAt: string };
export type CustomPersona = { id: string; userId: string; name: string; profession: string; description: string; expertise: string[]; visibility: Visibility; createdAt: string; updatedAt: string };
export type MultiPersonaSession = { id: string; userId: string; title: string; personaIds: string[]; createdAt: string; updatedAt: string };
export type ResearchSession = { id: string; userId: string; query: string; status: "pending" | "completed" | "failed"; createdAt: string; updatedAt: string };
export type Setting = { id: string; userId: string; key: string; value: string; isSecret: boolean; createdAt: string; updatedAt: string };
export type AnalyticsEvent = { id: string; eventType: "page_view" | "login" | "signup"; path: string; country: string; device: string; browser: string; referrer?: string; visitorId: string; createdAt: string };

export type EntityMap = {
  users: User;
  profiles: UserProfile;
  categories: Category;
  personas: Persona;
  conversations: Conversation;
  messages: Message;
  memories: Memory;
  favorites: Favorite;
  customPersonas: CustomPersona;
  multiPersonaSessions: MultiPersonaSession;
  researchSessions: ResearchSession;
  settings: Setting;
  analyticsEvents: AnalyticsEvent;
};
