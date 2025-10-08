import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#C76BAF',
          secondary: '#5E4B8C',
          accent: '#49C5B6',
          info: '#6E9AE5',
          success: '#4CAF50',
          warning: '#FFB74D',
          error: '#E57373',
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})

export default vuetify
