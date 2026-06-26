import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { AuthService, JwtPayload } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test-secret-key-12345',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Password Hashing', () => {
    it('should hash a password and verify it successfully', async () => {
      const password = 'SuperSecurePassword123!';
      const hash = await service.hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toEqual(password);

      const isValid = await service.comparePasswords(password, hash);
      expect(isValid).toBe(true);

      const isInvalid = await service.comparePasswords('wrong-password', hash);
      expect(isInvalid).toBe(false);
    });
  });

  describe('JWT Management', () => {
    it('should sign and verify JWT tokens correctly', () => {
      const payload: JwtPayload = {
        sub: 'user-uuid-123',
        email: 'test@vave.com',
        role: 'tenant_admin',
        tenantId: 'tenant-uuid-456',
      };

      const token = service.generateToken(payload);
      expect(token).toBeDefined();

      const decoded = service.verifyToken(token);
      expect(decoded.sub).toEqual(payload.sub);
      expect(decoded.email).toEqual(payload.email);
      expect(decoded.role).toEqual(payload.role);
      expect(decoded.tenantId).toEqual(payload.tenantId);
    });
  });
});
