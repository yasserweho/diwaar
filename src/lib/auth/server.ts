/**
 * Self-hosted Better Auth for THIS app (server-only).
 */
import { betterAuth } from "better-auth";
import { bearer, genericOAuth } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { getCookie } from "@tanstack/react-start/server";
import { randomBytes } from "node:crypto";
import { Pool } from "pg";
import { ensureDbReady, getPglite } from "../db";
import { emailAndPasswordEnabled } from "./email-password";
import { GATE_PROVIDER_ID, gateIdentitySessions } from "./gate-session.server";
import { GROK_PROVIDERS } from "./providers";
import { pgliteDialect } from "./pglite-dialect";
import {
  GROK_ISSUER_DEFAULT,
  PREVIEW_ALLOWED_HOSTS,
  PREVIEW_CLIENT_ID,
  PREVIEW_CLIENT_SECRET,
} from "./preview";

void ensureDbReady();

const globalAuthRef = globalThis as typeof globalThis & {
  __grokAuthPreviewSecret__?: string;
};
function previewAuthSecret(): string {
  globalAuthRef.__grokAuthPreviewSecret__ ??= randomBytes(32).toString("hex");
  return globalAuthRef.__grokAuthPreviewSecret__;
}

const env = (key: string): string | undefined => {
  const value = process.env[key]?.trim();
  return value ? value : undefined;
};

const authDisabled = env("VITE_AUTH_ENABLED") === "false";

const grokIssuer = env("GROK_AUTH_ISSUER") ?? GROK_ISSUER_DEFAULT;
const grokClientId = env("GROK_AUTH_CLIENT_ID") ?? PREVIEW_CLIENT_ID;
const grokClientSecret = env("GROK_AUTH_CLIENT_SECRET") ?? PREVIEW_CLIENT_SECRET;

const googleClientId = env("GOOGLE_CLIENT_ID");
const googleClientSecret = env("GOOGLE_CLIENT_SECRET");
const nativeGoogle = Boolean(googleClientId && googleClientSecret);

const twitterClientId = env("TWITTER_CLIENT_ID") ?? env("X_CLIENT_ID");
const twitterClientSecret = env("TWITTER_CLIENT_SECRET") ?? env("X_CLIENT_SECRET");
const nativeTwitter = Boolean(twitterClientId && twitterClientSecret);

export const authConfigured =
  !authDisabled && Boolean(grokClientId && grokClientSecret);

const explicitBaseURL = env("BETTER_AUTH_URL");
const previewAllowedHosts: string[] = [...PREVIEW_ALLOWED_HOSTS];
const APP_HOSTS = ["diwaar.com", "www.diwaar.com"];
const LOCAL_DEV_ORIGINS: string[] = [
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "http://[::1]:8080",
];
let configuredHost: string | undefined;
if (explicitBaseURL) {
  try {
    configuredHost = new URL(explicitBaseURL).host;
  } catch {
    configuredHost = undefined;
  }
}

const baseURL = {
  allowedHosts: [
    ...previewAllowedHosts,
    ...APP_HOSTS,
    "localhost",
    "127.0.0.1",
    "[::1]",
    ...(configuredHost ? [configuredHost] : []),
  ],
  protocol: "auto" as const,
  fallback: explicitBaseURL ?? "https://www.diwaar.com",
};

const trustedOrigins: string[] = [
  ...APP_HOSTS.flatMap((host) => [`https://${host}`, `http://${host}`]),
  ...previewAllowedHosts,
  ...previewAllowedHosts.flatMap((host) => [`https://${host}`, `http://${host}`]),
  ...LOCAL_DEV_ORIGINS,
  ...(explicitBaseURL ? [explicitBaseURL] : []),
];

const databaseUrl = env("DATABASE_URL");

const issuerBase = grokIssuer.replace(/\/+$/, "");
const grokAuthorizationUrl = `${issuerBase}/api/auth/oauth2/authorize`;
const grokTokenUrl = `${issuerBase}/api/auth/oauth2/token`;
const grokUserInfoUrl = `${issuerBase}/api/auth/oauth2/userinfo`;

