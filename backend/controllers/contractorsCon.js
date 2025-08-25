const {
  addContractors,
  deleteContractors,
  getContractors,
  getContractorsByID,
  updateContractorByID
} = require("../models/contractorsDB");

// controller to get all contractors
const getContractorsCon = async (req, res) => {
  try {
    const contractors = await getContractors();
    res.json({ data: contractors });
  } catch (error) {
    console.error("Error fetching contractors:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// controller to get contractor by ID
const getContractorsByIDCon = async (req, res) => {
  try {
    const { id } = req.params;
    const contractor = await getContractorsByID(id);
    res.json({ data: contractor });
  } catch (error) {
    console.error("Error fetching contractor by ID:", error);
    res.status(500).json({ error: "Failed to fetch contractor" });
  }
};

// controller to add a contractor
const addContractorsCon = async (req, res) => {
  try {
    const contractorData = req.body;
    const result = await addContractors(contractorData);
    res.status(201).json({
      success: true,
      message: "Contractor added successfully",
      data: result
    });
  } catch (error) {
    console.error("Error adding contractor:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// controller to delete contractor
const deleteContractorsCon = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteContractors(Number(id));
    res.status(200).json({ data: result });
  } catch (error) {
    console.error("Error deleting contractor:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// controller to update contractor info
const updateContractorsInfoCon = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "ID and update fields required" });
    }

    const result = await updateContractorByID(id, updates);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Contractor not found" });
    }

    res.status(200).json({
      message: "Contractor updated successfully",
      data: result
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Server error during contractor update" });
  }
};

module.exports = {
  getContractorsCon,
  getContractorsByIDCon,
  addContractorsCon,
  deleteContractorsCon,
  updateContractorsInfoCon
};
