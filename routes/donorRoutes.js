const express = require('express');
const router = express.Router();
const Donor = require('../models/Donor');

// @route   POST /api/donors
router.post('/', async (req, res) => {
  try {
    const donor = new Donor(req.body);
    await donor.save();
    res.status(201).json({ success: true, data: donor });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// @route   GET /api/donors
router.get('/', async (req, res) => {
  try {
    const donors = await Donor.find();
    res.status(200).json({ success: true, count: donors.length, data: donors });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/donors/nearby
router.get('/nearby', async (req, res) => {
  try {
    const { lng, lat, radius = 10000, bloodGroup } = req.query;
    
    if (!lng || !lat) {
      return res.status(400).json({ success: false, error: 'Please provide longitude (lng) and latitude (lat)' });
    }

    let query = {
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(radius) 
        }
      },
      isAvailable: true
    };

    if (bloodGroup) {
      query.bloodGroup = bloodGroup;
    }

    const donors = await Donor.find(query);
    res.status(200).json({ success: true, count: donors.length, data: donors });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;