/**
 * Script to list all properties and check their owner references
 * 
 * Usage:
 * npx ts-node scripts/list-properties-owners.ts
 */

import mongoose from "mongoose"
import { Property } from "../models/property"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/secondhome"

async function listPropertiesWithOwners() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("✅ Connected to MongoDB\n")

    const properties = await Property.find({})
      .populate("owner", "name email phone")
      .select("title location owner")
      .sort({ createdAt: -1 })

    console.log(`Found ${properties.length} properties:\n`)
    console.log("=" .repeat(100))

    let issueCount = 0

    for (let i = 0; i < properties.length; i++) {
      const property = properties[i]
      const hasIssue = !property.owner || !property.owner.phone

      if (hasIssue) issueCount++

      console.log(`\n${i + 1}. ${hasIssue ? '❌' : '✅'} ${property.title}`)
      console.log(`   Property ID: ${property._id}`)
      console.log(`   Location: ${property.location}`)
      
      if (!property.owner) {
        console.log(`   Owner: ❌ INVALID REFERENCE (owner ID doesn't exist in users collection)`)
      } else {
        console.log(`   Owner: ${property.owner.name} (${property.owner.email})`)
        console.log(`   Owner ID: ${(property.owner as any)._id}`)
        console.log(`   Phone: ${property.owner.phone || '❌ NOT SET (WhatsApp button won\'t work)'}`)
      }
      console.log("-".repeat(100))
    }

    if (issueCount > 0) {
      console.log(`\n⚠️  Found ${issueCount} properties with owner issues!`)
      console.log("\nTo fix a property, run:")
      console.log("  npx ts-node scripts/fix-property-owner.ts <propertyId>")
      console.log("\nOr to update owner directly:")
      console.log("  npx ts-node scripts/update-property-owner.ts <propertyId> <newOwnerId>")
    } else {
      console.log("\n✅ All properties have valid owners with phone numbers!")
    }

  } catch (error) {
    console.error("❌ Error:", error)
  } finally {
    await mongoose.connection.close()
    console.log("\n✅ Disconnected from MongoDB")
  }
}

listPropertiesWithOwners()
