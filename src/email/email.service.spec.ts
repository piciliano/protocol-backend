import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import * as nodemailer from 'nodemailer';

jest.mock('nodemailer');

describe('EmailService', () => {
  let service: EmailService;
  let mockTransporter: jest.Mocked<nodemailer.Transporter>;

  beforeEach(async () => {
    process.env.EMAIL_HOST = 'smtp.example.com';
    process.env.EMAIL_PORT = '587';
    process.env.EMAIL_USER = 'test@example.com';
    process.env.EMAIL_PASS = 'password123';
    process.env.EMAIL_FROM = 'noreply@example.com';

    mockTransporter = {
      sendMail: jest.fn(),
    } as any;

    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);

    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create nodemailer transport with correct config', () => {
      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT!, 10),
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    });
  });

  describe('sendEmail', () => {
    const to = 'user@example.com';
    const subject = 'Test Subject';
    const content = '<p>Test Content</p>';

    it('should send email successfully', async () => {
      mockTransporter.sendMail.mockResolvedValueOnce({} as any);

      await service.sendEmail(to, subject, content);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html: content,
      });
    });

    it('should throw error when sending email fails', async () => {
      const error = new Error('Failed to send email');
      mockTransporter.sendMail.mockRejectedValueOnce(error);

      await expect(service.sendEmail(to, subject, content)).rejects.toThrow(error);
      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html: content,
      });
    });
  });
}); 