import { setProjectAnnotations } from '@storybook/react-native-web-vite';
import * as a11yAddonAnnotations from '@storybook/addon-a11y/preview';

import * as projectAnnotations from './preview';

setProjectAnnotations([projectAnnotations, a11yAddonAnnotations]);
