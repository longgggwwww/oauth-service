export class ScopeEntity {
    id: string;
    name: string;
    description?: string;
    isSystem: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        id: string,
        name: string,
        isSystem: boolean,
        createdAt: Date,
        updatedAt: Date,
        description?: string,
    ) {
        this.id = id;
        this.name = name;
        this.isSystem = isSystem;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.description = description;
    }
}
