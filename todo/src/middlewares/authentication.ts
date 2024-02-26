
import { Jwt } from 'hono/utils/jwt'
import {  verify } from '../db/userquery'


export default async function AuthMiddleware (c:any, next:any) {
   const AuthHeader= c.req.header("Authorization")
  if (AuthHeader) {
    const tokenArray = AuthHeader.split(' ');
    if (tokenArray.length === 2) {
      const token :string= tokenArray[1];
      try {
        const decodedData = await Jwt.decode(token);
        const res = await verify(decodedData.email, decodedData.username);
        if (res) {
          c.username=res.username;
          await next();
        } else {
          c.status(401); 
          return c.json({ error: "Authentication failed" });
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        c.status(500); 
        return c.json({ error: "Internal Server Error" });
      }
    } else {
    c.status(400);
    return c.json({err:"Invalid Authorization header format"})
    }
    
  } else {
    c.status(400);
    return c.json({err:"Token not found"});
  }
}