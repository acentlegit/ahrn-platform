import sgMail from '@sendgrid/mail';

/**
 * Email Service using SendGrid
 * Handles all email sending functionality for the application
 */
class EmailService {
    private initialized: boolean = false;

    constructor() {
        // Lazy initialization - don't read env vars here
    }

    private ensureInitialized(): boolean {
        if (this.initialized) return true;
        this.initialize();
        return this.initialized;
    }

    /**
     * Initialize SendGrid with API key from environment
     */
    private initialize(): void {
        const apiKey = process.env.SENDGRID_API_KEY;

        if (!apiKey) {
            console.warn('⚠️  SENDGRID_API_KEY not found in environment variables. Email sending will be disabled.');
            return;
        }

        sgMail.setApiKey(apiKey);
        this.initialized = true;
        console.log('✅ SendGrid Email Service initialized successfully');
    }

    /**
     * Send welcome email to newly registered users
     * @param email - Recipient email address
     * @param name - User's name
     */
    async sendWelcomeEmail(email: string, name: string): Promise<void> {
        console.log(`📧 [EmailService] Attempting to send welcome email to: ${email}`);

        if (!this.ensureInitialized()) {
            console.warn(`⚠️  Email service not initialized. Skipping welcome email to ${email}`);
            return;
        }

        const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@acentle.com';
        const fromName = process.env.SENDGRID_FROM_NAME || 'AHRN Platform';

        console.log(`📧 [EmailService] Email configuration:`, {
            to: email,
            from: `${fromName} <${fromEmail}>`,
            subject: 'Welcome to AHRN Platform! 🎉'
        });

        const msg = {
            to: email,
            from: {
                email: fromEmail,
                name: fromName
            },
            subject: 'Welcome to AHRN Platform! 🎉',
            text: this.getWelcomeEmailText(name),
            html: this.getWelcomeEmailHtml(name),
        };

        try {
            console.log(`📧 [EmailService] Sending email via SendGrid...`);
            const response = await sgMail.send(msg);
            console.log(`✅ [EmailService] Welcome email sent successfully to ${email}`);
            console.log(`📧 [EmailService] SendGrid response status: ${response[0]?.statusCode || 'unknown'}`);
        } catch (error: any) {
            console.error(`❌ [EmailService] Failed to send welcome email to ${email}`);
            console.error(`❌ [EmailService] Error details:`, error.response?.body || error.message);
            if (error.code) {
                console.error(`❌ [EmailService] Error code: ${error.code}`);
            }
            // Don't throw - we don't want email failures to block user registration
        }
    }

    async sendPendingVerificationEmail(email: string, name: string): Promise<void> {
        if (!this.ensureInitialized()) return;

        const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@acentle.com';
        const fromName = process.env.SENDGRID_FROM_NAME || 'AHRN Platform';

        const msg = {
            to: email,
            from: { email: fromEmail, name: fromName },
            subject: 'Account Pending Verification - AHRN Platform',
            text: `Hello ${name},\n\nThank you for registering. Your B2B account is currently pending admin verification. You will be notified once approved.\n\nBest,\nThe AHRN Team`,
            html: `<p>Hello <strong>${name}</strong>,</p><p>Thank you for registering. Your B2B account is currently <strong>pending admin verification</strong>.</p><p>You will be notified via email once your account has been approved.</p><p>Best regards,<br>The AHRN Team</p>`
        };

        try {
            await sgMail.send(msg);
            console.log(`✅ Pending verification email sent to ${email}`);
        } catch (error: any) {
            console.error(`❌ Failed to send pending verification email to ${email}:`, error.message);
        }
    }

    async sendApprovalEmail(email: string, name: string): Promise<void> {
        if (!this.ensureInitialized()) return;

        const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@acentle.com';
        const fromName = process.env.SENDGRID_FROM_NAME || 'AHRN Platform';

        const msg = {
            to: email,
            from: { email: fromEmail, name: fromName },
            subject: 'Account Approved! - AHRN Platform',
            text: `Hello ${name},\n\nCongratulations! Your account has been approved. You can now log in to the platform.\n\nBest,\nThe AHRN Team`,
            html: `<p>Hello <strong>${name}</strong>,</p><p>Congratulations! Your account has been <strong>approved</strong>.</p><p>You can now log in to access the AHRN Platform.</p><p>Best regards,<br>The AHRN Team</p>`
        };

        try {
            await sgMail.send(msg);
            console.log(`✅ Approval email sent to ${email}`);
        } catch (error: any) {
            console.error(`❌ Failed to send approval email to ${email}:`, error.message);
        }
    }

