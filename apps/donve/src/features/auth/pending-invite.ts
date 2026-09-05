// Bridges an invitation id across the login redirect: /accept-invite stashes it here before
// bouncing an unauthenticated visitor to /login, and login-form.tsx reads it back afterward to
// resume the accept flow instead of dropping the visitor onto the default landing page.
const PENDING_INVITE_KEY = "donve:pending-invite-id";

export function savePendingInviteId(invitationId: string) {
  sessionStorage.setItem(PENDING_INVITE_KEY, invitationId);
}

export function takePendingInviteId(): string | null {
  const id = sessionStorage.getItem(PENDING_INVITE_KEY);
  if (id) sessionStorage.removeItem(PENDING_INVITE_KEY);
  return id;
}
