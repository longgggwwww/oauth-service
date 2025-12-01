import { validate } from 'class-validator';
import { CreateClientRequest } from './create-client.request';

describe('CreateClientRequest', () => {
  it('should allow localhost in redirect_uris', async () => {
    const request = new CreateClientRequest();
    request.name = 'Test Client';
    request.redirect_uris = ['http://localhost:3000/callback'];

    const errors = await validate(request);
    expect(errors.length).toBe(0);
  });

  it('should allow localhost in website_url', async () => {
    const request = new CreateClientRequest();
    request.name = 'Test Client';
    request.redirect_uris = ['https://example.com'];
    request.website_url = 'http://localhost:3000';

    const errors = await validate(request);
    expect(errors.length).toBe(0);
  });

  it('should allow localhost in logo_url', async () => {
    const request = new CreateClientRequest();
    request.name = 'Test Client';
    request.redirect_uris = ['https://example.com'];
    request.logo_url = 'http://localhost:3000/logo.png';

    const errors = await validate(request);
    expect(errors.length).toBe(0);
  });

  it('should reject invalid URLs', async () => {
    const request = new CreateClientRequest();
    request.name = 'Test Client';
    request.redirect_uris = ['http://invalid url'];

    const errors = await validate(request);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('redirect_uris');
  });
});