    async sendRejectionEmail(email: string, name: string, reason?: string): Promise<void> {
        if (!this.ensureInitialized()) return;

        const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@acentle.com';
        const fromName = process.env.SENDGRID_FROM_NAME || 'AHRN Platform';

        const msg = {
            to: email,
            from: { email: fromEmail, name: fromName },
            subject: 'Account Verification Update - AHRN Platform',
            text: `Hello ${name},\n\nYour account application has been reviewed. Unfortunately, we cannot approve your account at this time.\n${reason ? `Reason: ${reason}\n` : ''}\nIf you believe this is an error, please contact support.\n\nBest,\nThe AHRN Team`,
            html: `<p>Hello <strong>${name}</strong>,</p><p>Your account application has been reviewed. Unfortunately, we cannot approve your account at this time.</p>${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}<p>If you believe this is an error, please contact support.</p><p>Best regards,<br>The AHRN Team</p>`
        };

        try {
            await sgMail.send(msg);
            console.log(`✅ Rejection email sent to ${email}`);
        } catch (error: any) {
            console.error(`❌ Failed to send rejection email to ${email}:`, error.message);
        }
    }

    async sendAdminNotificationEmail(adminEmail: string, userDetails: { userName: string, userEmail: string, companyName: string, role: string }): Promise<void> {
        if (!this.ensureInitialized()) return;

        const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@acentle.com';
        const fromName = process.env.SENDGRID_FROM_NAME || 'AHRN Platform';

        const msg = {
            to: adminEmail,
            from: { email: fromEmail, name: fromName },
            subject: 'New B2B Signup Pending Approval',
            text: `Admin,\n\nA new B2B user has signed up and is pending approval.\n\nName: ${userDetails.userName}\nEmail: ${userDetails.userEmail}\nCompany: ${userDetails.companyName}\nRole: ${userDetails.role}\n\nPlease examine the dashboard to approve or reject.\n\nBest,\nAHRN System`,
            html: `<p>Admin,</p><p>A new B2B user has signed up and is <strong>pending approval</strong>.</p><ul><li><strong>Name:</strong> ${userDetails.userName}</li><li><strong>Email:</strong> ${userDetails.userEmail}</li><li><strong>Company:</strong> ${userDetails.companyName}</li><li><strong>Role:</strong> ${userDetails.role}</li></ul><p>Please examine the dashboard to approve or reject.</p>`
        };

        try {
            await sgMail.send(msg);
            console.log(`✅ Admin notification sent to ${adminEmail}`);
        } catch (error: any) {
            console.error(`❌ Failed to send admin notification to ${adminEmail}:`, error.message);
        }
    }

    async sendInvitationEmail(email: string, name: string, orgName: string, setupUrl: string): Promise<void> {
        if (!this.ensureInitialized()) return;

        const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@acentle.com';
        const fromName = process.env.SENDGRID_FROM_NAME || 'AHRN Platform';

        const msg = {
            to: email,
            from: { email: fromEmail, name: fromName },
            subject: `Invitation to join ${orgName} on AHRN`,
            text: `Hello ${name},\n\nYou have been invited to join ${orgName} as a technician on the AHRN Platform.\n\nTo complete your registration and set up your password, please click the link below:\n${setupUrl}\n\nThis link will expire in 7 days.\n\nBest,\nAHRN Team`,
            html: `<p>Hello <strong>${name}</strong>,</p><p>You have been invited to join <strong>${orgName}</strong> as a technician on the AHRN Platform.</p><p>To complete your registration and set up your password, please click the button below:</p><p style="text-align: center; margin: 30px 0;"><a href="${setupUrl}" style="display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">Set Up Your Account</a></p><p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:<br><a href="${setupUrl}">${setupUrl}</a></p><p style="color: #999; font-size: 12px;">This link will expire in 7 days.</p><p>Best regards,<br>The AHRN Team</p>`
        };

        try {
            await sgMail.send(msg);
            console.log(`✅ Invitation email sent to ${email}`);
        } catch (error: any) {
            console.error(`❌ Failed to send invitation email to ${email}:`, error.message);
        }
    }

