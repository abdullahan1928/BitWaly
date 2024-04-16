import Skeleton from '@mui/material/Skeleton';

interface BarChartSkeletonProps {
    barCount: number;
    width: number;
    animation?: 'wave' | 'pulse' | false;
}

const BarChartSkeleton = ({ barCount, width, animation }: BarChartSkeletonProps) => {
    // Define an array to store the Skeleton components for each bar
    const bars = [];

    // Create Skeleton components for each bar
    for (let i = 0; i < barCount; i++) {
        bars.push(
            <Skeleton
                key={i}
                variant="rectangular"
                width={width}
                height={Math.floor(Math.random() * 100) + 100}
                className='mr-1'
                animation={animation}
            />
        );
    }

    return (
        <div className="flex items-end justify-center p-4">
            {bars}
        </div>
    );
};

export default BarChartSkeleton;
