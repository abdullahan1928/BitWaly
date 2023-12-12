// make a hook for array

import { useState } from 'react';

export default function useArray<T>(initialArray: T[]) {
    const [array, setArray] = useState(initialArray);

    function push(element: T) {
        setArray((prev) => [...prev, element]);
    }

    function filter(callback: (element: T, index: number, array: T[]) => boolean) {
        setArray((prev) => prev.filter(callback));
    }

    function update(index: number, newElement: T) {
        setArray((prev) => {
            const copy = [...prev];
            copy[index] = newElement;
            return copy;
        });
    }

    function removeByIndex(index: number) {
        setArray((prev) => {
            const copy = [...prev];
            copy.splice(index, 1);
            return copy;
        });
    }

    function clear() {
        setArray([]);
    }

    function remove(index: number) {
        setArray((prev) => {
            const copy = [...prev];
            copy.splice(index, 1);
            return copy;
        });
    }

    return { array, set: setArray, push, filter, update, removeByIndex, clear, remove };
}