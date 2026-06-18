import { createBrowserRouter } from 'react-router-dom';
import { Home } from './home';
import { Explore } from './explore';
import { PropertyDetails } from './property-details';
import { AgentLanding } from './agent';
import { ProfessionalLanding } from './professional';
import { OwnersLanding } from './owners';
import { FindProfessionals } from './find-professionals';
import { Onboarding } from './onboarding';
import { AgentOnboarding } from './agent-onboarding';
import { OwnerOnboarding } from './owner-onboarding';
import { ProfessionalOnboarding } from './professional-onboarding';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Home,
  },
  {
    path: '/explore',
    Component: Explore,
  },
  {
    path: '/find-professionals',
    Component: FindProfessionals,
  },
  {
    path: '/property/:id',
    Component: PropertyDetails,
  },
  {
    path: '/for-agents',
    Component: AgentLanding,
  },
  {
    path: '/professional',
    Component: ProfessionalLanding,
  },
  {
    path: '/owners',
    Component: OwnersLanding,
  },
  {
    path: '/onboarding',
    Component: Onboarding,
  },
  {
    path: '/agent-onboarding',
    Component: AgentOnboarding,
  },
  {
    path: '/owner-onboarding',
    Component: OwnerOnboarding,
  },
  {
    path: '/professional-onboarding',
    Component: ProfessionalOnboarding,
  },
  {
    path: '*',
    Component: Home,
  },
]);