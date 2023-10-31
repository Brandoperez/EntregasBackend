import { Router } from "express";
import { createTickets, getTickets } from "../controllers/tickets.controller.js";

const routerTicket = Router();

routerTicket.get('/create', createTickets);
routerTicket.get('/', getTickets);

export default routerTicket;