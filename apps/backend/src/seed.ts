
import mongoose from 'mongoose';
import { UserSchema } from './modules/users/user.schema';

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/ahrn');
  const User = mongoose.model('User', UserSchema);
  await User.create({ email: 'admin@ahrn.io', role: 'SUPER_ADMIN' });
  process.exit(0);
}
seed();
