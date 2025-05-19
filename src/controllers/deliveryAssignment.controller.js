const { Organization } = require('../models');
const DeliveryAssignment = require('../models/DeliveryAssignment');
const Donation = require('../models/Donation');
const Volunteer = require('../models/Volunteer');

exports.createAssignment = async (req, res) => {
  try {
    const { donation_id, volunteer_id, notes } = req.body;
    const donation = await Donation.findByPk(donation_id);
    if (donation.status !== 'pending') {
      return res.status(400).json({ error: 'A task cannot be assigned to a non-pending donation.' });
    }

    const newAssignment = await DeliveryAssignment.create({
      donation_id,
      volunteer_id,
      notes
    });

    res.status(201).json(newAssignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create task' });
  }
};


exports.getAssignmentsByVolunteer = async (req, res) => {
  try {
    const { volunteer_id } = req.params;

    if (!volunteer_id) {
      return res.status(400).json({ error: 'volunteer_id is required' });
    }

    const assignments = await DeliveryAssignment.findAll({
      where: { volunteer_id },
      include: [
        {
          model: Donation,
          include: [
            { model: Organization, as: 'associatedOrganization' }
          ]
        }
      ], 
    });

    if (assignments.length === 0) {
      return res.status(404).json({ message: 'No assignments found for this volunteer' });
    }

    res.json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
};


exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user_id = req.user.id;
    const volunteer = await Volunteer.findOne({ where: { user_id } });
    await DeliveryAssignment.update({ status }, { where: { id ,volunteer_id: volunteer.id } });

    res.json({ message: 'تم تحديث الحالة بنجاح' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'فشل تحديث الحالة' });
  }
};

exports.cancelAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;
    const organization = await Organization.findOne({ where: { user_id } });
    const donation = await Donation.findOne({ where: { organization_id: organization.id  } });
    
    await DeliveryAssignment.update({ status: 'cancelled' }, { where: { id ,donation_id: donation.id } });

    res.json({ message: 'تم إلغاء المهمة' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'فشل إلغاء المهمة' });
  }
};