    async sendPasswordResetEmail(email: string, name: string, resetUrl: string): Promise<void> {
        if (!this.ensureInitialized()) return;

        const fromEmail = process.env.SENDGRID_FROM_EMAIL || 'noreply@acentle.com';
        const fromName = process.env.SENDGRID_FROM_NAME || 'AHRN Platform';

        const msg = {
            to: email,
            from: { email: fromEmail, name: fromName },
            subject: 'Password Reset Request - AHRN Platform',
            text: `Hello ${name},\n\nA password reset was requested for your account.\n\nTo reset your password, please click the link below:\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you did not request this, please ignore this email.\n\nBest,\nAHRN Team`,
            html: `<p>Hello <strong>${name}</strong>,</p><p>A password reset was requested for your account.</p><p>To reset your password, please click the button below:</p><p style="text-align: center; margin: 30px 0;"><a href="${resetUrl}" style="display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a></p><p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:<br><a href="${resetUrl}">${resetUrl}</a></p><p style="color: #999; font-size: 12px;">This link will expire in 1 hour.</p><p>If you did not request this, please ignore this email.</p><p>Best regards,<br>The AHRN Team</p>`
        };

        try {
            await sgMail.send(msg);
            console.log(`✅ Password reset email sent to ${email}`);
        } catch (error: any) {
            console.error(`❌ Failed to send password reset email to ${email}:`, error.message);
        }
    }

    /**
     * Generate plain text version of welcome email
     */
    private getWelcomeEmailText(name: string): string {
        return `
Hello ${name},

Welcome to AHRN Platform!

Thank you for joining our community. We're excited to have you on board!

Your account has been successfully created and you can now:
- Access your personalized dashboard
- Start managing your home maintenance
- Connect with certified technicians
- Track your jobs and devices

If you have any questions or need assistance, feel free to reach out to our support team.

Best regards,
The AHRN Team
        `.trim();
    }

    /**
     * Generate HTML version of welcome email
     */
    private getWelcomeEmailHtml(name: string): string {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
        }
        .content {
            background: #ffffff;
            padding: 30px;
            border: 1px solid #e0e0e0;
            border-top: none;
        }
        .greeting {
            font-size: 18px;
            color: #667eea;
            margin-bottom: 20px;
        }
        .features {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .features ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .features li {
            padding: 8px 0;
            padding-left: 25px;
            position: relative;
        }
        .features li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #667eea;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 14px;
            border-radius: 0 0 8px 8px;
            background: #f8f9fa;
            border: 1px solid #e0e0e0;
            border-top: none;
        }
        .cta-button {
            display: inline-block;
            padding: 12px 30px;
            background: #667eea;
            color: white !important;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏡 Welcome to AHRN Platform!</h1>
    </div>
    
    <div class="content">
        <p class="greeting">Hello <strong>${name}</strong>,</p>
        
        <p>Thank you for joining our community. We're excited to have you on board!</p>
        
        <p>Your account has been successfully created and you can now access all the features of the AHRN Platform:</p>
        
        <div class="features">
            <ul>
                <li>Access your personalized dashboard</li>
                <li>Manage your home maintenance efficiently</li>
                <li>Connect with certified technicians</li>
                <li>Track your jobs and devices in real-time</li>
            </ul>
        </div>
        
        <p>If you have any questions or need assistance, our support team is here to help!</p>
        
        <p>Best regards,<br><strong>The AHRN Team</strong></p>
    </div>
    
    <div class="footer">
        <p>© 2026 AHRN Platform. All rights reserved.</p>
        <p style="font-size: 12px; color: #999;">This is an automated message, please do not reply to this email.</p>
    </div>
</body>
</html>
        `.trim();
    }
}

// Export singleton instance
export const emailService = new EmailService();
