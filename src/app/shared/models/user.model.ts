type BaseUser = {
    username: string;
    email: string;
};


export type IUser = BaseUser & {
    password?: string;
    profileImage?: string;
    role?: string;
    isBlocked?: boolean;
    createdAt?: Date
};

export type IAdmin = BaseUser & {
    role?: string;
    isBlocked?: boolean;
};