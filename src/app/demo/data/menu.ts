import { Navigation } from 'src/app/@theme/types/navigation';

export const menus: Navigation[] = [
  {
    id: 'navigation',
    title: 'Users',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'Dashboard',
        title: 'Users List',
        type: 'item',
        classes: 'nav-item',
        url: '/admin',
        icon: '#custom-status-up'
      }
    ]
  },
  {
    id: 'auth',
    title: 'Users Details',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'Login',
        title: 'Contracts',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/contracts',
        icon: '#custom-shield',
        //target: true,
        breadcrumbs: false
      },
      {
        id: 'register',
        title: 'Incidents',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/incidents',
        icon: '#custom-password-check',
        //target: true,
        breadcrumbs: false
      },
      {
        id: 'register',
        title: 'Claims',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/claims',
        icon: '#custom-password-check',
        //target: true,
        breadcrumbs: false
      },
      {
        id: 'register',
        title: 'Assessements',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/assessments',
        icon: '#custom-password-check',
        //target: true,
        breadcrumbs: false
      },
      {
        id: 'register',
        title: 'Properties',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/properties',
        icon: '#custom-password-check',
        //target: true,
        breadcrumbs: false
      },
      
      {
        id: 'training',
        title: 'training',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/training-gallery',
        icon: '#custom-password-check',
        //target: true,
        breadcrumbs: false
      },
      {
        id: 'register',
        title: 'Transactions',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/transactions',
        icon: '#custom-password-check',
        //target: true,
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'ui-component',
    title: 'News',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'typography',
        title: 'Blogs',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/blogs',
        icon: '#custom-text-block'
      },
      {
        id: 'table',
        title: 'Blog Statistics',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/articles',
        icon: '#custom-mouse-circle',
        //target: true,
      }
    ]
  },
  {
    id: 'other',
    title: 'jobs',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'menu-levels',
        title: 'active job offers',
        type: 'collapse',
        icon: '#custom-level',
        children: [
          {
            id: 'level-2-1',
            title: 'dev',
            type: 'item',
            url: 'javascript:'
          },
          {
            id: 'menu-level-2.2',
            title: 'design',
            type: 'collapse',
            classes: 'edge',
            children: [
              {
                id: 'menu-level-3.1',
                title: 'Menu Level 3.1',
                type: 'item',
                url: 'javascript:'
              },
              {
                id: 'menu-level-3.2',
                title: 'Menu Level 3.2',
                type: 'item',
                url: 'javascript:'
              },
              {
                id: 'menu-level-3.3',
                title: 'Menu Level 3.3',
                type: 'collapse',
                classes: 'edge',
                children: [
                  {
                    id: 'menu-level-4.1',
                    title: 'Menu Level 4.1',
                    type: 'item',
                    url: 'javascript:'
                  },
                  {
                    id: 'menu-level-4.2',
                    title: 'Menu Level 4.2',
                    type: 'item',
                    url: 'javascript:'
                  }
                ]
              }
            ]
          },
          {
            id: 'menu-level-2.3',
            title: 'securite',
            type: 'collapse',
            classes: 'edge',
            children: [
              {
                id: 'menu-level-3.1',
                title: 'Menu Level 3.1',
                type: 'item',
                url: 'javascript:'
              },
              {
                id: 'menu-level-3.2',
                title: 'Menu Level 3.2',
                type: 'item',
                url: 'javascript:'
              },
              {
                id: 'menu-level-3.3',
                title: 'Menu Level 3.3',
                type: 'collapse',
                classes: 'edge',
                children: [
                  {
                    id: 'menu-level-4.1',
                    title: 'Menu Level 4.1',
                    type: 'item',
                    url: 'javascript:'
                  },
                  {
                    id: 'menu-level-4.2',
                    title: 'Menu Level 4.2',
                    type: 'item',
                    url: 'javascript:'
                  }
                ]
              }
            ]
          }
        ]
      },
    ]
  },
  {
    id: 'navigation',
    title: 'Services',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'Dashboard',
        title: 'Health clients',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/products',
        icon: '#custom-status-up'
      },
      {
        id: 'Dashboard',
        title: 'FeedBack',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/app-feedback-admin',
        icon: '#custom-status-up'
      },
      {
        id: 'Dashboard',
        title: 'Statistics',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/app-statistics', // Route to the app-statistics component
        icon: '#custom-chart-bar', // Use an appropriate icon
        breadcrumbs: false
      },
      {
        id: 'Dashboard',
        title: 'real estate',
        type: 'item',
        classes: 'nav-item',
        url: 'app-products',
        icon: '#custom-status-up'
      }
    ]
  },
];
