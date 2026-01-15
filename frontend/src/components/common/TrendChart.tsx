import React from 'react';
import { motion } from 'framer-motion';

interface TrendChartProps {
    data: number[];
    width?: number;
    height?: number;
    color?: string;
}

export const TrendChart = ({ data, width = 600, height = 200, color = "#C5A059" }: TrendChartProps) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    const padding = 20;

    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
        const y = height - ((val - min) / range) * (height - padding * 2) - padding;
        return { x, y };
    });

    const pathData = points.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(' ');

    const areaData = `${pathData} L ${points[points.length - 1].x},${height} L ${points[0].x},${height} Z`;

    return (
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
            <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>

            <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                d={areaData}
                fill="url(#trendGradient)"
            />

            <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                d={pathData}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Horizontal Grid lines */}
            {[0, 0.5, 1].map((r, i) => {
                const y = height - r * (height - padding * 2) - padding;
                return (
                    <line key={i} x1={padding} y1={y} x2={width - padding} y2={y} stroke="black" strokeOpacity="0.05" strokeWidth="1" />
                );
            })}
        </svg>
    );
};
