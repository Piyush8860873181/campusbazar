// utils/constants.js - Categories, conditions, and metadata for CampusBazar

export const CATEGORIES = [
  'School Books',
  'College Books',
  'Notes',
  'Drawing Equipment',
  'School Uniform',
  'Laptops and Computers',
  'Scientific Calculators',
  'Competitive Exam Books',
  'Other',
];

export const CATEGORY_DETAILS = [
  {
    id: 'school-books',
    name: 'School Books',
    description: 'NCERT / CBSE class-wise textbooks (Class 6 - 12)',
    icon: 'BookOpen',
    subCategories: ['Class 6-8', 'Class 9', 'Class 10 CBSE', 'Class 11 Science', 'Class 11 Commerce/Arts', 'Class 12 Science', 'Class 12 Commerce/Arts'],
  },
  {
    id: 'college-books',
    name: 'College Books',
    description: 'Branch-wise & semester textbooks for B.Tech, BCA, B.Sc, B.Com',
    icon: 'GraduationCap',
    subCategories: ['1st Year Common', 'B.Tech CSE/IT', 'B.Tech ECE/EE', 'B.Tech Mechanical/Civil', 'BCA/MCA', 'B.Sc/M.Sc', 'Commerce/Management'],
  },
  {
    id: 'notes',
    name: 'Notes',
    description: 'Topper handwritten notes, exam cheatsheets & printed summaries',
    icon: 'FileText',
    subCategories: ['Handwritten Placement Notes', 'Semester Topper Notes', 'Class 12 Board Notes', 'Formula Cheatsheets', 'Lab Manuals'],
  },
  {
    id: 'drawing-equipment',
    name: 'Drawing Equipment',
    description: 'Mini drafters, sheet holders, engineering compass sets & instruments',
    icon: 'Compass',
    subCategories: ['Mini Drafter', 'Extendable Sheet Tube', 'Engineering Drawing Compass Box', 'T-Scale & Set Squares', 'Drawing Board'],
  },
  {
    id: 'school-uniform',
    name: 'School Uniform',
    description: 'Blazers, shirts, pants, skirts, ties & lab coats in good condition',
    icon: 'Shirt',
    subCategories: ['Winter Blazer', 'Uniform Shirts (Pack)', 'School Trousers/Skirts', 'Lab Apron/Coat', 'School Tie & Belt'],
  },
  {
    id: 'laptops-and-computers',
    name: 'Laptops and Computers',
    description: 'Refurbished coding laptops, keyboards, monitors & student accessories',
    icon: 'Laptop',
    subCategories: ['Coding Laptops', 'External Keyboards & Mice', 'Monitors & Displays', 'RAM & SSD Upgrades', 'Laptop Bags/Sleeves'],
  },
  {
    id: 'scientific-calculators',
    name: 'Scientific Calculators',
    description: 'Casio fx-991EX, 991ES, 82MS allowed in university semester exams',
    icon: 'Calculator',
    subCategories: ['Casio fx-991EX ClassWiz', 'Casio fx-991ES Plus', 'Casio fx-82MS', 'Graphic Calculators'],
  },
  {
    id: 'competitive-exam-books',
    name: 'Competitive Exam Books',
    description: 'Previous years solved papers for GATE, UPSC, JEE, NEET, SSC',
    icon: 'Award',
    subCategories: ['GATE CSE/ECE/ME', 'UPSC Civil Services', 'JEE Main & Advanced', 'NEET Medical', 'SSC CGL & Banking', 'CAT / MBA Entrance'],
  },
  {
    id: 'other',
    name: 'Other',
    description: 'Study tables, campus backpacks, cycle, hostel necessities',
    icon: 'Package',
    subCategories: ['Hostel Essentials', 'Bed Study Tables', 'Campus Backpacks', 'Campus Bicycle', 'Gym & Sports Gear'],
  },
];

export const CONDITIONS = ['Like New', 'Good', 'Fair'];

export const ROLES = [
  { value: 'college student', label: 'College Student (BTech / Degree)' },
  { value: 'school student', label: 'School Student' },
  { value: 'other', label: 'Other / Parent / Tutor' },
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'oldest', label: 'Oldest First' },
];
