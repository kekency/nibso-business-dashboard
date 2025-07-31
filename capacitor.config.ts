import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nibso.dashboard',
  appName: 'Nibso Dashboard',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    Camera: {
      // Ask for camera permission
      permissions: ["camera"]
    }
  }
};

export default config;
