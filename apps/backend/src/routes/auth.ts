import { Bindings, signInSchema, Variables } from "@repo/types/index";
import { Hono } from "hono";
import { users } from "@repo/db/index";
import bcrypt from "bcryptjs";
import { and, eq } from "drizzle-orm";

const auth = new Hono<{ Bindings: Bindings , Variables: Variables}>();

const hashPassword = async (password: string) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

auth.post("/signin", async (c) => {
  try {
    const db = c.get('db')
    const reqBody = await c.req.json();
    const parsedBody = signInSchema.safeParse(reqBody);

    if (!parsedBody.success) {
      return c.json({ success: false, message: "Invalid input data" }, 400);
    }

    const body = parsedBody.data;

    if (!body.email) {
      return c.json({ success: false, message: "Email is required" }, 400);
    }

    const existingUser = await db
      .select()
      .from(users)
      .where(and(eq(users.provider, body.provider), eq(users.email, body.email)));

    if (body.provider === "credential") {
      if (!body.password) {
        return c.json({ success: false, message: "Password is required" }, 400);
      }

      if (existingUser.length > 0) {
        const isPasswordValid = await bcrypt.compare(body.password, existingUser[0].password || "");

        if (!isPasswordValid) {
          return c.json({ success: false, message: "Incorrect password" }, 401);
        }

        return c.json(
          {
            success: true,
            message: "Signed in successfully",
            user: { id: existingUser[0].id, email: existingUser[0].email },
          },
          200
        );
      }

      const hashedPassword = await hashPassword(body.password);

      const newUser = await db
        .insert(users)
        .values({ email: body.email, password: hashedPassword, provider: body.provider })
        .returning({ id: users.id, email: users.email });

      if (newUser.length === 0) {
        return c.json({ success: false, message: "Unable to sign up. Please try again." }, 500);
      }

      return c.json(
        {
          success: true,
          message: "Signed up successfully",
          user: { id: newUser[0].id, email: newUser[0].email },
        },
        200
      );
    } else {
      if (existingUser.length > 0) {
        return c.json(
          {
            success: true,
            message: "Signed in successfully",
            user: { id: existingUser[0].id, email: existingUser[0].email },
          },
          200
        );
      }

      const newUser = await db
        .insert(users)
        .values({ email: body.email, profileImg: body.profileImg, provider: body.provider })
        .returning({ id: users.id, email: users.email });

      if (newUser.length === 0) {
        return c.json({ success: false, message: "Unable to sign up. Please try again." }, 500);
      }

      return c.json(
        {
          success: true,
          message: "Signed up successfully",
          user: { id: newUser[0].id, email: newUser[0].email },
        },
        200
      );
    }
  } catch (error: any) {
    console.error("Sign-in error:", error);
    return c.json({ success: false, message: "Something went wrong. Please try again later." }, 500);
  }
});

export default auth;