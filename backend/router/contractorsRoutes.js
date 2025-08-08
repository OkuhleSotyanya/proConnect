import { addContractorsCon, deleteContractorsCon, getContractorsByIDCon, getContractorsCon, updateContractorsInfoCon } from "../controller/contractorsCon.js";


const router = express.Router();

router.get('/contractors', getContractorsCon);
router.get('/contractorsByID/:id', getContractorsByIDCon);
router.post('/contractors', addContractorsCon);
router.delete('/contractors/:id', deleteContractorsCon);
router.patch('/contractors/:email', updateContractorsInfoCon); 

export default router;
