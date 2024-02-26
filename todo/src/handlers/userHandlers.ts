import { Hono } from 'hono';
import { emailSchema, passwordSchema } from '../utils/validationUtils';
import { signup, signin } from '../db/userquery';
import { Jwt } from 'hono/utils/jwt';


const userRoutes = new Hono();
const secretToken = "SECRETKEY";

userRoutes.post('/signup', async (c) => {
    try {
        const body = await c.req.json();
        const { username, email, password } = body;
        const checkemail = emailSchema.safeParse(email);

        if (!checkemail.success) {
            c.status(404);
            return c.json({ err: "Enter valid mail" })
        }
        const checkpass = passwordSchema.safeParse(password);
        if (!checkpass.success) {
            c.status(404);
            return c.json({ err: "password requirements not met" })
        }
        try {
            await signup(username, email, password);
            c.status(200);
            return c.json({ msg: "User created successfully" })
        } catch (err) {
            c.status(400);
            return c.json({ err: err })
        }
    } catch (err) {
        c.status(400);
        return c.json({ err: err });
    }
})

userRoutes.post('/signin', async (c) => {
    try {
        const body = await c.req.json();
        const { email, password } = body;
        const checkemail = emailSchema.safeParse(email);
        if (!checkemail.success) {
            c.status(404);
            return c.json({ err: "Enter valid mail" })
        }
        try {
            const res = await signin(email, password);
            if (!res) {
                c.status(400);
                return c.json({ err: "Authentication failed. Invalid credentials" })
            }
            const jwtToken = await Jwt.sign({ username: res?.username, email: res?.email }, secretToken, 'HS256');
            c.status(200);
            return c.json({ token: jwtToken });
        } catch (err) {
            c.status(400);
            console.log(err);
            return c.json({ err: "Internal Server Error" })
        }
    } catch (err) {
        c.status(400);
        return c.json({ err: err });
    }
})
export default userRoutes;