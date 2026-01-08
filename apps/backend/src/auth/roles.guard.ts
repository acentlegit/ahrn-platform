
import { CanActivate, ExecutionContext } from '@nestjs/common';

export class RolesGuard implements CanActivate {
  constructor(private roles: string[]) {}
  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    return this.roles.includes(req.user.role);
  }
}
