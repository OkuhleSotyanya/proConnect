
const bcrypt = require('bcrypt');
const Contractor = require('../models/contractorModel');

// List with search + pagination + sorting
async function list(req, res) {
  try {
    const {
      search = '',
      page = '1',
      limit = '10',
      sortBy = 'full_name',
      sortDir = 'asc'
    } = req.query;

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

    const { data, total } = await Contractor.listContractors({
      search: String(search),
      page: pageNum,
      limit: limitNum,
      sortBy: String(sortBy),
      sortDir: String(sortDir)
    });

    res.json({
      success: true,
      data,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (err) {
    console.error('Error listing contractors:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Get all contractors
async function getAll(req, res) {
    try {
        const contractors = await Contractor.getAllContractors();
        res.json(contractors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Get contractor by ID
async function getById(req, res) {
  try {
    const contractor = await Contractor.getContractorById(req.params.id);
    if (!contractor) {
      return res.status(404).json({ success: false, message: 'Contractor not found' });
    }
    res.json({ success: true, data: contractor });
  } catch (err) {
    console.error('Error fetching contractor:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Create contractor
async function create(req, res) {
  try {
    const {
      email,
      password,
      full_name,
      phone_number,
      address,
      certification_pdf,
      card_photo,
      hourly_rate,
      job_experience,
      description
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'email and password are required' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const contractor = await Contractor.createContractor({
      email,
      passwordHash,
      full_name,
      phone_number,
      address,
      certification_pdf,
      card_photo,
      hourly_rate,
      job_experience,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Contractor created',
      data: contractor
    });
  } catch (err) {
    // Handle duplicate email gracefully
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'Email already in use' });
    }
    console.error('Error creating contractor:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Update contractor details
async function update(req, res) {
  try {
    const affected = await Contractor.updateContractor(req.params.id, req.body);
    if (!affected) {
      return res.status(404).json({ success: false, message: 'Contractor not found or no changes made' });
    }
    res.json({ success: true, message: 'Contractor updated' });
  } catch (err) {
    console.error('Error updating contractor:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Update contractor email only
async function updateEmail(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'email is required' });

    const affected = await Contractor.updateContractorEmail(req.params.id, email);
    if (!affected) {
      return res.status(404).json({ success: false, message: 'Contractor not found or no changes made' });
    }
    res.json({ success: true, message: 'Email updated' });
  } catch (err) {
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'Email already in use' });
    }
    console.error('Error updating contractor email:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Delete contractor
async function remove(req, res) {
  try {
    const affected = await Contractor.deleteContractor(req.params.id);
    if (!affected) {
      return res.status(404).json({ success: false, message: 'Contractor not found' });
    }
    res.json({ success: true, message: 'Contractor deleted' });
  } catch (err) {
    console.error('Error deleting contractor:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = {
  list,
  getAll,
  getById,
  create,
  update,
  updateEmail,
  remove
};