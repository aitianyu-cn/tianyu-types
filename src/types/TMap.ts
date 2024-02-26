/**@format */

import { IComparable } from "./Types";

/**
 * Tianyu Map
 * Support Customized Object type
 */
export class TMap<K extends IComparable, V> {
    private _map: Map<string, V>;
    private _kMap: Map<string, K>;

    /**
     * Create an empty Tianyu Map Instance
     */
    public constructor() {
        this._map = new Map<string, V>();
        this._kMap = new Map<string, K>();
    }

    /**
     * Clean the Map instance
     */
    public clear(): void {
        this._map.clear();
        this._kMap.clear();
    }

    /**
     * Delete a specified item from the instance
     *
     * @param key The key of the item
     * @returns return true if deleted successful and return false if failed
     */
    public delete(key: K): boolean {
        const keyString = key.getString();
        return this._map.delete(keyString) && this._kMap.delete(keyString);
    }

    /**
     * Executes a provided function once per each key/value pair in the Map, in insertion order.
     *
     * @param callbackfn provided execution function
     * @param thisArg additional args
     */
    public forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
        const runMap = new Map<K, V>();
        this._map.forEach((value: V, key: string, map: Map<string, V>) => {
            const keyObj = this._kMap.get(key);
            if (!!!keyObj) {
                return;
            }
            runMap.set(keyObj, value);
            callbackfn(value, keyObj, runMap);
        }, thisArg);
    }

    /**
     * Returns a specified element from the Map object. If the value that is associated to the provided key is an object,
     * then you will get a reference to that object and any change made to that object will effectively modify it inside the Map.
     *
     * @param key The key of the value
     * @returns Returns the element associated with the specified key.
     *          If no element is associated with the specified key, undefined is returned.
     */
    public get(key: K): V | undefined {
        const keyString = key.getString();
        return this._map.get(keyString);
    }

    /**
     * Get a boolean value indicates whether an element with the specified key exists or not.
     *
     * @param key The key what wants to search
     * @returns return true if the value is found
     */
    public has(key: K): boolean {
        const keyString = key.getString();
        return this._kMap.has(keyString);
    }

    /**
     * Adds a new element with a specified key and value to the Map. If an element with the same key already exists, the element will be updated.
     *
     * @param key The key of new element
     * @param value The value of new element
     * @returns return the instance that is current instance
     */
    public set(key: K, value: V): this {
        const keyString = key.getString();
        this._map.set(keyString, value);
        this._kMap.set(keyString, key);
        return this;
    }

    /**
     * Get a number of elements in the Map
     *
     * @returns return the count of elements
     */
    public size(): number {
        return this._kMap.size;
    }

    /**
     * Get all keys of the Map
     *
     * @returns return a keys iterator
     */
    public keys(): IterableIterator<K> {
        return this._kMap.values();
    }

    /**
     * Get all values of the Map
     *
     * @returns return a values iterator
     */
    public values(): IterableIterator<V> {
        return this._map.values();
    }

    /**
     * Get an Iterator of the Map
     *
     * @returns return an iterator object
     */
    [Symbol.iterator](): Iterator<[K | undefined, V | undefined]> {
        const keys = this._map.entries();
        const iteratorObj: Iterator<[K | undefined, V | undefined]> = {
            next: () => {
                const keyNext = keys.next();
                if (keyNext.done) {
                    return {
                        done: true,
                        value: [undefined, undefined],
                    };
                }

                const value: [K, V] = [this._kMap.get(keyNext.value[0]) as K, keyNext.value[1]];
                return {
                    done: false,
                    value: value,
                };
            },
        };

        return iteratorObj;
    }
}
