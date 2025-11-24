import { PrismaClient, ClientRole, GrantType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Start seeding ...');

    // 1. Create Scopes
    const scopes = [
        { name: 'openid', description: 'OpenID Connect scope' },
        { name: 'profile', description: 'Access to user profile' },
        { name: 'email', description: 'Access to user email' },
        { name: 'user:read', description: 'Read user data' },
        { name: 'user:write', description: 'Modify user data' },
        { name: 'system:admin', description: 'System administration' },
    ];

    for (const scope of scopes) {
        await prisma.scope.upsert({
            where: { name: scope.name },
            update: {},
            create: scope,
        });
    }
    console.log('Scopes seeded.');

    // 2. Create Users and their Clients
    const passwordHash = await bcrypt.hash('password123', 10);

    for (let i = 1; i <= 5; i++) {
        const email = `user${i}@example.com`;

        // Create User
        const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                password: {
                    create: {
                        passwordHash,
                    },
                },
                profile: {
                    create: {
                        fullName: `User ${i}`,
                    },
                },
            },
        });

        console.log(`Created user: ${user.email}`);

        // Create Client for this User
        const clientId = `client-user-${i}`;
        const clientSecret = `secret-user-${i}`;
        const clientSecretHash = await bcrypt.hash(clientSecret, 10);

        await prisma.clientApp.upsert({
            where: { clientId },
            update: {},
            create: {
                clientId,
                clientSecret: clientSecretHash,
                appName: `App for User ${i}`,
                role: ClientRole.THIRD_PARTY_APP,
                authorities: ['user:read'],
                redirectUris: ['http://localhost:3000/callback'],
                allowedGrantTypes: [GrantType.AUTHORIZATION_CODE, GrantType.REFRESH_TOKEN],
                // createdViaClientId: null, // Removed as it does not exist on ClientApp
                // Link to the user who "owns" or created this client (if the schema supported an 'ownerId', but here we have 'createdUsers' relation on ClientApp which is reverse. 
                // The schema has `createdViaClient` on User, but not `owner` on ClientApp directly pointing to User except via implicit logic or other tables.
                // Wait, the requirement says "5 clients created by user". 
                // The schema `ClientApp` doesn't seem to have an `ownerId` field directly visible in the model snippet I saw earlier?
                // Let's re-read schema.
                // `ClientApp` has `createdUsers User[]`.
                // `User` has `createdViaClient ClientApp?`.
                // It seems there isn't a direct "User owns Client" relationship in the provided schema snippet, 
                // OR I missed it. 
                // Let's look at the schema again.
                // `model ClientApp` ... no `userId` field.
                // However, usually "client created by user" implies the user is the owner.
                // If the schema doesn't support it, I might just create them as standalone clients but logically "for" the user.
                // OR, maybe I should check if there's a relation I missed.
                // Checking schema again...
                // `model ClientApp` lines 75-108. No `userId`.
                // `model User` lines 31-60. `createdViaClientId`.

                // Use case: "5 clients created by user". 
                // If the schema doesn't link Client -> User (owner), then I can't enforce it in DB.
                // But I will create them with names indicating they belong to users.
                // Wait, maybe the user wants me to ADD that relationship? 
                // "hãy seed data cho hệ thống với 5 users và 7 clients (5 clients được tạo bởi user và 2 client không có thông tin user)"
                // "5 clients created by user" -> implies an action or ownership.
                // If the current schema doesn't support "Client owned by User", I should probably proceed with just creating them 
                // and maybe mentioning it, OR just seed them as "User 1's App".
                // Given I am in execution and the plan was approved, I will proceed with creating them.
                // I will just name them appropriately.
            },
        });
        console.log(`Created client: ${clientId}`);
    }

    // 3. Create M2M Clients (No User)
    for (let i = 1; i <= 2; i++) {
        const clientId = `client-m2m-${i}`;
        const clientSecret = `secret-m2m-${i}`;
        const clientSecretHash = await bcrypt.hash(clientSecret, 10);

        await prisma.clientApp.upsert({
            where: { clientId },
            update: {},
            create: {
                clientId,
                clientSecret: clientSecretHash,
                appName: `M2M Service ${i}`,
                role: ClientRole.SERVICE_ACCOUNT,
                authorities: ['system:admin'],
                allowedGrantTypes: [GrantType.CLIENT_CREDENTIALS],
            },
        });
        console.log(`Created M2M client: ${clientId}`);
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
