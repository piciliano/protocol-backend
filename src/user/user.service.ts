import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { randomBytes } from 'crypto';
import { EmailService } from 'src/email/email.service';
import { compare, hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;
    const hashedPassword = await hash(createUserDto.password, 10);

    await this.findByEmail(createUserDto.email);

    const user = await this.prisma.user.create({
      data: {
        ...rest,
        password: hashedPassword,
      },
    });

    return user;
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return users;
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Unexpected error',
      );
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          role: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        error.message || 'Unexpected error',
      );
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
        select: {
          email: true,
        },
      });

      if (user) {
        throw new HttpException('Email already exists', 400);
      }

      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        error.message || 'Unexpected error',
      );
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      await this.findOne(id);

      const userUpdated = await this.prisma.user.update({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          role: true,
        },
        data: updateUserDto,
      });

      return userUpdated;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        error.message || 'Unexpected error',
      );
    }
  }

  async remove(id: string) {
    try {
      const user = await this.findOne(id);

      await this.prisma.user.delete({
        where: { id: user.id },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        error.message || 'Unexpected error',
      );
    }
  }

  async requestPasswordRecovery(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      return {
        message: 'Se o e-mail existir, um código de recuperação foi enviado.',
      };
    }

    const recoveryCode = randomBytes(3).toString('hex').toUpperCase();
    const hashedRecoveryCode = await hash(recoveryCode, 10);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); 

    await this.prisma.passwordRecovery.create({
      data: {
        codeHash: hashedRecoveryCode,
        expiresAt,
        email: user.email,
        userId: user.id,
      },
    });

    const html = `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        border: 1px solid #ddd;
        padding: 20px;
        border-radius: 8px;
        background-color: #f9f9f9;
        color: #333;
      ">
        <h2 style="color: #4a90e2;">Recuperação de Senha</h2>
        <p>Olá, <strong>${user.name}</strong>!</p>
        <p>Recebemos uma solicitação para redefinir sua senha.</p>
        <p>Seu código de recuperação é:</p>
        <div style="
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 4px;
          background-color: #4a90e2;
          color: white;
          padding: 10px 20px;
          display: inline-block;
          border-radius: 4px;
          margin: 15px 0;
        ">
          ${recoveryCode}
        </div>
        <p>Esse código é válido por 5 minutos.</p>
        <hr style="border:none; border-top:1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #999;">
          Se você não solicitou essa recuperação, ignore este e-mail.
        </p>
      </div>
    `;

    await this.emailService.sendEmail(
      user.email,
      'Seu código de recuperação de senha',
      html,
    );

    return {
      message: 'Se o e-mail existir, um código de recuperação foi enviado.',
    };
  }

  async resetPassword(newPassword: string) {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    const recovery = await this.prisma.passwordRecovery.findFirst({
      where: {
        isValidated: true,
        validatedAt: { gte: fiveMinutesAgo },
      },
    });

    if (!recovery) {
      throw new BadRequestException(
        'Nenhum código validado encontrado ou tempo expirado. Valide o código novamente.',
      );
    }

    const hashedPassword = await hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: recovery.userId },
      data: {
        password: hashedPassword,
      },
    });

    await this.prisma.passwordRecovery.delete({
      where: { id: recovery.id },
    });

    return { message: 'Senha atualizada com sucesso.' };
  }

  async validateRecoveryCode(code: string) {
    const now = new Date();

    const recoveries = await this.prisma.passwordRecovery.findMany({
      where: {
        expiresAt: { gt: now },
        isValidated: false,
      },
      include: { user: true },
    });

    let matchedRecovery: (typeof recoveries)[0] | null = null;
    for (const recovery of recoveries) {
      const isMatch = await compare(code, recovery.codeHash);
      if (isMatch) {
        matchedRecovery = recovery;
        break;
      }
    }

    if (!matchedRecovery) {
      throw new BadRequestException('Código inválido ou expirado.');
    }

    await this.prisma.passwordRecovery.update({
      where: { id: matchedRecovery.id },
      data: {
        isValidated: true,
        validatedAt: new Date(),
      },
    });

    return { message: 'Código validado com sucesso.' };
  }
}
