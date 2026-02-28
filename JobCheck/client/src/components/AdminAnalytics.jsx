import React from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const AdminAnalytics = ({ activities }) => {
    // 1. Process Data for Pie Chart (Real vs Fake)
    const totalReal = activities.filter(a => a.result === "Real Job").length;
    const totalFake = activities.filter(a => a.result === "Fake Job").length;
    const total = totalReal + totalFake;

    const realPercentage = total > 0 ? ((totalReal / total) * 100).toFixed(1) : 0;
    const fakePercentage = total > 0 ? ((totalFake / total) * 100).toFixed(1) : 0;

    const pieData = {
        labels: [`Real Jobs (${totalReal})`, `Fake Jobs (${totalFake})`],
        datasets: [
            {
                data: [totalReal, totalFake],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.6)', // Green
                    'rgba(239, 68, 68, 0.6)',  // Red
                ],
                borderColor: [
                    '#22c55e',
                    '#ef4444',
                ],
                borderWidth: 2,
            },
        ],
    };

    // 2. Process Data for Bar Chart (Time Trend)
    // We'll group by date. activities entries have 'timestamp' like '2026-03-01 00:11:07'
    const trendData = activities.reduce((acc, act) => {
        const date = act.timestamp.split(' ')[0];
        if (!acc[date]) {
            acc[date] = { real: 0, fake: 0 };
        }
        if (act.result === "Real Job") acc[date].real++;
        else acc[date].fake++;
        return acc;
    }, {});

    const sortedDates = Object.keys(trendData).sort();

    const barData = {
        labels: sortedDates,
        datasets: [
            {
                label: 'Real Jobs',
                data: sortedDates.map(d => trendData[d].real),
                backgroundColor: 'rgba(212, 175, 55, 0.6)', // Gold
                borderColor: '#D4AF37',
                borderWidth: 1,
            },
            {
                label: 'Fake Jobs',
                data: sortedDates.map(d => trendData[d].fake),
                backgroundColor: 'rgba(255, 255, 255, 0.1)', // Subtle White
                borderColor: 'rgba(255, 255, 255, 0.3)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#9ca3af',
                    font: { size: 12, weight: 'bold' }
                }
            },
            tooltip: {
                backgroundColor: '#1a1a1a',
                titleColor: '#D4AF37',
                bodyColor: '#fff',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 12,
            }
        },
        scales: {
            y: {
                ticks: { color: '#6b7280' },
                grid: { color: 'rgba(255,255,255,0.05)' }
            },
            x: {
                ticks: { color: '#6b7280' },
                grid: { display: false }
            }
        }
    };

    const pieOptions = {
        ...chartOptions,
        scales: undefined, // Pie chart doesn't use scales
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Pie Chart Card */}
            <div className="lg:col-span-1 bg-dark-surface border border-white/10 p-8 md:p-10 rounded-[40px] flex flex-col items-center">
                <h3 className="text-2xl font-serif font-bold mb-2 text-center w-full">Detection <span className="text-gold">Ratio</span></h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-black mb-8 text-center uppercase">Real vs Fake breakdown</p>

                <div className="w-full max-w-[280px] aspect-square relative mb-8">
                    <Pie data={pieData} options={pieOptions} />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Hidden center text if needed */}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                        <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Real</p>
                        <p className="text-xl font-serif font-bold text-green-500">{realPercentage}%</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                        <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Fake</p>
                        <p className="text-xl font-serif font-bold text-red-500">{fakePercentage}%</p>
                    </div>
                </div>
            </div>

            {/* Bar Chart Card */}
            <div className="lg:col-span-2 bg-dark-surface border border-white/10 p-8 md:p-10 rounded-[40px]">
                <div className="flex justify-between items-start mb-10">
                    <div>
                        <h3 className="text-2xl font-serif font-bold mb-1">Detection <span className="text-gold">Timeline</span></h3>
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-black">Daily trend analysis</p>
                    </div>
                    <div className="bg-gold/10 text-gold px-4 py-2 rounded-xl text-xs font-bold border border-gold/20">
                        Live Analytics
                    </div>
                </div>

                <div className="h-[320px] w-full">
                    <Bar data={barData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
