import { prisma } from "@/lib/prisma";
import { hashSync } from "bcryptjs";

export async function POST() {
  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@citycastingcorp.com" },
    });

    if (existingAdmin) {
      return Response.json({ message: "Database already seeded" });
    }

    await prisma.user.createMany({
      data: [
        {
          email: "admin@citycastingcorp.com",
          passwordHash: hashSync("admin123", 10),
          role: "EXECUTIVE",
          firstName: "Admin",
          lastName: "Executive",
          companyName: "City Casting Corp",
          department: "ADMIN",
          customerCode: "CC-ADMIN1",
          pin: "0000",
          overridePin: "9999",
        },
        {
          email: "manager@citycastingcorp.com",
          passwordHash: hashSync("manager123", 10),
          role: "ACCOUNT_MANAGER",
          firstName: "John",
          lastName: "Manager",
          companyName: "City Casting Corp",
          department: "ADMIN",
          customerCode: "CC-MGR001",
          pin: "1111",
          overridePin: "8888",
        },
        {
          email: "casting@citycastingcorp.com",
          passwordHash: hashSync("casting123", 10),
          role: "DEPARTMENT_EMPLOYEE",
          firstName: "Mike",
          lastName: "Caster",
          companyName: "City Casting Corp",
          department: "CASTING",
        },
        {
          email: "cad@citycastingcorp.com",
          passwordHash: hashSync("cad123", 10),
          role: "DEPARTMENT_EMPLOYEE",
          firstName: "Sarah",
          lastName: "Designer",
          companyName: "City Casting Corp",
          department: "CAD",
        },
        {
          email: "polish@citycastingcorp.com",
          passwordHash: hashSync("polish123", 10),
          role: "DEPARTMENT_EMPLOYEE",
          firstName: "Tom",
          lastName: "Polisher",
          companyName: "City Casting Corp",
          department: "POLISHING",
        },
        {
          email: "customer@example.com",
          passwordHash: hashSync("customer123", 10),
          role: "CUSTOMER",
          firstName: "Jane",
          lastName: "Smith",
          companyName: "Smith Jewelry Co.",
          phone: "555-0100",
          customerCode: "CC-JS0001",
          pin: "1234",
          paymentTerms: "NET30",
          creditLimit: 50000,
        },
        {
          email: "customer2@example.com",
          passwordHash: hashSync("customer123", 10),
          role: "CUSTOMER",
          firstName: "Bob",
          lastName: "Johnson",
          companyName: "Johnson Metals LLC",
          phone: "555-0200",
          customerCode: "CC-BJ0002",
          pin: "5678",
          paymentTerms: "NET15",
          creditLimit: 25000,
        },
      ],
    });

    await prisma.metalPrice.createMany({
      data: [
        { metalType: "GOLD", karat: "24K", pricePerOz: 2350, pricePerGram: 75.56 },
        { metalType: "GOLD", karat: "22K", pricePerOz: 2154, pricePerGram: 69.26 },
        { metalType: "GOLD", karat: "18K", pricePerOz: 1762, pricePerGram: 56.67 },
        { metalType: "GOLD", karat: "14K", pricePerOz: 1371, pricePerGram: 44.08 },
        { metalType: "GOLD", karat: "10K", pricePerOz: 979, pricePerGram: 31.49 },
        { metalType: "GOLD", karat: "5K", pricePerOz: 490, pricePerGram: 15.75 },
        { metalType: "SILVER", pricePerOz: 27.5, pricePerGram: 0.88 },
        { metalType: "PLATINUM", pricePerOz: 1050, pricePerGram: 33.77 },
        { metalType: "PALLADIUM", pricePerOz: 1100, pricePerGram: 35.37 },
      ],
    });

    const customer = await prisma.user.findUnique({
      where: { email: "customer@example.com" },
    });

    if (customer) {
      await prisma.mold.createMany({
        data: [
          {
            customerId: customer.id,
            styleNumber: "STY-001",
            styleName: "Classic Signet Ring",
            moldMaterial: "Silicone Mold",
            condition: "GOOD",
          },
          {
            customerId: customer.id,
            styleNumber: "STY-002",
            styleName: "Diamond Pendant",
            moldMaterial: "Rubber Mold",
            condition: "GOOD",
          },
          {
            customerId: customer.id,
            styleNumber: "STY-003",
            styleName: "Hoop Earrings",
            moldMaterial: "Blue Mold",
            condition: "FAIR",
          },
        ],
      });
    }

    return Response.json({
      message: "Database seeded successfully",
      accounts: {
        executive: {
          email: "admin@citycastingcorp.com",
          password: "admin123",
        },
        accountManager: {
          email: "manager@citycastingcorp.com",
          password: "manager123",
        },
        customer: {
          email: "customer@example.com",
          password: "customer123",
          customerCode: "CC-JS0001",
          pin: "1234",
        },
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
