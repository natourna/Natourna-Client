let currentToken: string | null = null;

export const tokenStore = {
  get(): string | null {
    return currentToken;
  },
  set(token: string | null): void {
    currentToken = token;
  },
};
