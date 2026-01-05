// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'cards',
    path: 'cards',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'catalogue',
    path: 'catalogue',
    icon: getIcon('fluent-mdl2:product-catalog'),
  },
  {
    title: 'settings',
    path: 'settings',
    icon: getIcon('eva:settings-fill'),
  },
];

const adminNavConfig = [
  {
    title: 'users',
    path: '/admin/users',
    icon: getIcon('mdi:users'),
  },
  {
    title: 'cards',
    path: '/app/cards',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'catalogue',
    path: '/app/catalogue',
    icon: getIcon('fluent-mdl2:product-catalog'),
  },
  {
    title: 'settings',
    path: '/app/settings',
    icon: getIcon('eva:settings-fill'),
  },
];

export { navConfig, adminNavConfig };
