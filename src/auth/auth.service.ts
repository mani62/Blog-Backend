import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService, private jwt: JwtService) {}

    async register(data) {
        const hash = await bcrypt.hash(data.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: data.email,
                password: hash,
                name: data.name,
            },
        });
        return this.generateToken(user);
    }

    async login(data) {
        const user = await this.prisma.user.findUnique({
            where: { email: data.email },
        });

        if (!user || !(await bcrypt.compare(data.password, user.password))) {
            throw new Error('Invalid credentials');
        }

        return this.generateToken(user);
    }

    private generateToken(user) {
        const payload = { email: user.email, userId: user.id };
        return {
            access_token: this.jwt.sign(payload),
        };
    }
}
