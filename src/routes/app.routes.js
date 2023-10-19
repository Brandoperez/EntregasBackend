import { Router} from 'express';
import routerCart from './carts.routes.js';
import routerProduct from './products.routes.js';
import routerUser from './users.routes.js';
import routerMessages from './messages.routes.js';
import routerIndex from './index.routes.js';

const router = Router();

router.use('/api/products', routerProduct);
router.use('/api/carts', routerCart);
router.use('/api/messages', routerMessages);
router.use('/api/users', routerUser);
router.use('/api/index', routerIndex);

export default router
