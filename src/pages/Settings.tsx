import { useEffect, useState } from 'react';
import { Card, Form, InputNumber, Button, message, Spin } from 'antd';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { GoalsFormData } from '../types/health';
import '../styles/settings.scss';

export const Settings = () => {
  const [form] = Form.useForm();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadGoals();
    }
  }, [user]);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (data) {
        form.setFieldsValue({
          steps_goal: data.steps_goal,
          water_goal: data.water_goal,
          weight_goal: data.weight_goal,
          sleep_goal: data.sleep_goal,
        });
      } else {
        form.setFieldsValue({
          steps_goal: 10000,
          water_goal: 2.5,
          weight_goal: 70,
          sleep_goal: 8,
        });
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: GoalsFormData) => {
    try {
      setSaving(true);
      const { data: existing } = await supabase
        .from('user_goals')
        .select('id')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('user_goals')
          .update({ ...values, updated_at: new Date().toISOString() })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('user_goals')
          .insert([{ ...values, user_id: user!.id }]);
      }

      message.success('Goals updated successfully');
    } catch (error) {
      message.error('Failed to update goals');
      console.error('Error updating goals:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="settings">
      <Card title="Daily Health Goals" className="settings-card">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Daily Steps Goal"
            name="steps_goal"
            rules={[{ required: true, message: 'Please enter steps goal' }]}
          >
            <InputNumber
              min={0}
              size="large"
              style={{ width: '100%' }}
              placeholder="e.g., 10000"
            />
          </Form.Item>

          <Form.Item
            label="Daily Water Intake Goal (Liters)"
            name="water_goal"
            rules={[{ required: true, message: 'Please enter water goal' }]}
          >
            <InputNumber
              min={0}
              step={0.1}
              size="large"
              style={{ width: '100%' }}
              placeholder="e.g., 2.5"
            />
          </Form.Item>

          <Form.Item
            label="Target Weight (kg)"
            name="weight_goal"
            rules={[{ required: true, message: 'Please enter weight goal' }]}
          >
            <InputNumber
              min={0}
              step={0.1}
              size="large"
              style={{ width: '100%' }}
              placeholder="e.g., 70"
            />
          </Form.Item>

          <Form.Item
            label="Daily Sleep Goal (Hours)"
            name="sleep_goal"
            rules={[{ required: true, message: 'Please enter sleep goal' }]}
          >
            <InputNumber
              min={0}
              max={24}
              step={0.5}
              size="large"
              style={{ width: '100%' }}
              placeholder="e.g., 8"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block loading={saving}>
              Save Goals
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
