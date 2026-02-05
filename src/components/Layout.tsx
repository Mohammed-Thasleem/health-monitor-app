import { Layout as AntLayout, Menu, Button } from "antd";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Plus,
  History,
  Settings,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "../styles/layout.scss";

const { Header, Content, Sider } = AntLayout;

export const Layout = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const menuItems = [
    {
      key: "/",
      icon: <LayoutDashboard size={18} />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: "/add",
      icon: <Plus size={18} />,
      label: <Link to="/add">Add Data</Link>,
    },
    {
      key: "/history",
      icon: <History size={18} />,
      label: <Link to="/history">History</Link>,
    },
    {
      key: "/settings",
      icon: <Settings size={18} />,
      label: <Link to="/settings">Goals</Link>,
    },
  ];

  return (
    <AntLayout className="app-layout">
      <Sider breakpoint="lg" collapsedWidth="0" className="app-sider">
        <div className="logo">
          <span>Healthify</span>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className="app-menu"
        />
      </Sider>
      <AntLayout>
        <Header className="app-header">
          <div className="header-actions">
            <Button
              type="text"
              icon={isDark ? <Sun size={18} /> : <Moon size={18} />}
              onClick={toggleTheme}
              className="theme-toggle"
            />
            <Button
              type="text"
              icon={<LogOut size={18} />}
              onClick={signOut}
              danger
            >
              Logout
            </Button>
          </div>
        </Header>
        <Content className="app-content">
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};
