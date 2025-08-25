const express = require("express");
const {
  getContractorsCon,
  getContractorsByIDCon,
  addContractorsCon,
  deleteContractorsCon,
  updateContractorsInfoCon
} = require("../controllers/contractorsCon");

const router = express.Router();

router.get("/contractors", getContractorsCon);
router.get("/contractorsByID/:id", getContractorsByIDCon);
router.post("/contractors", addContractorsCon);
router.delete("/contractors/:id", deleteContractorsCon);
router.patch("/contractors/:id", updateContractorsInfoCon);

module.exports = router;
