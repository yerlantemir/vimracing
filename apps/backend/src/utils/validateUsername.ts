const MAX_USERNAME_LENGTH = 15;

export const validateUsername = (username: string | null): boolean => {
  const trimmedUsername = username?.trim();
  return (
    !!trimmedUsername &&
    trimmedUsername.length <= MAX_USERNAME_LENGTH &&
    trimmedUsername.trim().length > 0
  );
};
