import router from './router';

const outlet = document.querySelector('#root');

router.setOutlet(outlet);

router.setRoutes([
  {
    path: '/',
    component: 'index-root',
    action: async () => {
      await import('./app');
    }
  },
  {
    path: '/corridor/:raceId',
    component: 'corridor-view',

    action: async () => {
      await import('./corridor');
    }
  },
  {
    path: '/race/:raceId',
    component: 'race-view',
    action: async () => {
      await import('./race');
    }
  }
]);

export default router;
