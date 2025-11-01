export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  PROFILE: '/profile',
  SETTINGS: '/settings',

  EVENTS: '/events',
  EVENT_DETAIL: (id: string) => `/events/${id}`,
  EVENT_CREATE: '/events/create',
  EVENT_EDIT: (id: string) => `/events/${id}/edit`,
  MY_EVENTS: '/my-events',

  GROUPS: '/groups',
  GROUP_DETAIL: (id: string) => `/groups/${id}`,
  GROUP_CREATE: '/groups/create',
  GROUP_EDIT: (id: string) => `/groups/${id}/edit`,
  MY_GROUPS: '/my-groups',

  EXPLORE: '/explore',
  MESSAGES: '/messages',
  CHAT: (userId: string) => `/messages/${userId}`,

  NEWS: '/news',
  NEWS_DETAIL: (id: string) => `/news/${id}`,

  USER_PROFILE: (id: string) => `/users/${id}`,
} as const;
