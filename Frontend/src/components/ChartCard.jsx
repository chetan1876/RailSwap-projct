import { FaTrophy } from "react-icons/fa6";


<div className="relative bg-white rounded-3xl p-6 shadow-xl border border-gray-100 overflow-hidden">

  {/* Decorative Background */}
  <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-70"></div>
  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-100 rounded-full blur-3xl opacity-70"></div>

  {/* Header */}
  <div className="flex justify-between items-center mb-6 relative z-10">
    <div>
      <h3 className="text-xl font-bold text-gray-800">
        Crowd Density
      </h3>
      <p className="text-sm text-gray-500">
        Live Coach Analytics
      </p>
    </div>

    <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-semibold">
      Live
    </div>
  </div>

  {/* Stats */}
  <div className="grid grid-cols-3 gap-4 mb-6 relative z-10">
    <div className="bg-gray-50 rounded-2xl p-3 text-center">
      <p className="text-2xl font-bold">85%</p>
      <p className="text-xs text-gray-500">Occupancy</p>
    </div>

    <div className="bg-gray-50 rounded-2xl p-3 text-center">
      <p className="text-2xl font-bold">A1</p>
      <p className="text-xs text-gray-500">Coach</p>
    </div>

    <div className="bg-gray-50 rounded-2xl p-3 text-center">
      <p className="text-2xl font-bold">120</p>
      <p className="text-xs text-gray-500">Passengers</p>
    </div>
  </div>

  {/* Chart */}
  <div className="h-64 relative z-10">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <XAxis dataKey="coach" />
        <YAxis />
        <Tooltip />
        <Bar
          dataKey="passengers"
          radius={[12, 12, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>