const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { 
  getAllClients, 
  getAllContractors, 
  getAllPayments, 
  deleteClientById, 
  deleteContractorById 
} = require("../controllers/adminController");

// Admin only middleware
router.use(authMiddleware(['admin']), (req, res, next) => {
  console.log(req.user);
  
  if (req.user.user_role != "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
});

// Client routes
router.get("/clients", getAllClients);
router.delete("/clients/:id", deleteClientById);

// Contractor routes
router.get("/contractors", getAllContractors);
router.delete("/contractors/:id", deleteContractorById);

// Payments route
router.get("/payments", getAllPayments);

module.exports = router;
