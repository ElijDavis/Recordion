/*import aj from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import { ArcjetDecision, slidingWindow, validateEmail } from "@arcjet/next";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";
import ip from '@arcjet/ip';

//No. 1: You may need to delete this. refer to the mulit line comment below
//const authHandlers = toNextJsHandler(auth.handler) //taken out because a new decalration was made further down

//Email validation
const emailValidation = aj.withRule(validateEmail({mode: 'LIVE', block: ['DISPOSABLE', 'INVALID', 'NO_MX_RECORDS']}))

const rateLimit = aj.withRule(
    slidingWindow({
        mode: 'LIVE',
        interval: '2m',
        max: 2,
        characteristics: ['fingerprint']
    })
)

const protectedAuth = async (req: NextRequest): Promise<ArcjetDecision> => {
    const session = await auth.api.getSession({headers: req.headers});

    let userId: string;

    if(session?.user?.id) {
        userId = session.user.id;
    } else {
        userId = ip(req) || '127.0.0.1'
    }

    if(req.nextUrl.pathname.startsWith('/api/auth/sign-in')) {
        console.log('Sign-in request detected, checking email validation...');
        const body = await req.clone().json();
        if(typeof body.email === 'string') {
            return emailValidation.protect(req, {email: body.email});
        }
    }

    return rateLimit.protect(req, {fingerprint: userId});
}

const authHandlers = toNextJsHandler(auth.handler)

//No. 2: You may need to delete this too. refer to the mulit line comment below
export const {GET} = authHandlers;

//export const {GET, POST} = toNextJsHandler(auth.handler)

export const POST = async (req: NextRequest) => {
    const decision = await protectedAuth(req);
    if (decision.isDenied()) {
        if(decision.reason.isEmail()){
            throw new Error(`Email validation failed: ${decision.reason}`);
        }
        if(decision.reason.isRateLimit()) {
            throw new Error(`Rate limit exceeded: ${decision.reason}`);
        }
        if(decision.reason.isShield()) {
            throw new Error(`Shield turned on, protected against mailicions actions: ${decision.reason}`);
        }
    }

    return authHandlers.POST(req);
}*/

// app/api/auth/route.ts or wherever your route file is




import aj from "@/lib/arcjet";
import { slidingWindow } from "@arcjet/next";
import { validateEmail } from "@arcjet/next";
import { shield } from "@arcjet/next";
// import the ArcjetDecision type from the correct package
import type { ArcjetDecision } from "@arcjet/next";
import ip from "@arcjet/ip";
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";

const emailValidation = aj.withRule(
  validateEmail({
    mode: "LIVE",
    block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
  })
);

const rateLimit = aj.withRule(
  slidingWindow({
    mode: "LIVE",
    interval: "2m",
    max: 2,
    characteristics: ["fingerprint"],
  })
);

const shieldValidation = aj.withRule(
  shield({
    mode: "LIVE",
  })
);

const protectedAuth = async (req: NextRequest): Promise<ArcjetDecision> => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  let userId: string;
  if (session?.user.id) {
    userId = session.user.id;
  } else {
    userId = ip(req) || "127.0.0.1";
  }
  if (req.nextUrl.pathname.startsWith("/api/auth/sign-in")) {
    const body = await req.clone().json();
    if (typeof body.email === "string") {
      return emailValidation.protect(req, {
        email: body.email,
      });
    }
  }
  if (!req.nextUrl.pathname.startsWith("/api/auth/sign-out")) {
    return rateLimit.protect(req, {
      fingerprint: userId,
    });
  }
  return shieldValidation.protect(req);
};

const authHandlers = toNextJsHandler(auth.handler);

export const { GET } = authHandlers;

export const POST = async (req: NextRequest) => {
  const decision = await protectedAuth(req);
  if (decision.isDenied()) {
    if (decision.reason.isEmail()) {
      throw new Error("Email validation failed");
    }
    if (decision.reason.isRateLimit()) {
      throw new Error("Rate limit exceeded");
    }
    if (decision.reason.isShield()) {
      throw new Error("Shield validation failed");
    }
  }

  return authHandlers.POST(req);
};