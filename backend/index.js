import express from 'express'
import {config} from 'dotenv'
config();
import cors from 'cors'
import { addContractorsCon, deleteContractorsCon, getContractorsByIDCon, getContractorsCon, updateContractorsInfoCon } from './controller/contractorsCon.js';
import { addClientCon, deleteClientCon, getClientsByIDCon, getClientsCon, updateClientsInfoCon } from './controller/clientsCon.js';



const app = express()
const PORT = process.env.PORT 
app.use(cors())
app.use(express.json())


// paths for contractors
app.get('/contractors', getContractorsCon)
app.get('/contractorsByID/:id', getContractorsByIDCon)                          
app.post('/contractors', addContractorsCon)
app.delete('/contractors/:id', deleteContractorsCon)
app.patch('/contractors/:email', updateContractorsInfoCon)


// paths for clients
app.get('/clients', getClientsCon)
app.get('/clientsByID/:id', getClientsByIDCon);
app.post('/clients', addClientCon)
app.delete('/clients/:id', deleteClientCon);
app.patch('/clients/:email', updateClientsInfoCon); 












app.listen(PORT, ()=>{
    console.log(`http://localhost:${PORT}`);
    
}) 