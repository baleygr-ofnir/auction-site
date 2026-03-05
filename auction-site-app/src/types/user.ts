export interface UserResponse {
    id: string;
    username: string;
    email: string;
    isActive: boolean;
    isAdmin: boolean;
}

export interface UserRegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface UserLoginRequest {
    usernameOrEmail: string;
    password: string;
}

export interface UserLoginResponse {
    token: string;
    user: UserResponse;
}

export interface UserUpdateRequest {
    email?: string;
    password?: string;
    isActive?: boolean;
    isAdmin?: boolean;
}