const database = databaseUrl
  ? new Pool({ connectionString: databaseUrl })
  : { dialect: pgliteDialect(() => getPglite()), type: "postgres" as const };

export const SESSION_TOKEN_COOKIE = "diwaar.session_token";

// Signed-in users should stay signed in across visits. The session cookie itself
// carries the user for this long, so a serverless database reset does not log
// them out after a few minutes. Shared on diwaar.com and www.diwaar.com.
const SESSION_SECONDS = 60 * 60 * 24 * 90;
const isVercelProduction = env("VERCEL_ENV") === "production";
const shareAcrossDiwaar = isVercelProduction;

// The shared preview broker client only allows *.grok-sandbox.com callbacks.
const useBroker =
  authConfigured &&
  !(isVercelProduction && grokClientId === PREVIEW_CLIENT_ID);

const grokOAuthPlugin = useBroker
  ? genericOAuth({
      config: GROK_PROVIDERS.map(({ providerId, idp }) => ({
        providerId,
        clientId: grokClientId as string,
        clientSecret: grokClientSecret as string,
        authorizationUrl: grokAuthorizationUrl,
        tokenUrl: grokTokenUrl,
        userInfoUrl: grokUserInfoUrl,
        scopes: ["openid", "profile", "email"],
        authorizationUrlParams: { idp, prompt: "login" },
      })),
    })
  : null;

export const auth = betterAuth({
  baseURL,
  secret: env("BETTER_AUTH_SECRET") ?? previewAuthSecret(),
  database,
  trustedOrigins,
  onAPIError: {
    errorURL: "/login",
  },
  ...(nativeGoogle || nativeTwitter
    ? {
        socialProviders: {
          ...(nativeGoogle
            ? {
                google: {
                  clientId: googleClientId as string,
                  clientSecret: googleClientSecret as string,
                },
              }
            : {}),
          ...(nativeTwitter
            ? {
                twitter: {
                  clientId: twitterClientId as string,
                  clientSecret: twitterClientSecret as string,
                  // users.email fails the whole login if that permission is off in the X app.
                  disableDefaultScope: true,
                  scope: ["users.read", "tweet.read", "offline.access"],
                  mapProfileToUser(profile: {
                    data?: { email?: string; confirmed_email?: string; username?: string; id?: string };
                  }) {
                    const data = profile?.data ?? {};
                    const email = data.email || data.confirmed_email;
                    if (email) return { email };
                    const handle = (data.username || data.id || "user").replace(/[^\w.-]/g, "");
                    return { email: `${handle}@users.diwaar.com` };
                  },
                },
              }
            : {}),
        },
      }
    : {}),
  account: {
    encryptOAuthTokens: true,
    accountLinking: {
      enabled: true,
      trustedProviders: [
        ...GROK_PROVIDERS.map((p) => p.providerId),
        ...(nativeGoogle ? ["google"] : []),
        ...(nativeTwitter ? ["twitter"] : []),
        GATE_PROVIDER_ID,
      ],
      requireLocalEmailVerified: false,
    },
  },
  session: {
    expiresIn: SESSION_SECONDS,
    updateAge: 60 * 60 * 24,
    cookieCache: { enabled: true, maxAge: SESSION_SECONDS },
  },
  ...(emailAndPasswordEnabled ? { emailAndPassword: { enabled: true } } : {}),
  advanced: {
    useSecureCookies: false,
    crossSubDomainCookies: shareAcrossDiwaar
      ? { enabled: true, domain: "diwaar.com" }
      : undefined,
    defaultCookieAttributes: { secure: true, sameSite: "lax" as const, path: "/" },
    cookies: {
      session_token: { name: SESSION_TOKEN_COOKIE },
      session_data: { name: "diwaar.session_data" },
      account_data: { name: "diwaar.account_data" },
      dont_remember: { name: "diwaar.dont_remember" },
    },
  },
  plugins: [
    gateIdentitySessions(),
    ...(grokOAuthPlugin ? [grokOAuthPlugin] : []),
    bearer(),
    tanstackStartCookies(),
  ],
});

export function readSessionToken(): string | null {
  return getCookie(SESSION_TOKEN_COOKIE) ?? null;
}

export { GROK_PROVIDERS } from "./providers";
