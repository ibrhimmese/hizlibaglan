export interface JwtPayloadDto {
  sub: string; // Kullanıcı ID'si
  email: string; // Kullanıcı email'i
  role: string; // Kullanıcı rolü (örneğin: 'admin', 'user')
}
