
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hostelmate.app',
  appName: 'HostelMate',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'ionic'
  },
  ios: {
    contentInset: 'always'
  },
  plugins: {
    // Configuration for plugins can go here
  }
};

export default config;
