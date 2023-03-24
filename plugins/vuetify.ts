import { createVuetify } from "vuetify";
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((app) => {

	let preferedTheme = 'light';

	//if user prefers light mode switch to light mode
	if(window.matchMedia && window.matchMedia('(prefers-color-scheme)').media !== 'not all' && window.matchMedia('(prefers-color-scheme: dark)').matches) 
	{
		preferedTheme = 'dark';
	}

	const vuetify = createVuetify({
		ssr: false,
        components,
        directives,
		theme: {
			defaultTheme: preferedTheme,
			themes: {
				'dark': {
					dark: true,
					colors: 
					{
						background: '#212121'
					}
				}
			}
		}
	});

	app.vueApp.use(vuetify);
});