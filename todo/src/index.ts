import {Hono} from 'hono'
import postRoutes from './handlers/postHandlers';
import userRoutes from './handlers/userHandlers';


const app = new Hono();

app.route('/posts',postRoutes);
app.route('/users',userRoutes);
export default app;