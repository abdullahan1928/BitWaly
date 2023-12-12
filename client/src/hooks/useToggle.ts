import { useState } from 'react';

export default function useToggle(initialValue: boolean) {
    // Pass initial state function to useState so logic is only executed once
    const [toggleValue, setToggleValue] = useState(initialValue);

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.

    const toggle = () => {
        try {
            // Save state
            setToggleValue(!toggleValue);
        } catch (error) {
            // A more advanced implementation would handle the error case
            console.log(error);
        }
    };

    // return [storedValue, setValue];
    return { toggleValue, toggle };
}