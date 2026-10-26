export interface AuthUser {
    branchId: number | null;
    id: number;
    name: string;
    username: string;
    roles: string[];
    permissions: string[];
    positionId?: string | null;
}

export interface JwtPayload {
    id: number;
    username: string;
    roles: string[];
    permissions: string[];
}

export interface LoginDTO {
    username: string;
    password: string;
}