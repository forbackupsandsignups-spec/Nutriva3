/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useTranslation } from "react-i18next";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Line,
  ComposedChart,
  Cell
} from "recharts";
import { Card } from "./ui";
import { UserProfile } from "../types";

interface WeeklyOverviewChartProps {
  userProfile: UserProfile;
}

export const WeeklyOverviewChart = ({ userProfile }: WeeklyOverviewChartProps) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  // Mock calorie data for the week (in real app, this would come from a database)
  const days = isRTL 
    ? ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const data = days.map((day, index) => {
    // Generate some stable-looking mock data
    const calorieSeed = [1850, 2100, 1950, 2200, 1800, 2400, 2050];
    const weightSeed = [80.5, 80.2, 80.3, 79.9, 79.8, 80.1, 79.6];
    
    // In real app, we would match these with userProfile.weightHistory
    return {
      name: day,
      calories: calorieSeed[index],
      weight: weightSeed[index],
      target: 2100 // user's target
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-2xl shadow-2xl border-none text-right">
          <p className="font-black text-sm mb-2 text-primary">{label}</p>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center gap-4 flex-row-reverse">
              <span className="text-[10px] font-bold text-text-muted">السعرات:</span>
              <span className="font-black text-black">{payload[0].value}</span>
            </div>
            {payload[1] && (
              <div className="flex justify-between items-center gap-4 flex-row-reverse">
                <span className="text-[10px] font-bold text-text-muted">الوزن:</span>
                <span className="font-black text-accent">{payload[1].value} كجم</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-8 border-none shadow-xl bg-white flex flex-col gap-6">
      <div className="flex justify-between items-center flex-row-reverse">
        <div className="text-right">
          <h3 className="font-black text-lg">نظرة أسبوعية</h3>
          <p className="text-[10px] font-bold text-text-muted italic">السعرات الحرارية مقابل الوزن</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 flex-row-reverse">
            <div className="w-3 h-3 bg-primary/20 rounded-sm" />
            <span className="text-[10px] font-bold text-text-muted">السعرات</span>
          </div>
          <div className="flex items-center gap-2 flex-row-reverse">
            <div className="w-3 h-3 bg-accent rounded-full" />
            <span className="text-[10px] font-bold text-text-muted">الوزن</span>
          </div>
        </div>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000008" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 'bold', fill: '#888' }}
              reversed={isRTL}
            />
            <YAxis 
              yAxisId="left"
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 'bold', fill: '#888' }}
              orientation={isRTL ? 'right' : 'left'}
              hide
            />
            <YAxis 
              yAxisId="right"
              axisLine={false} 
              tickLine={false} 
              orientation={isRTL ? 'left' : 'right'}
              hide
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            <Bar 
              yAxisId="left"
              dataKey="calories" 
              radius={[6, 6, 0, 0]} 
              barSize={32}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.calories > entry.target ? 'rgba(27, 77, 62, 0.4)' : 'rgba(27, 77, 62, 0.15)'} 
                />
              ))}
            </Bar>
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="weight" 
              stroke="#EAB308" 
              strokeWidth={3} 
              dot={{ fill: '#EAB308', strokeWidth: 2, r: 4, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
