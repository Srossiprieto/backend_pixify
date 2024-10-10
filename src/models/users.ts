import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  phone: { type: String, required: true},
  password_hash: { type: String, required: true, select: false },
}, {
  timestamps: true 
});

const User = mongoose.model('User', userSchema);

export default User;