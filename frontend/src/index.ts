import router from './router';

const outlet = document.querySelector('body');

router.setOutlet(outlet);

console.log('ASDASD?');

router.setRoutes([
  {
    path: '/',
    component: 'index-root',
    action: async () => {
      await import('./views/app');
    }
  },
  {
    path: '/corridor/:raceId',
    component: 'corridor-view',

    action: async () => {
      await import('./views/corridor');
    }
  },
  {
    path: '/race/:raceId',
    component: 'race-view',
    action: async () => {
      await import('./views/race');
    }
  }
]);

export default router;
