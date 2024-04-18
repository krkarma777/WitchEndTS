export enum UserRole {
    ROLE_ADMIN = 'ADMIN',
    ROLE_USER = 'USER',
}

export function fromDescription(description: string): UserRole {
    const role = Object.values(UserRole).find(role => role === description);
    if (role) {
        return role;
    } else {
        throw new Error(`No matching constant for [${description}]`);
    }
}

export function fromRoleString(roleStr: string): UserRole {
    const description = roleStr.replace('ROLE_', ''); // 접두사 제거
    return fromDescription(description);
}
