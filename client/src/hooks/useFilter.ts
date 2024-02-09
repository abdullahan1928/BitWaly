import { FilterContext } from "@/context/FilterLinksContext";
import { useContext } from "react";

export const useFilter = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error('useFilter must be used within a FilterProvider');
    }
    return context;
};