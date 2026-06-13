const Owner = require('./Owner');
const Pet = require('./Pet');
const Stylist = require('./Stylist');
const Appointment = require('./Appointment');
const User = require('./User');

// Asociaciones
Owner.hasMany(Pet, { foreignKey: 'owner_id', as: 'pets' });
Pet.belongsTo(Owner, { foreignKey: 'owner_id', as: 'owner' });

Pet.hasMany(Appointment, { foreignKey: 'pet_id', as: 'appointments' });
Appointment.belongsTo(Pet, { foreignKey: 'pet_id', as: 'pet' });

Stylist.hasMany(Appointment, { foreignKey: 'stylist_id', as: 'appointments' });
Appointment.belongsTo(Stylist, { foreignKey: 'stylist_id', as: 'stylist' });

module.exports = { Owner, Pet, Stylist, Appointment, User };
