import { useEffect, useState } from 'react';
import { Card, Form, InputNumber, DatePicker, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { HealthFormData } from '../types/health';
import '../styles/add-data.scss';

export const AddData = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTodayData();
  }, []);

  const loadTodayData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('health_metrics')
        .select('*')
        .eq('user_id', user!.id)
        .eq('date', today)
        .maybeSingle();

      if (data) {
        form.setFieldsValue({
          date: dayjs(data.date),
          steps: data.steps,
          water_intake: data.water_intake,
          weight: data.weight,
          sleep_hours: data.sleep_hours,
        });
      } else {
        form.setFieldsValue({
          date: dayjs(),
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const formData: HealthFormData = {
        date: values.date.format('YYYY-MM-DD'),
        steps: values.steps || 0,
        water_intake: values.water_intake || 0,
        weight: values.weight || 0,
        sleep_hours: values.sleep_hours || 0,
      };

      const { data: existing } = await supabase
        .from('health_metrics')
        .select('id')
        .eq('user_id', user!.id)
        .eq('date', formData.date)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('health_metrics')
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq('id', existing.id);
        message.success('Health data updated successfully');
      } else {
        await supabase
          .from('health_metrics')
          .insert([{ ...formData, user_id: user!.id }]);
        message.success('Health data added successfully');
      }

      navigate('/');
    } catch (error) {
      message.error('Failed to save data');
      console.error('Error saving data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-data">
      <Card title="Add / Update Health Data" className="add-data-card">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            date: dayjs(),
          }}
        >
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: 'Please select a date' }]}
          >
            <DatePicker size="large" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Steps"
            name="steps"
            rules={[{ required: true, message: 'Please enter steps' }]}
          >
            <InputNumber
              min={0}
              size="large"
              style={{ width: '100%' }}
              placeholder="Enter number of steps"
            />
          </Form.Item>

          <Form.Item
            label="Water Intake (Liters)"
            name="water_intake"
            rules={[{ required: true, message: 'Please enter water intake' }]}
          >
            <InputNumber
              min={0}
              step={0.1}
              size="large"
              style={{ width: '100%' }}
              placeholder="Enter water intake in liters"
            />
          </Form.Item>

          <Form.Item
            label="Weight (kg)"
            name="weight"
            rules={[{ required: true, message: 'Please enter weight' }]}
          >
            <InputNumber
              min={0}
              step={0.1}
              size="large"
              style={{ width: '100%' }}
              placeholder="Enter weight in kg"
            />
          </Form.Item>

          <Form.Item
            label="Sleep Hours"
            name="sleep_hours"
            rules={[{ required: true, message: 'Please enter sleep hours' }]}
          >
            <InputNumber
              min={0}
              max={24}
              step={0.5}
              size="large"
              style={{ width: '100%' }}
              placeholder="Enter hours of sleep"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={loading}>
              Save Health Data
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
