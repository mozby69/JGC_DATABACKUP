import { prisma } from "../../src/lib/database/prisma";
import { createUserService } from "../../src/modules/auth/auth.service";

export async function factoryUser() {
  console.log("🏭 Creating factory user...");

  const adminRole = await prisma.role.findUnique({
    where: {
      name: "ADMIN",
    },
  });

  if (!adminRole) {
    throw new Error(
      "ADMIN role not found. Run role seeder first."
    );
  }

  const user = await createUserService({
    email: "financial@example.com",
    name: "Trial User",
    username: "admin1234",
    password: "12345678",
    // roleIds: [adminRole.id],
  });

  console.log(`✅ Factory user created: ${user.username}`);

  return user;
}