/**
 * Script to update property owner reference
 * 
 * Usage:
 * npx ts-node scripts/update-property-owner.ts <propertyId> <newOwnerId>
 */

import mongoose from "mongoose"
import { Property } from "../models/property"
import { User } from "../models/user"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/secondhome"

async function updatePropertyOwner(propertyId: string, newOwnerId: string) {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("✅ Connected to MongoDB")

    // Validate property exists
    const property = await Property.findById(propertyId)
    if (!property) {
      console.error(`❌ Property not found with ID: ${propertyId}`)
      return
    }

    // Validate new owner exists
    const newOwner = await User.findById(newOwnerId)
    if (!newOwner) {
      console.error(`❌ User not found with ID: ${newOwnerId}`)
      console.log("\n🔍 Listing available users...")
      const users = await User.find({}, "name email phone").limit(20)
      console.log(`\nFound ${users.length} users:`)
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user._id} - ${user.name} (${user.email}) - Phone: ${user.phone || 'N/A'}`)
      })
      return
    }

    // Check if new owner has phone number
    if (!newOwner.phone) {
      console.log(`⚠️  WARNING: User ${newOwner.name} (${newOwner.email}) has no phone number!`)
      console.log("   The WhatsApp button won't show without a phone number.")
      console.log("   Do you want to continue? (Ctrl+C to cancel)")
    }

    console.log("\n📋 Update Details:")
    console.log(`   Property: ${property.title}`)
    console.log(`   Old Owner ID: ${property.owner}`)
    console.log(`   New Owner ID: ${newOwnerId}`)
    console.log(`   New Owner: ${newOwner.name} (${newOwner.email})`)
    console.log(`   Phone: ${newOwner.phone || 'NOT SET'}`)

    // Update the property
    property.owner = newOwnerId as any
    await property.save()

    console.log("\n✅ Property owner updated successfully!")

    // Verify the update
    const updatedProperty = await Property.findById(propertyId).populate("owner", "name email phone")
    console.log("\n✅ Verification:")
    console.log(`   Owner: ${updatedProperty?.owner?.name}`)
    console.log(`   Email: ${updatedProperty?.owner?.email}`)
    console.log(`   Phone: ${updatedProperty?.owner?.phone}`)

  } catch (error) {
    console.error("❌ Error:", error)
  } finally {
    await mongoose.connection.close()
    console.log("\n✅ Disconnected from MongoDB")
  }
}

const propertyId = process.argv[2]
const newOwnerId = process.argv[3]

if (!propertyId || !newOwnerId) {
  console.error("❌ Please provide both property ID and new owner ID")
  console.log("Usage: npx ts-node scripts/update-property-owner.ts <propertyId> <newOwnerId>")
  process.exit(1)
}

updatePropertyOwner(propertyId, newOwnerId)
