import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const client = await prisma.clientApp.findFirst({
        where: {
            allowedGrantTypes: {
                has: 'CLIENT_CREDENTIALS',
            },
        },
    });

    if (client) {
        console.log('Client Found:');
        console.log(`ClientID: ${client.clientId}`);
        // Note: In a real scenario, we might not be able to retrieve the plain secret if it's hashed.
        // But for this environment, let's see what we have.
        // If it's hashed, we might need to create a new client with a known secret.
        console.log(`ClientSecret (Hash): ${client.clientSecret}`);
    } else {
        console.log('No client found with client_credentials grant type.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
