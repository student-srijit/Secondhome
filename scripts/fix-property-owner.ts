/**
 * Script to diagnose and fix property owner reference issues
 * 
 * This script helps when:
 * - A property's owner ObjectId was manually changed in the database
 * - The WhatsApp button is not showing because owner data can't be populated
 * 
 * Usage:
 * 1. Find the property ID that has the issue
 * 2. Run: npx ts-node scripts/fix-property-owner.ts <propertyId>
 */

import mongoose from "mongoose"
import { Property } from "../models/property"
import { User } from "../models/user"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/secondhome"

async function fixPropertyOwner(propertyId: string) {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("✅ Connected to MongoDB")

    // Find the property
    const property = await Property.findById(propertyId)
    
    if (!property) {
      console.error(`❌ Property not found with ID: ${propertyId}`)
      return
    }

    console.log("\n📋 Property Details:")
    console.log(`   Title: ${property.title}`)
    console.log(`   Location: ${property.location}`)
    console.log(`   Owner ID: ${property.owner}`)

    // Try to populate the owner
    const populatedProperty = await Property.findById(propertyId).populate("owner", "name email phone")
    
    if (!populatedProperty?.owner) {
      console.error("\n❌ PROBLEM FOUND: Owner reference is invalid!")
      console.log(`   The owner ID ${property.owner} does not exist in the Users collection`)
      
      // Check if the owner ID exists as a user
      const ownerExists = await User.findById(property.owner)
      if (!ownerExists) {
        console.log("\n🔍 Checking for users in the database...")
        const users = await User.find({}, "name email phone").limit(10)
        
        if (users.length === 0) {
          console.log("   No users found in the database!")
        } else {
          console.log(`\n   Found ${users.length} users (showing first 10):`)
          users.forEach((user, index) => {
            console.log(`   ${index + 1}. ${user._id} - ${user.name} (${user.email}) - Phone: ${user.phone || 'N/A'}`)
          })
          
          console.log("\n💡 SOLUTION:")
          console.log("   You need to set the correct owner ID for this property.")
          console.log("   You can do this by:")
          console.log(`   1. In MongoDB Compass/Shell, update the property's owner field to a valid user ID`)
          console.log(`   2. Or create a new user if the owner doesn't exist yet`)
        }
      }
    } else {
      console.log("\n✅ Owner successfully populated:")
      console.log(`   Name: ${populatedProperty.owner.name}`)
      console.log(`   Email: ${populatedProperty.owner.email}`)
      console.log(`   Phone: ${populatedProperty.owner.phone}`)
      
      if (!populatedProperty.owner.phone) {
        console.log("\n⚠️  WARNING: Owner has no phone number!")
        console.log("   The WhatsApp button won't show without a phone number.")
        console.log(`   Please update user ${property.owner} to add a phone number.`)
      } else {
        console.log("\n✅ Everything looks good! The WhatsApp button should work.")
      }
    }

  } catch (error) {
    console.error("❌ Error:", error)
  } finally {
    await mongoose.connection.close()
    console.log("\n✅ Disconnected from MongoDB")
  }
}

// Get property ID from command line arguments
const propertyId = process.argv[2]

if (!propertyId) {
  console.error("❌ Please provide a property ID")
  console.log("Usage: npx ts-node scripts/fix-property-owner.ts <propertyId>")
  process.exit(1)
}

fixPropertyOwner(propertyId)
