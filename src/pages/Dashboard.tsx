import { useEffect, useState } from "react";
import { Card, Row, Col, Progress, Button, Statistic, Spin, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { Footprints, Droplet, Scale, Moon } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { HealthMetric, UserGoals } from "../types/health";
import "../styles/dashboard.scss";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [todayData, setTodayData] = useState<HealthMetric | null>(null);
  const [goals, setGoals] = useState<UserGoals | null>(null);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];

      const { data: metricsData } = await supabase
        .from("health_metrics")
        .select("*")
        .eq("user_id", user!.id)
        .eq("date", today)
        .maybeSingle();
      const { data: goalsData } = await supabase
        .from("user_goals")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();

      setTodayData(metricsData);
      setGoals(goalsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercent = (value: number, goal: number) => {
    return Math.min((value / goal) * 100, 100);
  };

  const metrics = [
    {
      title: "Steps",
      value: todayData?.steps || 0,
      goal: goals?.steps_goal || 10000,
      icon: <Footprints size={24} />,
      color: "#52c41a",
      suffix: "steps",
    },
    {
      title: "Water Intake",
      value: todayData?.water_intake || 0,
      goal: goals?.water_goal || 2.5,
      icon: <Droplet size={24} />,
      color: "#1890ff",
      suffix: "L",
    },
    {
      title: "Weight",
      value: todayData?.weight || 0,
      goal: goals?.weight_goal || 70,
      icon: <Scale size={24} />,
      color: "#faad14",
      suffix: "kg",
    },
    {
      title: "Sleep",
      value: todayData?.sleep_hours || 0,
      goal: goals?.sleep_goal || 8,
      icon: <Moon size={24} />,
      color: "#722ed1",
      suffix: "hrs",
    },
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Health Dashboard</h1>
          <p>Track your daily health metrics</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => navigate("/add")}
        >
          Add Today's Data
        </Button>
      </div>

      {!todayData && (
        <Empty description="No data for today yet" className="empty-state">
          <Button type="primary" onClick={() => navigate("/add")}>
            Add Your First Entry
          </Button>
        </Empty>
      )}

      <Row gutter={[24, 24]}>
        {metrics.map((metric) => (
          <Col xs={24} sm={12} lg={6} key={metric.title}>
            <Card className="metric-card">
              <div className="metric-header">
                <div className="metric-icon" style={{ color: metric.color }}>
                  {metric.icon}
                </div>
                <span className="metric-title">{metric.title}</span>
              </div>
              <Statistic
                value={metric.value}
                suffix={metric.suffix}
                className="metric-value"
              />
              <div className="metric-goal">
                Goal: {metric.goal} {metric.suffix}
              </div>
              <Progress
                percent={getProgressPercent(metric.value, metric.goal)}
                strokeColor={metric.color}
                showInfo={false}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
