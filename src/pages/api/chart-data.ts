// pages/api/chart-data.ts

export default function handler(req, res) {
  const chartData = [
    {month: 'January', desktop: 186},
    {month: 'February', desktop: 305},
    {month: 'March', desktop: 237},
    {month: 'April', desktop: 73},
    {month: 'May', desktop: 209},
    {month: 'June', desktop: 214}
  ]
  res.status(200).json(chartData)
}
