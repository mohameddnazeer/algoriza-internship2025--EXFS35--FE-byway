import React, { useMemo } from 'react';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
} from 'recharts';

// Keep in sync with your existing type
export type DashboardStats = {
  totalInstructors: number;
  totalCategories: number;
  totalCourses: number;
  monthlySubscriptions: number; // not used in this pie
};

type Props = { stats?: DashboardStats };

const COLORS = {
  instructors: '#4F46E5', // indigo-600 (deep)
  categories:  '#60A5FA', // blue-400  (light)
  courses:     '#E5E7EB', // gray-200  (very light)
};

export const StatsPie: React.FC<Props> = ({ stats }) => {
  const { data, total } = useMemo(() => {
    const ins = stats?.totalInstructors ?? 0;
    const cat = stats?.totalCategories ?? 0;
    const cou = stats?.totalCourses ?? 0;
    const t = ins + cat + cou;

    return {
      total: t,
      data: [
        { key: 'Instructors', value: ins, color: COLORS.instructors },
        { key: 'Categories',  value: cat, color: COLORS.categories  },
        { key: 'Courses',     value: cou, color: COLORS.courses     },
      ],
    };
  }, [stats]);

  const percent = (v: number) => (total > 0 ? Math.round((v / total) * 100) : 0);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>

      {total === 0 ? (
        <div className="h-52 flex items-center justify-center text-sm text-gray-500">
          No data available
        </div>
      ) : (
        <>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="key"
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  innerRadius={0} // full pie (no hole) to match your screenshot
                  stroke="#fff"
                  strokeWidth={2}
                  isAnimationActive
                >
                  {data.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: any) => [`${v} (${percent(Number(v))}%)`, 'Count']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {data.map((d) => (
              <div key={d.key} className="flex items-center gap-2">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{ background: d.color }}
                />
                <span className="text-sm text-gray-600">{d.key}</span>
                <span className="ml-auto text-sm font-semibold text-gray-900">
                  {percent(d.value)}%
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default StatsPie;
