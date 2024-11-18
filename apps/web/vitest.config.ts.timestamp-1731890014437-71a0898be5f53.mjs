// apps/web/vitest.config.ts
import { nxCopyAssetsPlugin } from 'file:///Users/naimul/Projects/progHours/node_modules/@nx/vite/plugins/nx-copy-assets.plugin.js';
import { nxViteTsPaths } from 'file:///Users/naimul/Projects/progHours/node_modules/@nx/vite/plugins/nx-tsconfig-paths.plugin.js';
import react from 'file:///Users/naimul/Projects/progHours/node_modules/@vitejs/plugin-react/dist/index.mjs';
import { defineConfig } from 'file:///Users/naimul/Projects/progHours/node_modules/vite/dist/node/index.js';

var __vite_injected_original_dirname =
  '/Users/naimul/Projects/progHours/apps/web';
var vitest_config_default = defineConfig({
  root: __vite_injected_original_dirname,
  cacheDir: '../../node_modules/.vite/apps/web',
  plugins: [react(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  test: {
    setupFiles: ['test-setup.ts'],
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['./tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: '../../coverage/apps/web',
      provider: 'v8',
    },
  },
});
export { vitest_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiYXBwcy93ZWIvdml0ZXN0LmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9uYWltdWwvUHJvamVjdHMvcHJvZ0hvdXJzL2FwcHMvd2ViXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbmFpbXVsL1Byb2plY3RzL3Byb2dIb3Vycy9hcHBzL3dlYi92aXRlc3QuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9uYWltdWwvUHJvamVjdHMvcHJvZ0hvdXJzL2FwcHMvd2ViL3ZpdGVzdC5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz0ndml0ZXN0JyAvPlxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHsgbnhWaXRlVHNQYXRocyB9IGZyb20gJ0BueC92aXRlL3BsdWdpbnMvbngtdHNjb25maWctcGF0aHMucGx1Z2luJztcbmltcG9ydCB7IG54Q29weUFzc2V0c1BsdWdpbiB9IGZyb20gJ0BueC92aXRlL3BsdWdpbnMvbngtY29weS1hc3NldHMucGx1Z2luJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcm9vdDogX19kaXJuYW1lLFxuICBjYWNoZURpcjogJy4uLy4uL25vZGVfbW9kdWxlcy8udml0ZS9hcHBzL3dlYicsXG4gIHBsdWdpbnM6IFtyZWFjdCgpLCBueFZpdGVUc1BhdGhzKCksIG54Q29weUFzc2V0c1BsdWdpbihbJyoubWQnXSldLFxuICAvLyBVbmNvbW1lbnQgdGhpcyBpZiB5b3UgYXJlIHVzaW5nIHdvcmtlcnMuXG4gIC8vIHdvcmtlcjoge1xuICAvLyAgcGx1Z2luczogWyBueFZpdGVUc1BhdGhzKCkgXSxcbiAgLy8gfSxcbiAgdGVzdDoge1xuICAgIHNldHVwRmlsZXM6IFsndGVzdC1zZXR1cC50cyddLFxuICAgIHdhdGNoOiBmYWxzZSxcbiAgICBnbG9iYWxzOiB0cnVlLFxuICAgIGVudmlyb25tZW50OiAnanNkb20nLFxuICAgIGluY2x1ZGU6IFsnLi90ZXN0cy8qKi8qLnt0ZXN0LHNwZWN9LntqcyxtanMsY2pzLHRzLG10cyxjdHMsanN4LHRzeH0nXSxcbiAgICByZXBvcnRlcnM6IFsnZGVmYXVsdCddLFxuICAgIGNvdmVyYWdlOiB7XG4gICAgICByZXBvcnRzRGlyZWN0b3J5OiAnLi4vLi4vY292ZXJhZ2UvYXBwcy93ZWInLFxuICAgICAgcHJvdmlkZXI6ICd2OCcsXG4gICAgfSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUNsQixTQUFTLHFCQUFxQjtBQUM5QixTQUFTLDBCQUEwQjtBQUpuQyxJQUFNLG1DQUFtQztBQU16QyxJQUFPLHdCQUFRLGFBQWE7QUFBQSxFQUMxQixNQUFNO0FBQUEsRUFDTixVQUFVO0FBQUEsRUFDVixTQUFTLENBQUMsTUFBTSxHQUFHLGNBQWMsR0FBRyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsRUFLaEUsTUFBTTtBQUFBLElBQ0osWUFBWSxDQUFDLGVBQWU7QUFBQSxJQUM1QixPQUFPO0FBQUEsSUFDUCxTQUFTO0FBQUEsSUFDVCxhQUFhO0FBQUEsSUFDYixTQUFTLENBQUMsMERBQTBEO0FBQUEsSUFDcEUsV0FBVyxDQUFDLFNBQVM7QUFBQSxJQUNyQixVQUFVO0FBQUEsTUFDUixrQkFBa0I7QUFBQSxNQUNsQixVQUFVO0FBQUEsSUFDWjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
