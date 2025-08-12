import { addContractors, deleteContractors, getContractors, getContractorsByID, updateContractorByEmail } from "../models/contractorsDB.js"



// controller to get contractors
export const getContractorsCon = async (req, res) =>{
    res.json({
        data : await getContractors(),
    })
}

// controller to get contractors by ID
export const getContractorsByIDCon = async (req, res) => {
     res.json ({
        data: await getContractorsByID()
     })

}

// controller to add contractors
export const addContractorsCon = async (req, res) => {
  try {
    const contractorData = req.body; // get data from client

    const result = await addContractors(contractorData); // pass data to model

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

// controller to delete contractors

export const deleteContractorsCon = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting contractor with ID:", id);

    const result = await deleteContractors(Number(id));
    res.status(200).json({ data: result });

  } catch (error) {
    console.error("Error in deleteContractorCon:", error);
    res.status(500).json({ error: "Server error" });
  }
};


// controller to update contractors info

export const updateContractorsInfoCon = async (req, res) => {
  try {
    const { email } = req.params;
    const updates = req.body;

    if (!email || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "Email and update fields required" });
    }

    const result = await updateContractorByEmail(email, updates);
    res.status(200).json({ message: "Contractor updated successfully", data: result });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Server error during contractor update" });
  }
};
