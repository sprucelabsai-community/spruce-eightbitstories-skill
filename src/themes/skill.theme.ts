import { SpruceSchemas } from '@sprucelabs/spruce-core-schemas'
import '#spruce/schemas/schemas.types'

const gradient = 'linear-gradient(to top left, #954b63, #364268)'
// The Theme Skill (https://theme.spruce.bot/) is available to help you build your theme!

const theme: SpruceSchemas.HeartwoodViewControllers.v2021_02_11.ThemeProps = {
	color1: '#ffffff',
	color1Inverse: '#954b63',
	color1InverseGradient: gradient,
	color2: '#fff',
	color2Transparent: 'rgba(200, 200, 200, 0.9)',
	color2Inverse: '#2a2829',
	color2InverseTransparent: 'rgba(16, 15, 15, 0.9)',
	color3: '#fff',
	color3Compliment: '#a7a7a7',
	color3Inverse: '#2a2829',
	color4: '#ffffff',
	color4Compliment: 'rgba(15,76,138,0.1)',
	color4ComplimentTransparent: 'rgba(0,0,0,0.1)',
	color4Inverse: '#364268',
	color4InverseCompliment: '#5f6c9a',
	controlBarColor1: 'white',
	controlBarColor2: 'linear-gradient(to top, #1e2743, #364268)',
	toolBeltColor2: '#2a2829',
	errorColor1: '#fff',
	errorColor1Inverse: '#ec0758',
	warningColor1: '#ffffff',
	warningColor1Inverse: '#af9830',
	calendarEvents: {
		draftForegroundColor: '#fafafa',
		draftBackgroundColor: '#798fb9',
		tentativeForegroundColor: '#757575',
		tentativeBackgroundColor: '#97a5d3',
		upcomingForegroundColor: '#fafafa',
		upcomingBackgroundColor: '#4296f5',
		unavailableForegroundColor: '#757575',
		unavailableBackgroundColor: '#a3a3a3',
		blockedForegroundColor: '#fafafa',
		blockedBackgroundColor: '#383f4d',
		activeForegroundColor: '#3c3b3b',
		activeBackgroundColor: '#20d994',
		pastForegroundColor: '#fafafa',
		pastBackgroundColor: '#525252',
		warnForegroundColor: '#757575',
		warnBackgroundColor: '#f5d142',
		criticalForegroundColor: '#fafafa',
		criticalBackgroundColor: '#f54242',
	},
}

export default theme
