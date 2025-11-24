import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService) {
        // Configure SMTP transporter
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('SMTP_HOST', 'smtp.gmail.com'),
            port: this.configService.get('SMTP_PORT', 587),
            secure: this.configService.get('SMTP_SECURE', 'false') === 'true',
            auth: {
                user: this.configService.get('SMTP_USER'),
                pass: this.configService.get('SMTP_PASSWORD'),
            },
        });
    }

    async sendVerificationEmail(email: string, token: string, username?: string): Promise<void> {
        const backendUrl = this.configService.get('BACKEND_URL', 'http://localhost:3000');
        const verificationUrl = `${backendUrl}/v1/auth/verify-email?token=${token}`;

        const emailFrom = this.configService.get('EMAIL_FROM', 'noreply@oauth-service.com');

        const mailOptions = {
            from: emailFrom,
            to: email,
            subject: 'Verify Your Email Address',
            html: this.getVerificationEmailTemplate(verificationUrl, username),
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Verification email sent to ${email}`);
        } catch (error) {
            console.error('Error sending verification email:', error);
            throw new Error('Failed to send verification email');
        }
    }

    private getVerificationEmailTemplate(verificationUrl: string, username?: string): string {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background-color: #f9f9f9;
            border-radius: 8px;
            padding: 30px;
            border: 1px solid #ddd;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #4a5568;
            margin: 0;
        }
        .content {
            background-color: white;
            padding: 25px;
            border-radius: 6px;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #4299e1;
            color: white !important;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
        }
        .button:hover {
            background-color: #3182ce;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #718096;
        }
        .code {
            background-color: #f7fafc;
            padding: 10px;
            border-radius: 4px;
            font-family: monospace;
            word-break: break-all;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Email Verification</h1>
        </div>
        <div class="content">
            <p>Hello ${username || 'there'},</p>
            <p>Thank you for registering! Please verify your email address to complete your registration.</p>
            <p style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <div class="code">${verificationUrl}</div>
            <p><strong>Note:</strong> This link will expire in 24 hours.</p>
            <p>If you didn't create an account, you can safely ignore this email.</p>
        </div>
        <div class="footer">
            <p>This is an automated message, please do not reply.</p>
            <p>© 2024 OAuth Service. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
        `;
    }
}
