const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Blog = require('./models/blog'); // Adjust path as needed
const User = require('./models/user');
require('dotenv').config(); // Adjust path as needed

// Block Type Generators
const generateTitleBlock = () => ({

    type: 'title',
    content: faker.lorem.sentence()
});

const generateTextBlock = () => ({
    type: 'text',
    content: faker.lorem.paragraphs(2)
});

const generateImageBlock = () => ({
    type: 'image',
    content: faker.image.urlLoremFlickr({
        category: 'technology',
        width: 800,
        height: 600
    })
});

// Weighted Random Block Generator with Structured Approach
const generateStructuredBlocks = () => {
    const blocks = [];

    // First block is always a title
    blocks.push(generateTitleBlock());

    // Second block is always an image
    blocks.push(generateImageBlock());

    // Additional blocks
    const additionalBlockCount = faker.number.int({ min: 2, max: 5 });
    
    const blockTypes = [generateTextBlock, generateImageBlock];

    for (let i = 0; i < additionalBlockCount; i++) {
        const selectedBlockType = faker.helpers.arrayElement(blockTypes);
        blocks.push(selectedBlockType());
    }

    return blocks;
};

// Blog Seeder
const seedBlogs = async (count = 50) => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.DB_URL);

        // Find existing users
        const users = await User.find({});
        
        if (users.length === 0) {
            console.error('No users found. Create users first.');
            return;
        }

        // Generate Blogs with Structured Approach
        const blogsToCreate = Array.from({ length: count }, () => ({
            blocks: generateStructuredBlocks(),
            author: faker.helpers.arrayElement(users)._id,
            comments: [], // You can add comment generation logic
            createdAt: faker.date.past(),
            updatedAt: new Date()
        }));

        // Insert Blogs
        const createdBlogs = await Blog.insertMany(blogsToCreate);
        
        console.log(`Successfully seeded ${createdBlogs.length} blogs`);
        
        // Close connection
        await mongoose.connection.close();
    } catch (error) {
        console.error('Seeding Error:', error);
    }
};

// Validation Function to Ensure Correct Block Structure
const validateBlogStructure = (blogs) => {
    blogs.forEach(blog => {
        // Check if first block is title
        if (blog.blocks[0].type !== 'title') {
            throw new Error('First block must be a title');
        }

        // Check if second block is image
        if (blog.blocks[1].type !== 'image') {
            throw new Error('Second block must be an image');
        }

        // Optional: Additional validation
        console.log('Blog Structure Validation Passed');
    });
};

// Execution
const runSeeder = async () => {
    try {
        // Seed blogs
        await seedBlogs(50);

        // Optional: Fetch and validate created blogs
        const createdBlogs = await Blog.find().limit(10);
        validateBlogStructure(createdBlogs);
    } catch (error) {
        console.error('Seeder Execution Error:', error);
    }
};

// Logging Middleware
const loggerMiddleware = (fn) => async (...args) => {
    console.log(`🌱 Starting Seeder: ${fn.name}`);
    const start = Date.now();
    
    try {
        await fn(...args);
        console.log(`✅ Seeder Completed in ${Date.now() - start}ms`);
    } catch (error) {
        console.error(`❌ Seeder Failed: ${error.message}`);
    }
};

// Run Seeder with Logging
loggerMiddleware(runSeeder)();