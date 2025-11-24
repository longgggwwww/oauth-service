import { validate } from 'class-validator';
import { CreateClientRequest } from './create-client.request';

describe('CreateClientRequest', () => {
    it('should allow localhost in redirectUris', async () => {
        const request = new CreateClientRequest();
        request.name = 'Test Client';
        request.redirectUris = ['http://localhost:3000/callback'];

        const errors = await validate(request);
        expect(errors.length).toBe(0);
    });

    it('should allow localhost in websiteUrl', async () => {
        const request = new CreateClientRequest();
        request.name = 'Test Client';
        request.redirectUris = ['https://example.com'];
        request.websiteUrl = 'http://localhost:3000';

        const errors = await validate(request);
        expect(errors.length).toBe(0);
    });

    it('should allow localhost in logoUrl', async () => {
        const request = new CreateClientRequest();
        request.name = 'Test Client';
        request.redirectUris = ['https://example.com'];
        request.logoUrl = 'http://localhost:3000/logo.png';

        const errors = await validate(request);
        expect(errors.length).toBe(0);
    });

    it('should reject invalid URLs', async () => {
        const request = new CreateClientRequest();
        request.name = 'Test Client';
        request.redirectUris = ['http://invalid url'];

        const errors = await validate(request);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('redirectUris');
    });
});
