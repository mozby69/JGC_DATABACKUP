import { prisma } from "@/lib/database/prisma";

const authUserSelect = {
    id: true,
    name: true,
    username: true,
    password: true,
    isActive: true,


    roles: {
        select: {
            role: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    
                    permissions: {
                        select: {
                            permission: {
                                select: {
                                    id: true,
                                    code: true,
                                    name: true,
                                    description: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    },
} as const;

export async function findByIdWithRoles(userId: number) {
    return prisma.user.findUnique({
        where: {
            id: userId,
            
        },
        select: authUserSelect,
    });
}

export async function findByUsernameWithRoles(username: string) {
    return prisma.user.findUnique({
        where: {
            username,
        },
        select: authUserSelect,
    });
}

export async function findExistingUser({
    username,
    email,
}: {
    username: string;
    email?: string | null;
}) {
    return prisma.user.findFirst({
        where: {
            OR: [
                { username },
                ...(email ? [{ email }] : []),
            ],
        },
    });
}

export async function findRolesByIds(roleIds: number[]) {
    return prisma.role.findMany({
        where: {
            id: {
                in: roleIds,
            },
        },
    });
}

export async function createUserWithRoles(data: {
    email?: string | null;
    name: string;
    username: string;
    password: string;
}) {
    const {
        email,
        name,
        username,
        password,
    } = data;

    return prisma.$transaction(async (tx) => {
        const createdUser = await tx.user.create({
            data: {
                email,
                name,
                username,
                password,
                isActive: true,
            },
        });

        return createdUser;
    });
}

export async function findById(userId: number) {
    return prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
}

export async function findDuplicateUser({
    userId,
    username,
    email,
}: {
    userId: number;
    username?: string;
    email?: string | null;
}) {
    if (!username && !email) {
        return null;
    }

    return prisma.user.findFirst({
        where: {
            id: {
                not: userId,
            },
            OR: [
                ...(username ? [{ username }] : []),
                ...(email ? [{ email }] : []),
            ],
        },
    });
}

export async function updateUserWithRoles(
    userId: number,
    data: {
        email?: string;
        name?: string;
        username?: string;
        password?: string;
        isActive?: Boolean;
        roleIds?: number[];
    }
) {
    return prisma.$transaction(async (tx) => {
        const user = await tx.user.update({
            where: {
                id: userId,
            },
            data: {
                ...(data.email !== undefined && {
                    email: data.email,
                }),

                ...(data.name !== undefined && {
                    name: data.name,
                }),

                ...(data.username !== undefined && {
                    username: data.username,
                }),

                ...(data.password !== undefined && {
                    password: data.password,
                }),

                ...(data.isActive !== undefined && {
                    company_id: data.isActive,
                }),
            },
        });

        if (data.roleIds !== undefined) {
            await tx.userRole.deleteMany({
                where: {
                    userId,
                },
            });

            if (data.roleIds.length > 0) {
                await tx.userRole.createMany({
                    data: data.roleIds.map((roleId) => ({
                        userId,
                        roleId,
                    })),
                });
            }
        }

        return user;
    });
}


export async function findAllRoles() {
    return prisma.role.findMany({
        select: {
            id: true,
            name: true,
            description: true,
            permissions: {
                select: {
                    roleId: true,
                    permissionId: true,
                    permission: {
                        select: {
                            code: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            name: "asc",
        },
    });
}

// permission.repository.ts

export async function findAllPermissions() {
    return prisma.permission.findMany({
        select: {
            id: true,
            code: true,
            name: true,
        },
        orderBy: {
            name: "asc",
        },
    });
}

export async function findAllUsers() {
    return prisma.user.findMany({
        select: {
            id: true,
            username: true,
            name: true,
            email: true,
            isActive: true,
            createdAt: true,

            roles: {
                select: {
                    role: {
                        select: {
                            id: true,
                            name: true,

                            permissions: {
                                select: {
                                    permission: {
                                        select: {
                                            id: true,
                                            code: true,
                                            name: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },

        orderBy: {
            username: "asc",
        },
    });
}

export async function updatePermissions(
    roleId: number,
    permissionIds: number[]
) {
    return prisma.$transaction(async (tx) => {
        await tx.rolePermission.deleteMany({
            where: {
                roleId,
            },
        });

        if (permissionIds.length > 0) {
            await tx.rolePermission.createMany({
                data: permissionIds.map((permissionId) => ({
                    roleId,
                    permissionId,
                })),
            });
        }
    });
}