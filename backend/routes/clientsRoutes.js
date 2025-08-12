import { addClientCon, deleteClientCon, getClientsByIDCon, getClientsCon, updateClientsInfoCon } from "../controller/clientsCon";

const router = express.Router();

router.get('/clients', getClientsCon)
router.get('/clientsByID/:id', getClientsByIDCon)
router.post('/clients', addClientCon);
router.delete('/clients/:id', deleteClientCon);
router.patch('/clients/:email', updateClientsInfoCon);

export default router;