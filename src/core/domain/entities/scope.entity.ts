export class ScopeEntity {
    id: string;
    name: string;
    description?: string;

    constructor(id: string, name: string, description?: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }

    static create(name: string, description?: string): ScopeEntity {
        return new ScopeEntity(crypto.randomUUID(), name, description);
    }
}
