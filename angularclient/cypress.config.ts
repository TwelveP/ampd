import { defineConfig } from 'cypress'

export default defineConfig({
  defaultCommandTimeout: 5000,
  e2e: {
    'baseUrl': 'http://localhost:4200'
  },
  video: true,
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/results',
    overwrite: false,
    html: false,
    json: true,
  }
})