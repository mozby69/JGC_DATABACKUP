import { beforeEach, describe, expect, it, vi } from "vitest";

import { loginUser } from "./auth.service";
import * as authRepository from "./auth.repository";
import { verifyPassword } from "./internal/password.service";
import { generateAccessToken } from "./internal/token.service";
import { mapAuthenticatedUser } from "./auth.mapper";
import { ErrorCodes } from "@/errors/error-codes";

vi.mock("./auth.repository");

vi.mock("./internal/password.service", () => ({
    verifyPassword: vi.fn(),
}));

vi.mock("./internal/token.service", () => ({
    generateAccessToken: vi.fn(),
}));

vi.mock("./auth.mapper", () => ({
    mapAuthenticatedUser: vi.fn(),
}));

describe("loginUser", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should throw INVALID_CREDENTIALS when user does not exist", async () => {
        vi.mocked(
            authRepository.findByUsernameWithRoles
        ).mockResolvedValue(null);

        await expect(
            loginUser({
                username: "john",
                password: "Password123!",
            })
        ).rejects.toMatchObject({
            statusCode: 401,
            code: ErrorCodes.INVALID_CREDENTIALS,
            message: "Invalid username or password",
        });

        expect(
            authRepository.findByUsernameWithRoles
        ).toHaveBeenCalledWith("john");

        expect(verifyPassword).not.toHaveBeenCalled();
        expect(mapAuthenticatedUser).not.toHaveBeenCalled();
        expect(generateAccessToken).not.toHaveBeenCalled();
    });

    it("should throw INVALID_CREDENTIALS when user is inactive", async () => {
        vi.mocked(
            authRepository.findByUsernameWithRoles
        ).mockResolvedValue({
            id: 1,
            name: "John Doe",
            username: "john",
            password: "hashed-password",
            isActive: false,
            roles: [],
        });

        await expect(
            loginUser({
                username: "john",
                password: "Password123!",
            })
        ).rejects.toMatchObject({
            statusCode: 401,
            code: ErrorCodes.INVALID_CREDENTIALS,
            message: "Invalid username or password",
        });

        expect(verifyPassword).not.toHaveBeenCalled();
        expect(mapAuthenticatedUser).not.toHaveBeenCalled();
        expect(generateAccessToken).not.toHaveBeenCalled();
    });

    it("should throw INVALID_CREDENTIALS when password is invalid", async () => {
        const user = {
            id: 1,
            name: "John Doe",
            username: "john",
            password: "hashed-password",
            isActive: true,
            roles: [],
        };

        vi.mocked(
            authRepository.findByUsernameWithRoles
        ).mockResolvedValue(user);

        vi.mocked(verifyPassword).mockResolvedValue(false);

        await expect(
            loginUser({
                username: "john",
                password: "wrong-password",
            })
        ).rejects.toMatchObject({
            statusCode: 401,
            code: ErrorCodes.INVALID_CREDENTIALS,
            message: "Invalid username or password",
        });

        expect(verifyPassword).toHaveBeenCalledWith(
            "wrong-password",
            "hashed-password"
        );

        expect(mapAuthenticatedUser).not.toHaveBeenCalled();
        expect(generateAccessToken).not.toHaveBeenCalled();
    });

    it("should return token and authenticated user when credentials are valid", async () => {
        const user = {
            id: 1,
            name: "John Doe",
            username: "john",
            password: "hashed-password",
            isActive: true,
            roles: [
                {
                    role: {
                        id: 1,
                        name: "ADMIN",
                        description: null,
                        permissions: [
                            {
                                permission: {
                                    id: 1,
                                    code: "USER_MANAGE",
                                    name: "Manage Users",
                                    description: null,
                                },
                            },
                        ],
                    },
                },
            ],
        };

        const authenticatedUser = {
            id: 1,
            name: "John Doe",
            username: "john",
            roles: ["ADMIN"],
            permissions: ["users.read"],
        };

        vi.mocked(
            authRepository.findByUsernameWithRoles
        ).mockResolvedValue(user);

        vi.mocked(verifyPassword).mockResolvedValue(true);

        vi.mocked(mapAuthenticatedUser).mockReturnValue(
            authenticatedUser
        );

        vi.mocked(generateAccessToken).mockReturnValue(
            "mock-access-token"
        );

        const result = await loginUser({
            username: "john",
            password: "Password123!",
        });

        expect(
            authRepository.findByUsernameWithRoles
        ).toHaveBeenCalledWith("john");

        expect(verifyPassword).toHaveBeenCalledWith(
            "Password123!",
            "hashed-password"
        );

        expect(mapAuthenticatedUser).toHaveBeenCalledWith(user);

        expect(generateAccessToken).toHaveBeenCalledWith({
            id: 1,
            username: "john",
            roles: ["ADMIN"],
            permissions: ["users.read"],
        });

        expect(result).toEqual({
            token: "mock-access-token",
            user: authenticatedUser,
        });
    });
});