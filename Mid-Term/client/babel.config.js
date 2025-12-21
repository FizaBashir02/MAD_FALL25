// babel.config.js
export default function babel (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // You can remove import.meta plugins if you downgraded React Router
    plugins: []
  };
}
