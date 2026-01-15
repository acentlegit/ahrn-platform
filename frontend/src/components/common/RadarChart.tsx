import React from 'react';
import { motion } from 'framer-motion';

interface RadarData {
    label: string;
    value: number; // 0 to 100
}

interface RadarChartProps {
    data: RadarData[];
    size?: number;
    color?: string;
}

export const RadarChart = ({ data, size = 300, color = "#C5A059" }: RadarChartProps) => {
    const center = size / 2;
    const radius = size * 0.4;
    const angleStep = (Math.PI * 2) / data.length;

    // Generate points for the shape
    const points = data.map((d, i) => {
        const x = center + (radius * (d.value / 100)) * Math.cos(i * angleStep - Math.PI / 2);
        const y = center + (radius * (d.value / 100)) * Math.sin(i * angleStep - Math.PI / 2);
        return { x, y };
    });

    const pathData = points.map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`)).join(' ') + ' Z';

    // Grid lines (circles)
    const gridCircles = [0.2, 0.4, 0.6, 0.8, 1].map((r, i) => (
        <circle
            key={i}
            cx={center}
            cy={center}
            r={radius * r}
            fill="none"
            stroke="black"
            strokeOpacity="0.05"
            strokeWidth="1"
        />
    ));

    // Axis lines
    const axisLines = data.map((d, i) => {
        const x = center + radius * Math.cos(i * angleStep - Math.PI / 2);
        const y = center + radius * Math.sin(i * angleStep - Math.PI / 2);
        return (
            <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="black"
                strokeOpacity="0.05"
                strokeWidth="1"
            />
        );
    });

    // Labels
    const labels = data.map((d, i) => {
        const x = center + (radius + 20) * Math.cos(i * angleStep - Math.PI / 2);
        const y = center + (radius + 20) * Math.sin(i * angleStep - Math.PI / 2);
        return (
            <text
                key={i}
                x={x}
                y={y}
                fill="#94a3b8" // slate-400
                fontSize="8"
                fontWeight="900"
                textAnchor="middle"
                className="uppercase tracking-widest"
            >
                {d.label}
            </text>
        );
    });

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {gridCircles}
            {axisLines}
            <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                d={pathData}
                fill={color}
            />
            <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                d={pathData}
                fill="none"
                stroke={color}
                strokeWidth="2"
            />
            {points.map((p, i) => (
                <motion.circle
                    key={i}
                    initial={{ r: 0 }}
                    animate={{ r: 3 }}
                    transition={{ delay: 1 + i * 0.1 }}
                    cx={p.x}
                    cy={p.y}
                    fill={color}
                />
            ))}
            {labels}
        </svg>
    );
};
