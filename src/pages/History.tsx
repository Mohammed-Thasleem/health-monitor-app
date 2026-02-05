import { useEffect, useState } from 'react';
import { Card, Table, DatePicker, Space, Spin } from 'antd';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import dayjs, { Dayjs } from 'dayjs';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { HealthMetric } from '../types/health';
import '../styles/history.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const { RangePicker } = DatePicker;

export const History = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<HealthMetric[]>([]);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(30, 'days'),
    dayjs(),
  ]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, dateRange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: metricsData } = await supabase
        .from('health_metrics')
        .select('*')
        .eq('user_id', user!.id)
        .gte('date', dateRange[0].format('YYYY-MM-DD'))
        .lte('date', dateRange[1].format('YYYY-MM-DD'))
        .order('date', { ascending: false });

      setData(metricsData || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Steps',
      dataIndex: 'steps',
      key: 'steps',
      render: (steps: number) => steps.toLocaleString(),
    },
    {
      title: 'Water (L)',
      dataIndex: 'water_intake',
      key: 'water_intake',
    },
    {
      title: 'Weight (kg)',
      dataIndex: 'weight',
      key: 'weight',
    },
    {
      title: 'Sleep (hrs)',
      dataIndex: 'sleep_hours',
      key: 'sleep_hours',
    },
  ];

  const chartData = {
    labels: data.map((item) => dayjs(item.date).format('MMM DD')).reverse(),
    datasets: [
      {
        label: 'Steps',
        data: data.map((item) => item.steps).reverse(),
        borderColor: '#52c41a',
        backgroundColor: 'rgba(82, 196, 26, 0.1)',
        yAxisID: 'y',
      },
      {
        label: 'Water (L)',
        data: data.map((item) => item.water_intake).reverse(),
        borderColor: '#1890ff',
        backgroundColor: 'rgba(24, 144, 255, 0.1)',
        yAxisID: 'y1',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Health Metrics Over Time',
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="history">
      <div className="history-header">
        <h1>Health History</h1>
        <Space>
          <RangePicker
            value={dateRange}
            onChange={(dates) => dates && setDateRange(dates as [Dayjs, Dayjs])}
            size="large"
          />
        </Space>
      </div>

      <Card className="chart-card">
        <div className="chart-container">
          <Line data={chartData} options={chartOptions} />
        </div>
      </Card>

      <Card className="table-card" title="Data Table">
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};
