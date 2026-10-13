import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import { storage } from './services/storage';

async function seed() {
  console.log('--- Initializing GIFTORA Luxury Database Seed ---');

  const adminEmail = process.env.INITIAL_ADMIN_EMAIL || 'admin@giftora.lk';
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'GiftoraAdmin2027!';

  const existingAdmin = storage.getUserByEmail(adminEmail);
  if (!existingAdmin) {
    const passwordHash = bcrypt.hashSync(adminPassword, 10);
    storage.createUser({
      email: adminEmail,
      passwordHash,
      name: 'GIFTORA Principal Administrator',
      role: 'admin',
      phone: '+94 11 234 5678',
      address: 'Horton Place, Colombo 07',
      status: 'active',
    });
    console.log(`✓ Created initial administrator: ${adminEmail}`);
  } else {
    console.log(`✓ Administrator account ${adminEmail} already present.`);
  }

  console.log(`✓ Loaded ${storage.getProducts().length} curated handcrafted products.`);
  console.log(`✓ Loaded ${storage.getCategories().length} departments & collections.`);
  console.log(`✓ Loaded ${storage.getCoupons().length} active promotion codes (FIRSTJOY, CEYLONLUX).`);
  console.log('--- Seeding completed successfully. ---');
}

seed().catch(console.error);
