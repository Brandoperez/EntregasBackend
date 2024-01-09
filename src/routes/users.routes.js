import { Router } from "express";
import { getUser, passwordRecovery, resetPassword, deleteUser, deleteUserInactive, uploadDocuments, upload} from "../controllers/users.controller.js";
import { authorization } from "../utils/messageErrors.js";
import passport  from "passport";

const routerUser = Router();

routerUser.get('/', passport.authenticate('jwt', { session: false }), getUser);
routerUser.post('/passwordRecovery', passwordRecovery);
routerUser.post('/resetPassword/:token', resetPassword);
routerUser.delete('/', passport.authenticate('jwt', { session: false }), authorization(['admin']), deleteUserInactive);
routerUser.delete('/:id',passport.authenticate('jwt', { session: false }), authorization(['admin']), deleteUser );
routerUser.post('/:uid/documents', passport.authenticate('jwt', { session: false }), authorization(['admin']), upload.fields([{ name: 'documents' }]), uploadDocuments);

routerUser.get('/testJWT', passport.authenticate('jwt', { session: true }), async (req, res) =>{
    res.status(200).send({ mensaje: req.user});
    console.log(req.user.user)
    req.session.user = {
        first_name: req.user.user.first_name,
        last_name: req.user.user.last_name,
        age: req.user.user.age,
        email: req.user.user.email
    }
});






routerUser.get('/profile', async (req, res) =>{
    res.render('profile', {user: req.session.user});
})

export default routerUser;