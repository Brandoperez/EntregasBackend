import { Router } from "express";
import passport from "passport";
import { createTickets, getTickets } from "../controllers/tickets.controller.js";

const routerTicket = Router();

routerTicket.get('/create', passport.authenticate('jwt', { session: false }), createTickets);
routerTicket.get('/', passport.authenticate('jwt', { session: false }), getTickets);

export default routerTicket;