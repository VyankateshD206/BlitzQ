import { Bindings, Variables } from "@repo/types/index";
import { Context, Next } from "hono";
import { Jwt } from "hono/utils/jwt";

export const validateUser = async (c : Context<{Bindings : Bindings, Variables : Variables}>, next : Next) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ success:false, message: "Unauthorized" }, 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return c.json({ success:false, message: "Unauthorized" }, 401);
    }
    
    try {

        const decoded = await Jwt.verify(token, c.env.JWT_SECRET)
        c.set("user", decoded)

        await next();

    } catch (error: any) {
        return c.json({ success:false, message: "Invalid token" }, 403);
    }
}