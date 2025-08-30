import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/user.decorator';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    /**
     * GET /profile/me
     *
     * @description
     * Get the currently authenticated user's profile.
     *
     * @headers
     *   Authorization: Bearer <JWT>
     *
     * @response
     * {
     *   "id": "user-uuid",
     *   "email": "email@example.com",
     *   "name": "User",
     *   "createdAt": "2025-06-07T09:00:00Z",
     *   "updatedAt": "2025-06-07T10:00:00Z"
     * }
    */
    @Get('me')
    getProfile(@User() user: any) {
        return this.profileService.getMe(user.userId);
    }

    /**
     * PATCH /profile/me
     *
     * @description
     * Update the currently authenticated user's profile.
     *
     * @headers
     *   Authorization: Bearer <JWT>
     *
     * @request-body
     * {
     *   "name": "New User",
     *   "email": "newemail@example.com"
     * }
     *
     * @response
     * {
     *   "id": "user-uuid",
     *   "email": "newemail@example.com",
     *   "name": "New User",
     *   "createdAt": "2025-06-07T09:00:00Z",
     *   "updatedAt": "2025-06-07T10:00:00Z"
     * }
    */
    @Patch('me')
    updateProfile(@User() user: any, @Body() dto: UpdateProfileDto) {
        return this.profileService.updateMe(user.userId, dto);
    }
}
