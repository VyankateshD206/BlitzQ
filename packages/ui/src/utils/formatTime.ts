import { ValueType } from "recharts/types/component/DefaultTooltipContent";

export function formatTime(seconds: number) {

    seconds = Math.floor(seconds);

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (seconds < 60) {
        return `${secs} second${secs !== 1 ? 's' : ''}`;
    } else if (seconds < 3600) {
        return `${mins} minute${mins !== 1 ? 's' : ''}${secs > 0 ? `, ${secs} second${secs !== 1 ? 's' : ''}` : ''}`;
    } else {
        return `${hrs} hour${hrs !== 1 ? 's' : ''}${mins > 0 ? `, ${mins} minute${mins !== 1 ? 's' : ''}` : ''}`;
    }
}

export function formatTimeForChart(secondsArray: ValueType) {
    
    return formatTime(secondsArray as number);
    
}