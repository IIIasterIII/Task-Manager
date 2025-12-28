"use client"
import { FC } from 'react';
import { ResponsiveContainer, YAxis, XAxis, Tooltip, Area, AreaChart } from 'recharts';

export const MiniChart: FC<{ chartData: any[], tasks: any[] }> = ({ chartData, tasks }) => (
    <ResponsiveContainer width="100%" height={250} className="outline-none">
        <AreaChart data={chartData} margin={{ top: 50, right: 10, left: 10, bottom: 20 }}>
            <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#52525b', fontSize: 11 }} 
                dy={10} 
            />
            <YAxis hide domain={[0, 100]} />
            <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                itemStyle={{ fontSize: '12px' }}
                cursor={{ stroke: '#3f3f46', strokeDasharray: '4 4' }}
            />
            {tasks.map((task) => (
                <Area
                    key={task.id}
                    type="monotone"
                    dataKey={task.title}
                    stroke={task.color}
                    fillOpacity={0} 
                    strokeWidth={2}
                    activeDot={{ r: 4, fill: task.color, strokeWidth: 0 }}
                />
            ))}
        </AreaChart>
    </ResponsiveContainer>
);