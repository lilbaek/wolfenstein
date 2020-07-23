interface IDictionary<T> {
    add(key: string, value: T): void;
    remove(key: string): void;
    containsKey(key: string): boolean;
    get(key: string): T;
    keys(): string[];
    count(): number;
    values(): T[];
}
