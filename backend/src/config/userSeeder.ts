import User from '../models/User';
import bcrypt from 'bcryptjs';

export const seedAdminUser = async () => {
    try {
        const adminEmail = 'admin@ahrn.net';
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            console.log('Seeding initial Admin user...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            const adminUser = new User({
                email: adminEmail,
                password: hashedPassword,
                role: 'ADMIN',
                name: 'System Administrator'
            });

            await adminUser.save();
            console.log('Admin user seeded: admin@ahrn.net / admin123');
        }
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
};
