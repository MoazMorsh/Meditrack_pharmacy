import SalesChart from "@/components/pharmacist/dashboard/sales-chart"

export default function PharmacistDashboard() {
  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <div className="breadcrumb">
          <a href="/">Home</a>
          <span>/</span>
          <span>Dashboard</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stats-card">
          <div className="stats-value">1,500</div>
          <div className="stats-label">Traffic</div>
          <div className="stats-trend up">
            <span>↗</span>
            <span>+40%</span>
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-value">234</div>
          <div className="stats-label">Sales</div>
          <div className="stats-trend down">
            <span>↘</span>
            <span>-60%</span>
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-value">465</div>
          <div className="stats-label">Pageviews</div>
          <div className="stats-trend up">
            <span>↗</span>
            <span>+30%</span>
          </div>
        </div>
        <div className="stats-card">
          <div className="stats-value">235</div>
          <div className="stats-label">Visitors</div>
          <div className="stats-trend up">
            <span>↗</span>
            <span>+80%</span>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <SalesChart />
      </div>
    </>
  )
}
