require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function resetAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const db = mongoose.connection.db;
        const users = db.collection('users');

        const hashedPassword = await bcrypt.hash('Admin@1234', 12);

        const result = await users.updateOne(
            { email: 'admin@becomeskiller.com' },
            {
                $set: {
                    password: hashedPassword,
                    role: 'admin',
                    name: 'Super Admin',
                    status: 'active'
                }
            },
            { upsert: true }
        );

        console.log('Admin user updated:', result);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

resetAdmin();
