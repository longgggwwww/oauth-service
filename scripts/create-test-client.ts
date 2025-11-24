import { PrismaClient, GrantType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const clientId = 'test-client';
    const clientSecret = 'test-secret';
    const hashedPassword = await bcrypt.hash(clientSecret, 10);

    const existing = await prisma.clientApp.findUnique({
        where: { clientId },
    });

    if (existing) {
        console.log('Test client already exists. Updating secret...');
        await prisma.clientApp.update({
            where: { id: existing.id },
            data: {
                clientSecret: hashedPassword,
                allowedGrantTypes: [GrantType.CLIENT_CREDENTIALS],
            },
        });
    } else {
        console.log('Creating test client...');
        await prisma.clientApp.create({
            data: {
                clientId,
                clientSecret: hashedPassword,
                appName: 'Test Client',
                allowedGrantTypes: [GrantType.CLIENT_CREDENTIALS],
                authorities: ['user:create'],
            },
        });
    }

    console.log('Test Client Ready:');
    console.log(`ClientID: ${clientId}`);
    console.log(`ClientSecret: ${clientSecret}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
