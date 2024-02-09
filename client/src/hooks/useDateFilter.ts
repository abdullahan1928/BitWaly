import { DateFilterContext } from "@/context/FilterLinkDetailsContext";
import { useContext } from "react";

export const useDateFilter = () => {
    const context = useContext(DateFilterContext);
    if (!context) {
        throw new Error('useDateFilter must be used within a DateFilterProvider');
    }
    return context;
};
