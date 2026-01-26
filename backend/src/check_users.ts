
import 'dotenv/config';
import connectDB from './config/db';
import User from './models/User';

const run = async () => {
    await connectDB();
    console.log('Checking for Pending Users...');
    const users = await User.find({ verificationStatus: 'PENDING' });
    console.log(`Found ${users.length} pending users.`);
    console.log(JSON.stringify(users, null, 2));

    // Also check for users with accountType: B2B to see if any are verified or rejected vs pending
    const b2b = await User.find({ accountType: 'B2B' });
    console.log(`Found ${b2b.length} B2B users.`);
    console.log(JSON.stringify(b2b, null, 2));

    process.exit();
};

run();
