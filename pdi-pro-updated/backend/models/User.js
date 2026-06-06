import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const InspectionSchema = new mongoose.Schema({
  vehicleDetails: {
    clientName: String,
    vehicleMake: String,
    vehicleModel: String,
    yearOfManufacture: Number,
    exteriorColor: String,
    mileage: Number,
    vehicleIdentificationNumber: String,
    carNumberPlate: String
  },
  exteriorCondition: {
    paintCondition: { status: String, description: String },
    bodyworkCondition: { status: String, description: String },
    tireCondition: { status: String, description: String },
    lightsFunctionality: { status: String, description: String },
    frontBumper: { status: String, description: String },
    rearBumper: { status: String, description: String },
    trunkHatch: { status: String, description: String }
  },
  engineConditions: {
    engineHealth: { status: String, description: String },
    oilCondition: { status: String, description: String },
    coolantLevel: { status: String, description: String },
    batteryCondition: { status: String, description: String },
    beltsAndHoses: { status: String, description: String }
  },
  additionalChecks: {
    brakeSystem: { status: String, description: String },
    suspension: { status: String, description: String },
    steering: { status: String, description: String },
    transmission: { status: String, description: String },
    airConditioning: { status: String, description: String }
  },
  images: {
    frontPhoto: String,
    rhsSidePhoto: String,
    lhsSidePhoto: String,
    roofSidePhoto: String,
    additionalPhotos: [String]
  },
  status: {
    type: String,
    enum: ['Draft', 'Completed'],
    default: 'Draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  inspections: [InspectionSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', UserSchema);