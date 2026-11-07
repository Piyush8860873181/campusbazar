// seed.js - Database seeder script to populate demo users, realistic listings and inquiries
require('dotenv').config();
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Listing = require('./models/Listing');
const Inquiry = require('./models/Inquiry');
const connectDB = require('./config/db');

/**
 * Seeds initial demo data for CampusBazar
 * @param {boolean} force - If true, clears existing data before seeding
 */
const seedData = async (force = false) => {
  try {
    const existingListings = await Listing.countDocuments();
    if (!force && existingListings > 0) {
      console.log(`📦 Database already has ${existingListings} listings. Skipping auto-seed.`);
      return;
    }

    console.log('🌱 Starting database seeding for CampusBazar...');

    if (force) {
      await User.deleteMany({});
      await Listing.deleteMany({});
      await Inquiry.deleteMany({});
      console.log('🧹 Cleaned existing database records');
    }

    // 1. Create demo users (Seller, Buyer, School Student)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Upsert or create users
    let rahul = await User.findOne({ email: 'rahul@campusbazar.com' });
    if (!rahul) {
      rahul = await User.create({
        name: 'Rahul Sharma (Seller)',
        email: 'rahul@campusbazar.com',
        password: hashedPassword,
        phone: '9876543210',
        city: 'IIT Delhi Campus',
        role: 'college student',
        wishlist: [],
      });
    }

    let priya = await User.findOne({ email: 'priya@campusbazar.com' });
    if (!priya) {
      priya = await User.create({
        name: 'Priya Patel (Buyer)',
        email: 'priya@campusbazar.com',
        password: hashedPassword,
        phone: '9812345678',
        city: 'DTU Delhi',
        role: 'college student',
        wishlist: [],
      });
    }

    let aman = await User.findOne({ email: 'aman@campusbazar.com' });
    if (!aman) {
      aman = await User.create({
        name: 'Aman Verma (School Student)',
        email: 'aman@campusbazar.com',
        password: hashedPassword,
        phone: '9899887766',
        city: 'DPS RK Puram, New Delhi',
        role: 'school student',
        wishlist: [],
      });
    }

    const rahulId = rahul._id;
    const priyaId = priya._id;
    const amanId = aman._id;

    // 2. 21 realistic listings across all 9 categories with high quality, reliable image URLs
    const listingsData = [
      // 1. School Books
      {
        title: 'NCERT Class 10 Complete Textbooks (Maths, Science, SST, English)',
        description: 'Complete set of original NCERT Class 10 textbooks for CBSE board preparation. Clean pages with minimal pencil underlines. Excellent condition for the new 2026-27 session.',
        category: 'School Books',
        subCategory: 'Class 10 CBSE',
        condition: 'Good',
        price: 450,
        negotiable: true,
        images: [
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'
        ],
        city: 'New Delhi',
        seller: amanId,
        isSold: false
      },
      {
        title: 'Class 12 Physics SL Arora Vol 1 & 2 + Pradeep Chemistry',
        description: 'Comprehensive CBSE reference guides. Theory and solved numericals for CBSE boards and foundational JEE preparation. Hardcover intact, no missing pages.',
        category: 'School Books',
        subCategory: 'Class 12 Science',
        condition: 'Like New',
        price: 850,
        negotiable: true,
        images: [
          'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=800&q=80'
        ],
        city: 'New Delhi',
        seller: rahulId,
        isSold: false
      },

      // 2. College Books
      {
        title: 'Introduction to Algorithms by Cormen (CLRS 3rd Edition)',
        description: 'The definitive DSA book for B.Tech Computer Science & IT students. Essential for 3rd sem algorithm design, university semester exams, and coding interview prep.',
        category: 'College Books',
        subCategory: 'B.Tech CSE - 3rd Sem',
        condition: 'Like New',
        price: 650,
        negotiable: false,
        images: [
          'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
        ],
        city: 'IIT Delhi Campus',
        seller: rahulId,
        isSold: false
      },
      {
        title: 'Higher Engineering Mathematics by B.S. Grewal (44th Edition)',
        description: 'Mandatory standard textbook for 1st & 2nd year engineering across all branches (Calculus, Differential Equations, Linear Algebra, Transform Calculus).',
        category: 'College Books',
        subCategory: '1st & 2nd Year Common',
        condition: 'Good',
        price: 420,
        negotiable: true,
        images: [
          'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80'
        ],
        city: 'DTU Delhi',
        seller: priyaId,
        isSold: false
      },
      {
        title: 'Operating System Concepts by Silberschatz & Galvin',
        description: 'Popular dinosaur book for OS. Required for 4th semester CSE / IT. Complete coverage of processes, threads, virtual memory, and deadlocks.',
        category: 'College Books',
        subCategory: 'B.Tech CSE / IT',
        condition: 'Good',
        price: 520,
        negotiable: true,
        images: [
          'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80'
        ],
        city: 'IIT Delhi Campus',
        seller: rahulId,
        isSold: false
      },

      // 3. Notes
      {
        title: 'Handwritten DSA & System Design Placement Spiral Notes',
        description: 'Topper copy with neat color-coded handwritten notes covering LeetCode top 150 patterns, DP tricks, Graphs, and Low-Level Design diagrams. Helped author crack an SDE-1 internship.',
        category: 'Notes',
        subCategory: 'CSE Placement Notes',
        condition: 'Like New',
        price: 260,
        negotiable: false,
        images: [
          'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80'
        ],
        city: 'DTU Delhi',
        seller: priyaId,
        isSold: false
      },
      {
        title: 'Complete Class 12 Organic Chemistry Mechanisms Spiral',
        description: 'Includes all name reactions, reagent summary charts, conversion flowcharts, and CBSE previous 10-year question answers. 120 pages clean spiral binding.',
        category: 'Notes',
        subCategory: 'CBSE 12 / NEET / JEE',
        condition: 'Like New',
        price: 190,
        negotiable: true,
        images: [
          'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80'
        ],
        city: 'New Delhi',
        seller: amanId,
        isSold: false
      },
      {
        title: 'Digital Electronics & Microprocessor 8086 Class Notes',
        description: 'Printed and highlighted lecture slides + solved pin & timing diagrams for ECE / EE 4th semester university exam preparation.',
        category: 'Notes',
        subCategory: 'ECE / EE 4th Sem',
        condition: 'Good',
        price: 150,
        negotiable: false,
        images: [
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80'
        ],
        city: 'DTU Delhi',
        seller: priyaId,
        isSold: false
      },

      // 4. Drawing Equipment
      {
        title: 'Engineering Mini Drafter (Omega brand) + Extendable Sheet Tube',
        description: 'Complete engineering graphics lab package for 1st-year students. Smooth metal scale arms with zero tilt error. Includes black waterproof sheet cylinder with shoulder strap.',
        category: 'Drawing Equipment',
        subCategory: '1st Year Engineering Drawing',
        condition: 'Good',
        price: 390,
        negotiable: true,
        images: [
          'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80'
        ],
        city: 'IIT Delhi Campus',
        seller: rahulId,
        isSold: false
      },
      {
        title: 'Technical Drawing Instrument Box (Steel Compass, Dividers, Bow)',
        description: 'German precision steel compass set for Civil & Mechanical engineering graphics. Only used for 1 semester. Includes spare lead refills.',
        category: 'Drawing Equipment',
        subCategory: 'Civil / Mechanical Graphics',
        condition: 'Like New',
        price: 480,
        negotiable: true,
        images: [
          'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80'
        ],
        city: 'DTU Delhi',
        seller: priyaId,
        isSold: false
      },

      // 5. School Uniform
      {
        title: 'DPS Navy Blue School Winter Blazer (Size 38) with Crest',
        description: 'Authentic school winter uniform blazer with stitched school crest and brass buttons. Dry cleaned, no stains, tears, or defects. Includes winter tie.',
        category: 'School Uniform',
        subCategory: 'Boys Class 9-11',
        condition: 'Like New',
        price: 780,
        negotiable: true,
        images: [
          'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
        ],
        city: 'New Delhi',
        seller: amanId,
        isSold: false
      },
      {
        title: 'White High School Cotton Uniform Shirts (Pack of 3, Size 36)',
        description: 'Set of 3 washed and ironed white school uniform shirts. Quality breathable cotton blend. Ready for immediate use.',
        category: 'School Uniform',
        subCategory: 'Unisex High School',
        condition: 'Good',
        price: 340,
        negotiable: false,
        images: [
          'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'
        ],
        city: 'New Delhi',
        seller: amanId,
        isSold: true
      },

      // 6. Laptops and Computers
      {
        title: 'Lenovo ThinkPad T480 (Core i5 8th Gen, 16GB RAM, 512GB NVMe SSD)',
        description: 'Legendary keyboard for coding and engineering software. Dual batteries with 5-6 hours battery backup. Backlit keyboard, full HD matte display. Charger included.',
        category: 'Laptops and Computers',
        subCategory: 'Coding / Engineering Laptop',
        condition: 'Good',
        price: 18500,
        negotiable: true,
        images: [
          'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'
        ],
        city: 'IIT Delhi Campus',
        seller: rahulId,
        isSold: false
      },
      {
        title: 'Logitech K380 Bluetooth Multi-Device Keyboard + Pebble Mouse',
        description: 'Quiet, compact Bluetooth keyboard and silent optical mouse set. Can connect to laptop and tablet simultaneously. Ideal for college library study sessions.',
        category: 'Laptops and Computers',
        subCategory: 'Computer Accessories',
        condition: 'Like New',
        price: 1950,
        negotiable: false,
        images: [
          'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
        ],
        city: 'DTU Delhi',
        seller: priyaId,
        isSold: false
      },
      {
        title: 'Dell 24-inch Full HD IPS Monitor (75Hz, HDMI & VGA Ports)',
        description: 'Secondary monitor used in hostel room for dual-screen programming and watching video lectures. Crisp display, no dead pixels. Includes HDMI cable.',
        category: 'Laptops and Computers',
        subCategory: 'Peripherals / Display',
        condition: 'Like New',
        price: 5400,
        negotiable: true,
        images: [
          'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80'
        ],
        city: 'IIT Delhi Campus',
        seller: rahulId,
        isSold: false
      },

      // 7. Scientific Calculators
      {
        title: 'Casio fx-991EX ClassWiz Scientific Calculator (552 Functions)',
        description: 'The premier scientific calculator permitted in Indian university semester exams. High-resolution natural textbook display, spreadsheet, matrix calculation & equation solver.',
        category: 'Scientific Calculators',
        subCategory: 'B.Tech / Polytech Exams',
        condition: 'Like New',
        price: 890,
        negotiable: false,
        images: [
          'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80'
        ],
        city: 'DTU Delhi',
        seller: priyaId,
        isSold: false
      },
      {
        title: 'Casio fx-82MS Scientific Calculator (240 Functions)',
        description: 'Authentic 2-line display scientific calculator for Class 11-12 physics, chemistry, and diploma engineering. Includes slide-on protective hard case.',
        category: 'Scientific Calculators',
        subCategory: 'School & Diploma',
        condition: 'Good',
        price: 380,
        negotiable: true,
        images: [
          'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80'
        ],
        city: 'New Delhi',
        seller: amanId,
        isSold: false
      },

      // 8. Competitive Exam Books
      {
        title: 'Made Easy GATE CSE Previous 30 Years Chapterwise Solved Papers',
        description: 'Complete 2-volume set covering all core GATE Computer Science subjects with in-depth step-by-step solutions. Clean pages with minimal pencil notes.',
        category: 'Competitive Exam Books',
        subCategory: 'GATE CSE / IT',
        condition: 'Like New',
        price: 590,
        negotiable: true,
        images: [
          'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80'
        ],
        city: 'IIT Delhi Campus',
        seller: rahulId,
        isSold: false
      },
      {
        title: 'Indian Polity by M. Laxmikanth (6th Revised Edition)',
        description: 'The standard text for UPSC Civil Services and State PCS exams. Important constitutional articles highlighted in yellow. Binding is firm and pages intact.',
        category: 'Competitive Exam Books',
        subCategory: 'UPSC CSE / State PSC',
        condition: 'Good',
        price: 490,
        negotiable: false,
        images: [
          'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80'
        ],
        city: 'New Delhi',
        seller: priyaId,
        isSold: false
      },

      // 9. Other
      {
        title: 'Adjustable Foldable Wooden Bed Study Table with Cup & Tablet Slot',
        description: 'Portable wooden bed desk with rounded safety corners, cup holder, and tablet stand slot. Foldable powder-coated metal legs with anti-slip rubber feet.',
        category: 'Other',
        subCategory: 'Hostel Essentials',
        condition: 'Like New',
        price: 460,
        negotiable: true,
        images: [
          'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80'
        ],
        city: 'IIT Delhi Campus',
        seller: rahulId,
        isSold: false
      },
      {
        title: 'Wildcraft Campus Backpack 35L (3 Compartments + Rain Cover)',
        description: 'Durable collegiate backpack with dedicated padded laptop compartment and bottom zippered rain cover. Sturdy padded shoulder straps.',
        category: 'Other',
        subCategory: 'Campus Bags',
        condition: 'Good',
        price: 790,
        negotiable: true,
        images: [
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
        ],
        city: 'DTU Delhi',
        seller: priyaId,
        isSold: false
      }
    ];

    const createdListings = await Listing.insertMany(listingsData);
    console.log(`📦 Seeded ${createdListings.length} realistic listings across 9 categories!`);

    // Wishlist for Rahul & Priya
    await User.findByIdAndUpdate(rahulId, { wishlist: [createdListings[2]._id, createdListings[15]._id] });
    await User.findByIdAndUpdate(priyaId, { wishlist: [createdListings[0]._id, createdListings[12]._id] });

    // Seed inquiries
    await Inquiry.create([
      {
        listing: createdListings[2]._id, // CLRS Algorithm
        fromUser: priyaId,
        toUser: rahulId,
        message: 'Hi Rahul! Is the CLRS Algorithms book still available? Can we meet at the Central Library tomorrow around 4 PM to inspect it?'
      },
      {
        listing: createdListings[15]._id, // Casio fx-991EX
        fromUser: rahulId,
        toUser: priyaId,
        message: 'Hey Priya! Does the Casio 991EX come with its hard cover slide case? Ready to buy at ₹890.'
      }
    ]);
    console.log(`💬 Seeded demo inquiries in the Inbox`);

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed with error:', error);
  }
};

// If run directly via command line
if (require.main === module) {
  (async () => {
    await connectDB();
    await seedData(true);
    process.exit(0);
  })();
}

module.exports = seedData;
