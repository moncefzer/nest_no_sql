export enum Routes {
  AUTH = 'auth',
  USERS = 'users',
  USERS_PROFILES = 'users/profiles',
  CONVERSATIONS = 'conversations',
  MESSAGES = 'conversations/:id/messages',
  GROUPS = 'groups',
  GROUP_MESSAGES = 'groups/:id/messages',
  GROUP_RECIPIENTS = 'groups/:id/recipients',
  EXISTS = 'exists',
  FRIENDS = 'friends',
  FRIEND_REQUESTS = 'friends/requests',
  USER_PRESENCE = 'users/presence',
}

export enum SocketEvents {
  ON_CONVERSATION_JOIN = 'onConversationJoin',
  ON_CONVERSATION_LEAVE = 'onConversationLeave',
  ON_CONVERSATION_CREATE = 'onConversationCreate',
  ON_MESSAGE_CREATE = 'onMessageCreate',
}

export enum ServerEvents {
  CONVERSATION_CREATE = 'conversation.create',
  MESSAGE_CREATE = 'message.create',
  MESSAGE_DELETE = 'message.delete',
  MESSAGE_UPDATE = 'message.update',
}
